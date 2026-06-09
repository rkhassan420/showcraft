import { validateEmail } from '../../utils/validators';

const Step1Email = ({ formData, errors, setErrors, loading, onChange, onSubmit }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const eErr = validateEmail(formData.email);
    if (eErr) { setErrors({ email: eErr }); return; }
    onSubmit();
  };

  return (
    <>
      <h1 className="auth-card-title">Reset Password</h1>
      <p className="auth-card-sub">
        Step 1 of 3 — Enter your registered email address
      </p>

      {errors.general && (
        <div className="auth-error-banner">⚠ {errors.general}</div>
      )}

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-field">
          <label className="auth-label">Email Address</label>
          <div className="auth-input-wrap">
            
            <input
              type="email"
              name="email"
              autoComplete="off"
              placeholder="you@example.com"
              value={formData.email}
              onChange={onChange}
              className={`auth-input ${errors.email ? 'auth-input-error' : ''}`}
            />
          </div>
          {errors.email && (
            <span className="auth-field-error">⚠ {errors.email}</span>
          )}
        </div>

        <button type="submit" className="auth-submit-btn" disabled={loading}>
          {loading
            ? <><span className="auth-spinner" /> Sending OTP...</>
            : 'Send Reset Code →'}
        </button>
      </form>
    </>
  );
};

export default Step1Email;
