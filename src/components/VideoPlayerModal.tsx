import { X } from 'lucide-react';
import { Content } from '../lib/supabase';
import { useEffect } from 'react';

interface VideoPlayerModalProps {
  content: Content;
  onClose: () => void;
}

export default function VideoPlayerModal({ content, onClose }: VideoPlayerModalProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
      <div className="relative w-full max-w-6xl">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition z-10"
        >
          <X size={32} />
        </button>

        <div className="bg-black rounded-lg overflow-hidden">
          <div className="relative pt-[56.25%]">
            <video
              className="absolute inset-0 w-full h-full"
              controls
              autoPlay
              src={content.video_url}
            >
              Your browser does not support the video tag.
            </video>
          </div>

          <div className="p-8 space-y-4">
            <h2 className="text-white text-3xl font-bold">{content.title}</h2>

            <div className="flex items-center space-x-4 text-sm">
              <span className="text-green-500 font-semibold">{content.match_score}% Match</span>
              <span className="text-gray-300">{content.year}</span>
              <span className="px-2 py-0.5 border border-gray-400 text-gray-300 text-xs">
                {content.rating}
              </span>
              {content.duration_minutes && (
                <span className="text-gray-300">{Math.floor(content.duration_minutes / 60)}h {content.duration_minutes % 60}m</span>
              )}
            </div>

            <p className="text-gray-300 text-lg leading-relaxed">
              {content.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
