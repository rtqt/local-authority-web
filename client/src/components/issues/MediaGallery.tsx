import { useState } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { MediaItem } from '@/types/issue';

interface MediaGalleryProps {
  media: MediaItem[];
}

export const MediaGallery = ({ media }: MediaGalleryProps) => {
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);

  if (!media || media.length === 0) return null;

  const nextMedia = () => {
    setSelectedMediaIndex((prev) => 
      prev < media.length - 1 ? prev + 1 : 0
    );
  };

  const prevMedia = () => {
    setSelectedMediaIndex((prev) => 
      prev > 0 ? prev - 1 : media.length - 1
    );
  };

  return (
    <div className="mb-6">
      <h3 className="text-white text-lg font-semibold mb-3">Media</h3>
      
      {/* Main Media Display */}
      <div className="relative bg-slate-900 rounded-lg overflow-hidden mb-4">
        {media[selectedMediaIndex].type === 'image' ? (
          <img
            src={media[selectedMediaIndex].fileUrl}
            alt={media[selectedMediaIndex].caption || 'Issue media'}
            className="w-full h-64 object-cover"
          />
        ) : (
          <div className="w-full h-64 bg-slate-900 flex items-center justify-center relative">
            <Play className="text-white" size={48} />
            <video
              src={media[selectedMediaIndex].fileUrl}
              className="w-full h-full object-cover"
              controls
            />
          </div>
        )}
        
        {media.length > 1 && (
          <>
            <button
              onClick={prevMedia}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextMedia}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Media Thumbnails */}
      {media.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {media.map((mediaItem, index) => (
            <button
              key={mediaItem.multimediaId}
              onClick={() => setSelectedMediaIndex(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                index === selectedMediaIndex 
                  ? 'border-blue-500' 
                  : 'border-slate-600 hover:border-slate-500'
              }`}
            >
              <img
                src={mediaItem.thumbnail || mediaItem.fileUrl}
                alt={`Media ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
      
      {media[selectedMediaIndex].caption && (
        <p className="text-slate-400 text-sm italic mt-2">
          {media[selectedMediaIndex].caption}
        </p>
      )}
    </div>
  );
};
