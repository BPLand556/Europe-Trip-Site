'use client';

import { PostCard } from './PostCard';

interface MediaGridProps {
  posts: Array<{
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
  }>;
}

export function MediaGrid({ posts }: MediaGridProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          No posts yet. Start your journey by creating your first post!
        </p>
      </div>
    );
  }

  return (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
      {posts.map((post) => (
        <div key={post.id} className="break-inside-avoid">
          <PostCard post={post} />
        </div>
      ))}
    </div>
  );
}
