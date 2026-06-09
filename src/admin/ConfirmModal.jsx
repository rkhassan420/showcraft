import { useEffect } from 'react';

const ConfirmModal = ({ open, title, message, loading, onCancel, onConfirm }) => {

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onCancel(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9999, padding: '20px',
      }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--adm-surface)',
          border: '1px solid var(--adm-border)',
          borderRadius: '20px',
          padding: '36px 32px',
          maxWidth: '400px', width: '100%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
          animation: 'modalIn 0.25s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        {/* Icon */}
        <div style={{
          width: 52, height: 52, borderRadius: '50%',
          background: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, marginBottom: 18,
        }}>
          🗑
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: '18px', fontWeight: 700,
          color: 'var(--adm-text)',
          margin: '0 0 10px',
        }}>
          {title}
        </h3>

        {/* Message */}
        <p style={{
          fontSize: '14px',
          color: 'var(--adm-text-2)',
          lineHeight: 1.65,
          margin: '0 0 28px',
        }}>
          {message}
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onCancel}
            disabled={loading}
            style={{
              flex: 1, padding: '11px',
              borderRadius: '100px',
              border: '1.5px solid var(--adm-border)',
              background: 'none',
              color: 'var(--adm-text-2)',
              fontSize: '14px', fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--adm-accent)';
              e.currentTarget.style.color = 'var(--adm-accent)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--adm-border)';
              e.currentTarget.style.color = 'var(--adm-text-2)';
            }}
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              flex: 1, padding: '11px',
              borderRadius: '100px',
              border: 'none',
              background: loading ? 'rgba(239,68,68,0.5)' : '#ef4444',
              color: 'white',
              fontSize: '14px', fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'DM Sans, sans-serif',
              transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 4px 14px rgba(239,68,68,0.35)',
            }}
          >
            {loading ? (
              <>
                <span style={{
                  width: 14, height: 14,
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: 'white',
                  borderRadius: '50%',
                  animation: 'spin 0.7s linear infinite',
                  display: 'inline-block',
                }} />
                Deleting...
              </>
            ) : 'Yes, Delete'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.9) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ConfirmModal;
