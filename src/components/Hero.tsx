import { Info, Play } from 'lucide-react';
import { Content } from '../lib/supabase';

interface HeroProps {
  content: Content | null;
  onPlay: (content: Content) => void;
  onInfo: (content: Content) => void;
}

export default function Hero({ content, onPlay, onInfo }: HeroProps) {
  if (!content) {
    return (
      <div className="relative h-screen bg-gradient-to-b from-gray-900 to-black animate-pulse" />
    );
  }

  return (
    <div className="relative h-screen">
      <div className="absolute inset-0">
        <img
          src={content.banner_url || content.thumbnail_url}
          alt={content.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      <div className="relative h-full flex items-center px-8 md:px-16">
        <div className="max-w-2xl space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
            {content.title}
          </h1>

          <div className="flex items-center space-x-4 text-sm md:text-base">
            <span className="text-green-500 font-semibold">{content.match_score}% Match</span>
            <span className="text-gray-300">{content.year}</span>
            <span className="px-2 py-0.5 border border-gray-400 text-gray-300 text-xs">
              {content.rating}
            </span>
            {content.duration_minutes && (
              <span className="text-gray-300">{Math.floor(content.duration_minutes / 60)}h {content.duration_minutes % 60}m</span>
            )}
          </div>

          <p className="text-white text-lg md:text-xl leading-relaxed max-w-xl">
            {content.description}
          </p>

          <div className="flex items-center space-x-4 pt-4">
            <button
              onClick={() => onPlay(content)}
              className="flex items-center space-x-2 bg-white hover:bg-opacity-80 text-black px-8 py-3 rounded font-semibold transition"
            >
              <Play size={24} fill="currentColor" />
              <span>Play</span>
            </button>

            <button
              onClick={() => onInfo(content)}
              className="flex items-center space-x-2 bg-gray-600 bg-opacity-70 hover:bg-opacity-50 text-white px-8 py-3 rounded font-semibold transition"
            >
              <Info size={24} />
              <span>More Info</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
