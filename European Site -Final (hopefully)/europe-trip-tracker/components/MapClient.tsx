'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';

// Fix for default markers in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapClientProps {
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
  onPostClick?: (post: any) => void;
  className?: string;
}

export function MapClient({ posts, onPostClick, className }: MapClientProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current, {
      center: [48.8566, 2.3522], // Paris
      zoom: 4,
      zoomControl: true,
      attributionControl: true,
    });

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Create marker cluster group
    const markers = L.markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
    });

    // Add markers for posts with coordinates
    posts.forEach((post) => {
      if (post.latitude && post.longitude) {
        const marker = L.marker([post.latitude, post.longitude]);
        
        // Create popup content
        const popupContent = document.createElement('div');
        popupContent.className = 'p-2 min-w-[200px]';
        
        const title = document.createElement('h3');
        title.className = 'font-semibold text-sm mb-2';
        title.textContent = post.title || 'Untitled Post';
        
        const caption = document.createElement('p');
        caption.className = 'text-xs text-gray-600 mb-2 line-clamp-2';
        caption.textContent = post.caption || '';
        
        const location = document.createElement('p');
        location.className = 'text-xs text-gray-500';
        location.textContent = post.city && post.country 
          ? `${post.city}, ${post.country}`
          : post.city || post.country || 'Unknown Location';
        
        const viewButton = document.createElement('button');
        viewButton.className = 'mt-2 w-full bg-blue-500 text-white text-xs px-3 py-1 rounded hover:bg-blue-600 transition-colors';
        viewButton.textContent = 'View Post';
        viewButton.onclick = () => {
          if (onPostClick) {
            onPostClick(post);
          }
        };
        
        popupContent.appendChild(title);
        popupContent.appendChild(caption);
        popupContent.appendChild(location);
        popupContent.appendChild(viewButton);
        
        marker.bindPopup(popupContent);
        markers.addLayer(marker);
      }
    });

    map.addLayer(markers);
    mapInstanceRef.current = map;

    // Fit bounds if we have markers
    if (posts.some(p => p.latitude && p.longitude)) {
      const bounds = L.latLngBounds(
        posts
          .filter(p => p.latitude && p.longitude)
          .map(p => [p.latitude!, p.longitude!])
      );
      map.fitBounds(bounds, { padding: [20, 20] });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isClient, posts, onPostClick]);

  if (!isClient) {
    return (
      <div className={`${className} bg-gray-100 animate-pulse`}>
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-gray-500">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      className={`${className} w-full h-full min-h-[400px] rounded-lg overflow-hidden`}
    />
  );
}
