'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, CheckCircle, Clock, Star, MapPinIcon } from 'lucide-react';
import { Location, JourneyPhase } from '../types';

interface InteractiveMapProps {
  locations: Location[];
  onLocationClick: (location: Location) => void;
  journeyPhases: JourneyPhase[];
}

export default function InteractiveMap({ locations, onLocationClick, journeyPhases }: InteractiveMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Simulate map loading
    setTimeout(() => {
      setMapLoaded(true);
    }, 1000);
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* Map Container */}
      <div 
        ref={mapContainer} 
        className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 relative"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Location Markers */}
        {locations.map((location, index) => (
          <motion.div
            key={location.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="absolute cursor-pointer"
            style={{
              left: `${20 + (index * 15)}%`,
              top: `${30 + (index * 10)}%`,
            }}
            onClick={() => onLocationClick(location)}
          >
            <div className="relative">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg
                ${location.current ? 'bg-blue-500 animate-pulse-slow' : ''}
                ${location.visited ? 'bg-gold-500' : ''}
                ${location.planned ? 'bg-gray-400' : ''}
                ${!location.current && !location.visited && !location.planned ? 'bg-primary-600' : ''}
              `}>
                {location.current && <div className="w-3 h-3 bg-white rounded-full animate-ping" />}
                {location.visited && <CheckCircle className="w-4 h-4" />}
                {location.planned && <Clock className="w-4 h-4" />}
                {!location.current && !location.visited && !location.planned && <MapPin className="w-4 h-4" />}
              </div>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-sm"></div>
              
              {/* Location Label */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 text-xs font-medium text-gray-700 whitespace-nowrap shadow-lg">
                {location.name}
              </div>
            </div>
          </motion.div>
        ))}

        {/* Route Lines */}
        {locations.filter(loc => loc.visited).length > 1 && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#d69e2e" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#d69e2e" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            {locations.filter(loc => loc.visited).map((location, index, visitedLocations) => {
              if (index === visitedLocations.length - 1) return null;
              const nextLocation = visitedLocations[index + 1];
              return (
                <line
                  key={`route-${index}`}
                  x1={`${20 + (index * 15)}%`}
                  y1={`${30 + (index * 10)}%`}
                  x2={`${20 + ((index + 1) * 15)}%`}
                  y2={`${30 + ((index + 1) * 10)}%`}
                  stroke="url(#routeGradient)"
                  strokeWidth="3"
                  strokeDasharray="5,5"
                  className="animate-pulse"
                />
              );
            })}
          </svg>
        )}
      </div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {!mapLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-br from-primary-900 to-primary-950 flex items-center justify-center"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-gold-400 border-t-transparent rounded-full mx-auto mb-4"
              />
              <p className="text-white text-lg font-medium">Loading your adventure map...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        className="absolute bottom-4 right-4 glass-morphism-strong rounded-xl p-4"
      >
        <h3 className="text-white font-semibold mb-3">Legend</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gold-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-2 h-2 text-white" />
            </div>
            <span className="text-white text-sm">Visited</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse-slow"></div>
            <span className="text-white text-sm">Current</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center">
              <Clock className="w-2 h-2 text-white" />
            </div>
            <span className="text-white text-sm">Planned</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 