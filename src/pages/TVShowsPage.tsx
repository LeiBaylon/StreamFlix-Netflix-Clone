import { useEffect, useState } from 'react';
import { supabase, Content } from '../lib/supabase';
import Navbar from '../components/Navbar';
import ContentCard from '../components/ContentCard';
import VideoPlayerModal from '../components/VideoPlayerModal';
import ContentDetailModal from '../components/ContentDetailModal';

type PageType = 'home' | 'tvshows' | 'movies' | 'popular' | 'watchlist';

interface TVShowsPageProps {
  onNavigate: (page: PageType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function TVShowsPage({ onNavigate, searchQuery, onSearchChange }: TVShowsPageProps) {
  const [shows, setShows] = useState<Content[]>([]);
  const [filteredShows, setFilteredShows] = useState<Content[]>([]);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [playingContent, setPlayingContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'rating'>('recent');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterShows();
  }, [shows, sortBy, searchQuery]);

  const loadData = async () => {
    setLoading(true);
    const { data: showsData } = await supabase
      .from('content')
      .select('*')
      .eq('type', 'series')
      .order('created_at', { ascending: false });

    if (showsData) setShows(showsData);
    setLoading(false);
  };

  const filterShows = () => {
    let filtered = shows;

    if (searchQuery.trim()) {
      filtered = filtered.filter((s) =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortBy === 'popular') {
      filtered = [...filtered].sort((a, b) => b.match_score - a.match_score);
    } else if (sortBy === 'rating') {
      filtered = [...filtered].sort((a, b) => b.match_score - a.match_score);
    }

    setFilteredShows(filtered);
  };

  const handlePlay = (content: Content) => {
    setPlayingContent(content);
    setSelectedContent(null);
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar
        currentPage="tvshows"
        onNavigate={onNavigate}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
      />

      <div className="pt-24 px-6 md:px-16 pb-16">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between animate-in fade-in slide-in-from-top-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">TV Shows</h1>
            <p className="text-gray-400">Discover the best series</p>
          </div>

          {/* Sort Options */}
          <div className="flex gap-2">
            {(['recent', 'popular', 'rating'] as const).map((option) => (
              <button
                key={option}
                onClick={() => setSortBy(option)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                  sortBy === option
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Shows Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-lg h-48 animate-pulse" />
            ))}
          </div>
        ) : filteredShows.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredShows.map((show, idx) => (
              <div
                key={show.id}
                style={{
                  animation: `fadeInUp 0.4s ease-out ${(idx % 12) * 0.03}s both`,
                }}
              >
                <ContentCard content={show} onClick={() => setSelectedContent(show)} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No TV shows found</p>
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
