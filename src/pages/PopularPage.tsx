import { useEffect, useState } from 'react';
import { supabase, Content } from '../lib/supabase';
import Navbar from '../components/Navbar';
import ContentCard from '../components/ContentCard';
import VideoPlayerModal from '../components/VideoPlayerModal';
import ContentDetailModal from '../components/ContentDetailModal';
import { TrendingUp } from 'lucide-react';

type PageType = 'home' | 'tvshows' | 'movies' | 'popular' | 'watchlist';

interface PopularPageProps {
  onNavigate: (page: PageType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function PopularPage({ onNavigate, searchQuery, onSearchChange }: PopularPageProps) {
  const [allContent, setAllContent] = useState<Content[]>([]);
  const [filteredContent, setFilteredContent] = useState<Content[]>([]);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [playingContent, setPlayingContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'this-week' | 'this-month'>('all');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterContent();
  }, [allContent, filter, searchQuery]);

  const loadData = async () => {
    setLoading(true);
    const { data: content } = await supabase
      .from('content')
      .select('*')
      .order('match_score', { ascending: false });

    if (content) setAllContent(content);
    setLoading(false);
  };

  const filterContent = () => {
    let filtered = allContent;

    if (searchQuery.trim()) {
      filtered = filtered.filter((c) =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredContent(filtered);
  };

  const handlePlay = (content: Content) => {
    setPlayingContent(content);
    setSelectedContent(null);
  };

  const topMovies = filteredContent.filter((c) => c.type === 'movie').slice(0, 15);
  const topShows = filteredContent.filter((c) => c.type === 'series').slice(0, 15);

  return (
    <div className="min-h-screen bg-black">
      <Navbar
        currentPage="popular"
        onNavigate={onNavigate}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
      />

      <div className="pt-24 px-6 md:px-16 pb-16">
        {/* Header */}
        <div className="mb-8 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="text-red-600" size={32} />
            <h1 className="text-4xl md:text-5xl font-bold text-white">New & Popular</h1>
          </div>
          <p className="text-gray-400">Discover what's trending right now</p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8 flex gap-2 animate-in fade-in">
          {(['all', 'this-week', 'this-month'] as const).map((option) => (
            <button
              key={option}
              onClick={() => setFilter(option)}
              className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                filter === option
                  ? 'bg-red-600 text-white shadow-lg scale-105'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {option === 'all' ? 'All Time' : option === 'this-week' ? 'This Week' : 'This Month'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-8">
            {[0, 1].map((i) => (
              <div key={i}>
                <div className="h-8 bg-gray-800 rounded w-32 mb-4 animate-pulse" />
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {[...Array(6)].map((_, j) => (
                    <div key={j} className="bg-gray-800 rounded-lg h-48 animate-pulse" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            {/* Top Movies */}
            {topMovies.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Popular Movies</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {topMovies.map((movie, idx) => (
                    <div
                      key={movie.id}
                      style={{
                        animation: `fadeInUp 0.4s ease-out ${idx * 0.05}s both`,
                      }}
                    >
                      <ContentCard content={movie} onClick={() => setSelectedContent(movie)} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top Shows */}
            {topShows.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Popular TV Shows</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {topShows.map((show, idx) => (
                    <div
                      key={show.id}
                      style={{
                        animation: `fadeInUp 0.4s ease-out ${idx * 0.05}s both`,
                      }}
                    >
                      <ContentCard content={show} onClick={() => setSelectedContent(show)} />
                    </div>
                  ))}
                </div>
              </div>
            )}
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
