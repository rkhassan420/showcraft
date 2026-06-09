import './admin.css';
import { useState, useEffect,useContext } from 'react';
import AdminSidebar from './AdminSidebar';
import Headertheme from './Headertheme';
import { supabase } from './supabaseClient';
import { useAuth } from '../AuthContext.jsx';
import axiosInstance from '../utils/axiosInstance';
// import { notify } from '../utils/notifications';
import { ThemeContext } from '../page/ThemeContext';
import about from "../assets/about.png"
import aboutWhite from "../assets/aboutWhite.png"
import { useToast } from '../utils/useToast';   // ← new

const AdminAbout = () => {
   const { theme, handleTheme }               = useContext(ThemeContext);
  const { username, isLoggedIn } = useAuth();
  const [loading,   setLoading]   = useState(false);
  const [aboutInfo, setAboutInfo] = useState({});
   const notify                 = useToast();       // ← new
  const [formData,  setFormData]  = useState({
    username: '', s_one: '', s_two: '', projects: '',
    education: '', skill_pack: '', image: '',
  });

  const handleChange = (e) => {
    const { name, type, files, value } = e.target;
    setFormData((p) => ({ ...p, [name]: type === 'file' ? files[0] : value }));
  };

  useEffect(() => { if (username) setFormData((p) => ({ ...p, username })); }, [username]);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    let imageUrl = null;
    if (formData.image && typeof formData.image !== 'string') {
      const f = formData.image;
      const path = `${Date.now()}-img.${f.name.split('.').pop()}`;
      const { error } = await supabase.storage.from('portfolio').upload(path, f);
      if (error) { notify.error('Image upload failed'); setLoading(false); return; }
      const { data } = supabase.storage.from('portfolio').getPublicUrl(path);
      imageUrl = data.publicUrl;
    }
    const form = new FormData();
    for (let k in formData) { if (k === 'image') continue; form.append(k, formData[k]); }
    if (imageUrl) form.append('image', imageUrl);
    try {
      const res = await axiosInstance.post('/add-about-info/', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      setAboutInfo(res.data);
      notify.success('About info saved!');
      setFormData({ username, s_one: '', s_two: '', projects: '', education: '', skill_pack: '', image: '' });
      await fetchAboutInfo();
    } catch { notify.error('Failed to save about info.'); }
    finally  { setLoading(false); }
  };

  const fetchAboutInfo = async () => {
    try { const res = await axiosInstance.get('/get-about-info/', { params: { username } }); setAboutInfo(res.data); }
    catch (e) { console.error(e); }
  };

  useEffect(() => { if (isLoggedIn) fetchAboutInfo(); }, [isLoggedIn]);

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="main-bar">
        <div className="admin-header">
          <div className="admin-header-left">
            <h1 className="admin-page-title">About Me</h1>
            <span className="admin-page-badge">Step 2 of 4</span>
          </div>
          <Headertheme />
        </div>
        {loading && <div className="progress-bar" />}
        <div className="admin-content">
          {!isLoggedIn && <p className="login-warning">⚠️ Please login to save your portfolio information.</p>}

          <div className="adm-card">
            <div className="adm-card-header">
              <div className="adm-card-title"><div className="adm-card-title-icon"><img src={theme === 'dark-theme' ? aboutWhite : about}/></div>About Section Details</div>
            </div>
            <div className="adm-card-body">
              <form className="home-form" onSubmit={handleSubmit}>
                <input type="hidden" name="username" value={username} />
                <label>Primary Skill / Stack
                  <input type="text" name="s_one" placeholder="e.g. React, Laravel" autoComplete="off" onChange={handleChange} value={formData.s_one} />
                </label>
                <label>Secondary Skill / Stack
                  <input type="text" name="s_two" placeholder="e.g. Django, Node.js" autoComplete="off" onChange={handleChange} value={formData.s_two} />
                </label>
                <label>Total Projects Built
                  <input type="number" name="projects" placeholder="e.g. 12" autoComplete="off" onChange={handleChange} value={formData.projects} />
                </label>
                <label>Education / Degree
                  <input type="text" name="education" placeholder="e.g. BS Computer Science" autoComplete="off" onChange={handleChange} value={formData.education} />
                </label>
                <label>Skills List (comma separated)
                  <input type="text" name="skill_pack" placeholder="e.g. MySQL, React, PHP, Bootstrap, Django" autoComplete="off" onChange={handleChange} value={formData.skill_pack} />
                </label>
                <label>About Photo
                  <input type="file" accept="image/*" name="image" onChange={handleChange} />
                </label>
                <div className="send-info-btn">
                  <button type="submit" disabled={!isLoggedIn || loading}>
                    {loading ? 'Saving...' : 'Save About Info'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {aboutInfo.education && (
            <div className="adm-card">
              <div className="adm-card-header">
                <div className="adm-card-title">Current Saved Info</div>
              </div>
              <div className="home-form-info" style={{ borderRadius: 0 }}>
                <table className="admin-home-table">
                  <tbody>
                    <tr><td>Skill 1</td><td>{aboutInfo.s_one || '—'}</td></tr>
                    <tr><td>Skill 2</td><td>{aboutInfo.s_two || '—'}</td></tr>
                    <tr><td>Projects</td><td>{aboutInfo.projects || '—'}</td></tr>
                    <tr><td>Education</td><td>{aboutInfo.education || '—'}</td></tr>
                    <tr><td>Skills Pack</td><td>{aboutInfo.skill_pack || '—'}</td></tr>
                  </tbody>
                </table>
                {aboutInfo.image && (
                  <div className="home-img-container">
                    <img src={aboutInfo.image} alt="About" className="home-admin-img" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAbout;
