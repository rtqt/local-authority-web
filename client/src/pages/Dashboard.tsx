// src/pages/Dashboard.tsx

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { IssueCard } from "@/components/issues/IssueCard";
import { IssueModal } from "@/components/issues/IssueModal";
import { Issue } from "@/types/issue";
import { api } from "@/api/api"; // Assuming you have an API client
import { useToast } from "@/components/ui/use-toast"; // For showing notifications

export const Dashboard = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { toast } = useToast();

  const fetchIssues = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Corrected: Use getAllIssues instead of getIssues
      const response = await api.issues.getAllIssues();
      setIssues(response.issues); // response.data is now response.issues as per api.ts type
    } catch (err) {
      console.error("Failed to fetch issues:", err);
      setError("Failed to load issues. Please try again.");
      toast({
        title: "Error",
        description: "Failed to load dashboard issues.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  const handleIssueClick = (issue: Issue) => {
    setSelectedIssue(issue);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedIssue(null);
  };

  const handleIssueUpdateSuccess = () => {
    // Re-fetch issues to update the list and stats after an issue is updated
    fetchIssues();
  };

  // Calculate stats based on fetched issues
  const stats = [
    { label: "Total Issues", value: issues.length, color: "text-blue-400" },
    {
      label: "Reported",
      value: issues.filter((i) => i.status === "Reported").length,
      color: "text-orange-400",
    },
    {
      label: "In Progress",
      value: issues.filter((i) => i.status === "In Progress").length,
      color: "text-yellow-400",
    },
    {
      label: "Resolved",
      value: issues.filter((i) => i.status === "Resolved").length,
      color: "text-green-400",
    },
  ];

  // Display only recent issues (e.g., top 5 or 10, sort by submissionDate)
  const recentIssues = issues
    .sort(
      (a, b) =>
        new Date(b.submissionDate).getTime() -
        new Date(a.submissionDate).getTime()
    )
    .slice(0, 5); // Display top 5 recent issues

  return (
    <div className="p-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 w-full"
      >
        <h1 className="text-white text-3xl font-bold mb-2">
          Welcome back, Admin
        </h1>
        <p className="text-slate-400">
          Here's what's happening in your jurisdiction today
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-slate-800 rounded-lg p-6 border border-slate-700"
          >
            <div className={`text-2xl font-bold mb-2 ${stat.color}`}>
              {stat.value}
            </div>
            <div className="text-slate-400 text-sm">{stat.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Issues List */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-xl font-semibold">Recent Issues</h2>
          <Link
            to="/issues/all"
            className="text-blue-400 hover:text-blue-300 text-sm font-medium"
          >
            View All Issues
          </Link>
        </div>

        {loading ? (
          <div className="text-center text-slate-400 py-8">
            Loading issues...
          </div>
        ) : error ? (
          <div className="text-center text-red-400 py-8">{error}</div>
        ) : recentIssues.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-400">No recent issues to display.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentIssues.map((issue, index) => (
              <motion.div
                key={issue.issueId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <IssueCard issue={issue} onClick={handleIssueClick} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Issue Modal */}
      <IssueModal
        issue={selectedIssue}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onUpdateSuccess={handleIssueUpdateSuccess}
      />
    </div>
  );
};
