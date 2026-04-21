import { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight, Tag, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { TestSuite, TestScenario } from '../types';

interface SuiteWithScenarios extends TestSuite {
  scenarios: TestScenario[];
  expanded: boolean;
}

function StepList({ steps }: { steps: TestScenario['steps'] }) {
  return (
    <div style={{
      background: 'var(--color-bg)',
      borderRadius: 'var(--radius-sm)',
      padding: '12px 16px',
      marginTop: 8,
    }}>
      {steps.map((step, i) => (
        <div key={i} style={{
          display: 'flex',
          gap: 8,
          padding: '3px 0',
          fontSize: 12,
          fontFamily: 'JetBrains Mono, monospace',
          lineHeight: 1.6,
        }}>
          <span style={{
            color: step.keyword === 'Given' ? '#e3b341'
              : step.keyword === 'When' ? 'var(--color-blue-light)'
              : step.keyword === 'Then' ? 'var(--color-green-light)'
              : 'var(--color-text-secondary)',
            fontWeight: 600,
            minWidth: 48,
            display: 'inline-block',
          }}>
            {step.keyword}
          </span>
          <span style={{ color: 'var(--color-text-primary)' }}>{step.text}</span>
        </div>
      ))}
    </div>
  );
}

function ScenarioRow({ scenario }: { scenario: TestScenario }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{
      borderBottom: '1px solid var(--color-border-muted)',
    }}>
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          cursor: 'pointer',
          transition: 'background 0.1s',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-bg-tertiary)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        {expanded
          ? <ChevronDown size={14} color="var(--color-text-muted)" />
          : <ChevronRight size={14} color="var(--color-text-muted)" />
        }
        <span style={{
          fontSize: 12,
          color: 'var(--color-text-muted)',
          fontFamily: 'monospace',
          minWidth: 32,
        }}>
          L{scenario.line_number}
        </span>
        <span style={{ flex: 1, fontSize: 13, color: 'var(--color-text-primary)', fontWeight: 500 }}>
          {scenario.is_outline ? 'Scenario Outline: ' : ''}{scenario.name}
        </span>
        <div style={{ display: 'flex', gap: 6 }}>
          {scenario.tags.map(tag => (
            <span key={tag} style={{
              padding: '1px 7px',
              borderRadius: 20,
              background: tag.includes('smoke') ? 'var(--color-orange-muted)' : 'var(--color-blue-muted)',
              fontSize: 11,
              color: tag.includes('smoke') ? '#e3b341' : 'var(--color-blue-light)',
            }}>{tag}</span>
          ))}
        </div>
      </div>
      {expanded && (
        <div style={{ padding: '0 20px 12px 44px' }}>
          <StepList steps={scenario.steps} />
        </div>
      )}
    </div>
  );
}

export function TestSuites() {
  const [suites, setSuites] = useState<SuiteWithScenarios[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: suitesData } = await supabase
        .from('test_suites')
        .select('*')
        .order('created_at');

      const { data: scenariosData } = await supabase
        .from('test_scenarios')
        .select('*')
        .order('line_number');

      if (suitesData && scenariosData) {
        setSuites(suitesData.map(s => ({
          ...s,
          scenarios: scenariosData.filter(sc => sc.suite_id === s.id),
          expanded: true,
        })));
      }
      setLoading(false);
    }
    load();
  }, []);

  function toggleSuite(id: string) {
    setSuites(prev => prev.map(s => s.id === id ? { ...s, expanded: !s.expanded } : s));
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
        <span style={{ color: 'var(--color-text-muted)' }}>Loading suites...</span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 4 }}>
          Test Suites
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>
          BDD feature files with Cucumber scenarios mapped to REST Assured step definitions
        </p>
      </div>

      {/* API target info */}
      <div style={{
        background: 'var(--color-bg-secondary)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
      }}>
        <div style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: 'var(--color-green-primary)',
          boxShadow: '0 0 6px var(--color-green-primary)',
          flexShrink: 0,
        }} />
        <div>
          <span style={{ fontSize: 12, color: 'var(--color-text-muted)', marginRight: 8 }}>Target API:</span>
          <code style={{
            fontSize: 12,
            color: 'var(--color-blue-light)',
            background: 'var(--color-bg-tertiary)',
            padding: '2px 8px',
            borderRadius: 4,
          }}>
            https://echo.free.beeceptor.com
          </code>
        </div>
        <div style={{ marginLeft: 8 }}>
          <span style={{ fontSize: 12, color: 'var(--color-text-muted)', marginRight: 8 }}>Path:</span>
          <code style={{
            fontSize: 12,
            color: 'var(--color-text-primary)',
            background: 'var(--color-bg-tertiary)',
            padding: '2px 8px',
            borderRadius: 4,
          }}>
            /sample-request?author=beeceptor
          </code>
        </div>
      </div>

      {suites.map(suite => (
        <div key={suite.id} style={{
          background: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
        }}>
          {/* Suite header */}
          <div
            onClick={() => toggleSuite(suite.id)}
            style={{
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              cursor: 'pointer',
              borderBottom: suite.expanded ? '1px solid var(--color-border)' : 'none',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-bg-tertiary)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            {suite.expanded
              ? <ChevronDown size={16} color="var(--color-text-secondary)" />
              : <ChevronRight size={16} color="var(--color-text-secondary)" />
            }
            <FileText size={16} color="var(--color-blue-light)" />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--color-text-primary)' }}>
                  {suite.name}
                </span>
                <code style={{
                  fontSize: 11,
                  color: 'var(--color-text-muted)',
                  background: 'var(--color-bg-tertiary)',
                  padding: '1px 6px',
                  borderRadius: 3,
                }}>
                  {suite.feature_file}
                </code>
              </div>
              <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                {suite.description}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                {suite.scenarios.length} scenarios
              </span>
              <div style={{ display: 'flex', gap: 6 }}>
                {suite.tags.map(tag => (
                  <span key={tag} style={{
                    padding: '2px 8px',
                    borderRadius: 20,
                    background: 'var(--color-blue-muted)',
                    fontSize: 11,
                    color: 'var(--color-blue-light)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}>
                    <Tag size={9} />
                    {tag.replace('@', '')}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Scenarios */}
          {suite.expanded && (
            <div>
              {suite.scenarios.map(scenario => (
                <ScenarioRow key={scenario.id} scenario={scenario} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
