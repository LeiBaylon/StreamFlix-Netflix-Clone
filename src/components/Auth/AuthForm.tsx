import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black opacity-60" />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1920)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="relative w-full max-w-md">
        <div className="bg-black bg-opacity-80 rounded-lg p-16 backdrop-blur-sm">
          <h1 className="text-4xl font-bold text-white mb-8">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3.5 bg-gray-800 text-white rounded border border-gray-700 focus:border-white focus:outline-none transition"
                  required
                />
              </div>
            )}

            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-800 text-white rounded border border-gray-700 focus:border-white focus:outline-none transition"
                required
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-800 text-white rounded border border-gray-700 focus:border-white focus:outline-none transition"
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm bg-red-500 bg-opacity-10 p-3 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 text-gray-400 text-center">
            {isLogin ? "New to StreamFlix? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-white hover:underline"
            >
              {isLogin ? 'Sign up now' : 'Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
