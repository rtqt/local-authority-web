// src/components/issues/IssueModal.tsx

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Issue, IssueStatus, IssuePriority } from "@/types/issue"; // Ensure IssuePriority is imported
import { IssueModalHeader } from "./IssueModalHeader";
import { IssueModalContent } from "./IssueModalContent";
import { IssueModalManagement } from "./IssueModalManagement";
import { api } from "@/api/api"; // Import your API client
import { useToast } from "@/components/ui/use-toast"; // Assuming you have this for notifications

interface IssueModalProps {
  issue: Issue | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateSuccess: () => void; // Add this prop for refetching issues list
}

export const IssueModal = ({
  issue,
  isOpen,
  onClose,
  onUpdateSuccess,
}: IssueModalProps) => {
  // Initialize state with issue's current status and priority,
  // or default if issue is null initially (though it's guarded by `if (!issue)`)
  const [currentStatus, setCurrentStatus] = useState<IssueStatus>(
    issue?.status || "Reported"
  );
  const [currentPriority, setCurrentPriority] = useState<IssuePriority>(
    issue?.priority || "medium"
  );
  const [isUpdating, setIsUpdating] = useState(false); // State to manage loading during update

  const { toast } = useToast();

  // Update local state when the 'issue' prop changes (e.g., when a new issue is selected)
  useEffect(() => {
    if (issue) {
      setCurrentStatus(issue.status as IssueStatus);
      // Ensure issue.priority is available, default if not
      setCurrentPriority(
        issue.priority ? (issue.priority as IssuePriority) : "medium"
      );
    }
  }, [issue]);

  if (!issue) return null; // Guard against null issue when modal is not open

  const handleUpdateIssue = async () => {
    setIsUpdating(true);
    try {
      // Call your API to update the issue
      const updatedIssue = await api.issues.updateIssue(issue.issueId, {
        status: currentStatus,
        priority: currentPriority,
        // Include other fields if they can be updated via this modal
      });

      // Update local state with the confirmed updated values
      setCurrentStatus(updatedIssue.status as IssueStatus);
      setCurrentPriority(
        updatedIssue.priority
          ? (updatedIssue.priority as IssuePriority)
          : "medium"
      );

      toast({
        title: "Success",
        description: `Issue "${updatedIssue.title}" updated successfully!`,
      });

      onUpdateSuccess(); // Trigger parent to refetch all issues

      // Optionally close the modal after update or keep it open
      // onClose();
    } catch (error) {
      console.error("Failed to update issue:", error);
      toast({
        title: "Error",
        description: "Failed to update issue. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-slate-800 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left Panel - Content */}
            <div className="flex-1 flex flex-col">
              <IssueModalHeader
                issue={issue}
                currentStatus={currentStatus}
                currentPriority={currentPriority}
                onClose={onClose}
              />
              <IssueModalContent issue={issue} />
            </div>

            {/* Right Panel - Issue Management */}
            <IssueModalManagement
              issue={issue}
              currentStatus={currentStatus}
              currentPriority={currentPriority}
              onStatusChange={setCurrentStatus}
              onPriorityChange={setCurrentPriority}
              onUpdateIssue={handleUpdateIssue}
              isUpdating={isUpdating} // Pass updating state
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
