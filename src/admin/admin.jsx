import './admin.css';
import AdminSidebar from './AdminSidebar';
import Headertheme from './Headertheme';
import React, { useState, useEffect,useContext } from 'react';
import { useAuth } from '../AuthContext.jsx';
import { supabase } from './supabaseClient';
import axiosInstance from '../utils/axiosInstance';
// import { notify } from '../utils/notifications';
import home from "../assets/home.png"
import homeWhite from "../assets/homeWhite.png"
import { ThemeContext } from '../page/ThemeContext';
import { useToast } from '../utils/useToast';   // ← new


const AdminPanel = () => {
  const { theme, handleTheme }               = useContext(ThemeContext);
  const { username, isLoggedIn } = useAuth();
  const [loading,  setLoading]   = useState(false);
  const [homeInfo, setHomeInfo]  = useState({});
  const notify                 = useToast();       // ← new
  const [formData, setFormData]  = useState({
    username: '', logo_title: '', full_name: '',
    skill_title: '', experience: '', image: '', cv: '',
  });

  const handleChange = (e) => {
    const { name, type, files, value } = e.target;
    setFormData((p) => ({ ...p, [name]: type === 'file' ? files[0] : value }));
  };

  useEffect(() => {
    if (username) setFormData((p) => ({ ...p, username }));
  }, [username]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let imageUrl = null, cvUrl = null;

    if (formData.image && typeof formData.image !== 'string') {
      const f = formData.image;
      const path = `${Date.now()}-img.${f.name.split('.').pop()}`;
      const { error } = await supabase.storage.from('portfolio').upload(path, f);
      if (error) { notify.error('Image upload failed'); }
      else { const { data } = supabase.storage.from('portfolio').getPublicUrl(path); imageUrl = data.publicUrl; }
    }
    if (formData.cv && typeof formData.cv !== 'string') {
      const f = formData.cv;
      const path = `${Date.now()}-cv.${f.name.split('.').pop()}`;
      const { error } = await supabase.storage.from('portfolio').upload(path, f);
      if (error) { notify.error('CV upload failed'); }
      else { const { data } = supabase.storage.from('portfolio').getPublicUrl(path); cvUrl = data.publicUrl; }
    }

    const form = new FormData();
    for (let key in formData) { if (key === 'image' || key === 'cv') continue; form.append(key, formData[key]); }
    if (imageUrl) form.append('image', imageUrl);
    if (cvUrl)    form.append('cv', cvUrl);

    try {
      const res = await axiosInstance.post('/add-home-info/', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      setHomeInfo(res.data);
      notify.success('Home info saved successfully!');
      setFormData({ username, logo_title: '', full_name: '', skill_title: '', experience: '', image: '', cv: '' });
      await fetchHomeInfo();
    } catch { notify.error('Failed to save home info.'); }
    finally  { setLoading(false); }
  };

  const fetchHomeInfo = async () => {
    try {
      const res = await axiosInstance.get('/get-home-info/', { params: { username } });
      setHomeInfo(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { if (isLoggedIn) fetchHomeInfo(); }, [isLoggedIn]);

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="main-bar">

        {/* Header */}
        <div className="admin-header">
          <div className="admin-header-left">
            <h1 className="admin-page-title">Home Info</h1>
            <span className="admin-page-badge">Step 1 of 4</span>
          </div>
          <Headertheme />
      
        </div>

        {loading && <div className="progress-bar" />}

        <div className="admin-content">
          {!isLoggedIn && <p className="login-warning">⚠️ Please login to save your portfolio information.</p>}

          {/* Form Card */}
          <div className="adm-card">
            <div className="adm-card-header">
              <div className="adm-card-title">
                <div className="adm-card-title-icon"><img src={theme === 'dark-theme' ? homeWhite : home}/> </div>
                Portfolio Home Section
              </div>
            </div>
            <div className="adm-card-body">
              <form className="home-form" onSubmit={handleSubmit}>
                <input type="hidden" name="username" value={username} />

                <label>Logo / Site Title
                  <input type="text" name="logo_title" autoComplete="off" placeholder="e.g. John.dev" value={formData.logo_title} onChange={handleChange} />
                </label>
                <label>Full Name
                  <input type="text" name="full_name" autoComplete="off" placeholder="e.g. John Doe" value={formData.full_name} onChange={handleChange} />
                </label>
                <label>Skill Title
                  <input type="text" name="skill_title" autoComplete="off" placeholder="e.g. Full-Stack Developer" value={formData.skill_title} onChange={handleChange} />
                </label>
                <label>Years of Experience
                  <input type="number" name="experience" autoComplete="off" placeholder="e.g. 3" value={formData.experience} onChange={handleChange} />
                </label>
                <label>Profile Photo
                  <input type="file" accept="image/*" name="image" onChange={handleChange} />
                </label>
                <label>CV / Resume (PDF)
                  <input type="file" name="cv" onChange={handleChange} />
                </label>

                <div className="send-info-btn">
                  <button type="submit" disabled={!isLoggedIn || loading}>
                    {loading ? 'Saving...' : 'Save Home Info'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Info Card */}
          {(homeInfo.full_name || homeInfo.logo_title) && (
            <div className="adm-card">
              <div className="adm-card-header">
                <div className="adm-card-title">
                  
                  Current Saved Info
                </div>
              </div>
              <div className="home-form-info" style={{ borderRadius: 0 }}>
                <table className="admin-home-table">
                  <tbody>
                    <tr><td>Logo Title</td><td>{homeInfo.logo_title || '—'}</td></tr>
                    <tr><td>Full Name</td><td>{homeInfo.full_name || '—'}</td></tr>
                    <tr><td>Skill Title</td><td>{homeInfo.skill_title || '—'}</td></tr>
                    <tr><td>Experience</td><td>{homeInfo.experience ? `${homeInfo.experience} years` : '—'}</td></tr>
                    <tr><td>CV</td><td>
                      {homeInfo.cv
                        ? <a className="home-admin-cv" href={homeInfo.cv} target="_blank" rel="noopener noreferrer">View CV</a>
                        : '—'}
                    </td></tr>
                  </tbody>
                </table>
                {homeInfo.image && (
                  <div className="home-img-container">
                    <img src={homeInfo.image} alt="Profile" className="home-admin-img" />
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

export default AdminPanel;
