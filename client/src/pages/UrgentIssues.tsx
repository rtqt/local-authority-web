// src/pages/UrgentIssues.tsx

import { useState, useEffect, useCallback } from "react";
import { Layout } from "@/components/layout/Layout";
import { IssueCard } from "@/components/issues/IssueCard";
import { IssueModal } from "@/components/issues/IssueModal";
import { Issue, IssueStatus, IssuePriority } from "@/types/issue";
import { Search, AlertTriangle, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { api } from "@/api/api";
import { useToast } from "@/components/ui/use-toast";

export const UrgentIssues = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { toast } = useToast();

  const fetchIssues = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.issues.getAllIssues();
      setIssues(response.issues);
    } catch (err) {
      console.error("Failed to fetch issues:", err);
      setError("Failed to load urgent issues. Please try again.");
      toast({
        title: "Error",
        description: "Failed to load urgent issues.",
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
    fetchIssues();
  };

  // Filter for urgent issues (high and critical priority) and apply search term
  const urgentIssues = issues
    .filter(
      (issue) =>
        (issue.priority === "high" || issue.priority === "critical") &&
        (issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          // FIX: Changed issue.location.addressText to issue.location.address
          (issue.location &&
            issue.location.address &&
            issue.location.address
              .toLowerCase()
              .includes(searchTerm.toLowerCase())))
    )
    .sort((a, b) => {
      if (a.priority === "critical" && b.priority !== "critical") return -1;
      if (b.priority === "critical" && a.priority !== "critical") return 1;
      return (
        new Date(b.submissionDate).getTime() -
        new Date(a.submissionDate).getTime()
      );
    });

  const criticalIssues = urgentIssues.filter(
    (issue) => issue.priority === "critical"
  );
  const highPriorityIssues = urgentIssues.filter(
    (issue) => issue.priority === "high"
  );

  return (
    <Layout>
      <div className="p-6 bg-slate-900 min-h-screen">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="text-red-500" size={28} />
            <h1 className="text-2xl font-bold text-white">Urgent Issues</h1>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
              size={20}
            />
            <Input
              placeholder="Search urgent issues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-600 text-white"
            />
          </div>

          {/* Alert Banner */}
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-red-400" size={24} />
              <div>
                <h3 className="text-red-400 font-semibold">Priority Alert</h3>
                <p className="text-slate-300 text-sm">
                  {criticalIssues.length} critical and{" "}
                  {highPriorityIssues.length} high priority issues require
                  immediate attention
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg">
              <h3 className="text-red-400 text-sm flex items-center gap-2">
                <AlertTriangle size={16} />
                Critical Issues
              </h3>
              <p className="text-2xl font-bold text-red-400">
                {criticalIssues.length}
              </p>
            </div>
            <div className="bg-orange-900/20 border border-orange-500/30 p-4 rounded-lg">
              <h3 className="text-orange-400 text-sm flex items-center gap-2">
                <Clock size={16} />
                High Priority
              </h3>
              <p className="text-2xl font-bold text-orange-400">
                {highPriorityIssues.length}
              </p>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg">
              <h3 className="text-slate-400 text-sm">Total Urgent</h3>
              <p className="text-2xl font-bold text-white">
                {urgentIssues.length}
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-slate-400 py-12">
            Loading urgent issues...
          </div>
        ) : error ? (
          <div className="text-center text-red-400 py-12">{error}</div>
        ) : (
          <>
            {/* Critical Issues Section */}
            {criticalIssues.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-red-400 mb-4 flex items-center gap-2">
                  <AlertTriangle size={20} />
                  Critical Issues
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {criticalIssues.map((issue) => (
                    <IssueCard
                      key={issue.issueId}
                      issue={issue}
                      onClick={() => handleIssueClick(issue)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* High Priority Issues Section */}
            {highPriorityIssues.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-orange-400 mb-4 flex items-center gap-2">
                  <Clock size={20} />
                  High Priority Issues
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {highPriorityIssues.map((issue) => (
                    <IssueCard
                      key={issue.issueId}
                      issue={issue}
                      onClick={() => handleIssueClick(issue)}
                    />
                  ))}
                </div>
              </div>
            )}

            {urgentIssues.length === 0 && (
              <div className="text-center py-12">
                <AlertTriangle
                  className="mx-auto text-slate-600 mb-4"
                  size={64}
                />
                <p className="text-slate-400 text-lg">
                  No urgent issues found.
                </p>
                <p className="text-slate-500 text-sm">
                  All critical and high priority issues have been addressed or
                  no matching issues found for your search.
                </p>
              </div>
            )}
          </>
        )}

        {/* Issue Modal */}
        {selectedIssue && (
          <IssueModal
            issue={selectedIssue}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onUpdateSuccess={handleIssueUpdateSuccess}
          />
        )}
      </div>
    </Layout>
  );
};
