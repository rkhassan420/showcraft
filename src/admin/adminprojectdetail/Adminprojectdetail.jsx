import '../admin.css';
import { useState, useEffect }     from 'react';
import { useParams, useNavigate }  from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import AdminSidebar                from '../AdminSidebar.jsx';
import Headertheme                 from '../Headertheme.jsx';
import { useAuth }                 from '../../AuthContext.jsx';
import axiosInstance               from '../../utils/axiosInstance.js';
import { useToast }                from '../../utils/useToast.jsx';

import { clearProjectCache, parseArrayField } from './adminUtils.js';
import { IS, TS, STATUS_COLORS, STATUS_OPTIONS } from './adminStyles.js';
import { FL, Card, TagInput }      from './AdminPrimitives.jsx';
import AdminHeroSlideshow          from './AdminHeroSlideshow.jsx';
import GalleryManager              from './GalleryManager.jsx';
import DeleteModal                 from './DeleteModal.jsx';

// ─── ProjectInfoCard ──────────────────────────────────────────────────────────
const ProjectInfoCard = ({ project, editForm, setEditForm, editingBase, setEditingBase, onSave, saving }) => (
  <Card icon="🗂️" title="Project Info" delay={0.04}>
    {editingBase ? (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
        <div><FL>Name</FL>
          <input style={IS} value={editForm.p_name} placeholder="Project name" autoFocus
            onChange={(e) => setEditForm((f) => ({ ...f, p_name: e.target.value }))} />
        </div>
        <div><FL>Skills</FL>
          <input style={IS} value={editForm.p_skills} placeholder="React, Django…"
            onChange={(e) => setEditForm((f) => ({ ...f, p_skills: e.target.value }))} />
        </div>
        <div><FL>Live URL</FL>
          <input style={IS} value={editForm.p_url} placeholder="https://…"
            onChange={(e) => setEditForm((f) => ({ ...f, p_url: e.target.value }))} />
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
          <button onClick={onSave} disabled={saving}
            style={{ flex: 1, padding: '11px', borderRadius: 100, background: 'var(--adm-gradient)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--adm-font-body)' }}>
            {saving ? 'Saving…' : 'Save'}
          </button>
          <button onClick={() => setEditingBase(false)}
            style={{ padding: '11px 16px', borderRadius: 100, border: '1.5px solid var(--adm-border)', background: 'none', color: 'var(--adm-text-2)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--adm-font-body)' }}>
            Cancel
          </button>
        </div>
      </div>
    ) : (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--adm-text-3)', marginBottom: 4 }}>Name</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--adm-text)', fontFamily: 'var(--adm-font-display)' }}>{project?.p_name}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--adm-text-3)', marginBottom: 4 }}>Skills</div>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              {(project?.p_skills || '').split(',').map((s) => s.trim()).filter(Boolean).map((s) => (
                <span key={s} style={{ fontSize: 12, padding: '3px 10px', borderRadius: 100, background: 'var(--adm-accent-light)', color: 'var(--adm-accent)', border: '1px solid var(--adm-accent-border)', fontWeight: 600 }}>{s}</span>
              ))}
            </div>
          </div>
          {project?.p_url && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--adm-text-3)', marginBottom: 4 }}>Live</div>
              <a href={project.p_url} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 13, color: 'var(--adm-accent)', textDecoration: 'none', fontWeight: 500 }}>
                {project.p_url.replace('https://', '')} ↗
              </a>
            </div>
          )}
        </div>
        <button onClick={() => setEditingBase(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 100, border: '1.5px solid var(--adm-border)', background: 'none', color: 'var(--adm-text-2)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--adm-font-body)', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--adm-accent)'; e.currentTarget.style.color = 'var(--adm-accent)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--adm-border)';  e.currentTarget.style.color = 'var(--adm-text-2)'; }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          Edit Info
        </button>
      </div>
    )}
  </Card>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const AdminProjectDetail = () => {
  const { id }                   = useParams();
  const navigate                 = useNavigate();
  const { username, isLoggedIn } = useAuth();
  const notify                   = useToast();

  const [project,      setProject]      = useState(null);
  const [fetching,     setFetching]     = useState(true);
  const [saving,       setSaving]       = useState(false);
  const [savingBase,   setSavingBase]   = useState(false);
  const [deleting,     setDeleting]     = useState(false);
  const [editingBase,  setEditingBase]  = useState(false);
  const [showDelete,   setShowDelete]   = useState(false);
  const [editForm,     setEditForm]     = useState({ p_name: '', p_skills: '', p_url: '' });

  const [form, setForm] = useState({
    intro: '', description: '', developer: '', github_url: '',
    status: '', tech_stack: [], features: [], future: [], gallery: [],
  });

  // ── Fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isLoggedIn || !username || !id) return;
    const controller = new AbortController();

    (async () => {
      setFetching(true);
      try {
        const [projRes, detRes] = await Promise.all([
          axiosInstance.get('/get-projects-info/', { params: { username }, signal: controller.signal }),
          axiosInstance.get(`/project-detail/${id}/`,                     { signal: controller.signal }),
        ]);

        const found = projRes.data.data.find((p) => String(p.id) === String(id));
        if (found) {
          setProject(found);
          setEditForm({ p_name: found.p_name, p_skills: found.p_skills, p_url: found.p_url });
        }

        const d = detRes.data;
        setForm({
          intro:       d.intro        || '',
          description: d.description  || '',
          developer:   d.developer    || '',
          github_url:  d.github_url   || '',
          status:      d.status       || '',
          // BUG FIX: backend may return these as JSON strings — parse safely
          tech_stack:  parseArrayField(d.tech_stack),
          features:    parseArrayField(d.features),
          future:      parseArrayField(d.future),
          gallery:     parseArrayField(d.extra_images),
        });
      } catch (e) {
        if (e.name !== 'CanceledError') console.error('Fetch error:', e);
      } finally {
        setFetching(false);
      }
    })();

    return () => controller.abort();
  }, [id, isLoggedIn, username]);

  // ── Save detail (text fields + gallery) ───────────────────────────────────
  const saveDetail = async (galleryOverride = null) => {
    const gallery = galleryOverride ?? form.gallery;
    await axiosInstance.post(`/project-detail/${id}/save/`, {
      ...form,
      gallery: undefined, // don't double-send
      tech_stack:   JSON.stringify(form.tech_stack),
      features:     JSON.stringify(form.features),
      future:       JSON.stringify(form.future),
      extra_images: JSON.stringify(gallery),
    });
    clearProjectCache(id); // invalidate public portfolio cache
  };

  // ── Gallery change — saves immediately so images survive reload ────────────
  // BUG FIX: old code only updated local state; images vanished on reload
  const handleGalleryChange = async (newGallery) => {
    setForm((f) => ({ ...f, gallery: newGallery }));
    try {
      await saveDetail(newGallery);
    } catch {
      notify.error('Failed to save gallery');
    }
  };

  // ── Cover change ───────────────────────────────────────────────────────────
  const handleCoverChange = async (url) => {
    const fd = new FormData();
    fd.append('username',  username);
    fd.append('p_name',    project.p_name);
    fd.append('p_skills',  project.p_skills);
    fd.append('p_url',     project.p_url);
    fd.append('image',     url);
    await axiosInstance.put(`/projects-edit/${id}/`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    setProject((p) => ({ ...p, image: url }));
    clearProjectCache(id);
    notify.success('Cover updated!');
  };

  // ── Cover remove ───────────────────────────────────────────────────────────
  const handleCoverRemove = async () => {
    const fd = new FormData();
    fd.append('username',  username);
    fd.append('p_name',    project.p_name);
    fd.append('p_skills',  project.p_skills);
    fd.append('p_url',     project.p_url);
    fd.append('image',     '');
    try {
      await axiosInstance.put(`/projects-edit/${id}/`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setProject((p) => ({ ...p, image: '' }));
      clearProjectCache(id);
      notify.success('Cover removed.');
    } catch {
      notify.error('Failed to remove cover.');
    }
  };

  // ── Save base info ─────────────────────────────────────────────────────────
  const handleSaveBase = async () => {
    setSavingBase(true);
    const fd = new FormData();
    fd.append('username',  username);
    fd.append('p_name',    editForm.p_name);
    fd.append('p_skills',  editForm.p_skills);
    fd.append('p_url',     editForm.p_url);
    fd.append('image',     project.image || '');
    try {
      await axiosInstance.put(`/projects-edit/${id}/`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setProject((p) => ({ ...p, ...editForm }));
      setEditingBase(false);
      clearProjectCache(id);
      notify.success('Project updated!');
    } catch {
      notify.error('Failed to update.');
    } finally {
      setSavingBase(false);
    }
  };

  // ── Save full detail (manual Save button) ─────────────────────────────────
  // const handleSaveDetail = async () => {
  //   setSaving(true);
  //   try {
  //     await saveDetail();
  //     notify.success('Detail saved!');
  //   } catch {
  //     notify.error('Failed to save.');
  //   } finally {
  //     setSaving(false);
  //   }
  // };

  const handleSaveDetail = async () => {
    setSaving(true);
    try {
      await saveDetail(form); // pass current form snapshot explicitly
      notify.success('Detail saved!');
    } catch {
      notify.error('Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axiosInstance.delete(`/projects-del/${id}/`);
      clearProjectCache(id);
      notify.success('Project deleted.');
      navigate('/adminProjects');
    } catch {
      notify.error('Failed to delete.');
      setDeleting(false);
      setShowDelete(false);
    }
  };

  const heroSlides = [
    ...(project?.image ? [project.image] : []),
    ...form.gallery,
  ];

  // ── Loading ────────────────────────────────────────────────────────────────
  if (fetching) return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="main-bar"><div className="progress-bar" /></div>
    </div>
  );

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="main-bar">

        {/* Header */}
        <div className="admin-header">
          <div className="admin-header-left">
            <h1 className="admin-page-title" style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {project?.p_name || 'Project Detail'}
            </h1>
            {form.status && (
              <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 100, background: `${STATUS_COLORS[form.status]}18`, color: STATUS_COLORS[form.status], border: `1px solid ${STATUS_COLORS[form.status]}33` }}>
                {form.status}
              </span>
            )}
          </div>
          <Headertheme />
        </div>

        {(saving || deleting || savingBase) && <div className="progress-bar" />}

        <div className="admin-content">

          {/* Hero preview */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <AdminHeroSlideshow slides={heroSlides} projectName={project?.p_name} projectSkills={project?.p_skills} />
          </motion.div>

          {/* Project base info */}
          <ProjectInfoCard
            project={project}
            editForm={editForm}
            setEditForm={setEditForm}
            editingBase={editingBase}
            setEditingBase={setEditingBase}
            onSave={handleSaveBase}
            saving={savingBase}
          />

          {/* Images & Gallery */}
          <Card icon="🖼️" title="Images & Gallery" delay={0.08}>
            <GalleryManager
              coverUrl={project?.image}
              onCoverChange={handleCoverChange}
              onCoverRemove={handleCoverRemove}
              gallery={form.gallery}
              onGalleryChange={handleGalleryChange}
            />
          </Card>

          {/* Overview */}
          <Card icon="📋" title="Overview" delay={0.11}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 18 }}>
              <div>
                <FL hint="One sentence">Intro</FL>
                <input style={IS} value={form.intro} placeholder="A full-stack platform built with…"
                  onChange={(e) => setForm((f) => ({ ...f, intro: e.target.value }))} />
              </div>
              <div>
                <FL>Status</FL>
                <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} style={{ ...IS, cursor: 'pointer' }}>
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s || 'Select status…'}</option>)}
                </select>
              </div>
              <div>
                <FL>GitHub URL</FL>
                <input style={IS} value={form.github_url} placeholder="https://github.com/you/repo"
                  onChange={(e) => setForm((f) => ({ ...f, github_url: e.target.value }))} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <FL>Description</FL>
                <textarea style={TS} rows={5} value={form.description}
                  placeholder="What does it do? Why did you build it? What challenges did you overcome?"
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
              </div>
            </div>
          </Card>

          {/* Tech Stack & Features */}
          <Card icon="⚙️" title="Tech Stack & Features" delay={0.14}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <TagInput label="Tech Stack"           placeholder="React, Django… press Enter"        color="accent" items={form.tech_stack} onChange={(v) => setForm((f) => ({ ...f, tech_stack: v }))} />
              <TagInput label="Key Features"         placeholder="JWT Auth, Dark Mode… press Enter"  color="purple" items={form.features}   onChange={(v) => setForm((f) => ({ ...f, features:   v }))} />
              <TagInput label="Future Improvements"  placeholder="Add tests, Deploy to K8s… press Enter" color="green" items={form.future}  onChange={(v) => setForm((f) => ({ ...f, future:     v }))} />
            </div>
          </Card>

          {/* Developer Note */}
          <Card icon="🧑‍💻" title="Developer Note" delay={0.17}>
            <FL hint="Personal note to visitors">Note</FL>
            <textarea style={TS} rows={4} value={form.developer}
              placeholder="What did you learn? What are you proud of? Any interesting engineering decisions?"
              onChange={(e) => setForm((f) => ({ ...f, developer: e.target.value }))} />
          </Card>

          {/* Danger Zone */}
          <Card icon="⚠️" title="Danger Zone" delay={0.2}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--adm-text)' }}>Delete this project</div>
                <div style={{ fontSize: 13, color: 'var(--adm-text-3)', marginTop: 2 }}>Permanently removes the project and all its data. Cannot be undone.</div>
              </div>
              <button onClick={() => setShowDelete(true)}
                style={{ padding: '10px 20px', borderRadius: 100, border: '1.5px solid var(--adm-danger)', background: 'rgba(239,68,68,0.08)', color: 'var(--adm-danger)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--adm-font-body)', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--adm-danger)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = 'var(--adm-danger)'; }}
              >
                Delete Project
              </button>
            </div>
          </Card>

          {/* Sticky save bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.22 }}
            style={{ position: 'sticky', bottom: 24, display: 'flex', justifyContent: 'flex-end', gap: 10, pointerEvents: 'none' }}
          >
            <button onClick={() => navigate('/adminProjects')}
              style={{ pointerEvents: 'all', padding: '12px 22px', borderRadius: 100, border: '1.5px solid var(--adm-border)', background: 'var(--adm-surface)', color: 'var(--adm-text-2)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--adm-font-body)', boxShadow: 'var(--adm-shadow)', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--adm-accent)'; e.currentTarget.style.color = 'var(--adm-accent)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--adm-border)';  e.currentTarget.style.color = 'var(--adm-text-2)'; }}
            >
              Discard
            </button>
            <button onClick={handleSaveDetail} disabled={saving}
              style={{ pointerEvents: 'all', padding: '12px 28px', borderRadius: 100, background: 'var(--adm-gradient)', color: '#fff', border: 'none', fontSize: 14, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'var(--adm-font-body)', boxShadow: '0 4px 20px rgba(108,99,255,0.4)', opacity: saving ? 0.6 : 1, transition: 'all 0.2s' }}
            >
              {saving ? 'Saving…' : '✓ Save Detail'}
            </button>
          </motion.div>

        </div>
      </div>

      <AnimatePresence>
        {showDelete && (
          <DeleteModal project={project} onConfirm={handleDelete} onClose={() => setShowDelete(false)} />
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } } div::-webkit-scrollbar { height: 4px; } div::-webkit-scrollbar-thumb { background: var(--adm-border); border-radius: 4px; }`}</style>
    </div>
  );
};

export default AdminProjectDetail;
