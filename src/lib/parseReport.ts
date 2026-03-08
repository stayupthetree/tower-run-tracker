import type { Run } from '../types/Run';

/** Multipliers for shorthand number suffixes from the game. q/s are case-sensitive (quintillion/sextillion). */
const SUFFIX: Record<string, number> = {
  K: 1e3,
  k: 1e3,
  M: 1e6,
  m: 1e6,
  B: 1e9,
  b: 1e9,
  T: 1e12,
  t: 1e12,
  Q: 1e15,
  q: 1e18,
  s: 1e21,
  S: 1e21,
};

/**
 * Normalize a report key for lookup: lowercase, trim, collapse non-alphanumeric to single space.
 */
function normalizeKey(key: string): string {
  return key
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Map from normalized report key to Run field name.
 * Covers all fields that can appear in the Battle Report.
 */
const KEY_TO_FIELD: Record<string, keyof Run> = {
  'battle date': 'battleDate',
  'game time': 'gameTimeSec',
  'real time': 'realTimeSec',
  tier: 'tier',
  wave: 'wave',
  'killed by': 'killedBy',
  'coins earned': 'coinsEarned',
  'coins per hour': 'coinsPerHour',
  'cash earned': 'cashEarned',
  'interest earned': 'interestEarned',
  'gem blocks tapped': 'gemBlocksTapped',
  'cells earned': 'cellsEarned',
  'reroll shards earned': 'rerollShardsEarned',
  'damage dealt': 'damageDealt',
  'damage taken': 'damageTaken',
  'damage taken wall': 'damageTakenWall',
  'damage taken while berserked': 'damageTakenWhileBerserked',
  'damage gain from berserk': 'damageGainFromBerserk',
  'death defy': 'deathDefy',
  lifesteal: 'lifesteal',
  'projectiles damage': 'projectilesDamage',
  'projectiles count': 'projectilesCount',
  'thorn damage': 'thornDamage',
  'orb damage': 'orbDamage',
  'enemies hit by orbs': 'enemiesHitByOrbs',
  'land mine damage': 'landMineDamage',
  'land mines spawned': 'landMinesSpawned',
  'rend armor damage': 'rendArmorDamage',
  'death ray damage': 'deathRayDamage',
  'smart missile damage': 'smartMissileDamage',
  'inner land mine damage': 'innerLandMineDamage',
  'chain lightning damage': 'chainLightningDamage',
  'death wave damage': 'deathWaveDamage',
  'tagged by deathwave': 'taggedByDeathwave',
  'swamp damage': 'swampDamage',
  'black hole damage': 'blackHoleDamage',
  'electrons damage': 'electronsDamage',
  'waves skipped': 'wavesSkipped',
  'recovery packages': 'recoveryPackages',
  'free attack upgrade': 'freeAttackUpgrade',
  'free defense upgrade': 'freeDefenseUpgrade',
  'free utility upgrade': 'freeUtilityUpgrade',
  'hp from death wave': 'hpFromDeathWave',
  'coins from death wave': 'coinsFromDeathWave',
  'cash from golden tower': 'cashFromGoldenTower',
  'coins from golden tower': 'coinsFromGoldenTower',
  'coins from black hole': 'coinsFromBlackHole',
  'coins from spotlight': 'coinsFromSpotlight',
  'coins from orb': 'coinsFromOrb',
  'coins from coin upgrade': 'coinsFromCoinUpgrade',
  'coins from coin bonuses': 'coinsFromCoinBonuses',
  'total enemies': 'totalEnemies',
  basic: 'basicEnemies',
  'basic enemies': 'basicEnemies',
  fast: 'fastEnemies',
  'fast enemies': 'fastEnemies',
  tank: 'tankEnemies',
  'tank enemies': 'tankEnemies',
  ranged: 'rangedEnemies',
  'ranged enemies': 'rangedEnemies',
  boss: 'bossEnemies',
  'boss enemies': 'bossEnemies',
  protector: 'protectorEnemies',
  'protector enemies': 'protectorEnemies',
  'total elites': 'totalElites',
  vampires: 'vampires',
  rays: 'rays',
  scatters: 'scatters',
  saboteur: 'saboteur',
  commander: 'commander',
  overcharge: 'overcharge',
  'destroyed by orbs': 'destroyedByOrbs',
  'destroyed by thorns': 'destroyedByThorns',
  'destroyed by death ray': 'destroyedByDeathRay',
  'destroyed by land mine': 'destroyedByLandMine',
  'destroyed in spotlight': 'destroyedInSpotlight',
  'flame bot damage': 'flameBotDamage',
  'thunder bot stuns': 'thunderBotStuns',
  'golden bot coins earned': 'goldenBotCoinsEarned',
  'destroyed in golden bot': 'destroyedInGoldenBot',
  damage: 'guardianDamage', // Guardian section "Damage"
  gems: 'gems',
  medals: 'medals',
  'summoned enemies': 'summonedEnemies',
  'guardian coins stolen': 'guardianCoinsStolen',
  'coins fetched': 'coinsFetched',
  'reroll shards': 'rerollShards',
  'cannon shards': 'cannonShards',
  'armor shards': 'armorShards',
  'generator shards': 'generatorShards',
  'core shards': 'coreShards',
  'common modules': 'commonModules',
  'rare modules': 'rareModules',
};

/** Fields that are time strings (Xh Ym Zs) */
const TIME_FIELDS: Set<keyof Run> = new Set(['gameTimeSec', 'realTimeSec']);

/** Fields that are dates */
const DATE_FIELDS: Set<keyof Run> = new Set(['battleDate']);

/** Fields that are multiplier format (x8.00) - store as float */
const MULTIPLIER_FIELDS: Set<keyof Run> = new Set(['damageGainFromBerserk']);

/**
 * Parse a number with optional suffix (K, M, B, T, Q, q, s).
 * Strips $ and %; handles "x8.00" multiplier format.
 * Exported for tests.
 */
export function parseNumber(raw: string): number | null {
  let s = raw.trim().replace(/^[$%x]\s*/i, '').replace(/%$/, '').trim();
  if (s === '') return null;
  const last = s.slice(-1);
  const mult = SUFFIX[last];
  if (mult !== undefined) {
    s = s.slice(0, -1).trim();
  }
  const n = parseFloat(s.replace(/,/g, ''));
  if (Number.isNaN(n)) return null;
  return mult !== undefined ? n * mult : n;
}

/**
 * Parse time string "22h 17m 6s", "5h 24m 47s", or "1d 1h 1m 26s" into total seconds.
 * Supports optional d (days), h (hours), m (minutes), s (seconds).
 * Exported for tests.
 */
export function parseTime(raw: string): number | null {
  const s = raw.trim();
  if (s === '') return null;
  const re = /^(?:(\d+)\s*d)?\s*(?:(\d+)\s*h)?\s*(?:(\d+)\s*m)?\s*(?:(\d+)\s*s?)?$/i;
  const m = s.match(re);
  if (!m || !/\d/.test(s)) return null;
  const d = parseInt(m[1] ?? '0', 10);
  const h = parseInt(m[2] ?? '0', 10);
  const min = parseInt(m[3] ?? '0', 10);
  const sec = parseInt(m[4] ?? '0', 10);
  return d * 86400 + h * 3600 + min * 60 + sec;
}

/**
 * Parse date string (e.g. "Mar 08, 2026 08:23") to ISO string for storage.
 */
function parseDate(raw: string): string | null {
  const d = new Date(raw.trim());
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

/**
 * Parse multiplier value like "x8.00" to float 8.0.
 * Exported for tests.
 */
export function parseMultiplier(raw: string): number | null {
  const s = raw.trim().replace(/^x/i, '').trim();
  const n = parseFloat(s);
  return Number.isNaN(n) ? null : n;
}

export interface ParseResult {
  run: Partial<Run>;
  errors: string[];
}

/**
 * Parse Battle Report clipboard text into a partial Run object.
 * Returns which fields were parsed and any errors for missing/failed fields.
 */
export function parseReport(rawText: string): ParseResult {
  const run: Partial<Run> = {};
  const errors: string[] = [];
  const lines = rawText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  for (const line of lines) {
    // Section header: no tab
    if (!line.includes('\t')) continue;

    const tabIdx = line.indexOf('\t');
    const key = line.slice(0, tabIdx).trim();
    const value = line.slice(tabIdx + 1).trim();
    const normalized = normalizeKey(key);
    const field = KEY_TO_FIELD[normalized];
    if (!field) continue;

    let parsed: number | string | null = null;

    if (field === 'killedBy') {
      (run as Record<string, unknown>)[field] = value;
      continue;
    }
    if (DATE_FIELDS.has(field as keyof Run)) {
      parsed = parseDate(value);
    } else if (TIME_FIELDS.has(field as keyof Run)) {
      parsed = parseTime(value);
    } else if (MULTIPLIER_FIELDS.has(field as keyof Run)) {
      parsed = parseMultiplier(value);
    } else {
      parsed = parseNumber(value);
    }

    if (parsed !== null && parsed !== undefined) {
      (run as Record<string, unknown>)[field] = parsed;
    } else {
      errors.push(`Could not parse "${key}" (${field}) from: ${value.slice(0, 40)}`);
    }
  }

  // Resolve Guardian "Damage" vs Combat "Damage dealt" — if we have both, Guardian section comes later so "Damage" might overwrite. Use explicit key; we already map "damage" to guardianDamage only when under Guardian. Actually the same key "damage" could appear in Combat as "Damage dealt". So we don't have "damage" for damageDealt; we have "damage dealt". And "damage" alone for Guardian. So we're good.

  // Derived fields (only if we have required inputs)
  const wave = run.wave;
  const coinsEarned = run.coinsEarned;
  const cellsEarned = run.cellsEarned;
  const realTimeSec = run.realTimeSec;
  const rerollShardsEarned = run.rerollShardsEarned;

  if (typeof wave === 'number' && wave > 0) {
    if (typeof coinsEarned === 'number') {
      run.coinsPerWave = coinsEarned / wave;
    }
    if (typeof cellsEarned === 'number') {
      run.cellsPerWave = cellsEarned / wave;
    }
  }
  if (typeof realTimeSec === 'number' && realTimeSec > 0) {
    const hours = realTimeSec / 3600;
    if (typeof cellsEarned === 'number') {
      run.cellsPerHour = cellsEarned / hours;
    }
    if (typeof rerollShardsEarned === 'number') {
      run.rerollShardsPerHour = rerollShardsEarned / hours;
    }
  }

  return { run, errors };
}
