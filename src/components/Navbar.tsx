import { useState, useEffect } from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  onSearch: (query: string) => void;
  onProfileClick: () => void;
}

export default function Navbar({ onSearch, onProfileClick }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black' : 'bg-gradient-to-b from-black to-transparent'
      }`}
    >
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center space-x-8">
          <h1 className="text-red-600 text-3xl font-bold tracking-tight">STREAMFLIX</h1>

          <div className="hidden md:flex space-x-6">
            <a href="#" className="text-white hover:text-gray-300 transition text-sm font-medium">
              Home
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition text-sm">
              TV Shows
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition text-sm">
              Movies
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition text-sm">
              New & Popular
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition text-sm"
              onClick={(e) => {
                e.preventDefault();
                onProfileClick();
              }}
            >
              My List
            </a>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          {showSearch ? (
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Titles, genres..."
                className="bg-black bg-opacity-70 border border-white text-white px-4 py-1.5 pl-10 rounded-sm focus:outline-none focus:border-white w-64"
                autoFocus
                onBlur={() => {
                  if (!searchQuery) {
                    setTimeout(() => setShowSearch(false), 200);
                  }
                }}
              />
              <Search className="absolute left-3 top-2 text-gray-400" size={18} />
            </form>
          ) : (
            <button
              onClick={() => setShowSearch(true)}
              className="text-white hover:text-gray-300 transition"
            >
              <Search size={22} />
            </button>
          )}

          <button className="text-white hover:text-gray-300 transition">
            <Bell size={22} />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 text-white hover:text-gray-300 transition"
            >
              <img
                src="https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=100"
                alt="Profile"
                className="w-8 h-8 rounded"
              />
              <ChevronDown size={16} className={`transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-black bg-opacity-95 border border-gray-700 rounded-sm overflow-hidden">
                <button
                  onClick={() => {
                    onProfileClick();
                    setShowProfileMenu(false);
                  }}
                  className="block w-full text-left px-4 py-3 text-white hover:bg-gray-800 transition text-sm"
                >
                  My List
                </button>
                <button
                  onClick={() => {
                    signOut();
                    setShowProfileMenu(false);
                  }}
                  className="block w-full text-left px-4 py-3 text-white hover:bg-gray-800 transition text-sm border-t border-gray-700"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
