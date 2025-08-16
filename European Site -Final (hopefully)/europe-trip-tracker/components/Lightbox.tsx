'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { getCloudinaryUrl, getVideoUrl } from '@/lib/cloudinary';
import { cn } from '@/lib/utils';

interface LightboxProps {
  media: Array<{
    id: string;
    type: 'IMAGE' | 'VIDEO';
    cldId: string;
    width?: number;
    height?: number;
  }>;
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export function Lightbox({ media, initialIndex = 0, isOpen, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setScale(1);
  }, [initialIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          setCurrentIndex((prev) => (prev > 0 ? prev - 1 : media.length - 1));
          break;
        case 'ArrowRight':
          setCurrentIndex((prev) => (prev < media.length - 1 ? prev + 1 : 0));
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, media.length, onClose]);

  if (!isOpen) return null;

  const currentMedia = media[currentIndex];
  const isImage = currentMedia.type === 'IMAGE';

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : media.length - 1));
    setScale(1);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < media.length - 1 ? prev + 1 : 0));
    setScale(1);
  };

  const handleZoomIn = () => setScale((prev) => Math.min(prev * 1.5, 3));
  const handleZoomOut = () => setScale((prev) => Math.max(prev / 1.5, 0.5));

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
      >
        <X className="w-8 h-8" />
      </button>

      {/* Navigation arrows */}
      {media.length > 1 && (
        <>
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-10"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-10"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </>
      )}

      {/* Zoom controls */}
      <div className="absolute top-4 left-4 flex gap-2 z-10">
        <button
          onClick={handleZoomOut}
          className="text-white hover:text-gray-300 p-2 rounded-full bg-black/50"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button
          onClick={handleZoomIn}
          className="text-white hover:text-gray-300 p-2 rounded-full bg-black/50"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
      </div>

      {/* Media content */}
      <div className="relative max-w-full max-h-full overflow-hidden">
        {isImage ? (
          <Image
            src={getCloudinaryUrl(currentMedia.cldId, {
              quality: 'auto',
              format: 'webp',
            })}
            alt="Full size image"
            width={currentMedia.width || 1920}
            height={currentMedia.height || 1080}
            className="max-w-full max-h-full object-contain transition-transform duration-200"
            style={{ transform: `scale(${scale})` }}
            priority
          />
        ) : (
          <video
            src={getVideoUrl(currentMedia.cldId)}
            controls
            className="max-w-full max-h-full"
            autoPlay
            muted
          />
        )}
      </div>

      {/* Counter */}
      {media.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
          {currentIndex + 1} / {media.length}
        </div>
      )}
    </div>
  );
}
