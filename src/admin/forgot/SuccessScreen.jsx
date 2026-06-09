import { useNavigate } from 'react-router-dom';

const SuccessScreen = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', width: '100%', padding: '20px 0' }}>
      <div style={{ fontSize: 60, marginBottom: 16 }}>🎉</div>
      <h1 className="auth-card-title">Password Reset!</h1>
      <p className="auth-card-sub" style={{ marginBottom: 28 }}>
        Your password has been updated successfully.<br />
        You can now sign in with your new password.
      </p>
      <button
        className="auth-submit-btn"
        onClick={() => navigate('/admin/login')}
        style={{ marginTop: 0 }}
      >
        Sign In →
      </button>
    </div>
  );
};

export default SuccessScreen;
