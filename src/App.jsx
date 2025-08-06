import React from "react";
import Hero from "./Hero";
import MapView from "./MapView";

export default function App() {
  return (
    <>
      <Hero />
      {/* no special height here—MapView will size itself */}
      <MapView />
    </>
  );
} 