// import './admin.css';
// import { useState, useEffect, useRef, useCallback } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'motion/react';
// import AdminSidebar from './AdminSidebar.jsx';
// import Headertheme from './Headertheme.jsx';
// import { supabase } from './supabaseClient.js';
// import { useAuth } from '../AuthContext.jsx';
// import axiosInstance from '../utils/axiosInstance.js';
// import { useToast } from '../utils/useToast.jsx';

// // ─── upload helper ────────────────────────────────────────────────────────────
// const uploadToSupabase = async (file, prefix = 'img') => {
//   const path = `${prefix}-${Date.now()}.${file.name.split('.').pop()}`;
//   const { error } = await supabase.storage.from('portfolio').upload(path, file);
//   if (error) throw error;
//   return supabase.storage.from('portfolio').getPublicUrl(path).data.publicUrl;
// };

// // ─── Tag Input ────────────────────────────────────────────────────────────────
// const TagInput = ({ label, placeholder, items, onChange, color = 'accent' }) => {
//   const [val, setVal] = useState('');
//   const c = {
//     accent: { bg: 'var(--adm-accent-light)', text: 'var(--adm-accent)', border: 'var(--adm-accent-border)' },
//     purple: { bg: 'rgba(168,85,247,0.10)', text: '#a855f7', border: 'rgba(168,85,247,0.25)' },
//     green:  { bg: 'rgba(16,185,129,0.10)', text: '#10b981', border: 'rgba(16,185,129,0.25)' },
//   }[color];
//   const add = () => { const t = val.trim(); if (t && !items.includes(t)) onChange([...items, t]); setVal(''); };
//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
//       <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--adm-text-3)' }}>{label}</span>
//       <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: '10px 12px', background: 'var(--adm-input-bg)', border: '1.5px solid var(--adm-input-border)', borderRadius: 10, minHeight: 46, alignItems: 'center' }}
//         onFocusCapture={(e) => e.currentTarget.style.borderColor = 'var(--adm-accent)'}
//         onBlurCapture={(e) => e.currentTarget.style.borderColor = 'var(--adm-input-border)'}
//       >
//         {items.map((item, i) => (
//           <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px 4px 12px', borderRadius: 100, background: c.bg, color: c.text, border: `1px solid ${c.border}`, fontSize: 12, fontWeight: 600 }}>
//             {item}
//             <button onClick={() => onChange(items.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 15, lineHeight: 1, color: c.text, opacity: 0.7 }}>×</button>
//           </span>
//         ))}
//         <input type="text" value={val} placeholder={items.length === 0 ? placeholder : ''}
//           onChange={(e) => setVal(e.target.value)}
//           onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
//           style={{ flex: 1, minWidth: 100, border: 'none', outline: 'none', background: 'transparent', fontSize: 13, color: 'var(--adm-text)', fontFamily: 'var(--adm-font-body)' }} />
//       </div>
//       <span style={{ fontSize: 11, color: 'var(--adm-text-3)' }}>Press Enter to add</span>
//     </div>
//   );
// };

// const FL = ({ children, hint }) => (
//   <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
//     <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--adm-text-3)' }}>{children}</span>
//     {hint && <span style={{ fontSize: 11, color: 'var(--adm-text-3)' }}>{hint}</span>}
//   </div>
// );

// const IS = { width: '100%', padding: '11px 14px', background: 'var(--adm-input-bg)', border: '1.5px solid var(--adm-input-border)', borderRadius: 10, color: 'var(--adm-text)', fontSize: 14, outline: 'none', fontFamily: 'var(--adm-font-body)', transition: 'border-color 0.2s', boxSizing: 'border-box' };
// const TS = { ...IS, resize: 'vertical', lineHeight: 1.7 };

// const Card = ({ icon, title, children, delay = 0, badge }) => (
//   <motion.div className="adm-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay }}>
//     <div className="adm-card-header">
//       <div className="adm-card-title">{icon} {title}</div>
//       {badge && <span className="admin-page-badge">{badge}</span>}
//     </div>
//     <div className="adm-card-body">{children}</div>
//   </motion.div>
// );

// // ─── Hero Slideshow ───────────────────────────────────────────────────────────
// const HeroSlideshow = ({ slides, projectName, projectSkills }) => {
//   const [active, setActive] = useState(0);
//   const timerRef = useRef(null);

//   const go = useCallback((idx) => {
//     setActive((idx + slides.length) % slides.length);
//   }, [slides.length]);

//   useEffect(() => {
//     if (slides.length < 2) return;
//     timerRef.current = setInterval(() => go(active + 1), 3500);
//     return () => clearInterval(timerRef.current);
//   }, [active, slides.length, go]);

//   if (slides.length === 0) return (
//     <div style={{ width: '100%', height: 350, borderRadius: 16, border: '1px solid var(--adm-border)', background: 'var(--adm-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
//       <span style={{ fontSize: 32 }}>🖼️</span>
//       <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>Add images in the gallery below</span>
//     </div>
//   );

//   return (
//     <div style={{ position: 'relative', width: '100%', height: 400, borderRadius: 16, overflow: 'hidden', border: '1px solid var(--adm-border)' }}>
//       <AnimatePresence mode="wait">
//         <motion.div
//           key={active}
//           initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//           transition={{ duration: 0.5 }}
//           style={{ position: 'absolute', inset: 0, backgroundImage: `url(${slides[active]})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat:'no-repeat' }}
//         />
//       </AnimatePresence>

//       <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.05) 55%)' }} />

//       <div style={{ position: 'absolute', bottom: 20, left: 24, right: 24, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
//         <div>
//           <div style={{ fontFamily: 'var(--adm-font-display)', fontSize: 22, fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: 4, textShadow: '0 1px 6px rgba(0,0,0,0.4)' }}>
//             {projectName}
//           </div>
//           <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{projectSkills}</div>
//         </div>

//         {slides.length > 1 && (
//           <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
//             {slides.map((_, i) => (
//               <button key={i} onClick={() => { clearInterval(timerRef.current); go(i); }}
//                 style={{ width: i === active ? 20 : 7, height: 7, borderRadius: 100, border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.3s', background: i === active ? '#fff' : 'rgba(255,255,255,0.4)' }} />
//             ))}
//           </div>
//         )}
//       </div>

//       {slides.length > 1 && <>
//         <button onClick={() => { clearInterval(timerRef.current); go(active - 1); }}
//           style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 34, height: 34, borderRadius: '50%', background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
//           onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.6)'}
//           onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.35)'}>
//           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
//         </button>
//         <button onClick={() => { clearInterval(timerRef.current); go(active + 1); }}
//           style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', width: 34, height: 34, borderRadius: '50%', background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
//           onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.6)'}
//           onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.35)'}>
//           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
//         </button>
//       </>}

//       {slides.length > 1 && (
//         <div style={{ position: 'absolute', top: 14, right: 14, padding: '4px 10px', borderRadius: 100, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: 11, fontWeight: 600 }}>
//           {active + 1} / {slides.length}
//         </div>
//       )}
//     </div>
//   );
// };

// // ─── Full Screen Image Slider ───────────────────────────────────────────────
// const FullScreenImageSlider = ({ slides, isOpen, onClose, initialIndex = 0 }) => {
//   const [active, setActive] = useState(initialIndex);
//   const [showThumbs, setShowThumbs] = useState(true);

//   if (!isOpen || slides.length === 0) return null;

//   const go = (idx) => setActive((idx + slides.length) % slides.length);

//   const handleKeyDown = useCallback((e) => {
//     if (e.key === 'ArrowLeft') go(active - 1);
//     if (e.key === 'ArrowRight') go(active + 1);
//     if (e.key === 'Escape') onClose();
//   }, [active, onClose]);

//   useEffect(() => {
//     if (isOpen) {
//       window.addEventListener('keydown', handleKeyDown);
//       document.body.style.overflow = 'hidden';
//     }
//     return () => {
//       window.removeEventListener('keydown', handleKeyDown);
//       document.body.style.overflow = 'unset';
//     };
//   }, [isOpen, handleKeyDown]);

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       style={{
//         position: 'fixed',
//         inset: 0,
//         zIndex: 10000,
//         background: '#000',
//         display: 'flex',
//         flexDirection: 'column',
//       }}
//       onClick={onClose}
//     >
//       {/* Top Bar */}
//       <div style={{
//         position: 'absolute',
//         top: 0, left: 0, right: 0,
//         padding: '16px 24px',
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         zIndex: 10,
//         background: 'rgba(0,0,0,0.6)',
//         backdropFilter: 'blur(8px)'
//       }}>
//         <div style={{ color: '#fff', fontSize: 15 }}>
//           {active + 1} / {slides.length}
//         </div>
//         <div style={{ display: 'flex', gap: 12 }}>
//           <button
//             onClick={(e) => { e.stopPropagation(); setShowThumbs(!showThumbs); }}
//             style={{ color: '#fff', background: 'rgba(255,255,255,0.1)', border: 'none', padding: '6px 12px', borderRadius: 8, cursor: 'pointer' }}
//           >
//             {showThumbs ? 'Hide Thumbs' : 'Show Thumbs'}
//           </button>
//           <button
//             onClick={onClose}
//             style={{ color: '#fff', background: 'rgba(255,255,255,0.1)', border: 'none', width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', fontSize: 20 }}
//           >
//             ×
//           </button>
//         </div>
//       </div>

//       {/* Main Image */}
//       <div 
//         style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         <AnimatePresence mode="wait">
//           <motion.img
//             key={active}
//             src={slides[active]}
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 1.05 }}
//             transition={{ duration: 0.4 }}
//             style={{
//               maxWidth: '100%',
//               maxHeight: '100%',
//               objectFit: 'contain',
//               userSelect: 'none'
//             }}
//             draggable={false}
//           />
//         </AnimatePresence>

//         {/* Navigation Arrows */}
//         {slides.length > 1 && (
//           <>
//             <button
//               onClick={(e) => { e.stopPropagation(); go(active - 1); }}
//               style={{
//                 position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)',
//                 width: 50, height: 50, borderRadius: '50%', background: 'rgba(0,0,0,0.5)',
//                 border: 'none', color: '#fff', fontSize: 28, cursor: 'pointer', zIndex: 5
//               }}
//             >
//               ←
//             </button>
//             <button
//               onClick={(e) => { e.stopPropagation(); go(active + 1); }}
//               style={{
//                 position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)',
//                 width: 50, height: 50, borderRadius: '50%', background: 'rgba(0,0,0,0.5)',
//                 border: 'none', color: '#fff', fontSize: 28, cursor: 'pointer', zIndex: 5
//               }}
//             >
//               →
//             </button>
//           </>
//         )}
//       </div>

//       {/* Thumbnails */}
//       {showThumbs && slides.length > 1 && (
//         <div style={{
//           padding: '12px 24px',
//           background: 'rgba(0,0,0,0.8)',
//           borderTop: '1px solid rgba(255,255,255,0.1)',
//           overflowX: 'auto',
//           whiteSpace: 'nowrap',
//           display: 'flex',
//           gap: 8
//         }}>
//           {slides.map((url, i) => (
//             <img
//               key={i}
//               src={url}
//               alt={`slide ${i}`}
//               onClick={(e) => { e.stopPropagation(); setActive(i); }}
//               style={{
//                 width: 80,
//                 height: 60,
//                 objectFit: 'cover',
//                 borderRadius: 6,
//                 border: i === active ? '2px solid #fff' : '2px solid transparent',
//                 cursor: 'pointer',
//                 opacity: i === active ? 1 : 0.6,
//                 transition: 'all 0.2s'
//               }}
//             />
//           ))}
//         </div>
//       )}
//     </motion.div>
//   );
// };

// // ─── Gallery Manager ──────────────────────────────────────────────────────────
// const GalleryManager = ({ coverUrl, onCoverChange, onCoverRemove, gallery, onGalleryChange }) => {
//   const [uploading, setUploading] = useState(false);
//   const [replacingIdx, setReplacingIdx] = useState(null);
//   const [lightbox, setLightbox] = useState(null);
//   const notify = useToast();

//   const handleAddGallery = async (e) => {
//     const files = Array.from(e.target.files); if (!files.length) return;
//     setUploading(true);
//     try {
//       const urls = await Promise.all(files.map(f => uploadToSupabase(f, 'gallery')));
//       onGalleryChange([...gallery, ...urls]);
//     } catch { notify.error('Upload failed'); }
//     finally { setUploading(false); e.target.value = ''; }
//   };

//   const handleReplaceCover = async (e) => {
//     const file = e.target.files[0]; if (!file) return;
//     setReplacingIdx('cover');
//     try {
//       const url = await uploadToSupabase(file, 'cover');
//       await onCoverChange(url);
//     } catch { notify.error('Upload failed'); }
//     finally { setReplacingIdx(null); e.target.value = ''; }
//   };

//   const handleReplaceGallery = async (e, idx) => {
//     const file = e.target.files[0]; if (!file) return;
//     setReplacingIdx(idx);
//     try {
//       const url = await uploadToSupabase(file, 'gallery');
//       const next = [...gallery]; next[idx] = url; onGalleryChange(next);
//     } catch { notify.error('Upload failed'); }
//     finally { setReplacingIdx(null); e.target.value = ''; }
//   };

//   const allImages = [
//     ...(coverUrl ? [{ url: coverUrl, type: 'cover' }] : []),
//     ...gallery.map((url, i) => ({ url, type: 'gallery', idx: i })),
//   ];

//   const Spinner = () => <div style={{ width: 16, height: 16, border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />;

//   return (
//     <div>
//       <FL hint={`${allImages.length} image${allImages.length !== 1 ? 's' : ''} · first image shows as cover`}>Images</FL>

//       <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'none' }}>
//         {allImages.map((item) => {
//           const isLoading = item.type === 'cover' ? replacingIdx === 'cover' : replacingIdx === item.idx;
//           return (
//             <div key={item.type === 'cover' ? 'cover' : item.idx}
//               style={{ position: 'relative', flexShrink: 0, width: 200, height: 140, borderRadius: 10, overflow: 'hidden', border: item.type === 'cover' ? '2px solid var(--adm-accent)' : '1px solid var(--adm-border)', cursor: 'zoom-in' }}
//               onClick={() => !isLoading && setLightbox(item.url)}
//             >
//               <img src={item.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />

//               {item.type === 'cover' && (
//                 <div style={{ position: 'absolute', top: 7, left: 7, padding: '3px 8px', borderRadius: 100, background: 'var(--adm-accent)', color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '0.5px' }}>
//                   COVER
//                 </div>
//               )}

//               {isLoading && (
//                 <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
//                   <Spinner />
//                 </div>
//               )}

//               {!isLoading && (
//                 <div className="gallery-tile-overlay"
//                   style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', opacity: 0, transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
//                   onClick={(e) => e.stopPropagation()}
//                   onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.5)'; e.currentTarget.style.opacity = 1; }}
//                   onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0)'; e.currentTarget.style.opacity = 0; }}
//                 >
//                   <label title="Replace" style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
//                     <input type="file" accept="image/*" onChange={item.type === 'cover' ? handleReplaceCover : (e) => handleReplaceGallery(e, item.idx)} style={{ display: 'none' }} />
//                     <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
//                   </label>
//                   <button title="Delete" onClick={() => item.type === 'cover' ? onCoverRemove() : onGalleryChange(gallery.filter((_, i) => i !== item.idx))}
//                     style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(239,68,68,0.25)', border: '1px solid rgba(239,68,68,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#ff9999' }}>
//                     <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
//                   </button>
//                 </div>
//               )}
//             </div>
//           );
//         })}

//         <label style={{ flexShrink: 0, width: 200, height: 140, borderRadius: 10, border: '1.5px dashed var(--adm-input-border)', background: 'var(--adm-input-bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: uploading ? 'wait' : 'pointer', color: 'var(--adm-text-3)', fontSize: 12, fontWeight: 500, transition: 'all 0.2s' }}
//           onMouseEnter={(e) => { if (!uploading) { e.currentTarget.style.borderColor = 'var(--adm-accent)'; e.currentTarget.style.color = 'var(--adm-accent)'; } }}
//           onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--adm-input-border)'; e.currentTarget.style.color = 'var(--adm-text-3)'; }}
//         >
//           <input type="file" accept="image/*" multiple onChange={handleAddGallery} style={{ display: 'none' }} disabled={uploading} />
//           {uploading
//             ? <><div style={{ width: 22, height: 22, border: '2.5px solid var(--adm-accent)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /><span>Uploading…</span></>
//             : <><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg><span>Add images</span><span style={{ fontSize: 11, opacity: 0.6 }}>multi-select ok</span></>
//           }
//         </label>
//       </div>

//       <p style={{ fontSize: 11, color: 'var(--adm-text-3)', marginTop: 8, marginBottom: 0 }}>
//         The <strong style={{ color: 'var(--adm-accent)' }}>COVER</strong> image is pinned first and slides in the hero above. Gallery images follow.
//       </p>

//       <AnimatePresence>
//         {lightbox && (
//           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//             onClick={() => setLightbox(null)}
//             style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, cursor: 'zoom-out' }}>
//             <motion.img src={lightbox} initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} transition={{ duration: 0.2 }}
//               style={{ maxWidth: '100%', maxHeight: '90vh', borderRadius: 12, objectFit: 'contain', cursor: 'default' }}
//               onClick={(e) => e.stopPropagation()} />
//             <button onClick={() => setLightbox(null)} style={{ position: 'fixed', top: 20, right: 20, width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// // ─── Delete Modal ─────────────────────────────────────────────────────────────
// const DeleteModal = ({ project, onConfirm, onClose }) => (
//   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//     onClick={onClose}
//     style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
//     <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
//       onClick={(e) => e.stopPropagation()}
//       style={{ background: 'var(--adm-surface)', border: '1px solid var(--adm-border)', borderRadius: 16, width: '100%', maxWidth: 400, overflow: 'hidden', boxShadow: 'var(--adm-shadow-lg)' }}>
//       <div style={{ padding: '24px 24px 0', textAlign: 'center' }}>
//         <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', fontSize: 22 }}>🗑️</div>
//         <div style={{ fontFamily: 'var(--adm-font-display)', fontWeight: 700, fontSize: 17, color: 'var(--adm-text)', marginBottom: 8 }}>Delete Project</div>
//         <div style={{ fontSize: 14, color: 'var(--adm-text-2)', lineHeight: 1.6 }}>
//           Delete <strong style={{ color: 'var(--adm-text)' }}>{project?.p_name}</strong>? This cannot be undone.
//         </div>
//       </div>
//       <div style={{ display: 'flex', gap: 10, padding: '20px 24px 24px' }}>
//         <button onClick={onClose} style={{ flex: 1, padding: '11px', borderRadius: 100, border: '1.5px solid var(--adm-border)', background: 'none', color: 'var(--adm-text-2)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--adm-font-body)' }}>Cancel</button>
//         <button onClick={onConfirm} style={{ flex: 1, padding: '11px', borderRadius: 100, border: 'none', background: 'var(--adm-danger)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--adm-font-body)' }}>Delete</button>
//       </div>
//     </motion.div>
//   </motion.div>
// );

// // ─── Main Component ───────────────────────────────────────────────────────────
// const AdminProjectDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { username, isLoggedIn } = useAuth();
//   const notify = useToast();

//   const [project, setProject] = useState(null);
//   const [saving, setSaving] = useState(false);
//   const [deleting, setDeleting] = useState(false);
//   const [fetching, setFetching] = useState(true);
//   const [showDelete, setShowDelete] = useState(false);
//   const [editingBase, setEditingBase] = useState(false);
//   const [savingBase, setSavingBase] = useState(false);
//   const [editForm, setEditForm] = useState({ p_name: '', p_skills: '', p_url: '' });

//   const [form, setForm] = useState({
//     intro: '', description: '', developer: '', github_url: '',
//     status: '', tech_stack: [], features: [], future: [], gallery: [],
//   });

//   // New state for full screen slider
//   const [showFullScreenSlider, setShowFullScreenSlider] = useState(false);
//   const [sliderInitialIndex, setSliderInitialIndex] = useState(0);

//   const statusColors = { 'Live': '#10b981', 'In Progress': '#f59e0b', 'Completed': '#6c63ff', 'Archived': '#9ca3af', 'Open Source': '#a855f7' };
//   const statusOptions = ['', 'Live', 'In Progress', 'Completed', 'Archived', 'Open Source'];

//   // Fetch data
//   useEffect(() => {
//     if (!isLoggedIn || !username) return;
//     (async () => {
//       setFetching(true);
//       try {
//         const res = await axiosInstance.get('/get-projects-info/', { params: { username } });
//         const found = res.data.data.find((p) => String(p.id) === String(id));
//         if (found) { 
//           setProject(found); 
//           setEditForm({ p_name: found.p_name, p_skills: found.p_skills, p_url: found.p_url }); 
//         }
//         const det = await axiosInstance.get(`/project-detail/${id}/`);
//         const d = det.data;
//         setForm({
//           intro: d.intro || '', description: d.description || '',
//           developer: d.developer || '', github_url: d.github_url || '',
//           status: d.status || '', tech_stack: d.tech_stack || [],
//           features: d.features || [], future: d.future || [],
//           gallery: d.extra_images || [],
//         });
//       } catch (e) { console.error(e); }
//       finally { setFetching(false); }
//     })();
//   }, [id, isLoggedIn, username]);

//   const handleCoverChange = async (url) => {
//     const fd = new FormData();
//     fd.append('username', username); fd.append('p_name', project.p_name);
//     fd.append('p_skills', project.p_skills); fd.append('p_url', project.p_url);
//     fd.append('image', url);
//     await axiosInstance.put(`/projects-edit/${id}/`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
//     setProject((p) => ({ ...p, image: url }));
//     notify.success('Cover updated!');
//   };

//   const handleCoverRemove = async () => {
//     const fd = new FormData();
//     fd.append('username', username); fd.append('p_name', project.p_name);
//     fd.append('p_skills', project.p_skills); fd.append('p_url', project.p_url);
//     fd.append('image', '');
//     try {
//       await axiosInstance.put(`/projects-edit/${id}/`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
//       setProject((p) => ({ ...p, image: '' }));
//       notify.success('Cover removed.');
//     } catch { notify.error('Failed.'); }
//   };

//   const handleSaveBase = async () => {
//     setSavingBase(true);
//     const fd = new FormData();
//     fd.append('username', username); fd.append('p_name', editForm.p_name);
//     fd.append('p_skills', editForm.p_skills); fd.append('p_url', editForm.p_url);
//     fd.append('image', project.image || '');
//     try {
//       await axiosInstance.put(`/projects-edit/${id}/`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
//       setProject((p) => ({ ...p, ...editForm }));
//       setEditingBase(false);
//       notify.success('Project updated!');
//     } catch { notify.error('Failed to update.'); }
//     finally { setSavingBase(false); }
//   };

//   const handleSaveDetail = async () => {
//     setSaving(true);
//     try {
//       await axiosInstance.post(`/project-detail/${id}/save/`, {
//         ...form,
//         tech_stack: JSON.stringify(form.tech_stack),
//         features: JSON.stringify(form.features),
//         future: JSON.stringify(form.future),
//         extra_images: JSON.stringify(form.gallery),
//       });
//       notify.success('Detail saved!');
//     } catch { notify.error('Failed to save.'); }
//     finally { setSaving(false); }
//   };

//   const handleDelete = async () => {
//     setDeleting(true);
//     try {
//       await axiosInstance.delete(`/projects-del/${id}/`);
//       notify.success('Project deleted.');
//       navigate('/adminProjects');
//     } catch { notify.error('Failed to delete.'); setDeleting(false); setShowDelete(false); }
//   };

//   const heroSlides = [
//     ...(project?.image ? [project.image] : []),
//     ...form.gallery,
//   ];

//   if (fetching) return (
//     <div className="admin-container"><AdminSidebar /><div className="main-bar"><div className="progress-bar" /></div></div>
//   );

//   return (
//     <div className="admin-container">
//       <AdminSidebar />
//       <div className="main-bar">

//         <div className="admin-header">
//           <div className="admin-header-left">
//            <h1 className="admin-page-title" style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
//               {project?.p_name || 'Project Detail'}
//             </h1>
//             {form.status && (
//               <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 100, background: `${statusColors[form.status]}18`, color: statusColors[form.status], border: `1px solid ${statusColors[form.status]}33` }}>
//                 {form.status}
//               </span>
//             )}
//           </div>
//           <Headertheme />
//         </div>

//         {(saving || deleting || savingBase) && <div className="progress-bar" />}

//         <div className="admin-content">

//           <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
//             <HeroSlideshow slides={heroSlides} projectName={project?.p_name} projectSkills={project?.p_skills} />
//           </motion.div>

//           <Card icon="🗂️" title="Project Info" delay={0.04}>
//             {/* ... Project Info Card (unchanged) ... */}
//             {editingBase ? (
//               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
//                 <div><FL>Name</FL><input style={IS} value={editForm.p_name} placeholder="Project name" autoFocus onChange={(e) => setEditForm(f => ({ ...f, p_name: e.target.value }))} /></div>
//                 <div><FL>Skills</FL><input style={IS} value={editForm.p_skills} placeholder="React, Django…" onChange={(e) => setEditForm(f => ({ ...f, p_skills: e.target.value }))} /></div>
//                 <div><FL>Live URL</FL><input style={IS} value={editForm.p_url} placeholder="https://…" onChange={(e) => setEditForm(f => ({ ...f, p_url: e.target.value }))} /></div>
//                 <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
//                   <button onClick={handleSaveBase} disabled={savingBase} style={{ flex: 1, padding: '11px', borderRadius: 100, background: 'var(--adm-gradient)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--adm-font-body)' }}>
//                     {savingBase ? 'Saving…' : 'Save'}
//                   </button>
//                   <button onClick={() => setEditingBase(false)} style={{ padding: '11px 16px', borderRadius: 100, border: '1.5px solid var(--adm-border)', background: 'none', color: 'var(--adm-text-2)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--adm-font-body)' }}>Cancel</button>
//                 </div>
//               </div>
//             ) : (
//               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
//                 <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
//                   <div>
//                     <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--adm-text-3)', marginBottom: 4 }}>Name</div>
//                     <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--adm-text)', fontFamily: 'var(--adm-font-display)' }}>{project?.p_name}</div>
//                   </div>
//                   <div>
//                     <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--adm-text-3)', marginBottom: 4 }}>Skills</div>
//                     <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
//                       {(project?.p_skills || '').split(',').map(s => s.trim()).filter(Boolean).map((s) => (
//                         <span key={s} style={{ fontSize: 12, padding: '3px 10px', borderRadius: 100, background: 'var(--adm-accent-light)', color: 'var(--adm-accent)', border: '1px solid var(--adm-accent-border)', fontWeight: 600 }}>{s}</span>
//                       ))}
//                     </div>
//                   </div>
//                   {project?.p_url && (
//                     <div>
//                       <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--adm-text-3)', marginBottom: 4 }}>Live</div>
//                       <a href={project.p_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: 'var(--adm-accent)', textDecoration: 'none', fontWeight: 500 }}>{project.p_url.replace('https://', '')} ↗</a>
//                     </div>
//                   )}
//                 </div>
//                 <button onClick={() => setEditingBase(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 100, border: '1.5px solid var(--adm-border)', background: 'none', color: 'var(--adm-text-2)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--adm-font-body)', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
//                   onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--adm-accent)'; e.currentTarget.style.color = 'var(--adm-accent)'; }}
//                   onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--adm-border)'; e.currentTarget.style.color = 'var(--adm-text-2)'; }}>
//                   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
//                   Edit Info
//                 </button>
//               </div>
//             )}
//           </Card>

//           <Card icon="🖼️" title="Images & Gallery" delay={0.08}>
//             <GalleryManager
//               coverUrl={project?.image}
//               onCoverChange={handleCoverChange}
//               onCoverRemove={handleCoverRemove}
//               gallery={form.gallery}
//               onGalleryChange={(v) => setForm(f => ({ ...f, gallery: v }))}
//             />

//             {/* Full Screen Slider Button */}
//             {heroSlides.length > 0 && (
//               <div style={{ marginTop: 16, textAlign: 'right' }}>
//                 <button
//                   onClick={() => {
//                     setSliderInitialIndex(0);
//                     setShowFullScreenSlider(true);
//                   }}
//                   style={{
//                     padding: '11px 24px',
//                     borderRadius: 100,
//                     background: 'var(--adm-accent)',
//                     color: '#fff',
//                     border: 'none',
//                     fontWeight: 600,
//                     fontSize: 14,
//                     cursor: 'pointer',
//                     display: 'inline-flex',
//                     alignItems: 'center',
//                     gap: 8,
//                     boxShadow: '0 4px 15px rgba(108,99,255,0.3)'
//                   }}
//                 >
//                   ↗ View All Images in Fullscreen
//                 </button>
//               </div>
//             )}
//           </Card>

//           <Card icon="📋" title="Overview" delay={0.11}>
//             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 18 }}>
//               <div><FL hint="One sentence">Intro</FL><input style={IS} value={form.intro} placeholder="A full-stack platform built with…" onChange={(e) => setForm(f => ({ ...f, intro: e.target.value }))} /></div>
//               <div>
//                 <FL>Status</FL>
//                 <select value={form.status} onChange={(e) => setForm(f => ({ ...f, status: e.target.value }))} style={{ ...IS, cursor: 'pointer' }}>
//                   {statusOptions.map((s) => <option key={s} value={s}>{s || 'Select status…'}</option>)}
//                 </select>
//               </div>
//               <div><FL>GitHub URL</FL><input style={IS} value={form.github_url} placeholder="https://github.com/you/repo" onChange={(e) => setForm(f => ({ ...f, github_url: e.target.value }))} /></div>
//               <div style={{ gridColumn: '1 / -1' }}><FL>Description</FL><textarea style={TS} rows={5} value={form.description} placeholder="What does it do? Why did you build it? What challenges did you overcome?" onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} /></div>
//             </div>
//           </Card>

//           <Card icon="⚙️" title="Tech Stack & Features" delay={0.14}>
//             <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
//               <TagInput label="Tech Stack" placeholder="React, Django… press Enter" color="accent" items={form.tech_stack} onChange={(v) => setForm(f => ({ ...f, tech_stack: v }))} />
//               <TagInput label="Key Features" placeholder="JWT Auth, Dark Mode… press Enter" color="purple" items={form.features} onChange={(v) => setForm(f => ({ ...f, features: v }))} />
//               <TagInput label="Future Improvements" placeholder="Add tests, Deploy to K8s… press Enter" color="green" items={form.future} onChange={(v) => setForm(f => ({ ...f, future: v }))} />
//             </div>
//           </Card>

//           <Card icon="🧑‍💻" title="Developer Note" delay={0.17}>
//             <FL hint="Personal note to visitors">Note</FL>
//             <textarea style={TS} rows={4} value={form.developer} placeholder="What did you learn? What are you proud of? Any interesting engineering decisions?" onChange={(e) => setForm(f => ({ ...f, developer: e.target.value }))} />
//           </Card>

//           <Card icon="⚠️" title="Danger Zone" delay={0.2}>
//             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
//               <div>
//                 <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--adm-text)' }}>Delete this project</div>
//                 <div style={{ fontSize: 13, color: 'var(--adm-text-3)', marginTop: 2 }}>Permanently removes the project and all its data. Cannot be undone.</div>
//               </div>
//               <button onClick={() => setShowDelete(true)} style={{ padding: '10px 20px', borderRadius: 100, border: '1.5px solid var(--adm-danger)', background: 'rgba(239,68,68,0.08)', color: 'var(--adm-danger)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--adm-font-body)', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
//                 onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--adm-danger)'; e.currentTarget.style.color = '#fff'; }}
//                 onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = 'var(--adm-danger)'; }}>
//                 Delete Project
//               </button>
//             </div>
//           </Card>

//           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.22 }}
//             style={{ position: 'sticky', bottom: 24, display: 'flex', justifyContent: 'flex-end', gap: 10, pointerEvents: 'none' }}>
//             <button onClick={() => navigate('/adminProjects')} style={{ pointerEvents: 'all', padding: '12px 22px', borderRadius: 100, border: '1.5px solid var(--adm-border)', background: 'var(--adm-surface)', color: 'var(--adm-text-2)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--adm-font-body)', boxShadow: 'var(--adm-shadow)', transition: 'all 0.2s' }}
//               onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--adm-accent)'; e.currentTarget.style.color = 'var(--adm-accent)'; }}
//               onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--adm-border)'; e.currentTarget.style.color = 'var(--adm-text-2)'; }}>
//               Discard
//             </button>
//             <button onClick={handleSaveDetail} disabled={saving} style={{ pointerEvents: 'all', padding: '12px 28px', borderRadius: 100, background: 'var(--adm-gradient)', color: '#fff', border: 'none', fontSize: 14, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'var(--adm-font-body)', boxShadow: '0 4px 20px rgba(108,99,255,0.4)', opacity: saving ? 0.6 : 1, transition: 'all 0.2s' }}>
//               {saving ? 'Saving…' : '✓ Save Detail'}
//             </button>
//           </motion.div>

//         </div>
//       </div>

//       <AnimatePresence>
//         {showDelete && <DeleteModal project={project} onConfirm={handleDelete} onClose={() => setShowDelete(false)} />}
//       </AnimatePresence>

//       {/* Full Screen Slider */}
//       <AnimatePresence>
//         {showFullScreenSlider && (
//           <FullScreenImageSlider
//             slides={heroSlides}
//             isOpen={showFullScreenSlider}
//             onClose={() => setShowFullScreenSlider(false)}
//             initialIndex={sliderInitialIndex}
//           />
//         )}
//       </AnimatePresence>

//       <style>{`
//         @keyframes spin { to { transform: rotate(360deg); } }
//         div::-webkit-scrollbar { height: 4px; }
//         div::-webkit-scrollbar-thumb { background: var(--adm-border); border-radius: 4px; }
//       `}</style>
//     </div>
//   );
// };

// export default AdminProjectDetail;