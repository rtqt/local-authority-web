// src/api/api.ts

import { Issue } from "@/types/issue";
import { Category } from "@/types/category"; // Assuming this type is defined
import { User } from "@/types/issue"; // Assuming User type is in issue.ts
import axios from "axios";

// Replace with your actual backend API base URL
const API_BASE_URL = "http://localhost:4000/api";

// Helper function to get authorization headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token"); // Assuming you store the JWT token in localStorage
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  /**
   * Authentication API
   */
  auth: {
    login: async (
      email: string,
      password: string
    ): Promise<{ token: string; user: User }> => {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });
      return response.data;
    },
    // You can add register, logout, getProfile if needed
    getProfile: async (): Promise<{ user: User }> => {
      const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    },
  },

  /**
   * Issues API
   */
  issues: {
    getAllIssues: async (params?: {
      page?: number;
      limit?: number;
      status?: string;
      category?: string;
      priority?: string;
      search?: string;
      sortBy?: string;
      sortOrder?: "ASC" | "DESC";
    }): Promise<{ issues: Issue[]; pagination: any }> => {
      const response = await axios.get(`${API_BASE_URL}/issues`, {
        headers: getAuthHeaders(), // Ensure headers are always sent for protected routes
        params,
      });
      return response.data;
    },

    getIssueById: async (id: string): Promise<Issue> => {
      const response = await axios.get(`${API_BASE_URL}/issues/${id}`, {
        headers: getAuthHeaders(),
      });
      return response.data.issue;
    },

    updateIssue: async (
      id: string,
      updateData: Partial<Issue>
    ): Promise<Issue> => {
      const response = await axios.put(
        `${API_BASE_URL}/issues/${id}`,
        updateData,
        {
          headers: getAuthHeaders(),
        }
      );
      return response.data.issue;
    },

    createIssue: async (
      issueData: Omit<
        Issue,
        | "id"
        | "submissionDate"
        | "lastUpdated"
        | "resolutionDate"
        | "submittedBy"
        | "category"
        | "location"
        | "multimedia"
        | "feedback"
        | "assignedTo"
      > & {
        categoryId: string;
        location?: { latitude: number; longitude: number; address?: string };
        multimedia?: Array<{ fileType: string; fileUrl: string }>;
      }
    ): Promise<Issue> => {
      const response = await axios.post(`${API_BASE_URL}/issues`, issueData, {
        headers: getAuthHeaders(),
      });
      return response.data.issue;
    },

    deleteIssue: async (id: string): Promise<void> => {
      await axios.delete(`${API_BASE_URL}/issues/${id}`, {
        headers: getAuthHeaders(),
      });
    },

    getMyIssues: async (): Promise<Issue[]> => {
      const response = await axios.get(`${API_BASE_URL}/issues/my`, {
        headers: getAuthHeaders(),
      });
      return response.data.issues;
    },
  },

  /**
   * Categories API
   */
  categories: {
    getAllCategories: async (): Promise<Category[]> => {
      const response = await axios.get(`${API_BASE_URL}/categories`, {
        headers: getAuthHeaders(),
      });
      return response.data.categories;
    },
  },

  /**
   * Feedback API (if you need to interact with it directly from here)
   */
  feedback: {
    createFeedback: async (
      issueId: string,
      description: string,
      rating: number
    ): Promise<any> => {
      const response = await axios.post(
        `${API_BASE_URL}/feedback`,
        { issueId, description, rating },
        {
          headers: getAuthHeaders(),
        }
      );
      return response.data.feedback;
    },
    getFeedbackByIssue: async (issueId: string): Promise<any[]> => {
      const response = await axios.get(
        `${API_BASE_URL}/feedback/issue/${issueId}`,
        {
          headers: getAuthHeaders(),
        }
      );
      return response.data.feedback;
    },
  },
};
