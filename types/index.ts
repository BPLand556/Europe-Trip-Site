export interface Location {
  id: string;
  name: string;
  country: string;
  coordinates: [number, number]; // [longitude, latitude]
  visited: boolean;
  current: boolean;
  planned: boolean;
  visitDate?: string;
  category: 'city' | 'landmark' | 'nature' | 'culture' | 'food';
  description: string;
  story: string;
  images: Image[];
  videos?: Video[];
  tags: string[];
  weather?: WeatherInfo;
  accommodation?: AccommodationInfo;
  activities?: Activity[];
  tips?: string[];
  rating: number;
  cost: 'budget' | 'moderate' | 'luxury';
  duration: string;
  season: 'spring' | 'summer' | 'autumn' | 'winter' | 'all';
}

export interface Image {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  featured: boolean;
  width: number;
  height: number;
}

export interface Video {
  id: string;
  url: string;
  title: string;
  description?: string;
  thumbnail?: string;
  duration?: string;
}

export interface WeatherInfo {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  description: string;
}

export interface AccommodationInfo {
  name: string;
  type: 'hotel' | 'hostel' | 'apartment' | 'camping' | 'other';
  address: string;
  price: string;
  rating: number;
  website?: string;
}

export interface Activity {
  name: string;
  description: string;
  duration: string;
  cost: string;
  difficulty: 'easy' | 'moderate' | 'hard';
  category: string;
}

export interface JourneyPhase {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  description: string;
  locations: string[]; // Location IDs
  theme: string;
  color: string;
}

export interface MapSettings {
  center: [number, number];
  zoom: number;
  style: string;
  bearing: number;
  pitch: number;
}

export interface FilterOptions {
  categories: string[];
  phases: string[];
  visited: boolean | null;
  current: boolean | null;
  planned: boolean | null;
  cost: string[];
  season: string[];
  rating: number;
}

export interface Stats {
  totalLocations: number;
  visitedLocations: number;
  plannedLocations: number;
  countriesVisited: number;
  totalDistance: number;
  totalDays: number;
  averageRating: number;
  totalCost: string;
} 