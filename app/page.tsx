'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the map component to prevent SSR issues
const InteractiveMap = dynamic(() => import('../components/InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full mx-auto mb-4 animate-spin" />
        <p className="text-white text-lg font-medium">Loading your adventure map...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  const titleRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const vh = window.innerHeight;
      const rate = scrolled * -0.5;
      if (titleRef.current) {
        titleRef.current.style.transform = `translateY(${rate}px)`;
        titleRef.current.style.opacity = String(1 - (scrolled / vh));
      }
      if (mapRef.current) {
        mapRef.current.style.opacity = String(0.3 + Math.min(1, (scrolled / vh)) * 0.7);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="app-container relative min-h-screen w-full">
      {/* Map is always visible, fixed background */}
      <div
        className="map-container"
        ref={mapRef}
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 1, transition: 'opacity 0.4s' }}
      >
        <InteractiveMap />
      </div>

      {/* Title overlay that fades out */}
      <div
        className="title-section flex flex-col items-center justify-center w-full h-screen relative z-20 overflow-hidden"
        ref={titleRef}
      >
        {/* Animated floating icons */}
        <div className="floating-icons absolute top-0 left-0 w-full flex justify-center gap-8 pt-12 pointer-events-none">
          <span className="icon plane animate-float text-4xl md:text-5xl">✈️</span>
          <span className="icon camera animate-float2 text-4xl md:text-5xl">📸</span>
          <span className="icon map animate-float3 text-4xl md:text-5xl">🗺️</span>
          <span className="icon backpack animate-float4 text-4xl md:text-5xl">🎒</span>
        </div>
        <div className="main-content flex flex-col items-center justify-center h-full w-full">
          <h1 className="main-title text-center mb-6">The Adventures of Billy and Bobby</h1>
          <p className="subtitle text-white text-xl md:text-2xl mb-8 font-light text-center drop-shadow-lg">Join us as we explore the magic of Europe</p>
          <div className="stats-preview flex gap-6 md:gap-10 text-lg md:text-xl text-white/90 mb-8">
            <span className="flex items-center gap-2">🏛️ <span>4 Countries</span></span>
            <span className="flex items-center gap-2">🌆 <span>8 Cities</span></span>
            <span className="flex items-center gap-2">📸 <span>200+ Photos</span></span>
          </div>
        </div>
        {/* Scroll indicator */}
        <div className="scroll-indicator absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="scroll-text text-white/80 mb-1 animate-pulse">Scroll to explore our journey</div>
          <div className="scroll-arrow text-3xl text-white animate-bounce">↓</div>
        </div>
      </div>

      {/* Spacer to allow scrolling */}
      <div style={{ height: '100vh', position: 'relative', zIndex: 2 }}></div>
    </div>
  );
} 