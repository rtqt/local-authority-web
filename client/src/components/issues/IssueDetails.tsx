import { MapPin, Calendar, User, Clock } from 'lucide-react';
import { Issue } from '@/types/issue';

interface IssueDetailsProps {
  issue: Issue;
}

export const IssueDetails = ({ issue }: IssueDetailsProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-white text-lg font-semibold mb-3">Details</h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2 text-slate-300">
          <MapPin size={16} className="text-slate-400" />
          <span>
            {/* Use only properties that exist on Location */}
            {issue.location?.address || 'No address'}
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <User size={16} className="text-slate-400" />
          <span>
            Reported by {issue.submittedBy?.firstName ?? issue.submittedBy?.username ?? 'Unknown'}
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <Calendar size={16} className="text-slate-400" />
          <span>Reported: {issue.submissionDate ?? 'N/A'}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <Clock size={16} className="text-slate-400" />
          <span>Updated: {issue.lastUpdated ?? 'N/A'}</span>
        </div>
      </div>
    </div>
  );
};
