'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { formatDateShort } from '@/lib/utils';
import { getCloudinaryUrl } from '@/lib/cloudinary';
import { MapPin, Calendar } from 'lucide-react';

interface PostCardProps {
  post: {
    id: string;
    slug: string;
    title?: string;
    caption?: string;
    takenAt: Date;
    city?: string;
    country?: string;
    media: Array<{
      id: string;
      type: 'IMAGE' | 'VIDEO';
      cldId: string;
      width?: number;
      height?: number;
    }>;
  };
}

export function PostCard({ post }: PostCardProps) {
  const coverMedia = post.media[0];
  const hasLocation = post.city || post.country;

  return (
    <Link href={`/post/${post.slug}`}>
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer">
        <div className="aspect-[4/3] relative overflow-hidden">
          {coverMedia && (
            <Image
              src={getCloudinaryUrl(coverMedia.cldId, {
                width: 400,
                height: 300,
                quality: 'auto',
                format: 'webp',
              })}
              alt={post.title || post.caption || 'Post image'}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
          {coverMedia?.type === 'VIDEO' && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="bg-white/90 rounded-full p-2">
                <svg
                  className="w-6 h-6 text-gray-800"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M8 5v10l8-5-8-5z" />
                </svg>
              </div>
            </div>
          )}
        </div>
        
        <CardContent className="p-4">
          {post.title && (
            <h3 className="font-semibold text-lg mb-2 line-clamp-2">
              {post.title}
            </h3>
          )}
          
          {post.caption && (
            <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
              {post.caption}
            </p>
          )}
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDateShort(post.takenAt)}</span>
            </div>
            
            {hasLocation && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>
                  {post.city}
                  {post.city && post.country && ', '}
                  {post.country}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
