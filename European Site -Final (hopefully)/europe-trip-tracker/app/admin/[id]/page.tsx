'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PostForm } from '@/components/PostForm';
import { PostWithMediaInput } from '@/lib/validations';

interface EditPostPageProps {
  params: { id: string };
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const [post, setPost] = useState<PostWithMediaInput & { id: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchPost();
  }, [params.id]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/${params.id}`);
      if (response.ok) {
        const postData = await response.json();
        setPost(postData);
      } else {
        setError('Post not found');
      }
    } catch (error) {
      console.error('Failed to fetch post:', error);
      setError('Failed to fetch post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: PostWithMediaInput) => {
    try {
      const response = await fetch(`/api/posts/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push('/admin/dashboard');
      } else {
        throw new Error('Failed to update post');
      }
    } catch (error) {
      console.error('Failed to update post:', error);
      alert('Failed to update post. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Post not found'}</p>
          <a
            href="/admin/dashboard"
            className="text-blue-600 hover:text-blue-700"
          >
            ← Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Post</h1>
              <p className="text-sm text-gray-500">
                {post.title || 'Untitled Post'}
              </p>
            </div>
            
            <a
              href="/admin/dashboard"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Back to Dashboard
            </a>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PostForm 
          initialData={post} 
          onSubmit={handleSubmit}
        />
      </main>
    </div>
  );
}
