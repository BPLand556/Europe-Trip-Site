import { Navigation } from '@/components/Navigation';
import { MapClient } from '@/components/MapClient';
import { prisma } from '@/lib/db';

export default async function MapPage() {
  const posts = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    include: {
      media: {
        orderBy: { order: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const postsWithLocation = posts.filter(p => p.latitude && p.longitude);

  return (
    <>
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Journey Map</h1>
          <p className="text-xl text-gray-600">
            Explore our European adventure through an interactive map
          </p>
          <div className="mt-4 text-sm text-gray-500">
            {postsWithLocation.length} location{postsWithLocation.length !== 1 ? 's' : ''} with coordinates
          </div>
        </div>

        {/* Map Container */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="h-[70vh] min-h-[500px]">
            <MapClient 
              posts={postsWithLocation}
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Map Legend */}
        <div className="mt-6 bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-3">Map Legend</h3>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Individual post</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
              <span>Clustered posts</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Click on pins to view post details</span>
            </div>
          </div>
        </div>

        {/* Location Stats */}
        {postsWithLocation.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from(new Set(postsWithLocation.map(p => p.country))).map((country) => {
              const countryPosts = postsWithLocation.filter(p => p.country === country);
              return (
                <div key={country} className="bg-white rounded-lg p-4 shadow-sm text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {countryPosts.length}
                  </div>
                  <div className="text-gray-600 text-sm">{country}</div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
