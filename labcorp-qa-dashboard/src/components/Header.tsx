import { Activity, FlaskConical } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'suites', label: 'Test Suites' },
  { id: 'runs', label: 'Test Runs' },
  { id: 'code', label: 'Code Viewer' },
];

export function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <header style={{
      background: 'var(--color-bg-secondary)',
      borderBottom: '1px solid var(--color-border)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '0 24px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          height: 56,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 8 }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #1f6feb, #388bfd)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <FlaskConical size={16} color="white" />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-text-primary)', lineHeight: 1.2 }}>
                LabCorp QA
              </div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)', lineHeight: 1.2 }}>
                Automation Dashboard
              </div>
            </div>
          </div>

          <nav style={{ display: 'flex', gap: 2, flex: 1 }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: activeTab === tab.id ? 'var(--color-bg-tertiary)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                  fontSize: 13,
                  fontWeight: activeTab === tab.id ? 500 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => {
                  if (activeTab !== tab.id) {
                    (e.target as HTMLButtonElement).style.color = 'var(--color-text-primary)';
                    (e.target as HTMLButtonElement).style.background = 'var(--color-bg-tertiary)';
                  }
                }}
                onMouseLeave={e => {
                  if (activeTab !== tab.id) {
                    (e.target as HTMLButtonElement).style.color = 'var(--color-text-secondary)';
                    (e.target as HTMLButtonElement).style.background = 'transparent';
                  }
                }}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 10px',
              borderRadius: 20,
              background: 'var(--color-green-muted)',
              border: '1px solid var(--color-green-primary)',
            }}>
              <Activity size={12} color="var(--color-green-light)" />
              <span style={{ fontSize: 12, color: 'var(--color-green-light)', fontWeight: 500 }}>
                Beeceptor Echo API
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
