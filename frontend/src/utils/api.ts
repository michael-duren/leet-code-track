import type { 
  Problem, 
  CreateProblemRequest, 
  UpdateProblemRequest, 
  ProblemStats, 
  PatternStats,
  ApiResponse,
  PaginatedResponse 
} from '../types/Problem';

const API_BASE_URL = 'http://localhost:8080/api';

class ApiClient {
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Problem CRUD operations
  async getProblems(params?: {
    page?: number;
    limit?: number;
    search?: string;
    difficulty?: string;
    status?: string;
    pattern?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<ApiResponse<PaginatedResponse<Problem>>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.search) searchParams.set('search', params.search);
    if (params?.difficulty && params.difficulty !== 'all') {
      searchParams.set('difficulty', params.difficulty);
    }
    if (params?.status && params.status !== 'all') {
      searchParams.set('status', params.status);
    }
    if (params?.pattern && params.pattern !== 'all') {
      searchParams.set('pattern', params.pattern);
    }
    if (params?.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params?.sortOrder) searchParams.set('sortOrder', params.sortOrder);

    const queryString = searchParams.toString();
    return this.request<PaginatedResponse<Problem>>(
      `/problems${queryString ? `?${queryString}` : ''}`
    );
  }

  async getProblem(id: number): Promise<ApiResponse<Problem>> {
    return this.request<Problem>(`/problems/${id}`);
  }

  async createProblem(problem: CreateProblemRequest): Promise<ApiResponse<Problem>> {
    return this.request<Problem>('/problems', {
      method: 'POST',
      body: JSON.stringify(problem),
    });
  }

  async updateProblem(problem: UpdateProblemRequest): Promise<ApiResponse<Problem>> {
    return this.request<Problem>(`/problems/${problem.id}`, {
      method: 'PUT',
      body: JSON.stringify(problem),
    });
  }

  async deleteProblem(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/problems/${id}`, {
      method: 'DELETE',
    });
  }

  // Review operations
  async markAsReviewed(id: number): Promise<ApiResponse<Problem>> {
    return this.request<Problem>(`/problems/${id}/review`, {
      method: 'POST',
    });
  }

  async resetReviewStatus(id: number): Promise<ApiResponse<Problem>> {
    return this.request<Problem>(`/problems/${id}/reset`, {
      method: 'POST',
    });
  }

  // Statistics
  async getStats(): Promise<ApiResponse<ProblemStats>> {
    return this.request<ProblemStats>('/problems/stats');
  }

  async getPatternStats(): Promise<ApiResponse<PatternStats[]>> {
    return this.request<PatternStats[]>('/problems/patterns');
  }

  // Review queue
  async getReviewQueue(): Promise<ApiResponse<Problem[]>> {
    return this.request<Problem[]>('/problems/review-queue');
  }

  // Data export/import
  async exportData(): Promise<ApiResponse<{ problems: Problem[]; stats: ProblemStats }>> {
    return this.request<{ problems: Problem[]; stats: ProblemStats }>('/export');
  }

  async importData(data: { problems: Problem[] }): Promise<ApiResponse<{ imported: number }>> {
    return this.request<{ imported: number }>('/import', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Bulk operations
  async bulkUpdateStatus(ids: number[], status: string): Promise<ApiResponse<{ updated: number }>> {
    return this.request<{ updated: number }>('/problems/bulk-update', {
      method: 'POST',
      body: JSON.stringify({ ids, status }),
    });
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient();

// Helper functions for common operations
export const problemsApi = {
  getAll: (params?: Parameters<typeof apiClient.getProblems>[0]) => 
    apiClient.getProblems(params),
  
  getById: (id: number) => 
    apiClient.getProblem(id),
  
  create: (problem: CreateProblemRequest) => 
    apiClient.createProblem(problem),
  
  update: (problem: UpdateProblemRequest) => 
    apiClient.updateProblem(problem),
  
  delete: (id: number) => 
    apiClient.deleteProblem(id),
  
  markReviewed: (id: number) => 
    apiClient.markAsReviewed(id),
  
  resetStatus: (id: number) => 
    apiClient.resetReviewStatus(id),
};

export const statsApi = {
  getOverall: () => apiClient.getStats(),
  getPatterns: () => apiClient.getPatternStats(),
};

export const reviewApi = {
  getQueue: () => apiClient.getReviewQueue(),
};

export default apiClient;