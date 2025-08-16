'use client';

import { MapClient } from './MapClient';

interface MapMiniProps {
  posts: Array<{
    id: string;
    slug: string;
    title?: string;
    caption?: string;
    city?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
    media: Array<{
      id: string;
      type: 'IMAGE' | 'VIDEO';
      cldId: string;
      width?: number;
      height?: number;
    }>;
  }>;
}

export function MapMini({ posts }: MapMiniProps) {
  const postsWithLocation = posts.filter(p => p.latitude && p.longitude);

  if (postsWithLocation.length === 0) {
    return (
      <div className="bg-gray-100 rounded-2xl p-8 text-center">
        <p className="text-gray-500 text-lg">
          No location data yet. Posts with coordinates will appear here!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold mb-2">Our Journey Map</h2>
        <p className="text-muted-foreground">
          {postsWithLocation.length} location{postsWithLocation.length !== 1 ? 's' : ''} visited
        </p>
      </div>
      <div className="h-64">
        <MapClient 
          posts={postsWithLocation} 
          className="h-full"
        />
      </div>
    </div>
  );
}
