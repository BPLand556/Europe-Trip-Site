export interface LocationInfo {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<LocationInfo> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'EuropeTripTracker/1.0',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to reverse geocode');
    }

    const data = await response.json();
    
    return {
      latitude,
      longitude,
      city: data.address?.city || data.address?.town || data.address?.village,
      country: data.address?.country,
    };
  } catch (error) {
    console.error('Reverse geocoding failed:', error);
    return {
      latitude,
      longitude,
    };
  }
}

export async function searchLocation(query: string): Promise<LocationInfo[]> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&limit=5&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'EuropeTripTracker/1.0',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to search location');
    }

    const data = await response.json();
    
    return data.map((item: any) => ({
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
      city: item.address?.city || item.address?.town || item.address?.village,
      country: item.address?.country,
    }));
  } catch (error) {
    console.error('Location search failed:', error);
    return [];
  }
}
