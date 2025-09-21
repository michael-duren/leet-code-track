export type Difficulty = "Easy" | "Medium" | "Hard";
export const Difficulties = {
  Easy: 1,
  Medium: 2,
  Hard: 3,
};

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
  difficulty: number;
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
  difficulty: number;
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
}

export interface PatternStats {
  pattern: string;
  count: number;
  mastered: number;
  mastery_percentage: number;
}

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
