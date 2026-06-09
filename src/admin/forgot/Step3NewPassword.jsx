import { useState } from 'react';
import { validatePassword } from '../../utils/validators';

const Step3NewPassword = ({ formData, errors, setErrors, loading, onChange, onSubmit }) => {
  const [showPass,    setShowPass]    = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const pErr = validatePassword(formData.password);
    if (pErr) { setErrors({ password: pErr }); return; }
    if (formData.password !== formData.confirmPass) {
      setErrors({ confirmPass: 'Passwords do not match' });
      return;
    }
    onSubmit();
  };

  const strength =
    formData.password.length < 3 ? 'Weak'
    : formData.password.length < 6 ? 'Fair'
    : 'Strong';

  const strengthColor =
    strength === 'Weak' ? '#ef4444'
    : strength === 'Fair' ? '#f59e0b'
    : '#10b981';

  const passwordsMatch =
    formData.confirmPass && formData.password === formData.confirmPass;

  return (
    <>
      <h1 className="auth-card-title">New Password</h1>
      <p className="auth-card-sub">
        Step 3 of 3 — Choose a strong new password
      </p>

      {errors.general && (
        <div className="auth-error-banner">⚠ {errors.general}</div>
      )}

      <form className="auth-form" onSubmit={handleSubmit}>

        {/* New password */}
        <div className="auth-field">
          <label className="auth-label">New Password</label>
          <div className="auth-input-wrap">
          
            <input
              type={showPass ? 'text' : 'password'}
              name="password"
              autoComplete="off"
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={onChange}
              className={`auth-input ${errors.password ? 'auth-input-error' : ''}`}
              style={{ paddingRight: '48px' }}
            />
            <button
              type="button"
              className="auth-eye-btn"
              onClick={() => setShowPass(!showPass)}
              tabIndex={-1}
            >
              {showPass ? '🙈' : '👁'}
            </button>
          </div>

          {/* Strength bar */}
          {formData.password && (
            <div className="auth-strength">
              <div className="auth-strength-bars">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="auth-strength-bar"
                    style={{
                      background: formData.password.length >= n * 3
                        ? n === 1 ? '#ef4444' : n === 2 ? '#f59e0b' : '#10b981'
                        : 'var(--p-border, rgba(0,0,0,0.08))',
                    }}
                  />
                ))}
              </div>
              <span className="auth-strength-label" style={{ color: strengthColor }}>
                {strength}
              </span>
            </div>
          )}

          {errors.password && (
            <span className="auth-field-error">⚠ {errors.password}</span>
          )}
        </div>

        {/* Confirm password */}
        <div className="auth-field">
          <label className="auth-label">Confirm Password</label>
          <div className="auth-input-wrap">
            
            <input
              type={showConfirm ? 'text' : 'password'}
              name="confirmPass"
              autoComplete="off"
              placeholder="Re-enter your password"
              value={formData.confirmPass}
              onChange={onChange}
              className={`auth-input ${errors.confirmPass ? 'auth-input-error' : ''}`}
              style={{ paddingRight: '48px' }}
            />
            <button
              type="button"
              className="auth-eye-btn"
              onClick={() => setShowConfirm(!showConfirm)}
              tabIndex={-1}
            >
              {showConfirm ? '🙈' : '👁'}
            </button>
          </div>

          {/* Match indicator */}
          {formData.confirmPass && (
            <span style={{
              fontSize: 12,
              fontWeight: 600,
              color: passwordsMatch ? '#10b981' : '#ef4444',
            }}>
              {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
            </span>
          )}

          {errors.confirmPass && (
            <span className="auth-field-error">⚠ {errors.confirmPass}</span>
          )}
        </div>

        <button type="submit" className="auth-submit-btn" disabled={loading}>
          {loading
            ? <><span className="auth-spinner" /> Resetting...</>
            : 'Reset Password'}
        </button>
      </form>
    </>
  );
};

export default Step3NewPassword;
