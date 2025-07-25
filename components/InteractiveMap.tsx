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

// Custom zoom controls component
const CustomZoomControls = () => {
  const map = useMap()

  const zoomIn = () => {
    map.zoomIn()
  }

  const zoomOut = () => {
    map.zoomOut()
  }

  return (
    <div className="absolute bottom-6 right-6 z-[1000] flex flex-col space-y-2">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={zoomIn}
        className="w-12 h-12 bg-white rounded-lg shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <Plus className="w-5 h-5 text-gray-700" />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={zoomOut}
        className="w-12 h-12 bg-white rounded-lg shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <Minus className="w-5 h-5 text-gray-700" />
      </motion.button>
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

// Custom marker icons
const createCustomIcon = (status: string) => {
  const colors = {
    visited: '#10B981', // Green
    current: '#3B82F6', // Blue
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

// Modal component for destination details
const DestinationModal = ({ destination, isOpen, onClose }: { destination: Destination | null, isOpen: boolean, onClose: () => void }) => {
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
            className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Hero Image */}
            <div className="relative h-64 overflow-hidden">
              <img
                src={destination.image}
                alt={destination.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{destination.name}</h2>
                  <p className="text-gray-600">{destination.country}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-4 h-4 rounded-full ${destination.status === 'visited' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                  <span className="text-sm text-gray-500 capitalize">{destination.status}</span>
                </div>
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">{destination.description}</p>

              {/* Highlights */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">Highlights</h3>
                <div className="grid grid-cols-2 gap-2">
                  {destination.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stories */}
              {destination.stories && destination.stories.length > 0 ? (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">Stories</h3>
                  <div className="space-y-4">
                    {destination.stories.map((story, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-500">{story.date}</span>
                        </div>
                        <h4 className="font-medium text-gray-900 mb-1">{story.title}</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">{story.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎒</div>
                  <p className="text-gray-500">More stories coming soon!</p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
                    <Heart className="w-5 h-5" />
                    <span>Like</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
                    <Share2 className="w-5 h-5" />
                    <span>Share</span>
                  </button>
                </div>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  View More
                </button>
              </div>
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

  const handleMarkerClick = (destination: Destination) => {
    setSelectedDestination(destination);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDestination(null);
  };

  const visitedCount = destinations.filter(d => d.status === 'visited').length;
  const countriesCount = new Set(destinations.map(d => d.country)).size;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-100">
      {/* Header */}
      <motion.div 
        className="absolute top-0 left-0 right-0 z-30 p-6 text-white text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
          The Adventures of Billy and Bobby
        </h1>
        <p className="text-xl md:text-2xl opacity-90 drop-shadow-lg max-w-2xl mx-auto">
          Follow our journey across Europe! Click on the pins to see our stories, photos, and videos from each destination.
        </p>
        <div className="mt-6 flex items-center justify-center space-x-6 text-lg">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span>Visited</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span>Current</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Corner */}
      <motion.div 
        className="absolute top-6 right-6 z-30 bg-white/20 backdrop-blur-sm rounded-lg p-4 text-white"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
      >
        <h3 className="font-bold text-white mb-4">Journey Stats</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-white/80">Cities Visited:</span>
            <span className="font-semibold text-green-300">{visitedCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/80">Countries:</span>
            <span className="font-semibold text-purple-300">{countriesCount}</span>
          </div>
        </div>
      </motion.div>

      {/* Map */}
      <MapContainer
        center={[50.0, 10.0]} // Center of Europe
        zoom={5}
        className="w-full h-full z-10"
        zoomControl={false}
        scrollWheelZoom={true}
        maxBounds={europeBounds}
        minZoom={4}
        maxZoom={12}
        maxBoundsViscosity={1.0}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        {/* Travel routes */}
        {travelRoutes.map((route, index) => (
          <Polyline
            key={index}
            positions={route}
            color="#3B82F6"
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

        {/* Custom zoom controls */}
        <CustomZoomControls />
      </MapContainer>

      {/* Hamburger Menu */}
      <HamburgerMenu />

      {/* Destination Modal */}
      <DestinationModal 
        destination={selectedDestination}
        isOpen={isModalOpen}
        onClose={closeModal}
      />

      {/* Background overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20 pointer-events-none z-10" />
    </div>
  );
} 