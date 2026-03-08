import { Routes, Route } from 'react-router-dom'
import { RunsProvider } from './contexts/RunsContext'
import { Header } from './components/Header'
import { ImportPanel } from './components/ImportPanel'
import { RunList } from './components/RunList'
import { Dashboard } from './components/Dashboard'

function App() {
  return (
    <RunsProvider>
      <div className="min-h-screen bg-dark-bg text-white font-mono">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/import" element={<ImportPanel />} />
            <Route path="/runs" element={<RunList />} />
          </Routes>
        </main>
      </div>
    </RunsProvider>
  )
}

export default App
