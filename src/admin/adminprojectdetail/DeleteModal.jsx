import { motion } from 'motion/react';

const DeleteModal = ({ project, onConfirm, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    onClick={onClose}
    style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      onClick={(e) => e.stopPropagation()}
      style={{ background: 'var(--adm-surface)', border: '1px solid var(--adm-border)', borderRadius: 16, width: '100%', maxWidth: 400, overflow: 'hidden', boxShadow: 'var(--adm-shadow-lg)' }}
    >
      <div style={{ padding: '24px 24px 0', textAlign: 'center' }}>
        <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', fontSize: 22 }}>
          🗑️
        </div>
        <div style={{ fontFamily: 'var(--adm-font-display)', fontWeight: 700, fontSize: 17, color: 'var(--adm-text)', marginBottom: 8 }}>
          Delete Project
        </div>
        <div style={{ fontSize: 14, color: 'var(--adm-text-2)', lineHeight: 1.6 }}>
          Delete <strong style={{ color: 'var(--adm-text)' }}>{project?.p_name}</strong>? This cannot be undone.
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, padding: '20px 24px 24px' }}>
        <button
          onClick={onClose}
          style={{ flex: 1, padding: '11px', borderRadius: 100, border: '1.5px solid var(--adm-border)', background: 'none', color: 'var(--adm-text-2)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--adm-font-body)' }}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          style={{ flex: 1, padding: '11px', borderRadius: 100, border: 'none', background: 'var(--adm-danger)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--adm-font-body)' }}
        >
          Delete
        </button>
      </div>
    </motion.div>
  </motion.div>
);

export default DeleteModal;
