'use client';

import { motion } from 'framer-motion';
import { Menu, Calendar, MapPin, Globe } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
  onTimelineClick: () => void;
}

export default function Header({ onMenuClick, onTimelineClick }: HeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute top-0 left-0 right-0 z-30 p-6"
    >
      <div className="flex items-center justify-between">
        {/* Logo and Title */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center space-x-3"
        >
          <div className="relative">
            <Globe className="w-8 h-8 text-gold-400" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-2 border-gold-400/30 rounded-full"
            />
          </div>
          <div>
            <h1 className="text-2xl font-playfair font-bold text-white">
              The Adventures of
            </h1>
            <h2 className="text-3xl font-playfair font-bold text-gradient">
              Billy & Bobby
            </h2>
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.nav
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="hidden md:flex items-center space-x-6"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onTimelineClick}
            className="flex items-center space-x-2 text-white hover:text-gold-400 transition-colors duration-300"
          >
            <Calendar className="w-5 h-5" />
            <span className="font-medium">Timeline</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 text-white hover:text-gold-400 transition-colors duration-300"
          >
            <MapPin className="w-5 h-5" />
            <span className="font-medium">Journey</span>
          </motion.button>
        </motion.nav>

        {/* Mobile Menu Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onMenuClick}
          className="md:hidden glass-morphism-strong p-3 rounded-xl text-white hover:bg-white/30 transition-all duration-300"
        >
          <Menu className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-white/80 text-center mt-4 font-medium"
      >
        Exploring Europe, one adventure at a time
      </motion.p>
    </motion.header>
  );
} 