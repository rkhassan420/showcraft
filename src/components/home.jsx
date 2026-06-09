import './portfolio.css';
import right_arrow_dark from '../assets/right-arrow-dark.png';
import right_arrow_work from '../assets/right-arrow-work.png';
import download_icon    from '../assets/download-icon.png';
import no               from '../assets/no.png';
import { motion }       from 'motion/react';
import { useContext, useState, useEffect } from 'react';
import { ThemeContext }  from '../page/ThemeContext';
import { useAuth }       from '../AuthContext';
import axios             from 'axios';

const CACHE_TTL = 86400000; // 24 hours

const Home = (props) => {
  const auth = useAuth();
  const { theme } = useContext(ThemeContext);
  const [homeInfo, setHomeInfo]   = useState({});
  const [loading,  setLoading]    = useState(true);

  // Safe username resolution — avoids empty string edge case
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
      const raw = localStorage.getItem(`homeInfo_${finalUsername}`);
      if (raw) {
        const { data, timestamp } = JSON.parse(raw);
        if (Date.now() - timestamp < CACHE_TTL) {
          setHomeInfo(data);
          setLoading(false);
          return; // Cache is fresh — skip network call
        }
      }
    } catch {
      // Corrupted cache — ignore and fetch fresh
      localStorage.removeItem(`homeInfo_${finalUsername}`);
    }

    // Cache miss or stale — fetch from network
    setLoading(true);

    axios
      .get(`${import.meta.env.VITE_API_URL}/get-home-info/`, {
        params: { username: finalUsername },
        signal: controller.signal,
      })
      .then((r) => {
        setHomeInfo(r.data);
        localStorage.setItem(
          `homeInfo_${finalUsername}`,
          JSON.stringify({ data: r.data, timestamp: Date.now() })
        );
      })
      .catch((err) => {
        if (err.name !== 'CanceledError') {
          console.error('Error fetching home data:', err);
        }
      })
      .finally(() => {
        setLoading(false);
      });

    return () => controller.abort();
  }, [finalUsername]);

  // Don't render if there's no user context at all
  if (!finalUsername && !homeInfo.full_name) return null;

  return (
    <section id="home" className="pf-home scroll-mt-20">

      {/* Avatar */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, type: 'spring', stiffness: 100 }}
      >
        <img
          src={homeInfo.image || no}
          alt={homeInfo.full_name || 'Profile'}
          className={`pf-home-avatar${loading ? ' pf-skeleton' : ''}`}
          loading="lazy"
        />
      </motion.div>

      {/* Greeting */}
      <motion.p
        className="pf-home-greeting"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Hi, I'm
      </motion.p>

      {/* Name */}
      <motion.h1
        className={`pf-home-name${loading ? ' pf-skeleton pf-skeleton--text' : ''}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {loading ? '\u00A0' : homeInfo.full_name || 'Your Name'}
      </motion.h1>

      {/* Role */}
      <motion.p
        className={`pf-home-title${loading ? ' pf-skeleton pf-skeleton--text' : ''}`}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {loading ? '\u00A0' : homeInfo.skill_title || 'Your Skill Title'}
      </motion.p>

      {/* Description */}
      <motion.p
        className="pf-home-desc"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.55 }}
      >
        {loading
          ? 'Loading…'
          : `I'm a passionate ${homeInfo.skill_title || 'developer'} with ${
              homeInfo.experience || 0
            } years of experience building elegant, high-performance digital experiences.`}
      </motion.p>

      {/* Buttons */}
      <motion.div
        className="pf-home-btns"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        <a href="#form" className="pf-btn-primary">
          Contact Me
          <img src={theme === 'dark-theme' ? right_arrow_work : right_arrow_dark} alt="" />
        </a>
        {!loading && homeInfo.cv && homeInfo.cv !== 'NA' && (
          <a href={homeInfo.cv} target="_blank" rel="noopener noreferrer" className="pf-btn-secondary">
            Download CV
            <img src={download_icon} alt="" />
          </a>
        )}
      </motion.div>

      {/* Scroll indicator */}
      <div className="pf-home-scroll">
        <div className="pf-home-scroll-line" />
        <span>scroll</span>
      </div>

    </section>
  );
};

export default Home;