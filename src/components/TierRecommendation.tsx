import { useState, useCallback } from 'react';
import { formatNumber, formatTime, formatInteger } from '../lib/formatters';
import type { Run } from '../types/Run';

type TierRec = {
  tier: number;
  rationale: string;
  byTier: Array<{
    tier: number;
    runCount: number;
    avgWave: number;
    avgCPH: number;
    avgCPW: number;
    avgCellsPerHour: number;
    avgCellsPerWave: number;
    avgRealTimeSec: number;
  }>;
};

type SortKey = keyof TierRec['byTier'][0];

export function TierRecommendation({
  runs,
  tierRec,
}: {
  runs: Run[];
  tierRec: TierRec;
}) {
  const [sortKey, setSortKey] = useState<SortKey>('avgCPH');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const sorted = [...tierRec.byTier].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    const mult = sortDir === 'asc' ? 1 : -1;
    if (typeof aVal === 'number' && typeof bVal === 'number') return mult * (aVal - bVal);
    return 0;
  });

  const handleSort = useCallback(
    (key: SortKey) => {
      if (sortKey === key) setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));
      else {
        setSortKey(key);
        setSortDir('desc');
      }
    },
    [sortKey]
  );

  if (runs.length === 0) return null;

  return (
    <section>
      <h2 className="font-display text-accent-teal font-semibold text-sm uppercase tracking-wider mb-3">
        Tier recommendation
      </h2>
      <p className="text-gray-400 text-sm mb-3">{tierRec.rationale}</p>
      <div className="rounded-lg border border-gray-700 bg-[#111827]/50 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-700 text-left text-gray-400 font-display uppercase tracking-wider">
              <Th label="Tier" sortKey="tier" current={sortKey} dir={sortDir} onSort={handleSort} />
              <Th label="# Runs" sortKey="runCount" current={sortKey} dir={sortDir} onSort={handleSort} />
              <Th label="Avg Wave" sortKey="avgWave" current={sortKey} dir={sortDir} onSort={handleSort} />
              <Th label="Avg CPH" sortKey="avgCPH" current={sortKey} dir={sortDir} onSort={handleSort} />
              <Th label="Avg CPW" sortKey="avgCPW" current={sortKey} dir={sortDir} onSort={handleSort} />
              <Th label="Avg Cells/hr" sortKey="avgCellsPerHour" current={sortKey} dir={sortDir} onSort={handleSort} />
              <Th label="Avg Cells/wave" sortKey="avgCellsPerWave" current={sortKey} dir={sortDir} onSort={handleSort} />
              <Th label="Avg Real Time" sortKey="avgRealTimeSec" current={sortKey} dir={sortDir} onSort={handleSort} />
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => (
              <tr key={row.tier} className="border-b border-gray-800 hover:bg-gray-800/50">
                <td className="py-2 pr-4 font-mono text-accent-teal">T{row.tier}</td>
                <td className="py-2 pr-4 font-mono">{row.runCount}</td>
                <td className="py-2 pr-4 font-mono">{formatInteger(row.avgWave)}</td>
                <td className="py-2 pr-4 font-mono">{formatNumber(row.avgCPH)}</td>
                <td className="py-2 pr-4 font-mono">{formatNumber(row.avgCPW)}</td>
                <td className="py-2 pr-4 font-mono">{formatNumber(row.avgCellsPerHour)}</td>
                <td className="py-2 pr-4 font-mono">{formatNumber(row.avgCellsPerWave)}</td>
                <td className="py-2 pr-4 font-mono text-gray-300">{formatTime(row.avgRealTimeSec)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Th({
  label,
  sortKey,
  current,
  dir,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  current: SortKey;
  dir: 'asc' | 'desc';
  onSort: (k: SortKey) => void;
}) {
  return (
    <th
      className="py-3 pr-4 cursor-pointer hover:text-gray-300 select-none"
      onClick={() => onSort(sortKey)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {current === sortKey && (
          <span className="text-accent-teal">{dir === 'desc' ? '↓' : '↑'}</span>
        )}
      </span>
    </th>
  );
}
