import { NavLink } from 'react-router-dom';
import { loadRuns } from '../lib/storage';
import { useRunsVersion } from '../contexts/RunsContext';

export function Header() {
  useRunsVersion(); // re-render when runs change
  const runCount = loadRuns().length;

  return (
    <header className="border-b border-gray-800 px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <NavLink
          to="/"
          end
          className="font-display text-xl sm:text-2xl text-accent-teal font-semibold tracking-wide hover:opacity-90 transition"
        >
          Tower Run Tracker
        </NavLink>
        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Main">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive
                  ? 'bg-accent-teal/20 text-accent-teal'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/import"
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive
                  ? 'bg-accent-teal/20 text-accent-teal'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
              }`
            }
          >
            Add run
          </NavLink>
          <NavLink
            to="/runs"
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                isActive
                  ? 'bg-accent-teal/20 text-accent-teal'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
              }`
            }
          >
            Runs
            <span
              className="min-w-[1.25rem] h-5 px-1.5 inline-flex items-center justify-center rounded-full bg-gray-700 text-xs font-mono text-gray-300"
              aria-label={`${runCount} runs`}
            >
              {runCount}
            </span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
