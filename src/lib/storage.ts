import LZString from 'lz-string';
import type { Run } from '../types/Run';

const STORAGE_KEY = 'tower_runs';

const NUM = 0;
const STR = '';

/** Build a full Run from a partial (e.g. from parseReport) with defaults and id/savedAt. */
export function createRunFromPartial(
  partial: Partial<Run>,
  options?: { notes?: string; rawReport?: string }
): Run {
  const id = partial.id ?? crypto.randomUUID();
  const savedAt = partial.savedAt ?? new Date().toISOString();
  return {
    id,
    savedAt,
    battleDate: partial.battleDate ?? STR,
    gameTimeSec: partial.gameTimeSec ?? NUM,
    realTimeSec: partial.realTimeSec ?? NUM,
    tier: partial.tier ?? NUM,
    wave: partial.wave ?? NUM,
    killedBy: partial.killedBy ?? STR,
    coinsEarned: partial.coinsEarned ?? NUM,
    coinsPerHour: partial.coinsPerHour ?? NUM,
    cashEarned: partial.cashEarned ?? NUM,
    interestEarned: partial.interestEarned ?? NUM,
    gemBlocksTapped: partial.gemBlocksTapped ?? NUM,
    cellsEarned: partial.cellsEarned ?? NUM,
    rerollShardsEarned: partial.rerollShardsEarned ?? NUM,
    damageDealt: partial.damageDealt ?? NUM,
    damageTaken: partial.damageTaken ?? NUM,
    damageTakenWall: partial.damageTakenWall ?? NUM,
    damageTakenWhileBerserked: partial.damageTakenWhileBerserked ?? NUM,
    damageGainFromBerserk: partial.damageGainFromBerserk ?? NUM,
    deathDefy: partial.deathDefy ?? NUM,
    lifesteal: partial.lifesteal ?? NUM,
    projectilesDamage: partial.projectilesDamage ?? NUM,
    projectilesCount: partial.projectilesCount ?? NUM,
    thornDamage: partial.thornDamage ?? NUM,
    orbDamage: partial.orbDamage ?? NUM,
    enemiesHitByOrbs: partial.enemiesHitByOrbs ?? NUM,
    landMineDamage: partial.landMineDamage ?? NUM,
    landMinesSpawned: partial.landMinesSpawned ?? NUM,
    rendArmorDamage: partial.rendArmorDamage ?? NUM,
    deathRayDamage: partial.deathRayDamage ?? NUM,
    smartMissileDamage: partial.smartMissileDamage ?? NUM,
    innerLandMineDamage: partial.innerLandMineDamage ?? NUM,
    chainLightningDamage: partial.chainLightningDamage ?? NUM,
    deathWaveDamage: partial.deathWaveDamage ?? NUM,
    taggedByDeathwave: partial.taggedByDeathwave ?? NUM,
    swampDamage: partial.swampDamage ?? NUM,
    blackHoleDamage: partial.blackHoleDamage ?? NUM,
    electronsDamage: partial.electronsDamage ?? NUM,
    wavesSkipped: partial.wavesSkipped ?? NUM,
    recoveryPackages: partial.recoveryPackages ?? NUM,
    freeAttackUpgrade: partial.freeAttackUpgrade ?? NUM,
    freeDefenseUpgrade: partial.freeDefenseUpgrade ?? NUM,
    freeUtilityUpgrade: partial.freeUtilityUpgrade ?? NUM,
    hpFromDeathWave: partial.hpFromDeathWave ?? NUM,
    coinsFromDeathWave: partial.coinsFromDeathWave ?? NUM,
    cashFromGoldenTower: partial.cashFromGoldenTower ?? NUM,
    coinsFromGoldenTower: partial.coinsFromGoldenTower ?? NUM,
    coinsFromBlackHole: partial.coinsFromBlackHole ?? NUM,
    coinsFromSpotlight: partial.coinsFromSpotlight ?? NUM,
    coinsFromOrb: partial.coinsFromOrb ?? NUM,
    coinsFromCoinUpgrade: partial.coinsFromCoinUpgrade ?? NUM,
    coinsFromCoinBonuses: partial.coinsFromCoinBonuses ?? NUM,
    totalEnemies: partial.totalEnemies ?? NUM,
    basicEnemies: partial.basicEnemies ?? NUM,
    fastEnemies: partial.fastEnemies ?? NUM,
    tankEnemies: partial.tankEnemies ?? NUM,
    rangedEnemies: partial.rangedEnemies ?? NUM,
    bossEnemies: partial.bossEnemies ?? NUM,
    protectorEnemies: partial.protectorEnemies ?? NUM,
    totalElites: partial.totalElites ?? NUM,
    vampires: partial.vampires ?? NUM,
    rays: partial.rays ?? NUM,
    scatters: partial.scatters ?? NUM,
    saboteur: partial.saboteur ?? NUM,
    commander: partial.commander ?? NUM,
    overcharge: partial.overcharge ?? NUM,
    destroyedByOrbs: partial.destroyedByOrbs ?? NUM,
    destroyedByThorns: partial.destroyedByThorns ?? NUM,
    destroyedByDeathRay: partial.destroyedByDeathRay ?? NUM,
    destroyedByLandMine: partial.destroyedByLandMine ?? NUM,
    destroyedInSpotlight: partial.destroyedInSpotlight ?? NUM,
    flameBotDamage: partial.flameBotDamage ?? NUM,
    thunderBotStuns: partial.thunderBotStuns ?? NUM,
    goldenBotCoinsEarned: partial.goldenBotCoinsEarned ?? NUM,
    destroyedInGoldenBot: partial.destroyedInGoldenBot ?? NUM,
    guardianDamage: partial.guardianDamage ?? NUM,
    summonedEnemies: partial.summonedEnemies ?? NUM,
    guardianCoinsStolen: partial.guardianCoinsStolen ?? NUM,
    coinsFetched: partial.coinsFetched ?? NUM,
    gems: partial.gems ?? NUM,
    medals: partial.medals ?? NUM,
    rerollShards: partial.rerollShards ?? NUM,
    cannonShards: partial.cannonShards ?? NUM,
    armorShards: partial.armorShards ?? NUM,
    generatorShards: partial.generatorShards ?? NUM,
    coreShards: partial.coreShards ?? NUM,
    commonModules: partial.commonModules ?? NUM,
    rareModules: partial.rareModules ?? NUM,
    coinsPerWave: partial.coinsPerWave ?? NUM,
    cellsPerHour: partial.cellsPerHour ?? NUM,
    cellsPerWave: partial.cellsPerWave ?? NUM,
    rerollShardsPerHour: partial.rerollShardsPerHour ?? NUM,
    notes: options?.notes ?? partial.notes,
    rawReport: options?.rawReport ?? partial.rawReport,
  };
}

export function loadRuns(): Run[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw) as unknown;
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function saveRuns(runs: Run[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(runs));
}

export function addRun(run: Run): Run[] {
  const runs = loadRuns();
  runs.unshift(run);
  saveRuns(runs);
  return runs;
}

export function deleteRun(id: string): Run[] {
  const runs = loadRuns().filter((r) => r.id !== id);
  saveRuns(runs);
  return runs;
}

export function updateRun(id: string, updates: Partial<Run>): Run[] {
  const runs = loadRuns();
  const i = runs.findIndex((r) => r.id === id);
  if (i === -1) return runs;
  runs[i] = { ...runs[i], ...updates };
  saveRuns(runs);
  return runs;
}

/** Export all runs as a JSON string for backup or use in another browser/device. */
export function exportRunsToJson(): string {
  return JSON.stringify(loadRuns(), null, 2);
}

/** Decode base64 back to UTF-8 string (for legacy uncompressed share codes). */
function fromBase64(code: string): string {
  return new TextDecoder().decode(Uint8Array.from(atob(code), (c) => c.charCodeAt(0)));
}

/** Export all runs as a shareable code (compressed + base64 for shorter codes). */
export function exportRunsToShareCode(): string {
  const json = JSON.stringify(loadRuns());
  return LZString.compressToBase64(json);
}

/**
 * Import runs from a share code (compressed or legacy plain base64 JSON).
 * Replaces all existing runs. Returns the number of runs imported.
 */
export function importRunsFromShareCode(shareCode: string): number {
  const trimmed = shareCode.trim();
  if (!trimmed) throw new Error('Paste a share code to import');
  try {
    const json =
      LZString.decompressFromBase64(trimmed) ??
      fromBase64(trimmed);
    return importRunsFromJson(json);
  } catch (e) {
    if (e instanceof Error && e.message === 'Invalid JSON') {
      throw new Error('Invalid share code');
    }
    throw e;
  }
}

/**
 * Export runs as CSV for external tools.
 * Required columns: Tier, Wave, Coins Earned, Cells Earned, Duration (real time, seconds).
 * Includes all other fields as additional columns.
 */
export function exportRunsToCsv(): string {
  const runs = loadRuns();
  if (!runs.length) return '';

  type Col = { header: string; get: (r: Run) => string | number | undefined | null };
  const cols: Col[] = [
    // Required
    { header: 'Tier', get: (r) => r.tier },
    { header: 'Wave', get: (r) => r.wave },
    { header: 'Coins Earned', get: (r) => r.coinsEarned },
    { header: 'Cells Earned', get: (r) => r.cellsEarned },
    { header: 'Duration', get: (r) => r.realTimeSec }, // seconds
    // Overview
    { header: 'Battle Date', get: (r) => r.battleDate },
    { header: 'Game Time Seconds', get: (r) => r.gameTimeSec },
    { header: 'Real Time Seconds', get: (r) => r.realTimeSec },
    { header: 'Killed By', get: (r) => r.killedBy },
    // Economy
    { header: 'Coins Per Hour', get: (r) => r.coinsPerHour },
    { header: 'Cash Earned', get: (r) => r.cashEarned },
    { header: 'Interest Earned', get: (r) => r.interestEarned },
    { header: 'Gem Blocks Tapped', get: (r) => r.gemBlocksTapped },
    { header: 'Reroll Shards Earned', get: (r) => r.rerollShardsEarned },
    // Combat
    { header: 'Damage Dealt', get: (r) => r.damageDealt },
    { header: 'Damage Taken', get: (r) => r.damageTaken },
    { header: 'Damage Taken Wall', get: (r) => r.damageTakenWall },
    { header: 'Damage Taken While Berserked', get: (r) => r.damageTakenWhileBerserked },
    { header: 'Damage Gain From Berserk', get: (r) => r.damageGainFromBerserk },
    { header: 'Death Defy', get: (r) => r.deathDefy },
    { header: 'Lifesteal', get: (r) => r.lifesteal },
    { header: 'Projectiles Damage', get: (r) => r.projectilesDamage },
    { header: 'Projectiles Count', get: (r) => r.projectilesCount },
    { header: 'Thorn Damage', get: (r) => r.thornDamage },
    { header: 'Orb Damage', get: (r) => r.orbDamage },
    { header: 'Enemies Hit By Orbs', get: (r) => r.enemiesHitByOrbs },
    { header: 'Land Mine Damage', get: (r) => r.landMineDamage },
    { header: 'Land Mines Spawned', get: (r) => r.landMinesSpawned },
    { header: 'Rend Armor Damage', get: (r) => r.rendArmorDamage },
    { header: 'Death Ray Damage', get: (r) => r.deathRayDamage },
    { header: 'Smart Missile Damage', get: (r) => r.smartMissileDamage },
    { header: 'Inner Land Mine Damage', get: (r) => r.innerLandMineDamage },
    { header: 'Chain Lightning Damage', get: (r) => r.chainLightningDamage },
    { header: 'Death Wave Damage', get: (r) => r.deathWaveDamage },
    { header: 'Tagged By Deathwave', get: (r) => r.taggedByDeathwave },
    { header: 'Swamp Damage', get: (r) => r.swampDamage },
    { header: 'Black Hole Damage', get: (r) => r.blackHoleDamage },
    { header: 'Electrons Damage', get: (r) => r.electronsDamage },
    // Utility
    { header: 'Waves Skipped', get: (r) => r.wavesSkipped },
    { header: 'Recovery Packages', get: (r) => r.recoveryPackages },
    { header: 'Free Attack Upgrade', get: (r) => r.freeAttackUpgrade },
    { header: 'Free Defense Upgrade', get: (r) => r.freeDefenseUpgrade },
    { header: 'Free Utility Upgrade', get: (r) => r.freeUtilityUpgrade },
    { header: 'HP From Death Wave', get: (r) => r.hpFromDeathWave },
    { header: 'Coins From Death Wave', get: (r) => r.coinsFromDeathWave },
    { header: 'Cash From Golden Tower', get: (r) => r.cashFromGoldenTower },
    { header: 'Coins From Golden Tower', get: (r) => r.coinsFromGoldenTower },
    { header: 'Coins From Black Hole', get: (r) => r.coinsFromBlackHole },
    { header: 'Coins From Spotlight', get: (r) => r.coinsFromSpotlight },
    { header: 'Coins From Orb', get: (r) => r.coinsFromOrb },
    { header: 'Coins From Coin Upgrade', get: (r) => r.coinsFromCoinUpgrade },
    { header: 'Coins From Coin Bonuses', get: (r) => r.coinsFromCoinBonuses },
    // Enemies
    { header: 'Total Enemies', get: (r) => r.totalEnemies },
    { header: 'Basic Enemies', get: (r) => r.basicEnemies },
    { header: 'Fast Enemies', get: (r) => r.fastEnemies },
    { header: 'Tank Enemies', get: (r) => r.tankEnemies },
    { header: 'Ranged Enemies', get: (r) => r.rangedEnemies },
    { header: 'Boss Enemies', get: (r) => r.bossEnemies },
    { header: 'Protector Enemies', get: (r) => r.protectorEnemies },
    { header: 'Total Elites', get: (r) => r.totalElites },
    { header: 'Vampires', get: (r) => r.vampires },
    { header: 'Rays', get: (r) => r.rays },
    { header: 'Scatters', get: (r) => r.scatters },
    { header: 'Saboteur', get: (r) => r.saboteur },
    { header: 'Commander', get: (r) => r.commander },
    { header: 'Overcharge', get: (r) => r.overcharge },
    { header: 'Destroyed By Orbs', get: (r) => r.destroyedByOrbs },
    { header: 'Destroyed By Thorns', get: (r) => r.destroyedByThorns },
    { header: 'Destroyed By Death Ray', get: (r) => r.destroyedByDeathRay },
    { header: 'Destroyed By Land Mine', get: (r) => r.destroyedByLandMine },
    { header: 'Destroyed In Spotlight', get: (r) => r.destroyedInSpotlight },
    // Bots
    { header: 'Flame Bot Damage', get: (r) => r.flameBotDamage },
    { header: 'Thunder Bot Stuns', get: (r) => r.thunderBotStuns },
    { header: 'Golden Bot Coins Earned', get: (r) => r.goldenBotCoinsEarned },
    { header: 'Destroyed In Golden Bot', get: (r) => r.destroyedInGoldenBot },
    // Guardian
    { header: 'Guardian Damage', get: (r) => r.guardianDamage },
    { header: 'Summoned Enemies', get: (r) => r.summonedEnemies },
    { header: 'Guardian Coins Stolen', get: (r) => r.guardianCoinsStolen },
    { header: 'Coins Fetched', get: (r) => r.coinsFetched },
    // Rewards
    { header: 'Gems', get: (r) => r.gems },
    { header: 'Medals', get: (r) => r.medals },
    { header: 'Reroll Shards (Guardian)', get: (r) => r.rerollShards },
    { header: 'Cannon Shards', get: (r) => r.cannonShards },
    { header: 'Armor Shards', get: (r) => r.armorShards },
    { header: 'Generator Shards', get: (r) => r.generatorShards },
    { header: 'Core Shards', get: (r) => r.coreShards },
    { header: 'Common Modules', get: (r) => r.commonModules },
    { header: 'Rare Modules', get: (r) => r.rareModules },
    // Derived
    { header: 'Coins Per Wave', get: (r) => r.coinsPerWave },
    { header: 'Cells Per Hour', get: (r) => r.cellsPerHour },
    { header: 'Cells Per Wave', get: (r) => r.cellsPerWave },
    { header: 'Reroll Shards Per Hour', get: (r) => r.rerollShardsPerHour },
    // Meta
    { header: 'Saved At', get: (r) => r.savedAt },
    { header: 'Notes', get: (r) => r.notes ?? '' },
    { header: 'Raw Report', get: (r) => r.rawReport ?? '' },
  ];

  const escape = (value: string): string =>
    `"${value.replace(/"/g, '""')}"`;

  const headerRow = cols.map((c) => escape(c.header)).join(',');
  const rows = runs.map((run) => {
    const values = cols.map((c) => {
      const v = c.get(run);
      if (v === undefined || v === null) return '""';
      return escape(String(v));
    });
    return values.join(',');
  });

  return [headerRow, ...rows].join('\r\n');
}

/**
 * Import runs from a JSON string (e.g. from a backup file).
 * Replaces all existing runs. Returns the number of runs imported.
 */
export function importRunsFromJson(json: string): number {
  let data: unknown;
  try {
    data = JSON.parse(json);
  } catch {
    throw new Error('Invalid JSON');
  }
  if (!Array.isArray(data)) throw new Error('File must contain a JSON array of runs');
  const runs = data.filter(
    (item): item is Run =>
      item != null &&
      typeof item === 'object' &&
      'id' in item &&
      'savedAt' in item &&
      typeof (item as Run).wave === 'number'
  );
  saveRuns(runs);
  return runs.length;
}
