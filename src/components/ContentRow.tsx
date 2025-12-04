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
    <div className="space-y-2 px-8 md:px-16 py-4">
      <h2 className="text-white text-xl md:text-2xl font-semibold">{title}</h2>

      <div className="relative group">
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-0 z-10 w-12 bg-black bg-opacity-50 hover:bg-opacity-75 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft size={40} />
          </button>
        )}

        <div
          ref={rowRef}
          className="flex space-x-2 overflow-x-auto scrollbar-hide scroll-smooth"
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
            className="absolute right-0 top-0 bottom-0 z-10 w-12 bg-black bg-opacity-50 hover:bg-opacity-75 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight size={40} />
          </button>
        )}
      </div>
    </div>
  );
}
