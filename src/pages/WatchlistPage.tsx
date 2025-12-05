import { useEffect, useState } from 'react';
import { supabase, Content } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import ContentCard from '../components/ContentCard';
import VideoPlayerModal from '../components/VideoPlayerModal';
import ContentDetailModal from '../components/ContentDetailModal';
import { BookmarkPlus, Trash2 } from 'lucide-react';

type PageType = 'home' | 'tvshows' | 'movies' | 'popular' | 'watchlist';

interface WatchlistPageProps {
  onNavigate: (page: PageType) => void;
}

export default function WatchlistPage({ onNavigate }: WatchlistPageProps) {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState<(Content & { watchlist_id: string })[]>([]);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [playingContent, setPlayingContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = async () => {
    if (!user) return;

    setLoading(true);
    const { data } = await supabase
      .from('watchlist')
      .select('id, content(*)')
      .eq('user_id', user.id)
      .order('added_at', { ascending: false });

    if (data) {
      const items = data.map((item: { id: string; content: Content }) => ({
        ...item.content,
        watchlist_id: item.id,
      }));
      setWatchlist(items);
    }
    setLoading(false);
  };

  const removeFromWatchlist = async (watchlistId: string) => {
    const { error } = await supabase
      .from('watchlist')
      .delete()
      .eq('id', watchlistId);

    if (!error) {
      setWatchlist(watchlist.filter((item) => item.watchlist_id !== watchlistId));
    }
  };

  const handlePlay = (content: Content) => {
    setPlayingContent(content);
    setSelectedContent(null);
  };

  const movieCount = watchlist.filter((c) => c.type === 'movie').length;
  const showCount = watchlist.filter((c) => c.type === 'series').length;

  return (
    <div className="min-h-screen bg-black">
      <Navbar
        currentPage="watchlist"
        onNavigate={onNavigate}
        searchQuery=""
        onSearchChange={() => {}}
      />

      <div className="pt-24 px-6 md:px-16 pb-16">
        {/* Header */}
        <div className="mb-8 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-3 mb-2">
            <BookmarkPlus className="text-red-600" size={32} />
            <h1 className="text-4xl md:text-5xl font-bold text-white">My List</h1>
          </div>
          <p className="text-gray-400">
            {watchlist.length} item{watchlist.length !== 1 ? 's' : ''} saved
            {movieCount > 0 && ` • ${movieCount} movie${movieCount !== 1 ? 's' : ''}`}
            {showCount > 0 && ` • ${showCount} show${showCount !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-lg h-48 animate-pulse" />
            ))}
          </div>
        ) : watchlist.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {watchlist.map((item, idx) => (
              <div
                key={item.watchlist_id}
                onMouseEnter={() => setHoveredId(item.watchlist_id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  animation: `fadeInUp 0.4s ease-out ${idx * 0.04}s both`,
                }}
              >
                <div className="relative group">
                  <ContentCard
                    content={item}
                    onClick={() => setSelectedContent(item)}
                  />

                  {/* Remove Button */}
                  {hoveredId === item.watchlist_id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromWatchlist(item.watchlist_id);
                      }}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg transition-all duration-300 scale-100 hover:scale-110 z-10 animate-in fade-in"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <BookmarkPlus className="mx-auto text-gray-600 mb-4" size={64} />
            <h2 className="text-2xl font-bold text-white mb-2">Your list is empty</h2>
            <p className="text-gray-400 mb-6">
              Browse our content and add items to your watchlist to save them for later
            </p>
            <button
              onClick={() => onNavigate('home')}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Start Browsing
            </button>
          </div>
        )}
      </div>

      {playingContent && (
        <VideoPlayerModal content={playingContent} onClose={() => setPlayingContent(null)} />
      )}

      {selectedContent && (
        <ContentDetailModal
          content={selectedContent}
          onClose={() => setSelectedContent(null)}
          onPlay={handlePlay}
        />
      )}

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
