import { Info, Play } from 'lucide-react';
import { useState } from 'react';
import { Content } from '../lib/supabase';

interface HeroProps {
  content: Content | null;
  onPlay: (content: Content) => void;
  onInfo: (content: Content) => void;
}

export default function Hero({ content, onPlay, onInfo }: HeroProps) {
  const [isHovered, setIsHovered] = useState(false);

  if (!content) {
    return (
      <div className="relative h-screen bg-gradient-to-b from-gray-900 to-black animate-pulse" />
    );
  }

  return (
    <div
      className="relative h-screen overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0">
        <img
          src={content.banner_url || content.thumbnail_url}
          alt={content.title}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            isHovered ? 'scale-105' : 'scale-100'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      <div className="relative h-full flex items-center px-6 md:px-16">
        <div className="max-w-2xl space-y-6 animate-in fade-in slide-in-from-left-8 duration-700">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight tracking-tight">
            {content.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm md:text-base">
            <span className="bg-green-500 text-black px-3 py-1 rounded-full font-bold text-xs md:text-sm">
              {content.match_score}% Match
            </span>
            <span className="text-gray-300">{content.year}</span>
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

          <p className="text-gray-200 text-base md:text-lg leading-relaxed max-w-xl line-clamp-3">
            {content.description}
          </p>

          <div className="flex items-center space-x-4 pt-6">
            <button
              onClick={() => onPlay(content)}
              className="flex items-center space-x-2 bg-white hover:bg-gray-200 text-black px-6 md:px-8 py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl"
            >
              <Play size={20} fill="currentColor" />
              <span>Play</span>
            </button>

            <button
              onClick={() => onInfo(content)}
              className="flex items-center space-x-2 bg-gray-600 bg-opacity-70 hover:bg-opacity-90 text-white px-6 md:px-8 py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl"
            >
              <Info size={20} />
              <span>More Info</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
