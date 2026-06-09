import React, { useState } from 'react';
import { Send, Trash2 } from 'lucide-react';
import { Comment } from '../types';
import { useAuth } from '../hooks/useAuth';
import axiosInstance from '../helpers/axios-instance';

interface CommentSectionProps {
  postId: string;
  initialComments: Comment[];
  postAuthorId: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  initialComments,
  postAuthorId,
}) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !user || submitting) return;

    try {
      setSubmitting(true);
      const res = await axiosInstance.post('/comments', { postId, text });
      if (res.data.success) {
        setComments((prev) => [...prev, res.data.data]);
        setText('');
      }
    } catch (err) {
      console.error('Failed to add comment', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      const res = await axiosInstance.delete(`/comments/${commentId}`);
      if (res.data.success) {
        setComments((prev) => prev.filter((c) => c._id !== commentId));
      }
    } catch (err) {
      console.error('Failed to delete comment', err);
    }
  };

  return (
    <div className="mt-8 border-t border-gray-100 dark:border-slate-800 pt-8">
      <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-slate-100">
        Comments ({comments.length})
      </h3>

      {user ? (
        <form onSubmit={handleSubmit} className="flex gap-3 mb-8">
          <img
            src={user.avatar || 'https://api.dicebear.com/7.x/adventurer/svg?seed=placeholder'}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover border"
          />
          <div className="flex-grow relative">
            <input
              type="text"
              placeholder="Add to the story..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-full px-5 py-2.5 pr-12 text-sm outline-none focus:border-brand-500 transition-colors text-gray-800 dark:text-slate-200"
            />
            <button
              type="submit"
              disabled={submitting}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 bg-brand-500 hover:bg-brand-600 text-white rounded-full transition-colors cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 dark:bg-slate-900/50 rounded-xl p-4 text-center text-sm text-gray-500 mb-8 border border-dashed border-gray-200 dark:border-slate-800">
          Please sign in to join the conversation.
        </div>
      )}

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-slate-500 italic">No comments yet. Be the first to share your thoughts!</p>
        ) : (
          comments.map((comment) => {
            const commentUserId = comment.userId?._id || (comment.userId as any);
            const isCommentOwner = user ? commentUserId === user._id : false;
            const isPostOwner = user ? postAuthorId === user._id : false;
            const isAdmin = user ? user.role === 'admin' : false;
            const canDelete = isCommentOwner || isPostOwner || isAdmin;

            return (
              <div key={comment._id} className="flex gap-3 group">
                <img
                  src={comment.userId?.avatar || 'https://api.dicebear.com/7.x/adventurer/svg?seed=placeholder'}
                  alt={comment.userId?.name || 'Explorer'}
                  className="w-9 h-9 rounded-full object-cover border"
                />
                <div className="flex-grow bg-gray-50 dark:bg-slate-900/80 rounded-2xl px-4 py-3 relative">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-gray-900 dark:text-slate-200">
                      {comment.userId?.name || 'Anonymous Explorer'}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {new Date(comment.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-slate-300 font-light leading-relaxed">
                    {comment.text}
                  </p>

                  {canDelete && (
                    <button
                      onClick={() => handleDelete(comment._id)}
                      className="absolute right-3 bottom-3 text-gray-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      title="Delete Comment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
export default CommentSection;
