interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

const statusConfig: Record<string, { bg: string; color: string; label: string; dot: string }> = {
  passed: {
    bg: 'var(--color-green-muted)',
    color: 'var(--color-green-light)',
    dot: 'var(--color-green-primary)',
    label: 'Passed',
  },
  failed: {
    bg: 'var(--color-red-muted)',
    color: 'var(--color-red-light)',
    dot: 'var(--color-red-primary)',
    label: 'Failed',
  },
  pending: {
    bg: 'var(--color-yellow-muted)',
    color: 'var(--color-yellow-light)',
    dot: 'var(--color-yellow-primary)',
    label: 'Pending',
  },
  running: {
    bg: 'var(--color-blue-muted)',
    color: 'var(--color-blue-light)',
    dot: 'var(--color-blue-primary)',
    label: 'Running',
  },
  skipped: {
    bg: 'rgba(110,118,129,0.2)',
    color: '#8b949e',
    dot: '#6e7681',
    label: 'Skipped',
  },
  aborted: {
    bg: 'var(--color-orange-muted)',
    color: '#e3b341',
    dot: 'var(--color-orange-primary)',
    label: 'Aborted',
  },
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status] ?? statusConfig.pending;
  const isSmall = size === 'sm';

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: isSmall ? 4 : 5,
      padding: isSmall ? '2px 7px' : '3px 9px',
      borderRadius: 20,
      background: config.bg,
      fontSize: isSmall ? 11 : 12,
      fontWeight: 500,
      color: config.color,
      whiteSpace: 'nowrap',
    }}>
      <span style={{
        width: isSmall ? 5 : 6,
        height: isSmall ? 5 : 6,
        borderRadius: '50%',
        background: config.dot,
        display: 'inline-block',
        flexShrink: 0,
      }} />
      {config.label}
    </span>
  );
}
