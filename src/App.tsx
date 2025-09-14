import React from 'react'
import Dashboard from './pages/Dashboard'
import Investigator from './pages/Investigator'
import AlertsQueue from './pages/AlertsQueue'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

function App() {
  return (
    <Router>
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-indigo-900 text-white p-6 flex flex-col">
          <h1 className="text-2xl font-bold mb-10">FraudX</h1>
          <nav className="flex flex-col gap-4">
            <Link to="/" className="hover:bg-indigo-700 p-2 rounded">Dashboard</Link>
            <Link to="/alerts" className="hover:bg-indigo-700 p-2 rounded">Alerts Queue</Link>
            <Link to="/investigator" className="hover:bg-indigo-700 p-2 rounded">Investigator</Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-white p-8 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/alerts" element={<AlertsQueue />} />
            <Route path="/investigator" element={<Investigator />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
