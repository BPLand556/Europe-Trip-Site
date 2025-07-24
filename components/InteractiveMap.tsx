'use client'

import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import { Icon, LatLngExpression } from 'leaflet'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, MapPin, Camera, Heart, Share2, Menu, Star, Clock, Users } from 'lucide-react'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in React Leaflet
delete (Icon.Default.prototype as any)._getIconUrl
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Travel data
interface Destination {
  id: string
  name: string
  country: string
  coordinates: LatLngExpression
  status: 'visited' | 'current' | 'planned'
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
    id: 'rome',
    name: 'Rome',
    country: 'Italy',
    coordinates: [41.9028, 12.4964],
    status: 'planned',
    visitDate: 'September 22, 2025',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&h=600&fit=crop',
    description: 'The Eternal City awaits! We can\'t wait to explore ancient history and amazing Italian cuisine.',
    highlights: ['Colosseum tour', 'Vatican City', 'Trevi Fountain', 'Roman Forum'],
    stories: []
  },
  {
    id: 'amsterdam',
    name: 'Amsterdam',
    country: 'Netherlands',
    coordinates: [52.3676, 4.9041],
    status: 'planned',
    visitDate: 'December 10, 2025',
    image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&h=600&fit=crop',
    description: 'Canal cruises and cozy cafes in the charming Dutch capital during winter!',
    highlights: ['Canal boat tour', 'Anne Frank House', 'Van Gogh Museum', 'Winter markets'],
    stories: []
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
]

// Custom marker icons
const createCustomIcon = (status: string) => {
  const colors = {
    visited: '#10B981', // Green
    current: '#3B82F6', // Blue
    planned: '#6B7280'  // Gray
  }
  
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
  })
}

// Modal component for destination details
const DestinationModal = ({ destination, isOpen, onClose }: {
  destination: Destination | null
  isOpen: boolean
  onClose: () => void
}) => {
  if (!destination) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl bg-white rounded-2xl shadow-2xl z-50 max-h-[90vh] overflow-y-auto mx-4"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
            
            <div className="relative h-80 overflow-hidden rounded-t-2xl">
              <img 
                src={destination.image} 
                alt={destination.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-8 left-8 text-white">
                <div className="flex items-center mb-2">
                  <span className={`inline-block w-3 h-3 rounded-full mr-3 ${
                    destination.status === 'visited' ? 'bg-green-400' :
                    destination.status === 'current' ? 'bg-blue-400' : 'bg-gray-400'
                  }`} />
                  <span className="text-sm font-medium opacity-90 capitalize">
                    {destination.status === 'visited' ? 'Visited' : 
                     destination.status === 'current' ? 'Currently Here' : 'Planned'}
                  </span>
                </div>
                <h2 className="text-4xl font-bold mb-2">{destination.name}</h2>
                <p className="text-xl opacity-90">{destination.country}</p>
                {destination.visitDate && (
                  <div className="flex items-center mt-3 text-sm opacity-75">
                    <Calendar className="h-4 w-4 mr-2" />
                    {destination.visitDate}
                  </div>
                )}
              </div>
            </div>

            <div className="p-8">
              <p className="text-gray-700 text-lg leading-relaxed mb-8">{destination.description}</p>
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-6 flex items-center">
                  <MapPin className="h-6 w-6 mr-3 text-blue-500" />
                  Highlights
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {destination.highlights.map((highlight, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-500 mr-3" />
                        <span className="text-gray-800 font-medium">{highlight}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {destination.stories && destination.stories.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold mb-6 flex items-center">
                    <Camera className="h-6 w-6 mr-3 text-purple-500" />
                    Our Stories
                  </h3>
                  <div className="space-y-6">
                    {destination.stories.map((story, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <h4 className="text-xl font-bold text-gray-800">{story.title}</h4>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            story.type === 'video' ? 'bg-red-100 text-red-700' :
                            story.type === 'photo' ? 'bg-purple-100 text-purple-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {story.type}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <Clock className="h-4 w-4 mr-2" />
                          {story.date}
                        </div>
                        <p className="text-gray-700 leading-relaxed">{story.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(!destination.stories || destination.stories.length === 0) && destination.status === 'planned' && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎒</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">Coming Soon!</h3>
                  <p className="text-gray-600 text-lg">We haven't visited {destination.name} yet, but we can't wait to share our adventures when we do!</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Hamburger menu component
const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { title: 'About Our Journey', icon: '✈️', content: 'Follow Billy and Bobby across Europe!' },
    { title: 'Travel Timeline', icon: '📅', content: 'September & December 2025 adventures' },
    { title: 'Photo Gallery', icon: '📸', content: 'All our favorite moments' },
    { title: 'Travel Tips', icon: '💡', content: 'What we\'ve learned along the way' },
    { title: 'Contact Us', icon: '💌', content: 'Say hello and share your stories!' }
  ]

  return (
    <>
      <motion.button
        className="fixed top-6 right-6 z-40 w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-all duration-300"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-30 overflow-y-auto"
            >
              <div className="p-8 pt-20">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">The Adventures of Billy and Bobby</h2>
                  <p className="text-gray-600">Follow our journey across Europe!</p>
                </div>

                <div className="space-y-4">
                  {menuItems.map((item, index) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <h3 className="font-semibold text-gray-800">{item.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{item.content}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

// Main component
export default function InteractiveMap() {
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Calculate travel routes
  const travelRoutes = [
    [destinations[0].coordinates, destinations[3].coordinates], // Paris to Barcelona
    [destinations[3].coordinates, destinations[1].coordinates], // Barcelona to Rome
    [destinations[1].coordinates, destinations[2].coordinates], // Rome to Amsterdam
  ]

  const handleMarkerClick = (destination: Destination) => {
    setSelectedDestination(destination)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedDestination(null)
  }

  const visitedCount = destinations.filter(d => d.status === 'visited').length
  const plannedCount = destinations.filter(d => d.status === 'planned').length
  const countriesCount = new Set(destinations.map(d => d.country)).size

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-100">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute top-8 left-8 z-20 text-white"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
          The Adventures of Billy and Bobby
        </h1>
        <p className="text-xl md:text-2xl opacity-90 drop-shadow-lg max-w-2xl">
          Follow our journey across Europe! Click on the pins to see our stories, photos, and videos from each destination.
        </p>
        <div className="mt-6 flex items-center space-x-6 text-lg">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span>Visited</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span>Current</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
            <span>Planned</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Corner */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg z-20"
      >
        <h3 className="font-bold text-gray-800 mb-4">Journey Stats</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Cities Visited:</span>
            <span className="font-semibold text-green-600">{visitedCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Cities Planned:</span>
            <span className="font-semibold text-blue-600">{plannedCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Countries:</span>
            <span className="font-semibold text-purple-600">{countriesCount}</span>
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
            weight={3}
            opacity={0.7}
            dashArray="10, 10"
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
  )
} 