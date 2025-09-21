import { createEffect, createResource, For } from "solid-js";
import { useApi } from "../api/agent";
import { handleApiCall } from "../api/call-handler";
import { useKeyedLoaders } from "../api/use-loaders";
import Button from "../components/Button";
import { ProblemStatuses, type Problem } from "../types/Problem";

const Dashboard = () => {
  const api = useApi();
  const [reviewProblems] = createResource(api.Problems.listProblemsToReview);
  const [stats] = createResource(api.Problems.getStats);
  const loaderKeys = [
    "handleMarkReviewLoading",
    "handleNeedsMoreReviewLoading",
  ] as const;
  const { setLoading, isLoading } = useKeyedLoaders(loaderKeys);

  const getDifficultyBadgeClass = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "badge badge-success";
      case "Medium":
        return "badge badge-warning";
      case "Hard":
        return "badge badge-error";
      default:
        return "badge badge-ghost";
    }
  };
  const handleMarkReviewed = async (problem: Problem) => {
    handleApiCall({
      fn: () => {
        console.log("Marking problem as reviewed:", problem);
        switch (problem.status) {
          case ProblemStatuses.New:
            return api.Problems.updateForFirstReview(problem.id);
          case ProblemStatuses.FirstReview:
            return api.Problems.updateForSecondReview(problem.id);
          case ProblemStatuses.SecondReview:
            return api.Problems.updateForMasterReview(problem.id);
          default:
            throw new Error("Problem is already mastered.");
        }
      },
      loadingSetter: (val: boolean) =>
        setLoading("handleMarkReviewLoading", problem.id, val),
      action: "mark problem as reviewed",
    });
  };

  const handleNeedsMoreReview = (problemId: number) => {
    handleApiCall({
      fn: () => api.Problems.resetReviewTimer(problemId),
      loadingSetter: (val: boolean) =>
        setLoading("handleNeedsMoreReviewLoading", problemId, val),
      action: "reset review timer",
    });
  };
  createEffect(() => {
    console.log("Review Problems:", reviewProblems());
  });

  createEffect(() => {
    console.log("stats", stats());
  });

  return (
    <div class="space-y-8">
      {/* Hero Section */}
      <div class="hero bg-base-200 rounded-lg">
        <div class="hero-content text-center">
          <div class="max-w-md">
            <h1 class="text-5xl font-bold">Welcome Back!</h1>
            <p class="py-6">
              You have {stats()?.reviews_due_today || 0} problems due for review
              today. Keep up the great work! 🚀
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div class="stats stats-vertical lg:stats-horizontal shadow w-full">
        <div class="stat">
          <div class="stat-figure text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="inline-block w-8 h-8 stroke-current"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <div class="stat-title">Total Problems</div>
          <div class="stat-value text-primary">
            {stats()?.total_problems || 0}
          </div>
          <div class="stat-desc">Problems attempted</div>
        </div>

        <div class="stat">
          <div class="stat-figure text-success">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="inline-block w-8 h-8 stroke-current"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <div class="stat-title">Mastered</div>
          <div class="stat-value text-success">
            {stats()?.mastered_count || 0}
          </div>
          <div class="stat-desc">
            {stats()
              ? Math.round(
                  (stats()!.mastered_count / stats()!.total_problems) * 100,
                )
              : 0}
            % completion rate
          </div>
        </div>

        <div class="stat">
          <div class="stat-figure text-warning">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="inline-block w-8 h-8 stroke-current"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
          </div>
          <div class="stat-title">Due Today</div>
          <div class="stat-value text-warning">
            {stats()?.reviews_due_today || 0}
          </div>
          <div class="stat-desc">Ready for review</div>
        </div>
      </div>

      {/* Review Queue */}
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title text-2xl mb-4">
            Today's Review Queue
            <div class="badge badge-secondary">
              {reviewProblems()?.length || 0}
            </div>
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
              <p class="text-base-content/70">
                No problems due for review today. Great job!
              </p>
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
                            #{problem.problem_number}
                          </div>
                          <h3 class="font-semibold text-lg">{problem.title}</h3>
                          <div
                            class={getDifficultyBadgeClass(problem.difficulty)}
                          >
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
                        <Button
                          loading={isLoading(
                            "handleMarkReviewLoading",
                            problem.id,
                          )}
                          style="btn btn-success btn-sm"
                          onClick={() => handleMarkReviewed(problem)}
                          disabled={problem.status === ProblemStatuses.Mastered}
                        >
                          ✅ Mark Reviewed
                        </Button>
                        <Button
                          loading={isLoading(
                            "handleMarkReviewLoading",
                            problem.id,
                          )}
                          style="btn-warning btn-sm"
                          onClick={() => handleNeedsMoreReview(problem.id)}
                        >
                          🔄 Need More Review
                        </Button>
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
