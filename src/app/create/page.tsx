'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { BookOpen, ArrowLeft } from 'lucide-react';

export default function CreateStoryPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth');
      } else {
        setUser(user);
      }
    };
    fetchUser();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.');
      setLoading(false);
      return;
    }

    try {
      const { data, error: insertError } = await supabase
        .from('stories')
        .insert([
          {
            creator_id: user.id,
            title: title.trim(),
            content: content.trim(),
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      router.push(`/story/${data.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create story');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-void text-text-primary">
      {/* Header */}
      <header className="border-b border-grey bg-slate">
        <div className="container py-6 px-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-grey transition"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <BookOpen className="w-8 h-8 text-accent" />
          <h1 className="text-2xl font-serif font-bold">Create New Story</h1>
        </div>
      </header>

      {/* Editor */}
      <main className="py-12 px-4">
        <div className="container max-w-4xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Input */}
            <div>
              <label className="block text-text-secondary text-sm mb-3 font-semibold">Story Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your story title..."
                className="w-full px-4 py-3 bg-slate border border-grey text-text-primary text-xl font-serif focus:border-accent focus:outline-none transition"
                required
              />
            </div>

            {/* Content Textarea */}
            <div>
              <label className="block text-text-secondary text-sm mb-3 font-semibold">Story Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Begin your story here. Write freely, collaborate in real-time with other writers..."
                className="w-full px-4 py-3 bg-slate border border-grey text-text-primary focus:border-accent focus:outline-none transition font-sans resize-none"
                rows={16}
                required
              />
            </div>

            {/* Word Count */}
            <div className="text-right text-text-secondary text-sm">
              {content.split(/\s+/).filter(w => w).length} words
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-grey p-4 text-text-secondary text-sm border border-red-500 rounded">
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-accent text-void font-semibold hover:bg-opacity-90 transition disabled:opacity-50"
              >
                {loading ? 'Publishing...' : 'Publish Story'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 py-3 border border-accent text-accent hover:bg-accent hover:text-void transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
