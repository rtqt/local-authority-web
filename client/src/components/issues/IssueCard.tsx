import { motion } from 'framer-motion';
import { MapPin, Calendar, User, Clock } from 'lucide-react';
import { Issue } from '@/types/issue';

interface IssueCardProps {
  issue: Issue;
  onClick: (issue: Issue) => void;
}

const priorityColors = {
  low: 'bg-green-500',
  medium: 'bg-yellow-500',
  high: 'bg-orange-500',
  critical: 'bg-red-500'
};

const statusColors = {
  Reported: 'bg-blue-500',
  'In Progress': 'bg-yellow-500',
  Resolved: 'bg-green-500',
  Closed: 'bg-gray-500',
  Rejected: 'bg-red-500'
};

export const IssueCard = ({ issue, onClick }: IssueCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-slate-600 cursor-pointer transition-all"
      onClick={() => onClick(issue)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${statusColors[issue.status]}`}>
            {issue.status === 'In Progress' ? 'In Progress' : issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${priorityColors[issue.priority]}`}>
            {issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)}
          </span>
        </div>
        <span className="text-slate-400 text-sm">#{issue.id}</span>
      </div>

      <h3 className="text-white font-semibold text-lg mb-2">{issue.title}</h3>
      <p className="text-slate-300 text-sm mb-4 line-clamp-2">{issue.description}</p>

      <div className="space-y-2 text-sm text-slate-400">
        <div className="flex items-center gap-2">
          <MapPin size={14} />
          <span>
            {issue.location?.address || 'No location'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <User size={14} />
          <span>
            Reported by {issue.submittedBy?.firstName || issue.submittedBy?.username || 'Unknown'}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar size={14} />
            <span>Reported: {issue.submissionDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} />
            <span>Updated: {issue.lastUpdated}</span>
          </div>
        </div>
      </div>

      {issue.multimedia && issue.multimedia.length > 0 && (
        <div className="mt-4 flex items-center gap-2">
          <div className="flex -space-x-2">
            {issue.multimedia.slice(0, 3).map((media, index) => (
              <div key={media.multimediaId} className="w-8 h-8 rounded border-2 border-slate-800 overflow-hidden">
                <img 
                  src={media.fileUrl} 
                  alt="Issue media" 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          {issue.multimedia.length > 3 && (
            <span className="text-xs text-slate-400">+{issue.multimedia.length - 3} more</span>
          )}
        </div>
      )}
    </motion.div>
  );
};
