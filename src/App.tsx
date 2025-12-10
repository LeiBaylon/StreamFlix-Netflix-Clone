import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthForm from './components/Auth/AuthForm';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import TVShowsPage from './pages/TVShowsPage';
import MoviesPage from './pages/MoviesPage';
import PopularPage from './pages/PopularPage';
import WatchlistPage from './pages/WatchlistPage';

type PageType = 'home' | 'tvshows' | 'movies' | 'popular' | 'watchlist';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAuth, setShowAuth] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-700 border-t-red-600 rounded-full animate-spin" />
          <div className="text-white text-lg">Loading StreamFlix...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    if (!showAuth) {
      return <LandingPage onGetStarted={() => setShowAuth(true)} />;
    }
    return <AuthForm />;
  }

  const handleNavigate = (page: PageType) => {
    setCurrentPage(page);
    setSearchQuery('');
  };

  return (
    <>
      {currentPage === 'home' && (
        <HomePage onNavigate={handleNavigate} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      )}
      {currentPage === 'tvshows' && (
        <TVShowsPage onNavigate={handleNavigate} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      )}
      {currentPage === 'movies' && (
        <MoviesPage onNavigate={handleNavigate} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      )}
      {currentPage === 'popular' && (
        <PopularPage onNavigate={handleNavigate} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      )}
      {currentPage === 'watchlist' && (
        <WatchlistPage onNavigate={handleNavigate} />
      )}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
