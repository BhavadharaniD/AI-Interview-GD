import React, { useState } from 'react';

const SignUp = ({ navigateTo, onSignUp }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: '',
    language: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSignUp(formData);
  };

  return (
    <div className="page">
      <div className="flex justify-center items-center min-h-screen px-5">
        <div className="auth-card">
          <h2 className="text-center text-4xl mb-2 gradient-text">Get Started</h2>
          <p className="text-center text-gray-400 mb-8">Create your account to start practicing</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

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

            <div className="form-group">
              <label>I am a</label>
              <select name="role" value={formData.role} onChange={handleChange} required>
                <option value="">Select your role</option>
                <option value="student">Student</option>
                <option value="graduate">Recent Graduate</option>
                <option value="professional">Working Professional</option>
                <option value="recruiter">Recruiter</option>
              </select>
            </div>

            <div className="form-group">
              <label>Preferred Language</label>
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                required
              >
                <option value="">Select language</option>
                <option value="english">English</option>
                <option value="hindi">Hindi</option>
                <option value="spanish">Spanish</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary w-full">
              Create Account
            </button>
          </form>

          <div className="text-center mt-5 text-gray-400">
            Already have an account?{' '}
            <a
              href="#"
              className="text-[#ff00ff] no-underline font-semibold hover:underline"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('signin');
              }}
            >
              Sign In
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;