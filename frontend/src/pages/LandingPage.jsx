import React from 'react';

const LandingPage = ({ navigateTo }) => {
  return (
    <div className="page max-w-[1400px] mx-auto px-5">
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-center min-h-[80vh] py-10">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl lg:text-[3.5rem] mb-5 leading-tight">
            Practice Interviews & GDs with AI — <span className="gradient-text">just by talking!</span>
          </h1>
          <p className="text-xl mb-8 text-gray-400">
            Speak naturally. Get instant feedback. Improve confidence 24/7.
          </p>
          <div className="flex gap-4 justify-center lg:justify-start">
            <button className="btn btn-primary" onClick={() => navigateTo('signup')}>
              Try Now
            </button>
            <button className="btn btn-secondary" onClick={() => navigateTo('signin')}>
              Sign Up Free
            </button>
          </div>
        </div>
        <div className="relative flex justify-center items-center">
          <div className="w-[300px] h-[300px] radial-gradient-mic rounded-full flex justify-center items-center animate-pulse-custom">
            <div className="w-[120px] h-[120px] gradient-bg-purple rounded-full flex justify-center items-center text-5xl">
              🎤
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <h2 className="text-center text-4xl mb-12">How It Works</h2>
        <p className="text-center text-gray-400 mb-12">
          Simple, powerful, effective
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          <div className="feature-card">
            <div className="w-[60px] h-[60px] mx-auto mb-5 gradient-bg-purple rounded-2xl flex justify-center items-center text-3xl">
              🎙️
            </div>
            <h3 className="mb-2 text-xl">Speak to AI</h3>
            <p className="text-gray-400 text-sm">Have a conversation with your AI interviewer</p>
          </div>
          <div className="feature-card">
            <div className="w-[60px] h-[60px] mx-auto mb-5 gradient-bg-purple rounded-2xl flex justify-center items-center text-3xl">
              📊
            </div>
            <h3 className="mb-2 text-xl">Get Instant Feedback</h3>
            <p className="text-gray-400 text-sm">Receive real-time analysis of your responses</p>
          </div>
          <div className="feature-card">
            <div className="w-[60px] h-[60px] mx-auto mb-5 gradient-bg-purple rounded-2xl flex justify-center items-center text-3xl">
              📈
            </div>
            <h3 className="mb-2 text-xl">Track Your Progress</h3>
            <p className="text-gray-400 text-sm">Monitor improvements over time</p>
          </div>
          <div className="feature-card">
            <div className="w-[60px] h-[60px] mx-auto mb-5 gradient-bg-purple rounded-2xl flex justify-center items-center text-3xl">
              🏆
            </div>
            <h3 className="mb-2 text-xl">Ace Your Interviews</h3>
            <p className="text-gray-400 text-sm">Build confidence for the real thing</p>
          </div>
        </div>

        <h2 className="text-center text-4xl mb-12">Why Choose AI Interview Coach?</h2>
        <p className="text-center text-gray-400 mb-12">
          Everything you need to succeed
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          <div className="why-card">
            <div className="text-3xl mb-4">🎤</div>
            <h3 className="mb-2 text-lg">Voice-First Practice</h3>
            <p className="text-gray-400 text-sm">
              Get fluent naturally — AI feels like a real interviewer. No awkward text chats.
            </p>
          </div>
          <div className="why-card">
            <div className="text-3xl mb-4">💬</div>
            <h3 className="mb-2 text-lg">Instant Feedback</h3>
            <p className="text-gray-400 text-sm">
              Get real-time insights on delivery, content, and every move you make
            </p>
          </div>
          <div className="why-card">
            <div className="text-3xl mb-4">📈</div>
            <h3 className="mb-2 text-lg">Track Progress</h3>
            <p className="text-gray-400 text-sm">
              Monitor your improvement with detailed performance metrics and graphs
            </p>
          </div>
          <div className="why-card">
            <div className="text-3xl mb-4">⏰</div>
            <h3 className="mb-2 text-lg">24/7 Availability</h3>
            <p className="text-gray-400 text-sm">
              Practice anytime, anywhere — just as if real time
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <h2 className="text-center text-3xl mb-10">What Our Users Say</h2>
        <p className="text-center text-gray-400 mb-10">
          Join thousands of successful candidates
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="testimonial-card">
            <div className="flex items-center mb-4">
              <div className="w-[50px] h-[50px] gradient-bg-purple rounded-full mr-4 flex justify-center items-center text-2xl">
                👤
              </div>
              <div>
                <h4 className="mb-1">Priya Sharma</h4>
                <p className="text-gray-500 text-sm">Software Engineer</p>
              </div>
            </div>
            <div className="text-gray-400 italic leading-relaxed">
              "This platform helped me land my dream consulting role. The AI feedback was spot on!"
            </div>
          </div>
          <div className="testimonial-card">
            <div className="flex items-center mb-4">
              <div className="w-[50px] h-[50px] gradient-bg-purple rounded-full mr-4 flex justify-center items-center text-2xl">
                👤
              </div>
              <div>
                <h4 className="mb-1">Rahul Verma</h4>
                <p className="text-gray-500 text-sm">MBA Student</p>
              </div>
            </div>
            <div className="text-gray-400 italic leading-relaxed">
              "Practicing group discussions with AI felt so real. My confidence improved massively!"
            </div>
          </div>
          <div className="testimonial-card">
            <div className="flex items-center mb-4">
              <div className="w-[50px] h-[50px] gradient-bg-purple rounded-full mr-4 flex justify-center items-center text-2xl">
                👤
              </div>
              <div>
                <h4 className="mb-1">Anamya Patel</h4>
                <p className="text-gray-500 text-sm">Recent Graduate</p>
              </div>
            </div>
            <div className="text-gray-400 italic leading-relaxed">
              "The fluency training feature helped me identify and fix issues early, saving time in interviews!"
            </div>
          </div>
        </div>
      </section>

      <section className="text-center py-20">
        <h2 className="text-4xl mb-5">Ready to Transform Your Interview Skills?</h2>
        <p className="text-gray-400 mb-8 text-lg">Start practicing for free today</p>
        <button className="btn btn-primary" onClick={() => navigateTo('signup')}>
          Get Started Now
        </button>
      </section>
    </div>
  );
};

export default LandingPage;