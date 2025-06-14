
import { X } from 'lucide-react';
import { Issue } from '@/types/issue';

interface IssueModalHeaderProps {
  issue: Issue;
  currentStatus: Issue['status'];
  currentPriority: Issue['priority'];
  onClose: () => void;
}

const priorityColors = {
  low: 'bg-green-500',
  medium: 'bg-yellow-500',
  high: 'bg-orange-500',
  critical: 'bg-red-500'
};

const statusColors = {
  open: 'bg-blue-500',
  'in-progress': 'bg-yellow-500',
  resolved: 'bg-green-500',
  closed: 'bg-gray-500'
};

export const IssueModalHeader = ({ issue, currentStatus, currentPriority, onClose }: IssueModalHeaderProps) => {
  return (
    <div className="p-6 border-b border-slate-700">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${statusColors[currentStatus]}`}>
            {currentStatus === 'in-progress' ? 'In Progress' : currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${priorityColors[currentPriority]}`}>
            {currentPriority.charAt(0).toUpperCase() + currentPriority.slice(1)}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
      </div>
      
      <h2 className="text-white text-2xl font-bold mb-2">{issue.title}</h2>
      <p className="text-slate-400 text-sm">Issue ID: {issue.id}</p>
    </div>
  );
};
