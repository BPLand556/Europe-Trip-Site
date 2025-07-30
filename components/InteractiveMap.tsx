'use client'

import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';

// Fix Leaflet default marker icons (REQUIRED)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Zoom Controls Component
const ZoomControls = () => {
  const map = useMap();
  
  const handleZoomIn = (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    map.zoomIn();
  };
  
  const handleZoomOut = (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    map.zoomOut();
  };
  
  return (
    <div style={{
      position: 'absolute',
      bottom: '20px',
      right: '20px',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'white',
      borderRadius: '4px',
      boxShadow: '0 1px 5px rgba(0,0,0,0.4)',
      overflow: 'hidden'
    }}>
      <button
        onMouseDown={handleZoomIn}
        onTouchStart={handleZoomIn}
        style={{
          width: '30px',
          height: '30px',
          border: 'none',
          backgroundColor: 'white',
          cursor: 'pointer',
          fontSize: '18px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid #ccc'
        }}
      >
        +
      </button>
      <button
        onMouseDown={handleZoomOut}
        onTouchStart={handleZoomOut}
        style={{
          width: '30px',
          height: '30px',
          border: 'none',
          backgroundColor: 'white',
          cursor: 'pointer',
          fontSize: '18px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        −
      </button>
    </div>
  );
};

// Hamburger Menu Component
const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 1000,
          width: '40px',
          height: '40px',
          backgroundColor: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          boxShadow: '0 1px 5px rgba(0,0,0,0.4)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '3px'
        }}
      >
        <div style={{ width: '20px', height: '2px', backgroundColor: '#333' }}></div>
        <div style={{ width: '20px', height: '2px', backgroundColor: '#333' }}></div>
        <div style={{ width: '20px', height: '2px', backgroundColor: '#333' }}></div>
      </button>
      
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '70px',
          left: '20px',
          zIndex: 1000,
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '4px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
          minWidth: '200px'
        }}>
          <h3>Menu</h3>
          <p>About our journey</p>
          <p>Contact us</p>
        </div>
      )}
    </>
  );
};

interface Destination {
  id: number;
  name: string;
  position: LatLngExpression;
}

// Main Map Component
const TravelMap = () => {
  const [selectedLocation, setSelectedLocation] = useState<Destination | null>(null);
  
  // Sample destinations (replace with your actual data)
  const destinations: Destination[] = [
    { id: 1, name: 'Paris', position: [48.8566, 2.3522] },
    { id: 2, name: 'Amsterdam', position: [52.3676, 4.9041] },
    { id: 3, name: 'Barcelona', position: [41.3851, 2.1734] },
    { id: 4, name: 'Rome', position: [41.9028, 12.4964] }
  ];
  
  const handleMarkerClick = (destination: Destination) => {
    console.log('Marker clicked:', destination.name);
    setSelectedLocation(destination);
  };
  
  return (
    <div style={{ height: '100vh', width: '100vw', position: 'relative' }}>
      <MapContainer
        center={[50.0, 10.0]}
        zoom={5}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        scrollWheelZoom={true}
        dragging={true}
        touchZoom={true}
        doubleClickZoom={true}
        boxZoom={true}
        keyboard={true}
      >
        {/* Map Tiles - WORKING ENGLISH TILES */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={19}
        />
        
        {/* Custom Zoom Controls */}
        <ZoomControls />
        
        {/* Destination Markers */}
        {destinations.map((destination) => (
          <Marker
            key={destination.id}
            position={destination.position}
            eventHandlers={{
              click: () => handleMarkerClick(destination)
            }}
          >
            <Popup>
              <div>
                <h3>{destination.name}</h3>
                <p>Click for more details</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Hamburger Menu */}
      <HamburgerMenu />
      
      {/* Modal for selected location */}
      {selectedLocation && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          zIndex: 2000,
          minWidth: '300px'
        }}>
          <h2>{selectedLocation.name}</h2>
          <p>Details about our visit to {selectedLocation.name}</p>
          <button 
            onClick={() => setSelectedLocation(null)}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default TravelMap; 