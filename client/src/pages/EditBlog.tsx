import React, { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Blog {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  imageUrl?: string;
  authorId: number;
  celebrityId?: number;
  category: string;
  tags?: string[];
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  likes: number;
}

const EditBlog: React.FC = () => {
  const [match, params] = useRoute('/edit-blog/:id');
  const [location, setLocation] = useLocation();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    imageUrl: '',
    category: 'general',
    tags: [] as string[],
    isPublished: false
  });

  const categories = [
    'general',
    'fashion',
    'lifestyle',
    'entertainment',
    'beauty',
    'fitness',
    'travel',
    'food',
    'technology',
    'business'
  ];

  useEffect(() => {
    checkAuthStatus();
    if (params?.id) {
      fetchBlog(params.id);
    }
  }, [params?.id]);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/auth/user', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data.user);
        setIsAuthenticated(true);
      } else {
        setCurrentUser(null);
        setIsAuthenticated(false);
        setLocation('/login');
      }
    } catch (err) {
      setCurrentUser(null);
      setIsAuthenticated(false);
      setLocation('/login');
    }
  };

  const fetchBlog = async (blogId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/blogs/${blogId}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch blog');
      }

      const blogData = await response.json();
      setBlog(blogData);
      
      // Check if user can edit this blog
      if (currentUser && (currentUser.id !== blogData.authorId && currentUser.role !== 'admin')) {
        setError('You do not have permission to edit this blog');
        return;
      }

      setFormData({
        title: blogData.title,
        content: blogData.content,
        excerpt: blogData.excerpt || '',
        imageUrl: blogData.imageUrl || '',
        category: blogData.category,
        tags: blogData.tags || [],
        isPublished: blogData.isPublished
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!params?.id) return;

    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/blogs/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update blog');
      }

      // Redirect to the blog or back to cele-world
      setLocation('/cele-world');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-darkgray flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-darkgray">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-light mb-4">Error</h2>
            <p className="text-light/70 mb-4">{error}</p>
            <button 
              onClick={() => setLocation('/cele-world')}
              className="bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600"
            >
              Back to Cele World
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="bg-darkgray min-h-screen">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-midgray/50 backdrop-blur-sm border border-white/10 rounded-xl p-8">
          <h1 className="text-3xl font-bold text-light mb-8">Edit Blog</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-light mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-dark/50 border border-white/20 rounded-lg text-light placeholder-light/50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Enter blog title"
              />
            </div>

            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-light mb-2">
                Excerpt
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 bg-dark/50 border border-white/20 rounded-lg text-light placeholder-light/50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Brief description of your blog"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-light mb-2">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-dark/50 border border-white/20 rounded-lg text-light focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category} value={category} className="bg-dark text-light">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-light mb-2">
                Image URL
              </label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-dark/50 border border-white/20 rounded-lg text-light placeholder-light/50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-light mb-2">
                Content
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                required
                rows={15}
                className="w-full px-4 py-3 bg-dark/50 border border-white/20 rounded-lg text-light placeholder-light/50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Write your blog content here..."
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublished"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleInputChange}
                className="h-4 w-4 text-amber-500 focus:ring-amber-500 border-white/20 rounded bg-dark/50"
              />
              <label htmlFor="isPublished" className="ml-2 block text-sm text-light">
                Publish this blog
              </label>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-6 rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-darkgray disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {saving ? 'Updating...' : 'Update Blog'}
              </button>
              
              <button
                type="button"
                onClick={() => setLocation('/cele-world')}
                className="px-6 py-3 bg-white/10 text-light rounded-lg font-medium hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-darkgray transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default EditBlog;