import './portfolio.css';
import { motion }      from 'motion/react';
import { useAuth }     from '../AuthContext';
import axios           from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CACHE_TTL    = 86400000; // 24 hours
const ITEMS_PER_PAGE = 6;

const Work = ({ username, slug }) => {
  const navigate = useNavigate();
  const auth     = useAuth();

  const [aboutInfo,    setAboutInfo]    = useState({});
  const [projects,     setProjects]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [currentPage,  setCurrentPage]  = useState(1);

  // Safe username resolution
  const finalUsername =
    username != null
      ? username
      : auth.isLoggedIn
      ? auth.username
      : null;

  // ── Read aboutInfo from localStorage (written by About.jsx) ──────────────
  useEffect(() => {
    if (!finalUsername) return;
    try {
      const raw = localStorage.getItem(`aboutInfo_${finalUsername}`);
      if (raw) {
        const { data, timestamp } = JSON.parse(raw);
        if (Date.now() - timestamp < CACHE_TTL) {
          setAboutInfo(data);
        }
      }
    } catch {
      // nothing — aboutInfo stays {}
    }
  }, [finalUsername]);

  // ── Fetch projects with cache ─────────────────────────────────────────────
  useEffect(() => {
    if (!finalUsername) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    try {
      const raw = localStorage.getItem(`projects_${finalUsername}`);
      if (raw) {
        const { data, timestamp } = JSON.parse(raw);
        if (Date.now() - timestamp < CACHE_TTL) {
          setProjects(data);
          setLoading(false);
          return; // Fresh cache — skip network
        }
      }
    } catch {
      localStorage.removeItem(`projects_${finalUsername}`);
    }

    setLoading(true);

    axios
      .get(`${import.meta.env.VITE_API_URL}/get-projects-info/`, {
        params: { username: finalUsername },
        signal: controller.signal,
      })
      .then((r) => {
        const data = r.data.data || [];
        setProjects(data);
        localStorage.setItem(
          `projects_${finalUsername}`,
          JSON.stringify({ data, timestamp: Date.now() })
        );
      })
      .catch((err) => {
        if (err.name !== 'CanceledError') console.error('Error fetching projects:', err);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [finalUsername]);

  const totalPages   = Math.ceil(projects.length / ITEMS_PER_PAGE);
  const currentItems = projects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <section id="work" className="pf-work scroll-mt-20">
      <div className="pf-work-inner">

        {/* Section header */}
        <motion.div
          className="pf-work-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="p-tag">Portfolio</div>
          <h2 className="p-section-title">Latest Work</h2>
          <p className="p-section-sub">
            A selection of my recent projects built with{' '}
            <strong>{aboutInfo.s_one || 'modern tools'}</strong> and{' '}
            <strong>{aboutInfo.s_two || 'best practices'}</strong>.
          </p>
        </motion.div>

        {/* Grid — skeleton or real */}
        {loading ? (
          <div className="pf-projects-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="pf-project-card">
                {/* Image placeholder */}
                <div className="pf-project-img pf-skeleton" />

                <div className="pf-project-body">
                  {/* Title line */}
                  <div
                    className="pf-skeleton pf-skeleton--line"
                    style={{ width: '65%', marginBottom: '12px' }}
                  />
                  {/* Skill tags */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div className="pf-skeleton pf-skeleton--tag" />
                    <div className="pf-skeleton pf-skeleton--tag" />
                    <div className="pf-skeleton pf-skeleton--tag" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : currentItems.length === 0 ? (
          <div className="pf-empty">No projects yet</div>
        ) : (
          <div className="pf-projects-grid">
            {currentItems.map((p, i) => (
              <motion.div
                key={p.id}
                onClick={() =>
                  navigate(
                    `/portfolio/${username || finalUsername}/projects/${p.id}`
                  )
                }
                className="pf-project-card"
                style={{ cursor: 'pointer' }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
              >
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.p_name}
                    className="pf-project-img"
                    loading="lazy"
                  />
                ) : (
                  <div
                    className="pf-project-img"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(108,99,255,0.15), rgba(168,85,247,0.1))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '48px',
                    }}
                  >
                    💻
                  </div>
                )}

                <div className="pf-project-body">
                  <div className="pf-project-name">
                    {p.p_name}
                    {p.p_url && (
                      <a
                        href={p.p_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="pf-project-arrow"
                        style={{ textDecoration: 'none' }}
                      >
                        ↗
                      </a>
                    )}
                  </div>

                  <div className="pf-project-skills">
                    {(p.p_skills || '')
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean)
                      .map((s, idx) => (
                        <span key={idx} className="pf-project-skill">
                          {s}
                        </span>
                      ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="pf-pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`pf-page-btn ${currentPage === i + 1 ? 'active' : ''}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default Work;