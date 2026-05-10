'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Send, X } from 'lucide-react';

interface Message {
  id: string;
  user_id: string;
  message: string;
  created_at: string;
  username: string;
}

interface WriterRoomProps {
  storyId: string;
  userId: string;
  username: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function WriterRoom({
  storyId,
  userId,
  username,
  isOpen = true,
  onClose,
}: WriterRoomProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('writer_messages')
        .select('id, user_id, message, created_at, users(username)')
        .eq('story_id', storyId)
        .order('created_at', { ascending: true })
        .limit(50);

      if (!error && data) {
        const formattedMessages = data.map((msg: any) => ({
          id: msg.id,
          user_id: msg.user_id,
          message: msg.message,
          created_at: msg.created_at,
          username: msg.users?.username || 'Anonymous',
        }));
        setMessages(formattedMessages);
      }
    };

    fetchMessages();
  }, [storyId]);

  // Subscribe to real-time messages
  useEffect(() => {
    const subscription = supabase
      .channel(`writer-room:${storyId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'writer_messages',
          filter: `story_id=eq.${storyId}`,
        },
        async (payload: any) => {
          // Fetch username for new message
          const { data: userData } = await supabase
            .from('users')
            .select('username')
            .eq('id', payload.new.user_id)
            .single();

          const newMessage: Message = {
            id: payload.new.id,
            user_id: payload.new.user_id,
            message: payload.new.message,
            created_at: payload.new.created_at,
            username: userData?.username || 'Anonymous',
          };

          setMessages((prev) => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [storyId]);

  // Send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('writer_messages').insert([
        {
          story_id: storyId,
          user_id: userId,
          message: input,
        },
      ]);

      if (error) throw error;
      setInput('');
    } catch (err: any) {
      console.error('Error sending message:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`${
        isOpen ? 'flex' : 'hidden'
      } flex-col h-full bg-slate border-l border-grey`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-grey">
        <h3 className="text-lg font-serif font-bold text-text-primary">Writer's Room</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-accent transition md:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-text-secondary text-sm py-8">
            <p>No messages yet. Start the conversation.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="text-sm">
              <p className={msg.user_id === userId ? 'text-accent font-semibold' : 'text-text-secondary'}>
                {msg.username}
              </p>
              <p className="text-text-primary bg-void px-3 py-2 rounded mt-1 break-words">
                {msg.message}
              </p>
              <p className="text-xs text-text-secondary mt-1">
                {new Date(msg.created_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSendMessage}
        className="border-t border-grey p-4 space-y-3"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Share your thoughts..."
          rows={2}
          className="w-full px-3 py-2 bg-void border border-grey text-text-primary placeholder-text-secondary focus:border-accent focus:outline-none transition resize-none text-sm"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="w-full py-2 bg-accent text-void font-semibold hover:bg-opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          Send
        </button>
      </form>
    </div>
  );
}
