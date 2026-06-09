import './admin.css';
import { useState, useEffect,useContext } from 'react';
import AdminSidebar from './AdminSidebar';
import Headertheme from './Headertheme';
import { useAuth } from '../AuthContext.jsx';
import axiosInstance from '../utils/axiosInstance';
// import { notify } from '../utils/notifications';
import { ThemeContext } from '../page/ThemeContext';
import footer from "../assets/footer.png"
import footerWhite from "../assets/footerWhite.png"
import { useToast } from '../utils/useToast';   // ← new

const AdminFooter = () => {
   const { theme, handleTheme }               = useContext(ThemeContext);
  const { username, isLoggedIn } = useAuth();
  const [loading,    setLoading]    = useState(false);
    const notify                 = useToast();       // ← new
  const [footerInfo, setFooterInfo] = useState({});
  const [formData,   setFormData]   = useState({
    username: '', full_name: '', email: '', c_title: '',
    linkedin: '', github: '', whatsapp: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  useEffect(() => { if (username) setFormData((p) => ({ ...p, username })); }, [username]);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    const form = new FormData();
    for (let k in formData) form.append(k, formData[k]);
    try {
      await axiosInstance.post('/add-footer-info/', form);
      notify.success('Footer info saved!');
      setFormData({ username, full_name: '', email: '', c_title: '', linkedin: '', github: '', whatsapp: '' });
      await fetchFooterInfo();
    } catch { notify.error('Failed to save footer info.'); }
    finally  { setLoading(false); }
  };

  const fetchFooterInfo = async () => {
    try { const res = await axiosInstance.get('/get-footer-info/', { params: { username } }); setFooterInfo(res.data?.[0] || {}); }
    catch (e) { console.error(e); }
  };

  useEffect(() => { if (isLoggedIn) fetchFooterInfo(); }, [isLoggedIn]);

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="main-bar">
        <div className="admin-header">
          <div className="admin-header-left">
            <h1 className="admin-page-title">Footer</h1>
            <span className="admin-page-badge">Step 4 of 4</span>
          </div>
          <Headertheme />
        </div>
        {loading && <div className="progress-bar" />}
        <div className="admin-content">
          {!isLoggedIn && <p className="login-warning">⚠️ Please login to save your portfolio information.</p>}

          <div className="adm-card">
            <div className="adm-card-header">
              <div className="adm-card-title"><div className="adm-card-title-icon"><img src={theme === 'dark-theme' ? footerWhite : footer} /></div>Footer & Contact Details</div>
            </div>
            <div className="adm-card-body">
              <form className="home-form" onSubmit={handleSubmit}>
                <input type="hidden" name="username" value={username} />
                <label>Display Name
                  <input type="text" name="full_name" placeholder="e.g. John Doe" autoComplete="off" onChange={handleChange} value={formData.full_name} />
                </label>
                <label>Contact Email
                  <input type="text" name="email" placeholder="you@example.com" autoComplete="off" onChange={handleChange} value={formData.email} />
                </label>
                <label>Copyright Title
                  <input type="text" name="c_title" placeholder="e.g. John Doe" autoComplete="off" onChange={handleChange} value={formData.c_title} />
                </label>
                <label>LinkedIn Profile URL
                  <input type="text" name="linkedin" placeholder="https://linkedin.com/in/..." autoComplete="off" onChange={handleChange} value={formData.linkedin} />
                </label>
                <label>GitHub Profile URL
                  <input type="text" name="github" placeholder="https://github.com/..." autoComplete="off" onChange={handleChange} value={formData.github} />
                </label>
                <label>WhatsApp Number (with country code)
                  <input type="text" name="whatsapp" placeholder="e.g. 923001234567" autoComplete="off" onChange={handleChange} value={formData.whatsapp} />
                </label>
                <div className="send-info-btn">
                  <button type="submit" disabled={!isLoggedIn || loading}>
                    {loading ? 'Saving...' : 'Save Footer Info'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {footerInfo.full_name && (
            <div className="adm-card">
              <div className="adm-card-header">
                <div className="adm-card-title">Current Saved Info</div>
              </div>
              <div className="home-form-info" style={{ borderRadius: 0 }}>
                <table className="admin-home-table">
                  <tbody>
                    <tr><td>Name</td><td>{footerInfo.full_name || '—'}</td></tr>
                    <tr><td>Email</td><td>{footerInfo.email || '—'}</td></tr>
                    <tr><td>Copyright</td><td>{footerInfo.c_title || '—'}</td></tr>
                    <tr><td>LinkedIn</td><td>{footerInfo.linkedin ? <a href={footerInfo.linkedin} target="_blank" rel="noreferrer" style={{ color: 'var(--adm-accent)' }}>View ↗</a> : '—'}</td></tr>
                    <tr><td>GitHub</td><td>{footerInfo.github ? <a href={footerInfo.github} target="_blank" rel="noreferrer" style={{ color: 'var(--adm-accent)' }}>View ↗</a> : '—'}</td></tr>
                    <tr><td>WhatsApp</td><td>{footerInfo.whatsapp || '—'}</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminFooter;
