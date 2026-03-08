import { describe, it, expect } from 'vitest';
import {
  parseReport,
  parseNumber,
  parseTime,
  parseMultiplier,
} from './parseReport';

describe('parseNumber', () => {
  it('parses plain numbers', () => {
    expect(parseNumber('0')).toBe(0);
    expect(parseNumber('42')).toBe(42);
    expect(parseNumber('1.5')).toBe(1.5);
    expect(parseNumber('  99  ')).toBe(99);
  });

  it('parses K suffix (thousands)', () => {
    expect(parseNumber('1K')).toBe(1_000);
    expect(parseNumber('9.06K')).toBe(9_060);
    expect(parseNumber('1k')).toBe(1_000);
  });

  it('parses M suffix (millions)', () => {
    expect(parseNumber('1M')).toBe(1_000_000);
    expect(parseNumber('2.5M')).toBe(2_500_000);
    expect(parseNumber('1m')).toBe(1_000_000);
  });

  it('parses B suffix (billions)', () => {
    expect(parseNumber('1B')).toBe(1_000_000_000);
    expect(parseNumber('255.19B')).toBe(255_190_000_000);
    expect(parseNumber('47.14B')).toBe(47_140_000_000);
  });

  it('parses T suffix (trillions)', () => {
    expect(parseNumber('1T')).toBe(1e12);
    expect(parseNumber('551.23T')).toBe(551.23 * 1e12);
  });

  it('parses Q suffix (quadrillions)', () => {
    expect(parseNumber('1Q')).toBe(1e15);
    expect(parseNumber('44.40Q')).toBe(44.4 * 1e15);
  });

  it('parses q suffix (quintillions)', () => {
    expect(parseNumber('1q')).toBe(1e18);
    expect(parseNumber('2.5q')).toBe(2.5 * 1e18);
  });

  it('parses s suffix (sextillions)', () => {
    expect(parseNumber('1s')).toBe(1e21);
    expect(parseNumber('44.38s')).toBe(44.38 * 1e21);
  });

  it('strips dollar signs before parsing', () => {
    expect(parseNumber('$70.14B')).toBe(70.14 * 1e9);
    expect(parseNumber('$145.86K')).toBe(145_860);
  });

  it('strips percent signs', () => {
    expect(parseNumber('50%')).toBe(50);
    expect(parseNumber('100%')).toBe(100);
  });

  it('strips leading x for multiplier format', () => {
    expect(parseNumber('x8.00')).toBe(8);
    expect(parseNumber('x2.5')).toBe(2.5);
  });

  it('strips commas', () => {
    expect(parseNumber('1,000')).toBe(1000);
    expect(parseNumber('1,000,000K')).toBe(1e9);
  });

  it('returns null for invalid input', () => {
    expect(parseNumber('')).toBeNull();
    expect(parseNumber('   ')).toBeNull();
    expect(parseNumber('abc')).toBeNull();
    expect(parseNumber('K')).toBeNull();
    expect(parseNumber('..')).toBeNull();
  });
});

describe('parseTime', () => {
  it('parses full Xh Ym Zs format', () => {
    expect(parseTime('22h 17m 6s')).toBe(22 * 3600 + 17 * 60 + 6);
    expect(parseTime('5h 24m 47s')).toBe(5 * 3600 + 24 * 60 + 47);
  });

  it('parses with optional units', () => {
    expect(parseTime('1h 0m 0s')).toBe(3600);
    expect(parseTime('0h 30m 0s')).toBe(30 * 60);
    expect(parseTime('0h 0m 45s')).toBe(45);
  });

  it('parses hours only', () => {
    expect(parseTime('2h')).toBe(2 * 3600);
    expect(parseTime('1h')).toBe(3600);
  });

  it('parses minutes only', () => {
    expect(parseTime('15m')).toBe(15 * 60);
    expect(parseTime('90m')).toBe(90 * 60);
  });

  it('parses seconds only', () => {
    expect(parseTime('6s')).toBe(6);
    expect(parseTime('0s')).toBe(0);
  });

  it('parses days when present (e.g. Game Time)', () => {
    expect(parseTime('1d 1h 1m 26s')).toBe(86400 + 3600 + 60 + 26);
    expect(parseTime('2d')).toBe(2 * 86400);
  });

  it('handles flexible spacing and case', () => {
    expect(parseTime('  1h  2m  3s  ')).toBe(3600 + 120 + 3);
    expect(parseTime('1H 2M 3S')).toBe(3600 + 120 + 3);
  });

  it('returns null for invalid input', () => {
    expect(parseTime('')).toBeNull();
    expect(parseTime('nope')).toBeNull();
    expect(parseTime('abc 1h')).toBeNull();
  });
});

describe('parseMultiplier', () => {
  it('parses x-prefixed numbers', () => {
    expect(parseMultiplier('x8.00')).toBe(8);
    expect(parseMultiplier('x2.5')).toBe(2.5);
    expect(parseMultiplier('x1')).toBe(1);
  });

  it('returns null for invalid input', () => {
    expect(parseMultiplier('')).toBeNull();
    expect(parseMultiplier('x')).toBeNull();
    expect(parseMultiplier('abc')).toBeNull();
  });
});

describe('parseReport', () => {
  const minimalReport = [
    'Battle Report',
    'Battle Date\tMar 08, 2026 08:23',
    'Game Time\t22h 17m 6s',
    'Real Time\t5h 24m 47s',
    'Tier\t9',
    'Wave\t3534',
    'Killed By\tRanged',
    'Coins earned\t255.19B',
    'Coins per hour\t47.14B',
    'Cells Earned\t9.06K',
    'Reroll Shards Earned\t2.69K',
  ].join('\n');

  it('parses overview fields', () => {
    const { run, errors } = parseReport(minimalReport);
    expect(run.tier).toBe(9);
    expect(run.wave).toBe(3534);
    expect(run.killedBy).toBe('Ranged');
    expect(run.gameTimeSec).toBe(22 * 3600 + 17 * 60 + 6);
    expect(run.realTimeSec).toBe(5 * 3600 + 24 * 60 + 47);
    expect(run.battleDate).toMatch(/2026-03-08/);
    expect(errors).toHaveLength(0);
  });

  it('parses economy fields and number suffixes', () => {
    const { run } = parseReport(minimalReport);
    expect(run.coinsEarned).toBe(255.19 * 1e9);
    expect(run.coinsPerHour).toBe(47.14 * 1e9);
    expect(run.cellsEarned).toBe(9.06 * 1e3);
    expect(run.rerollShardsEarned).toBe(2.69 * 1e3);
  });

  it('computes coinsPerWave from coinsEarned / wave', () => {
    const { run } = parseReport(minimalReport);
    expect(run.coinsPerWave).toBe((255.19 * 1e9) / 3534);
  });

  it('computes cellsPerWave from cellsEarned / wave', () => {
    const { run } = parseReport(minimalReport);
    expect(run.cellsPerWave).toBe((9.06 * 1e3) / 3534);
  });

  it('computes cellsPerHour from cellsEarned / (realTimeSec/3600)', () => {
    const { run } = parseReport(minimalReport);
    const realHours = (5 * 3600 + 24 * 60 + 47) / 3600;
    expect(run.cellsPerHour).toBeCloseTo((9.06 * 1e3) / realHours, 2);
  });

  it('computes rerollShardsPerHour from rerollShardsEarned / (realTimeSec/3600)', () => {
    const { run } = parseReport(minimalReport);
    const realHours = (5 * 3600 + 24 * 60 + 47) / 3600;
    expect(run.rerollShardsPerHour).toBeCloseTo((2.69 * 1e3) / realHours, 2);
  });

  it('does not set derived fields when wave or realTime missing', () => {
    const report = [
      'Wave\t100',
      'Coins earned\t1000',
    ].join('\n');
    const { run } = parseReport(report);
    expect(run.coinsPerWave).toBe(10);
    expect(run.cellsPerHour).toBeUndefined();
    expect(run.cellsPerWave).toBeUndefined();
    expect(run.rerollShardsPerHour).toBeUndefined();
  });

  it('does not set coinsPerWave or cellsPerWave when wave is zero', () => {
    const report = [
      'Wave\t0',
      'Coins earned\t100',
      'Cells Earned\t50',
    ].join('\n');
    const { run } = parseReport(report);
    expect(run.wave).toBe(0);
    expect(run.coinsPerWave).toBeUndefined();
    expect(run.cellsPerWave).toBeUndefined();
  });

  it('parses multiplier format for damage gain from berserk', () => {
    const report = [
      'Combat',
      'Damage Gain From Berserk\tx8.00',
    ].join('\n');
    const { run } = parseReport(report);
    expect(run.damageGainFromBerserk).toBe(8);
  });

  it('ignores section header lines (no tab)', () => {
    const report = [
      'Combat',
      'Damage dealt\t44.38s',
      'Utility',
      'Waves Skipped\t0',
    ].join('\n');
    const { run } = parseReport(report);
    expect(run.damageDealt).toBe(44.38 * 1e21);
    expect(run.wavesSkipped).toBe(0);
  });

  it('reports errors for unparseable values', () => {
    const report = [
      'Tier\tnot-a-number',
      'Wave\t100',
    ].join('\n');
    const { run, errors } = parseReport(report);
    expect(run.wave).toBe(100);
    expect(run.tier).toBeUndefined();
    expect(errors.some((e) => e.includes('Tier'))).toBe(true);
  });

  it('returns empty run and no errors for empty input', () => {
    const { run, errors } = parseReport('');
    expect(Object.keys(run)).toHaveLength(0);
    expect(errors).toHaveLength(0);
  });

  it('handles Windows line endings', () => {
    const report = 'Tier\t7\r\nWave\t500\r\nKilled By\tBoss';
    const { run } = parseReport(report);
    expect(run.tier).toBe(7);
    expect(run.wave).toBe(500);
    expect(run.killedBy).toBe('Boss');
  });
});
