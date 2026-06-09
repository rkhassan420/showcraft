import { useState, useEffect, useContext, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeContext } from '../page/ThemeContext';
import moon_icon   from '../assets/moon_icon.png';
import sun_icon    from '../assets/sun.png';
import menu_black  from '../assets/menu-black.png';
import menu_white  from '../assets/menu-white.png';
import logout_icon from '../assets/logout.png';
import { useAuth } from '../AuthContext.jsx';
// import { showPortfolioLinkToast } from '../utils/notifications';
import axiosInstance from '../utils/axiosInstance';
import ConfirmModal from './ConfirmModal';
import { useToast } from '../utils/useToast';
import AdminSidebar from './AdminSidebar';   // ← import real sidebar

const Headertheme = () => {
  const { isLoggedIn, logout, username } = useAuth();
  const { theme, handleTheme }           = useContext(ThemeContext);
  const location                         = useLocation();
  const overlayRef                       = useRef(null);
  const notify                           = useToast();
  const [sidebarOpen, setSidebarOpen]    = useState(false);
  const [open, setOpen]                  = useState(false);
  const [loading, setLoading]            = useState(false);

  const toggleSidebar = () => setSidebarOpen((v) => !v);

  // close on outside click (clicking the overlay)
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) setSidebarOpen(false);
  };

  // close on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  const handleLogout = () => {
    logout();
    notify.info('Logged out successfully');
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      await axiosInstance.delete(`/account-del/${username}/`);
      notify.success('Account deleted successfully');
      localStorage.clear();
      window.location.href = '/';
    } catch {
      notify.error('Failed to delete account');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

return (
  <>
    <div className="admin-header-right">
      <button className="adm-icon-btn" onClick={handleTheme} title="Toggle theme">
        <img src={theme === 'dark-theme' ? sun_icon : moon_icon} alt="theme" />
      </button>

      {isLoggedIn ? (
        <button onClick={handleLogout} className="Adminlogout">
          Logout
          <img style={{ width: 'auto', height: '16px' }} src={logout_icon} alt="" />
        </button>
      ) : (
        <Link to="/admin/login" className="Adminlogout">
          Login
          <img style={{ height: '16px' }} src={logout_icon} alt="" />
        </Link>
      )}

      <button className="burger-btn" onClick={toggleSidebar} title="Menu">
        <img src={theme === 'dark-theme' ? menu_white : menu_black} style={{ height: '22px', width: '22px', display: 'block' }} alt="menu" />
      </button>
    </div>

    
    <div
      className={`mobile-sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
      onClick={() => setSidebarOpen(false)}
    />

    {/* Drawer */}
    <div className={`mobile-sidebar-drawer ${sidebarOpen ? 'visible' : ''}`}>
      <AdminSidebar />
    </div>
  </>
);
}

export default Headertheme;
