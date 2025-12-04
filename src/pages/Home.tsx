import { useEffect, useState } from 'react';
import { supabase, Content } from '../lib/supabase';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ContentRow from '../components/ContentRow';
import VideoPlayerModal from '../components/VideoPlayerModal';
import ContentDetailModal from '../components/ContentDetailModal';

export default function Home() {
  const [featuredContent, setFeaturedContent] = useState<Content | null>(null);
  const [allContent, setAllContent] = useState<Content[]>([]);
  const [searchResults, setSearchResults] = useState<Content[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [playingContent, setPlayingContent] = useState<Content | null>(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    loadContent();
  }, []);

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
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    const { data } = await supabase
      .from('content')
      .select('*')
      .ilike('title', `%${query}%`);

    setSearchResults(data || []);
  };

  const handleContentClick = (content: Content) => {
    setSelectedContent(content);
  };

  const handlePlay = (content: Content) => {
    setPlayingContent(content);
    setSelectedContent(null);
  };

  const movies = allContent.filter((c) => c.type === 'movie');
  const series = allContent.filter((c) => c.type === 'series');
  const recentContent = allContent.slice(0, 10);

  return (
    <div className="min-h-screen bg-black">
      <Navbar onSearch={handleSearch} onProfileClick={() => setShowProfile(true)} />

      {!isSearching && <Hero content={featuredContent} onPlay={handlePlay} onInfo={handleContentClick} />}

      <div className={`${!isSearching ? '-mt-32' : 'pt-24'} relative z-10 space-y-8 pb-16`}>
        {isSearching ? (
          <div className="px-8 md:px-16 pt-8">
            <h2 className="text-white text-2xl font-semibold mb-4">
              Search Results {searchResults.length > 0 && `(${searchResults.length})`}
            </h2>
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {searchResults.map((content) => (
                  <div
                    key={content.id}
                    onClick={() => handleContentClick(content)}
                    className="cursor-pointer transition-transform hover:scale-105"
                  >
                    <img
                      src={content.thumbnail_url}
                      alt={content.title}
                      className="w-full h-40 object-cover rounded"
                    />
                    <h3 className="text-white text-sm mt-2 truncate">{content.title}</h3>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No results found</p>
            )}
          </div>
        ) : (
          <>
            <ContentRow title="Trending Now" content={recentContent} onContentClick={handleContentClick} />
            <ContentRow title="Movies" content={movies} onContentClick={handleContentClick} />
            <ContentRow title="TV Shows" content={series} onContentClick={handleContentClick} />
            <ContentRow title="Popular on StreamFlix" content={allContent} onContentClick={handleContentClick} />
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

      {showProfile && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 overflow-y-auto"
          onClick={() => setShowProfile(false)}
        >
          <div className="min-h-screen pt-24 px-8 md:px-16" onClick={(e) => e.stopPropagation()}>
            <h1 className="text-white text-4xl font-bold mb-8">My List</h1>
            <MyWatchlist onContentClick={handleContentClick} />
          </div>
        </div>
      )}
    </div>
  );
}

function MyWatchlist({ onContentClick }: { onContentClick: (content: Content) => void }) {
  const [watchlist, setWatchlist] = useState<(Content & { added_at: string })[]>([]);

  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = async () => {
    const { data } = await supabase
      .from('watchlist')
      .select('added_at, content(*)')
      .order('added_at', { ascending: false });

    if (data) {
      const items = data.map((item: { added_at: string; content: Content }) => ({
        ...item.content,
        added_at: item.added_at,
      }));
      setWatchlist(items);
    }
  };

  if (watchlist.length === 0) {
    return <p className="text-gray-400">Your list is empty. Add some content to watch later!</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {watchlist.map((content) => (
        <div
          key={content.id}
          onClick={() => onContentClick(content)}
          className="cursor-pointer transition-transform hover:scale-105"
        >
          <img
            src={content.thumbnail_url}
            alt={content.title}
            className="w-full h-40 object-cover rounded"
          />
          <h3 className="text-white text-sm mt-2 truncate">{content.title}</h3>
        </div>
      ))}
    </div>
  );
}
