import { Link, useLocation } from 'react-router-dom';
import { useState, useContext } from 'react';
import { useAuth } from '../AuthContext.jsx';
// import { showPortfolioLinkToast } from '../utils/notifications';
// import { notify } from '../utils/notifications';
import axiosInstance from '../utils/axiosInstance';
import ConfirmModal from './ConfirmModal';
import { ThemeContext } from '../page/ThemeContext';
import home from "../assets/home.png"
import homeWhite from "../assets/homeWhite.png"
import about from "../assets/about.png"
import aboutWhite from "../assets/aboutWhite.png"
import projects from "../assets/projects.png"
import projectsWhite from "../assets/projectsWhite.png"
import footer from "../assets/footer.png"
import footerWhite from "../assets/footerWhite.png"
import ana from "../assets/ana.png"
import anaWhite from "../assets/anaWhite.png"
import link from "../assets/link.png"
import linkWhite from "../assets/linkWhite.png"
import view from "../assets/view.png"
import viewWhite from "../assets/viewWhite.png"
import deleteIcon from "../assets/delete.png"
import PortfolioLinkModal from './linkShareModal.jsx';
import Portal from './Portal';  



const AdminSidebar = ({ mobile = false, onItemClick = () => {} }) => {

  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const { username } = useAuth();
  const location     = useLocation();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { theme, handleTheme }               = useContext(ThemeContext);

  const NAV_ITEMS = [
   {
    to: '/admin',
    icon: theme === 'dark-theme' ? homeWhite : home,
    label: 'Home Info',
  },
  {
    to: '/adminAbout',
    icon: theme === 'dark-theme' ? aboutWhite : about,
    label: 'About Me',
  },
  {
    to: '/adminProjects',
    icon: theme === 'dark-theme' ? projectsWhite : projects,
    label: 'Projects',
  },
  {
    to: '/adminFooter',
    icon: theme === 'dark-theme' ? footerWhite : footer,
    label: 'Footer',
  },
  {
    to: '/adminAnalytics',
    icon: theme === 'dark-theme' ? anaWhite : ana,
    label: 'Analytics',
  },
];

 

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

  const initial = username ? username.charAt(0).toUpperCase() : '?';

  return (
    <div className="sidebar">
     
      <div className="sidebar-brand">
        <span className="sidebar-brand-logo">ShowCraft</span>
        <span className="sidebar-brand-sub">Portfolio Builder</span>
      </div>

     
      <Link to="#" className="sidebar-user" title="View your portfolio">
        <div className="sidebar-avatar">{initial}</div>
        <div style={{ overflow: 'hidden' }}>
          <span className="sidebar-username">{username || 'Guest'}</span>
          <span className="sidebar-role">Portfolio Owner</span>
        </div>
      </Link>

      <ul>
        <span className="sidebar-section-label">Dashboard</span>

        {NAV_ITEMS.map((item) => (
          <li key={item.to}>
            <Link
              to={item.to}
              className={`sidebar-nav-item ${location.pathname === item.to ? 'active' : ''}`}
            >
              <span className="sidebar-nav-icon"><img src={item.icon} alt={item.label} /></span>
              {item.label}
            </Link>
          </li>
        ))}

        <div className="sidebar-divider" />
        <span className="sidebar-section-label">Actions</span>

       

        <button
          onClick={() => setLinkModalOpen(true)}
          className="sidebar-nav-item"
          
        >
          <span className="sidebar-nav-icon"> <img src={theme === 'dark-theme' ? viewWhite : view} /></span>
          Preview Portfolio
        </button>



        <div className="sidebar-divider" />

       {username && (
          <li>
            <button
              className="sidebar-nav-item danger"
              onClick={() => setOpen(true)}
            >
              <span className="sidebar-nav-icon">
                <img src={deleteIcon} alt="Delete Account" />
              </span>
              Delete Account
            </button>
          </li>
        )}
      </ul>

    <Portal>
      <ConfirmModal
        open={open}
        title="Delete Account"
        message="This action is permanent. Your account and all data will be removed forever."
        loading={loading}
        onCancel={() => setOpen(false)}
        onConfirm={handleDeleteAccount}
      />
    </Portal>

    <Portal>

      {linkModalOpen && (
        <PortfolioLinkModal username={username} onClose={() => setLinkModalOpen(false)} />
      )}

    </Portal>

    </div>
  );
};

export default AdminSidebar;
