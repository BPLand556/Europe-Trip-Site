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
import { locations } from "../data/locations";
import "leaflet/dist/leaflet.css";
import "./MapView.css";

// fix default icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl:      require("leaflet/dist/images/marker-icon.png"),
  shadowUrl:    require("leaflet/dist/images/marker-shadow.png")
});

export default function MapView() {
  const mapRef = useRef<L.Map | null>(null);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // extract just the coords array for the polyline
  const trail = locations.map(d => d.coordinates);

  const flyTo = (coords: [number, number], idx: number) => {
    if (!mapRef.current) return;
    mapRef.current.flyTo(coords, 6, { duration: 1.2 });
    setOpenIdx(idx);
  };

  return (
    <div className="map-wrapper">
      <button
        className="hamburger"
        onClick={() => setSidebarOpen(o => !o)}
      >
        ☰
      </button>

      <nav className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <ul>
          {locations.map((d, i) => (
            <li key={i} onClick={() => flyTo(d.coordinates, i)}>
              <img src={d.images[0]?.url || "https://via.placeholder.com/300?text=" + d.name} alt={d.name} />
              <span>{d.name}</span>
            </li>
          ))}
        </ul>
      </nav>

      <MapContainer
        center={trail[0]}
        zoom={5}
        style={{ width: "100%", height: "100%" }}
        ref={mapRef}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        <ZoomControl position="bottomright" />
        <Polyline positions={trail} />

        {locations.map((d, i) => (
          <Marker
            key={i}
            position={d.coordinates}
            eventHandlers={{
              click: () => setOpenIdx(i)
            }}
          >
            {openIdx === i && (
              <Popup>
                <h3>{d.name}</h3>
                <img
                  src={d.images[0]?.url || "https://via.placeholder.com/300?text=" + d.name}
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