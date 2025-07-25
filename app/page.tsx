'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the map component to prevent SSR issues
const InteractiveMap = dynamic(() => import('../components/InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-600 rounded-full mx-auto mb-4 animate-spin" />
        <p className="text-gray-600 text-lg font-medium">Loading your adventure map...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  const titleRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [overlayPointerEvents, setOverlayPointerEvents] = useState<'auto' | 'none'>('auto');

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const vh = window.innerHeight;
      const scrollProgress = Math.min(scrolled / vh, 1);
      
      if (titleRef.current) {
        // Title fades out completely
        titleRef.current.style.opacity = String(1 - scrollProgress);
        titleRef.current.style.transform = `translateY(-${scrollProgress * 50}px)`;
        // Only set pointer-events: none after scroll starts
        if (scrollProgress > 0.1) {
          setOverlayPointerEvents('none');
        } else {
          setOverlayPointerEvents('auto');
        }
      }
      
      if (mapRef.current) {
        // Map becomes FULLY BOLD (not faded)
        mapRef.current.style.opacity = String(0.3 + (scrollProgress * 0.7)); // Goes to 1.0
        // CRITICAL: Enable map interactions when scrolling starts
        if (scrollProgress > 0.1) {
          mapRef.current.style.pointerEvents = 'auto';
          mapRef.current.style.zIndex = '10';
        }
        // Remove any filters when fully revealed
        if (scrollProgress > 0.95) {
          mapRef.current.style.filter = 'none';
          mapRef.current.style.opacity = '1';
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="app-container relative min-h-screen w-full">
      {/* Map is always visible, fixed background - CRITICAL: Enable interactions */}
      <div
        className="map-container"
        ref={mapRef}
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100vw', 
          height: '100vh', 
          zIndex: 1, 
          transition: 'opacity 0.4s',
          pointerEvents: 'auto'
        }}
      >
        <InteractiveMap />
      </div>

      {/* Classic elegant title overlay - position: fixed, full viewport, pointer-events toggled by scroll */}
      <div
        className="title-section"
        ref={titleRef}
        style={{ 
          background: '#FFFFFF',
          height: '100vh',
          width: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 20,
          pointerEvents: overlayPointerEvents
        }}
      >
        <div className="title-content">
          <h1 className="main-title">
            THE ADVENTURES OF
            <br />
            BILLY AND BOBBY
          </h1>
          <p className="subtitle">A European Journey</p>
          <div className="scroll-indicator">
            <div className="scroll-line"></div>
            <span className="scroll-text">Scroll</span>
          </div>
        </div>
      </div>

      {/* Spacer to allow scrolling */}
      <div style={{ height: '120vh', position: 'relative', zIndex: 2 }}></div>
    </div>
  );
} 