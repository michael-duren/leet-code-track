export type Difficulty = "Easy" | "Medium" | "Hard";

export type ProblemStatus = "New" | "FirstReview" | "SecondReview" | "Mastered";
export const ProblemStatuses = {
  New: 1,
  FirstReview: 2,
  SecondReview: 3,
  Mastered: 4,
};

export interface Problem {
  id: number;
  problem_number: number;
  title: string;
  difficulty: Difficulty;
  date_attempted: string; // ISO date string
  first_review_date?: string | null;
  second_review_date?: string | null;
  final_review_date?: string | null;
  status: number;
  pattern: string;
  notes: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProblemWithReviewInfo extends Problem {
  next_review_date?: string | null;
  review_status: "Due" | "Scheduled" | "Mastered";
  is_review_due: boolean;
}

export interface CreateProblemRequest {
  problem_number: number;
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
  total_problems: number;
  mastered_count: number;
  new_count: number;
  first_review_count: number;
  second_review_count: number;
  easy_count: number;
  medium_count: number;
  hard_count: number;
  reviews_due_today: number;
}

export interface PatternStats {
  pattern: string;
  count: number;
  mastered: number;
  mastery_percentage: number;
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

export const getStatusLabel = (problemStatus: number): string => {
  switch (problemStatus) {
    case ProblemStatuses.New:
      return "New";
    case ProblemStatuses.FirstReview:
      return "First Review";
    case ProblemStatuses.SecondReview:
      return "Second Review";
    case ProblemStatuses.Mastered:
      return "Mastered";
    default:
      return "Unknown";
  }
};

export const getStatusColor = (status: number): string => {
  switch (status) {
    case ProblemStatuses.New:
      return "bg-blue-500";
    case ProblemStatuses.FirstReview:
      return "bg-yellow-500";
    case ProblemStatuses.SecondReview:
      return "bg-orange-500";
    case ProblemStatuses.Mastered:
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
};

export const calculateNextReviewDate = (problem: Problem): Date | null => {
  const { status, date_attempted, first_review_date, second_review_date } =
    problem;

  switch (status) {
    case ProblemStatuses.New:
      return new Date(
        new Date(date_attempted).getTime() + 3 * 24 * 60 * 60 * 1000,
      );
    case ProblemStatuses.FirstReview:
      return first_review_date
        ? new Date(
            new Date(first_review_date).getTime() + 7 * 24 * 60 * 60 * 1000,
          )
        : null;
    case ProblemStatuses.SecondReview:
      return second_review_date
        ? new Date(
            new Date(second_review_date).getTime() + 20 * 24 * 60 * 60 * 1000,
          )
        : null;
    case ProblemStatuses.Mastered:
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

export const getNextStatus = (currentStatus: number): ProblemStatus => {
  switch (currentStatus) {
    case ProblemStatuses.New:
      return "FirstReview";
    case ProblemStatuses.FirstReview:
      return "SecondReview";
    case ProblemStatuses.SecondReview:
      return "SecondReview";
    case ProblemStatuses.Mastered:
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
  page_size: number;
  total_pages: number;
}

// Component prop types
export interface ProblemCardProps {
  problem: ProblemWithReviewInfo;
  on_mark_reviewed: (problem_id: number) => void;
  on_needs_more_review: (problem_id: number) => void;
  on_edit?: (problem_id: number) => void;
}

export interface ProblemFormProps {
  problem?: Problem;
  on_submit: (data: CreateProblemRequest | UpdateProblemRequest) => void;
  on_cancel: () => void;
  is_loading?: boolean;
}

export interface StatsCardProps {
  stats: ProblemStats;
}

export interface PatternStatsProps {
  patterns: PatternStats[];
}
