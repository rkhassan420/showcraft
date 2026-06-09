import { useEffect, useState } from 'react';
import { useNavigate }         from 'react-router-dom';
import { useAuth }             from '../AuthContext.jsx';
import axiosInstance           from '../utils/axiosInstance';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '../utils/oauth';
import Loading                 from '../page/loading.jsx';

/**
 * This page handles the OAuth redirect from Google and GitHub.
 * URL: /oauth/callback
 *
 * Google sends: #access_token=...&state=google
 * GitHub sends: ?code=...&state=github
 */
const OAuthCallback = () => {
  const navigate       = useNavigate();
  const { login }      = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // ── Parse URL ──────────────────────────────────────
        const hash   = window.location.hash;    // Google uses hash
        const search = window.location.search;  // GitHub uses query

        const hashParams  = new URLSearchParams(hash.replace('#', ''));
        const queryParams = new URLSearchParams(search);

        const state = hashParams.get('state') || queryParams.get('state');

        // ── Google ─────────────────────────────────────────
        if (state === 'google') {
          const accessToken = hashParams.get('access_token');
          if (!accessToken) {
            setError('Google login failed — no access token received.');
            return;
          }

          const res = await axiosInstance.post('/api/auth/google/', {
            access_token: accessToken,
          });

          login(res.data);
          navigate('/admin', { replace: true });
          return;
        }

        // ── GitHub ─────────────────────────────────────────
        if (state === 'github') {
          const code = queryParams.get('code');
          if (!code) {
            setError('GitHub login failed — no code received.');
            return;
          }

          const res = await axiosInstance.post('/api/auth/github/', {
            code,
            client_id:     GITHUB_CLIENT_ID,
            client_secret: GITHUB_CLIENT_SECRET,
          });

          login(res.data);
          navigate('/admin', { replace: true });
          return;
        }

        setError('Unknown OAuth provider.');
      } catch (err) {
        const msg = err.response?.data?.error || 'OAuth login failed. Please try again.';
        setError(msg);
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleCallback();
  }, []);

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        padding: 20,
        background: 'var(--background)',
      }}>
        <div style={{ fontSize: 48 }}>❌</div>
        <h2 style={{ color: 'var(--adm-text, #111)', fontFamily: 'Syne, sans-serif' }}>Login Failed</h2>
        <p style={{ color: '#888', fontSize: 14, textAlign: 'center', maxWidth: 360 }}>{error}</p>
        <p style={{ color: '#aaa', fontSize: 13 }}>Redirecting to login page...</p>
      </div>
    );
  }

  return <Loading />;
};

export default OAuthCallback;