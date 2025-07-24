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
        className="w-full h-full relative"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='mapGrid' width='40' height='40' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 40 0 L 0 0 0 40' fill='none' stroke='%23e5e7eb' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='%23f8fafc'/%3E%3Crect width='100%25' height='100%25' fill='url(%23mapGrid)'/%3E%3C/svg%3E")`,
          backgroundSize: 'cover',
        }}
      >
        {/* Europe Map Overlay */}
        <div className="absolute inset-0 opacity-20">
          <svg viewBox="0 0 1000 600" className="w-full h-full">
            {/* Simplified Europe outline */}
            <path 
              d="M 100 200 Q 150 180 200 200 Q 250 220 300 200 Q 350 180 400 200 Q 450 220 500 200 Q 550 180 600 200 Q 650 220 700 200 Q 750 180 800 200 L 800 400 Q 750 420 700 400 Q 650 380 600 400 Q 550 420 500 400 Q 450 380 400 400 Q 350 420 300 400 Q 250 380 200 400 Q 150 420 100 400 Z" 
              fill="#e5e7eb" 
              stroke="#d1d5db" 
              strokeWidth="2"
            />
            {/* Country outlines */}
            <path d="M 150 250 Q 200 230 250 250 Q 300 270 350 250" stroke="#d1d5db" strokeWidth="1" fill="none" opacity="0.5"/>
            <path d="M 400 280 Q 450 260 500 280 Q 550 300 600 280" stroke="#d1d5db" strokeWidth="1" fill="none" opacity="0.5"/>
            <path d="M 650 320 Q 700 300 750 320 Q 800 340 850 320" stroke="#d1d5db" strokeWidth="1" fill="none" opacity="0.5"/>
          </svg>
        </div>

        {/* Location Markers */}
        {locations.map((location, index) => {
          // Geographic positioning based on actual coordinates
          const positions = {
            'paris-france': { left: '25%', top: '35%' },
            'rome-italy': { left: '35%', top: '45%' },
            'barcelona-spain': { left: '20%', top: '50%' },
            'amsterdam-netherlands': { left: '30%', top: '25%' },
            'prague-czech-republic': { left: '45%', top: '30%' }
          };
          
          const position = positions[location.id as keyof typeof positions] || { left: '50%', top: '50%' };
          
          return (
            <motion.div
              key={location.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="absolute cursor-pointer"
              style={{
                left: position.left,
                top: position.top,
                transform: 'translate(-50%, -50%)'
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
        );
        })}

        {/* Route Lines */}
        {locations.filter(loc => loc.visited).length > 1 && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#d69e2e" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#d69e2e" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            {/* Route from Paris to Rome */}
            <line
              x1="25%"
              y1="35%"
              x2="35%"
              y2="45%"
              stroke="url(#routeGradient)"
              strokeWidth="3"
              strokeDasharray="5,5"
              className="animate-pulse"
            />
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