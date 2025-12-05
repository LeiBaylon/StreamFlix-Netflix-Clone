import { useEffect, useState } from 'react';
import { supabase, Content, Genre } from '../lib/supabase';
import Navbar from '../components/Navbar';
import ContentCard from '../components/ContentCard';
import VideoPlayerModal from '../components/VideoPlayerModal';
import ContentDetailModal from '../components/ContentDetailModal';

type PageType = 'home' | 'tvshows' | 'movies' | 'popular' | 'watchlist';

interface MoviesPageProps {
  onNavigate: (page: PageType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function MoviesPage({ onNavigate, searchQuery, onSearchChange }: MoviesPageProps) {
  const [movies, setMovies] = useState<Content[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Content[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [playingContent, setPlayingContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterMovies();
  }, [movies, selectedGenre, searchQuery]);

  const loadData = async () => {
    setLoading(true);
    const { data: moviesData } = await supabase
      .from('content')
      .select('*')
      .eq('type', 'movie')
      .order('year', { ascending: false });

    const { data: genresData } = await supabase
      .from('genres')
      .select('*')
      .order('name');

    if (moviesData) setMovies(moviesData);
    if (genresData) setGenres(genresData);
    setLoading(false);
  };

  const filterMovies = () => {
    let filtered = movies;

    if (searchQuery.trim()) {
      filtered = filtered.filter((m) =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedGenre !== 'all') {
      filtered = filtered; // Genre filtering would require joining with content_genres
    }

    setFilteredMovies(filtered);
  };

  const handlePlay = (content: Content) => {
    setPlayingContent(content);
    setSelectedContent(null);
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar
        currentPage="movies"
        onNavigate={onNavigate}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
      />

      <div className="pt-24 px-6 md:px-16 pb-16">
        {/* Header */}
        <div className="mb-8 animate-in fade-in slide-in-from-top-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Movies</h1>
          <p className="text-gray-400">Explore our collection of movies</p>
        </div>

        {/* Genre Filter */}
        <div className="mb-8 flex flex-wrap gap-2 animate-in fade-in">
          <button
            onClick={() => setSelectedGenre('all')}
            className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
              selectedGenre === 'all'
                ? 'bg-red-600 text-white shadow-lg'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            All
          </button>
          {genres.slice(0, 8).map((genre) => (
            <button
              key={genre.id}
              onClick={() => setSelectedGenre(genre.id)}
              className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                selectedGenre === genre.id
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {genre.name}
            </button>
          ))}
        </div>

        {/* Movies Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-lg h-48 animate-pulse" />
            ))}
          </div>
        ) : filteredMovies.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredMovies.map((movie, idx) => (
              <div
                key={movie.id}
                onClick={() => setSelectedContent(movie)}
                style={{
                  animation: `fadeInUp 0.4s ease-out ${(idx % 12) * 0.03}s both`,
                }}
              >
                <ContentCard content={movie} onClick={() => setSelectedContent(movie)} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No movies found</p>
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
