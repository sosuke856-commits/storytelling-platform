'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import ProofOfOwnership from '@/components/ProofOfOwnership';
import WriterRoom from '@/components/WriterRoom';
import { BookOpen, ArrowLeft, Maximize2, Minimize2 } from 'lucide-react';

interface Story {
  id: string;
  title: string;
  content: string;
  creator_id: string;
  created_at: string;
  ip_proof_timestamp: string;
}

interface User {
  id: string;
  username: string;
  email: string;
}

export default function StoryPage() {
  const params = useParams();
  const router = useRouter();
  const storyId = params.id as string;

  const [story, setStory] = useState<Story | null>(null);
  const [creator, setCreator] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [writerRoomOpen, setWriterRoomOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setWriterRoomOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUser(user);

        // Get story
        const { data: storyData, error: storyError } = await supabase
          .from('stories')
          .select('*')
          .eq('id', storyId)
          .single();

        if (storyError) throw storyError;
        setStory(storyData);

        // Get creator info
        const { data: creatorData, error: creatorError } = await supabase
          .from('users')
          .select('*')
          .eq('id', storyData.creator_id)
          .single();

        if (creatorError) throw creatorError;
        setCreator(creatorData);
      } catch (err) {
        console.error('Failed to fetch story:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [storyId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <p className="text-text-secondary">Loading story...</p>
      </div>
    );
  }

  if (!story || !creator) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <p className="text-text-secondary">Story not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-void text-text-primary flex flex-col">
      {/* Header */}
      <header className="border-b border-grey bg-slate sticky top-0 z-10">
        <div className="container py-4 px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-grey transition"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <BookOpen className="w-6 h-6 text-accent" />
            <h1 className="text-xl font-serif font-bold truncate">{story.title}</h1>
          </div>
          {isMobile && (
            <button
              onClick={() => setWriterRoomOpen(!writerRoomOpen)}
              className="p-2 hover:bg-grey transition"
              title={writerRoomOpen ? 'Close Writer\'s Room' : 'Open Writer\'s Room'}
            >
              {writerRoomOpen ? (
                <Minimize2 className="w-5 h-5" />
              ) : (
                <Maximize2 className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Story Canvas */}
        <main className={`flex-1 overflow-y-auto ${
          isMobile && writerRoomOpen ? 'hidden' : ''
        }`}>
          <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
            {/* Proof of Ownership */}
            <div className="mb-8">
              <ProofOfOwnership
                creatorUsername={creator.username}
                timestamp={story.ip_proof_timestamp}
              />
            </div>

            {/* Story Content */}
            <article className="prose prose-invert max-w-none">
              <h1 className="text-4xl font-serif font-bold mb-4 text-text-primary">
                {story.title}
              </h1>
              <div className="flex gap-4 mb-12 text-text-secondary text-sm">
                <span>By <strong className="text-accent">{creator.username}</strong></span>
                <span>Published {new Date(story.created_at).toLocaleDateString()}</span>
              </div>
              <div className="text-text-primary text-lg leading-relaxed whitespace-pre-wrap font-sans">
                {story.content}
              </div>
            </article>

            {/* Legal Footer */}
            <div className="mt-16 pt-8 border-t border-grey">
              <p className="text-text-secondary text-xs">
                Legal Notice: 100% IP ownership resides with the creator{' '}
                <span className="text-accent font-semibold">{creator.username}</span> as of{' '}
                <span className="text-accent font-semibold">
                  {new Date(story.ip_proof_timestamp).toLocaleString()}
                </span>
                .
              </p>
            </div>
          </div>
        </main>

        {/* Writer's Room Sidebar */}
        {currentUser && (
          <aside
            className={`${
              isMobile
                ? writerRoomOpen
                  ? 'fixed inset-0 z-50 w-full h-full md:w-80'
                  : 'hidden'
                : 'w-80'
            } flex flex-col`}
          >
            <WriterRoom
              storyId={storyId}
              currentUserId={currentUser.id}
              currentUsername={creator.id === currentUser.id ? creator.username : ''}
            />
          </aside>
        )}
      </div>
    </div>
  );
}
