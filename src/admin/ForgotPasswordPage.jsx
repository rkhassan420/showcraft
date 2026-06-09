import { useState, useEffect, useContext } from 'react';
import { Link }                            from 'react-router-dom';
import axiosInstance                       from '../utils/axiosInstance';
import { ToastContainer, toast }           from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Step1Email    from './forgot/Step1Email';
import Step2OTP      from './forgot/Step2OTP';
import Step3NewPassword from './forgot/Step3NewPassword';
import SuccessScreen from './forgot/SuccessScreen';
import './auth.css';

const STEP_LABELS = ['Enter Email', 'Verify OTP', 'New Password'];

const ForgotPasswordPage = () => {
  const [step,      setStep]      = useState(1);
  const [done,      setDone]      = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const [formData, setFormData] = useState({
    email: '', otp: '', password: '', confirmPass: '',
  });
  const [errors, setErrors] = useState({});

  // OTP countdown
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

  // ── Step 1: Send OTP ──
  const handleSendOTP = async () => {
    setLoading(true);
    try {
      await axiosInstance.post('/api/forgot-password/send-otp/', {
        email: formData.email.trim(),
      });
      toast.success('OTP sent! Check your inbox.');
      setStep(2);
      setCountdown(60);
    } catch (err) {
      setErrors({ general: err.response?.data?.error || 'Failed to send OTP' });
    } finally {
      setLoading(false);
    }
  };

  // ── Resend OTP ──
  const handleResend = async () => {
    if (countdown > 0) return;
    setOtpLoading(true);
    try {
      await axiosInstance.post('/api/forgot-password/send-otp/', {
        email: formData.email.trim(),
      });
      toast.success('New OTP sent!');
      setCountdown(60);
    } catch {
      toast.error('Failed to resend OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  // ── Step 2: Verify OTP ──
  const handleVerifyOTP = async () => {
    setLoading(true);
    try {
      await axiosInstance.post('/api/forgot-password/verify-otp/', {
        email: formData.email.trim(),
        otp:   formData.otp.trim(),
      });
      toast.success('OTP verified!');
      setStep(3);
    } catch (err) {
      setErrors({ general: err.response?.data?.error || 'Invalid OTP' });
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: Reset Password ──
  const handleReset = async () => {
    setLoading(true);
    try {
      await axiosInstance.post('/api/forgot-password/reset/', {
        email:        formData.email.trim(),
        otp:          formData.otp.trim(),
        new_password: formData.password,
      });
      setDone(true);
    } catch (err) {
      setErrors({ general: err.response?.data?.error || 'Failed to reset password' });
    } finally {
      setLoading(false);
    }
  };

  // Progress bar width
  const progressWidth = done ? '100%' : `${((step - 1) / 3) * 100 + 17}%`;

  return (
    <div className="auth-page">
      <ToastContainer />

      <div className="auth-bg">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
        <div className="auth-orb auth-orb-3" />
      </div>

      
      <div className="auth-container">

        {/* ── Left panel ── */}
        <div className="auth-left">
          <div className="auth-left-inner">
            <div className="auth-brand">ShowCraft</div>
            <h2 className="auth-left-title">
              Forgot your<br />
              <span className="auth-gradient-text">password?</span>
            </h2>
            <p className="auth-left-sub">
              No worries! Enter your email and we'll send you a
              6-digit code to reset your password securely.
            </p>

            {/* Step indicators */}
            <div className="auth-steps">
              {STEP_LABELS.map((label, i) => (
                <div className="auth-step-item" key={label}>
                  <div className={`auth-step-dot ${step > i || done ? 'active' : ''}`}>
                    {step > i + 1 || done ? '✓' : i + 1}
                  </div>
                  <span className={`auth-step-label ${step > i || done ? 'active' : ''}`}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right panel ── */}
        <div className="auth-right">
          <div className="auth-card">

            <div className="auth-card-logo">ShowCraft</div>

            {/* Progress bar */}
            <div className="auth-progress-track" style={{ width: '100%' }}>
              <div className="auth-progress-fill" style={{ width: progressWidth }} />
            </div>

            {/* ── Render active step ── */}
            {done && <SuccessScreen />}

            {!done && step === 1 && (
              <Step1Email
                formData={formData}
                errors={errors}
                setErrors={setErrors}
                loading={loading}
                onChange={handleChange}
                onSubmit={handleSendOTP}
              />
            )}

            {!done && step === 2 && (
              <Step2OTP
                formData={formData}
                errors={errors}
                setErrors={setErrors}
                loading={loading}
                otpLoading={otpLoading}
                countdown={countdown}
                onChange={handleChange}
                onSubmit={handleVerifyOTP}
                onResend={handleResend}
                onBack={() => { setStep(1); setErrors({}); }}
              />
            )}

            {!done && step === 3 && (
              <Step3NewPassword
                formData={formData}
                errors={errors}
                setErrors={setErrors}
                loading={loading}
                onChange={handleChange}
                onSubmit={handleReset}
              />
            )}

            {/* Bottom links (only on step 1) */}
            {!done && step === 1 && (
              <>
                <p className="auth-switch">
                  Remember your password?{' '}
                  <Link to="/admin/login">Sign in</Link>
                </p>
                <Link to="/" className="auth-back-link">← Back to Home</Link>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

