import { useState, useEffect } from 'react'
import './App.css'

interface HealthStatus {
  status: string;
  service: string;
  version: string;
  timestamp: string;
  environment: string;
}

function App() {
  const [apiHealth, setApiHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

  useEffect(() => {
    fetch(`${backendUrl}/health`)
      .then(res => res.json())
      .then(data => {
        setApiHealth(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Backend API is not running');
        setLoading(false);
        console.error('Failed to fetch API health:', err);
      });
  }, [backendUrl]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Finance4All</h1>
        <p className="tagline">Your Personal Finance Management Platform</p>
      </header>

      <main className="app-main">
        <section className="status-card">
          <h2>System Status</h2>
          <div className="status-grid">
            <div className="status-item">
              <span className="status-label">Frontend:</span>
              <span className="status-value status-ok">Running</span>
            </div>
            <div className="status-item">
              <span className="status-label">Backend API:</span>
              {loading && <span className="status-value status-loading">Checking...</span>}
              {!loading && apiHealth && (
                <span className="status-value status-ok">{apiHealth.status}</span>
              )}
              {!loading && error && (
                <span className="status-value status-error">{error}</span>
              )}
            </div>
            {apiHealth && (
              <>
                <div className="status-item">
                  <span className="status-label">API Version:</span>
                  <span className="status-value">{apiHealth.version}</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Environment:</span>
                  <span className="status-value">{apiHealth.environment}</span>
                </div>
              </>
            )}
          </div>
        </section>

        <section className="features-card">
          <h2>Coming Soon</h2>
          <ul className="features-list">
            <li>Real-time Net Worth Tracking</li>
            <li>30-Year Financial Projections</li>
            <li>Smart Cash Flow Analysis</li>
            <li>Investment Portfolio Management</li>
            <li>Budget Management & Alerts</li>
            <li>AI Financial Advisor</li>
          </ul>
        </section>

        <section className="tech-stack">
          <h3>Built with Modern Technology</h3>
          <div className="tech-badges">
            <span className="badge">React 18</span>
            <span className="badge">TypeScript</span>
            <span className="badge">Vite</span>
            <span className="badge">Node.js 20</span>
            <span className="badge">Express</span>
            <span className="badge">GraphQL</span>
            <span className="badge">PostgreSQL</span>
            <span className="badge">Google Cloud</span>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <p>Finance4All v0.1.0 | Phase 0: Infrastructure Setup</p>
      </footer>
    </div>
  )
}

export default App
