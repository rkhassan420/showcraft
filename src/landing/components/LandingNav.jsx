import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeContext } from '../../page/ThemeContext';
import moon_icon  from '../../assets/moon_icon.png';
import sun_icon   from '../../assets/sun.png';
import { NAV_LINKS } from '../data';

const LandingNav = ({ scrollTo }) => {
  const { theme, handleTheme } = useContext(ThemeContext);

  const [scrolled, setScrolled]         = useState(false);
  const [mobileOpen, setMobileOpen]     = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (id) => {
    scrollTo(id);
    setMobileOpen(false);
  };



  // Close sidebar automatically on desktop
useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth > 768) {
      setMobileOpen(false);
    }
  };

  window.addEventListener('resize', handleResize);

  return () => window.removeEventListener('resize', handleResize);
}, []);

  return (
    <>
      <nav className={`lp-nav ${scrolled ? 'lp-nav-scrolled' : ''}`}>
        {/* Logo */}
        <div className="lp-logo">ShowCraft</div>

        {/* Desktop links */}
        <ul className="lp-nav-links">
          {NAV_LINKS.map((id) => (
            <li key={id}>
              <a href={`#${id}`} onClick={(e) => { e.preventDefault(); handleNav(id); }}>
                {id.charAt(0).toUpperCase() + id.slice(1).replace('-', ' ')}
              </a>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="lp-nav-actions">
          {/* Theme */}
          <button className="lp-nav-toggle" onClick={handleTheme} title="Toggle theme">
            <img src={theme === 'dark-theme' ? sun_icon : moon_icon} alt="theme" />
          </button>

          <button className="lp-btn-ghost" onClick={() => handleNav('contact')}>Contact</button>

          <Link to="/admin/register">
            <button className="lp-btn-primary">Get Started</button>
          </Link>

          {/* Burger */}
          <div className="lp-nav-burger" onClick={() => setMobileOpen(!mobileOpen)}>
            <span style={{ transform: mobileOpen ? 'rotate(45deg) translateY(7px)' : 'none' }} />
            <span style={{ opacity: mobileOpen ? 0 : 1 }} />
            <span style={{ transform: mobileOpen ? 'rotate(-45deg) translateY(-7px)' : 'none' }} />
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="lp-mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0  }}
            exit={{    opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {NAV_LINKS.map((id) => (
              <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); handleNav(id); }}>
                {id.charAt(0).toUpperCase() + id.slice(1).replace('-', ' ')}
              </a>
            ))}
            <Link to="/admin/register" onClick={() => setMobileOpen(false)}>
              <button className="lp-btn-burger" style={{ width: '100%', padding: '12px' }}>
                Get Started
              </button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LandingNav;
