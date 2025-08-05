# The Adventures of Billy and Bobby - European Journey

A beautiful, interactive web application showcasing Billy and Bobby's European adventure with a stunning hero section and an interactive map.

## 🚀 Features

### Hero Section
- **Full-screen viewport** (100vh) with beautiful gradient background
- **Centered title** "The Adventures of Billy and Bobby" in bold, fun display font
- **Subtitle** "A European Journey" in elegant serif font
- **Smooth scroll button** that animates to the map section

### Interactive Map Section
- **80vh height** with CartoDB Positron tiles (English labels only)
- **Fully interactive** with all controls enabled:
  - Drag to pan
  - Mouse wheel zoom
  - Double-click zoom
  - Box zoom selection
  - Touch zoom (mobile)
  - Keyboard navigation
- **Zoom controls** positioned in bottom-right
- **Blue polyline** connecting all destinations
- **Clickable markers** with popups showing city images
- **Hamburger menu** (☰) in top-left with sliding sidebar
- **Fly-to animations** when clicking sidebar destinations

### European Destinations
- **Netherlands** (Amsterdam area)
- **Paris** (France)
- **Rome** (Italy)
- **Mallorca** (Spain)

## 🛠️ Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser** to `http://localhost:3000`

## 🎯 How to Use

1. **Hero Section**: View the beautiful landing page with title and subtitle
2. **Scroll Down**: Click the "SCROLL" button to smoothly scroll to the map
3. **Map Interaction**: 
   - Drag to pan around Europe
   - Use mouse wheel or zoom buttons to zoom in/out
   - Click markers to see city popups with images
4. **Sidebar Navigation**: 
   - Click the ☰ hamburger button to open the sidebar
   - Click any city in the sidebar to fly to that location
   - The sidebar will automatically close after flying to a destination

## 📁 Project Structure

```
europe-trip-site/
├── index.html              # Main HTML file
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── src/
│   ├── main.jsx           # React entry point
│   ├── App.jsx            # Main app component
│   ├── MapView.jsx        # Interactive map component
│   ├── data.js            # European destinations data
│   └── styles.css         # All styling
└── README.md              # This file
```

## 🎨 Technologies Used

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **React-Leaflet** - React components for Leaflet maps
- **Leaflet** - Interactive maps library
- **CartoDB** - Beautiful map tiles with English labels

## 🌟 Key Features

- **Responsive Design** - Works on desktop, tablet, and mobile
- **Smooth Animations** - CSS transitions and fly-to animations
- **Modern UI** - Clean, beautiful design with gradients and shadows
- **Interactive Map** - Full Leaflet functionality with custom controls
- **Performance Optimized** - Fast loading and smooth interactions

## 🚀 Build for Production

```bash
npm run build
```

This creates a `dist` folder with optimized files ready for deployment.

---

**Enjoy exploring Billy and Bobby's European adventure!** 🗺️✈️
