import { useParams, Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { loadRuns } from '../lib/storage';
import { formatNumber, formatTime, formatDate, formatInteger } from '../lib/formatters';

function Section({
  title,
  entries,
}: {
  title: string;
  entries: Array<{ label: string; value: string }>;
}) {
  return (
    <section className="rounded-lg border border-gray-700 bg-[#111827]/50 p-4">
      <h2 className="font-display text-accent-teal font-semibold text-sm uppercase tracking-wider mb-3">
        {title}
      </h2>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
        {entries.map(({ label, value }) => (
          <div key={label} className="flex justify-between gap-2">
            <dt className="text-gray-500">{label}</dt>
            <dd className="font-mono text-gray-100 text-right">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function RunDetail() {
  const { id } = useParams<{ id: string }>();
  const run = useMemo(() => loadRuns().find((r) => r.id === id), [id]);

  const [rawOpen, setRawOpen] = useState(false);

  if (!run) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <p className="text-gray-400">Run not found.</p>
        <Link to="/runs" className="text-accent-teal hover:underline mt-2 inline-block">
          ← Back to Runs
        </Link>
      </div>
    );
  }

  const overview = [
    { label: 'Battle date', value: run.battleDate ? formatDate(run.battleDate) : '—' },
    { label: 'Game time', value: formatTime(run.gameTimeSec) },
    { label: 'Real time', value: formatTime(run.realTimeSec) },
    { label: 'Tier', value: String(run.tier) },
    { label: 'Wave', value: formatInteger(run.wave) },
    { label: 'Killed by', value: run.killedBy || '—' },
  ];

  const economy = [
    { label: 'Coins earned', value: formatNumber(run.coinsEarned) },
    { label: 'Coins per hour', value: formatNumber(run.coinsPerHour) },
    { label: 'Coins per wave', value: formatNumber(run.coinsPerWave) },
    { label: 'Cash earned', value: formatNumber(run.cashEarned) },
    { label: 'Interest earned', value: formatNumber(run.interestEarned) },
    { label: 'Gem blocks tapped', value: formatInteger(run.gemBlocksTapped) },
    { label: 'Cells earned', value: formatNumber(run.cellsEarned) },
    { label: 'Cells per hour', value: formatNumber(run.cellsPerHour) },
    { label: 'Cells per wave', value: formatNumber(run.cellsPerWave) },
    { label: 'Reroll shards earned', value: formatNumber(run.rerollShardsEarned) },
    { label: 'Reroll shards per hour', value: formatNumber(run.rerollShardsPerHour) },
  ];

  const combat = [
    { label: 'Damage dealt', value: formatNumber(run.damageDealt) },
    { label: 'Damage taken', value: formatNumber(run.damageTaken) },
    { label: 'Damage taken wall', value: formatNumber(run.damageTakenWall) },
    { label: 'Damage taken while berserked', value: formatNumber(run.damageTakenWhileBerserked) },
    { label: 'Damage gain from berserk', value: formatNumber(run.damageGainFromBerserk) },
    { label: 'Death defy', value: formatInteger(run.deathDefy) },
    { label: 'Lifesteal', value: formatNumber(run.lifesteal) },
    { label: 'Projectiles damage', value: formatNumber(run.projectilesDamage) },
    { label: 'Projectiles count', value: formatNumber(run.projectilesCount) },
    { label: 'Thorn damage', value: formatNumber(run.thornDamage) },
    { label: 'Orb damage', value: formatNumber(run.orbDamage) },
    { label: 'Enemies hit by orbs', value: formatNumber(run.enemiesHitByOrbs) },
    { label: 'Land mine damage', value: formatNumber(run.landMineDamage) },
    { label: 'Land mines spawned', value: formatInteger(run.landMinesSpawned) },
    { label: 'Rend armor damage', value: formatNumber(run.rendArmorDamage) },
    { label: 'Death ray damage', value: formatNumber(run.deathRayDamage) },
    { label: 'Smart missile damage', value: formatNumber(run.smartMissileDamage) },
    { label: 'Inner land mine damage', value: formatNumber(run.innerLandMineDamage) },
    { label: 'Chain lightning damage', value: formatNumber(run.chainLightningDamage) },
    { label: 'Death wave damage', value: formatNumber(run.deathWaveDamage) },
    { label: 'Tagged by deathwave', value: formatInteger(run.taggedByDeathwave) },
    { label: 'Swamp damage', value: formatNumber(run.swampDamage) },
    { label: 'Black hole damage', value: formatNumber(run.blackHoleDamage) },
    { label: 'Electrons damage', value: formatNumber(run.electronsDamage) },
  ];

  const utility = [
    { label: 'Waves skipped', value: formatInteger(run.wavesSkipped) },
    { label: 'Recovery packages', value: formatInteger(run.recoveryPackages) },
    { label: 'Free attack upgrade', value: formatInteger(run.freeAttackUpgrade) },
    { label: 'Free defense upgrade', value: formatInteger(run.freeDefenseUpgrade) },
    { label: 'Free utility upgrade', value: formatInteger(run.freeUtilityUpgrade) },
    { label: 'HP from death wave', value: formatNumber(run.hpFromDeathWave) },
    { label: 'Coins from death wave', value: formatNumber(run.coinsFromDeathWave) },
    { label: 'Cash from golden tower', value: formatNumber(run.cashFromGoldenTower) },
    { label: 'Coins from golden tower', value: formatNumber(run.coinsFromGoldenTower) },
    { label: 'Coins from black hole', value: formatNumber(run.coinsFromBlackHole) },
    { label: 'Coins from spotlight', value: formatNumber(run.coinsFromSpotlight) },
    { label: 'Coins from orb', value: formatNumber(run.coinsFromOrb) },
    { label: 'Coins from coin upgrade', value: formatNumber(run.coinsFromCoinUpgrade) },
    { label: 'Coins from coin bonuses', value: formatNumber(run.coinsFromCoinBonuses) },
  ];

  const enemies = [
    { label: 'Total enemies', value: formatInteger(run.totalEnemies) },
    { label: 'Basic', value: formatInteger(run.basicEnemies) },
    { label: 'Fast', value: formatInteger(run.fastEnemies) },
    { label: 'Tank', value: formatInteger(run.tankEnemies) },
    { label: 'Ranged', value: formatInteger(run.rangedEnemies) },
    { label: 'Boss', value: formatInteger(run.bossEnemies) },
    { label: 'Protector', value: formatInteger(run.protectorEnemies) },
    { label: 'Total elites', value: formatInteger(run.totalElites) },
    { label: 'Vampires', value: formatInteger(run.vampires) },
    { label: 'Rays', value: formatInteger(run.rays) },
    { label: 'Scatters', value: formatInteger(run.scatters) },
    { label: 'Saboteur', value: formatInteger(run.saboteur) },
    { label: 'Commander', value: formatInteger(run.commander) },
    { label: 'Overcharge', value: formatInteger(run.overcharge) },
    { label: 'Destroyed by orbs', value: formatInteger(run.destroyedByOrbs) },
    { label: 'Destroyed by thorns', value: formatInteger(run.destroyedByThorns) },
    { label: 'Destroyed by death ray', value: formatInteger(run.destroyedByDeathRay) },
    { label: 'Destroyed by land mine', value: formatInteger(run.destroyedByLandMine) },
    { label: 'Destroyed in spotlight', value: formatInteger(run.destroyedInSpotlight) },
  ];

  const bots = [
    { label: 'Flame bot damage', value: formatNumber(run.flameBotDamage) },
    { label: 'Thunder bot stuns', value: formatNumber(run.thunderBotStuns) },
    { label: 'Golden bot coins earned', value: formatNumber(run.goldenBotCoinsEarned) },
    { label: 'Destroyed in golden bot', value: formatInteger(run.destroyedInGoldenBot) },
  ];

  const guardian = [
    { label: 'Damage', value: formatNumber(run.guardianDamage) },
    { label: 'Summoned enemies', value: formatInteger(run.summonedEnemies) },
    { label: 'Guardian coins stolen', value: formatNumber(run.guardianCoinsStolen) },
    { label: 'Coins fetched', value: formatNumber(run.coinsFetched) },
  ];

  const rewards = [
    { label: 'Gems', value: formatInteger(run.gems) },
    { label: 'Medals', value: formatInteger(run.medals) },
    { label: 'Reroll shards', value: formatInteger(run.rerollShards) },
    { label: 'Cannon shards', value: formatInteger(run.cannonShards) },
    { label: 'Armor shards', value: formatInteger(run.armorShards) },
    { label: 'Generator shards', value: formatInteger(run.generatorShards) },
    { label: 'Core shards', value: formatInteger(run.coreShards) },
    { label: 'Common modules', value: formatInteger(run.commonModules) },
    { label: 'Rare modules', value: formatInteger(run.rareModules) },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          to="/runs"
          className="text-accent-teal hover:underline text-sm"
        >
          ← Back to Runs
        </Link>
        <span className="text-gray-500">|</span>
        <span className="font-mono text-gray-100">
          Wave {formatInteger(run.wave)} · T{run.tier} · {run.battleDate ? formatDate(run.battleDate) : formatDate(run.savedAt)}
        </span>
      </div>

      {run.notes && (
        <p className="text-gray-400 text-sm">
          <span className="text-gray-500">Notes:</span> {run.notes}
        </p>
      )}

      <Section title="Overview" entries={overview} />
      <Section title="Economy" entries={economy} />
      <Section title="Combat" entries={combat} />
      <Section title="Utility" entries={utility} />
      <Section title="Enemies" entries={enemies} />
      <Section title="Bots" entries={bots} />
      <Section title="Guardian" entries={guardian} />
      <Section title="Rewards" entries={rewards} />

      <section className="rounded-lg border border-gray-700 bg-[#111827]/50 overflow-hidden">
        <button
          type="button"
          onClick={() => setRawOpen(!rawOpen)}
          className="w-full px-4 py-3 flex items-center justify-between text-left font-display text-accent-teal font-semibold text-sm uppercase tracking-wider hover:bg-gray-800/50 transition"
        >
          Original Battle Report
          <span className="text-gray-400 font-mono text-xs">{rawOpen ? '▼' : '▶'}</span>
        </button>
        {rawOpen && (
          <div className="px-4 pb-4 pt-0 border-t border-gray-700">
            {run.rawReport ? (
              <pre className="text-gray-400 text-xs font-mono whitespace-pre-wrap break-words max-h-96 overflow-y-auto bg-[#0a0d14] p-3 rounded">
                {run.rawReport}
              </pre>
            ) : (
              <p className="text-gray-500 text-sm py-2">
                Original report was not stored for this run (e.g. imported from backup or saved before this feature).
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
