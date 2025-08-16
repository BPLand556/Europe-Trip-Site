'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Eye, Trash2, LogOut, BarChart3, MapPin, Calendar } from 'lucide-react';

interface Post {
  id: string;
  slug: string;
  title?: string;
  caption?: string;
  status: 'DRAFT' | 'PUBLISHED';
  takenAt: Date;
  city?: string;
  country?: string;
  media: Array<{
    id: string;
    type: 'IMAGE' | 'VIDEO';
  }>;
  createdAt: Date;
}

export default function AdminDashboardPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    drafts: 0,
    withLocation: 0,
  });
  const router = useRouter();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      if (response.ok) {
        const allPosts = await response.json();
        setPosts(allPosts);
        
        setStats({
          total: allPosts.length,
          published: allPosts.filter((p: Post) => p.status === 'PUBLISHED').length,
          drafts: allPosts.filter((p: Post) => p.status === 'DRAFT').length,
          withLocation: allPosts.filter((p: Post) => p.latitude && p.longitude).length,
        });
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
      router.push('/admin');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPosts(posts.filter(p => p.id !== postId));
        fetchPosts(); // Refresh stats
      } else {
        alert('Failed to delete post');
      }
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete post');
    }
  };

  const handleToggleStatus = async (postId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    
    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...post,
          status: newStatus,
        }),
      });

      if (response.ok) {
        setPosts(posts.map(p => 
          p.id === postId ? { ...p, status: newStatus as 'DRAFT' | 'PUBLISHED' } : p
        ));
        fetchPosts(); // Refresh stats
      } else {
        alert('Failed to update post status');
      }
    } catch (error) {
      console.error('Status update failed:', error);
      alert('Failed to update post status');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
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
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <span className="text-sm text-gray-500">Europe Trip Tracker</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BarChart3 className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Posts</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Eye className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Published</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.published}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Edit className="w-8 h-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Drafts</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.drafts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MapPin className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">With Location</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.withLocation}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Link href="/admin/new">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Post
                  </Button>
                </Link>
                
                <Link href="/">
                  <Button variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    View Public Site
                  </Button>
                </Link>
                
                <Link href="/map">
                  <Button variant="outline">
                    <MapPin className="w-4 h-4 mr-2" />
                    View Map
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Posts List */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>All Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Title</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Location</th>
                      <th className="text-left py-3 px-4 font-medium">Date</th>
                      <th className="text-left py-3 px-4 font-medium">Media</th>
                      <th className="text-left py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map((post) => (
                      <tr key={post.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium">
                              {post.title || 'Untitled Post'}
                            </div>
                            {post.caption && (
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {post.caption}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            post.status === 'PUBLISHED' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {post.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {post.city ? (
                            <div className="text-sm">
                              <div>{post.city}</div>
                              {post.country && (
                                <div className="text-gray-500">{post.country}</div>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">No location</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {new Date(post.takenAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {post.media.length} {post.media.length === 1 ? 'item' : 'items'}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <Link href={`/post/${post.slug}`}>
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                            
                            <Link href={`/admin/${post.id}`}>
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </Link>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleStatus(post.id, post.status)}
                            >
                              {post.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeletePost(post.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
