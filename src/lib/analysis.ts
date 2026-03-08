import type { Run } from '../types/Run';

/**
 * Tier recommendation and stat aggregation.
 * Recommend optimal tier to farm based on avg Coins/hr and Cells/hr.
 */
export function getTierRecommendation(runs: Run[]): {
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
} {
  const byTier = new Map<
    number,
    { runs: Run[]; sumWave: number; sumCPH: number; sumCPW: number; sumCellsPerHour: number; sumCellsPerWave: number; sumRealTime: number }
  >();
  for (const r of runs) {
    const t = r.tier;
    if (!byTier.has(t)) {
      byTier.set(t, {
        runs: [],
        sumWave: 0,
        sumCPH: 0,
        sumCPW: 0,
        sumCellsPerHour: 0,
        sumCellsPerWave: 0,
        sumRealTime: 0,
      });
    }
    const row = byTier.get(t)!;
    row.runs.push(r);
    row.sumWave += r.wave;
    row.sumCPH += r.coinsPerHour;
    row.sumCPW += r.coinsPerWave;
    row.sumCellsPerHour += r.cellsPerHour;
    row.sumCellsPerWave += r.cellsPerWave;
    row.sumRealTime += r.realTimeSec;
  }

  const result: Array<{
    tier: number;
    runCount: number;
    avgWave: number;
    avgCPH: number;
    avgCPW: number;
    avgCellsPerHour: number;
    avgCellsPerWave: number;
    avgRealTimeSec: number;
  }> = [];

  let bestTier = 0;
  let bestScore = -1;

  for (const [tier, row] of byTier) {
    const n = row.runs.length;
    const avgWave = row.sumWave / n;
    const avgCPH = row.sumCPH / n;
    const avgCPW = row.sumCPW / n;
    const avgCellsPerHour = row.sumCellsPerHour / n;
    const avgCellsPerWave = row.sumCellsPerWave / n;
    const avgRealTimeSec = row.sumRealTime / n;
    result.push({
      tier,
      runCount: n,
      avgWave,
      avgCPH,
      avgCPW,
      avgCellsPerHour,
      avgCellsPerWave,
      avgRealTimeSec,
    });
    const score = avgCPH + avgCellsPerHour * 1e-6;
    if (score > bestScore) {
      bestScore = score;
      bestTier = tier;
    }
  }

  result.sort((a, b) => b.avgCPH - a.avgCPH);

  return {
    tier: bestTier,
    rationale: `Tier ${bestTier} has the best combined Coins/hr and Cells/hr from your run history.`,
    byTier: result,
  };
}
