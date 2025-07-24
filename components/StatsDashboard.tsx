'use client';

import { motion } from 'framer-motion';
import { MapPin, Globe, Calendar, Star, TrendingUp, Users, Map, Flag } from 'lucide-react';
import { Stats } from '../types';

interface StatsDashboardProps {
  stats: Stats;
}

export default function StatsDashboard({ stats }: StatsDashboardProps) {
  const statItems = [
    {
      icon: MapPin,
      label: 'Total Locations',
      value: stats.totalLocations,
      color: 'text-blue-400'
    },
    {
      icon: Globe,
      label: 'Countries Visited',
      value: stats.countriesVisited,
      color: 'text-green-400'
    },
    {
      icon: Calendar,
      label: 'Total Days',
      value: stats.totalDays,
      color: 'text-purple-400'
    },
    {
      icon: Star,
      label: 'Avg Rating',
      value: stats.averageRating.toFixed(1),
      color: 'text-yellow-400'
    },
    {
      icon: TrendingUp,
      label: 'Distance (km)',
      value: stats.totalDistance.toLocaleString(),
      color: 'text-red-400'
    },
    {
      icon: Users,
      label: 'Visited',
      value: stats.visitedLocations,
      color: 'text-emerald-400'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="glass-morphism-strong rounded-2xl p-6 backdrop-blur-lg"
    >
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {statItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * index }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-2">
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {item.value}
            </div>
            <div className="text-xs text-white/70 font-medium">
              {item.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Total Cost */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-4 pt-4 border-t border-white/20"
      >
        <div className="text-center">
          <div className="text-sm text-white/70 mb-1">Total Cost</div>
          <div className="text-xl font-bold text-gold-400">
            {stats.totalCost}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 