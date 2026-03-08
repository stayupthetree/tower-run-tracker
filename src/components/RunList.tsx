import { useMemo, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadRuns, exportRunsToJson, importRunsFromJson, exportRunsToShareCode, importRunsFromShareCode, deleteRun } from '../lib/storage';
import { useRunsRefresh } from '../contexts/RunsContext';
import type { Run } from '../types/Run';
import { formatNumber, formatTime, formatDate, formatInteger, formatDateTime } from '../lib/formatters';

type SortKey =
  | 'battleDate'
  | 'tier'
  | 'wave'
  | 'killedBy'
  | 'coinsEarned'
  | 'coinsPerWave'
  | 'coinsPerHour'
  | 'cellsEarned'
  | 'rerollShardsEarned'
  | 'realTimeSec';
type SortDir = 'asc' | 'desc';

function compareRuns(a: Run, b: Run, key: SortKey, dir: SortDir): number {
  const mult = dir === 'asc' ? 1 : -1;
  switch (key) {
    case 'battleDate':
      return mult * (
        new Date(a.battleDate || a.savedAt).getTime() -
        new Date(b.battleDate || b.savedAt).getTime()
      );
    case 'tier':
      return mult * (a.tier - b.tier);
    case 'wave':
      return mult * (a.wave - b.wave);
    case 'killedBy':
      return mult * (a.killedBy || '').localeCompare(b.killedBy || '');
    case 'coinsEarned':
      return mult * (a.coinsEarned - b.coinsEarned);
    case 'coinsPerWave':
      return mult * (a.coinsPerWave - b.coinsPerWave);
    case 'coinsPerHour':
      return mult * (a.coinsPerHour - b.coinsPerHour);
    case 'cellsEarned':
      return mult * (a.cellsEarned - b.cellsEarned);
    case 'rerollShardsEarned':
      return mult * (a.rerollShardsEarned - b.rerollShardsEarned);
    case 'realTimeSec':
      return mult * (a.realTimeSec - b.realTimeSec);
    default:
      return 0;
  }
}

const COLUMNS: { key: SortKey; label: string; align?: 'right' }[] = [
  { key: 'battleDate', label: 'Date' },
  { key: 'tier', label: 'Tier' },
  { key: 'wave', label: 'Wave' },
  { key: 'killedBy', label: 'Killed by' },
  { key: 'coinsEarned', label: 'Coins', align: 'right' },
  { key: 'coinsPerWave', label: 'CPW', align: 'right' },
  { key: 'coinsPerHour', label: 'CPH', align: 'right' },
  { key: 'cellsEarned', label: 'Cells', align: 'right' },
  { key: 'rerollShardsEarned', label: 'Reroll shards', align: 'right' },
  { key: 'realTimeSec', label: 'Real time' },
];

export function RunList() {
  const navigate = useNavigate();
  const refreshRuns = useRunsRefresh();
  const [sortKey, setSortKey] = useState<SortKey>('battleDate');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [refresh, setRefresh] = useState(0);
  const [importError, setImportError] = useState<string | null>(null);
  const [shareCodeExport, setShareCodeExport] = useState<string | null>(null);
  const [shareCodeImport, setShareCodeImport] = useState('');
  const [showImportCode, setShowImportCode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const exportCodeRef = useRef<HTMLTextAreaElement>(null);

  const handleExport = useCallback(() => {
    const json = exportRunsToJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tower-runs-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleImport = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setImportError(null);
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          importRunsFromJson(reader.result as string);
          refreshRuns();
          setRefresh((r) => r + 1);
          setImportError(null);
          if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (err) {
          setImportError(err instanceof Error ? err.message : 'Import failed');
        }
      };
      reader.readAsText(file);
    },
    [refreshRuns]
  );

  const handleExportCode = useCallback(() => {
    setShareCodeExport(exportRunsToShareCode());
    setShareCodeImport('');
    setShowImportCode(false);
  }, []);

  const handleCopyExportCode = useCallback(async () => {
    if (!shareCodeExport) return;
    try {
      await navigator.clipboard.writeText(shareCodeExport);
    } catch {
      exportCodeRef.current?.select();
      document.execCommand('copy');
    }
  }, [shareCodeExport]);

  const handleImportFromCode = useCallback(() => {
    setImportError(null);
    try {
      importRunsFromShareCode(shareCodeImport);
      refreshRuns();
      setRefresh((r) => r + 1);
      setShareCodeImport('');
      setShowImportCode(false);
    } catch (err) {
      setImportError(err instanceof Error ? err.message : 'Invalid share code');
    }
  }, [shareCodeImport, refreshRuns]);

  const handleDelete = useCallback((run: Run) => {
    const date = run.battleDate ? formatDate(run.battleDate) : formatDate(run.savedAt);
    if (!window.confirm(`Delete this run? Wave ${formatInteger(run.wave)}, T${run.tier}, ${date}`)) return;
    deleteRun(run.id);
    refreshRuns();
    setRefresh((r) => r + 1);
  }, [refreshRuns]);

  const handleHeaderClick = useCallback(
    (key: SortKey) => {
      if (sortKey === key) {
        setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));
      } else {
        setSortKey(key);
        setSortDir('desc');
      }
    },
    [sortKey]
  );

  const runs = useMemo(() => {
    const list = loadRuns();
    return [...list].sort((a, b) => compareRuns(a, b, sortKey, sortDir));
  }, [sortKey, sortDir, refresh]);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleExport}
          className="px-3 py-2 rounded-lg border border-gray-600 text-gray-300 text-sm hover:bg-gray-800 hover:border-accent-teal/50 transition"
        >
          Export JSON
        </button>
        <label className="px-3 py-2 rounded-lg border border-gray-600 text-gray-300 text-sm hover:bg-gray-800 hover:border-accent-teal/50 transition cursor-pointer">
          Import JSON
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            className="sr-only"
            onChange={handleImport}
            aria-label="Import runs from JSON file"
          />
        </label>
        <button
          type="button"
          onClick={handleExportCode}
          className="px-3 py-2 rounded-lg border border-gray-600 text-gray-300 text-sm hover:bg-gray-800 hover:border-accent-teal/50 transition"
        >
          Export as code
        </button>
        <button
          type="button"
          onClick={() => { setShowImportCode(!showImportCode); setShareCodeExport(null); setImportError(null); }}
          className="px-3 py-2 rounded-lg border border-gray-600 text-gray-300 text-sm hover:bg-gray-800 hover:border-accent-teal/50 transition"
        >
          Import from code
        </button>
        {importError && (
          <span className="text-amber-400 text-sm" role="alert">
            {importError}
          </span>
        )}
      </div>
      <p className="text-gray-500 text-sm">
        Data is stored only in this browser. <strong>Export JSON</strong> or <strong>Export as code</strong> to backup;
        <strong> Import JSON</strong> or <strong>Import from code</strong> on another device to restore.
      </p>

      {shareCodeExport && (
        <div className="rounded-lg border border-accent-teal/30 bg-[#111827]/80 p-4 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-accent-teal text-sm font-medium">Share code — copy and paste to share or restore</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopyExportCode}
                className="px-2 py-1 rounded border border-accent-teal/50 text-accent-teal text-sm hover:bg-accent-teal/10"
              >
                Copy
              </button>
              <button
                type="button"
                onClick={() => setShareCodeExport(null)}
                className="px-2 py-1 rounded border border-gray-600 text-gray-400 text-sm hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
          <textarea
            ref={exportCodeRef}
            readOnly
            value={shareCodeExport}
            className="w-full h-24 px-3 py-2 rounded bg-[#0a0d14] border border-gray-700 text-gray-300 font-mono text-xs"
            aria-label="Share code"
          />
        </div>
      )}

      {showImportCode && (
        <div className="rounded-lg border border-gray-700 bg-[#111827]/80 p-4 space-y-2">
          <span className="text-gray-400 text-sm">Paste a share code to replace your runs with the imported data</span>
          <textarea
            value={shareCodeImport}
            onChange={(e) => setShareCodeImport(e.target.value)}
            placeholder="Paste share code here…"
            className="w-full h-24 px-3 py-2 rounded bg-[#0a0d14] border border-gray-700 text-gray-300 font-mono text-xs placeholder-gray-500"
            aria-label="Paste share code"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleImportFromCode}
              className="px-3 py-2 rounded-lg border border-accent-teal/50 text-accent-teal text-sm hover:bg-accent-teal/10"
            >
              Import from code
            </button>
            <button
              type="button"
              onClick={() => { setShowImportCode(false); setShareCodeImport(''); setImportError(null); }}
              className="px-3 py-2 rounded border border-gray-600 text-gray-400 text-sm hover:bg-gray-800"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {runs.length === 0 ? (
        <p className="text-gray-400">No runs yet. Add runs from Add run, or import a JSON file or paste a share code above.</p>
      ) : (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-gray-700 text-left text-gray-400 font-display uppercase tracking-wider">
            {COLUMNS.map(({ key, label, align }) => (
              <th
                key={key}
                className={`py-3 pr-4 select-none cursor-pointer hover:text-gray-300 transition ${align === 'right' ? 'text-right' : ''}`}
                onClick={() => handleHeaderClick(key)}
                role="columnheader"
                aria-sort={sortKey === key ? (sortDir === 'asc' ? 'ascending' : 'descending') : undefined}
              >
                <span className="inline-flex items-center gap-1">
                  {label}
                  {sortKey === key && (
                    <span className="text-accent-teal" aria-hidden>
                      {sortDir === 'desc' ? '↓' : '↑'}
                    </span>
                  )}
                </span>
              </th>
            ))}
            <th className="py-3 pl-4 max-w-[8rem] truncate text-left font-display uppercase tracking-wider text-gray-400">
              Notes
            </th>
            <th className="py-3 pl-2 w-10 text-left font-display uppercase tracking-wider text-gray-400" aria-label="Delete">
              —
            </th>
          </tr>
        </thead>
        <tbody>
          {runs.map((run) => (
            <tr
              key={run.id}
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/runs/${run.id}`)}
              onKeyDown={(e) => e.key === 'Enter' && navigate(`/runs/${run.id}`)}
              className="border-b border-gray-800 hover:bg-gray-800/50 transition cursor-pointer"
            >
              <td className="py-2 pr-4 font-mono text-gray-300 whitespace-nowrap">
                {formatDateTime(run.battleDate || run.savedAt)}
              </td>
              <td className="py-2 pr-4 font-mono">{run.tier}</td>
              <td className="py-2 pr-4 font-mono">{formatInteger(run.wave)}</td>
              <td className="py-2 pr-4 text-gray-300">{run.killedBy || '—'}</td>
              <td className="py-2 pr-4 font-mono text-right">{formatNumber(run.coinsEarned)}</td>
              <td className="py-2 pr-4 font-mono text-right">{formatNumber(run.coinsPerWave)}</td>
              <td className="py-2 pr-4 font-mono text-right">{formatNumber(run.coinsPerHour)}</td>
              <td className="py-2 pr-4 font-mono text-right">{formatNumber(run.cellsEarned)}</td>
              <td className="py-2 pr-4 font-mono text-right">{formatNumber(run.rerollShardsEarned)}</td>
              <td className="py-2 pr-4 font-mono text-gray-300">{formatTime(run.realTimeSec)}</td>
              <td className="py-2 pl-4 text-gray-500 max-w-[8rem] truncate" title={run.notes}>
                {run.notes || '—'}
              </td>
              <td className="py-2 pl-2" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => handleDelete(run)}
                  className="text-gray-500 hover:text-amber-400 transition p-1 rounded"
                  title="Delete run"
                  aria-label={`Delete run wave ${run.wave} tier ${run.tier}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
      )}
    </div>
  );
}
