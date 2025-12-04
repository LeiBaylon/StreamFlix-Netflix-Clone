import { X, Play, Plus, Check } from 'lucide-react';
import { Content } from '../lib/supabase';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface ContentDetailModalProps {
  content: Content;
  onClose: () => void;
  onPlay: (content: Content) => void;
}

export default function ContentDetailModal({ content, onClose, onPlay }: ContentDetailModalProps) {
  const { user } = useAuth();
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    checkWatchlist();
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const checkWatchlist = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('watchlist')
      .select('id')
      .eq('user_id', user.id)
      .eq('content_id', content.id)
      .maybeSingle();

    setIsInWatchlist(!!data);
  };

  const toggleWatchlist = async () => {
    if (!user || loading) return;
    setLoading(true);

    try {
      if (isInWatchlist) {
        await supabase
          .from('watchlist')
          .delete()
          .eq('user_id', user.id)
          .eq('content_id', content.id);
        setIsInWatchlist(false);
      } else {
        await supabase
          .from('watchlist')
          .insert([{ user_id: user.id, content_id: content.id }]);
        setIsInWatchlist(true);
      }
    } catch (error) {
      console.error('Error toggling watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-start justify-center overflow-y-auto p-4 pt-20"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-gray-900 rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 transition z-10 bg-black bg-opacity-50 rounded-full p-2"
        >
          <X size={24} />
        </button>

        <div className="relative h-96">
          <img
            src={content.banner_url || content.thumbnail_url}
            alt={content.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />

          <div className="absolute bottom-8 left-8 right-8 space-y-4">
            <h2 className="text-white text-4xl font-bold">{content.title}</h2>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => onPlay(content)}
                className="flex items-center space-x-2 bg-white hover:bg-opacity-80 text-black px-6 py-2.5 rounded font-semibold transition"
              >
                <Play size={20} fill="currentColor" />
                <span>Play</span>
              </button>

              <button
                onClick={toggleWatchlist}
                disabled={loading}
                className="flex items-center justify-center bg-gray-700 bg-opacity-70 hover:bg-opacity-50 text-white w-10 h-10 rounded-full transition disabled:opacity-50"
              >
                {isInWatchlist ? <Check size={20} /> : <Plus size={20} />}
              </button>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="flex items-center space-x-4 text-sm">
            <span className="text-green-500 font-semibold">{content.match_score}% Match</span>
            <span className="text-gray-300">{content.year}</span>
            <span className="px-2 py-0.5 border border-gray-400 text-gray-300 text-xs">
              {content.rating}
            </span>
            {content.duration_minutes && (
              <span className="text-gray-300">{Math.floor(content.duration_minutes / 60)}h {content.duration_minutes % 60}m</span>
            )}
            <span className="px-2 py-0.5 border border-gray-400 text-gray-300 text-xs uppercase">
              {content.type}
            </span>
          </div>

          <p className="text-gray-300 text-base leading-relaxed">
            {content.description}
          </p>
        </div>
      </div>
    </div>
  );
}
