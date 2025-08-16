import { Navigation } from '@/components/Navigation';
import { MediaGrid } from '@/components/MediaGrid';
import { MapMini } from '@/components/MapMini';
import { prisma } from '@/lib/db';

export default async function HomePage() {
  const posts = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    include: {
      media: {
        orderBy: { order: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 20, // Show latest 20 posts
  });

  return (
    <>
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Our European Adventure
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Three months exploring the beautiful cities, landscapes, and cultures of Europe. 
            From the romantic streets of Paris to the ancient canals of Venice, 
            join us on this incredible journey through memories and photographs.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {posts.length}
            </div>
            <div className="text-gray-600">Posts Created</div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {posts.filter(p => p.city).length}
            </div>
            <div className="text-gray-600">Cities Visited</div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {posts.reduce((acc, post) => acc + post.media.length, 0)}
            </div>
            <div className="text-gray-600">Photos & Videos</div>
          </div>
        </div>

        {/* Mini Map */}
        <div className="mb-12">
          <MapMini posts={posts} />
        </div>

        {/* Latest Posts */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Latest Adventures</h2>
          <MediaGrid posts={posts} />
        </div>

        {/* Call to Action */}
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-4">
            Want to see more of our journey?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/timeline"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              View Timeline
            </a>
            <a
              href="/map"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Explore Map
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
