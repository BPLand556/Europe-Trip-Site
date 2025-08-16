'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Search, X } from 'lucide-react';
import { searchLocation, LocationInfo } from '@/lib/location';
import { cn } from '@/lib/utils';

interface LocationPickerProps {
  value?: LocationInfo;
  onChange: (location: LocationInfo | undefined) => void;
  className?: string;
}

export function LocationPicker({ value, onChange, className }: LocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationInfo[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await searchLocation(searchQuery);
      setSearchResults(results);
      setShowResults(true);
    } catch (error) {
      console.error('Location search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectLocation = (location: LocationInfo) => {
    onChange(location);
    setSearchQuery('');
    setShowResults(false);
  };

  const handleClearLocation = () => {
    onChange(undefined);
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    if (value) {
      setSearchQuery(
        [value.city, value.country].filter(Boolean).join(', ')
      );
    }
  }, [value]);

  return (
    <div className={cn('relative', className)}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search for a city or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-10"
          />
        </div>
        <Button
          onClick={handleSearch}
          disabled={isSearching || !searchQuery.trim()}
          size="sm"
        >
          {isSearching ? 'Searching...' : 'Search'}
        </Button>
        {value && (
          <Button
            onClick={handleClearLocation}
            variant="outline"
            size="sm"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Search Results */}
      {showResults && searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
          {searchResults.map((location, index) => (
            <button
              key={index}
              onClick={() => handleSelectLocation(location)}
              className="w-full p-3 text-left hover:bg-gray-50 border-b last:border-b-0 flex items-center gap-3"
            >
              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div>
                <div className="font-medium">
                  {location.city || 'Unknown City'}
                </div>
                {location.country && (
                  <div className="text-sm text-gray-500">
                    {location.country}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Current Location Display */}
      {value && (
        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-blue-500" />
            <span className="font-medium">
              {value.city || 'Unknown City'}
              {value.city && value.country && ', '}
              {value.country}
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {value.latitude.toFixed(4)}, {value.longitude.toFixed(4)}
          </div>
        </div>
      )}
    </div>
  );
}
