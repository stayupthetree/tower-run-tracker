import { useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { loadRuns } from '../lib/storage';
import { getTierRecommendation } from '../lib/analysis';
import { formatNumber, formatTime, formatDate, formatInteger } from '../lib/formatters';
import type { Run } from '../types/Run';
import { TierRecommendation } from './TierRecommendation';

const TEAL = '#00e5cc';
const AMBER = '#f5a623';
const TIER_COLORS = ['#00e5cc', '#f5a623', '#a78bfa', '#34d399', '#f472b6', '#60a5fa'];

function aggregateStats(runs: Run[]) {
  const n = runs.length;
  if (n === 0) {
    return {
      avgWave: 0,
      avgCPH: 0,
      avgCPW: 0,
      avgCellsPerHour: 0,
      avgCellsPerWave: 0,
      avgRealTimeSec: 0,
      bestWave: 0,
      bestCPH: 0,
      bestRun: null as Run | null,
    };
  }
  let sumWave = 0,
    sumCPH = 0,
    sumCPW = 0,
    sumCellsPerHour = 0,
    sumCellsPerWave = 0,
    sumRealTime = 0;
  let bestWave = 0,
    bestCPH = 0;
  let bestRun: Run | null = null;
  for (const r of runs) {
    sumWave += r.wave;
    sumCPH += r.coinsPerHour;
    sumCPW += r.coinsPerWave;
    sumCellsPerHour += r.cellsPerHour;
    sumCellsPerWave += r.cellsPerWave;
    sumRealTime += r.realTimeSec;
    if (r.wave > bestWave) bestWave = r.wave;
    if (r.coinsPerHour > bestCPH) bestCPH = r.coinsPerHour;
    if (!bestRun || r.coinsPerHour > bestRun.coinsPerHour) bestRun = r;
  }
  return {
    avgWave: sumWave / n,
    avgCPH: sumCPH / n,
    avgCPW: sumCPW / n,
    avgCellsPerHour: sumCellsPerHour / n,
    avgCellsPerWave: sumCellsPerWave / n,
    avgRealTimeSec: sumRealTime / n,
    bestWave,
    bestCPH,
    bestRun,
  };
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-4 min-w-[8rem] ${
        accent
          ? 'border-accent-teal/50 bg-accent-teal/5'
          : 'border-gray-700 bg-[#111827]/80'
      }`}
    >
      <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">{label}</div>
      <div className={`font-mono text-lg ${accent ? 'text-accent-teal' : 'text-gray-100'}`}>
        {value}
      </div>
    </div>
  );
}

export function Dashboard() {
  const runs = loadRuns();

  const stats = useMemo(() => aggregateStats(runs), [runs]);
  const tierRec = useMemo(() => getTierRecommendation(runs), [runs]);

  const chartData = useMemo(() => {
    return [...runs]
      .sort((a, b) => new Date(a.savedAt).getTime() - new Date(b.savedAt).getTime())
      .map((r) => ({
        date: formatDate(r.battleDate || r.savedAt),
        wave: r.wave,
        cph: r.coinsPerHour,
        cells: r.cellsEarned,
        realTimeSec: r.realTimeSec,
        tier: r.tier,
        gems: r.gems ?? 0,
        shards: (r.rerollShards ?? 0) + (r.cannonShards ?? 0) + (r.armorShards ?? 0) + (r.generatorShards ?? 0) + (r.coreShards ?? 0),
      }));
  }, [runs]);

  const runsByTier = useMemo(() => {
    const m = new Map<number, number>();
    for (const r of runs) {
      m.set(r.tier, (m.get(r.tier) ?? 0) + 1);
    }
    return Array.from(m.entries())
      .map(([tier, count]) => ({ tier: `T${tier}`, count }))
      .sort((a, b) => a.tier.localeCompare(b.tier));
  }, [runs]);

  const killedByData = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of runs) {
      const k = r.killedBy?.trim() || 'Unknown';
      m.set(k, (m.get(k) ?? 0) + 1);
    }
    return Array.from(m.entries()).map(([name, count]) => ({ name, value: count }));
  }, [runs]);

  const chartTheme = {
    stroke: TEAL,
    fill: TEAL,
    grid: '#374151',
    text: '#9ca3af',
  };

  if (runs.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="rounded-lg border border-gray-700 bg-[#111827]/50 p-8 text-center">
          <p className="text-gray-400 mb-2">No runs yet.</p>
          <p className="text-gray-500 text-sm">
            Add runs from the <strong className="text-accent-teal">Add run</strong> page to see
            dashboard stats and charts.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-8">
      <section>
        <h2 className="font-display text-accent-teal font-semibold text-sm uppercase tracking-wider mb-3">
          Overview
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Avg Wave" value={formatInteger(stats.avgWave)} />
          <StatCard label="Avg CPH" value={formatNumber(stats.avgCPH)} />
          <StatCard label="Avg CPW" value={formatNumber(stats.avgCPW)} />
          <StatCard label="Avg Cells/hr" value={formatNumber(stats.avgCellsPerHour)} />
          <StatCard label="Avg Cells/wave" value={formatNumber(stats.avgCellsPerWave)} />
          <StatCard label="Avg Real Time" value={formatTime(stats.avgRealTimeSec)} />
          <StatCard label="Best Wave" value={formatInteger(stats.bestWave)} accent />
          <StatCard label="Best CPH" value={formatNumber(stats.bestCPH)} accent />
        </div>
      </section>

      {stats.bestRun && (
        <section>
          <h2 className="font-display text-accent-teal font-semibold text-sm uppercase tracking-wider mb-3">
            Best run (by CPH)
          </h2>
          <div className="rounded-lg border border-accent-amber/30 bg-accent-amber/5 p-4 flex flex-wrap gap-4">
            <span className="font-mono text-accent-amber">
              Wave {formatInteger(stats.bestRun.wave)} · T{stats.bestRun.tier}
            </span>
            <span className="text-gray-400">
              {stats.bestRun.battleDate
                ? formatDate(stats.bestRun.battleDate)
                : formatDate(stats.bestRun.savedAt)}
            </span>
            <span className="text-gray-400">CPH {formatNumber(stats.bestRun.coinsPerHour)}</span>
          </div>
        </section>
      )}

      <TierRecommendation runs={runs} tierRec={tierRec} />

      <section>
        <h2 className="font-display text-accent-teal font-semibold text-sm uppercase tracking-wider mb-3">
          Wave over time
        </h2>
        <div className="h-64 rounded-lg border border-gray-700 bg-[#111827]/50 p-3">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
              <XAxis dataKey="date" tick={{ fill: chartTheme.text, fontSize: 11 }} />
              <YAxis tick={{ fill: chartTheme.text, fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: '#111827', border: '1px solid #374151' }}
                labelStyle={{ color: TEAL }}
              />
              <Line type="monotone" dataKey="wave" stroke={TEAL} strokeWidth={2} dot={{ r: 3 }} name="Wave" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section>
        <h2 className="font-display text-accent-teal font-semibold text-sm uppercase tracking-wider mb-3">
          Coins per hour over time
        </h2>
        <div className="h-64 rounded-lg border border-gray-700 bg-[#111827]/50 p-3">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
              <XAxis dataKey="date" tick={{ fill: chartTheme.text, fontSize: 11 }} />
              <YAxis tick={{ fill: chartTheme.text, fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: '#111827', border: '1px solid #374151' }}
                formatter={(v: number) => [formatNumber(v), 'CPH']}
              />
              <Line type="monotone" dataKey="cph" stroke={AMBER} strokeWidth={2} dot={{ r: 3 }} name="CPH" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="font-display text-accent-teal font-semibold text-sm uppercase tracking-wider mb-3">
            Runs per tier
          </h2>
          <div className="h-64 rounded-lg border border-gray-700 bg-[#111827]/50 p-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={runsByTier} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
                <XAxis dataKey="tier" tick={{ fill: chartTheme.text, fontSize: 11 }} />
                <YAxis tick={{ fill: chartTheme.text, fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: '#111827', border: '1px solid #374151' }}
                />
                <Bar dataKey="count" fill={TEAL} name="Runs" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <h2 className="font-display text-accent-teal font-semibold text-sm uppercase tracking-wider mb-3">
            Killed by
          </h2>
          <div className="h-64 rounded-lg border border-gray-700 bg-[#111827]/50 p-3">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={killedByData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, value }) => `${name} (${value})`}
                  labelLine={{ stroke: chartTheme.text }}
                >
                  {killedByData.map((_, i) => (
                    <Cell key={i} fill={TIER_COLORS[i % TIER_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#111827', border: '1px solid #374151' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
}
