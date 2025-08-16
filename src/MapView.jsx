import React, { useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  ZoomControl
} from "react-leaflet";
import L from "leaflet";
import { destinations as stops } from "./data";
import "./MapView.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function MapView() {
  const mapRef = useRef(null);
  const [openIdx, setOpenIdx] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const trail = stops.map(s => s.coords);

  // Europe limits: [NW, SE]
  const europeBounds = [
    [71.0, -25.0],
    [34.0,  40.0],
  ];

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
        aria-label="Toggle menu"
      >
        ☰
      </button>

      {/* Sidebar overlays the map (does NOT push layout) */}
      <aside className={`sidebar ${menuOpen ? "open" : ""}`} aria-hidden={!menuOpen}>
        <ul>
          {stops.map((s,i) => (
            <li key={i} onClick={() => flyToStop(s.coords, i)}>
              <img src={s.img} alt={s.name} />
              <span>{s.name}</span>
            </li>
          ))}
        </ul>
      </aside>

      <MapContainer
        center={[50, 10]}
        zoom={5}
        minZoom={4}
        maxZoom={11}
        maxBounds={[[71.0, -25.0],[34.0, 40.0]]}
        maxBoundsViscosity={1.0}
        whenCreated={(map) => {
          mapRef.current = map;
          // pane for labels (above base tiles; ignore pointer events)
          if (!map.getPane('labels')) {
            map.createPane('labels');
            const p = map.getPane('labels');
            p.style.zIndex = 650;
            p.style.pointerEvents = 'none';
          }
        }}
        style={{ width: "100%", height: "100%" }}
        zoomControl={false}
        dragging
        scrollWheelZoom
        touchZoom
        doubleClickZoom
        boxZoom
        keyboard
        tap
      >
        {/* Base (gray, English basemap) */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles &copy; Esri &mdash; Esri, HERE, Garmin, FAO, NOAA, USGS"
        />
        {/* English reference labels overlay */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}"
          attribution="Labels &copy; Esri"
          pane="labels"
        />

        <ZoomControl position="bottomright" />
        <Polyline positions={trail} color="#1978c8" weight={4} />
        {stops.map((s, i) => (
          <Marker key={i} position={s.coords} eventHandlers={{ click: () => setOpenIdx(i) }}>
            {openIdx === i && (
              <Popup onClose={() => setOpenIdx(null)}>
                <h3 style={{ marginTop: 0 }}>{s.name}</h3>
                <img src={s.img} alt={s.name} style={{ width: "100%", borderRadius: 6 }} />
              </Popup>
            )}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
} 