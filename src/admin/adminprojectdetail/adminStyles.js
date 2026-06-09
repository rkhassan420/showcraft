// ─── Input styles ─────────────────────────────────────────────────────────────
export const IS = {
  width: '100%',
  padding: '11px 14px',
  background: 'var(--adm-input-bg)',
  border: '1.5px solid var(--adm-input-border)',
  borderRadius: 10,
  color: 'var(--adm-text)',
  fontSize: 14,
  outline: 'none',
  fontFamily: 'var(--adm-font-body)',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box',
};

export const TS = {
  ...IS,
  resize: 'vertical',
  lineHeight: 1.7,
};

// ─── Status config ────────────────────────────────────────────────────────────
export const STATUS_COLORS = {
  'Live':        '#10b981',
  'In Progress': '#f59e0b',
  'Completed':   '#6c63ff',
  'Archived':    '#9ca3af',
  'Open Source': '#a855f7',
};

export const STATUS_OPTIONS = ['', 'Live', 'In Progress', 'Completed', 'Archived', 'Open Source'];

// ─── Tag color map ────────────────────────────────────────────────────────────
export const TAG_COLORS = {
  accent: { bg: 'var(--adm-accent-light)', text: 'var(--adm-accent)',  border: 'var(--adm-accent-border)' },
  purple: { bg: 'rgba(168,85,247,0.10)',   text: '#a855f7',            border: 'rgba(168,85,247,0.25)'    },
  green:  { bg: 'rgba(16,185,129,0.10)',   text: '#10b981',            border: 'rgba(16,185,129,0.25)'    },
};
