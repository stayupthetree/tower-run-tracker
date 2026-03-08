import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseReport } from '../lib/parseReport';
import { addRun, createRunFromPartial } from '../lib/storage';
import { useRunsRefresh } from '../contexts/RunsContext';
import { formatNumber, formatTime, formatDate, formatInteger } from '../lib/formatters';
import type { Run } from '../types/Run';

export function ImportPanel() {
  const navigate = useNavigate();
  const refreshRuns = useRunsRefresh();
  const [rawText, setRawText] = useState('');
  const [parsed, setParsed] = useState<Partial<Run> | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const handleParse = useCallback(() => {
    const { run, errors: parseErrors } = parseReport(rawText);
    setParsed(run);
    setErrors(parseErrors);
  }, [rawText]);

  const handleSave = useCallback(() => {
    if (!parsed) return;
    const full = createRunFromPartial(parsed, { notes: notes.trim() || undefined, rawReport: rawText || undefined });
    addRun(full);
    refreshRuns();
    setRawText('');
    setParsed(null);
    setErrors([]);
    setNotes('');
    navigate('/runs');
  }, [parsed, notes, navigate, refreshRuns]);

  const canSave = parsed != null && typeof parsed.wave === 'number' && parsed.wave > 0;

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6">
      <section className="space-y-2">
        <label htmlFor="paste-area" className="block font-display text-accent-teal font-semibold text-sm uppercase tracking-wider">
          Battle Report
        </label>
        <textarea
          id="paste-area"
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="Paste your Battle Report here (copy from in-game)"
          rows={12}
          className="w-full px-4 py-3 bg-[#111827] border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 font-mono text-sm focus:border-accent-teal focus:ring-1 focus:ring-accent-teal outline-none transition"
          aria-describedby="paste-description"
        />
        <p id="paste-description" className="text-gray-500 text-sm">
          Paste the tab-separated report you copied in-game, then click Parse to preview.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleParse}
            className="px-4 py-2 bg-accent-teal/20 text-accent-teal rounded-lg border border-accent-teal/50 hover:bg-accent-teal/30 font-medium transition"
          >
            Parse
          </button>
        </div>
      </section>

      {errors.length > 0 && (
        <section className="rounded-lg border border-amber-500/50 bg-amber-500/10 p-4">
          <h3 className="font-display text-amber-400 font-semibold text-sm uppercase tracking-wider mb-2">
            Parse warnings ({errors.length})
          </h3>
          <ul className="list-disc list-inside text-gray-300 text-sm space-y-1 font-mono">
            {errors.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        </section>
      )}

      {parsed && (
        <>
          <section className="rounded-lg border border-accent-teal/30 bg-[#111827]/80 p-4 sm:p-5 space-y-4">
            <h3 className="font-display text-accent-teal font-semibold text-sm uppercase tracking-wider">
              Preview
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              {typeof parsed.tier === 'number' && (
                <Stat label="Tier" value={String(parsed.tier)} />
              )}
              {typeof parsed.wave === 'number' && (
                <Stat label="Wave" value={formatInteger(parsed.wave)} />
              )}
              {parsed.killedBy != null && parsed.killedBy !== '' && (
                <Stat label="Killed by" value={parsed.killedBy} />
              )}
              {parsed.battleDate && (
                <Stat label="Date" value={formatDate(parsed.battleDate)} />
              )}
              {typeof parsed.coinsEarned === 'number' && (
                <Stat label="Coins" value={formatNumber(parsed.coinsEarned)} />
              )}
              {typeof parsed.coinsPerHour === 'number' && (
                <Stat label="Coins/hr" value={formatNumber(parsed.coinsPerHour)} />
              )}
              {typeof parsed.coinsPerWave === 'number' && (
                <Stat label="CPW" value={formatNumber(parsed.coinsPerWave)} />
              )}
              {typeof parsed.cellsEarned === 'number' && (
                <Stat label="Cells" value={formatNumber(parsed.cellsEarned)} />
              )}
              {typeof parsed.cellsPerHour === 'number' && (
                <Stat label="Cells/hr" value={formatNumber(parsed.cellsPerHour)} />
              )}
              {typeof parsed.cellsPerWave === 'number' && (
                <Stat label="Cells/wave" value={formatNumber(parsed.cellsPerWave)} />
              )}
              {typeof parsed.realTimeSec === 'number' && (
                <Stat label="Real time" value={formatTime(parsed.realTimeSec)} />
              )}
              {typeof parsed.rerollShardsEarned === 'number' && (
                <Stat label="Reroll shards" value={formatNumber(parsed.rerollShardsEarned)} />
              )}
            </div>
          </section>

          <section className="space-y-2">
            <label htmlFor="notes" className="block font-display text-gray-400 font-semibold text-sm uppercase tracking-wider">
              Notes (optional)
            </label>
            <input
              id="notes"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. First T9 run"
              className="w-full px-4 py-2 bg-[#111827] border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 font-mono text-sm focus:border-accent-teal focus:ring-1 focus:ring-accent-teal outline-none transition"
            />
          </section>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={!canSave}
              className="px-4 py-2 bg-accent-amber/20 text-accent-amber rounded-lg border border-accent-amber/50 hover:bg-accent-amber/30 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
            >
              Parse & Save
            </button>
            {!canSave && parsed && (
              <span className="text-gray-500 text-sm self-center">
                Add a report with at least Wave to save.
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-gray-500 text-xs uppercase tracking-wider">{label}</span>
      <span className="text-gray-100 font-mono">{value}</span>
    </div>
  );
}
