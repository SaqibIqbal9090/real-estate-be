/**
 * Canonical property categories.
 *
 * HAR returns human-readable strings ("Single Family Residence") and often
 * comma-joined composites ("Apartment,Rental,Multi Family"), while the UI
 * filters on stable codes. Matching those at query time meant scanning and
 * JSON-parsing every row (~5s per filtered count) and, because the
 * vocabularies never overlapped, returning nothing at all.
 *
 * Instead each listing is reduced once at import to a single canonical
 * category stored in an indexed column, so filtering is a plain equality.
 */
export const PROPERTY_CATEGORIES = [
  'single_family',
  'condo',
  'townhouse',
  'apartment',
  'multi_family',
  'land',
  'manufactured',
  'other',
] as const;

export type PropertyCategory = (typeof PROPERTY_CATEGORIES)[number];

/**
 * Terms that describe tenure or an umbrella grouping rather than the kind of
 * dwelling. "Townhouse/Condo" in particular is HAR's parent grouping and
 * appears on both townhouses and condos — leaving it in would make every
 * "Townhouse/Condo,Condominium" listing (~5,900) look like a townhouse.
 */
const NON_DECIDING_TERMS = new Set([
  'residential',
  'residential lease',
  'residential income',
  'rental',
  'townhouse/condo',
  'lease',
  'for sale',
]);

/**
 * Ordered most-specific first: "Manufactured Home,Rental,Single Family
 * Residence" is manufactured rather than single family, and an apartment in a
 * multi-family building is an apartment.
 */
const CATEGORY_MATCHERS: { category: PropertyCategory; patterns: string[] }[] = [
  { category: 'manufactured', patterns: ['manufactured home', 'mobile home'] },
  // "Homes and/or Acreage" is a house on land, not raw land, so it belongs
  // with single family below — only lot/land listings are land.
  { category: 'land', patterns: ['lot/land', 'vacant land', 'land'] },
  { category: 'apartment', patterns: ['apartment', 'efficiency'] },
  { category: 'townhouse', patterns: ['townhouse'] },
  { category: 'condo', patterns: ['condominium', 'condo'] },
  {
    category: 'multi_family',
    patterns: ['multi family', 'multi-family', 'duplex', 'triplex', 'quadruplex', 'fourplex'],
  },
  {
    category: 'single_family',
    patterns: ['single family', 'free standing', 'patio home', 'homes and/or acreage', 'historic'],
  },
];

/**
 * Reduces the raw propertyType values for a listing to one canonical category.
 * Accepts the stored array (entries may themselves be comma-joined).
 */
export function derivePropertyCategory(
  propertyTypes: string[] | null | undefined,
): PropertyCategory {
  if (!propertyTypes || propertyTypes.length === 0) return 'other';

  // Split composites ("Apartment,Rental,Multi Family") into individual terms.
  const terms = propertyTypes
    .flatMap((value) => String(value ?? '').split(','))
    .map((value) => value.trim().toLowerCase())
    .filter((value) => value.length > 0 && !NON_DECIDING_TERMS.has(value));

  if (terms.length === 0) return 'other';

  for (const { category, patterns } of CATEGORY_MATCHERS) {
    if (terms.some((term) => patterns.some((pattern) => term.includes(pattern)))) {
      return category;
    }
  }

  return 'other';
}

/**
 * Legacy UI codes that predate the canonical categories. Old links, saved
 * searches and the SEO landing routes still use these, so incoming filter
 * values are translated rather than rejected.
 */
const LEGACY_CODE_MAP: Record<string, PropertyCategory> = {
  singlefamilydetached: 'single_family',
  singlefamilyattached: 'single_family',
  singlefamilyrental: 'single_family',
  singlefamily: 'single_family',
  condo: 'condo',
  condominium: 'condo',
  townhouse: 'townhouse',
  apartmentcomplex: 'apartment',
  apartment: 'apartment',
  duplex: 'multi_family',
  triplex: 'multi_family',
  fourplex: 'multi_family',
  quadruplex: 'multi_family',
  multifamily: 'multi_family',
  residentialland: 'land',
  commercialland: 'land',
  agriculturalland: 'land',
  land: 'land',
  manufactured: 'manufactured',
  manufacturedhome: 'manufactured',
  mobilehome: 'manufactured',
};

/**
 * Accepts a canonical category, a legacy UI code, or a raw HAR string and
 * returns the canonical category, or null when nothing sensible matches
 * (so an unknown filter value yields no rows rather than silently ignoring
 * the filter and returning everything).
 */
export function normalizePropertyCategory(value: string): PropertyCategory | null {
  const raw = String(value ?? '').trim();
  if (!raw) return null;

  const canonical = raw.toLowerCase().replace(/[\s-]+/g, '_');
  if ((PROPERTY_CATEGORIES as readonly string[]).includes(canonical)) {
    return canonical as PropertyCategory;
  }

  const legacy = LEGACY_CODE_MAP[raw.toLowerCase().replace(/[\s_-]+/g, '')];
  if (legacy) return legacy;

  // Fall back to the same matching used at import, so raw MLS strings work.
  const derived = derivePropertyCategory([raw]);
  return derived === 'other' ? null : derived;
}
