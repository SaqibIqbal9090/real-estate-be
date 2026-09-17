# HAR Bulk Backfill — Runbook

Fast initial replication of the full licensed HAR/HRIS dataset (Active + Off-Market VOW tier) into the production database, with **zero load on the backend app, its EC2 instance, or RDS beyond one controlled load window**.

## Architecture

```
Bridge OData API ──(Stage 1: fetch)──► JSONL files on disk ──(Stage 2: load)──► RDS
                    dedicated import                            bulk batches,
                    EC2 worker (or local)                       throttled
```

- **Stage 1** (`npm run har:backfill:fetch`) walks the feed per MLS-status slice and writes raw listings to `har-backfill-data/<status>.jsonl`. No DB involved. Resumable per slice via checkpoints in `har-backfill-data/state/`.
- **Stage 2** (`npm run har:backfill:load`) reads the JSONL files and loads in bulk batches (default 500 rows/INSERT, throttled). Inserts new listings; for listings already in the DB it **reconciles `status`/`mlsStatus`** — this also repairs any Sold/Expired listings the older importer stored as `published`.

## Display compliance (why status mapping matters)

Per the HRIS agreement (§5a + VOW rules):

- Publicly visible (`status = 'published'`): **Active, Option Pending, Pending Continuing to Show, Pending**
- Stored but never public (`status = 'off_market'`): **Sold, Expired, Terminated** — these may only be shown later behind a login (VOW feature, Marketplace 2.0)
- The raw feed status is kept in `properties.mlsStatus`.

Public queries filter `status = 'published'`, so off-market rows are invisible everywhere automatically.

## One-time prerequisites

1. Run the migration (adds `mlsStatus` column + `off_market` enum value):
   ```bash
   DB_SSL=true npm run db:migrate        # NODE_ENV per environment
   ```
2. Deploy the updated code (importer now maps status) and restart the app.
3. HRIS IP authentication: the worker's IP must be registered with HRIS (Technical Contact form — Primary/Secondary IP). Use an Elastic IP on the worker.

## Import worker (dedicated EC2)

- t3.small (or t3.micro) in the **same VPC** as RDS; security group allowed into the RDS SG on 5432. Attach the HRIS-registered Elastic IP.
- Setup:
  ```bash
  sudo dnf install -y git nodejs
  git clone <repo> && cd real-estate-be && npm ci
  ```
- `.env` on the worker needs: `HAR_API_URL`, `HAR_IMPORT_USER_ID`, `DB_HOST` (RDS endpoint), `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`, `DB_SSL=true`.

## Running

```bash
# Stage 1 — fetch everything (hours; resumable; re-run to resume)
npm run har:backfill:fetch

# Stage 2 — load into RDS (run off-peak; resumable)
npm run har:backfill:load
```

Local smoke test (small): `MAX_PAGES=2 npm run har:backfill:fetch` then load against the local DB.

### Tuning (env vars)

| Var | Default | Meaning |
|---|---|---|
| `HAR_BACKFILL_DIR` | `./har-backfill-data` | data + checkpoints location |
| `HAR_BACKFILL_STATUSES` | all 7 licensed statuses | comma-separated `MlsStatus` slices |
| `HAR_BACKFILL_BASE_FILTER` | `(PropertyType eq 'Residential')` | extra OData filter |
| `HAR_BACKFILL_PAGE_SIZE` | `200` | Bridge page cap |
| `HAR_BACKFILL_DELAY_MS` | `300` | politeness delay between pages |
| `MAX_PAGES` | — | per-slice cap for testing |
| `HAR_LOAD_BATCH_SIZE` | `500` | rows per bulk INSERT |
| `HAR_LOAD_DELAY_MS` | `200` | delay between batches |

## During / after the backfill

- **Pause the 2-hourly cron** on the app server during the load (`RUN_HAR_CRON=false` + restart) to avoid the two writers racing; re-enable after.
- After the backfill, keep the periodic cron for incremental updates. Recommended cron filter so it only picks up changes:
  `HAR_IMPORT_FILTER=(PropertyType eq 'Residential') and (ModificationTimestamp gt <ISO date of backfill>)`
- Verify counts:
  ```sql
  SELECT status, "mlsStatus", COUNT(*) FROM properties GROUP BY 1, 2 ORDER BY 3 DESC;
  ```
  Sold/Expired/Terminated rows must all be `off_market`.
- Photos are **URLs only** (served from Bridge's CDN while licensed) — no media download in the backfill.

## License notes

- MLS data is licensed, not owned: no redistribution, no AI training, and on license termination all copies (including the JSONL files) must be deleted (§17).
- Every page displaying MLS data must carry: `Data provided by HAR.com © Copyright <year> "All information provided should be independently verified."`
- Delete `har-backfill-data/` from the worker once the load is verified; terminate or stop the worker instance.
