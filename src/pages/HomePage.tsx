import { useEffect, useState } from 'react';
import { supabase, Content } from '../lib/supabase';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ContentRow from '../components/ContentRow';
import VideoPlayerModal from '../components/VideoPlayerModal';
import ContentDetailModal from '../components/ContentDetailModal';

type PageType = 'home' | 'tvshows' | 'movies' | 'popular' | 'watchlist';

interface HomePageProps {
  onNavigate: (page: PageType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function HomePage({ onNavigate, searchQuery, onSearchChange }: HomePageProps) {
  const [featuredContent, setFeaturedContent] = useState<Content | null>(null);
  const [allContent, setAllContent] = useState<Content[]>([]);
  const [searchResults, setSearchResults] = useState<Content[]>([]);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [playingContent, setPlayingContent] = useState<Content | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch(searchQuery);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const loadContent = async () => {
    const { data: featured } = await supabase
      .from('content')
      .select('*')
      .eq('is_featured', true)
      .limit(1)
      .maybeSingle();

    if (featured) {
      setFeaturedContent(featured);
    }

    const { data: content } = await supabase
      .from('content')
      .select('*')
      .order('created_at', { ascending: false });

    if (content) {
      setAllContent(content);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const { data } = await supabase
      .from('content')
      .select('*')
      .ilike('title', `%${query}%`);

    setSearchResults(data || []);
  };

  const handlePlay = (content: Content) => {
    setPlayingContent(content);
    setSelectedContent(null);
  };

  const movies = allContent.filter((c) => c.type === 'movie');
  const series = allContent.filter((c) => c.type === 'series');
  const recentContent = allContent.slice(0, 10);
  const topRated = [...allContent].sort((a, b) => b.match_score - a.match_score).slice(0, 10);

  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen bg-black">
      <Navbar
        currentPage="home"
        onNavigate={onNavigate}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
      />

      {!isSearching && (
        <Hero content={featuredContent} onPlay={handlePlay} onInfo={setSelectedContent} />
      )}

      <div className={`${!isSearching ? '-mt-32' : 'pt-24'} relative z-10 space-y-8 pb-16`}>
        {isSearching ? (
          <div className="px-6 md:px-16 pt-8 animate-in fade-in">
            <h2 className="text-white text-2xl font-bold mb-4">
              Search Results {searchResults.length > 0 && `(${searchResults.length})`}
            </h2>
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {searchResults.map((content, idx) => (
                  <div
                    key={content.id}
                    onClick={() => setSelectedContent(content)}
                    className="cursor-pointer group"
                    style={{
                      animation: `fadeInUp 0.5s ease-out ${idx * 0.05}s both`,
                    }}
                  >
                    <div className="relative rounded-lg overflow-hidden bg-gray-900 shadow-lg group-hover:shadow-2xl transition-all duration-300">
                      <img
                        src={content.thumbnail_url}
                        alt={content.title}
                        className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-white text-sm font-semibold mt-2 truncate">{content.title}</h3>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No results found for "{searchQuery}"</p>
            )}
          </div>
        ) : (
          <>
            <ContentRow title="Trending Now" content={recentContent} onContentClick={setSelectedContent} />
            <ContentRow title="Top Rated" content={topRated} onContentClick={setSelectedContent} />
            <ContentRow title="Movies" content={movies.slice(0, 15)} onContentClick={setSelectedContent} />
            <ContentRow title="TV Shows" content={series.slice(0, 15)} onContentClick={setSelectedContent} />
            <ContentRow title="Continue Watching" content={allContent.slice(0, 10)} onContentClick={setSelectedContent} />
          </>
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
