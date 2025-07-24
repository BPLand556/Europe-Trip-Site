'use client';

import { motion } from 'framer-motion';
import { X, Calendar, MapPin, Star, ArrowRight } from 'lucide-react';
import { JourneyPhase, Location } from '../types';

interface JourneyTimelineProps {
  phases: JourneyPhase[];
  locations: Location[];
  onLocationClick: (location: Location) => void;
  onClose: () => void;
}

export default function JourneyTimeline({ phases, locations, onLocationClick, onClose }: JourneyTimelineProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 300 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 300 }}
      className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl z-40 max-h-[70vh] overflow-hidden"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-playfair font-bold text-gray-900">Journey Timeline</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Timeline */}
        <div className="overflow-y-auto max-h-[calc(70vh-120px)]">
          {phases.map((phase, phaseIndex) => (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: phaseIndex * 0.1 }}
              className="mb-8"
            >
              {/* Phase Header */}
              <div className="flex items-center space-x-4 mb-4">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: phase.color }}
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{phase.name}</h3>
                  <p className="text-sm text-gray-600">{phase.description}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(phase.startDate).toLocaleDateString()} - {new Date(phase.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Phase Locations */}
              <div className="ml-6 space-y-4">
                {phase.locations.map((locationId, locationIndex) => {
                  const location = locations.find(loc => loc.id === locationId);
                  if (!location) return null;

                  return (
                    <motion.div
                      key={location.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (phaseIndex * 0.1) + (locationIndex * 0.05) }}
                      className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => onLocationClick(location)}
                    >
                      {/* Location Image */}
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={location.images.find(img => img.featured)?.url || location.images[0]?.url}
                          alt={location.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Location Details */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{location.name}</h4>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600">{location.rating}</span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">{location.country}</p>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {location.visitDate ? new Date(location.visitDate).toLocaleDateString() : 'TBD'}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {location.duration}
                          </span>
                        </div>

                        {/* Status Badge */}
                        <div className="mt-2">
                          {location.current && (
                            <span className="inline-block bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                              Currently Here
                            </span>
                          )}
                          {location.visited && (
                            <span className="inline-block bg-gold-500 text-white px-2 py-1 rounded-full text-xs">
                              Visited
                            </span>
                          )}
                          {location.planned && (
                            <span className="inline-block bg-gray-500 text-white px-2 py-1 rounded-full text-xs">
                              Planned
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Arrow */}
                      <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
} 