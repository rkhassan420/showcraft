import './portfolio.css';
import moon_icon          from '../assets/moon_icon.png';
import sun_icon           from '../assets/sun.png';
import close_black        from '../assets/close-black.png';
import close_white        from '../assets/close-white.png';
import head_icon          from '../assets/arrow-icon.png';
import menu_black         from '../assets/menu-black.png';
import menu_white         from '../assets/menu-white.png';
import white_header_arrow from '../assets/white-header-arrow-icon.png';
import header_bg_color    from '../assets/header-bg-color.png';
import { useState, useEffect, useContext, useRef } from 'react';
import { ThemeContext }   from '../page/ThemeContext';
import { Link, useLocation } from 'react-router-dom';
import { useAuth }        from '../AuthContext';
import axios              from 'axios';

const NAV_LINKS = [
  { label: 'Home',    href: '#home'    },
  { label: 'About',   href: '#about'   },
  { label: 'Work',    href: '#work'    },
  { label: 'Contact', href: '#form'    },
];

const Header = (props) => {
  const auth                             = useAuth();
  const { theme, handleTheme }           = useContext(ThemeContext);
  const location                         = useLocation();
  const sidebarRef                       = useRef(null);

  const [finalUsername, setFinalUsername] = useState(auth.username);
  const [homeInfo,      setHomeInfo]      = useState({});
  const [isScrolled,    setIsScrolled]    = useState(false);
  const [sidebarOpen,   setSidebarOpen]   = useState(false);

  const isPortfolio  = location.pathname.startsWith('/portfolio/');

  const showDashboard =
  location.pathname === '/' ||
  (isPortfolio && auth.isLoggedIn && auth.username === finalUsername);


  useEffect(() => {
    if (auth.isLoggedIn && !props.username) setFinalUsername(auth.username);
    else if (props.username) setFinalUsername(props.username);
  }, [auth.username, props.username]);


  useEffect(() => {
    if (!finalUsername) return;
    const raw = localStorage.getItem(`homeInfo_${finalUsername}`);
    if (raw) {
      try {
        const { data } = JSON.parse(raw);
        setHomeInfo(data);
      } catch {
        setHomeInfo({});
      }
    }
  }, [finalUsername]);

  
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

 
  useEffect(() => {
    if (location.hash) {
      document.querySelector(location.hash)?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);

 
  useEffect(() => {
    const handler = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) setSidebarOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const linkProps = (href) =>
    isPortfolio
      ? { href }
      : { to: `/${href}`, as: 'link' };

  const renderLink = (label, href) =>
    isPortfolio ? (
      <a href={href} onClick={() => setSidebarOpen(false)}>{label}</a>
    ) : (
      <Link to={`/${href}`} onClick={() => setSidebarOpen(false)}>{label}</Link>
    );

  return (
    <>
     
      {theme !== 'dark-theme' && (
        <div className="fixed top-0 -z-10 right-0 w-11/12 translate-y-[-80%]" style={{ pointerEvents: 'none' }}>
          <img src={header_bg_color} className="w-full" alt="" />
        </div>
      )}

      <header className={`pf-header ${isScrolled ? 'scrolled' : ''}`}>
        {/* Logo */}
        <div className="pf-logo">
          {homeInfo.logo_title
            ? <><span>{homeInfo.logo_title.slice(0, -1)}</span>{homeInfo.logo_title.slice(-1)}</>
            : <span>Portfolio</span>}
        </div>

        {/* Desktop nav */}
        <ul className="pf-nav">
          {NAV_LINKS.map((n) => (
            <li key={n.href}>
              {isPortfolio
                ? <a href={n.href}>{n.label}</a>
                : <Link to={`/${n.href}`}>{n.label}</Link>}
            </li>
          ))}
          {showDashboard && (
            <li><a href="/admin">Dashboard</a></li>
          )}
        </ul>

        {/* Right controls */}
        <div className="pf-header-right">
          <button className="pf-icon-btn" onClick={handleTheme} title="Toggle theme">
            <img src={theme === 'dark-theme' ? sun_icon : moon_icon} alt="theme" />
          </button>

          {isPortfolio
            ? <a href="#form" className="pf-contact-btn">
                Contact <img src={theme === 'dark-theme' ? white_header_arrow : head_icon} alt="" />
              </a>
            : <Link to="/#form" className="pf-contact-btn">
                Contact <img src={theme === 'dark-theme' ? white_header_arrow : head_icon} alt="" />
              </Link>}

          <button className="pf-burger" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="menu">
            <span />
            <span style={{ opacity: sidebarOpen ? 0 : 1 }} />
            <span />
          </button>
        </div>
      </header>

     
      <div className={`pf-sidebar ${sidebarOpen ? 'open' : ''}`} ref={sidebarRef}>
        <button className="pf-sidebar-close" onClick={() => setSidebarOpen(false)}>
          <img src={theme === 'dark-theme' ? close_white : close_black} alt="close" />
        </button>

        <ul>
          {NAV_LINKS.map((n) => (
            <li key={n.href}>
              {isPortfolio
                ? <a href={n.href} onClick={() => setSidebarOpen(false)}>{n.label}</a>
                : <Link to={`/${n.href}`} onClick={() => setSidebarOpen(false)}>{n.label}</Link>}
            </li>
          ))}
          {showDashboard && (
            <li><a href="/admin" onClick={() => setSidebarOpen(false)}>Dashboard</a></li>
          )}
        </ul>
      </div>
    </>
  );
};

export default Header;