import { useEffect, useState } from 'react';
import { CircleCheck as CheckCircle, Clock, Play, TrendingUp, Layers } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { TestRun, TestSuite } from '../types';
import { StatusBadge } from './StatusBadge';

function formatDuration(ms: number) {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.floor(ms / 60000)}m ${Math.round((ms % 60000) / 1000)}s`;
}

function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ label, value, sub, icon, color }: StatCardProps) {
  return (
    <div style={{
      background: 'var(--color-bg-secondary)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12, color: 'var(--color-text-secondary)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {label}
        </span>
        <span style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>{icon}</span>
      </div>
      <div style={{ fontSize: 28, fontWeight: 600, color: 'var(--color-text-primary)' }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{sub}</div>}
    </div>
  );
}

export function Dashboard({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const [runs, setRuns] = useState<TestRun[]>([]);
  const [suites, setSuites] = useState<TestSuite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [runsRes, suitesRes] = await Promise.all([
        supabase.from('test_runs').select('*').order('created_at', { ascending: false }).limit(10),
        supabase.from('test_suites').select('*').order('created_at'),
      ]);
      if (runsRes.data) setRuns(runsRes.data);
      if (suitesRes.data) setSuites(suitesRes.data);
      setLoading(false);
    }
    load();
  }, []);

  const totalRuns = runs.length;
  const passedRuns = runs.filter(r => r.status === 'passed').length;
  const passRate = totalRuns > 0 ? Math.round((passedRuns / totalRuns) * 100) : 0;
  const avgDuration = runs.length > 0
    ? Math.round(runs.reduce((sum, r) => sum + (r.duration_ms || 0), 0) / runs.length)
    : 0;
  const totalScenarios = suites.reduce((sum, s) => sum + s.scenario_count, 0);
  const latestRun = runs[0];

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400 }}>
        <div style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #161b22 0%, #1c2128 100%)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '32px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 24,
      }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 8 }}>
            QA Automation Suite
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 14, maxWidth: 480 }}>
            Cucumber + REST Assured + TestNG framework testing the Beeceptor Echo API with GET and POST request validation.
          </p>
          <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
            {['Cucumber 7.15', 'REST Assured 5.4', 'TestNG 7.9', 'Java 11', 'PicoContainer DI'].map(tag => (
              <span key={tag} style={{
                padding: '3px 10px',
                borderRadius: 20,
                background: 'var(--color-bg-tertiary)',
                border: '1px solid var(--color-border)',
                fontSize: 11,
                color: 'var(--color-text-secondary)',
                fontWeight: 500,
              }}>{tag}</span>
            ))}
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 48, fontWeight: 700, color: passRate >= 90 ? 'var(--color-green-light)' : passRate >= 70 ? 'var(--color-yellow-light)' : 'var(--color-red-light)' }}>
            {passRate}%
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Pass Rate</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <StatCard
          label="Total Runs"
          value={totalRuns}
          sub="All time"
          icon={<Play size={14} color="var(--color-blue-light)" />}
          color="var(--color-blue-muted)"
        />
        <StatCard
          label="Passed Runs"
          value={passedRuns}
          sub={`${passRate}% success rate`}
          icon={<CheckCircle size={14} color="var(--color-green-light)" />}
          color="var(--color-green-muted)"
        />
        <StatCard
          label="Avg Duration"
          value={formatDuration(avgDuration)}
          sub="Per run"
          icon={<Clock size={14} color="var(--color-yellow-light)" />}
          color="var(--color-yellow-muted)"
        />
        <StatCard
          label="Test Scenarios"
          value={totalScenarios}
          sub={`${suites.length} feature files`}
          icon={<Layers size={14} color="#e3b341" />}
          color="rgba(210,153,34,0.15)"
        />
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Recent Runs */}
        <div style={{
          background: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>Recent Runs</span>
            <button
              onClick={() => onNavigate('runs')}
              style={{
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                background: 'transparent',
                color: 'var(--color-text-secondary)',
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              View all
            </button>
          </div>
          <div>
            {runs.slice(0, 5).map((run, i) => (
              <div key={run.id} style={{
                padding: '12px 20px',
                borderBottom: i < Math.min(runs.length, 5) - 1 ? '1px solid var(--color-border-muted)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}>
                <StatusBadge status={run.status} size="sm" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {run.run_name}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                    {run.tags_filter} · {run.triggered_by}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 12, color: 'var(--color-text-primary)' }}>
                    {run.passed_count}/{run.total_scenarios}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                    {timeAgo(run.created_at)}
                  </div>
                </div>
              </div>
            ))}
            {runs.length === 0 && (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 13 }}>
                No runs yet
              </div>
            )}
          </div>
        </div>

        {/* Test Suites */}
        <div style={{
          background: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>Test Suites</span>
            <button
              onClick={() => onNavigate('suites')}
              style={{
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                background: 'transparent',
                color: 'var(--color-text-secondary)',
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              View all
            </button>
          </div>
          {suites.map((suite, i) => (
            <div key={suite.id} style={{
              padding: '16px 20px',
              borderBottom: i < suites.length - 1 ? '1px solid var(--color-border-muted)' : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontWeight: 500, fontSize: 14, color: 'var(--color-text-primary)' }}>
                  {suite.name}
                </span>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: 4,
                  background: 'var(--color-bg-tertiary)',
                  border: '1px solid var(--color-border)',
                  fontSize: 11,
                  color: 'var(--color-text-secondary)',
                  fontFamily: 'monospace',
                }}>
                  {suite.feature_file}
                </span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 12, lineHeight: 1.6 }}>
                {suite.description}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                  {suite.scenario_count} scenarios
                </span>
                <div style={{ display: 'flex', gap: 6 }}>
                  {suite.tags.map(tag => (
                    <span key={tag} style={{
                      padding: '1px 7px',
                      borderRadius: 20,
                      background: 'var(--color-blue-muted)',
                      border: '1px solid var(--color-blue-primary)',
                      fontSize: 11,
                      color: 'var(--color-blue-light)',
                    }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Latest Run Detail */}
      {latestRun && (
        <div style={{
          background: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px 24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <TrendingUp size={16} color="var(--color-blue-light)" />
            <span style={{ fontWeight: 600, fontSize: 14 }}>Latest Run Summary</span>
            <StatusBadge status={latestRun.status} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
            {[
              { label: 'Run Name', value: latestRun.run_name },
              { label: 'Tag Filter', value: latestRun.tags_filter },
              { label: 'Duration', value: formatDuration(latestRun.duration_ms) },
              { label: 'Triggered By', value: latestRun.triggered_by },
              { label: 'Pass Rate', value: latestRun.total_scenarios > 0 ? `${Math.round((latestRun.passed_count / latestRun.total_scenarios) * 100)}%` : 'N/A' },
            ].map(item => (
              <div key={item.label}>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text-primary)' }}>{item.value}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                {latestRun.passed_count} passed · {latestRun.failed_count} failed · {latestRun.skipped_count} skipped
              </span>
            </div>
            <div style={{
              height: 6,
              borderRadius: 3,
              background: 'var(--color-bg-tertiary)',
              overflow: 'hidden',
              display: 'flex',
            }}>
              {latestRun.total_scenarios > 0 && (
                <>
                  <div style={{
                    width: `${(latestRun.passed_count / latestRun.total_scenarios) * 100}%`,
                    background: 'var(--color-green-primary)',
                    transition: 'width 0.5s ease',
                  }} />
                  <div style={{
                    width: `${(latestRun.failed_count / latestRun.total_scenarios) * 100}%`,
                    background: 'var(--color-red-primary)',
                    transition: 'width 0.5s ease',
                  }} />
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
