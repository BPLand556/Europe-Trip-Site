import React, { useRef, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  ZoomControl
} from 'react-leaflet';
import L from 'leaflet';
import { destinations } from './data.js';

// Fix default Leaflet icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function MapView() {
  const mapRef = useRef();
  const [openIdx, setOpenIdx] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const trail = destinations.map(d => d.coords);

  const flyToStop = (coords, i) => {
    if (!mapRef.current) return;
    mapRef.current.flyTo(coords, 6, { duration: 1 });
    setOpenIdx(i);
    setMenuOpen(false);
  };

  return (
    <div className="map-wrapper">
      <button
        className="hamburger"
        onClick={() => setMenuOpen(o => !o)}
      >
        ☰
      </button>

      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <ul>
          {destinations.map((d, i) => (
            <li key={i} onClick={() => flyToStop(d.coords, i)}>
              <img src={d.img} alt={d.name} />
              <span>{d.name}</span>
            </li>
          ))}
        </ul>
      </aside>

      <MapContainer
        center={[50, 10]}
        zoom={5}
        style={{ width: "100%", height: "100%" }}
        whenCreated={map => (mapRef.current = map)}
        zoomControl={false}
        dragging={true}
        touchZoom={true}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        boxZoom={true}
        keyboard={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; CARTO &copy; OpenStreetMap'
        />
        <ZoomControl position="bottomright" />
        <Polyline positions={trail} color="#1978c8" weight={4} />

        {destinations.map((d, i) => (
          <Marker
            key={i}
            position={d.coords}
            eventHandlers={{ click: () => setOpenIdx(i) }}
          >
            {openIdx === i && (
              <Popup onClose={() => setOpenIdx(null)}>
                <h3>{d.name}</h3>
                <img
                  src={d.img}
                  alt={d.name}
                  style={{ width: "100%", borderRadius: "4px" }}
                />
              </Popup>
            )}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
} 