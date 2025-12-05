import { useState, useEffect } from 'react';
import { Search, Bell, ChevronDown, Home, Tv, Film, Sparkles, BookmarkPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type PageType = 'home' | 'tvshows' | 'movies' | 'popular' | 'watchlist';

interface NavbarProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function Navbar({ currentPage, onNavigate, searchQuery, onSearchChange }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearch(false);
    }
  };

  const navItems: { label: string; page: PageType; icon: typeof Home }[] = [
    { label: 'Home', page: 'home', icon: Home },
    { label: 'TV Shows', page: 'tvshows', icon: Tv },
    { label: 'Movies', page: 'movies', icon: Film },
    { label: 'New & Popular', page: 'popular', icon: Sparkles },
  ];

  const isActive = (page: PageType) => currentPage === page;

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-black bg-opacity-95 backdrop-blur-md shadow-lg'
          : 'bg-gradient-to-b from-black via-black/80 to-transparent'
      }`}
    >
      <div className="flex items-center justify-between px-6 md:px-8 py-3 md:py-4">
        {/* Logo */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center space-x-2 group"
        >
          <div className="text-red-600 text-2xl md:text-3xl font-bold tracking-tight group-hover:text-red-500 transition">
            STREAMFLIX
          </div>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-2">
          {navItems.map((item) => (
            <button
              key={item.page}
              onClick={() => onNavigate(item.page)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                isActive(item.page)
                  ? 'bg-red-600 text-white shadow-lg scale-105'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <item.icon size={18} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3 md:space-x-4">
          {/* Search */}
          {showSearch ? (
            <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Titles, genres..."
                className="bg-black/70 border-2 border-white text-white px-4 py-2 pl-10 rounded-lg focus:outline-none focus:border-red-500 w-72 transition-all duration-300 backdrop-blur-sm"
                autoFocus
                onBlur={() => {
                  if (!searchQuery) {
                    setTimeout(() => setShowSearch(false), 200);
                  }
                }}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </form>
          ) : (
            <button
              onClick={() => setShowSearch(true)}
              className="p-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-300 hidden md:block"
            >
              <Search size={20} />
            </button>
          )}

          <button className="p-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-300 hidden md:block">
            <Bell size={20} />
          </button>

          {/* Watchlist - Mobile and Desktop */}
          <button
            onClick={() => onNavigate('watchlist')}
            className={`p-2 rounded-lg transition-all duration-300 ${
              isActive('watchlist')
                ? 'bg-red-600 text-white'
                : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            <BookmarkPlus size={20} />
          </button>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 text-white hover:text-gray-300 transition-all duration-300 p-2 hover:bg-gray-800/50 rounded-lg"
            >
              <img
                src="https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=100"
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${showProfileMenu ? 'rotate-180' : ''}`}
              />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-3 w-48 bg-black/95 border border-gray-700 rounded-lg overflow-hidden shadow-2xl backdrop-blur-sm animate-in fade-in zoom-in-95">
                <button
                  onClick={() => {
                    onNavigate('watchlist');
                    setShowProfileMenu(false);
                  }}
                  className="block w-full text-left px-4 py-3 text-white hover:bg-red-600/20 transition-all duration-200 text-sm"
                >
                  My List
                </button>
                <button
                  onClick={() => {
                    signOut();
                    setShowProfileMenu(false);
                  }}
                  className="block w-full text-left px-4 py-3 text-white hover:bg-red-600/20 transition-all duration-200 text-sm border-t border-gray-700"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden relative">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white hover:bg-gray-800/50 rounded-lg transition-all duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {mobileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-black/95 border border-gray-700 rounded-lg overflow-hidden shadow-2xl backdrop-blur-sm">
                {navItems.map((item) => (
                  <button
                    key={item.page}
                    onClick={() => {
                      onNavigate(item.page);
                      setMobileMenuOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-3 transition-all duration-200 text-sm flex items-center space-x-2 ${
                      isActive(item.page)
                        ? 'bg-red-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
