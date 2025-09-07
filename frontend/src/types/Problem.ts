export type Difficulty = "Easy" | "Medium" | "Hard";

export type ProblemStatus = "New" | "FirstReview" | "SecondReview" | "Mastered";

export interface Problem {
  id: number;
  problemNumber: number;
  title: string;
  difficulty: Difficulty;
  dateAttempted: string; // ISO date string
  firstReviewDate?: string | null;
  secondReviewDate?: string | null;
  finalReviewDate?: string | null;
  status: ProblemStatus;
  pattern: string;
  notes: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProblemWithReviewInfo extends Problem {
  nextReviewDate?: string | null;
  reviewStatus: "Due" | "Scheduled" | "Mastered";
  isReviewDue: boolean;
}

export interface CreateProblemRequest {
  problemNumber: number;
  title: string;
  difficulty: Difficulty;
  pattern?: string;
  notes?: string;
}

export interface UpdateProblemRequest {
  id: number;
  title?: string;
  difficulty?: Difficulty;
  pattern?: string;
  notes?: string;
}

export interface ProblemStats {
  totalProblems: number;
  masteredCount: number;
  newCount: number;
  firstReviewCount: number;
  secondReviewCount: number;
  easyCount: number;
  mediumCount: number;
  hardCount: number;
  reviewsDueToday: number;
}

export interface PatternStats {
  pattern: string;
  count: number;
  mastered: number;
  masteryPercentage: number;
}

export const getDifficultyColor = (difficulty: Difficulty): string => {
  switch (difficulty) {
    case "Easy":
      return "bg-green-500";
    case "Medium":
      return "bg-yellow-500";
    case "Hard":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

export const getStatusLabel = (status: ProblemStatus): string => {
  switch (status) {
    case "New":
      return "New";
    case "FirstReview":
      return "First Review";
    case "SecondReview":
      return "Second Review";
    case "Mastered":
      return "Mastered";
    default:
      return "Unknown";
  }
};

export const getStatusColor = (status: ProblemStatus): string => {
  switch (status) {
    case "New":
      return "bg-blue-500";
    case "FirstReview":
      return "bg-yellow-500";
    case "SecondReview":
      return "bg-orange-500";
    case "Mastered":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
};

export const calculateNextReviewDate = (problem: Problem): Date | null => {
  const { status, dateAttempted, firstReviewDate, secondReviewDate } = problem;

  switch (status) {
    case "New":
      return new Date(
        new Date(dateAttempted).getTime() + 3 * 24 * 60 * 60 * 1000,
      );
    case "FirstReview":
      return firstReviewDate
        ? new Date(
            new Date(firstReviewDate).getTime() + 7 * 24 * 60 * 60 * 1000,
          )
        : null;
    case "SecondReview":
      return secondReviewDate
        ? new Date(
            new Date(secondReviewDate).getTime() + 20 * 24 * 60 * 60 * 1000,
          )
        : null;
    case "Mastered":
      return null;
    default:
      return null;
  }
};

export const isReviewDue = (problem: Problem): boolean => {
  const nextReviewDate = calculateNextReviewDate(problem);
  if (!nextReviewDate) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  nextReviewDate.setHours(0, 0, 0, 0);

  return nextReviewDate <= today;
};

export const getNextStatus = (currentStatus: ProblemStatus): ProblemStatus => {
  switch (currentStatus) {
    case "New":
      return "FirstReview";
    case "FirstReview":
      return "SecondReview";
    case "SecondReview":
      return "Mastered";
    case "Mastered":
      return "Mastered";
    default:
      return "New";
  }
};

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Component prop types
export interface ProblemCardProps {
  problem: ProblemWithReviewInfo;
  onMarkReviewed: (problemId: number) => void;
  onNeedsMoreReview: (problemId: number) => void;
  onEdit?: (problemId: number) => void;
}

export interface ProblemFormProps {
  problem?: Problem;
  onSubmit: (data: CreateProblemRequest | UpdateProblemRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export interface StatsCardProps {
  stats: ProblemStats;
}

export interface PatternStatsProps {
  patterns: PatternStats[];
}
