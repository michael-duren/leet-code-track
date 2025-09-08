import { createResource, For } from 'solid-js';
import type { ProblemWithReviewInfo, ProblemStats } from '../types/Problem';

const Dashboard = () => {
  const [reviewProblems] = createResource<ProblemWithReviewInfo[]>(async () => {
    // TODO: Replace with actual API call
    return [
      {
        id: 1,
        problemNumber: 1,
        title: "Two Sum",
        difficulty: "Easy" as const,
        dateAttempted: "2025-01-01",
        status: "FirstReview" as const,
        pattern: "Hash Table",
        notes: "Classic two pointer approach",
        nextReviewDate: "2025-01-04",
        reviewStatus: "Due" as const,
        isReviewDue: true,
      },
      {
        id: 2,
        problemNumber: 15,
        title: "3Sum",
        difficulty: "Medium" as const,
        dateAttempted: "2025-01-02",
        status: "New" as const,
        pattern: "Two Pointers",
        notes: "Remember to handle duplicates",
        nextReviewDate: "2025-01-05",
        reviewStatus: "Due" as const,
        isReviewDue: true,
      }
    ];
  });

  const [stats] = createResource<ProblemStats>(async () => {
    // TODO: Replace with actual API call
    return {
      totalProblems: 25,
      masteredCount: 8,
      newCount: 12,
      firstReviewCount: 3,
      secondReviewCount: 2,
      easyCount: 10,
      mediumCount: 12,
      hardCount: 3,
      reviewsDueToday: 2,
    };
  });

  const getDifficultyBadgeClass = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'badge badge-success';
      case 'Medium':
        return 'badge badge-warning';
      case 'Hard':
        return 'badge badge-error';
      default:
        return 'badge badge-ghost';
    }
  };

  const handleMarkReviewed = (problemId: number) => {
    // TODO: Implement API call to mark problem as reviewed
    console.log('Marking problem as reviewed:', problemId);
  };

  const handleNeedsMoreReview = (problemId: number) => {
    // TODO: Implement API call to reset review status
    console.log('Problem needs more review:', problemId);
  };

  return (
    <div class="space-y-8">
      {/* Hero Section */}
      <div class="hero bg-base-200 rounded-lg">
        <div class="hero-content text-center">
          <div class="max-w-md">
            <h1 class="text-5xl font-bold">Welcome Back!</h1>
            <p class="py-6">
              You have {stats()?.reviewsDueToday || 0} problems due for review today.
              Keep up the great work! 🚀
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div class="stats stats-vertical lg:stats-horizontal shadow w-full">
        <div class="stat">
          <div class="stat-figure text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="stat-title">Total Problems</div>
          <div class="stat-value text-primary">{stats()?.totalProblems || 0}</div>
          <div class="stat-desc">Problems attempted</div>
        </div>

        <div class="stat">
          <div class="stat-figure text-success">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="stat-title">Mastered</div>
          <div class="stat-value text-success">{stats()?.masteredCount || 0}</div>
          <div class="stat-desc">
            {stats() ? Math.round((stats()!.masteredCount / stats()!.totalProblems) * 100) : 0}% completion rate
          </div>
        </div>

        <div class="stat">
          <div class="stat-figure text-warning">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
          </div>
          <div class="stat-title">Due Today</div>
          <div class="stat-value text-warning">{stats()?.reviewsDueToday || 0}</div>
          <div class="stat-desc">Ready for review</div>
        </div>
      </div>

      {/* Review Queue */}
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title text-2xl mb-4">
            Today's Review Queue
            <div class="badge badge-secondary">{reviewProblems()?.length || 0}</div>
          </h2>
          
          {reviewProblems.loading && (
            <div class="space-y-4">
              {[1, 2, 3].map(() => (
                <div class="card bg-base-200 animate-pulse">
                  <div class="card-body h-32"></div>
                </div>
              ))}
            </div>
          )}
          
          {reviewProblems() && reviewProblems()!.length === 0 && (
            <div class="text-center py-8">
              <div class="text-6xl mb-4">🎉</div>
              <h3 class="text-xl font-semibold mb-2">All caught up!</h3>
              <p class="text-base-content/70">No problems due for review today. Great job!</p>
            </div>
          )}

          <div class="grid gap-4">
            <For each={reviewProblems()}>
              {(problem) => (
                <div class="card bg-base-200 shadow-md">
                  <div class="card-body">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div class="flex-1">
                        <div class="flex items-center gap-3 mb-2">
                          <div class="badge badge-outline font-mono text-sm">
                            #{problem.problemNumber}
                          </div>
                          <h3 class="font-semibold text-lg">{problem.title}</h3>
                          <div class={getDifficultyBadgeClass(problem.difficulty)}>
                            {problem.difficulty}
                          </div>
                        </div>
                        <div class="flex items-center gap-4 text-sm text-base-content/70">
                          <div class="badge badge-ghost">{problem.pattern}</div>
                          <span>Status: {problem.status}</span>
                        </div>
                        {problem.notes && (
                          <div class="mt-2 text-sm bg-base-300 p-3 rounded">
                            <strong>Notes:</strong> {problem.notes}
                          </div>
                        )}
                      </div>
                      <div class="flex flex-col sm:flex-row gap-2">
                        <button
                          class="btn btn-success btn-sm"
                          onClick={() => handleMarkReviewed(problem.id)}
                        >
                          ✅ Mark Reviewed
                        </button>
                        <button
                          class="btn btn-warning btn-sm"
                          onClick={() => handleNeedsMoreReview(problem.id)}
                        >
                          🔄 Need More Review
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </For>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;