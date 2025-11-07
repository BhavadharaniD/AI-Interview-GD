import React from 'react';

const LandingPage = ({ navigateTo }) => {
  return (
    <div className="page landing-page">
      <section className="hero">
        <div className="hero-content">
          <h1>
            Practice Interviews & GDs with AI — <span>just by talking!</span>
          </h1>
          <p>Speak naturally. Get instant feedback. Improve confidence 24/7.</p>
          <div className="cta-buttons">
            <button className="btn btn-primary" onClick={() => navigateTo('signup')}>
              Try Now
            </button>
            <button className="btn btn-secondary" onClick={() => navigateTo('signin')}>
              Sign Up Free
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="mic-animation">
            <div className="mic-icon">🎤</div>
          </div>
        </div>
      </section>

      <section className="features">
        <h2>How It Works</h2>
        <p style={{ textAlign: 'center', color: '#ccc', marginBottom: '50px' }}>
          Simple, powerful, effective
        </p>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎙️</div>
            <h3>Speak to AI</h3>
            <p>Have a conversation with your AI interviewer</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Get Instant Feedback</h3>
            <p>Receive real-time analysis of your responses</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Track Your Progress</h3>
            <p>Monitor improvements over time</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏆</div>
            <h3>Ace Your Interviews</h3>
            <p>Build confidence for the real thing</p>
          </div>
        </div>

        <h2>Why Choose AI Interview Coach?</h2>
        <p style={{ textAlign: 'center', color: '#ccc', marginBottom: '50px' }}>
          Everything you need to succeed
        </p>

        <div className="why-choose">
          <div className="why-card">
            <div className="why-icon">🎤</div>
            <h3>Voice-First Practice</h3>
            <p>
              Get fluent naturally — AI feels like a real interviewer. No awkward text
              chats.
            </p>
          </div>
          <div className="why-card">
            <div className="why-icon">💬</div>
            <h3>Instant Feedback</h3>
            <p>Get real-time insights on delivery, content, and every move you make</p>
          </div>
          <div className="why-card">
            <div className="why-icon">📈</div>
            <h3>Track Progress</h3>
            <p>
              Monitor your improvement with detailed performance metrics and graphs
            </p>
          </div>
          <div className="why-card">
            <div className="why-icon">⏰</div>
            <h3>24/7 Availability</h3>
            <p>Practice anytime, anywhere — just as if real time</p>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <h2>What Our Users Say</h2>
        <p style={{ textAlign: 'center', color: '#ccc', marginBottom: '40px' }}>
          Join thousands of successful candidates
        </p>

        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-header">
              <div className="testimonial-avatar">👤</div>
              <div className="testimonial-info">
                <h4>Priya Sharma</h4>
                <p>Software Engineer</p>
              </div>
            </div>
            <div className="testimonial-text">
              "This platform helped me land my dream consulting role. The AI feedback
              was spot on!"
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-header">
              <div className="testimonial-avatar">👤</div>
              <div className="testimonial-info">
                <h4>Rahul Verma</h4>
                <p>MBA Student</p>
              </div>
            </div>
            <div className="testimonial-text">
              "Practicing group discussions with AI felt so real. My confidence improved
              massively!"
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-header">
              <div className="testimonial-avatar">👤</div>
              <div className="testimonial-info">
                <h4>Anamya Patel</h4>
                <p>Recent Graduate</p>
              </div>
            </div>
            <div className="testimonial-text">
              "The fluency training feature helped me identify and fix issues early,
              saving time in interviews!"
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Transform Your Interview Skills?</h2>
        <p>Start practicing for free today</p>
        <button className="btn btn-primary" onClick={() => navigateTo('signup')}>
          Get Started Now
        </button>
      </section>
    </div>
  );
};

export default LandingPage