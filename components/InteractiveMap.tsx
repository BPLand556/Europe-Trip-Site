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

// Fix default Leaflet icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl:      require("leaflet/dist/images/marker-icon.png"),
  shadowUrl:    require("leaflet/dist/images/marker-shadow.png"),
});

export default function MapView() {
  const mapRef = useRef<L.Map | null>(null);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const trail = stops.map((s: any) => s.coords);

  const flyToStop = (coords: [number, number], i: number) => {
    if (!mapRef.current) return;
    mapRef.current.flyTo(coords, 6, { duration: 1 });
    setOpenIdx(i);
    setMenuOpen(false);
  };

  return (
    <div className="map-wrapper">
      <button
        className="hamburger"
        onClick={() => setMenuOpen((o) => !o)}
      >
        ☰
      </button>

      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <ul>
          {stops.map((s: any, i: number) => (
            <li key={i} onClick={() => flyToStop(s.coords as [number, number], i)}>
              <img src={s.img} alt={s.name} />
              <span>{s.name}</span>
            </li>
          ))}
        </ul>
      </aside>

      <MapContainer
        center={[50, 10]}
        zoom={5}
        style={{ width: "100%", height: "80vh" }}
        ref={mapRef}
        zoomControl={false}

        /* ← turn every interaction back on */
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
        <Polyline positions={trail as [number, number][]} color="#1978c8" weight={4} />

        {stops.map((s: any, i: number) => (
          <Marker
            key={i}
            position={s.coords as [number, number]}
            eventHandlers={{ click: () => setOpenIdx(i) }}
          >
            {openIdx === i && (
              <Popup>
                <h3>{s.name}</h3>
                <img
                  src={s.img}
                  alt={s.name}
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