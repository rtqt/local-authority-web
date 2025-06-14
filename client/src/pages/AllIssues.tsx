import { useState, useEffect, useCallback } from "react";
import { Layout } from "@/components/layout/Layout";
import { IssueCard } from "@/components/issues/IssueCard";
import { IssueModal } from "@/components/issues/IssueModal";
import { Issue, IssueStatus, IssuePriority } from "@/types/issue";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/api/api";
import { useToast } from "@/components/ui/use-toast";
import io from "socket.io-client"; // Import socket.io-client

export const AllIssues = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<IssueStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<IssuePriority | "all">(
    "all"
  );

  const { toast } = useToast();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalIssuesCount, setTotalIssuesCount] = useState(0);

  const fetchIssues = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Parameters<typeof api.issues.getAllIssues>[0] = {
        page: currentPage,
        limit: 10,
      };

      if (searchTerm) {
        params.search = searchTerm;
      }
      if (statusFilter !== "all") {
        params.status = statusFilter;
      }
      if (priorityFilter !== "all") {
        params.priority = priorityFilter;
      }

      const { issues: fetchedIssues, pagination } =
        await api.issues.getAllIssues(params);
      setIssues(fetchedIssues);
      setTotalPages(pagination.totalPages);
      setTotalIssuesCount(pagination.totalItems);
    } catch (err) {
      console.error("Failed to fetch issues:", err);
      setError("Failed to load issues. Please try again.");
      toast({
        title: "Error",
        description: "Failed to load issues. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, priorityFilter, currentPage, toast]);

  useEffect(() => {
    // Initial fetch of issues
    fetchIssues();

    // Initialize WebSocket connection
    // Ensure this matches your backend WebSocket URL, e.g., "http://localhost:3000"
    const socket = io(
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"
    ); // Use env variable or fallback

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    // Listen for 'newIssue' event
    socket.on("newIssue", (newIssue: Issue) => {
      console.log("New issue received via WebSocket:", newIssue);
      // Determine if the new issue matches current filters to display it immediately
      const matchesFilters =
        (!searchTerm ||
          newIssue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          newIssue.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) &&
        (statusFilter === "all" || newIssue.status === statusFilter) &&
        (priorityFilter === "all" || newIssue.priority === priorityFilter);

      if (matchesFilters) {
        setIssues((prevIssues) => [newIssue, ...prevIssues]);
        setTotalIssuesCount((prevCount) => prevCount + 1);
        toast({
          title: "New Issue!",
          description: `A new issue "${newIssue.title}" has been reported.`,
          variant: "default",
        });
      }
      // If there are filters applied and the new issue doesn't match,
      // it won't be immediately added to the list, but will appear
      // if filters are reset or the page is refreshed.
    });

    // Listen for 'issueUpdated' event
    socket.on("issueUpdated", (updatedIssue: Issue) => {
      console.log("Issue updated via WebSocket:", updatedIssue);
      // Update the issue in the list if it exists and matches current filters
      setIssues((prevIssues) => {
        const index = prevIssues.findIndex(
          (issue) => issue.issueId === updatedIssue.issueId
        );
        if (index > -1) {
          // If the issue is already in the list, replace it
          const newIssues = [...prevIssues];
          newIssues[index] = updatedIssue;
          return newIssues;
        } else {
          // If the updated issue is not in the current list (e.g., due to pagination or filters),
          // decide if it should be added or if a re-fetch is necessary.
          // For simplicity, we'll re-fetch if it's not present to ensure correct pagination/filtering.
          // Or, you could check if it matches current filters and add it to the start of the list.
          // For now, let's just make sure existing ones are updated.
          return prevIssues; // No change if not found (fetch will handle it if filters change)
        }
      });

      // If the currently selected issue (in the modal) is the one that was updated, update it in the modal as well
      setSelectedIssue((prevSelected) =>
        prevSelected && prevSelected.issueId === updatedIssue.issueId
          ? updatedIssue
          : prevSelected
      );
      toast({
        title: "Issue Updated!",
        description: `Issue "${updatedIssue.title}" has been updated.`,
        variant: "default",
      });
    });

    // Listen for 'issueDeleted' event
    socket.on("issueDeleted", (deletedIssueId: string) => {
      console.log("Issue deleted via WebSocket:", deletedIssueId);
      setIssues((prevIssues) =>
        prevIssues.filter((issue) => issue.issueId !== deletedIssueId)
      );
      setTotalIssuesCount((prevCount) => Math.max(0, prevCount - 1));
      // Close modal if the deleted issue was open
      if (selectedIssue && selectedIssue.issueId === deletedIssueId) {
        setSelectedIssue(null);
      }
      toast({
        title: "Issue Deleted!",
        description: `An issue has been removed.`,
        variant: "destructive",
      });
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    // Clean up on component unmount
    return () => {
      socket.disconnect();
    };
  }, [
    fetchIssues,
    searchTerm,
    statusFilter,
    priorityFilter,
    toast,
    selectedIssue,
  ]); // Added selectedIssue to dependencies

  const resetFilters = () => {
    setStatusFilter("all");
    setPriorityFilter("all");
    setSearchTerm("");
    setCurrentPage(1);
    // After resetting filters, re-fetch to apply changes
    // The useEffect's dependency array will trigger fetchIssues
  };

  const handleIssueUpdate = async (updatedIssue: Issue) => {
    // This function can remain, but its primary effect on `issues` state might be redundant
    // if the WebSocket `issueUpdated` listener always correctly updates the list.
    // It acts as a direct update mechanism for user interaction, ensuring immediate feedback
    // even if the WebSocket event has a slight delay or if the WebSocket connection is momentarily down.
    try {
      const response = await api.issues.updateIssue(
        updatedIssue.issueId,
        updatedIssue
      );
      // The WebSocket listener should handle the actual state update of `issues`
      // and `selectedIssue` based on the 'issueUpdated' event.
      // You might remove the `setIssues` and `setSelectedIssue` calls here
      // if you want a single source of truth for state updates (the WebSocket).
      // For now, let's keep it for immediate UI feedback.
      setIssues((prevIssues) =>
        prevIssues.map((issue) =>
          issue.issueId === response.issueId ? response : issue
        )
      );
      setSelectedIssue(response); // Directly update the modal if it's open
      toast({
        title: "Success",
        description: `Issue "${response.title}" updated successfully.`,
      });
    } catch (err) {
      console.error("Failed to update issue:", err);
      toast({
        title: "Error",
        description: "Failed to update issue. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openIssuesCount = issues.filter(
    (issue) => issue.status === "Reported" || issue.status === "In Progress"
  ).length;
  const inProgressIssuesCount = issues.filter(
    (issue) => issue.status === "In Progress"
  ).length;
  const resolvedIssuesCount = issues.filter(
    (issue) => issue.status === "Resolved"
  ).length;

  return (
    <Layout>
      <div className="p-6 bg-slate-900 min-h-screen">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-4">All Issues</h1>

          {/* Search and Filter Bar */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                size={20}
              />
              <Input
                placeholder="Search issues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setCurrentPage(1);
                    fetchIssues();
                  }
                }}
                className="pl-10 bg-slate-800 border-slate-600 text-white"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700 hover:text-white">
                  <Filter size={20} className="mr-2" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-slate-800 border-slate-600">
                <DropdownMenuLabel className="text-slate-200">
                  Filter by Status
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-600" />
                {(["Reported", "In Progress", "Resolved"] as IssueStatus[]).map(
                  (status) => (
                    <DropdownMenuItem
                      key={status}
                      onClick={() => {
                        setStatusFilter(status);
                        setCurrentPage(1);
                      }}
                      className="text-slate-300 hover:bg-slate-700 hover:text-white focus:bg-slate-700 focus:text-white"
                    >
                      {status}
                    </DropdownMenuItem>
                  )
                )}
                <DropdownMenuItem
                  onClick={() => {
                    setStatusFilter("all");
                    setCurrentPage(1);
                  }}
                  className="text-slate-300 hover:bg-slate-700 hover:text-white focus:bg-slate-700 focus:text-white"
                >
                  All Status
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-slate-600" />
                <DropdownMenuLabel className="text-slate-200">
                  Filter by Priority
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-600" />
                {(["low", "medium", "high"] as IssuePriority[]).map(
                  (priority) => (
                    <DropdownMenuItem
                      key={priority}
                      onClick={() => {
                        setPriorityFilter(priority);
                        setCurrentPage(1);
                      }}
                      className="text-slate-300 hover:bg-slate-700 hover:text-white focus:bg-slate-700 focus:text-white"
                    >
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </DropdownMenuItem>
                  )
                )}
                <DropdownMenuItem
                  onClick={() => {
                    setPriorityFilter("all");
                    setCurrentPage(1);
                  }}
                  className="text-slate-300 hover:bg-slate-700 hover:text-white focus:bg-slate-700 focus:text-white"
                >
                  All Priority
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-slate-600" />
                <DropdownMenuItem
                  onClick={resetFilters}
                  className="text-slate-300 hover:bg-slate-700 hover:text-white focus:bg-slate-700 focus:text-white"
                >
                  Reset Filters
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Active Filters Display */}
          {(statusFilter !== "all" ||
            priorityFilter !== "all" ||
            searchTerm) && (
            <div className="flex gap-2 mb-4 items-center">
              <span className="text-slate-400 text-sm">Active filters:</span>
              {searchTerm && (
                <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs">
                  Search: "{searchTerm}"
                </span>
              )}
              {statusFilter !== "all" && (
                <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                  Status: {statusFilter}
                </span>
              )}
              {priorityFilter !== "all" && (
                <span className="bg-orange-600 text-white px-2 py-1 rounded text-xs">
                  Priority:{" "}
                  {priorityFilter.charAt(0).toUpperCase() +
                    priorityFilter.slice(1)}
                </span>
              )}
              <button
                onClick={resetFilters}
                className="text-red-400 hover:text-red-300 text-xs underline"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-800 p-4 rounded-lg">
              <h3 className="text-slate-400 text-sm">Total Issues</h3>
              <p className="text-2xl font-bold text-white">
                {totalIssuesCount}
              </p>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg">
              <h3 className="text-slate-400 text-sm">Open/Reported</h3>
              <p className="text-2xl font-bold text-green-400">
                {openIssuesCount}
              </p>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg">
              <h3 className="text-slate-400 text-sm">In Progress</h3>
              <p className="text-2xl font-bold text-yellow-400">
                {inProgressIssuesCount}
              </p>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg">
              <h3 className="text-slate-400 text-sm">Resolved</h3>
              <p className="text-2xl font-bold text-blue-400">
                {resolvedIssuesCount}
              </p>
            </div>
          </div>
        </div>

        {loading && (
          <div className="text-center text-slate-400">Loading issues...</div>
        )}
        {error && <div className="text-center text-red-500">{error}</div>}

        {/* Issues Grid */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {issues.map((issue) => (
                <IssueCard
                  key={issue.issueId}
                  issue={issue}
                  onClick={() => setSelectedIssue(issue)}
                />
              ))}
            </div>

            {issues.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-400 text-lg">
                  No issues found matching your filters.
                </p>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-4 mt-8">
                <Button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="bg-slate-700 text-white hover:bg-slate-600"
                >
                  Previous
                </Button>
                <span className="text-slate-300 self-center">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="bg-slate-700 text-white hover:bg-slate-600"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}

        {/* Issue Modal */}
        {selectedIssue && (
          <IssueModal
            issue={selectedIssue}
            isOpen={!!selectedIssue}
            onClose={() => setSelectedIssue(null)}
            onUpdateSuccess={fetchIssues} // Keep this for re-fetching after manual updates from modal if needed
          />
        )}
      </div>
    </Layout>
  );
};
