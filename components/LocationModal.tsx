'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Calendar, MapPin, Globe, DollarSign, Clock, Heart, Share2 } from 'lucide-react';
import { Location } from '../types';

interface LocationModalProps {
  location: Location;
  onClose: () => void;
}

export default function LocationModal({ location, onClose }: LocationModalProps) {
  const featuredImage = location.images.find(img => img.featured) || location.images[0];

  const getStatusColor = () => {
    if (location.current) return 'bg-blue-500';
    if (location.visited) return 'bg-gold-500';
    if (location.planned) return 'bg-gray-500';
    return 'bg-primary-600';
  };

  const getStatusText = () => {
    if (location.current) return 'Currently Here';
    if (location.visited) return 'Visited';
    if (location.planned) return 'Planned';
    return 'Unknown';
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Image */}
          <div className="relative h-64 overflow-hidden">
            <img
              src={featuredImage?.url}
              alt={featuredImage?.alt}
              className="w-full h-full object-cover"
            />
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-all"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Status Badge */}
            <div className="absolute top-4 left-4">
              <span className={`${getStatusColor()} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                {getStatusText()}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Title and Rating */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-playfair font-bold text-gray-900 mb-2">
                  {location.name}
                </h2>
                <p className="text-gray-600 flex items-center">
                  <Globe className="w-4 h-4 mr-1" />
                  {location.country}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(location.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600 font-medium">{location.rating}</span>
              </div>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">{location.duration}</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600 capitalize">{location.cost}</span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
              <p className="text-gray-700 leading-relaxed">{location.description}</p>
            </div>

            {/* Story */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Our Story</h3>
              <p className="text-gray-700 leading-relaxed">{location.story}</p>
            </div>

            {/* Tags */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {location.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-gray-200 p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors">
                <Heart className="w-5 h-5" />
                <span>Save</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors">
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>
            </div>
            <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors">
              View Details
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 