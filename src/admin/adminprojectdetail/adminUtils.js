import { supabase } from '../supabaseClient.js';

// ─── Supabase upload ──────────────────────────────────────────────────────────
export const uploadToSupabase = async (file, prefix = 'img') => {
  const ext  = file.name.split('.').pop();
  const path = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from('portfolio').upload(path, file);
  if (error) throw error;
  return supabase.storage.from('portfolio').getPublicUrl(path).data.publicUrl;
};

// ─── Project cache invalidation ───────────────────────────────────────────────
// Call this after any save/delete so ProjectDetailPage shows fresh data
export const clearProjectCache = (id) => {
  localStorage.removeItem(`project_${id}`);
  localStorage.removeItem(`projectDetail_${id}`);
};

// ─── Safe JSON parse for arrays ───────────────────────────────────────────────
// Backend may return extra_images / tech_stack as a JSON string or a real array
export const parseArrayField = (val) => {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try { const p = JSON.parse(val); return Array.isArray(p) ? p : []; }
    catch { return []; }
  }
  return [];
};
