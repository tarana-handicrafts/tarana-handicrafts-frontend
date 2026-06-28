"use client";

import { useState, useEffect, useRef } from "react";
import {
  fetchBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  uploadBlogVideo,
  BlogPostAdmin,
} from "@/lib/adminApi";
import ImageUploadField from "@/components/ui/ImageUploadField";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Eye,
  EyeOff,
  X,
  Upload,
  Film,
  ExternalLink,
} from "lucide-react";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPostAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [filterPublished, setFilterPublished] = useState("");
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    coverImage: "",
    videoUrl: "",
    author: "Tarana Handicrafts",
    category: "",
    tags: [] as string[],
    readTime: 5,
    isPublished: false,
    featured: false,
    seo: {
      metaTitle: "",
      metaDescription: "",
      keywords: [] as string[],
    },
  });
  const [tagInput, setTagInput] = useState("");

  const loadPosts = async (page = 1) => {
    try {
      setLoading(true);
      const params: { page?: number; limit?: number; isPublished?: string; search?: string } = { page, limit: 10 };
      if (filterPublished) params.isPublished = filterPublished;
      if (search) params.search = search;
      const data = await fetchBlogPosts(params);
      setPosts(data.posts);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [filterPublished]);

  const resetForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      coverImage: "",
      videoUrl: "",
      author: "Tarana Handicrafts",
      category: "",
      tags: [],
      readTime: 5,
      isPublished: false,
      featured: false,
      seo: { metaTitle: "", metaDescription: "", keywords: [] },
    });
    setEditingId(null);
    setShowForm(false);
    setTagInput("");
  };

  const handleEdit = (post: BlogPostAdmin) => {
    setFormData({
      title: post.title,
      excerpt: post.excerpt || "",
      content: post.content || "",
      coverImage: post.coverImage || "",
      videoUrl: post.videoUrl || "",
      author: post.author,
      category: post.category || "",
      tags: post.tags || [],
      readTime: post.readTime || 5,
      isPublished: post.isPublished,
      featured: post.featured || false,
      seo: {
        metaTitle: post.seo?.metaTitle || "",
        metaDescription: post.seo?.metaDescription || "",
        keywords: post.seo?.keywords || [],
      },
    });
    setEditingId(post._id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      if (editingId) {
        await updateBlogPost(editingId, formData);
        setSuccess("Blog post updated successfully");
      } else {
        await createBlogPost(formData);
        setSuccess("Blog post created successfully");
      }
      resetForm();
      loadPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Operation failed");
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    setError("");
    try {
      await deleteBlogPost(id);
      setSuccess("Post deleted");
      loadPosts(pagination.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleTogglePublish = async (post: BlogPostAdmin) => {
    try {
      await updateBlogPost(post._id, { isPublished: !post.isPublished });
      setSuccess(post.isPublished ? "Post unpublished" : "Post published");
      loadPosts(pagination.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingVideo(true);
    setError("");
    try {
      const result = await uploadBlogVideo(file);
      setFormData((prev) => ({ ...prev, videoUrl: result.url }));
      setSuccess("Video uploaded successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Video upload failed");
    } finally {
      setUploadingVideo(false);
      if (videoInputRef.current) videoInputRef.current.value = "";
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Blog Management</h1>
          <p className="text-sm text-stone-500">Create and manage blog posts with videos</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="inline-flex items-center gap-2 rounded-lg bg-[#8B4513] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#A0522D]"
        >
          <Plus className="h-4 w-4" />
          New Post
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
          <button onClick={() => setError("")} className="ml-2 text-red-500 hover:underline">dismiss</button>
        </div>
      )}
      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
          <button onClick={() => setSuccess("")} className="ml-2 text-green-500 hover:underline">dismiss</button>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 pt-10 pb-10">
          <div className="relative w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl">
            <button onClick={resetForm} className="absolute right-4 top-4 text-stone-400 hover:text-stone-600">
              <X className="h-5 w-5" />
            </button>
            <h2 className="mb-6 text-lg font-bold text-stone-900">
              {editingId ? "Edit Blog Post" : "New Blog Post"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Title */}
              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-[#8B4513] focus:outline-none"
                  placeholder="Blog post title"
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">Excerpt</label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
                  rows={2}
                  maxLength={300}
                  className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-[#8B4513] focus:outline-none"
                  placeholder="Short description for previews..."
                />
              </div>

              {/* Content */}
              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">Content *</label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                  rows={10}
                  className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-[#8B4513] focus:outline-none"
                  placeholder="Write your blog post content here..."
                />
              </div>

              {/* Cover Image */}
              <ImageUploadField
                value={formData.coverImage}
                onChange={(url) => setFormData((prev) => ({ ...prev, coverImage: url }))}
                label="Cover Image"
              />

              {/* Video Upload */}
              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">Video</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData((prev) => ({ ...prev, videoUrl: e.target.value }))}
                    placeholder="YouTube/Vimeo URL or paste video link"
                    className="flex-1 rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-[#8B4513] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => videoInputRef.current?.click()}
                    disabled={uploadingVideo}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 disabled:opacity-50"
                  >
                    {uploadingVideo ? (
                      <>
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        Upload Video
                      </>
                    )}
                  </button>
                </div>
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/mp4,video/webm,video/ogg,video/quicktime"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
                {formData.videoUrl && (
                  <div className="mt-2 flex items-center gap-2">
                    <Film className="h-4 w-4 text-stone-400" />
                    <a
                      href={formData.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      View Video
                    </a>
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, videoUrl: "" }))}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
                <p className="mt-1 text-xs text-stone-500">
                  Paste a YouTube/Vimeo URL or upload an MP4/WebM file (max 50MB)
                </p>
              </div>

              {/* Category & Author */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-stone-700">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-[#8B4513] focus:outline-none"
                  >
                    <option value="">Select category</option>
                    <option value="craft">Craft & Artistry</option>
                    <option value="product">Product Showcase</option>
                    <option value="trade">Trade & Export</option>
                    <option value="heritage">Heritage & Culture</option>
                    <option value="behind-the-scenes">Behind the Scenes</option>
                    <option value="news">News & Updates</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-stone-700">Author</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData((prev) => ({ ...prev, author: e.target.value }))}
                    className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-[#8B4513] focus:outline-none"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">Tags</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                    placeholder="Add tag and press Enter"
                    className="flex-1 rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-[#8B4513] focus:outline-none"
                  />
                  <button type="button" onClick={addTag} className="rounded-lg border border-stone-200 px-3 py-2 text-sm hover:bg-stone-50">
                    Add
                  </button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="text-stone-400 hover:text-red-500">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Read Time & Toggles */}
              <div className="flex flex-wrap items-center gap-6">
                <div>
                  <label className="mb-1 block text-sm font-medium text-stone-700">Read Time (min)</label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={formData.readTime}
                    onChange={(e) => setFormData((prev) => ({ ...prev, readTime: parseInt(e.target.value) || 5 }))}
                    className="w-20 rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-[#8B4513] focus:outline-none"
                  />
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData((prev) => ({ ...prev, isPublished: e.target.checked }))}
                    className="h-4 w-4 rounded border-stone-300"
                  />
                  Publish immediately
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData((prev) => ({ ...prev, featured: e.target.checked }))}
                    className="h-4 w-4 rounded border-stone-300"
                  />
                  Featured post
                </label>
              </div>

              {/* SEO */}
              <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
                <h3 className="mb-3 text-sm font-semibold text-stone-700">SEO Settings</h3>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-stone-600">Meta Title</label>
                    <input
                      type="text"
                      value={formData.seo.metaTitle}
                      onChange={(e) => setFormData((prev) => ({ ...prev, seo: { ...prev.seo, metaTitle: e.target.value } }))}
                      placeholder="SEO title (max 70 chars)"
                      maxLength={70}
                      className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-[#8B4513] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-stone-600">Meta Description</label>
                    <textarea
                      value={formData.seo.metaDescription}
                      onChange={(e) => setFormData((prev) => ({ ...prev, seo: { ...prev.seo, metaDescription: e.target.value } }))}
                      placeholder="SEO description (max 160 chars)"
                      maxLength={160}
                      rows={2}
                      className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-[#8B4513] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 border-t border-stone-100 pt-4">
                <button type="button" onClick={resetForm} className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-50">
                  Cancel
                </button>
                <button type="submit" className="rounded-lg bg-[#8B4513] px-6 py-2 text-sm font-medium text-white hover:bg-[#A0522D]">
                  {editingId ? "Update Post" : "Create Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") loadPosts(); }}
            placeholder="Search posts..."
            className="w-full rounded-lg border border-stone-200 py-2 pl-9 pr-3 text-sm focus:border-[#8B4513] focus:outline-none"
          />
        </div>
        <select
          value={filterPublished}
          onChange={(e) => setFilterPublished(e.target.value)}
          className="rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-[#8B4513] focus:outline-none"
        >
          <option value="">All Status</option>
          <option value="true">Published</option>
          <option value="false">Drafts</option>
        </select>
      </div>

      {/* Posts Table */}
      <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-stone-200 border-t-[#8B4513]" />
          </div>
        ) : posts.length === 0 ? (
          <div className="py-20 text-center text-stone-500">
            <Film className="mx-auto mb-3 h-10 w-10 text-stone-300" />
            <p>No blog posts found</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-50">
              <tr>
                <th className="px-4 py-3 font-medium text-stone-600">Title</th>
                <th className="hidden px-4 py-3 font-medium text-stone-600 md:table-cell">Category</th>
                <th className="hidden px-4 py-3 font-medium text-stone-600 md:table-cell">Video</th>
                <th className="hidden px-4 py-3 font-medium text-stone-600 sm:table-cell">Status</th>
                <th className="hidden px-4 py-3 font-medium text-stone-600 lg:table-cell">Views</th>
                <th className="px-4 py-3 font-medium text-stone-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {posts.map((post) => (
                <tr key={post._id} className="hover:bg-stone-50/50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-stone-900 line-clamp-1">{post.title}</p>
                      <p className="text-xs text-stone-400">
                        {post.author} &middot; {post.readTime} min read
                      </p>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    {post.category && (
                      <span className="inline-block rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-600 capitalize">
                        {post.category}
                      </span>
                    )}
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    {post.videoUrl ? (
                      <span className="inline-flex items-center gap-1 text-xs text-green-600">
                        <Film className="h-3 w-3" /> Yes
                      </span>
                    ) : (
                      <span className="text-xs text-stone-400">No</span>
                    )}
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    {post.isPublished ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                        <Eye className="h-3 w-3" /> Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                        <EyeOff className="h-3 w-3" /> Draft
                      </span>
                    )}
                  </td>
                  <td className="hidden px-4 py-3 text-stone-500 lg:table-cell">
                    {post.viewCount || 0}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleTogglePublish(post)}
                        className="rounded p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600"
                        title={post.isPublished ? "Unpublish" : "Publish"}
                      >
                        {post.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => handleEdit(post)}
                        className="rounded p-1.5 text-stone-400 hover:bg-stone-100 hover:text-blue-600"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(post._id, post.title)}
                        className="rounded p-1.5 text-stone-400 hover:bg-stone-100 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => loadPosts(page)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                pagination.page === page
                  ? "bg-[#8B4513] text-white"
                  : "border border-stone-200 text-stone-600 hover:bg-stone-50"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
