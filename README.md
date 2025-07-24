# The Adventures of Billy and Bobby - European Travel Map

A stunning interactive travel map website that tells the story of Billy and Bobby's European adventures through beautiful visualizations, rich storytelling, and immersive user experiences.

## 🌟 Features

### 🗺️ Interactive Map
- **High-Quality Mapbox Integration**: Beautiful, smooth map with custom styling
- **Smart Markers**: Different pin types for visited, current, and planned locations
- **Smooth Interactions**: Buttery smooth zoom, pan, and hover effects
- **Route Visualization**: Animated travel paths between destinations
- **Custom Popups**: Rich location information on hover

### 🎨 Beautiful Design
- **Modern Typography**: Playfair Display + Inter font pairing
- **Sophisticated Color Palette**: Deep navy, warm gold, and elegant earth tones
- **Glass Morphism**: Beautiful backdrop blur effects
- **Micro-Interactions**: Smooth hover states and loading animations
- **Responsive Design**: Perfect on mobile, tablet, and desktop

### 📖 Rich Storytelling
- **Location Modals**: Beautiful overlays with photos, stories, and details
- **Journey Timeline**: Chronological progression of adventures
- **Stats Dashboard**: Journey statistics and progress tracking
- **Filter System**: Advanced filtering by categories, phases, and more

### 🎪 Interactive Features
- **Search Functionality**: Find specific locations or content
- **Filter Panel**: Toggle between trip phases and categories
- **Timeline View**: Visual journey progression
- **Mobile Gestures**: Pinch-to-zoom, swipe navigation
- **Social Sharing**: Share favorite locations and stories

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Mapbox access token

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd billy-bobby-travel-map
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Maps**: Mapbox GL JS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Images**: Unsplash integration
- **Deployment**: Vercel-ready

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles and Tailwind config
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main page component
├── components/            # React components
│   ├── Header.tsx         # Beautiful header with navigation
│   ├── InteractiveMap.tsx # Main map component
│   ├── LocationModal.tsx  # Location detail modal
│   ├── StatsDashboard.tsx # Journey statistics
│   ├── FilterPanel.tsx    # Advanced filtering
│   └── JourneyTimeline.tsx # Timeline view
├── data/                  # Data and content
│   └── locations.ts       # Travel data and locations
├── types/                 # TypeScript type definitions
│   └── index.ts           # All type interfaces
└── public/               # Static assets
```

## 🎨 Design System

### Colors
- **Primary**: Deep navy (`#1a365d`) and warm gold (`#d69e2e`)
- **Secondary**: Soft grays and muted pastels
- **Accent**: Vibrant but tasteful highlights

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)

### Animations
- **Entrance**: Fade-in and slide-up effects
- **Hover**: Scale and color transitions
- **Loading**: Smooth spinners and skeleton screens

## 📱 Responsive Design

- **Mobile-First**: Optimized touch interactions
- **Tablet**: Perfect layout for iPad and similar devices
- **Desktop**: Enhanced features for larger screens
- **Cross-Browser**: Consistent experience across all modern browsers

## 🚀 Performance Features

- **Fast Loading**: Optimized images and lazy loading
- **Smooth Animations**: 60fps animations using CSS transforms
- **Progressive Enhancement**: Core functionality without JavaScript
- **Accessibility**: WCAG 2.1 AA compliant

## 📊 Content Management

The website uses a simple data structure that's easy to update:

```typescript
interface Location {
  id: string;
  name: string;
  country: string;
  coordinates: [number, number];
  visited: boolean;
  current: boolean;
  planned: boolean;
  visitDate?: string;
  description: string;
  story: string;
  images: Image[];
  // ... more properties
}
```

## 🎯 Success Criteria

This website achieves:
- ✅ **Beautiful Design**: Visually stunning and engaging
- ✅ **Emotional Connection**: Visitors feel connected to Billy and Bobby's journey
- ✅ **Premium Experience**: Rivals the best travel websites in the world
- ✅ **Immersive Storytelling**: Rich content that keeps visitors exploring
- ✅ **Modern Interactions**: Smooth, intuitive user experience

## 🔧 Customization

### Adding New Locations
1. Add location data to `data/locations.ts`
2. Include high-quality images from Unsplash
3. Write engaging stories and descriptions
4. Update journey phases as needed

### Styling Changes
1. Modify `tailwind.config.js` for color and animation changes
2. Update `app/globals.css` for custom styles
3. Adjust component styling in individual files

### Map Customization
1. Change map style in `InteractiveMap.tsx`
2. Modify marker designs and animations
3. Update route visualization styles

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Mapbox**: For the beautiful mapping platform
- **Unsplash**: For stunning travel photography
- **Framer Motion**: For smooth animations
- **Tailwind CSS**: For the utility-first styling
- **Next.js**: For the amazing React framework

---

**Made with ❤️ for Billy and Bobby's European Adventures** 