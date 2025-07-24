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
  const map = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    const initMap = async () => {
      const mapboxgl = await import('mapbox-gl');
      
      // Set your Mapbox access token here
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUifQ.example';

      map.current = new mapboxgl.Map({
        container: mapContainer.current!,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [4.9041, 50.0755], // Amsterdam
        zoom: 5,
        bearing: 0,
        pitch: 0
      });

      map.current.on('load', () => {
        setMapLoaded(true);
        addMarkers();
        addRoutes();
      });

      // Add navigation controls
      map.current.addControl(new (mapboxgl as any).NavigationControl(), 'top-right');
    };

    initMap();

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  const addMarkers = () => {
    if (!map.current) return;

    locations.forEach((location) => {
      // Create custom marker element
      const markerEl = document.createElement('div');
      markerEl.className = 'custom-marker';
      
      const markerContent = document.createElement('div');
      markerContent.className = 'relative';
      
      // Determine marker type and styling
      let markerClass = 'w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg';
      let icon = null;
      
      if (location.current) {
        markerClass += ' bg-blue-500 animate-pulse-slow';
        icon = <div className="w-3 h-3 bg-white rounded-full animate-ping" />;
      } else if (location.visited) {
        markerClass += ' bg-gold-500';
        icon = <CheckCircle className="w-4 h-4" />;
      } else if (location.planned) {
        markerClass += ' bg-gray-400';
        icon = <Clock className="w-4 h-4" />;
      } else {
        markerClass += ' bg-primary-600';
        icon = <MapPin className="w-4 h-4" />;
      }

      markerContent.innerHTML = `
        <div class="${markerClass}">
          ${icon ? `<div class="text-white">${icon}</div>` : ''}
        </div>
        <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-sm"></div>
      `;
      
      markerEl.appendChild(markerContent);

      // Add hover effect
      markerEl.addEventListener('mouseenter', () => {
        markerEl.style.transform = 'scale(1.2)';
        showPopup(location);
      });

      markerEl.addEventListener('mouseleave', () => {
        markerEl.style.transform = 'scale(1)';
        hidePopup();
      });

      markerEl.addEventListener('click', () => {
        onLocationClick(location);
      });

      // Add marker to map
      new (mapboxgl as any).Marker(markerEl)
        .setLngLat(location.coordinates)
        .addTo(map.current);
    });
  };

  const addRoutes = () => {
    if (!map.current) return;

    // Add route lines between visited locations
    const visitedLocations = locations.filter(loc => loc.visited);
    
    if (visitedLocations.length > 1) {
      const coordinates = visitedLocations.map(loc => loc.coordinates);
      
      map.current.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: coordinates
          }
        }
      });

      map.current.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#d69e2e',
          'line-width': 3,
          'line-opacity': 0.8
        }
      });
    }
  };

  const showPopup = (location: Location) => {
    if (!map.current) return;

          const popup = new (mapboxgl as any).Popup({
        closeButton: false,
        closeOnClick: false,
        className: 'custom-popup'
      });

    popup.setHTML(`
      <div class="p-4">
        <h3 class="font-bold text-lg text-gray-900 mb-1">${location.name}</h3>
        <p class="text-gray-600 text-sm mb-2">${location.country}</p>
        <div class="flex items-center space-x-2">
          <div class="flex items-center">
            ${Array.from({ length: 5 }, (_, i) => 
              `<Star className="w-4 h-4 ${i < Math.floor(location.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}" />`
            ).join('')}
          </div>
          <span class="text-sm text-gray-500">${location.rating}</span>
        </div>
        <p class="text-sm text-gray-600 mt-2">${location.description}</p>
      </div>
    `);

    popup.setLngLat(location.coordinates).addTo(map.current);
  };

  const hidePopup = () => {
    if (!map.current) return;
    
    const popups = document.querySelectorAll('.mapboxgl-popup');
    popups.forEach(popup => popup.remove());
  };

  return (
    <div className="relative w-full h-full">
      {/* Map Container */}
      <div 
        ref={mapContainer} 
        className="w-full h-full"
      />

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