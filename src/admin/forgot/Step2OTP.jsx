import { validateOTP } from '../../utils/validators';

const Step2OTP = ({
  formData, errors, setErrors,
  loading, otpLoading, countdown,
  onChange, onSubmit, onResend, onBack,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const oErr = validateOTP(formData.otp);
    if (oErr) { setErrors({ otp: oErr }); return; }
    onSubmit();
  };

  return (
    <>
      <h1 className="auth-card-title">Enter Code</h1>
      <p className="auth-card-sub">
        Step 2 of 3 — We sent a 6-digit code to{' '}
        <strong style={{ color: '#6c63ff' }}>{formData.email}</strong>
      </p>

      {errors.general && (
        <div className="auth-error-banner">⚠ {errors.general}</div>
      )}

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-field">
          <label className="auth-label">Verification Code</label>
          <input
            type="text"
            name="otp"
            autoComplete="off"            
            maxLength={6}
            value={formData.otp}
            onChange={onChange}
            className={`auth-input auth-otp-input ${errors.otp ? 'auth-input-error' : ''}`}
          />
          {errors.otp && (
            <span className="auth-field-error">⚠ {errors.otp}</span>
          )}
        </div>

        <div className="auth-otp-meta">
          <span>Didn't receive it?</span>
          <button
            type="button"
            className="auth-resend-btn"
            onClick={onResend}
            disabled={countdown > 0 || otpLoading}
          >
            {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
          </button>
        </div>

        <button type="submit" className="auth-submit-btn" disabled={loading}>
          {loading
            ? <><span className="auth-spinner" /> Verifying...</>
            : 'Verify Code →'}
        </button>

        <button type="button" className="auth-back-btn" onClick={onBack}>
          ← Change Email
        </button>
      </form>
    </>
  );
};

export default Step2OTP;
