import { useState } from 'react';
import { Send } from 'lucide-react';
import { Comment } from '@/types/issue';

interface CommentsSectionProps {
  comments: Comment[];
}

export const CommentsSection = ({ comments }: CommentsSectionProps) => {
  const [newComment, setNewComment] = useState('');

  if (!comments) return null;

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      console.log('Adding comment:', newComment);
      setNewComment('');
    }
  };

  return (
    <div>
      <h3 className="text-white text-lg font-semibold mb-3">
        Comments ({comments.length})
      </h3>
      
      <div className="space-y-4 mb-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-slate-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium">{comment.author}</span>
              <span className="text-slate-400 text-sm">{comment.date}</span>
            </div>
            <p className="text-slate-300">{comment.content}</p>
          </div>
        ))}
      </div>

      {/* Add Comment */}
      <div className="flex gap-3">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment()}
        />
        <button
          onClick={handleSubmitComment}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};
