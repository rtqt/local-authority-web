import { Issue } from '@/types/issue';
import { MediaGallery } from './MediaGallery';
import { IssueDetails } from './IssueDetails';
import { CommentsSection } from './CommentsSection';

interface IssueModalContentProps {
  issue: Issue;
}

export const IssueModalContent = ({ issue }: IssueModalContentProps) => {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      {/* Description */}
      <div className="mb-6">
        <h3 className="text-white text-lg font-semibold mb-3">Description</h3>
        <p className="text-slate-300 leading-relaxed">{issue.description}</p>
      </div>

      {/* Media Gallery */}
      <MediaGallery media={issue.multimedia ?? []} />

      {/* Details */}
      <IssueDetails issue={issue} />

      {/* Comments */}
      <CommentsSection comments={issue.comments ?? []} />
    </div>
  );
};
