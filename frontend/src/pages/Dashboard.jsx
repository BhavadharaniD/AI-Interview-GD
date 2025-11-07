import React from 'react';

const Dashboard = ({ navigateTo, user }) => {
  const userName = user?.fullName || 'User';

  return (
    <div className="page">
      <div className="dashboard">
        <div className="dashboard-header">
          <div>
            <h2>Welcome back, {userName}!</h2>
            <p style={{ color: '#ccc' }}>Ready to practice today?</p>
          </div>
          <div className="dashboard-nav">
            <button className="btn btn-secondary" onClick={() => navigateTo('landing')}>
              Analytics
            </button>
            <button className="btn btn-primary">Profile</button>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-info">
              <h3>Fluency Score</h3>
              <div className="stat-value">78%</div>
            </div>
            <div className="stat-icon">📈</div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <h3>Sessions Today</h3>
              <div className="stat-value">3</div>
            </div>
            <div className="stat-icon">⏰</div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <h3>Total Sessions</h3>
              <div className="stat-value">24</div>
            </div>
            <div className="stat-icon">🏆</div>
          </div>
        </div>

        <div className="practice-modes">
          <h2>Practice Modes</h2>

          <div className="modes-grid">
            <div className="mode-card">
              <div className="mode-icon">🎙️</div>
              <h3>Interview Practice</h3>
              <p>One-on-one AI interview sessions</p>
              <button className="btn btn-primary">Start Session</button>
            </div>
            <div className="mode-card">
              <div className="mode-icon">👥</div>
              <h3>Group Discussion</h3>
              <p>Practice GDs with AI participants</p>
              <button className="btn btn-primary">Start Session</button>
            </div>
            <div className="mode-card">
              <div className="mode-icon">💬</div>
              <h3>Communication Coach</h3>
              <p>Improve speaking & fluency</p>
              <button className="btn btn-primary">Start Session</button>
            </div>
          </div>
        </div>

        <div className="recent-activity">
          <h2>Recent Activity</h2>
          <p>Your last practice sessions</p>

          <div className="activity-item">
            <div className="activity-info">
              <h4>Interview</h4>
              <p>Product Manager Role</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="activity-score">83%</div>
              <div className="activity-time">2 hours ago</div>
            </div>
          </div>

          <div className="activity-item">
            <div className="activity-info">
              <h4>Group Discussion</h4>
              <p>AI Ethics</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="activity-score">76%</div>
              <div className="activity-time">1 day ago</div>
            </div>
          </div>

          <div className="activity-item">
            <div className="activity-info">
              <h4>Communication</h4>
              <p>Fluency Practice</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="activity-score">82%</div>
              <div className="activity-time">2 days ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;