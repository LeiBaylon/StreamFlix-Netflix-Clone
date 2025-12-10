import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
      } else {
        if (!fullName.trim()) {
          throw new Error('Please enter your name');
        }
        const { error } = await signUp(email, password, fullName);
        if (error) throw error;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setEmail('');
    setPassword('');
    setFullName('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-600/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-red-600/20 rounded-full blur-3xl animate-pulse animation-delay-2000" />
      </div>

      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1920)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-black" />
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-md z-10">
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          {/* Card */}
          <div className="bg-black/80 backdrop-blur-lg border border-gray-800 rounded-2xl p-8 md:p-10 shadow-2xl">
            {/* Logo */}
            <div className="mb-8 text-center">
              <h1 className="text-red-600 text-3xl font-black tracking-tight">STREAMFLIX</h1>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={() => !loading && switchMode()}
                className={`flex-1 py-3 font-bold transition-all duration-300 rounded-lg ${
                  isLogin
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => !loading && switchMode()}
                className={`flex-1 py-3 font-bold transition-all duration-300 rounded-lg ${
                  !isLogin
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="relative animate-in fade-in slide-in-from-top-4 duration-300">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 text-gray-500 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 hover:border-gray-600 focus:border-red-600 focus:outline-none rounded-lg text-white placeholder-gray-500 transition-all duration-300"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="animate-in fade-in slide-in-from-top-4 duration-300" style={{ animationDelay: isLogin ? '0ms' : '100ms' }}>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 text-gray-500 w-5 h-5" />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 hover:border-gray-600 focus:border-red-600 focus:outline-none rounded-lg text-white placeholder-gray-500 transition-all duration-300"
                    required
                  />
                </div>
              </div>

              <div className="animate-in fade-in slide-in-from-top-4 duration-300" style={{ animationDelay: isLogin ? '100ms' : '200ms' }}>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 text-gray-500 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 bg-gray-900/50 border border-gray-700 hover:border-gray-600 focus:border-red-600 focus:outline-none rounded-lg text-white placeholder-gray-500 transition-all duration-300"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-gray-500 hover:text-gray-400 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300 p-4 bg-red-600/20 border border-red-600/50 rounded-lg">
                  <p className="text-red-400 text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Remember Me / Forgot Password */}
              {isLogin && (
                <div className="flex items-center justify-between text-sm animate-in fade-in slide-in-from-top-4 duration-300" style={{ animationDelay: '200ms' }}>
                  <label className="flex items-center space-x-2 cursor-pointer group">
                    <input type="checkbox" className="rounded w-4 h-4 accent-red-600" />
                    <span className="text-gray-400 group-hover:text-gray-300 transition-colors">Remember me</span>
                  </label>
                  <button type="button" className="text-gray-400 hover:text-red-600 transition-colors">
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-300"
                style={{ animationDelay: isLogin ? '200ms' : '300ms' }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-white rounded-full animate-spin" />
                    {isLogin ? 'Signing in...' : 'Creating account...'}
                  </span>
                ) : isLogin ? (
                  'Sign In'
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            {/* Toggle Auth Mode */}
            <div className="mt-6 text-center text-gray-400 animate-in fade-in slide-in-from-bottom-4 duration-300" style={{ animationDelay: isLogin ? '300ms' : '400ms' }}>
              <span>{isLogin ? "Don't have an account? " : 'Already have an account? '}</span>
              <button
                type="button"
                onClick={switchMode}
                disabled={loading}
                className="text-red-600 hover:text-red-500 font-semibold transition-colors disabled:opacity-50"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </div>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-800" />
              <span className="text-gray-500 text-xs uppercase">or</span>
              <div className="flex-1 h-px bg-gray-800" />
            </div>

            {/* Social Sign In */}
            <button
              type="button"
              className="w-full py-3 bg-gray-900/50 hover:bg-gray-800 border border-gray-700 hover:border-gray-600 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-gray-500 text-xs mt-6 animate-in fade-in duration-700" style={{ animationDelay: isLogin ? '400ms' : '500ms' }}>
            By signing in, you agree to our Terms & Privacy Policy
          </p>
        </div>
      </div>

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
            transform: translateY(-20px);
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
