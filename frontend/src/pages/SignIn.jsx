import React, { useState } from 'react';

const SignIn = ({ navigateTo, onSignIn }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSignIn(formData);
  };

  return (
    <div className="page">
      <div className="auth-container">
        <div className="auth-card">
          <h2>Welcome Back</h2>
          <p>Sign in to continue your practice</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Sign In
            </button>

            <a href="#" className="forgot-password">
              Forgot Password?
            </a>
          </form>

          <div className="auth-footer">
            Don't have an account?{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('signup'); }}>
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;