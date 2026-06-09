import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Image as ImageIcon, AlertCircle } from 'lucide-react';
import axiosInstance from '../helpers/axios-instance';
import { Destination } from '../types';
import usePosts from '../hooks/usePosts';

export const CreateBlog: React.FC = () => {
  const navigate = useNavigate();
  const { createPost } = usePosts();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [destinationId, setDestinationId] = useState('');
  const [tags, setTags] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await axiosInstance.get('/destinations');
        if (res.data.success) {
          setDestinations(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load destinations', err);
      }
    };
    fetchDestinations();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setSelectedFiles(files);
      const previews = Array.from(files).map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !content || !destinationId) {
      setError('Please fill in all required fields');
      return;
    }
    if (!selectedFiles || selectedFiles.length === 0) {
      setError('Please upload at least one image');
      return;
    }

    try {
      setError('');
      setSubmitting(true);

      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('content', content);
      formData.append('destinationId', destinationId);
      formData.append('tags', tags);

      Array.from(selectedFiles).forEach((file) => {
        formData.append('images', file);
      });

      const post = await createPost(formData);
      navigate(`/blog/${post.slug}`);
    } catch (err: any) {
      setError(err.message || 'Failed to publish post');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h1 className="text-3xl font-extrabold mb-2 text-gray-900 dark:text-slate-100 flex items-center gap-2">
          <Compass className="w-8 h-8 text-brand-500" />
          Write Your Travel Tale
        </h1>
        <p className="text-xs text-gray-500 dark:text-slate-400 mb-8">
          Share your itinerary, food finds, local interactions, and travel guide with the community.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50 rounded-xl text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Post Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Backwaters Cruise in Alleppey"
                className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-500 text-gray-800 dark:text-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Curated Destination <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={destinationId}
                onChange={(e) => setDestinationId(e.target.value)}
                className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-500 text-gray-800 dark:text-slate-200"
              >
                <option value="">Select Destination</option>
                {destinations.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name} ({d.city}, {d.state})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Short Summary Description <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., A breakdown of our 3-day slow-travel guide, houseboat costs, and authentic local cuisine highlights."
              className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-500 text-gray-800 dark:text-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="backwaters, houseboat, localcuisine, budgetfriendly"
              className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-500 text-gray-800 dark:text-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Upload Images (1-5 files) <span className="text-rose-500">*</span>
            </label>
            <div className="border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-2xl p-6 text-center hover:border-brand-500 transition-colors relative">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <span className="text-xs text-gray-500 dark:text-slate-400 block font-semibold">
                Click or drag files here to upload
              </span>
              <span className="text-[10px] text-gray-400 block mt-1">
                Supported formats: JPG, PNG, WEBP (max 5MB per file)
              </span>
            </div>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-5 gap-3 mt-4">
                {imagePreviews.map((src, i) => (
                  <div key={i} className="relative aspect-video rounded-lg overflow-hidden border">
                    <img src={src} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Rich Blog Content <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tell your story. Describe the scenes, the routes, cost tables, food experiences, and helpful guidelines..."
              className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-500 text-gray-800 dark:text-slate-200 font-light leading-relaxed"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50 animate-pulse-subtle"
          >
            {submitting ? 'Publishing Story...' : 'Publish Travel Tale'}
          </button>
        </form>
      </div>
    </div>
  );
};
export default CreateBlog;
