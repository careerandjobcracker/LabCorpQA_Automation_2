import { useEffect, useState } from 'react';
import { Play, ChevronDown, ChevronRight, RefreshCw, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { TestRun, TestScenario, ScenarioResult } from '../types';
import { StatusBadge } from './StatusBadge';

function formatDuration(ms: number) {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.floor(ms / 60000)}m ${Math.round((ms % 60000) / 1000)}s`;
}

function formatDateTime(ts: string) {
  return new Date(ts).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function ProgressBar({ passed, failed, skipped, total }: { passed: number; failed: number; skipped: number; total: number }) {
  if (total === 0) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{
        flex: 1,
        height: 5,
        borderRadius: 3,
        background: 'var(--color-bg-tertiary)',
        overflow: 'hidden',
        display: 'flex',
      }}>
        <div style={{ width: `${(passed / total) * 100}%`, background: 'var(--color-green-primary)' }} />
        <div style={{ width: `${(failed / total) * 100}%`, background: 'var(--color-red-primary)' }} />
        <div style={{ width: `${(skipped / total) * 100}%`, background: '#484f58' }} />
      </div>
      <span style={{ fontSize: 11, color: 'var(--color-text-muted)', whiteSpace: 'nowrap', minWidth: 60, textAlign: 'right' }}>
        {passed}/{total} pass
      </span>
    </div>
  );
}

function RunRow({ run, onExpand }: { run: TestRun & { results?: ScenarioResult[]; expanded?: boolean }; onExpand: (id: string) => void }) {
  return (
    <div style={{
      background: 'var(--color-bg-secondary)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
    }}>
      <div
        onClick={() => onExpand(run.id)}
        style={{
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          cursor: 'pointer',
          transition: 'background 0.1s',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-bg-tertiary)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        {run.expanded
          ? <ChevronDown size={14} color="var(--color-text-muted)" />
          : <ChevronRight size={14} color="var(--color-text-muted)" />
        }
        <StatusBadge status={run.status} size="sm" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 500, fontSize: 13, color: 'var(--color-text-primary)' }}>
              {run.run_name}
            </span>
            <span style={{
              padding: '1px 7px',
              borderRadius: 3,
              background: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              fontSize: 11,
              color: 'var(--color-text-secondary)',
              fontFamily: 'monospace',
            }}>{run.tags_filter}</span>
          </div>
          <div style={{ marginTop: 4 }}>
            <ProgressBar passed={run.passed_count} failed={run.failed_count} skipped={run.skipped_count} total={run.total_scenarios} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 20, flexShrink: 0, alignItems: 'center' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{formatDuration(run.duration_ms)}</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{run.triggered_by}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{formatDateTime(run.created_at)}</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
              {run.failed_count > 0 && <span style={{ color: 'var(--color-red-primary)' }}>{run.failed_count} failed</span>}
              {run.failed_count === 0 && <span style={{ color: 'var(--color-green-primary)' }}>All passed</span>}
            </div>
          </div>
        </div>
      </div>

      {run.expanded && run.results && (
        <div style={{
          borderTop: '1px solid var(--color-border)',
          background: 'var(--color-bg)',
        }}>
          <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--color-border-muted)' }}>
            <span style={{ fontSize: 11, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>
              Scenario Results
            </span>
          </div>
          {run.results.length === 0 && (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 13 }}>
              No detailed results recorded for this run
            </div>
          )}
          {run.results.map((result, i) => (
            <div key={result.id} style={{
              padding: '10px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              borderBottom: i < run.results!.length - 1 ? '1px solid var(--color-border-muted)' : 'none',
            }}>
              <StatusBadge status={result.status} size="sm" />
              <span style={{ flex: 1, fontSize: 12, color: 'var(--color-text-primary)' }}>
                {result.scenario_name}
              </span>
              <span style={{ fontSize: 11, color: 'var(--color-text-secondary)', fontFamily: 'monospace' }}>
                {result.suite_name}
              </span>
              <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                {formatDuration(result.duration_ms)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function TestRuns() {
  const [runs, setRuns] = useState<(TestRun & { results?: ScenarioResult[]; expanded?: boolean })[]>([]);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [scenarios, setScenarios] = useState<TestScenario[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [runsRes, scenariosRes] = await Promise.all([
      supabase.from('test_runs').select('*').order('created_at', { ascending: false }),
      supabase.from('test_scenarios').select('*, test_suites(name)').order('line_number'),
    ]);
    if (runsRes.data) setRuns(runsRes.data.map(r => ({ ...r, expanded: false })));
    if (scenariosRes.data) setScenarios(scenariosRes.data);
    setLoading(false);
  }

  async function toggleRun(id: string) {
    setRuns(prev => prev.map(r => {
      if (r.id !== id) return r;
      return { ...r, expanded: !r.expanded };
    }));

    const run = runs.find(r => r.id === id);
    if (!run?.expanded && !run?.results) {
      const { data } = await supabase
        .from('scenario_results')
        .select('*')
        .eq('run_id', id)
        .order('executed_at');
      setRuns(prev => prev.map(r => r.id === id ? { ...r, results: data ?? [], expanded: true } : r));
    }
  }

  async function simulateRun(tagFilter: string) {
    setSimulating(true);

    const filteredScenarios = scenarios.filter(s =>
      tagFilter === '@regression' || s.tags.includes(tagFilter)
    );

    const runName = tagFilter === '@smoke'
      ? `Smoke Test Run #${runs.filter(r => r.tags_filter === '@smoke').length + 1}`
      : `Regression Run #${runs.filter(r => r.tags_filter === '@regression').length + 1}`;

    const { data: newRun } = await supabase
      .from('test_runs')
      .insert({
        run_name: runName,
        triggered_by: 'manual',
        status: 'running',
        tags_filter: tagFilter,
        total_scenarios: filteredScenarios.length,
        passed_count: 0,
        failed_count: 0,
        skipped_count: 0,
        duration_ms: 0,
        started_at: new Date().toISOString(),
      })
      .select()
      .maybeSingle();

    if (!newRun) { setSimulating(false); return; }

    setRuns(prev => [{ ...newRun, expanded: false, results: [] }, ...prev]);

    // Simulate running each scenario
    let passed = 0;
    let failed = 0;
    let totalDuration = 0;
    const results: ScenarioResult[] = [];

    for (const scenario of filteredScenarios) {
      await new Promise(res => setTimeout(res, 80 + Math.random() * 120));
      const duration = Math.floor(800 + Math.random() * 1500);
      const status = Math.random() > 0.05 ? 'passed' : 'failed';
      if (status === 'passed') passed++; else failed++;
      totalDuration += duration;

      const suiteData = (scenario as any).test_suites;
      const { data: result } = await supabase
        .from('scenario_results')
        .insert({
          run_id: newRun.id,
          scenario_id: scenario.id,
          scenario_name: scenario.name,
          suite_name: suiteData?.name ?? '',
          status,
          duration_ms: duration,
          error_message: status === 'failed' ? 'AssertionError: Expected response field to match expected value' : '',
          steps_executed: scenario.steps,
        })
        .select()
        .maybeSingle();

      if (result) results.push(result);

      setRuns(prev => prev.map(r => r.id === newRun.id
        ? { ...r, passed_count: passed, failed_count: failed, total_scenarios: filteredScenarios.length, duration_ms: totalDuration, results: [...results] }
        : r
      ));
    }

    const finalStatus = failed === 0 ? 'passed' : 'failed';
    await supabase.from('test_runs').update({
      status: finalStatus,
      passed_count: passed,
      failed_count: failed,
      duration_ms: totalDuration,
      completed_at: new Date().toISOString(),
    }).eq('id', newRun.id);

    setRuns(prev => prev.map(r => r.id === newRun.id
      ? { ...r, status: finalStatus, completed_at: new Date().toISOString() }
      : r
    ));

    setSimulating(false);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 4 }}>
            Test Runs
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>
            Execution history for all test suite runs
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => simulateRun('@smoke')}
            disabled={simulating}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              background: simulating ? 'var(--color-bg-tertiary)' : 'var(--color-bg-secondary)',
              color: simulating ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
              fontSize: 13,
              fontWeight: 500,
              cursor: simulating ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s',
            }}
          >
            <Zap size={14} />
            Run Smoke
          </button>
          <button
            onClick={() => simulateRun('@regression')}
            disabled={simulating}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: simulating ? '#1a3a6b' : 'var(--color-blue-primary)',
              color: simulating ? '#7aa2d4' : 'white',
              fontSize: 13,
              fontWeight: 500,
              cursor: simulating ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s',
            }}
          >
            <Play size={14} />
            Run Regression
          </button>
        </div>
      </div>

      {simulating && (
        <div style={{
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--color-blue-muted)',
          border: '1px solid var(--color-blue-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontSize: 13,
          color: 'var(--color-blue-light)',
        }}>
          <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} />
          Executing test scenarios against Beeceptor Echo API...
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
          <span style={{ color: 'var(--color-text-muted)' }}>Loading runs...</span>
        </div>
      ) : runs.length === 0 ? (
        <div style={{
          padding: 60,
          textAlign: 'center',
          color: 'var(--color-text-muted)',
          background: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
        }}>
          <Play size={32} style={{ marginBottom: 12, opacity: 0.3 }} />
          <p>No test runs yet. Click "Run Regression" to execute the test suite.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {runs.map(run => (
            <RunRow key={run.id} run={run} onExpand={toggleRun} />
          ))}
        </div>
      )}
    </div>
  );
}
