import type { Run } from '../types/Run';

const STORAGE_KEY = 'tower_runs';

const NUM = 0;
const STR = '';

/** Build a full Run from a partial (e.g. from parseReport) with defaults and id/savedAt. */
export function createRunFromPartial(
  partial: Partial<Run>,
  options?: { notes?: string }
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

/** Encode UTF-8 string to base64 (shareable code). */
function toBase64(str: string): string {
  return btoa(String.fromCharCode(...new TextEncoder().encode(str)));
}

/** Decode base64 back to UTF-8 string. */
function fromBase64(code: string): string {
  return new TextDecoder().decode(Uint8Array.from(atob(code), (c) => c.charCodeAt(0)));
}

/** Export all runs as a shareable base64 code (copy/paste, no file). */
export function exportRunsToShareCode(): string {
  return toBase64(JSON.stringify(loadRuns()));
}

/**
 * Import runs from a share code (base64-encoded JSON).
 * Replaces all existing runs. Returns the number of runs imported.
 */
export function importRunsFromShareCode(shareCode: string): number {
  const trimmed = shareCode.trim();
  if (!trimmed) throw new Error('Paste a share code to import');
  try {
    const json = fromBase64(trimmed);
    return importRunsFromJson(json);
  } catch (e) {
    if (e instanceof Error && e.message === 'Invalid JSON') {
      throw new Error('Invalid share code');
    }
    throw e;
  }
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
