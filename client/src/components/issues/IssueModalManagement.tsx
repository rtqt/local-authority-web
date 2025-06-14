// src/components/issues/IssueModalManagement.tsx (Conceptual update)

import React from "react";
import { Issue, IssueStatus, IssuePriority } from "@/types/issue";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface IssueModalManagementProps {
  issue: Issue;
  currentStatus: IssueStatus;
  currentPriority: IssuePriority;
  onStatusChange: (status: IssueStatus) => void;
  onPriorityChange: (priority: IssuePriority) => void;
  onUpdateIssue: () => void;
  isUpdating: boolean; // New prop
}

export const IssueModalManagement: React.FC<IssueModalManagementProps> = ({
  issue,
  currentStatus,
  currentPriority,
  onStatusChange,
  onPriorityChange,
  onUpdateIssue,
  isUpdating, // Destructure new prop
}) => {
  // Determine if there are changes to save
  const hasChanges =
    currentStatus !== issue.status || currentPriority !== issue.priority;

  return (
    <div className="w-80 flex-shrink-0 bg-slate-700 p-6 border-l border-slate-600 overflow-y-auto">
      <h3 className="text-xl font-bold text-white mb-4">Management</h3>

      {/* Status Management */}
      <div className="mb-6">
        <label
          htmlFor="status-select"
          className="block text-slate-300 text-sm font-medium mb-2"
        >
          Status
        </label>
        <Select
          value={currentStatus}
          onValueChange={(value: IssueStatus) => onStatusChange(value)}
          disabled={isUpdating} // Disable while updating
        >
          <SelectTrigger
            id="status-select"
            className="w-full bg-slate-600 text-white border-slate-500"
          >
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent className="bg-slate-700 text-white border-slate-500">
            <SelectItem value="Reported">Reported</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Resolved">Resolved</SelectItem>
            <SelectItem value="Closed">Closed</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Priority Management */}
      <div className="mb-6">
        <label
          htmlFor="priority-select"
          className="block text-slate-300 text-sm font-medium mb-2"
        >
          Priority
        </label>
        <Select
          value={currentPriority}
          onValueChange={(value: IssuePriority) => onPriorityChange(value)}
          disabled={isUpdating} // Disable while updating
        >
          <SelectTrigger
            id="priority-select"
            className="w-full bg-slate-600 text-white border-slate-500"
          >
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent className="bg-slate-700 text-white border-slate-500">
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator className="bg-slate-600 my-6" />

      {/* Update Button */}
      <Button
        onClick={onUpdateIssue}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold"
        disabled={!hasChanges || isUpdating} // Disable if no changes or updating
      >
        {isUpdating ? "Updating..." : "Update Issue"}
      </Button>

      {/* Assignee, Comments, etc. would go here */}
    </div>
  );
};
