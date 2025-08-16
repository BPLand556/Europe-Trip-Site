import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { Lightbox } from '@/components/Lightbox';
import { prisma } from '@/lib/db';
import { getCloudinaryUrl } from '@/lib/cloudinary';
import { formatDate, formatDateTime } from '@/lib/utils';
import { MapPin, Calendar, ArrowLeft, Share2 } from 'lucide-react';

interface PostPageProps {
  params: { slug: string };
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: {
      media: {
        orderBy: { order: 'asc' },
      },
    },
  });

  if (!post || post.status !== 'PUBLISHED') {
    notFound();
  }

  // Generate metadata for this post
  const metadata = {
    title: post.title || 'Untitled Post',
    description: post.caption || 'A post from our European adventure',
    image: post.media[0] ? getCloudinaryUrl(post.media[0].cldId, { width: 1200, height: 630 }) : undefined,
  };

  return (
    <>
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        {/* Post Header */}
        <div className="mb-8">
          {post.title && (
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
          )}
          
          {post.caption && (
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">{post.caption}</p>
          )}
          
          {/* Post Meta */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.takenAt)}</span>
            </div>
            
            {post.city && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>
                  {post.city}
                  {post.city && post.country && ', '}
                  {post.country}
                </span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <span>Posted {formatDateTime(post.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Media Gallery */}
        {post.media.length > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {post.media.map((media, index) => (
                <div key={media.id} className="relative group cursor-pointer">
                  <div className="aspect-[4/3] rounded-lg overflow-hidden">
                    {media.type === 'IMAGE' ? (
                      <Image
                        src={getCloudinaryUrl(media.cldId, {
                          width: 600,
                          height: 450,
                          quality: 'auto',
                          format: 'webp',
                        })}
                        alt={`${post.title || 'Post'} image ${index + 1}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : (
                      <video
                        src={getCloudinaryUrl(media.cldId)}
                        controls
                        className="w-full h-full object-cover"
                        poster={getCloudinaryUrl(media.cldId, { width: 600, height: 450 })}
                      />
                    )}
                  </div>
                  
                  {media.type === 'VIDEO' && (
                    <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                      VIDEO
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Post Body */}
        {post.bodyMD && (
          <div className="prose prose-lg max-w-none mb-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">The Story</h2>
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {post.bodyMD}
              </div>
            </div>
          </div>
        )}

        {/* Location Info */}
        {post.latitude && post.longitude && (
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Location</h3>
            <div className="flex items-center gap-2 text-blue-700">
              <MapPin className="w-5 h-5" />
              <span>
                {post.city}
                {post.city && post.country && ', '}
                {post.country}
              </span>
            </div>
            <div className="text-sm text-blue-600 mt-1">
              Coordinates: {post.latitude.toFixed(4)}, {post.longitude.toFixed(4)}
            </div>
          </div>
        )}

        {/* Share Section */}
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Share This Post</h3>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: post.title || 'Check out this post',
                    text: post.caption || 'A post from our European adventure',
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
