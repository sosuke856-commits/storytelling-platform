'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import ProofOfOwnership from '@/components/ProofOfOwnership';
import WriterRoom from '@/components/WriterRoom';
import { Menu, X, BookOpen } from 'lucide-react';

interface Story {
  id: string;
  title: string;
  content: string;
  creator_id: string;
  created_at: string;
  ip_proof_timestamp: string;
}

interface Creator {
  username: string;
}

export default function StoryPage() {
  const params = useParams();
  const router = useRouter();
  const storyId = params.id as string;

  const [story, setStory] = useState<Story | null>(null);
  const [creator, setCreator] = useState<Creator | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [writerRoomOpen, setWriterRoomOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        // Fetch story
        const { data: storyData, error: storyError } = await supabase
          .from('stories')
          .select('*')
          .eq('id', storyId)
          .single();

        if (storyError) throw storyError;
        setStory(storyData);

        // Fetch creator
        const { data: creatorData, error: creatorError } = await supabase
          .from('users')
          .select('username')
          .eq('id', storyData.creator_id)
          .single();

        if (creatorError) throw creatorError;
        setCreator(creatorData);
      } catch (err) {
        console.error('Error fetching story:', err);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    if (storyId) {
      fetchStory();
    }
  }, [storyId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-void text-text-primary flex items-center justify-center">
        <p>Loading story...</p>
      </div>
    );
  }

  if (!story || !creator) {
    return (
      <div className="min-h-screen bg-void text-text-primary flex items-center justify-center">
        <p>Story not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-void text-text-primary flex">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-grey bg-slate sticky top-0 z-40">
          <div className="container py-4 px-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push('/')}
                className="text-accent hover:text-opacity-80 transition"
              >
                <BookOpen className="w-6 h-6" />
              </button>
              <h1 className="text-xl font-serif font-bold truncate">{story.title}</h1>
            </div>
            <button
              onClick={() => setWriterRoomOpen(!writerRoomOpen)}
              className="md:hidden text-accent hover:text-opacity-80 transition"
            >
              {writerRoomOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <article className="container py-12 px-4 max-w-3xl mx-auto">
            {/* Proof of Ownership */}
            <div className="mb-8">
              <ProofOfOwnership
                creatorUsername={creator.username}
                timestamp={story.ip_proof_timestamp}
              />
            </div>

            {/* Story Content */}
            <div className="prose prose-invert max-w-none mb-16">
              <p className="text-text-primary whitespace-pre-wrap leading-relaxed text-lg">
                {story.content}
              </p>
            </div>

            {/* Legal Notice Footer */}
            <div className="border-t border-grey pt-8 mt-16">
              <div className="bg-slate p-4 rounded text-sm text-text-secondary italic">
                <p>
                  <strong>Legal Notice:</strong> 100% intellectual property ownership resides with the creator{' '}
                  <span className="text-accent font-semibold">{creator.username}</span> as of{' '}
                  <span className="text-accent font-semibold">
                    {new Date(story.ip_proof_timestamp).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  . Unauthorized reproduction or distribution is prohibited.
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>

      {/* Writer's Room Sidebar */}
      {user && (
        <div
          className={`${
            writerRoomOpen ? 'fixed inset-0 z-30 md:relative md:z-auto' : 'hidden'
          } md:flex md:w-96 md:h-screen md:flex-col`}
        >
          {writerRoomOpen && (
            <div
              className="absolute inset-0 bg-black bg-opacity-50 md:hidden"
              onClick={() => setWriterRoomOpen(false)}
            />
          )}
          <div className="relative z-10 w-full h-full md:h-auto md:flex-1 flex flex-col">
            <WriterRoom
              storyId={storyId}
              userId={user.id}
              username={creator.username}
              isOpen={true}
              onClose={() => setWriterRoomOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
