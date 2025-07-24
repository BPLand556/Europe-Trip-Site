import { Location, Stats } from '../types';

export const locations: Location[] = [
  {
    id: 'paris-france',
    name: 'Paris',
    country: 'France',
    coordinates: [2.3522, 48.8566],
    visited: true,
    current: false,
    planned: false,
    visitDate: '2025-09-15',
    category: 'city',
    description: 'The City of Light welcomed us with its iconic Eiffel Tower, charming cafés, and world-class museums.',
    story: 'Our first stop in Europe was the magical city of Paris. We spent our days wandering through the charming streets of Montmartre, sipping coffee at sidewalk cafés, and marveling at the architectural wonders. The Louvre was overwhelming in the best way possible - we could have spent weeks there! Our favorite moment was watching the sunset from the steps of Sacré-Cœur, with the entire city spread out before us like a beautiful painting.',
    images: [
      {
        id: 'paris-eiffel',
        url: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800&h=600&fit=crop',
        alt: 'Eiffel Tower at sunset',
        caption: 'The iconic Eiffel Tower glowing in the golden hour',
        featured: true,
        width: 800,
        height: 600
      },
      {
        id: 'paris-louvre',
        url: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800&h=600&fit=crop',
        alt: 'Louvre Museum',
        caption: 'The magnificent Louvre Museum',
        featured: false,
        width: 800,
        height: 600
      },
      {
        id: 'paris-montmartre',
        url: 'https://images.unsplash.com/photo-1502602898534-861d6a3e1b1a?w=800&h=600&fit=crop',
        alt: 'Montmartre neighborhood',
        caption: 'Charming streets of Montmartre',
        featured: false,
        width: 800,
        height: 600
      }
    ],
    videos: [
      {
        id: 'paris-vlog',
        url: 'https://www.youtube.com/watch?v=example',
        title: 'Paris Adventures - Day 1',
        description: 'Our first day exploring the beautiful city of Paris',
        thumbnail: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400&h=225&fit=crop',
        duration: '12:34'
      }
    ],
    tags: ['romance', 'culture', 'art', 'food', 'architecture'],
    weather: {
      temperature: 22,
      condition: 'Sunny',
      humidity: 65,
      windSpeed: 12,
      description: 'Perfect autumn weather for exploring'
    },
    accommodation: {
      name: 'Hôtel Le Marais',
      type: 'hotel',
      address: '15 Rue de Rivoli, 75004 Paris',
      price: '€180/night',
      rating: 4.5,
      website: 'https://example.com'
    },
    activities: [
      {
        name: 'Eiffel Tower Visit',
        description: 'Climb to the top for breathtaking city views',
        duration: '2 hours',
        cost: '€26',
        difficulty: 'easy',
        category: 'sightseeing'
      },
      {
        name: 'Louvre Museum Tour',
        description: 'Explore the world\'s largest art museum',
        duration: '4 hours',
        cost: '€17',
        difficulty: 'easy',
        category: 'culture'
      },
      {
        name: 'Seine River Cruise',
        description: 'See Paris from the water',
        duration: '1 hour',
        cost: '€15',
        difficulty: 'easy',
        category: 'sightseeing'
      }
    ],
    tips: [
      'Buy a Paris Museum Pass to save money on attractions',
      'Visit the Louvre on Wednesday and Friday evenings for fewer crowds',
      'Take the metro to avoid traffic and save time',
      'Book Eiffel Tower tickets online to skip the queue'
    ],
    rating: 4.8,
    cost: 'moderate',
    duration: '4 days',
    season: 'autumn'
  },
  {
    id: 'rome-italy',
    name: 'Rome',
    country: 'Italy',
    coordinates: [12.4964, 41.9028],
    visited: true,
    current: false,
    planned: false,
    visitDate: '2025-09-25',
    category: 'city',
    description: 'The Eternal City captivated us with its ancient ruins, stunning architecture, and incredible food culture.',
    story: 'Rome was like stepping back in time. Walking through the Colosseum, we could almost hear the roar of the ancient crowds. The Vatican Museums were absolutely breathtaking - the Sistine Chapel left us speechless. We spent hours getting lost in the charming Trastevere neighborhood, discovering hidden trattorias and gelato shops. Our most memorable meal was at a tiny family-run restaurant where the owner personally taught us how to properly twirl spaghetti!',
    images: [
      {
        id: 'rome-colosseum',
        url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&h=600&fit=crop',
        alt: 'Colosseum in Rome',
        caption: 'The magnificent Colosseum, symbol of ancient Rome',
        featured: true,
        width: 800,
        height: 600
      },
      {
        id: 'rome-vatican',
        url: 'https://images.unsplash.com/photo-1555992336-03a23c7b20ee?w=800&h=600&fit=crop',
        alt: 'St. Peter\'s Basilica',
        caption: 'The stunning St. Peter\'s Basilica',
        featured: false,
        width: 800,
        height: 600
      },
      {
        id: 'rome-trastevere',
        url: 'https://images.unsplash.com/photo-1555992336-03a23c7b20ee?w=800&h=600&fit=crop',
        alt: 'Trastevere neighborhood',
        caption: 'Charming streets of Trastevere',
        featured: false,
        width: 800,
        height: 600
      }
    ],
    tags: ['history', 'culture', 'food', 'architecture', 'religion'],
    weather: {
      temperature: 25,
      condition: 'Sunny',
      humidity: 60,
      windSpeed: 8,
      description: 'Warm and pleasant Mediterranean climate'
    },
    accommodation: {
      name: 'Hotel Campo de\' Fiori',
      type: 'hotel',
      address: 'Via del Biscione, 6, 00186 Roma RM',
      price: '€160/night',
      rating: 4.3,
      website: 'https://example.com'
    },
    activities: [
      {
        name: 'Colosseum & Roman Forum',
        description: 'Explore ancient Rome\'s most iconic sites',
        duration: '3 hours',
        cost: '€24',
        difficulty: 'easy',
        category: 'history'
      },
      {
        name: 'Vatican Museums & Sistine Chapel',
        description: 'Marvel at priceless art and architecture',
        duration: '4 hours',
        cost: '€21',
        difficulty: 'easy',
        category: 'culture'
      },
      {
        name: 'Food Tour in Trastevere',
        description: 'Taste authentic Roman cuisine',
        duration: '3 hours',
        cost: '€65',
        difficulty: 'easy',
        category: 'food'
      }
    ],
    tips: [
      'Book Vatican Museums tickets online to avoid long queues',
      'Visit the Colosseum early morning or late afternoon for fewer crowds',
      'Try authentic Roman pizza at Pizzeria da Baffetto',
      'Take a guided tour to learn the fascinating history'
    ],
    rating: 4.9,
    cost: 'moderate',
    duration: '5 days',
    season: 'autumn'
  },
  {
    id: 'barcelona-spain',
    name: 'Barcelona',
    country: 'Spain',
    coordinates: [2.1734, 41.3851],
    visited: false,
    current: true,
    planned: false,
    visitDate: '2025-12-10',
    category: 'city',
    description: 'Currently exploring the vibrant Catalan capital with its unique architecture, delicious tapas, and Mediterranean charm.',
    story: 'We just arrived in Barcelona and are absolutely blown away by the city\'s energy! The Gothic Quarter feels like a medieval maze, and we can\'t wait to explore more of Gaudí\'s incredible architecture. The food scene here is incredible - we\'ve already tried some amazing tapas and paella. The Mediterranean weather is perfect for exploring, and we\'re excited to discover more of this beautiful city.',
    images: [
      {
        id: 'barcelona-sagrada',
        url: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&h=600&fit=crop',
        alt: 'Sagrada Familia',
        caption: 'Gaudí\'s masterpiece, the Sagrada Familia',
        featured: true,
        width: 800,
        height: 600
      },
      {
        id: 'barcelona-gothic',
        url: 'https://images.unsplash.com/photo-1555992336-03a23c7b20ee?w=800&h=600&fit=crop',
        alt: 'Gothic Quarter',
        caption: 'The historic Gothic Quarter',
        featured: false,
        width: 800,
        height: 600
      }
    ],
    tags: ['architecture', 'food', 'culture', 'beach', 'art'],
    weather: {
      temperature: 18,
      condition: 'Partly Cloudy',
      humidity: 70,
      windSpeed: 15,
      description: 'Mild Mediterranean winter weather'
    },
    accommodation: {
      name: 'Hotel Arts Barcelona',
      type: 'hotel',
      address: 'Carrer de la Marina, 19-21, 08005 Barcelona',
      price: '€200/night',
      rating: 4.7,
      website: 'https://example.com'
    },
    activities: [
      {
        name: 'Sagrada Familia Tour',
        description: 'Explore Gaudí\'s unfinished masterpiece',
        duration: '2 hours',
        cost: '€26',
        difficulty: 'easy',
        category: 'architecture'
      },
      {
        name: 'Gothic Quarter Walking Tour',
        description: 'Discover the historic heart of Barcelona',
        duration: '3 hours',
        cost: '€25',
        difficulty: 'easy',
        category: 'culture'
      },
      {
        name: 'Tapas Food Tour',
        description: 'Taste authentic Catalan cuisine',
        duration: '3 hours',
        cost: '€45',
        difficulty: 'easy',
        category: 'food'
      }
    ],
    tips: [
      'Book Sagrada Familia tickets online well in advance',
      'Visit Park Güell early morning for fewer crowds',
      'Try the local vermouth tradition',
      'Take the metro to avoid traffic'
    ],
    rating: 4.6,
    cost: 'moderate',
    duration: '6 days',
    season: 'winter'
  },
  {
    id: 'amsterdam-netherlands',
    name: 'Amsterdam',
    country: 'Netherlands',
    coordinates: [4.9041, 52.3676],
    visited: false,
    current: false,
    planned: true,
    visitDate: '2025-12-20',
    category: 'city',
    description: 'Planning to explore the charming canals, world-class museums, and vibrant culture of the Dutch capital.',
    story: 'We\'re excited to visit Amsterdam! We\'ve heard so much about the beautiful canals, the Anne Frank House, and the incredible art museums. We can\'t wait to rent bikes and explore the city like locals, visit the Van Gogh Museum, and maybe take a canal cruise. The Dutch culture and history fascinate us, and we\'re looking forward to experiencing the city\'s unique atmosphere.',
    images: [
      {
        id: 'amsterdam-canals',
        url: 'https://images.unsplash.com/photo-1512470876302-972faa2c9b5c?w=800&h=600&fit=crop',
        alt: 'Amsterdam canals',
        caption: 'The iconic canals of Amsterdam',
        featured: true,
        width: 800,
        height: 600
      }
    ],
    tags: ['culture', 'art', 'history', 'canals', 'museums'],
    weather: {
      temperature: 8,
      condition: 'Cloudy',
      humidity: 80,
      windSpeed: 20,
      description: 'Typical Dutch winter weather'
    },
    accommodation: {
      name: 'Hotel Pulitzer Amsterdam',
      type: 'hotel',
      address: 'Prinsengracht 323, 1016 GZ Amsterdam',
      price: '€220/night',
      rating: 4.6,
      website: 'https://example.com'
    },
    activities: [
      {
        name: 'Van Gogh Museum',
        description: 'Explore the world\'s largest Van Gogh collection',
        duration: '2 hours',
        cost: '€20',
        difficulty: 'easy',
        category: 'art'
      },
      {
        name: 'Anne Frank House',
        description: 'Visit the historic hiding place',
        duration: '1.5 hours',
        cost: '€14',
        difficulty: 'easy',
        category: 'history'
      },
      {
        name: 'Canal Cruise',
        description: 'See Amsterdam from the water',
        duration: '1 hour',
        cost: '€18',
        difficulty: 'easy',
        category: 'sightseeing'
      }
    ],
    tips: [
      'Book Anne Frank House tickets online months in advance',
      'Rent bikes to explore like locals',
      'Visit museums early morning to avoid crowds',
      'Try traditional Dutch stroopwafels'
    ],
    rating: 0,
    cost: 'moderate',
    duration: '4 days',
    season: 'winter'
  },
  {
    id: 'prague-czech-republic',
    name: 'Prague',
    country: 'Czech Republic',
    coordinates: [14.4378, 50.0755],
    visited: false,
    current: false,
    planned: true,
    visitDate: '2025-12-28',
    category: 'city',
    description: 'Planning to discover the fairytale-like architecture, rich history, and charming atmosphere of the Golden City.',
    story: 'We\'re so excited to visit Prague! The city looks like something out of a fairytale with its medieval architecture, the stunning Charles Bridge, and the majestic Prague Castle. We\'ve heard the Christmas markets are magical, and we can\'t wait to try authentic Czech cuisine like goulash and dumplings. The city\'s rich history and beautiful architecture are calling our names!',
    images: [
      {
        id: 'prague-castle',
        url: 'https://images.unsplash.com/photo-1519677100208-a0e229c2b3f3?w=800&h=600&fit=crop',
        alt: 'Prague Castle',
        caption: 'The magnificent Prague Castle',
        featured: true,
        width: 800,
        height: 600
      }
    ],
    tags: ['architecture', 'history', 'culture', 'christmas', 'beer'],
    weather: {
      temperature: 2,
      condition: 'Snowy',
      humidity: 85,
      windSpeed: 12,
      description: 'Cold winter weather with possible snow'
    },
    accommodation: {
      name: 'Hotel U Prince',
      type: 'hotel',
      address: 'Staroměstské nám. 29, 110 00 Staré Město',
      price: '€150/night',
      rating: 4.4,
      website: 'https://example.com'
    },
    activities: [
      {
        name: 'Prague Castle Tour',
        description: 'Explore the largest ancient castle complex',
        duration: '3 hours',
        cost: '€15',
        difficulty: 'moderate',
        category: 'history'
      },
      {
        name: 'Charles Bridge Walk',
        description: 'Stroll across the iconic bridge',
        duration: '1 hour',
        cost: 'Free',
        difficulty: 'easy',
        category: 'sightseeing'
      },
      {
        name: 'Old Town Square',
        description: 'Visit the heart of Prague',
        duration: '2 hours',
        cost: 'Free',
        difficulty: 'easy',
        category: 'culture'
      }
    ],
    tips: [
      'Visit Prague Castle early morning for fewer crowds',
      'Try traditional Czech beer at local pubs',
      'Book Christmas market visits in advance',
      'Take the tram to avoid walking uphill'
    ],
    rating: 0,
    cost: 'budget',
    duration: '3 days',
    season: 'winter'
  }
];

export const journeyPhases = [
  {
    id: 'phase-1',
    name: 'Autumn Adventures',
    startDate: '2025-09-10',
    endDate: '2025-10-15',
    description: 'Our first phase exploring the romantic cities of Western Europe',
    locations: ['paris-france', 'rome-italy'],
    theme: 'Romance and Culture',
    color: '#d69e2e'
  },
  {
    id: 'phase-2',
    name: 'Winter Wanderings',
    startDate: '2025-12-01',
    endDate: '2025-12-31',
    description: 'Experiencing the magic of European winter and holiday traditions',
    locations: ['barcelona-spain', 'amsterdam-netherlands', 'prague-czech-republic'],
    theme: 'Winter Magic',
    color: '#1a365d'
  }
];

export const mapSettings = {
  center: [4.9041, 50.0755] as [number, number], // Amsterdam
  zoom: 5,
  style: 'mapbox://styles/mapbox/light-v11',
  bearing: 0,
  pitch: 0
};

export const stats: Stats = {
  totalLocations: 5,
  visitedLocations: 2,
  plannedLocations: 3,
  countriesVisited: 2,
  totalDistance: 2847,
  totalDays: 22,
  averageRating: 4.85,
  totalCost: '€2,450'
}; 