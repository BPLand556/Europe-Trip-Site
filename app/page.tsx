'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Globe, Calendar, Star, TrendingUp, Users, Map, Menu, X, Search, Filter } from 'lucide-react';
import { locations, journeyPhases, stats } from '../data/locations';
import { Location, FilterOptions } from '../types';
import Header from '../components/Header';
import StatsDashboard from '../components/StatsDashboard';
import LocationModal from '../components/LocationModal';
import FilterPanel from '../components/FilterPanel';
import JourneyTimeline from '../components/JourneyTimeline';

// Dynamically import the map component to avoid SSR issues
const InteractiveMap = dynamic(() => import('../components/InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-900 to-primary-950">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-400 mx-auto mb-4"></div>
        <p className="text-lg font-medium">Loading your adventure map...</p>
      </div>
    </div>
  )
});

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>(locations);
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    phases: [],
    visited: null,
    current: null,
    planned: null,
    cost: [],
    season: [],
    rating: 0
  });

  const handleLocationClick = (location: Location) => {
    setSelectedLocation(location);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLocation(null);
  };

  const applyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    
    let filtered = locations;
    
    if (newFilters.categories.length > 0) {
      filtered = filtered.filter(location => 
        newFilters.categories.includes(location.category)
      );
    }
    
    if (newFilters.visited !== null) {
      filtered = filtered.filter(location => location.visited === newFilters.visited);
    }
    
    if (newFilters.current !== null) {
      filtered = filtered.filter(location => location.current === newFilters.current);
    }
    
    if (newFilters.planned !== null) {
      filtered = filtered.filter(location => location.planned === newFilters.planned);
    }
    
    if (newFilters.cost.length > 0) {
      filtered = filtered.filter(location => 
        newFilters.cost.includes(location.cost)
      );
    }
    
    if (newFilters.season.length > 0) {
      filtered = filtered.filter(location => 
        newFilters.season.includes(location.season)
      );
    }
    
    if (newFilters.rating > 0) {
      filtered = filtered.filter(location => location.rating >= newFilters.rating);
    }
    
    setFilteredLocations(filtered);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800">
      {/* Header */}
      <Header 
        onMenuClick={() => setIsFilterPanelOpen(true)}
        onTimelineClick={() => setIsTimelineOpen(true)}
      />

      {/* Main Content */}
      <div className="relative h-screen">
        {/* Interactive Map */}
        <div className="absolute inset-0 z-10">
          <InteractiveMap 
            locations={filteredLocations}
            onLocationClick={handleLocationClick}
            journeyPhases={journeyPhases}
          />
        </div>

        {/* Overlay Controls */}
        <div className="absolute top-4 right-4 z-20 space-y-3">
          {/* Filter Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFilterPanelOpen(true)}
            className="glass-morphism-strong p-3 rounded-xl text-white hover:bg-white/30 transition-all duration-300"
          >
            <Filter className="w-5 h-5" />
          </motion.button>

          {/* Timeline Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsTimelineOpen(true)}
            className="glass-morphism-strong p-3 rounded-xl text-white hover:bg-white/30 transition-all duration-300"
          >
            <Calendar className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Stats Dashboard */}
        <div className="absolute bottom-4 left-4 z-20">
          <StatsDashboard stats={stats} />
        </div>

        {/* Search Bar */}
        <div className="absolute top-4 left-4 z-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="glass-morphism-strong rounded-xl p-3 flex items-center space-x-3 min-w-[300px]">
              <Search className="w-5 h-5 text-white/70" />
              <input
                type="text"
                placeholder="Search locations..."
                className="bg-transparent text-white placeholder-white/70 outline-none flex-1"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {isFilterPanelOpen && (
          <FilterPanel
            filters={filters}
            onApplyFilters={applyFilters}
            onClose={() => setIsFilterPanelOpen(false)}
            journeyPhases={journeyPhases}
          />
        )}
      </AnimatePresence>

      {/* Journey Timeline */}
      <AnimatePresence>
        {isTimelineOpen && (
          <JourneyTimeline
            phases={journeyPhases}
            locations={locations}
            onLocationClick={handleLocationClick}
            onClose={() => setIsTimelineOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Location Modal */}
      <AnimatePresence>
        {isModalOpen && selectedLocation && (
          <LocationModal
            location={selectedLocation}
            onClose={closeModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
} 