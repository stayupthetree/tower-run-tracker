import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

type RunsContextValue = {
  runsVersion: number;
  refreshRuns: () => void;
};

const RunsContext = createContext<RunsContextValue>({
  runsVersion: 0,
  refreshRuns: () => {},
});

export function RunsProvider({ children }: { children: ReactNode }) {
  const [runsVersion, setRunsVersion] = useState(0);
  const refreshRuns = useCallback(() => setRunsVersion((v) => v + 1), []);
  return (
    <RunsContext.Provider value={{ runsVersion, refreshRuns }}>
      {children}
    </RunsContext.Provider>
  );
}

export function useRunsRefresh() {
  return useContext(RunsContext).refreshRuns;
}

export function useRunsVersion() {
  return useContext(RunsContext).runsVersion;
}
