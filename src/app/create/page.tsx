'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ArrowLeft } from 'lucide-react';

export default function CreatePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.push('/auth');
      setUser(user);
    };
    fetchUser();
  }, [router]);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!content.trim()) {
      setError('Story content is required');
      return;
    }

    setLoading(true);

    try {
      const { data, error: insertError } = await supabase
        .from('stories')
        .insert([
          {
            creator_id: user.id,
            title: title.trim() || 'Untitled Story',
            content: content.trim(),
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;
      router.push(`/story/${data.id}`);
    } catch (err: any) {
      setError(err.message || 'Error publishing story');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-void text-text-primary">
      {/* Header */}
      <header className="border-b border-grey bg-slate">
        <div className="container py-6 px-4 flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-accent hover:text-opacity-80 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-2xl font-serif font-bold">New Story</h1>
          <div className="w-12"></div>
        </div>
      </header>

      {/* Editor */}
      <div className="container py-8 px-4 max-w-4xl">
        <form onSubmit={handlePublish} className="space-y-6">
          {/* Title Input (Optional) */}
          <div>
            <label className="block text-text-secondary text-sm mb-2">
              Story Title <span className="text-text-secondary">(optional)</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter story title... (leave blank for 'Untitled Story')"
              className="w-full px-4 py-3 bg-slate border border-grey text-text-primary placeholder-text-secondary focus:border-accent focus:outline-none transition text-lg font-serif"
            />
          </div>

          {/* Content Input (Required) */}
          <div>
            <label className="block text-text-secondary text-sm mb-2">
              Story Content <span className="text-accent">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your story here... (required)"
              rows={20}
              className="w-full px-4 py-3 bg-slate border border-grey text-text-primary placeholder-text-secondary focus:border-accent focus:outline-none transition font-sans resize-none"
              required
            />
          </div>

          {/* Word Count */}
          <div className="flex justify-between items-center">
            <p className="text-text-secondary text-sm">
              Words: {content.split(/\s+/).filter(w => w.length > 0).length}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900 text-red-200 p-3 rounded text-sm">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4 pt-4 border-t border-grey">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-accent text-accent hover:bg-accent hover:text-void transition font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="px-6 py-3 bg-accent text-void font-semibold hover:bg-opacity-90 transition disabled:opacity-50 ml-auto"
            >
              {loading ? 'Publishing...' : 'Publish Story'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
