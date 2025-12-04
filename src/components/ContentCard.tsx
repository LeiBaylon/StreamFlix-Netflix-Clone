import { Content } from '../lib/supabase';

interface ContentCardProps {
  content: Content;
  onClick: () => void;
}

export default function ContentCard({ content, onClick }: ContentCardProps) {
  return (
    <div
      onClick={onClick}
      className="flex-none w-48 md:w-64 cursor-pointer transition-transform duration-300 hover:scale-105 group"
    >
      <div className="relative rounded overflow-hidden">
        <img
          src={content.thumbnail_url}
          alt={content.title}
          className="w-full h-28 md:h-36 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-2 left-2 right-2">
            <h3 className="text-white text-sm font-semibold truncate">{content.title}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-green-500 text-xs font-semibold">{content.match_score}% Match</span>
              <span className="text-gray-300 text-xs">{content.year}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
