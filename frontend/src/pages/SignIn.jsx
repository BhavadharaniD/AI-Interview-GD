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
      <div className="flex justify-center items-center min-h-screen px-5">
        <div className="auth-card">
          <h2 className="text-center text-4xl mb-2 gradient-text">Welcome Back</h2>
          <p className="text-center text-gray-400 mb-8">Sign in to continue your practice</p>

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

            <button type="submit" className="btn btn-primary w-full">
              Sign In
            </button>

            <a href="#" className="block text-center my-5 text-gray-400 no-underline hover:text-[#ff00ff]">
              Forgot Password?
            </a>
          </form>

          <div className="text-center mt-5 text-gray-400">
            Don't have an account?{' '}
            <a
              href="#"
              className="text-[#ff00ff] no-underline font-semibold hover:underline"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('signup');
              }}
            >
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;