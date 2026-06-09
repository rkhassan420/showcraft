import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const HeroSlideshow = ({ slides, projectName, projectSkills }) => {
  const [active,  setActive]  = useState(0);
  const timerRef              = useRef(null);

  const go = useCallback(
    (idx) => setActive((idx + slides.length) % slides.length),
    [slides.length]
  );

  useEffect(() => {
    if (slides.length < 2) return;
    timerRef.current = setInterval(() => go(active + 1), 3500);
    return () => clearInterval(timerRef.current);
  }, [active, slides.length, go]);

  const stopAndGo = (idx) => { clearInterval(timerRef.current); go(idx); };

  if (slides.length === 0) return (
    <div style={{
      width: '100%', height: 350, borderRadius: 16,
      border: '1px solid var(--adm-border)',
      background: 'var(--adm-gradient)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: 8,
    }}>
      <span style={{ fontSize: 32 }}>🖼️</span>
      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>Add images in the gallery below</span>
    </div>
  );

  return (
    <div style={{ position: 'relative', width: '100%', height: 400, borderRadius: 16, overflow: 'hidden', border: '1px solid var(--adm-border)' }}>

      {/* Slide */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{ position: 'absolute', inset: 0, backgroundImage: `url(${slides[active]})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
        />
      </AnimatePresence>

      {/* Gradient overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.05) 55%)' }} />

      {/* Bottom info */}
      <div style={{ position: 'absolute', bottom: 20, left: 24, right: 24, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ fontFamily: 'var(--adm-font-display)', fontSize: 22, fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: 4, textShadow: '0 1px 6px rgba(0,0,0,0.4)' }}>
            {projectName}
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{projectSkills}</div>
        </div>

        {slides.length > 1 && (
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
            {slides.map((_, i) => (
              <button key={i} onClick={() => stopAndGo(i)} style={{
                width: i === active ? 20 : 7, height: 7, borderRadius: 100, border: 'none',
                cursor: 'pointer', padding: 0, transition: 'all 0.3s',
                background: i === active ? '#fff' : 'rgba(255,255,255,0.4)',
              }} />
            ))}
          </div>
        )}
      </div>

      {/* Slide count badge */}
      {slides.length > 1 && (
        <div style={{ position: 'absolute', top: 14, right: 14, padding: '4px 10px', borderRadius: 100, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: 11, fontWeight: 600 }}>
          {active + 1} / {slides.length}
        </div>
      )}

      {/* Prev / Next */}
      {slides.length > 1 && (
        <>
          {[{ dir: 'prev', side: 'left', points: '15 18 9 12 15 6', onClick: () => stopAndGo(active - 1) },
            { dir: 'next', side: 'right', points: '9 18 15 12 9 6',  onClick: () => stopAndGo(active + 1) }
          ].map(({ dir, side, points, onClick }) => (
            <button key={dir} onClick={onClick}
              style={{ position: 'absolute', [side]: 12, top: '50%', transform: 'translateY(-50%)', width: 34, height: 34, borderRadius: '50%', background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.6)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.35)'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points={points} />
              </svg>
            </button>
          ))}
        </>
      )}
    </div>
  );
};

export default HeroSlideshow;
