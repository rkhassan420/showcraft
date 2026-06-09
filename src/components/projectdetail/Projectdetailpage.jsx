import { useState, useEffect }      from 'react';
import { useParams, useNavigate }   from 'react-router-dom';
import { motion, AnimatePresence }  from 'motion/react';
import axiosInstance                from '../../utils/axiosInstance';

import FullScreenSlider  from './FullScreenSlider';
import HeroSlideshow     from './HeroSlideshow';
import Section           from './Section';
import ProjectSkeleton   from './ProjectSkeleton';

import './projectdetailpage.css';

// ─── GitHub Icon ──────────────────────────────────────────────────────────────
const GitHubIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

// ─── ExpandIcon ───────────────────────────────────────────────────────────────
const ExpandIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 3 21 3 21 9" />
    <polyline points="9 21 3 21 3 15" />
    <line x1="21" y1="3" x2="14" y2="10" />
    <line x1="3"  y1="21" x2="10" y2="14" />
  </svg>
);

// ─── CTA Row ──────────────────────────────────────────────────────────────────
const CtaRow = ({ liveUrl, githubUrl }) => {
  if (!liveUrl && !githubUrl) return null;
  return (
    <motion.div
      className="pd-cta-row"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
    >
      {liveUrl && (
        <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="pd-btn-live">
          🌐 View Live
        </a>
      )}
      {githubUrl && (
        <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="pd-btn-github">
          <GitHubIcon /> GitHub
        </a>
      )}
    </motion.div>
  );
};

// ─── Screenshots Section ──────────────────────────────────────────────────────
const ScreenshotsSection = ({ images, onOpen }) => {
  if (!images.length) return null;
  return (
    <Section title="Screenshots" delay={0.15}>
      <div className="pd-gallery-strip">
        {images.map((url, i) => (
          <div
            key={i}
            className={`pd-gallery-tile ${i === 0 ? 'cover' : ''}`}
            onClick={() => onOpen(i)}
          >
            <img src={url} alt="" />
            {i === 0 && <span className="pd-gallery-cover-badge">COVER</span>}
          </div>
        ))}
      </div>
    </Section>
  );
};

// ─── Tech Stack Section ───────────────────────────────────────────────────────
const TechStackSection = ({ techStack }) => {
  if (!techStack?.length) return null;
  return (
    <Section title="Tech Stack" delay={0.2}>
      <div className="pd-tech-chips">
        {techStack.map((tech, i) => (
          <motion.span
            key={i}
            className="pd-tech-chip"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.04 }}
          >
            {tech}
          </motion.span>
        ))}
      </div>
    </Section>
  );
};

// ─── Bullet List Section ──────────────────────────────────────────────────────
const BulletSection = ({ title, items, bullet, delay }) => {
  if (!items?.length) return null;
  return (
    <Section title={title} delay={delay}>
      <ul className="pd-list">
        {items.map((item, i) => (
          <motion.li
            key={i}
            className="pd-list-item"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + i * 0.04 }}
          >
            <span className={`pd-list-bullet ${bullet === 'check' ? 'check' : 'arrow'}`}>
              {bullet === 'check' ? '✓' : '→'}
            </span>
            {item}
          </motion.li>
        ))}
      </ul>
    </Section>
  );
};

// ─── Developer Note Section ───────────────────────────────────────────────────
const DevNoteSection = ({ note }) => {
  if (!note) return null;
  return (
    <Section title="Developer Note" delay={0.35}>
      <div className="pd-dev-note">
        <p>{note}</p>
      </div>
    </Section>
  );
};

// ─── Not Found ────────────────────────────────────────────────────────────────
const NotFound = ({ onBack }) => (
  <div className="pd-not-found">
    <span>🔍</span>
    <p>Project not found</p>
    <button onClick={onBack}>← Go Back</button>
  </div>
);

// ─── Cache helpers ────────────────────────────────────────────────────────────
const CACHE_TTL = 86400000; // 24 hours

const readCache = (key) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp < CACHE_TTL) return data;
    localStorage.removeItem(key);
  } catch {
    localStorage.removeItem(key);
  }
  return null;
};

const writeCache = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {
    // localStorage full — silently skip
  }
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const ProjectDetailPage = () => {
  const { id }       = useParams();
  const navigate     = useNavigate();

  const [project,    setProject]    = useState(null);
  const [detail,     setDetail]     = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [showSlider, setShowSlider] = useState(false);
  const [sliderIdx,  setSliderIdx]  = useState(0);

  useEffect(() => {
    if (!id) return;

    const projectKey = `project_${id}`;
    const detailKey  = `projectDetail_${id}`;

    // Try cache first — instant load on revisit
    const cachedProject = readCache(projectKey);
    const cachedDetail  = readCache(detailKey);

    if (cachedProject && cachedDetail) {
      setProject(cachedProject);
      setDetail(cachedDetail);
      setLoading(false);
      return; // Skip network entirely
    }

    // Cache miss — fetch both in parallel
    const controller = new AbortController();

    (async () => {
      setLoading(true);
      try {
        const [detRes, projRes] = await Promise.all([
          axiosInstance.get(`/project-detail/${id}/`, { signal: controller.signal }),
          axiosInstance.get(`/get-project/${id}/`,    { signal: controller.signal }),
        ]);
        setDetail(detRes.data);
        setProject(projRes.data);
        writeCache(detailKey,  detRes.data);
        writeCache(projectKey, projRes.data);
      } catch (e) {
        if (e.name !== 'CanceledError') console.error('Error fetching project:', e);
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [id]);

  const allImages = [
    ...(project?.image      ? [project.image]        : []),
    ...(detail?.extra_images || []),
  ];

  const openSlider = (i = 0) => {
    setSliderIdx(i);
    setShowSlider(true);
  };

  if (loading)              return <ProjectSkeleton />;
  if (!project && !detail)  return <NotFound onBack={() => navigate(-1)} />;

  return (
    <div className="pd-page">

      {/* Hero slideshow */}
      <HeroSlideshow
        slides={allImages}
        projectName={project?.p_name}
        projectSkills={project?.p_skills}
        status={detail?.status}
        onFullscreen={() => openSlider(0)}
      />

      {/* Page content */}
      <div className="pd-content">

        <CtaRow
          liveUrl={project?.p_url}
          githubUrl={detail?.github_url}
        />

        <div className="pd-sections">

          {detail?.description && (
            <Section title="About This Project" delay={0.1}>
              <p className="pd-description">{detail.description}</p>
            </Section>
          )}

          <ScreenshotsSection
            images={allImages}
            onOpen={openSlider}
          />

          <TechStackSection techStack={detail?.tech_stack} />

          <BulletSection
            title="Key Features"
            items={detail?.features}
            bullet="check"
            delay={0.25}
          />

          <BulletSection
            title="Future Improvements"
            items={detail?.future}
            bullet="arrow"
            delay={0.3}
          />

          <DevNoteSection note={detail?.developer} />

        </div>
      </div>

      {/* Fullscreen slider */}
      <AnimatePresence>
        {showSlider && (
          <FullScreenSlider
            slides={allImages}
            isOpen={showSlider}
            onClose={() => setShowSlider(false)}
            initialIndex={sliderIdx}
          />
        )}
      </AnimatePresence>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );
};

export default ProjectDetailPage;