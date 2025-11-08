import React from 'react';

const Dashboard = ({ navigateTo, user }) => {
  const userName = user?.fullName || 'User';

  return (
    <div className="page">
      <div className="max-w-[1400px] mx-auto px-5">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl">Welcome back, {userName}!</h2>
            <p className="text-gray-400">Ready to practice today?</p>
          </div>
          <div className="flex gap-4">
            <button className="btn btn-secondary" onClick={() => navigateTo('/analytics')}>
              Analytics
            </button> 
            <button className="btn btn-primary">Profile</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="stat-card">
            <div>
              <h3 className="text-gray-400 text-sm mb-2">Fluency Score</h3>
              <div className="text-5xl font-bold">78%</div>
            </div>
            <div className="text-4xl">📈</div>
          </div>
          <div className="stat-card">
            <div>
              <h3 className="text-gray-400 text-sm mb-2">Sessions Today</h3>
              <div className="text-5xl font-bold">3</div>
            </div>
            <div className="text-4xl">⏰</div>
          </div>
          <div className="stat-card">
            <div>
              <h3 className="text-gray-400 text-sm mb-2">Total Sessions</h3>
              <div className="text-5xl font-bold">24</div>
            </div>
            <div className="text-4xl">🏆</div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="mb-8 text-2xl">Practice Modes</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="mode-card">
              <div className="w-[70px] h-[70px] mx-auto mb-5 gradient-bg-purple rounded-2xl flex justify-center items-center text-3xl">
                🎙️
              </div>
              <h3 className="mb-2 text-xl">Interview Practice</h3>
              <p className="text-gray-400 mb-5">One-on-one AI interview sessions</p>
              <button className="btn btn-primary">Start Session</button>
            </div>
            <div className="mode-card">
              <div className="w-[70px] h-[70px] mx-auto mb-5 gradient-bg-purple rounded-2xl flex justify-center items-center text-3xl">
                👥
              </div>
              <h3 className="mb-2 text-xl">Group Discussion</h3>
              <p className="text- mb-5">Practice GDs with AI participants</p>
              <button className="btn btn-primary">Start Session</button>
            </div>
            <div className="mode-card">
              <div className="w-[70px] h-[70px] mx-auto mb-5 gradient-bg-purple rounded-2xl flex justify-center items-center text-3xl">
                💬
              </div>
              <h3 className="mb-2 text-xl">Communication Coach</h3>
              <p className="text-gray-400 mb-5">Improve speaking & fluency</p>
              <button className="btn btn-primary">Start Session</button>
            </div>
          </div>
        </div>

        <div className="recent-activity">
          <h2 className="mb-2">Recent Activity</h2>
          <p className="text-gray-500 mb-5">Your last practice sessions</p>

          <div className="activity-item">
            <div>
              <h4 className="mb-1">Interview</h4>
              <p className="text-gray-500 text-sm m-0">Product Manager Role</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-[#ff00ff]">83%</div>
              <div className="text-gray-500 text-sm">2 hours ago</div>
            </div>
          </div>

          <div className="activity-item">
            <div>
              <h4 className="mb-1">Group Discussion</h4>
              <p className="text-gray-500 text-sm m-0">AI Ethics</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-[#ff00ff]">76%</div>
              <div className="text-gray-500 text-sm">1 day ago</div>
            </div>
          </div>

          <div className="activity-item">
            <div>
              <h4 className="mb-1">Communication</h4>
              <p className="text-gray-500 text-sm m-0">Fluency Practice</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-[#ff00ff]">82%</div>
              <div className="text-gray-500 text-sm">2 days ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;