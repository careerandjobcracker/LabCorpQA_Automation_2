import { useState } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { TestSuites } from './components/TestSuites';
import { TestRuns } from './components/TestRuns';
import { CodeViewer } from './components/CodeViewer';
import './index.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '32px 24px',
      }}>
        {activeTab === 'dashboard' && <Dashboard onNavigate={setActiveTab} />}
        {activeTab === 'suites' && <TestSuites />}
        {activeTab === 'runs' && <TestRuns />}
        {activeTab === 'code' && <CodeViewer />}
      </main>
    </div>
  );
}
