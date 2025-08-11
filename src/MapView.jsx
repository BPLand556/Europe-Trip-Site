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
import stops from "./data";
import "./MapView.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl:      require("leaflet/dist/images/marker-icon.png"),
  shadowUrl:    require("leaflet/dist/images/marker-shadow.png"),
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
        minZoom={4}                     // don't zoom out past "all of Europe"
        maxZoom={11}
        maxBounds={europeBounds}        // don't pan outside Europe
        maxBoundsViscosity={1.0}
        style={{ width: "100%", height: "80vh" }}
        whenCreated={m => (mapRef.current = m)}
        zoomControl={false}
        dragging
        scrollWheelZoom
        touchZoom
        doubleClickZoom
        boxZoom
        keyboard
        tap
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; CARTO &copy; OpenStreetMap'
        />
        <ZoomControl position="bottomright" />

        <Polyline positions={trail} color="#1978c8" weight={4} />

        {stops.map((s, i) => (
          <Marker
            key={i}
            position={s.coords}
            eventHandlers={{ click: () => setOpenIdx(i) }}
          >
            {openIdx === i && (
              <Popup onClose={() => setOpenIdx(null)}>
                <h3>{s.name}</h3>
                <img src={s.img} alt={s.name} style={{ width: "100%", borderRadius: 4 }} />
              </Popup>
            )}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
} 