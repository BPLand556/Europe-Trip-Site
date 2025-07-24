'use client';

import { motion } from 'framer-motion';
import { X, Filter, MapPin, Calendar, Star, DollarSign } from 'lucide-react';
import { FilterOptions, JourneyPhase } from '../types';

interface FilterPanelProps {
  filters: FilterOptions;
  onApplyFilters: (filters: FilterOptions) => void;
  onClose: () => void;
  journeyPhases: JourneyPhase[];
}

export default function FilterPanel({ filters, onApplyFilters, onClose, journeyPhases }: FilterPanelProps) {
  const categories = ['city', 'landmark', 'nature', 'culture', 'food'];
  const costs = ['budget', 'moderate', 'luxury'];
  const seasons = ['spring', 'summer', 'autumn', 'winter', 'all'];

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    onApplyFilters(newFilters);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-40 overflow-y-auto"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-playfair font-bold text-gray-900">Filters</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Status Filters */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Status
          </h3>
          <div className="space-y-2">
            {[
              { label: 'Visited', value: true, key: 'visited' },
              { label: 'Current', value: true, key: 'current' },
              { label: 'Planned', value: true, key: 'planned' }
            ].map((item) => (
              <label key={item.key} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={filters[item.key as keyof FilterOptions] === item.value}
                  onChange={(e) => handleFilterChange(item.key as keyof FilterOptions, e.target.checked ? item.value : null)}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-gray-700">{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Categories</h3>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((category) => (
              <label key={category} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(category)}
                  onChange={(e) => {
                    const newCategories = e.target.checked
                      ? [...filters.categories, category]
                      : filters.categories.filter(c => c !== category);
                    handleFilterChange('categories', newCategories);
                  }}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-gray-700 capitalize">{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Journey Phases */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Journey Phases
          </h3>
          <div className="space-y-2">
            {journeyPhases.map((phase) => (
              <label key={phase.id} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={filters.phases.includes(phase.id)}
                  onChange={(e) => {
                    const newPhases = e.target.checked
                      ? [...filters.phases, phase.id]
                      : filters.phases.filter(p => p !== phase.id);
                    handleFilterChange('phases', newPhases);
                  }}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-gray-700">{phase.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Cost */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Cost
          </h3>
          <div className="space-y-2">
            {costs.map((cost) => (
              <label key={cost} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={filters.cost.includes(cost)}
                  onChange={(e) => {
                    const newCosts = e.target.checked
                      ? [...filters.cost, cost]
                      : filters.cost.filter(c => c !== cost);
                    handleFilterChange('cost', newCosts);
                  }}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-gray-700 capitalize">{cost}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Season */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Season</h3>
          <div className="grid grid-cols-2 gap-2">
            {seasons.map((season) => (
              <label key={season} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.season.includes(season)}
                  onChange={(e) => {
                    const newSeasons = e.target.checked
                      ? [...filters.season, season]
                      : filters.season.filter(s => s !== season);
                    handleFilterChange('season', newSeasons);
                  }}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-gray-700 capitalize">{season}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <Star className="w-5 h-5 mr-2" />
            Minimum Rating
          </h3>
          <input
            type="range"
            min="0"
            max="5"
            step="0.5"
            value={filters.rating}
            onChange={(e) => handleFilterChange('rating', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>0</span>
            <span>{filters.rating}</span>
            <span>5</span>
          </div>
        </div>

        {/* Clear Filters */}
        <button
          onClick={() => onApplyFilters({
            categories: [],
            phases: [],
            visited: null,
            current: null,
            planned: null,
            cost: [],
            season: [],
            rating: 0
          })}
          className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Clear All Filters
        </button>
      </div>
    </motion.div>
  );
} 