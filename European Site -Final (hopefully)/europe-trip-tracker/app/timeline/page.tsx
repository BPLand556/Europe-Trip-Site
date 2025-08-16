import { Navigation } from '@/components/Navigation';
import { PostCard } from '@/components/PostCard';
import { prisma } from '@/lib/db';
import { groupPostsByDate, groupPostsByCity } from '@/lib/utils';

export default async function TimelinePage() {
  const posts = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    include: {
      media: {
        orderBy: { order: 'asc' },
      },
    },
    orderBy: { takenAt: 'desc' },
  });

  const postsByDate = groupPostsByDate(posts);
  const postsByCity = groupPostsByCity(posts);

  return (
    <>
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Timeline</h1>
          <p className="text-xl text-gray-600">
            Our journey through time and across Europe
          </p>
        </div>

        {/* Timeline by Date */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Chronological Journey</h2>
          
          <div className="space-y-12">
            {postsByDate.map(([date, datePosts]) => (
              <div key={date} className="relative">
                {/* Date Header */}
                <div className="sticky top-20 bg-gray-50 rounded-lg p-4 mb-6 z-10">
                  <h3 className="text-xl font-semibold text-gray-900">{date}</h3>
                  <p className="text-gray-600">{datePosts.length} post{datePosts.length !== 1 ? 's' : ''}</p>
                </div>
                
                {/* Posts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {datePosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline by City */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Journey by City</h2>
          
          <div className="space-y-12">
            {postsByCity.map(([city, cityPosts]) => (
              <div key={city} className="relative">
                {/* City Header */}
                <div className="sticky top-20 bg-blue-50 rounded-lg p-4 mb-6 z-10">
                  <h3 className="text-xl font-semibold text-blue-900">{city}</h3>
                  <p className="text-blue-700">{cityPosts.length} post{cityPosts.length !== 1 ? 's' : ''}</p>
                </div>
                
                {/* Posts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cityPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
