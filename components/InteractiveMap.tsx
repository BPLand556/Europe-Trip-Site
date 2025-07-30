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

// FIXED ZOOM CONTROLS - MUST be inside MapContainer
const ZoomControls = () => {
  const map = useMap()
  
  const handleZoomIn = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Zoom in clicked, map:', map)
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
    console.log('Zoom out clicked, map:', map)
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
    <div 
      className="zoom-controls"
      style={{
        position: 'absolute',
        bottom: '30px',
        right: '30px',
        zIndex: 1000,
        pointerEvents: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        borderRadius: '6px',
        overflow: 'hidden'
      }}
    >
      <button
        onMouseDown={handleZoomIn}
        onTouchStart={handleZoomIn}
        style={{
          width: '40px',
          height: '40px',
          background: 'white',
          border: 'none',
          fontSize: '18px',
          fontWeight: 'bold',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#333',
          userSelect: 'none',
          pointerEvents: 'auto'
        }}
      >
        +
      </button>
      <button
        onMouseDown={handleZoomOut}
        onTouchStart={handleZoomOut}
        style={{
          width: '40px',
          height: '40px',
          background: 'white',
          border: 'none',
          fontSize: '18px',
          fontWeight: 'bold',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#333',
          userSelect: 'none',
          pointerEvents: 'auto'
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
        title: 'Sunrise at the Eiffel Tower',
        date: 'September 15, 2025',
        content: 'Waking up at 5 AM was worth every second. The golden light hitting the iron lattice was magical.',
        type: 'story'
      },
      {
        title: 'Louvre Museum Adventure',
        date: 'September 16, 2025',
        content: 'Spent 6 hours getting lost in the world\'s largest art museum. Mona Lisa was smaller than expected!',
        type: 'story'
      }
    ]
  },
  {
    id: 'london',
    name: 'London',
    country: 'United Kingdom',
    coordinates: [51.5074, -0.1278],
    status: 'visited',
    visitDate: 'September 20, 2025',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop',
    description: 'Double-decker buses, red phone boxes, and the iconic Big Ben. London\'s charm is undeniable.',
    highlights: ['Big Ben', 'Tower Bridge', 'British Museum', 'Westminster Abbey'],
    stories: [
      {
        title: 'Tea Time at The Ritz',
        date: 'September 20, 2025',
        content: 'Fancy afternoon tea with scones and clotted cream. Felt like royalty for an hour!',
        type: 'story'
      }
    ]
  },
  {
    id: 'berlin',
    name: 'Berlin',
    country: 'Germany',
    coordinates: [52.5200, 13.4050],
    status: 'visited',
    visitDate: 'September 25, 2025',
    image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800&h=600&fit=crop',
    description: 'A city of contrasts - from the historic Brandenburg Gate to the vibrant street art scene.',
    highlights: ['Brandenburg Gate', 'Berlin Wall Memorial', 'Museum Island', 'East Side Gallery'],
    stories: [
      {
        title: 'Walking the Berlin Wall',
        date: 'September 25, 2025',
        content: 'Touched history at the East Side Gallery. The murals tell stories of hope and freedom.',
        type: 'story'
      }
    ]
  },
  {
    id: 'prague',
    name: 'Prague',
    country: 'Czech Republic',
    coordinates: [50.0755, 14.4378],
    status: 'visited',
    visitDate: 'September 30, 2025',
    image: 'https://images.unsplash.com/photo-1519676860710-e6f2cb6ee3ed?w=800&h=600&fit=crop',
    description: 'The Golden City with its fairytale architecture and charming cobblestone streets.',
    highlights: ['Charles Bridge', 'Prague Castle', 'Old Town Square', 'Astronomical Clock'],
    stories: [
      {
        title: 'Sunset from Prague Castle',
        date: 'September 30, 2025',
        content: 'Watched the sun set over the red rooftops. The view from the castle was absolutely breathtaking.',
        type: 'story'
      }
    ]
  },
  {
    id: 'barcelona',
    name: 'Barcelona',
    country: 'Spain',
    coordinates: [41.3851, 2.1734],
    status: 'current',
    visitDate: 'October 5, 2025',
    image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=600&fit=crop',
    description: 'Currently exploring the vibrant Catalan capital with its stunning architecture and Mediterranean charm.',
    highlights: ['Sagrada Familia', 'Park Güell', 'La Rambla', 'Gothic Quarter'],
    stories: [
      {
        title: 'Gaudí\'s Masterpiece',
        date: 'October 5, 2025',
        content: 'The Sagrada Familia is even more impressive in person. The stained glass creates a rainbow inside!',
        type: 'story'
      }
    ]
  }
]

// Calculate travel routes between visited and current destinations
const visitedAndCurrent = destinations.filter(d => d.status === 'visited' || d.status === 'current')
const travelRoutes: LatLngExpression[][] = []

for (let i = 0; i < visitedAndCurrent.length - 1; i++) {
  const current = visitedAndCurrent[i]
  const next = visitedAndCurrent[i + 1]
  travelRoutes.push([current.coordinates, next.coordinates])
}

// Create custom pin icons
const createCustomIcon = (status: string) => {
  const color = status === 'current' ? '#2563eb' : '#10b981'
  
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="${color}" stroke="white" stroke-width="2"/>
        <circle cx="12" cy="12" r="4" fill="white"/>
      </svg>
    `)}`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  })
}

// Elegant location modal
const LocationModal = ({ destination, isOpen, onClose }: { destination: Destination | null, isOpen: boolean, onClose: () => void }) => {
  if (!isOpen || !destination) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl overflow-hidden max-w-2xl w-full max-h-[80vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Hero Image */}
          <div className="relative h-64">
            <img
              src={destination.image}
              alt={destination.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <h2 className="text-2xl font-bold">{destination.name}</h2>
              <p className="text-sm opacity-90">{destination.country}</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{destination.visitDate}</span>
            </div>
            
            <p className="text-gray-700 mb-4">{destination.description}</p>
            
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Highlights:</h3>
              <div className="flex flex-wrap gap-2">
                {destination.highlights.map((highlight, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              See Full Story
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Hamburger menu component
const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="absolute top-4 left-4 z-40">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>
      
      {isOpen && (
        <div className="absolute top-12 left-0 bg-white rounded-lg shadow-lg p-4 min-w-[200px]">
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
              <Star className="w-4 h-4" />
              <span>Favorites</span>
            </div>
            <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
              <Clock className="w-4 h-4" />
              <span>Timeline</span>
            </div>
            <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
              <Users className="w-4 h-4" />
              <span>Share</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Main component
export default function BillyBobbyTravelMap() {
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const mapRef = useRef<any>(null)

  const handleMarkerClick = (destination: Destination) => {
    console.log('Marker clicked:', destination.name)
    setSelectedDestination(destination)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedDestination(null)
  }

  // Force enable all map interactions
  useEffect(() => {
    const enableMapInteractions = () => {
      if (mapRef.current) {
        const map = mapRef.current
        
        try {
          // Enable all interactions
          map.dragging.enable()
          map.touchZoom.enable()
          map.doubleClickZoom.enable()
          map.scrollWheelZoom.enable()
          map.boxZoom.enable()
          map.keyboard.enable()
          
          console.log('Map interactions enabled successfully')
          console.log('Map object:', map)
          console.log('Map dragging:', map.dragging)
          console.log('Map touchZoom:', map.touchZoom)
          
          // Test if interactions are working
          console.log('Dragging enabled:', map.dragging.enabled())
          console.log('Touch zoom enabled:', map.touchZoom.enabled())
          console.log('Scroll wheel zoom enabled:', map.scrollWheelZoom.enabled())
          
          // Add event listeners to test interactions
          map.on('dragstart', () => console.log('Map drag started'))
          map.on('drag', () => console.log('Map dragging'))
          map.on('dragend', () => console.log('Map drag ended'))
          map.on('zoomstart', () => console.log('Map zoom started'))
          map.on('zoom', () => console.log('Map zooming'))
          map.on('zoomend', () => console.log('Map zoom ended'))
          
        } catch (error) {
          console.error('Error enabling map interactions:', error)
        }
      }
    }

    // Enable immediately and also after delays to ensure map is ready
    enableMapInteractions()
    setTimeout(enableMapInteractions, 100)
    setTimeout(enableMapInteractions, 500)
    setTimeout(enableMapInteractions, 1000)
  }, [])

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-100">
      {/* Map */}
      <MapContainer
        ref={mapRef}
        center={[54.5, 15.2]} // Center of Europe
        zoom={5}
        className="w-full h-full z-10"
        style={{ 
          height: '100vh', 
          width: '100vw',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 1,
          pointerEvents: 'auto'
        }}
        zoomControl={false}
        dragging={true}           // Explicitly enable
        touchZoom={true}          // Explicitly enable
        scrollWheelZoom={true}    // Explicitly enable
        doubleClickZoom={true}    // Explicitly enable
        boxZoom={true}            // Explicitly enable
        keyboard={true}           // Explicitly enable
        attributionControl={false}
        maxBounds={europeBounds}
        minZoom={4}
        maxZoom={12}
        maxBoundsViscosity={1.0}
      >
        {/* English-only tile layer */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors &copy; CARTO'
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
              click: (e) => {
                console.log('Pin clicked:', destination.name)
                e.originalEvent.stopPropagation()
                handleMarkerClick(destination)
              },
              mouseover: () => {
                console.log('Pin hovered:', destination.name)
              }
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

        {/* Working zoom controls - MUST be inside MapContainer */}
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
  )
} 