import { Play, Sparkles, Zap, Users, Shield, ChevronRight } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const features = [
    {
      icon: Sparkles,
      title: 'Discover Content',
      description: 'Explore thousands of movies and TV shows in one place',
    },
    {
      icon: Zap,
      title: 'Ad-Free Streaming',
      description: 'Enjoy uninterrupted entertainment without ads',
    },
    {
      icon: Users,
      title: 'Watch Together',
      description: 'Share your favorite content with family and friends',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade security',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-600/10 rounded-full blur-3xl animate-pulse animation-delay-2000" />
      </div>

      {/* Navigation */}
      <nav className="relative z-20 px-6 md:px-16 py-6 flex items-center justify-between">
        <div className="text-red-600 text-3xl font-bold tracking-tight">STREAMFLIX</div>
        <button
          onClick={onGetStarted}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          Sign In
        </button>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-6 md:px-16 text-center space-y-8">
        <div className="space-y-6 animate-in fade-in slide-in-from-top-8 duration-700">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-tight">
            Your Next
            <span className="block bg-gradient-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent">
              Favorite Show
            </span>
            Awaits
          </h1>

          <p className="text-lg md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Stream thousands of movies, TV shows, and documentaries. Cancel anytime. All without ads.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <button
              onClick={onGetStarted}
              className="flex items-center space-x-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl group"
            >
              <Play size={24} className="group-hover:translate-x-1 transition-transform" />
              <span>Get Started</span>
            </button>

            <button className="flex items-center space-x-2 px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95">
              <span>Learn More</span>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Featured content preview */}
        <div className="mt-16 w-full max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <div className="relative rounded-xl overflow-hidden shadow-2xl group">
            <img
              src="https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1920"
              alt="Featured Content"
              className="w-full h-64 md:h-80 object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex items-center justify-center group-hover:from-black/80 transition-all duration-500">
              <button className="p-4 bg-red-600 hover:bg-red-700 rounded-full transform hover:scale-110 transition-all duration-300 shadow-lg">
                <Play size={32} fill="white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 py-24 px-6 md:px-16 bg-gradient-to-b from-transparent to-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            Why Choose StreamFlix?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="group p-8 bg-gray-900/50 hover:bg-gray-800 rounded-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-800 hover:border-red-600/50 animate-in fade-in slide-in-from-bottom-4 duration-700"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="mb-4 inline-block p-3 bg-red-600/20 rounded-lg group-hover:bg-red-600 group-hover:scale-110 transition-all duration-300">
                    <Icon className="text-red-600 group-hover:text-white w-6 h-6 transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 py-20 px-6 md:px-16 text-center">
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-4xl md:text-5xl font-bold">
            Ready to Start Watching?
          </h2>
          <p className="text-xl text-gray-300">
            Join millions of users streaming their favorite content right now.
          </p>
          <button
            onClick={onGetStarted}
            className="inline-flex items-center space-x-2 px-10 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl"
          >
            <span>Sign Up Now</span>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 py-8 px-6 md:px-16 text-center text-gray-500 text-sm">
        <p>&copy; 2024 StreamFlix. All rights reserved.</p>
      </footer>

      <style>{`
        @keyframes slideInFromBottom {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInFromTop {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}
