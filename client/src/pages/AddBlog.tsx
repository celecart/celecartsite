import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useLocation } from 'wouter';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../styles/quill-dark.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Eye, Calendar, User, Tag, BookOpen } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Celebrity {
  id: number;
  name: string;
  imageUrl?: string;
}

interface Blog {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  imageUrl?: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  publishDate: string;
  author: {
    id: number;
    displayName: string;
    email: string;
  };
  celebrity?: {
    id: number;
    name: string;
    imageUrl?: string;
  };
  likes: number;
  views: number;
}

const BlogManagement: React.FC = () => {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [celebrities, setCelebrities] = useState<Celebrity[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    imageUrl: '',
    celebrityId: '',
    category: 'general',
    tags: [] as string[],
    isPublished: false,
  });
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();
  const quillRef = useRef<ReactQuill>(null);

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

  // Memoize ReactQuill configuration to prevent re-renders
  const quillModules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ]
  }), []);

  const quillFormats = useMemo(() => [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'link', 'image'
  ], []);

  useEffect(() => {
    checkAuthStatus();
    fetchCelebrities();
    fetchBlogs();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/auth/user', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data.user);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setLocation('/login');
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
      setLocation('/login');
    } finally {
      setAuthLoading(false);
    }
  };

  const fetchCelebrities = async () => {
    try {
      const response = await fetch('/api/celebrities');
      if (response.ok) {
        const data = await response.json();
        setCelebrities(data);
      }
    } catch (err) {
      console.error('Error fetching celebrities:', err);
    }
  };

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/blogs');
      if (response.ok) {
        const data = await response.json();
        setBlogs(data);
      }
    } catch (err) {
      console.error('Error fetching blogs:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      imageUrl: '',
      celebrityId: '',
      category: 'general',
      tags: [],
      isPublished: false,
    });
    setTagInput('');
    setError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleContentChange = useCallback((content: string) => {
    setFormData(prev => ({
      ...prev,
      content
    }));
  }, []);

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Title and content are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const blogData = {
        ...formData,
        celebrityId: formData.celebrityId && formData.celebrityId !== 'none' ? parseInt(formData.celebrityId) : null,
      };

      const url = editingBlog ? `/api/blogs/${editingBlog.id}` : '/api/blogs';
      const method = editingBlog ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(blogData),
      });

      if (response.ok) {
        const result = await response.json();
        
        toast({
          title: "Success",
          description: editingBlog ? "Blog updated successfully!" : "Blog created successfully!",
        });

        // Refresh blogs list
        await fetchBlogs();
        
        // Close dialogs and reset form
        setIsCreateDialogOpen(false);
        setIsEditDialogOpen(false);
        setEditingBlog(null);
        resetForm();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to save blog');
      }
    } catch (err) {
      console.error('Error saving blog:', err);
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt,
      imageUrl: blog.imageUrl || '',
      celebrityId: blog.celebrity?.id?.toString() || '',
      category: blog.category,
      tags: blog.tags,
      isPublished: blog.isPublished,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (blogId: number) => {
    if (!confirm('Are you sure you want to delete this blog?')) {
      return;
    }

    try {
      const response = await fetch(`/api/blogs/${blogId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Blog deleted successfully!",
        });
        await fetchBlogs();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete blog",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Error deleting blog:', err);
      toast({
        title: "Error",
        description: "Network error occurred",
        variant: "destructive",
      });
    }
  };

  const canEditBlog = (blog: Blog) => {
    return currentUser && (currentUser.role === 'admin' || blog.author.id === currentUser.id);
  };

  const filteredBlogs = blogs.filter(blog => {
    if (activeTab === 'all') return true;
    if (activeTab === 'published') return blog.isPublished;
    if (activeTab === 'drafts') return !blog.isPublished;
    if (activeTab === 'mine') return blog.author.id === currentUser?.id;
    return true;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const BlogForm = () => (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-4 rounded-xl backdrop-blur-sm animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-amber-300/90 text-sm font-semibold mb-3 flex items-center space-x-2">
            <span className="w-1 h-4 bg-gradient-to-b from-amber-400 to-orange-400 rounded-full"></span>
            <span>Title *</span>
          </label>
          <Input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 transition-all duration-300 rounded-xl h-12"
            placeholder="Enter an engaging blog title..."
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-amber-300/90 text-sm font-semibold mb-3 flex items-center space-x-2">
            <span className="w-1 h-4 bg-gradient-to-b from-amber-400 to-orange-400 rounded-full"></span>
            <span>Category</span>
          </label>
          <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
            <SelectTrigger className="bg-white/5 border-white/20 text-white focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 transition-all duration-300 rounded-xl h-12">
              <SelectValue placeholder="Choose a category..." />
            </SelectTrigger>
            <SelectContent className="bg-black/90 backdrop-blur-xl border-white/20 rounded-xl">
              {categories.map((category) => (
                <SelectItem key={category} value={category} className="text-white hover:bg-amber-500/20 focus:bg-amber-500/20 rounded-lg">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-amber-300/90 text-sm font-semibold mb-3 flex items-center space-x-2">
          <span className="w-1 h-4 bg-gradient-to-b from-amber-400 to-orange-400 rounded-full"></span>
          <span>Excerpt</span>
        </label>
        <Textarea
          name="excerpt"
          value={formData.excerpt}
          onChange={handleInputChange}
          className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 transition-all duration-300 rounded-xl resize-none"
          placeholder="Write a compelling excerpt that captures the essence of your blog post..."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-amber-300/90 text-sm font-semibold mb-3 flex items-center space-x-2">
          <span className="w-1 h-4 bg-gradient-to-b from-amber-400 to-orange-400 rounded-full"></span>
          <span>Content *</span>
        </label>
        <div className="bg-white/5 border border-white/20 rounded-xl overflow-hidden backdrop-blur-sm">
          <ReactQuill
            key="content-editor"
            ref={quillRef}
            theme="snow"
            value={formData.content}
            onChange={handleContentChange}
            style={{ 
              height: '350px', 
              marginBottom: '50px'
            }}
            modules={quillModules}
            formats={quillFormats}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-amber-300/90 text-sm font-semibold mb-3 flex items-center space-x-2">
            <span className="w-1 h-4 bg-gradient-to-b from-amber-400 to-orange-400 rounded-full"></span>
            <span>Featured Image URL</span>
          </label>
          <Input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleInputChange}
            className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 transition-all duration-300 rounded-xl h-12"
            placeholder="https://example.com/featured-image.jpg"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-amber-300/90 text-sm font-semibold mb-3 flex items-center space-x-2">
            <span className="w-1 h-4 bg-gradient-to-b from-amber-400 to-orange-400 rounded-full"></span>
            <span>Celebrity (Optional)</span>
          </label>
          <Select value={formData.celebrityId} onValueChange={(value) => setFormData(prev => ({ ...prev, celebrityId: value }))}>
            <SelectTrigger className="bg-white/5 border-white/20 text-white focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 transition-all duration-300 rounded-xl h-12">
              <SelectValue placeholder="Associate with a celebrity..." />
            </SelectTrigger>
            <SelectContent className="bg-black/90 backdrop-blur-xl border-white/20 rounded-xl">
              <SelectItem value="none" className="text-white hover:bg-amber-500/20 focus:bg-amber-500/20 rounded-lg">None</SelectItem>
              {celebrities.map((celebrity) => (
                <SelectItem key={celebrity.id} value={celebrity.id.toString()} className="text-white hover:bg-amber-500/20 focus:bg-amber-500/20 rounded-lg">
                  {celebrity.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-amber-300/90 text-sm font-semibold mb-3 flex items-center space-x-2">
          <span className="w-1 h-4 bg-gradient-to-b from-amber-400 to-orange-400 rounded-full"></span>
          <span>Tags</span>
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {formData.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/30 rounded-full px-3 py-1 backdrop-blur-sm hover:from-amber-500/30 hover:to-orange-500/30 transition-all duration-300">
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-2 text-amber-300 hover:text-white transition-colors duration-200"
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-3">
          <Input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 transition-all duration-300 rounded-xl h-12"
            placeholder="Add a tag and press Enter..."
          />
          <Button
            type="button"
            onClick={addTag}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-semibold px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            Add Tag
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
        <input
          type="checkbox"
          id="isPublished"
          name="isPublished"
          checked={formData.isPublished}
          onChange={handleInputChange}
          className="w-5 h-5 rounded border-2 border-amber-400/50 bg-transparent checked:bg-gradient-to-r checked:from-amber-500 checked:to-orange-500 focus:ring-2 focus:ring-amber-400/20 transition-all duration-300"
        />
        <label htmlFor="isPublished" className="text-amber-300/90 text-sm font-medium cursor-pointer select-none">
          Publish immediately after creation
        </label>
      </div>

      <div className="flex gap-4 pt-6">
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
              <span>Saving...</span>
            </div>
          ) : (
            editingBlog ? 'Update Blog Post' : 'Create Blog Post'
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setIsCreateDialogOpen(false);
            setIsEditDialogOpen(false);
            setEditingBlog(null);
            resetForm();
          }}
          className="px-8 border-white/20 text-white hover:bg-white/5 hover:border-amber-400/50 transition-all duration-300 rounded-xl"
        >
          Cancel
        </Button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <Header />
      
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative container mx-auto px-4 pt-32 pb-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400 mb-4">
            Blog Management
          </h1>
          <p className="text-xl text-white/70 mb-8">
            Create, edit, and manage your blog posts
          </p>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-semibold px-8 py-3 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all duration-300 animate-pulse hover:animate-none"
                onClick={resetForm}
              >
                <Plus className="w-5 h-5 mr-2" />
                Create New Blog
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-black/90 backdrop-blur-xl border border-white/10 animate-in fade-in-0 zoom-in-95 duration-300">
              <DialogHeader>
                <DialogTitle className="text-white text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Create New Blog Post</DialogTitle>
              </DialogHeader>
              <BlogForm />
            </DialogContent>
          </Dialog>
        </div>

        {/* Tabs for filtering */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
            <TabsTrigger value="all" className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500/20 data-[state=active]:to-orange-500/20 data-[state=active]:text-amber-300 transition-all duration-300 rounded-lg">All Blogs</TabsTrigger>
            <TabsTrigger value="published" className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500/20 data-[state=active]:to-orange-500/20 data-[state=active]:text-amber-300 transition-all duration-300 rounded-lg">Published</TabsTrigger>
            <TabsTrigger value="drafts" className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500/20 data-[state=active]:to-orange-500/20 data-[state=active]:text-amber-300 transition-all duration-300 rounded-lg">Drafts</TabsTrigger>
            <TabsTrigger value="mine" className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500/20 data-[state=active]:to-orange-500/20 data-[state=active]:text-amber-300 transition-all duration-300 rounded-lg">My Blogs</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog, index) => (
            <Card key={blog.id} className="bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-amber-500/30 transition-all duration-500 shadow-lg transform hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/10 animate-in fade-in-0 slide-in-from-bottom-4" style={{ animationDelay: `${index * 100}ms` }}>
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge 
                    variant={blog.isPublished ? "default" : "secondary"}
                    className={blog.isPublished ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border border-green-500/30 animate-pulse" : "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border border-yellow-500/30"}
                  >
                    {blog.isPublished ? "Published" : "Draft"}
                  </Badge>
                  {canEditBlog(blog) && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(blog)}
                        className="border-amber-500/30 text-amber-300 hover:bg-amber-500/10 p-2"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(blog.id)}
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10 p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
                
                {blog.imageUrl && (
                  <img 
                    src={blog.imageUrl} 
                    alt={blog.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                
                <CardTitle className="text-white text-xl mb-2 line-clamp-2">
                  {blog.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <p className="text-white/70 text-sm mb-4 line-clamp-3">
                  {blog.excerpt || blog.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...'}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {blog.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="border-amber-500/30 text-amber-300 text-xs">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                  {blog.tags.length > 3 && (
                    <Badge variant="outline" className="border-white/20 text-white/50 text-xs">
                      +{blog.tags.length - 3} more
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-sm text-white/50 mb-4">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {blog.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(blog.publishDate)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-white/50" />
                    <span className="text-white/70 text-sm">{blog.author.displayName}</span>
                  </div>
                  <Badge variant="outline" className="border-white/20 text-white/70 text-xs">
                    {blog.category}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBlogs.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-xl text-white/70 mb-2">No blogs found</h3>
            <p className="text-white/50">
              {activeTab === 'mine' ? "You haven't created any blogs yet." : "No blogs match the current filter."}
            </p>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-black/90 backdrop-blur-xl border border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl">Edit Blog Post</DialogTitle>
          </DialogHeader>
          <BlogForm />
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default BlogManagement;