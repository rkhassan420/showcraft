import './admin.css';
import { useState, useEffect, useContext } from 'react';
import AdminSidebar from './AdminSidebar';
import Headertheme from './Headertheme';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from './supabaseClient';
import { useAuth } from '../AuthContext.jsx';
import axiosInstance from '../utils/axiosInstance';
import { ThemeContext } from '../page/ThemeContext';
import projects from "../assets/projects.png";
import projectsWhite from "../assets/projectsWhite.png";
import { useToast } from '../utils/useToast';
import { useNavigate } from 'react-router-dom';

const EMPTY_FORM = { username: '', p_name: '', p_skills: '', p_url: '', image: '' };

// ─── Main Component ───────────────────────────────────────────────────────────
const AdminProjects = () => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const { username, isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [projectsInfo, setProjectsInfo] = useState([]);
  const [projectCount, setProjectCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const notify = useToast();
  const itemsPerPage = 5;

  const [formData, setFormData] = useState({ ...EMPTY_FORM });

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
      await axiosInstance.post('/add-projects-info/', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      notify.success('Project added!');
      setFormData({ ...EMPTY_FORM, username });
      await fetchProjectsInfo();
    } catch { notify.error('Failed to add project.'); }
    finally { setLoading(false); }
  };

  const fetchProjectsInfo = async () => {
    try {
      const res = await axiosInstance.get('/get-projects-info/', { params: { username } });
      setProjectsInfo(res.data.data);
      setProjectCount(res.data.count);
    } catch (e) { console.error(e); notify.error('Failed to fetch projects.'); }
  };

  useEffect(() => { if (isLoggedIn) fetchProjectsInfo(); }, [isLoggedIn]);

  const filtered = projectsInfo.filter((p) => {
    const q = searchQuery.toLowerCase();
    return p.p_name?.toLowerCase().includes(q) || p.p_skills?.toLowerCase().includes(q);
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortOrder === 'newest') return b.id - a.id;
    if (sortOrder === 'oldest') return a.id - b.id;
    if (sortOrder === 'az') return a.p_name.localeCompare(b.p_name);
    if (sortOrder === 'za') return b.p_name.localeCompare(a.p_name);
    return 0;
  });

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = sorted.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sorted.length / itemsPerPage);

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="main-bar">
        <div className="admin-header">
          <div className="admin-header-left">
            <h1 className="admin-page-title">Projects</h1>
            <span className="admin-page-badge">Step 3 of 4</span>
          </div>
          <Headertheme />
        </div>
        {loading && <div className="progress-bar" />}
        <div className="admin-content">
          {!isLoggedIn && <p className="login-warning">⚠️ Please login to save your portfolio information.</p>}


          {/* Add project form */}
          <div className="adm-card">
            <div className="adm-card-header">
              <div className="adm-card-title">Add New Project</div>
            </div>
            <div className="adm-card-body">
              <form className="home-form" onSubmit={handleSubmit}>
                <input type="hidden" name="username" value={username} />
                <label>Project Name
                  <input type="text" name="p_name" placeholder="e.g. E-Commerce Store" autoComplete="off" value={formData.p_name} onChange={handleChange} />
                </label>
                <label>Skills Used (max 3)
                  <input type="text" name="p_skills" placeholder="e.g. React, Django, MySQL" autoComplete="off" value={formData.p_skills} onChange={handleChange} />
                </label>
                <label>Live Project URL
                  <input type="text" name="p_url" placeholder="https://yourproject.com" autoComplete="off" value={formData.p_url} onChange={handleChange} />
                </label>
                <label>Project Screenshot / Cover Image
                  <input type="file" accept="image/*" name="image" onChange={handleChange} />
                </label>
                <div className="send-info-btn">
                  <button type="submit" disabled={!isLoggedIn || loading}>
                    {loading ? 'Adding...' : 'Add Project'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Projects list */}
          {projectsInfo.length > 0 && (
            <div className="adm-card">
              <div className="adm-card-header">
                <div className="adm-card-title">Your Projects</div>
              </div>
              <div className="adm-card-body">

                {/* Search + Sort */}
                <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
                  <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 180 }}>
                    <svg style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', opacity: 0.4, pointerEvents: 'none' }}
                      width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input type="text" placeholder="Search by name or skill…" value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                      style={{ width: '100%', padding: '9px 12px 9px 32px', borderRadius: 8, border: '1px solid var(--adm-border)', background: 'var(--adm-input-bg)', color: 'var(--adm-text)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                    {searchQuery && (
                      <button onClick={() => { setSearchQuery(''); setCurrentPage(1); }}
                        style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--adm-muted, #888)', lineHeight: 1, padding: 0 }}>×</button>
                    )}
                  </div>
                  <select value={sortOrder} onChange={(e) => { setSortOrder(e.target.value); setCurrentPage(1); }}
                    style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid var(--adm-border)', background: 'var(--adm-input-bg)', color: 'var(--adm-text)', fontSize: 14, cursor: 'pointer', outline: 'none' }}>
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="az">A → Z</option>
                    <option value="za">Z → A</option>
                  </select>
                  {searchQuery && (
                    <span style={{ fontSize: 13, color: 'var(--adm-text-3)', whiteSpace: 'nowrap' }}>
                      {filtered.length} result{filtered.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                {currentItems.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--adm-text-3)', fontSize: 14 }}>
                    No projects match your search.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {currentItems.map((p, i) => (
                      <motion.div
                        key={p.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        onClick={() => navigate(`/adminProjects/${p.id}/detail`)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 14,
                          padding: '14px 16px', borderRadius: 12,
                          border: '1px solid var(--adm-border)',
                          background: 'var(--adm-surface-2)',
                          cursor: 'pointer', transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'var(--adm-accent)';
                          e.currentTarget.style.background = 'var(--adm-hover)';
                          e.currentTarget.style.transform = 'translateX(3px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'var(--adm-border)';
                          e.currentTarget.style.background = 'var(--adm-surface-2)';
                          e.currentTarget.style.transform = 'none';
                        }}
                      >
                        {/* Thumbnail */}
                        <div style={{
                          width: 52, height: 52, borderRadius: 10, flexShrink: 0,
                          backgroundImage: p.image ? `url(${p.image})` : 'var(--adm-gradient)',
                          backgroundSize: 'cover', backgroundPosition: 'center',
                          border: '1px solid var(--adm-border)',
                        }} />

                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--adm-text)', fontFamily: 'var(--adm-font-display)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {p.p_name}
                          </div>
                          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 4 }}>
                            {(p.p_skills || '').split(',').map(s => s.trim()).filter(Boolean).map((s) => (
                              <span key={s} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, background: 'var(--adm-accent-light)', color: 'var(--adm-accent)', border: '1px solid var(--adm-accent-border)', fontWeight: 600 }}>
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Live link */}
                        {p.p_url && (
                          <a href={p.p_url} target="_blank" rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            title="View live"
                            style={{
                              width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              border: '1px solid var(--adm-border)', color: 'var(--adm-text-3)',
                              textDecoration: 'none', transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--adm-accent)'; e.currentTarget.style.color = 'var(--adm-accent)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--adm-border)'; e.currentTarget.style.color = 'var(--adm-text-3)'; }}
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                              <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                          </a>
                        )}

                        {/* Arrow */}
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--adm-text-3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </motion.div>
                    ))}
                  </div>
                )}

                {totalPages > 1 && (
                  <div className="pagination" style={{ marginTop: 20 }}>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button key={i + 1} onClick={() => setCurrentPage(i + 1)}
                        className={currentPage === i + 1 ? 'active-page' : ''}>
                        {i + 1}
                      </button>
                    ))}
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

export default AdminProjects;