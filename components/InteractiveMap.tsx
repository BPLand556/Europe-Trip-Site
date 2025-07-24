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
        <div className="absolute inset-0 opacity-30">
          <svg viewBox="0 0 1000 600" className="w-full h-full">
            {/* Europe continent outline */}
            <path 
              d="M 50 150 Q 100 130 150 150 Q 200 170 250 150 Q 300 130 350 150 Q 400 170 450 150 Q 500 130 550 150 Q 600 170 650 150 Q 700 130 750 150 Q 800 170 850 150 L 850 450 Q 800 470 750 450 Q 700 430 650 450 Q 600 470 550 450 Q 500 430 450 450 Q 400 470 350 450 Q 300 430 250 450 Q 200 470 150 450 Q 100 430 50 450 Z" 
              fill="#f3f4f6" 
              stroke="#d1d5db" 
              strokeWidth="3"
            />
            {/* Major countries */}
            <path d="M 100 200 Q 150 180 200 200 Q 250 220 300 200" stroke="#9ca3af" strokeWidth="2" fill="none" opacity="0.7"/>
            <path d="M 350 250 Q 400 230 450 250 Q 500 270 550 250" stroke="#9ca3af" strokeWidth="2" fill="none" opacity="0.7"/>
            <path d="M 600 300 Q 650 280 700 300 Q 750 320 800 300" stroke="#9ca3af" strokeWidth="2" fill="none" opacity="0.7"/>
            <path d="M 200 350 Q 250 330 300 350 Q 350 370 400 350" stroke="#9ca3af" strokeWidth="2" fill="none" opacity="0.7"/>
            <path d="M 450 400 Q 500 380 550 400 Q 600 420 650 400" stroke="#9ca3af" strokeWidth="2" fill="none" opacity="0.7"/>
          </svg>
        </div>

        {/* Location Markers */}
        {locations.map((location, index) => {
          // Geographic positioning based on actual coordinates
          const positions = {
            'paris-france': { left: '30%', top: '40%' },
            'rome-italy': { left: '40%', top: '50%' },
            'barcelona-spain': { left: '25%', top: '55%' },
            'amsterdam-netherlands': { left: '35%', top: '30%' },
            'prague-czech-republic': { left: '50%', top: '35%' }
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
            <div className="relative group">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg
                transition-all duration-300 group-hover:scale-125 group-hover:shadow-xl
                ${location.current ? 'bg-blue-500 animate-pulse-slow' : ''}
                ${location.visited ? 'bg-gold-500' : ''}
                ${location.planned ? 'bg-gray-400' : ''}
                ${!location.current && !location.visited && !location.planned ? 'bg-primary-600' : ''}
              `}>
                {location.current && <div className="w-3 h-3 bg-white rounded-full animate-ping" />}
                {location.visited && <CheckCircle className="w-5 h-5" />}
                {location.planned && <Clock className="w-5 h-5" />}
                {!location.current && !location.visited && !location.planned && <MapPin className="w-5 h-5" />}
              </div>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-lg"></div>
              
              {/* Location Label */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 bg-white/95 backdrop-blur-md rounded-lg px-3 py-2 text-sm font-medium text-gray-800 whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {location.name}
                <div className="text-xs text-gray-500 mt-1">{location.country}</div>
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
              x1="30%"
              y1="40%"
              x2="40%"
              y2="50%"
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