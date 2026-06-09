import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link }               from 'react-router-dom';
import { useAuth }                         from '../AuthContext.jsx';
import axiosInstance                       from '../utils/axiosInstance';
import { validateUsername, validateEmail, validatePassword, validateOTP } from '../utils/validators';
// import { notify }                          from '../utils/notifications';
import { ToastContainer }                  from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { initiateGoogleLogin, initiateGitHubLogin } from '../utils/oauth';
import moon_icon from '../assets/moon_icon.png';
import sun_icon  from '../assets/sun.png';
import './auth.css';

const RegisterPage = () => {
  const { login, isLoggedIn }  = useAuth();
  const navigate               = useNavigate();

  const [step,       setStep]       = useState(1);
  const [loading,    setLoading]    = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [countdown,  setCountdown]  = useState(0);
  const [showPass,   setShowPass]   = useState(false);
  const [formData,   setFormData]   = useState({ username: '', email: '', password: '', otp: '' });
  const [errors,     setErrors]     = useState({});

  useEffect(() => { if (isLoggedIn) navigate('/admin', { replace: true }); }, [isLoggedIn]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setErrors((p)  => ({ ...p, [name]: null, general: null }));
  };

  const validateStep1 = () => {
    const errs = {};
    const uErr = validateUsername(formData.username);
    const eErr = validateEmail(formData.email);
    const pErr = validatePassword(formData.password);
    if (uErr) errs.username = uErr;
    if (eErr) errs.email    = eErr;
    if (pErr) errs.password = pErr;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!validateStep1()) return;
    setOtpLoading(true);
    try {
      await axiosInstance.post('/api/send-otp/', { email: formData.email });
      notify.success(`OTP sent to ${formData.email}`);
      setStep(2);
      setCountdown(60);
    } catch (err) {
      setErrors((p) => ({ ...p, general: err.response?.data?.error || 'Failed to send OTP' }));
    } finally { setOtpLoading(false); }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setOtpLoading(true);
    try {
      await axiosInstance.post('/api/send-otp/', { email: formData.email });
      notify.success('New OTP sent!');
      setCountdown(60);
    } catch { notify.error('Failed to resend OTP'); }
    finally  { setOtpLoading(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const oErr = validateOTP(formData.otp);
    if (oErr) { setErrors((p) => ({ ...p, otp: oErr })); return; }
    setLoading(true);
    try {
      await axiosInstance.post('/api/verify-otp/', { email: formData.email, otp: formData.otp.trim() });
      const res = await axiosInstance.post('/api/register/', {
        username: formData.username.trim(),
        email:    formData.email.trim(),
        password: formData.password,
      });
      login(res.data);
      notify.success('Account created! Welcome 🎉', { autoClose: 1500 });
      setTimeout(() => navigate('/admin'), 1200);
    } catch (err) {
      setErrors((p) => ({ ...p, general: err.response?.data?.error || 'Registration failed' }));
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <ToastContainer />
      <div className="auth-bg">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
        <div className="auth-orb auth-orb-3" />
      </div>
  

      <div className="auth-container">
        {/* Left */}
        <div className="auth-left">
          <div className="auth-left-inner">
            <div className="auth-brand">ShowCraft</div>
            <h2 className="auth-left-title">Your portfolio,<br /><span className="auth-gradient-text">your identity.</span></h2>
            <p className="auth-left-sub">Create an account in 60 seconds. Add your projects, skills, and links — then share your unique portfolio link with the world.</p>
            <div className="auth-steps">
              {[{ n: 1, label: 'Create account' }, { n: 2, label: 'Verify email' }, { n: 3, label: 'Build portfolio' }].map((s) => (
                <div className="auth-step-item" key={s.n}>
                  <div className={`auth-step-dot ${step >= s.n ? 'active' : ''}`}>{s.n}</div>
                  <span className={`auth-step-label ${step >= s.n ? 'active' : ''}`}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="auth-right">
          <div className="auth-card">
            <div className="auth-card-logo">ShowCraft</div>
            <div className="auth-progress-track" style={{ width: '100%' }}>
              <div className="auth-progress-fill" style={{ width: step === 1 ? '50%' : '100%' }} />
            </div>

            {step === 1 ? (
              <>
                <h1 className="auth-card-title">Create Account</h1>
                <p className="auth-card-sub">Step 1 of 2 — Fill in your details</p>

                {/* OAuth */}
                <div className="auth-oauth-row" style={{ width: '100%' }}>
                  <button className="auth-oauth-btn" onClick={initiateGoogleLogin} type="button">
                    <span className="auth-oauth-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    </span>
                    Google
                  </button>
                  <button className="auth-oauth-btn" onClick={initiateGitHubLogin} type="button">
                    <span className="auth-oauth-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                      </svg>
                    </span>
                    GitHub
                  </button>
                </div>

                <div className="auth-divider" style={{ width: '100%' }}>
                  <div className="auth-divider-line" />
                  <span className="auth-divider-text">or with email</span>
                  <div className="auth-divider-line" />
                </div>

                {errors.general && <div className="auth-error-banner">⚠ {errors.general}</div>}

                <form className="auth-form" onSubmit={handleSendOTP}>
                  <div className="auth-field">
                    <label className="auth-label">Username</label>
                    <div className="auth-input-wrap">
                     
                      <input type="text" name="username" autoComplete="off" placeholder="e.g. john_dev"
                        value={formData.username} onChange={handleChange}
                        className={`auth-input ${errors.username ? 'auth-input-error' : ''}`} />
                    </div>
                    {errors.username && <span className="auth-field-error">⚠ {errors.username}</span>}
                  </div>

                  <div className="auth-field">
                    <label className="auth-label">Email Address</label>
                    <div className="auth-input-wrap">
                  
                      <input type="email" name="email" autoComplete="off" placeholder="you@example.com"
                        value={formData.email} onChange={handleChange}
                        className={`auth-input ${errors.email ? 'auth-input-error' : ''}`} />
                    </div>
                    {errors.email && <span className="auth-field-error">⚠ {errors.email}</span>}
                  </div>

                  <div className="auth-field">
                    <label className="auth-label">Password</label>
                    <div className="auth-input-wrap">
                    
                      <input type={showPass ? 'text' : 'password'} name="password" autoComplete="off"
                        placeholder="Minimum 6 characters"
                        value={formData.password} onChange={handleChange}
                        className={`auth-input ${errors.password ? 'auth-input-error' : ''}`}
                        style={{ paddingRight: '48px' }} />
                      <button type="button" className="auth-eye-btn" onClick={() => setShowPass(!showPass)} tabIndex={-1}>
                        {showPass ? '🙈' : '👁'}
                      </button>
                    </div>
                    {formData.password && (
                      <div className="auth-strength">
                        <div className="auth-strength-bars">
                          {[1,2,3].map((n) => (
                            <div key={n} className="auth-strength-bar" style={{
                              background: formData.password.length >= n*3
                                ? n===1 ? '#ef4444' : n===2 ? '#f59e0b' : '#10b981'
                                : 'var(--p-border,rgba(0,0,0,0.08))'
                            }} />
                          ))}
                        </div>
                        <span className="auth-strength-label">
                          {formData.password.length < 3 ? 'Weak' : formData.password.length < 6 ? 'Fair' : 'Strong'}
                        </span>
                      </div>
                    )}
                    {errors.password && <span className="auth-field-error">⚠ {errors.password}</span>}
                  </div>

                  <button type="submit" className="auth-submit-btn" disabled={otpLoading}>
                    {otpLoading ? <><span className="auth-spinner" /> Sending OTP...</> : 'Continue →'}
                  </button>
                </form>

                <p className="auth-switch">Already have an account? <Link to="/admin/login">Sign in</Link></p>
                <Link to="/" className="auth-back-link">← Back to Home</Link>
              </>
            ) : (
              <>
                <h1 className="auth-card-title">Verify Email</h1>
                <p className="auth-card-sub">
                  Step 2 of 2 — Enter the 6-digit code sent to{' '}
                  <strong style={{ color: '#6c63ff' }}>{formData.email}</strong>
                </p>
                {errors.general && <div className="auth-error-banner">⚠ {errors.general}</div>}
                <form className="auth-form" onSubmit={handleRegister}>
                  <div className="auth-field">
                    <label className="auth-label">Verification Code</label>
                    <input type="text" name="otp" autoComplete="off" placeholder="455862"
                      maxLength={6} value={formData.otp} onChange={handleChange}
                      className={`auth-input auth-otp-input ${errors.otp ? 'auth-input-error' : ''}`} />
                    {errors.otp && <span className="auth-field-error">⚠ {errors.otp}</span>}
                  </div>
                  <div className="auth-otp-meta">
                    <span>Didn't receive it?</span>
                    <button type="button" className="auth-resend-btn" onClick={handleResend} disabled={countdown > 0 || otpLoading}>
                      {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                    </button>
                  </div>
                  <button type="submit" className="auth-submit-btn" disabled={loading}>
                    {loading ? <><span className="auth-spinner" /> Creating account...</> : 'Create Account'}
                  </button>
                  <button type="button" className="auth-back-btn" onClick={() => { setStep(1); setErrors({}); }}>← Back</button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;