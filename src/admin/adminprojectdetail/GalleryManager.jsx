import { useState }          from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { uploadToSupabase }  from './adminUtils.js';
import { FL, Spinner }       from './AdminPrimitives.jsx';
import { useToast }          from '../../utils/useToast.jsx';

// ─── GalleryManager ───────────────────────────────────────────────────────────
// Props:
//   coverUrl        — current cover image URL (from project.image)
//   onCoverChange   — async (url) => void  — called after cover is replaced
//   onCoverRemove   — async () => void     — called after cover is removed
//   gallery         — string[]             — extra_images array
//   onGalleryChange — (newGallery) => void — updates parent state AND saves to backend
//
// FIX: multi-upload was only updating local state, never persisting to backend.
//      Now onGalleryChange is expected to also save. The parent passes a handler
//      that calls setForm AND immediately fires the save API call.

const GalleryManager = ({ coverUrl, onCoverChange, onCoverRemove, gallery, onGalleryChange }) => {
  const [uploading,    setUploading]    = useState(false);
  const [replacingIdx, setReplacingIdx] = useState(null); // 'cover' | number | null
  const [lightbox,     setLightbox]     = useState(null);
  const notify = useToast();

  // ── Multi-file add ─────────────────────────────────────────────────────────
  // BUG WAS HERE: used to only call onGalleryChange (local state) without saving.
  // Now we upload all files, merge with existing gallery, then call onGalleryChange
  // which the parent must wire to also persist to backend.
  const handleAddGallery = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      // Upload all selected files in parallel
      const urls = await Promise.all(files.map((f) => uploadToSupabase(f, 'gallery')));
      const next = [...gallery, ...urls];
      await onGalleryChange(next); // parent saves to backend immediately
      notify.success(`${urls.length} image${urls.length > 1 ? 's' : ''} added`);
    } catch (err) {
      console.error('Gallery upload failed:', err);
      notify.error('Upload failed — please try again');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  // ── Replace cover ──────────────────────────────────────────────────────────
  const handleReplaceCover = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setReplacingIdx('cover');
    try {
      const url = await uploadToSupabase(file, 'cover');
      await onCoverChange(url);
    } catch {
      notify.error('Cover upload failed');
    } finally {
      setReplacingIdx(null);
      e.target.value = '';
    }
  };

  // ── Replace one gallery image ──────────────────────────────────────────────
  const handleReplaceGallery = async (e, idx) => {
    const file = e.target.files[0];
    if (!file) return;
    setReplacingIdx(idx);
    try {
      const url  = await uploadToSupabase(file, 'gallery');
      const next = [...gallery];
      next[idx]  = url;
      await onGalleryChange(next);
      notify.success('Image replaced');
    } catch {
      notify.error('Replace failed');
    } finally {
      setReplacingIdx(null);
      e.target.value = '';
    }
  };

  // ── Remove one gallery image ───────────────────────────────────────────────
  const handleRemoveGallery = async (idx) => {
    const next = gallery.filter((_, i) => i !== idx);
    await onGalleryChange(next);
  };

  const allImages = [
    ...(coverUrl ? [{ url: coverUrl, type: 'cover' }]           : []),
    ...gallery.map((url, i) => ({ url, type: 'gallery', idx: i })),
  ];

  return (
    <div>
      <FL hint={`${allImages.length} image${allImages.length !== 1 ? 's' : ''} · first image shows as cover`}>
        Images
      </FL>

      {/* Scrollable strip */}
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'none' }}>

        {allImages.map((item) => {
          const isLoading = item.type === 'cover' ? replacingIdx === 'cover' : replacingIdx === item.idx;
          return (
            <div
              key={item.type === 'cover' ? 'cover' : item.idx}
              style={{ position: 'relative', flexShrink: 0, width: 200, height: 140, borderRadius: 10, overflow: 'hidden', border: item.type === 'cover' ? '2px solid var(--adm-accent)' : '1px solid var(--adm-border)', cursor: 'zoom-in' }}
              onClick={() => !isLoading && setLightbox(item.url)}
            >
              <img src={item.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />

              {item.type === 'cover' && (
                <div style={{ position: 'absolute', top: 7, left: 7, padding: '3px 8px', borderRadius: 100, background: 'var(--adm-accent)', color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '0.5px' }}>
                  COVER
                </div>
              )}

              {isLoading && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  <Spinner />
                </div>
              )}

              {!isLoading && (
                <div
                  className="gallery-tile-overlay"
                  style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', opacity: 0, transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                  onClick={(e) => e.stopPropagation()}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.5)'; e.currentTarget.style.opacity = 1; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0)';   e.currentTarget.style.opacity = 0; }}
                >
                  {/* Replace */}
                  <label title="Replace" style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
                    <input
                      type="file" accept="image/*"
                      onChange={item.type === 'cover' ? handleReplaceCover : (e) => handleReplaceGallery(e, item.idx)}
                      style={{ display: 'none' }}
                    />
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </label>

                  {/* Delete */}
                  <button
                    title="Delete"
                    onClick={() => item.type === 'cover' ? onCoverRemove() : handleRemoveGallery(item.idx)}
                    style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(239,68,68,0.25)', border: '1px solid rgba(239,68,68,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#ff9999' }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* Add images tile */}
        <label
          style={{ flexShrink: 0, width: 200, height: 140, borderRadius: 10, border: '1.5px dashed var(--adm-input-border)', background: 'var(--adm-input-bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: uploading ? 'wait' : 'pointer', color: 'var(--adm-text-3)', fontSize: 12, fontWeight: 500, transition: 'all 0.2s' }}
          onMouseEnter={(e) => { if (!uploading) { e.currentTarget.style.borderColor = 'var(--adm-accent)'; e.currentTarget.style.color = 'var(--adm-accent)'; } }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--adm-input-border)'; e.currentTarget.style.color = 'var(--adm-text-3)'; }}
        >
          <input type="file" accept="image/*" multiple onChange={handleAddGallery} style={{ display: 'none' }} disabled={uploading} />
          {uploading ? (
            <><Spinner size={22} color="var(--adm-accent)" /><span>Uploading…</span></>
          ) : (
            <>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              <span>Add images</span>
              <span style={{ fontSize: 11, opacity: 0.6 }}>multi-select ok</span>
            </>
          )}
        </label>
      </div>

      <p style={{ fontSize: 11, color: 'var(--adm-text-3)', marginTop: 8, marginBottom: 0 }}>
        The <strong style={{ color: 'var(--adm-accent)' }}>COVER</strong> image is pinned first and slides in the hero above. Gallery images follow.
      </p>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, cursor: 'zoom-out' }}
          >
            <motion.img
              src={lightbox}
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
              style={{ maxWidth: '100%', maxHeight: '90vh', borderRadius: 12, objectFit: 'contain', cursor: 'default' }}
              onClick={(e) => e.stopPropagation()}
            />
            <button onClick={() => setLightbox(null)} style={{ position: 'fixed', top: 20, right: 20, width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryManager;
