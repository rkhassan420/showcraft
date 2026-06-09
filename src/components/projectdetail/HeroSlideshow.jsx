import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const STATUS_COLORS = {
  'Live':        '#10b981',
  'In Progress': '#f59e0b',
  'Completed':   '#c9a96e',
  'Archived':    '#9c9182',
  'Open Source': '#a09580',
};

const HeroSlideshow = ({ slides, projectName, projectSkills, status, onFullscreen }) => {
  const [active,  setActive]  = useState(0);
  const timerRef              = useRef(null);

  const go = useCallback(
    (idx) => setActive((idx + slides.length) % slides.length),
    [slides.length]
  );

  // Auto-advance
  useEffect(() => {
    if (slides.length < 2) return;
    timerRef.current = setInterval(() => go(active + 1), 3500);
    return () => clearInterval(timerRef.current);
  }, [active, slides.length, go]);

  const stopAndGo = (idx) => {
    clearInterval(timerRef.current);
    go(idx);
  };

  const color = STATUS_COLORS[status] || '#c9a96e';

  // No images fallback
  if (!slides.length) return (
    <div className="pd-hero-empty">
      <h1 className="pd-hero-title" style={{ color: 'var(--p-text)' }}>{projectName}</h1>
      <p style={{ margin: 0, fontSize: 14, color: 'var(--p-text-2)' }}>{projectSkills}</p>
    </div>
  );

  return (
    <div className="pd-hero">

      {/* Background slide */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          className="pd-hero-slide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{ backgroundImage: `url(${slides[active]})` }}
        />
      </AnimatePresence>

      <div className="pd-hero-gradient" />

      {/* Slide count badge */}
      {slides.length > 1 && (
        <div className="pd-hero-count">{active + 1} / {slides.length}</div>
      )}

      {/* Bottom info */}
      <div className="pd-hero-info">
        <div className="pd-hero-left">
          <div className="pd-hero-chips">
            {status && (
              <span
                className="pd-hero-status"
                style={{
                  background: `${color}22`,
                  color,
                  border: `1px solid ${color}44`,
                }}
              >
                <span
                  className="pd-hero-status-dot"
                  style={{
                    background:  color,
                    boxShadow:   status === 'Live' ? `0 0 6px ${color}` : 'none',
                    animation:   status === 'Live' ? 'pulse 2s infinite' : 'none',
                  }}
                />
                {status}
              </span>
            )}
            {projectSkills?.split(',').map((s, i) => (
              <span key={i} className="pd-hero-skill-chip">{s.trim()}</span>
            ))}
          </div>
          <h1 className="pd-hero-title">{projectName}</h1>
        </div>

        <div className="pd-hero-right">
          {slides.length > 1 && (
            <div className="pd-hero-dots">
              {slides.map((_, i) => (
                <button
                  key={i}
                  className={`pd-hero-dot ${i === active ? 'active' : ''}`}
                  onClick={() => stopAndGo(i)}
                />
              ))}
            </div>
          )}
          {slides.length > 1 && (
            <button className="pd-hero-fullscreen-btn" onClick={onFullscreen}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 3 21 3 21 9" />
                <polyline points="9 21 3 21 3 15" />
                <line x1="21" y1="3" x2="14" y2="10" />
                <line x1="3"  y1="21" x2="10" y2="14" />
              </svg>
              All photos
            </button>
          )}
        </div>
      </div>

      {/* Prev / Next */}
      {slides.length > 1 && (
        <>
          <button className="pd-hero-arrow pd-hero-arrow-prev" onClick={() => stopAndGo(active - 1)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button className="pd-hero-arrow pd-hero-arrow-next" onClick={() => stopAndGo(active + 1)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
};

export default HeroSlideshow;
