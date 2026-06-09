import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const remove = useCallback((id) => {
    setToasts((prev) => prev.map((t) => t.id === id ? { ...t, exiting: true } : t));
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 300);
  }, []);

  const add = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, exiting: false }]);
    timers.current[id] = setTimeout(() => remove(id), 2000);
  }, [remove]);

  const notify = {
    success: (msg) => add(msg, 'success'),
    error:   (msg) => add(msg, 'error'),
    info:    (msg) => add(msg, 'info'),
    warning: (msg) => add(msg, 'warning'),
  };

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <ToastContainer toasts={toasts} onRemove={remove} />
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

/* ── Inline styles so no extra CSS file needed ── */
const ICONS = {
  success: '✓',
  error:   '✕',
  info:    'ℹ',
  warning: '⚠',
};

const COLORS = {
  success: { bg: '#1a2e1a', border: '#2d5a2d', icon: '#4ade80', text: '#bbf7d0' },
  error:   { bg: '#2e1a1a', border: '#5a2d2d', icon: '#f87171', text: '#fecaca' },
  info:    { bg: '#1a2233', border: '#2d4a6e', icon: '#60a5fa', text: '#bfdbfe' },
  warning: { bg: '#2e2614', border: '#5a4a1a', icon: '#fbbf24', text: '#fef3c7' },
};

const ToastContainer = ({ toasts, onRemove }) => (
  <div style={{
    position: 'fixed', top: '20px', right: '20px',
    zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px',
    pointerEvents: 'none',
  }}>
    {toasts.map((t) => {
      const c = COLORS[t.type] || COLORS.info;
      return (
        <div
          key={t.id}
          onClick={() => onRemove(t.id)}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '12px 16px', borderRadius: '10px', minWidth: '260px', maxWidth: '360px',
            background: c.bg, border: `1px solid ${c.border}`,
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            pointerEvents: 'all', cursor: 'pointer',
            animation: t.exiting
              ? 'toastOut 0.3s ease forwards'
              : 'toastIn 0.3s ease forwards',
          }}
        >
          <span style={{
            width: '24px', height: '24px', borderRadius: '50%',
            background: c.border, color: c.icon,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '13px', fontWeight: 'bold', flexShrink: 0,
          }}>
            {ICONS[t.type]}
          </span>
          <span style={{ fontSize: '13.5px', color: c.text, lineHeight: 1.4 }}>
            {t.message}
          </span>
          {/* progress bar */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0,
            height: '2px', background: c.icon, borderRadius: '0 0 10px 10px',
            animation: t.exiting ? 'none' : 'toastProgress 2s linear forwards',
            width: '100%',
          }} />
        </div>
      );
    })}

    <style>{`
      @keyframes toastIn {
        from { opacity: 0; transform: translateX(40px) scale(0.95); }
        to   { opacity: 1; transform: translateX(0)    scale(1);    }
      }
      @keyframes toastOut {
        from { opacity: 1; transform: translateX(0)    scale(1);    }
        to   { opacity: 0; transform: translateX(40px) scale(0.95); }
      }
      @keyframes toastProgress {
        from { width: 100%; }
        to   { width: 0%;   }
      }
    `}</style>
  </div>
);