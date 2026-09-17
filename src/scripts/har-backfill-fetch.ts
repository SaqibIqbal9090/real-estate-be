/**
 * HAR bulk backfill — Stage 1: fetch.
 *
 * Pages through the Bridge Interactive OData feed and appends raw listings to
 * JSONL files, one file per MLS status slice. No database is involved, so this
 * can run anywhere with network access to the API (the dedicated import EC2
 * worker, or locally for testing) with zero load on the backend or RDS.
 *
 * Resumable: each slice keeps a checkpoint (last ListingKey) in
 * <dir>/state/<slice>.json. Re-running skips completed slices and resumes
 * partial ones.
 *
 * Environment:
 *   HAR_API_URL                required — full OData URL incl. access_token
 *   HAR_BACKFILL_DIR           output dir (default ./har-backfill-data)
 *   HAR_BACKFILL_STATUSES      comma-separated MlsStatus values (default: all 7 licensed)
 *   HAR_BACKFILL_BASE_FILTER   extra OData filter (default: (PropertyType eq 'Residential'))
 *   HAR_BACKFILL_PAGE_SIZE     $top per request (default 200 — Bridge max)
 *   HAR_BACKFILL_DELAY_MS      delay between pages (default 300)
 *   MAX_PAGES                  optional cap per slice, for local testing
 *
 * Usage:  npm run har:backfill:fetch
 */
import axios from 'axios';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const API_URL = process.env.HAR_API_URL || '';
const OUT_DIR = path.resolve(process.env.HAR_BACKFILL_DIR || './har-backfill-data');
const STATE_DIR = path.join(OUT_DIR, 'state');
const PAGE_SIZE = parseInt(process.env.HAR_BACKFILL_PAGE_SIZE || '200', 10);
const DELAY_MS = parseInt(process.env.HAR_BACKFILL_DELAY_MS || '300', 10);
const MAX_PAGES = process.env.MAX_PAGES ? parseInt(process.env.MAX_PAGES, 10) : undefined;
const BASE_FILTER = process.env.HAR_BACKFILL_BASE_FILTER || "(PropertyType eq 'Residential')";
const STATUSES = (
  process.env.HAR_BACKFILL_STATUSES ||
  'Active,Option Pending,Pending Continuing to Show,Pending,Sold,Expired,Terminated'
)
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

interface SliceState {
  status: string;
  lastListingKey: string | null;
  fetched: number;
  done: boolean;
  updatedAt: string;
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-');

function readState(status: string): SliceState {
  const p = path.join(STATE_DIR, `${slug(status)}.json`);
  if (fs.existsSync(p)) {
    try {
      return JSON.parse(fs.readFileSync(p, 'utf8'));
    } catch {
      /* corrupted state -> start over for this slice */
    }
  }
  return { status, lastListingKey: null, fetched: 0, done: false, updatedAt: '' };
}

function writeState(state: SliceState): void {
  state.updatedAt = new Date().toISOString();
  fs.writeFileSync(path.join(STATE_DIR, `${slug(state.status)}.json`), JSON.stringify(state, null, 2));
}

function buildUrl(status: string, lastKey: string | null): string {
  const urlObj = new URL(API_URL);
  const accessToken = urlObj.searchParams.get('access_token') || '';
  const baseUrl = `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;

  let filter = `${BASE_FILTER} and (MlsStatus eq '${status.replace(/'/g, "''")}')`;
  if (lastKey) filter += ` and (ListingKey gt '${lastKey}')`;

  return (
    `${baseUrl}?access_token=${accessToken}` +
    `&$filter=${encodeURIComponent(filter)}` +
    `&$top=${PAGE_SIZE}&$orderby=ListingKey`
  );
}

async function fetchPage(url: string, attempt = 1): Promise<any[]> {
  try {
    const res = await axios.get(url, { timeout: 60000 });
    if (!res.data?.value || !Array.isArray(res.data.value)) {
      throw new Error('invalid OData response: missing value array');
    }
    return res.data.value;
  } catch (err: any) {
    if (attempt >= 4) throw err;
    const backoff = attempt * 5000;
    console.warn(`  ⚠️  Fetch failed (attempt ${attempt}): ${err.message}. Retrying in ${backoff}ms...`);
    await new Promise((r) => setTimeout(r, backoff));
    return fetchPage(url, attempt + 1);
  }
}

async function fetchSlice(status: string): Promise<void> {
  const state = readState(status);
  if (state.done) {
    console.log(`⏭️  [${status}] already complete (${state.fetched} listings) — skipping`);
    return;
  }

  const outPath = path.join(OUT_DIR, `${slug(status)}.jsonl`);
  console.log(
    `\n📥 [${status}] fetching${state.lastListingKey ? ` (resuming after key ${state.lastListingKey})` : ''} → ${outPath}`,
  );

  let pages = 0;
  while (true) {
    const listings = await fetchPage(buildUrl(status, state.lastListingKey));
    if (listings.length === 0) {
      state.done = true;
      writeState(state);
      console.log(`✅ [${status}] complete — ${state.fetched} listings total`);
      break;
    }

    const lines = listings.map((l) => JSON.stringify(l)).join('\n') + '\n';
    fs.appendFileSync(outPath, lines);

    state.fetched += listings.length;
    state.lastListingKey = listings[listings.length - 1].ListingKey;
    writeState(state);
    pages++;

    process.stdout.write(`  📦 [${status}] page ${pages}: +${listings.length} (total ${state.fetched})\r\n`);

    if (MAX_PAGES && pages >= MAX_PAGES) {
      console.log(`⏹️  [${status}] MAX_PAGES=${MAX_PAGES} reached — resume later to continue`);
      break;
    }
    await new Promise((r) => setTimeout(r, DELAY_MS));
  }
}

async function main() {
  if (!API_URL.includes('access_token=')) {
    throw new Error('HAR_API_URL must include an access_token query parameter');
  }
  fs.mkdirSync(STATE_DIR, { recursive: true });

  console.log('🚀 HAR bulk backfill — fetch stage');
  console.log(`   Output: ${OUT_DIR}`);
  console.log(`   Slices: ${STATUSES.join(' | ')}`);
  console.log(`   Base filter: ${BASE_FILTER}`);
  console.log(`   Page size: ${PAGE_SIZE}, delay: ${DELAY_MS}ms\n`);

  for (const status of STATUSES) {
    await fetchSlice(status);
  }

  console.log('\n✨ Fetch stage finished. Next: npm run har:backfill:load');
}

main().catch((err) => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
