/**
 * A single run from The Tower: Idle Tower Defense.
 * Persisted to localStorage; most fields come from the in-game Battle Report paste.
 */
export interface Run {
  id: string;
  savedAt: string;

  // Overview
  battleDate: string;
  gameTimeSec: number;
  realTimeSec: number;
  tier: number;
  wave: number;
  killedBy: string;

  // Economy
  coinsEarned: number;
  coinsPerHour: number;
  cashEarned: number;
  interestEarned: number;
  gemBlocksTapped: number;
  cellsEarned: number;
  rerollShardsEarned: number;

  // Combat
  damageDealt: number;
  damageTaken: number;
  damageTakenWall: number;
  damageTakenWhileBerserked: number;
  damageGainFromBerserk: number;
  deathDefy: number;
  lifesteal: number;
  projectilesDamage: number;
  projectilesCount: number;
  thornDamage: number;
  orbDamage: number;
  enemiesHitByOrbs: number;
  landMineDamage: number;
  landMinesSpawned: number;
  rendArmorDamage: number;
  deathRayDamage: number;
  smartMissileDamage: number;
  innerLandMineDamage: number;
  chainLightningDamage: number;
  deathWaveDamage: number;
  taggedByDeathwave: number;
  swampDamage: number;
  blackHoleDamage: number;
  electronsDamage: number;

  // Utility
  wavesSkipped: number;
  recoveryPackages: number;
  freeAttackUpgrade: number;
  freeDefenseUpgrade: number;
  freeUtilityUpgrade: number;
  hpFromDeathWave: number;
  coinsFromDeathWave: number;
  cashFromGoldenTower: number;
  coinsFromGoldenTower: number;
  coinsFromBlackHole: number;
  coinsFromSpotlight: number;
  coinsFromOrb: number;
  coinsFromCoinUpgrade: number;
  coinsFromCoinBonuses: number;

  // Enemies
  totalEnemies: number;
  basicEnemies: number;
  fastEnemies: number;
  tankEnemies: number;
  rangedEnemies: number;
  bossEnemies: number;
  protectorEnemies: number;
  totalElites: number;
  vampires: number;
  rays: number;
  scatters: number;
  saboteur: number;
  commander: number;
  overcharge: number;
  destroyedByOrbs: number;
  destroyedByThorns: number;
  destroyedByDeathRay: number;
  destroyedByLandMine: number;
  destroyedInSpotlight: number;

  // Bots
  flameBotDamage: number;
  thunderBotStuns: number;
  goldenBotCoinsEarned: number;
  destroyedInGoldenBot: number;

  // Guardian
  guardianDamage: number;
  summonedEnemies: number;
  guardianCoinsStolen: number;
  coinsFetched: number;

  // Rewards (Guardian section uses "Damage", "Gems", "Medals"; Rewards section may have more)
  gems: number;
  medals: number;
  rerollShards: number;
  cannonShards: number;
  armorShards: number;
  generatorShards: number;
  coreShards: number;
  commonModules: number;
  rareModules: number;

  // Derived (calculated after parsing)
  coinsPerWave: number;
  cellsPerHour: number;
  cellsPerWave: number;
  rerollShardsPerHour: number;

  notes?: string;
}
