import { X, Play, Plus, Check, Share2 } from 'lucide-react';
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
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-4 pt-16 md:pt-20 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-gradient-to-b from-gray-900 to-black rounded-xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:bg-red-600 hover:text-white transition-all duration-300 z-10 bg-black/70 rounded-full p-2 hover:scale-110"
        >
          <X size={24} />
        </button>

        {/* Banner Section */}
        <div className="relative h-80 md:h-96 overflow-hidden group">
          <img
            src={content.banner_url || content.thumbnail_url}
            alt={content.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-black/40 to-transparent" />

          {/* Buttons Overlay */}
          <div className="absolute bottom-8 left-8 right-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-white text-3xl md:text-4xl font-bold">{content.title}</h2>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => onPlay(content)}
                className="flex items-center space-x-2 bg-white hover:bg-gray-200 text-black px-6 py-2.5 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
              >
                <Play size={20} fill="currentColor" />
                <span>Play</span>
              </button>

              <button
                onClick={toggleWatchlist}
                disabled={loading}
                className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all duration-300 transform hover:scale-110 active:scale-95 ${
                  isInWatchlist
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700/70 text-white hover:bg-gray-600'
                } disabled:opacity-50`}
              >
                {isInWatchlist ? <Check size={20} /> : <Plus size={20} />}
              </button>

              <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700/70 text-white hover:bg-gray-600 font-bold transition-all duration-300 transform hover:scale-110 active:scale-95">
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Content Info */}
        <div className="p-6 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="bg-green-600 text-white px-3 py-1 rounded-full font-bold text-xs">
              {content.match_score}% Match
            </span>
            <span className="text-gray-300 font-semibold">{content.year}</span>
            <span className="px-3 py-1 border-2 border-gray-400 text-gray-300 text-xs font-semibold rounded">
              {content.rating}
            </span>
            {content.duration_minutes && (
              <span className="text-gray-300 font-semibold">
                {Math.floor(content.duration_minutes / 60)}h {content.duration_minutes % 60}m
              </span>
            )}
            <span className="px-3 py-1 border-2 border-gray-400 text-gray-300 text-xs font-semibold rounded uppercase">
              {content.type}
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-300 text-base leading-relaxed max-w-3xl">
            {content.description}
          </p>

          {/* Additional Info */}
          <div className="border-t border-gray-700 pt-6 grid grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-500 text-sm mb-2">Popularity</p>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div
                  className="bg-red-600 h-2 rounded-full"
                  style={{ width: `${content.match_score}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideInFromBottom {
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
