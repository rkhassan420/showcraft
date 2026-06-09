// ── OAuth Configuration ───────────────────────────────────
// Replace these with your actual credentials from:
// Google: https://console.cloud.google.com/
// GitHub: https://github.com/settings/developers

export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
export const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID || '';
export const GITHUB_CLIENT_SECRET = import.meta.env.VITE_GITHUB_CLIENT_SECRET || '';

// Redirect URI — must match what you set in Google/GitHub console
export const REDIRECT_URI = typeof window !== 'undefined'
  ? `${window.location.origin}/oauth/callback`
  : 'http://localhost:3000/oauth/callback';

// ── Google OAuth ──────────────────────────────────────────
export const initiateGoogleLogin = () => {
  if (!GOOGLE_CLIENT_ID) {
    alert('Google Client ID not configured. Add VITE_GOOGLE_CLIENT_ID to .env');
    return;
  }

  const params = new URLSearchParams({
    client_id:     GOOGLE_CLIENT_ID,
    redirect_uri:  REDIRECT_URI,
    response_type: 'token',   // implicit flow — returns access_token directly
    scope:         'openid email profile',
    state:         'google',
  });

  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
};


// ── GitHub OAuth ──────────────────────────────────────────
export const initiateGitHubLogin = () => {
  if (!GITHUB_CLIENT_ID) {
    alert('GitHub Client ID not configured. Add VITE_GITHUB_CLIENT_ID to .env');
    return;
  }

  const params = new URLSearchParams({
    client_id:    GITHUB_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope:        'read:user user:email',
    state:        'github',
  });

  window.location.href = `https://github.com/login/oauth/authorize?${params}`;
};