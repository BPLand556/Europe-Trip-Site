'use client';

import { useRouter } from 'next/navigation';
import { PostForm } from '@/components/PostForm';
import { PostWithMediaInput } from '@/lib/validations';

export default function NewPostPage() {
  const router = useRouter();

  const handleSubmit = async (data: PostWithMediaInput) => {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const post = await response.json();
        router.push(`/admin/dashboard`);
      } else {
        throw new Error('Failed to create post');
      }
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('Failed to create post. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create New Post</h1>
              <p className="text-sm text-gray-500">Share your European adventure</p>
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
        <PostForm onSubmit={handleSubmit} />
      </main>
    </div>
  );
}
