'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { BookOpen, Sparkles, Lock } from 'lucide-react';

interface Story {
  id: string;
  title: string;
  content: string;
  creator_id: string;
  created_at: string;
  ip_proof_timestamp: string;
}

export default function HomePage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    const fetchStories = async () => {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setStories(data);
      }
      setLoading(false);
    };

    fetchUser();
    fetchStories();
  }, []);

  return (
    <div className="bg-void text-text-primary">
      {/* Header */}
      <header className="border-b border-grey bg-slate">
        <div className="container py-6 px-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-accent" />
            <h1 className="text-2xl font-serif font-bold text-text-primary">Grand Library</h1>
          </div>
          <nav className="flex gap-4">
            {user ? (
              <>
                <Link href="/create" className="px-4 py-2 bg-accent text-void font-semibold hover:bg-opacity-90 transition">
                  + New Story
                </Link>
                <Link href="/auth?logout=true" className="px-4 py-2 border border-accent text-accent hover:bg-accent hover:text-void transition">
                  Sign Out
                </Link>
              </>
            ) : (
              <Link href="/auth" className="px-4 py-2 bg-accent text-void font-semibold hover:bg-opacity-90 transition">
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b border-grey bg-slate py-16 px-4">
        <div className="container text-center">
          <h2 className="text-4xl font-serif font-bold mb-4">Intellectual Property Meets Collaboration</h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto mb-8">
            A distraction-free sanctuary for writers. Create, collaborate, and protect your intellectual property in real-time.
          </p>
          {!user && (
            <Link href="/auth" className="inline-block px-6 py-3 bg-accent text-void font-semibold hover:bg-opacity-90 transition">
              Begin Your Story
            </Link>
          )}
        </div>
      </section>

      {/* What-If Feed */}
      <section className="py-16 px-4">
        <div className="container">
          <div className="flex items-center gap-2 mb-8">
            <Sparkles className="w-6 h-6 text-accent" />
            <h3 className="text-2xl font-serif font-bold">What-If Stories</h3>
          </div>

          {loading ? (
            <div className="text-center text-text-secondary py-12">Loading stories...</div>
          ) : stories.length === 0 ? (
            <div className="text-center text-text-secondary py-12">
              <p className="mb-4">No stories yet. Be the first to create one.</p>
              {user && (
                <Link href="/create" className="inline-block px-6 py-3 bg-accent text-void font-semibold hover:bg-opacity-90 transition">
                  Create Story
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story) => (
                <Link key={story.id} href={`/story/${story.id}`}>
                  <div className="bg-slate border border-grey p-6 hover:border-accent transition cursor-pointer group">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-xl font-serif font-bold group-hover:text-accent transition flex-1">
                        {story.title || 'Sample Story Title'}
                      </h4>
                      <Lock className="w-4 h-4 text-accent flex-shrink-0 ml-2" />
                    </div>
                    <p className="text-text-secondary text-sm line-clamp-3 mb-4">
                      {story.content.substring(0, 120)}...
                    </p>
                    <div className="text-xs text-text-secondary">
                      <p>Created: {new Date(story.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-grey bg-slate py-8 px-4 mt-16">
        <div className="container text-center text-text-secondary text-sm">
          <p>&copy; 2026 Grand Library. All intellectual property rights reserved to their respective creators.</p>
        </div>
      </footer>
    </div>
  );
}
