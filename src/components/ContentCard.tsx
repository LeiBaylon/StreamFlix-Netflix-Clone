import { Play } from 'lucide-react';
import { Content } from '../lib/supabase';

interface ContentCardProps {
  content: Content;
  onClick: () => void;
}

export default function ContentCard({ content, onClick }: ContentCardProps) {
  return (
    <div
      onClick={onClick}
      className="flex-none w-48 md:w-64 cursor-pointer group perspective"
    >
      <div className="relative rounded-lg overflow-hidden bg-gray-900 shadow-xl transition-all duration-500 transform group-hover:scale-110 group-hover:shadow-2xl origin-left">
        <img
          src={content.thumbnail_url}
          alt={content.title}
          className="w-full h-28 md:h-40 object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-3">
          {/* Top Info */}
          <div className="text-right">
            <span className="inline-block bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
              {content.type === 'series' ? 'SERIES' : 'MOVIE'}
            </span>
          </div>

          {/* Bottom Content */}
          <div className="space-y-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="text-white text-sm font-bold line-clamp-2">{content.title}</h3>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-green-400 text-xs font-semibold">{content.match_score}%</span>
                <span className="text-gray-300 text-xs">{content.year}</span>
              </div>
              <Play size={16} className="text-white fill-white" />
            </div>

            {/* Rating Badge */}
            <div className="flex items-center space-x-1">
              <span className="text-xs px-1.5 py-0.5 border border-gray-400 text-gray-300 rounded">
                {content.rating}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
