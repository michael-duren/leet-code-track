import type { Difficulty, Problem, ProblemStatus } from "../types/Problem";
import { Difficulties, ProblemStatuses } from "../types/Problem";

export const getDifficultyBadgeClass = (difficulty: number) => {
  switch (difficulty) {
    case ProblemStatuses.New:
      return "badge badge-success";
    case ProblemStatuses.FirstReview:
      return "badge badge-warning";
    case ProblemStatuses.SecondReview:
      return "badge badge-error";
    default:
      return "badge badge-ghost";
  }
};

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

export const getShorthandStatus = (status: number): string => {
  switch (status) {
    case ProblemStatuses.New:
      return "New";
    case ProblemStatuses.FirstReview:
      return "First";
    case ProblemStatuses.SecondReview:
      return "Second";
    case ProblemStatuses.Mastered:
      return "Mastered";
    default:
      return "Unknown";
  }
};

export const getStatusBadgeClass = (status: number) => {
  switch (status) {
    case ProblemStatuses.New:
      return "badge badge-info";
    case ProblemStatuses.FirstReview:
      return "badge badge-warning";
    case ProblemStatuses.SecondReview:
      return "badge badge-accent";
    case ProblemStatuses.Mastered:
      return "badge badge-success";
    default:
      return "badge badge-ghost";
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

// Problem sorting utilities
export const sortProblems = (
  problems: Problem[],
  sortBy: string,
  sortOrder: "asc" | "desc",
): Problem[] => {
  const sorted = [...problems].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortBy) {
      case "problem_number":
        aValue = a.problem_number;
        bValue = b.problem_number;
        break;
      case "title":
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case "difficulty":
        aValue = a.difficulty;
        bValue = b.difficulty;
        break;
      case "status":
        aValue = a.status;
        bValue = b.status;
        break;
      case "pattern":
        aValue = a.pattern.toLowerCase();
        bValue = b.pattern.toLowerCase();
        break;
      case "date_attempted":
      default:
        aValue = new Date(a.date_attempted).getTime();
        bValue = new Date(b.date_attempted).getTime();
        break;
    }

    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  return sorted;
};

export const getDifficultyLabel = (difficulty: number): string => {
  switch (difficulty) {
    case Difficulties.Easy:
      return "Easy";
    case Difficulties.Medium:
      return "Medium";
    case Difficulties.Hard:
      return "Hard";
    default:
      return "Unknown";
  }
};

export const getDifficultyValue = (label: string): number => {
  switch (label) {
    case "Easy":
      return 1;
    case "Medium":
      return 2;
    case "Hard":
      return 3;
    default:
      throw new Error("Invalid difficulty label");
  }
};

// Problem filtering utilities
// TODO: Fix at some point
// export const filterProblems = (
//   problems: Problem[],
//   filters: {
//     searchTerm?: string;
//     difficulty?: string;
//     status?: string;
//     pattern?: string;
//   },
// ): Problem[] => {
//   return problems.filter((problem) => {
//     // Search term filter
//     if (filters.searchTerm) {
//       const searchLower = filters.searchTerm.toLowerCase();
//       const matchesSearch =
//         problem.title.toLowerCase().includes(searchLower) ||
//         problem.problem_number.toString().includes(searchLower) ||
//         problem.pattern.toLowerCase().includes(searchLower) ||
//         problem.notes.toLowerCase().includes(searchLower);
//
//       if (!matchesSearch) return false;
//     }
//
//     // Difficulty filter
//     if (filters.difficulty && filters.difficulty !== "all") {
//       if (problem.difficulty !== filters.difficulty) return false;
//     }
//
//     // Status filter
//     if (filters.status && filters.status !== "all") {
//       if (problem.status !== filters.status) return false;
//     }
//
//     // Pattern filter
//     if (filters.pattern && filters.pattern !== "all") {
//       if (problem.pattern !== filters.pattern) return false;
//     }
//
//     return true;
//   });
// };

// Color and styling utilities
export const getHexDifficultyColor = (difficulty: Difficulty): string => {
  switch (difficulty) {
    case "Easy":
      return "#22c55e"; // green-500
    case "Medium":
      return "#f59e0b"; // amber-500
    case "Hard":
      return "#ef4444"; // red-500
    default:
      return "#6b7280"; // gray-500
  }
};

export const getHexStatusColor = (status: number): string => {
  switch (status) {
    case ProblemStatuses.New:
      return "#3b82f6"; // blue-500
    case ProblemStatuses.FirstReview:
      return "#f59e0b"; // amber-500
    case ProblemStatuses.SecondReview:
      return "#f97316"; // orange-500
    case ProblemStatuses.Mastered:
      return "#22c55e"; // green-500
    default:
      return "#6b7280"; // gray-500
  }
};

export const calculateStreak = (problems: Problem[]): number => {
  // This is a simplified streak calculation
  // In a real app, you'd want to track daily review activity
  const sortedProblems = problems
    .filter((p) => p.date_attempted)
    .sort(
      (a, b) =>
        new Date(b.date_attempted).getTime() -
        new Date(a.date_attempted).getTime(),
    );

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (const problem of sortedProblems) {
    const problemDate = new Date(problem.date_attempted);
    problemDate.setHours(0, 0, 0, 0);

    if (problemDate.getTime() === currentDate.getTime()) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};
