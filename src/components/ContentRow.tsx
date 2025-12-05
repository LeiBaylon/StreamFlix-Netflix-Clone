import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState } from 'react';
import { Content } from '../lib/supabase';
import ContentCard from './ContentCard';

interface ContentRowProps {
  title: string;
  content: Content[];
  onContentClick: (content: Content) => void;
}

export default function ContentRow({ title, content, onContentClick }: ContentRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    if (!rowRef.current) return;

    const scrollAmount = direction === 'left' ? -rowRef.current.offsetWidth : rowRef.current.offsetWidth;
    rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });

    setTimeout(() => {
      if (rowRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
      }
    }, 300);
  };

  return (
    <div className="space-y-3 px-6 md:px-16 py-6 animate-in fade-in slide-in-from-bottom-4">
      <h2 className="text-white text-xl md:text-2xl font-bold tracking-tight">{title}</h2>

      <div className="relative group">
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-0 z-20 w-12 md:w-16 bg-gradient-to-r from-black via-black/50 to-transparent text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft size={40} className="drop-shadow-lg" />
          </button>
        )}

        <div
          ref={rowRef}
          className="flex space-x-2 md:space-x-3 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {content.map((item) => (
            <ContentCard
              key={item.id}
              content={item}
              onClick={() => onContentClick(item)}
            />
          ))}
        </div>

        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-0 z-20 w-12 md:w-16 bg-gradient-to-l from-black via-black/50 to-transparent text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
          >
            <ChevronRight size={40} className="drop-shadow-lg" />
          </button>
        )}
      </div>
    </div>
  );
}
