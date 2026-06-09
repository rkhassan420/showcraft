import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const FullScreenSlider = ({ slides, isOpen, onClose, initialIndex = 0 }) => {
  const [active,     setActive]     = useState(initialIndex);
  const [showThumbs, setShowThumbs] = useState(true);

  const go = useCallback(
    (idx) => setActive((idx + slides.length) % slides.length),
    [slides.length]
  );

  // Reset to initialIndex when opened
  useEffect(() => {
    if (isOpen) setActive(initialIndex);
  }, [isOpen, initialIndex]);

  // Keyboard navigation + body scroll lock
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === 'ArrowLeft')  go(active - 1);
      if (e.key === 'ArrowRight') go(active + 1);
      if (e.key === 'Escape')     onClose();
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [isOpen, active, go, onClose]);

  if (!isOpen || !slides.length) return null;

  return (
    <motion.div
      className="pd-fs-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* Top bar */}
      <div className="pd-fs-topbar">
        <span className="pd-fs-count">{active + 1} / {slides.length}</span>
        <div className="pd-fs-topbar-btns">
          <button
            className="pd-fs-thumb-toggle"
            onClick={(e) => { e.stopPropagation(); setShowThumbs((p) => !p); }}
          >
            {showThumbs ? 'Hide Thumbs' : 'Show Thumbs'}
          </button>
          <button className="pd-fs-close" onClick={onClose}>×</button>
        </div>
      </div>

      {/* Main image */}
      <div className="pd-fs-main" onClick={(e) => e.stopPropagation()}>
        <AnimatePresence mode="wait">
          <motion.img
            key={active}
            src={slides[active]}
            alt=""
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            draggable={false}
          />
        </AnimatePresence>

        {slides.length > 1 && (
          <>
            <button
              className="pd-fs-arrow pd-fs-arrow-prev"
              onClick={(e) => { e.stopPropagation(); go(active - 1); }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              className="pd-fs-arrow pd-fs-arrow-next"
              onClick={(e) => { e.stopPropagation(); go(active + 1); }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {showThumbs && slides.length > 1 && (
        <div className="pd-fs-thumbs">
          {slides.map((url, i) => (
            <img
              key={i}
              src={url}
              alt=""
              className={`pd-fs-thumb ${i === active ? 'active' : ''}`}
              onClick={(e) => { e.stopPropagation(); setActive(i); }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default FullScreenSlider;
