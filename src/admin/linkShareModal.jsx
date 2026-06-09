import { useState, useEffect } from 'react';
import { useToast } from '../utils/useToast';
import axiosInstance from '../utils/axiosInstance';

const BASE = 'https://showcraft.netlify.app/portfolio';

const PortfolioLinkModal = ({ username, onClose }) => {
  const notify = useToast();
  const baseUrl = `${BASE}/${username}`;

  const [slug, setSlug] = useState('');
  const [slugStatus, setSlugStatus] = useState('idle'); // idle|checking|available|taken|short|error
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savedLink, setSavedLink] = useState(null); // existing link from backend
  const [loadingLink, setLoadingLink] = useState(true);

  // fetch existing link on open
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axiosInstance.get('/portfolio-link/');
        if (res.data) {
          setSavedLink(res.data);
          setSlug(res.data.slug);
        }
      } catch {
        /* none saved yet */
      } finally {
        setLoadingLink(false);
      }
    };
    fetch();
  }, []);

  // debounced slug availability check
  useEffect(() => {
    if (!slug) {
      setSlugStatus('idle');
      return;
    }
    if (slug.length < 3) {
      setSlugStatus('short');
      return;
    }
    // if same as already saved slug — no need to check
    if (savedLink && slug === savedLink.slug) {
      setSlugStatus('available');
      return;
    }

    setSlugStatus('checking');
    const timer = setTimeout(async () => {
      try {
        const res = await axiosInstance.get('/portfolio-link/check-slug/', { params: { slug } });
        setSlugStatus(res.data.available ? 'available' : 'taken');
      } catch {
        setSlugStatus('error');
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [slug, savedLink]);

  const handleSave = async () => {
    if (slugStatus !== 'available') return;
    setSaving(true);
    try {
      const res = await axiosInstance.post('/portfolio-link/', { slug });
      setSavedLink(res.data);
      notify.success('Link saved!');
    } catch (err) {
      notify.error(err?.response?.data?.error || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete('/portfolio-link/');
      setSavedLink(null);
      setSlug('');
      setSlugStatus('idle');
      notify.success('Link removed');
    } catch {
      notify.error('Failed to delete');
    }
  };

  const handleCopy = (value) => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    notify.success('Copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const customUrl = slug ? `${BASE}/${slug}` : null;

  const statusConfig = {
    idle: null,
    short: { color: 'var(--adm-text-3)', icon: '—', text: 'Min 3 characters' },
    checking: { color: 'var(--adm-text-3)', icon: '⏳', text: 'Checking...' },
    available: { color: 'var(--adm-success)', icon: '✓', text: 'Available' },
    taken: { color: 'var(--adm-danger)', icon: '✕', text: 'Already taken' },
    error: { color: 'var(--adm-warning)', icon: '⚠', text: 'Check failed' },
  }[slugStatus];

  return (
    <div className="pl-overlay" onClick={(e) => e.target.classList.contains('pl-overlay') && onClose()}>
      <div className="pl-modal">
        {/* Header */}
        <div className="pl-header">
          <div className="pl-header-left">
            <div className="pl-header-icon">🔗</div>
            <div>
              <div className="pl-title">Custom Portfolio Link</div>
              <div className="pl-subtitle">@{username}</div>
            </div>
          </div>
          <button className="pl-close" onClick={onClose}>✕</button>
        </div>

        {/* Default URL bar */}
        <div className="pl-preview-bar">
          <span className="pl-live-dot" />
          <span className="pl-preview-url">{baseUrl}</span>
          <a href={baseUrl} target="_blank" rel="noopener noreferrer" className="pl-open-btn">
            Open ↗
          </a>
        </div>

        <div className="pl-body">
          {loadingLink ? (
            <div className="pl-empty">Loading...</div>
          ) : (
            <>
              {/* Slug input */}
              <div className="pl-builder-row">
                <label className="pl-builder-label">
                  Your Custom Link
                  {statusConfig && (
                    <span
                      style={{
                        color: statusConfig.color,
                        marginLeft: 8,
                        fontWeight: 600,
                        textTransform: 'none',
                        letterSpacing: 0,
                      }}
                    >
                      {statusConfig.icon} {statusConfig.text}
                    </span>
                  )}
                </label>
                <div
                  className={`pl-input-wrap ${
                    slugStatus === 'available' ? 'valid' : slugStatus === 'taken' ? 'invalid' : ''
                  }`}
                >
                  <span className="pl-input-prefix">portfolio/</span>
                  <input
                    className="pl-input"
                    type="text"
                    placeholder={username}
                    value={slug}
                    onChange={(e) =>
                      setSlug(e.target.value.replace(/[^a-z0-9-_]/g, '').toLowerCase())
                    }
                    maxLength={80}
                  />
                </div>
              </div>

              {/* Live preview */}
              {customUrl && (
                <div className={`pl-custom-result ${slugStatus === 'available' ? 'valid' : ''}`}>
                  <span className="pl-custom-result-url">{customUrl}</span>
                  {slugStatus === 'available' && savedLink?.slug === slug && (
                    <button
                      className={`pl-copy-btn ${copied ? 'copied' : ''}`}
                      onClick={() => handleCopy(customUrl)}
                    >
                      {copied ? '✓ Copied' : 'Copy'}
                    </button>
                  )}
                </div>
              )}

              {/* Save / Delete */}
              <div className="pl-btn-row">
                <button
                  className="pl-btn-save"
                  onClick={handleSave}
                  disabled={saving || slugStatus !== 'available'}
                >
                  {saving ? 'Saving...' : savedLink ? '💾 Update Link' : '💾 Save Link'}
                </button>

                {savedLink && (
                  <button className="pl-btn-delete" onClick={handleDelete}>
                    🗑 Remove
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="pl-actions">
          <button
            className="pl-btn-share"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `${username}'s Portfolio`,
                  url: savedLink ? customUrl : baseUrl,
                });
              } else {
                handleCopy(savedLink ? customUrl : baseUrl);
              }
            }}
          >
            <span>📤</span> Share
          </button>
          <button
            className="pl-btn-preview"
            onClick={() => window.open(savedLink ? customUrl : baseUrl, '_blank')}
          >
            <span>👁</span> Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default PortfolioLinkModal;