'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Send, Users } from 'lucide-react';

interface Message {
  id: string;
  user_id: string;
  message: string;
  created_at: string;
  username?: string;
}

interface WriterRoomProps {
  storyId: string;
  currentUserId: string;
  currentUsername: string;
}

export default function WriterRoom({ storyId, currentUserId, currentUsername }: WriterRoomProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
        .select('*, users(username)')
        .eq('story_id', storyId)
        .order('created_at', { ascending: true });

      if (!error && data) {
        setMessages(
          data.map((msg: any) => ({
            id: msg.id,
            user_id: msg.user_id,
            message: msg.message,
            created_at: msg.created_at,
            username: msg.users?.username || 'Anonymous',
          }))
        );
      }
      setLoading(false);
    };

    fetchMessages();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel(`writer_room:${storyId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'writer_messages',
          filter: `story_id=eq.${storyId}`,
        },
        async (payload: any) => {
          const { data: userData } = await supabase
            .from('users')
            .select('username')
            .eq('id', payload.new.user_id)
            .single();

          setMessages((prev) => [
            ...prev,
            {
              id: payload.new.id,
              user_id: payload.new.user_id,
              message: payload.new.message,
              created_at: payload.new.created_at,
              username: userData?.username || 'Anonymous',
            },
          ]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [storyId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      const { error } = await supabase.from('writer_messages').insert([
        {
          story_id: storyId,
          user_id: currentUserId,
          message: newMessage.trim(),
        },
      ]);

      if (error) throw error;
      setNewMessage('');
    } catch (err: any) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate border-l border-grey">
      {/* Header */}
      <div className="border-b border-grey p-4 flex items-center gap-2">
        <Users className="w-5 h-5 text-accent" />
        <h3 className="font-serif font-bold text-text-primary">Writer's Room</h3>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="text-text-secondary text-sm text-center py-4">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-text-secondary text-sm text-center py-8">
            <p>Start the conversation...</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-3 rounded ${
                msg.user_id === currentUserId
                  ? 'bg-accent text-void ml-4'
                  : 'bg-grey text-text-primary mr-4'
              }`}
            >
              <div className="text-xs font-semibold mb-1 opacity-75">
                {msg.username === currentUsername ? 'You' : msg.username}
              </div>
              <p className="text-sm break-words">{msg.message}</p>
              <div className={`text-xs mt-1 opacity-50`}>
                {new Date(msg.created_at).toLocaleTimeString()}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="border-t border-grey p-3 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Brainstorm here..."
          className="flex-1 px-3 py-2 bg-void border border-grey text-text-primary text-sm focus:border-accent focus:outline-none transition"
          disabled={sending}
        />
        <button
          type="submit"
          disabled={sending || !newMessage.trim()}
          className="p-2 bg-accent text-void hover:bg-opacity-90 transition disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
