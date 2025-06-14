// src/types/issue.ts

export type IssueStatus = 'Reported' | 'In Progress' | 'Resolved' | 'Closed' | 'Rejected';
export type IssuePriority = 'low' | 'medium' | 'high' | 'critical';

export interface Location {
  address: string;
}

export interface SubmittedBy {
  firstName?: string;
  username?: string;
}

export interface MediaItem {
  multimediaId: string;
  fileUrl: string;
  type: 'image' | 'video';
  thumbnail?: string;
  caption?: string;
}

export interface Comment {
  id: string;
  author: string;
  date: string;
  content: string;
}

export interface Issue {
  id: string;
  issueId: string;
  title: string;
  description: string;
  location: Location;
  status: IssueStatus;
  priority: IssuePriority;
  submittedBy?: SubmittedBy;
  submissionDate?: string;
  lastUpdated?: string;
  multimedia?: MediaItem[];
  comments?: Comment[];
}
