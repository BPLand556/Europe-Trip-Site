'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ChevronDown, MapPin, Camera, Heart } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import the map component to prevent SSR issues
const InteractiveMap = dynamic(() => import('../components/InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"
        />
        <p className="text-white text-lg font-medium">Loading your adventure map...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  const [showMap, setShowMap] = useState(false);
  const { scrollY } = useScroll();
  
  // Transform scroll progress to opacity and position values
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroY = useTransform(scrollY, [0, 300], [0, -100]);
  const mapOpacity = useTransform(scrollY, [150, 450], [0, 1]);
  const mapScale = useTransform(scrollY, [150, 450], [0.8, 1]);
  
  // Show map after scroll threshold
  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      if (latest > 200) {
        setShowMap(true);
      }
    });
    return unsubscribe;
  }, [scrollY]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Hero Section */}
      <motion.div 
        className="fixed inset-0 z-20 flex items-center justify-center"
        style={{ opacity: heroOpacity, y: heroY }}
      >
        <div className="text-center text-white px-6 max-w-4xl mx-auto">
          <motion.h1 
            className="text-6xl md:text-8xl font-bold mb-6 font-serif text-shadow"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            The Adventures of Billy and Bobby
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl mb-8 opacity-90 font-light"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          >
            Follow our journey across Europe through an interactive map filled with stories, photos, and memories
          </motion.p>
          
          <motion.div 
            className="flex items-center justify-center space-x-8 text-lg opacity-80"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          >
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>12 Cities</span>
            </div>
            <div className="flex items-center space-x-2">
              <Camera className="w-5 h-5" />
              <span>500+ Photos</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5" />
              <span>Countless Memories</span>
            </div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1, ease: "easeOut" }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-white text-center"
          >
            <ChevronDown className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm opacity-80">Scroll to explore</p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Map Section */}
      <motion.div 
        className="relative w-full h-screen"
        style={{ 
          opacity: mapOpacity, 
          scale: mapScale,
          transformOrigin: 'center center'
        }}
      >
        <AnimatePresence>
          {showMap && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full"
            >
              <InteractiveMap />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Spacer for scroll */}
      <div className="h-screen"></div>
    </div>
  );
} 