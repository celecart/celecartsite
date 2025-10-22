import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
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

const CeleWorld: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
    fetchBlogs();
    checkAuthStatus();
  }, [selectedCategory]);

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
      }
    } catch (err) {
      setCurrentUser(null);
      setIsAuthenticated(false);
    }
  };

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const url = selectedCategory 
        ? `/api/blogs?category=${selectedCategory}` 
        : '/api/blogs';
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch blogs');
      }
      
      const data = await response.json();
      setBlogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (blogId: number) => {
    try {
      const response = await fetch(`/api/blogs/${blogId}/like`, {
        method: 'POST',
      });
      
      if (response.ok) {
        const data = await response.json();
        setBlogs(blogs.map(blog => 
          blog.id === blogId 
            ? { ...blog, likes: data.likes }
            : blog
        ));
      }
    } catch (err) {
      console.error('Error liking blog:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchBlogs}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-darkgray min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-dark via-darkgray to-midgray pt-24">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-orange-500/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-amber-400 via-gold to-orange-500 bg-clip-text text-transparent leading-tight">
              Cele World
            </h1>
            <p className="text-light/70 mt-4 text-lg lg:text-xl font-medium max-w-2xl mx-auto">Discover the latest celebrity blogs and stories</p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-dark/50 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === '' 
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg' 
                  : 'bg-white/10 text-light/70 hover:bg-white/20 hover:text-amber-400 border border-white/20'
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 capitalize ${
                  selectedCategory === category 
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg' 
                    : 'bg-white/10 text-light/70 hover:bg-white/20 hover:text-amber-400 border border-white/20'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="bg-danger/10 border border-danger/20 rounded-xl p-8 max-w-md mx-auto">
              <svg className="mx-auto h-12 w-12 text-danger mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.876c1.07 0 1.957-.895 1.957-2L21 7c0-1.105-.887-2-1.957-2H4.957C3.887 5 3 5.895 3 7l-.043 10c0 1.105.887 2 1.957 2z" />
              </svg>
              <h3 className="text-lg font-semibold text-danger mb-2">Error Loading Blogs</h3>
              <p className="text-light/70">{error}</p>
            </div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-midgray/50 border border-white/10 rounded-xl p-12 max-w-lg mx-auto">
              <svg className="mx-auto h-16 w-16 text-light/40 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <h3 className="text-xl font-semibold text-light mb-3">No blogs found</h3>
              <p className="text-light/60">
                {selectedCategory ? `No blogs in the "${selectedCategory}" category.` : 'No blogs have been published yet.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <div key={blog.id} className="bg-midgray/50 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-amber-500/30 transition-all duration-300 group hover:shadow-2xl hover:shadow-amber-500/10">
                {blog.imageUrl && (
                  <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                    <img
                      src={blog.imageUrl}
                      alt={blog.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 text-xs font-medium rounded-full border border-amber-500/30">
                      {blog.category}
                    </span>
                    <span className="text-light/50 text-xs">
                      {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h2 className="text-xl font-bold text-light mb-3 group-hover:text-amber-400 transition-colors duration-300 line-clamp-2">
                    {blog.title}
                  </h2>
                  
                  {blog.excerpt && (
                    <p className="text-light/70 text-sm mb-4 line-clamp-3">
                      {blog.excerpt}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-4 text-light/60 text-sm">
                      <button
                        onClick={() => handleLike(blog.id)}
                        className="flex items-center gap-2 hover:text-amber-400 transition-colors duration-200 group/like"
                      >
                        <svg className="w-4 h-4 group-hover/like:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {blog.likes}
                      </button>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {blog.viewCount}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/blogs/${blog.id}`}
                        className="text-amber-400 hover:text-amber-300 text-sm font-medium flex items-center gap-1 group/link"
                      >
                        Read More 
                        <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default CeleWorld;