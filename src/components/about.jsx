import './portfolio.css';
import code_icon         from '../assets/code-icon.png';
import code_icon_dark    from '../assets/code-icon-dark.png';
import edu_icon          from '../assets/edu-icon.png';
import edu_icon_dark     from '../assets/edu-icon-dark.png';
import project_icon      from '../assets/project-icon.png';
import project_icon_dark from '../assets/project-icon-dark.png';
import no                from '../assets/no.png';
import { motion }        from 'motion/react';
import { ThemeContext }  from '../page/ThemeContext';
import { useContext, useEffect, useState } from 'react';
import { useAuth }       from '../AuthContext';
import axios             from 'axios';

const CACHE_TTL = 86400000; // 24 hours

const About = (props) => {
  const auth                          = useAuth();
  const { theme }                     = useContext(ThemeContext);
  const [aboutInfo, setAboutInfo]     = useState({});
  const [loading,   setLoading]       = useState(true);

  // Safe username resolution
  const finalUsername =
    props.username != null
      ? props.username
      : auth.isLoggedIn
      ? auth.username
      : null;

  useEffect(() => {
    if (!finalUsername) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    // Try cache first
    try {
      const raw = localStorage.getItem(`aboutInfo_${finalUsername}`);
      if (raw) {
        const { data, timestamp } = JSON.parse(raw);
        if (Date.now() - timestamp < CACHE_TTL) {
          setAboutInfo(data);
          setLoading(false);
          return; // Fresh cache — skip network
        }
      }
    } catch {
      localStorage.removeItem(`aboutInfo_${finalUsername}`);
    }

    // Cache miss or stale — fetch
    setLoading(true);

    axios
      .get(`${import.meta.env.VITE_API_URL}/get-about-info/`, {
        params: { username: finalUsername },
        signal: controller.signal,
      })
      .then((r) => {
        setAboutInfo(r.data);
        localStorage.setItem(
          `aboutInfo_${finalUsername}`,
          JSON.stringify({ data: r.data, timestamp: Date.now() })
        );
      })
      .catch((err) => {
        if (err.name !== 'CanceledError') console.error('Error fetching about data:', err);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [finalUsername]);

  const CARDS = [
    {
      icon: theme === 'light-theme' ? code_icon : code_icon_dark,
      title: 'Languages & Tools',
      value: aboutInfo.skill_pack || 'N/A',
    },
    {
      icon: theme === 'light-theme' ? edu_icon : edu_icon_dark,
      title: 'Education',
      value: aboutInfo.education || 'N/A',
    },
    {
      icon: theme === 'light-theme' ? project_icon : project_icon_dark,
      title: 'Projects Built',
      value: aboutInfo.projects ? `${aboutInfo.projects} projects` : 'N/A',
    },
  ];

  return (
    <section id="about" className="pf-about scroll-mt-20">
      <div className="pf-about-inner">

        {/* Image side */}
        <motion.div
          className="pf-about-image-wrap"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          {loading ? (
            <div className="pf-about-img pf-skeleton pf-skeleton--img" />
          ) : (
            <img
              src={aboutInfo.image || no}
              alt="About"
              className="pf-about-img"
              loading="lazy"
            />
          )}

          {loading ? (
            <div className="pf-about-img-badge pf-skeleton pf-skeleton--badge" />
          ) : (
            aboutInfo.projects && (
              <div className="pf-about-img-badge">
                {aboutInfo.projects}+ Projects
              </div>
            )
          )}
        </motion.div>

        {/* Text side */}
        <motion.div
          className="pf-about-text"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <div className="p-tag">About Me</div>

          <h2 className="p-section-title">
            Passionate about building<br />
            <span className="p-gradient-text">great experiences</span>
          </h2>

          {/* Bio */}
          {loading ? (
            <>
              <div className="pf-skeleton pf-skeleton--line" style={{ width: '100%',  marginBottom: '10px' }} />
              <div className="pf-skeleton pf-skeleton--line" style={{ width: '85%',   marginBottom: '10px' }} />
              <div className="pf-skeleton pf-skeleton--line" style={{ width: '70%',   marginBottom: '24px' }} />
            </>
          ) : (
            <p className="pf-about-bio">
              I studied <strong>{aboutInfo.education || 'Computer Science'}</strong> and
              specialize in <strong>{aboutInfo.s_one || 'frontend'}</strong> and{' '}
              <strong>{aboutInfo.s_two || 'backend'}</strong> development.
              I love turning complex problems into simple, beautiful, and intuitive designs —
              always focused on performance and user experience.
            </p>
          )}

          {/* Info cards */}
          <div className="pf-about-cards">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="pf-about-card">
                    <div className="pf-about-card-icon pf-skeleton pf-skeleton--icon" />
                    <div className="pf-skeleton pf-skeleton--line" style={{ width: '80%', margin: '8px auto 6px' }} />
                    <div className="pf-skeleton pf-skeleton--line" style={{ width: '55%', margin: '0 auto' }} />
                  </div>
                ))
              : CARDS.map((c) => (
                  <motion.div
                    key={c.title}
                    className="pf-about-card"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <div className="pf-about-card-icon">
                      <img src={c.icon} alt={c.title} />
                    </div>
                    <div className="pf-about-card-title">{c.title}</div>
                    <div className="pf-about-card-value">{c.value}</div>
                  </motion.div>
                ))}
          </div>

        </motion.div>
      </div>
    </section>
  );
};

export default About;