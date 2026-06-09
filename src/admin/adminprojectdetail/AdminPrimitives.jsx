import { useState } from 'react';
import { motion }   from 'motion/react';
import { TAG_COLORS } from './adminStyles.js';

// ─── Field Label ──────────────────────────────────────────────────────────────
export const FL = ({ children, hint }) => (
  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
    <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--adm-text-3)' }}>
      {children}
    </span>
    {hint && <span style={{ fontSize: 11, color: 'var(--adm-text-3)' }}>{hint}</span>}
  </div>
);

// ─── Spinner ──────────────────────────────────────────────────────────────────
export const Spinner = ({ size = 16, color = 'currentColor' }) => (
  <div style={{
    width: size, height: size,
    border: `2px solid ${color}`,
    borderTopColor: 'transparent',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
    flexShrink: 0,
  }} />
);

// ─── Card ─────────────────────────────────────────────────────────────────────
export const Card = ({ icon, title, children, delay = 0, badge }) => (
  <motion.div
    className="adm-card"
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, delay }}
  >
    <div className="adm-card-header">
      <div className="adm-card-title">{icon} {title}</div>
      {badge && <span className="admin-page-badge">{badge}</span>}
    </div>
    <div className="adm-card-body">{children}</div>
  </motion.div>
);

// ─── Tag Input ────────────────────────────────────────────────────────────────
export const TagInput = ({ label, placeholder, items, onChange, color = 'accent' }) => {
  const [val, setVal] = useState('');
  const c = TAG_COLORS[color] || TAG_COLORS.accent;

  const add = () => {
    const t = val.trim();
    if (t && !items.includes(t)) onChange([...items, t]);
    setVal('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--adm-text-3)' }}>
        {label}
      </span>
      <div
        style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: '10px 12px', background: 'var(--adm-input-bg)', border: '1.5px solid var(--adm-input-border)', borderRadius: 10, minHeight: 46, alignItems: 'center' }}
        onFocusCapture={(e) => e.currentTarget.style.borderColor = 'var(--adm-accent)'}
        onBlurCapture={(e)  => e.currentTarget.style.borderColor = 'var(--adm-input-border)'}
      >
        {items.map((item, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px 4px 12px', borderRadius: 100, background: c.bg, color: c.text, border: `1px solid ${c.border}`, fontSize: 12, fontWeight: 600 }}>
            {item}
            <button
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 15, lineHeight: 1, color: c.text, opacity: 0.7 }}
            >×</button>
          </span>
        ))}
        <input
          type="text"
          value={val}
          placeholder={items.length === 0 ? placeholder : ''}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          style={{ flex: 1, minWidth: 100, border: 'none', outline: 'none', background: 'transparent', fontSize: 13, color: 'var(--adm-text)', fontFamily: 'var(--adm-font-body)' }}
        />
      </div>
      <span style={{ fontSize: 11, color: 'var(--adm-text-3)' }}>Press Enter to add</span>
    </div>
  );
};
