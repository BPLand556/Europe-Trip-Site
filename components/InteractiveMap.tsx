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
import data from "../data/simple-locations";
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
  const trail = data.map(d => d.coords);

  const flyTo = (coords: [number, number], idx: number) => {
    if (!mapRef.current) return;
    mapRef.current.flyTo(coords as [number, number], 6, { duration: 1.2 });
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
          {data.map((d, i) => (
            <li key={i} onClick={() => flyTo(d.coords as [number, number], i)}>
              <img src={d.img} alt={d.name} />
              <span>{d.name}</span>
            </li>
          ))}
        </ul>
      </nav>

      <MapContainer
        center={trail[0] as [number, number]}
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
        <Polyline positions={trail as [number, number][]} />

        {data.map((d, i) => (
          <Marker
            key={i}
            position={d.coords as [number, number]}
            eventHandlers={{
              click: () => setOpenIdx(i)
            }}
          >
            {openIdx === i && (
              <Popup>
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