'use client'

import React, { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import { Icon, LatLngExpression, LatLngBounds } from 'leaflet'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, MapPin, Camera, Heart, Share2, Menu, Star, Clock, Users, Plus, Minus } from 'lucide-react'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in React Leaflet
delete (Icon.Default.prototype as any)._getIconUrl
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Map bounds for Europe
const europeBounds: LatLngBounds = new LatLngBounds(
  [34.0, -25.0], // Southwest coordinates
  [71.0, 45.0]   // Northeast coordinates
)

// Working zoom controls component using useMap
const ZoomControls = () => {
  const map = useMap()
  
  const handleZoomIn = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Zoom in clicked, map:', map) // Debug
    if (map && typeof map.zoomIn === 'function') {
      try {
        map.zoomIn()
        console.log('Map zoomed in successfully')
      } catch (error) {
        console.error('Error zooming in:', error)
      }
    } else {
      console.error('Map not available or zoomIn not a function')
    }
  }
  
  const handleZoomOut = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Zoom out clicked, map:', map) // Debug
    if (map && typeof map.zoomOut === 'function') {
      try {
        map.zoomOut()
        console.log('Map zoomed out successfully')
      } catch (error) {
        console.error('Error zooming out:', error)
      }
    } else {
      console.error('Map not available or zoomOut not a function')
    }
  }
  
  return (
    <div className="zoom-controls" style={{
      position: 'absolute',
      bottom: '30px',
      right: '30px',
      zIndex: 1000,
      pointerEvents: 'auto' // CRITICAL
    }}>
      <button 
        onClick={handleZoomIn}
        onMouseDown={handleZoomIn}
        onTouchStart={handleZoomIn}
        style={{
          width: '44px',
          height: '44px',
          background: 'white',
          border: '2px solid #ddd',
          borderRadius: '6px 6px 0 0',
          cursor: 'pointer',
          fontSize: '18px',
          fontWeight: 'bold',
          pointerEvents: 'auto',
          userSelect: 'none',
          WebkitUserSelect: 'none'
        }}
      >
        +
      </button>
      <button 
        onClick={handleZoomOut}
        onMouseDown={handleZoomOut}
        onTouchStart={handleZoomOut}
        style={{
          width: '44px',
          height: '44px',
          background: 'white',
          border: '2px solid #ddd',
          borderRadius: '0 0 6px 6px',
          cursor: 'pointer',
          fontSize: '18px',
          fontWeight: 'bold',
          pointerEvents: 'auto',
          userSelect: 'none',
          WebkitUserSelect: 'none'
        }}
      >
        −
      </button>
    </div>
  )
}

// Travel data
interface Destination {
  id: string
  name: string
  country: string
  coordinates: LatLngExpression
  status: 'visited' | 'current'
  visitDate?: string
  image: string
  description: string
  highlights: string[]
  stories: Array<{
    title: string
    date: string
    content: string
    type: 'story' | 'video' | 'photo'
  }>
}

const destinations: Destination[] = [
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    coordinates: [48.8566, 2.3522],
    status: 'visited',
    visitDate: 'September 15, 2025',
    image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800&h=600&fit=crop',
    description: 'The City of Light stole our hearts! From sunrise at the Eiffel Tower to evening strolls along the Seine.',
    highlights: ['Eiffel Tower at sunset', 'Louvre Museum', 'Seine river cruise', 'Montmartre district'],
    stories: [
      {
        title: 'Our First Day in Paris',
        date: 'September 15, 2025',
        content: 'We arrived in Paris this morning and immediately fell in love! The city is even more beautiful than we imagined. Our first stop was a small café near our hotel where we had the most incredible croissants...',
        type: 'story'
      },
      {
        title: 'Eiffel Tower Sunset',
        date: 'September 16, 2025',
        content: 'Watching the sunset from the Eiffel Tower was absolutely magical. The golden hour light made the entire city glow...',
        type: 'photo'
      }
    ]
  },
  {
    id: 'barcelona',
    name: 'Barcelona',
    country: 'Spain',
    coordinates: [41.3851, 2.1734],
    status: 'current',
    visitDate: 'September 20, 2025',
    image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=600&fit=crop',
    description: 'Currently exploring the vibrant culture and stunning architecture of Barcelona!',
    highlights: ['Sagrada Familia', 'Park Güell', 'Las Ramblas', 'Gothic Quarter'],
    stories: [
      {
        title: 'Gaudí\'s Masterpieces',
        date: 'September 20, 2025',
        content: 'Today we explored the incredible works of Antoni Gaudí. The Sagrada Familia left us speechless...',
        type: 'story'
      }
    ]
  }
  // Add more visited/current cities as needed
];

// Premium custom marker icons
const createCustomIcon = (status: string) => {
  const colors = {
    visited: '#10B981', // Green
    current: '#2563eb', // Blue
  };
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="12" fill="${colors[status as keyof typeof colors]}" stroke="white" stroke-width="3"/>
        <circle cx="16" cy="16" r="6" fill="white"/>
        ${status === 'visited' ? '<path d="M12 16l3 3 6-6" stroke="' + colors[status] + '" stroke-width="2" fill="none"/>' : ''}
        ${status === 'current' ? '<circle cx="16" cy="16" r="3" fill="' + colors[status] + '"/>' : ''}
      </svg>
    `)}`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

// Only connect visited cities in order, and connect current city to last visited if present
const visited = destinations.filter(d => d.status === 'visited');
const current = destinations.find(d => d.status === 'current');
let travelRoutes: LatLngExpression[][] = [];
for (let i = 0; i < visited.length - 1; i++) {
  travelRoutes.push([visited[i].coordinates, visited[i + 1].coordinates]);
}
if (current && visited.length > 0) {
  travelRoutes.push([visited[visited.length - 1].coordinates, current.coordinates]);
}

// Elegant location modal
const LocationModal = ({ destination, isOpen, onClose }: { destination: Destination | null, isOpen: boolean, onClose: () => void }) => {
  if (!destination) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="location-modal"
          >
            {/* Hero Image Section */}
            <div className="modal-hero">
              <img
                src={destination.image}
                alt={destination.name}
                className="w-full h-full object-cover"
              />
              <div className="modal-overlay">
                <h2 className="location-title">{destination.name}</h2>
                <p className="visit-date">{destination.visitDate}</p>
              </div>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            
            {/* Content Section */}
            <div className="modal-content">
              {/* Photo Preview Grid */}
              <div className="photo-preview">
                <div className="photo-grid">
                  {destination.stories.slice(0, 4).map((story, index) => (
                    <div key={index} className="bg-gray-200 rounded-lg flex items-center justify-center">
                      <Camera className="w-6 h-6 text-gray-500" />
                    </div>
                  ))}
                  {destination.stories.length > 4 && (
                    <div className="more-photos bg-gray-200 rounded-lg flex items-center justify-center text-sm font-medium text-gray-600">
                      +{destination.stories.length - 4}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Brief Description */}
              <p className="location-description text-gray-700 text-sm leading-relaxed">{destination.description}</p>
              
              {/* Call to Action */}
              <button 
                className="see-more-btn"
                onClick={() => {
                  // Navigate to dedicated location page
                  console.log('Navigate to:', destination.id);
                  onClose();
                }}
              >
                See Full Story
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Hamburger menu component
const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute top-6 left-6 z-[1000]">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
      >
        <Menu className="w-6 h-6 text-white" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            className="absolute top-16 left-0 bg-white/20 backdrop-blur-sm rounded-lg p-4 min-w-[200px]"
          >
            <div className="space-y-3">
              <a href="#" className="block text-white hover:text-blue-200 transition-colors">About</a>
              <a href="#" className="block text-white hover:text-blue-200 transition-colors">Contact</a>
              <a href="#" className="block text-white hover:text-blue-200 transition-colors">Blog</a>
              <a href="#" className="block text-white hover:text-blue-200 transition-colors">Gallery</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Main component
export default function BillyBobbyTravelMap() {
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const mapRef = useRef<any>(null);

  const handleMarkerClick = (destination: Destination) => {
    setSelectedDestination(destination);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDestination(null);
  };

  // Force enable all map interactions
  useEffect(() => {
    const enableMapInteractions = () => {
      if (mapRef.current) {
        const map = mapRef.current;
        
        try {
          // Enable all interactions
          map.dragging.enable();
          map.touchZoom.enable();
          map.doubleClickZoom.enable();
          map.scrollWheelZoom.enable();
          map.boxZoom.enable();
          map.keyboard.enable();
          
          console.log('Map interactions enabled successfully');
          
          // Test if interactions are working
          console.log('Dragging enabled:', map.dragging.enabled());
          console.log('Touch zoom enabled:', map.touchZoom.enabled());
          console.log('Scroll wheel zoom enabled:', map.scrollWheelZoom.enabled());
        } catch (error) {
          console.error('Error enabling map interactions:', error);
        }
      }
    };

    // Enable immediately and also after delays to ensure map is ready
    enableMapInteractions();
    setTimeout(enableMapInteractions, 100);
    setTimeout(enableMapInteractions, 500);
    setTimeout(enableMapInteractions, 1000);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-100">
      {/* Map */}
      <MapContainer
        ref={mapRef}
        center={[54.5, 15.2]} // Center of Europe
        zoom={5}
        className="w-full h-full z-10"
        style={{ minHeight: '100vh', minWidth: '100vw', background: 'transparent' }}
        zoomControl={false}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        dragging={true}
        touchZoom={true}
        boxZoom={true}
        keyboard={true}
        maxBounds={europeBounds}
        minZoom={4}
        maxZoom={12}
        maxBoundsViscosity={1.0}
      >
        {/* English-only tile layer */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          subdomains={['a', 'b', 'c', 'd']}
          maxZoom={18}
          minZoom={4}
        />
        
        {/* Travel routes */}
        {travelRoutes.map((route, index) => (
          <Polyline
            key={index}
            positions={route}
            color="#2563eb"
            weight={4}
            opacity={0.8}
            dashArray="15, 10"
          />
        ))}
        
        {/* Destination markers */}
        {destinations.map((destination) => (
          <Marker
            key={destination.id}
            position={destination.coordinates}
            icon={createCustomIcon(destination.status)}
            eventHandlers={{
              click: () => handleMarkerClick(destination)
            }}
          >
            <Popup>
              <div className="text-center">
                <h3 className="font-bold text-lg">{destination.name}</h3>
                <p className="text-gray-600">{destination.country}</p>
                <p className="text-sm mt-2">{destination.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Working zoom controls */}
        <ZoomControls />
      </MapContainer>

      {/* Hamburger Menu */}
      <HamburgerMenu />

      {/* Location Modal */}
      <LocationModal 
        destination={selectedDestination}
        isOpen={isModalOpen}
        onClose={closeModal}
      />

      {/* Background overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20 pointer-events-none z-10" />
    </div>
  );
} 