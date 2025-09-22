import { createResource } from "solid-js";
import { useApi } from "../api/agent";
import { handleApiCall } from "../api/call-handler";
import { useKeyedLoaders } from "../api/use-loaders";
import Card from "../components/Card";
import { ProblemStatuses, type Problem } from "../types/Problem";
import ProblemCardList from "../components/ProblemCardList";

const Dashboard = () => {
  const api = useApi();
  const [todaysProblems, { mutate: mutateReviewProblems }] = createResource(
    api.Problems.listToday,
  );
  const [upcomingProblems] = createResource(api.Problems.listProblemsToReview);
  const [stats] = createResource(api.Problems.getStats);
  const loaderKeys = [
    "handleMarkReviewLoading",
    "handleNeedsMoreReviewLoading",
  ] as const;
  const { setLoading, isLoading } = useKeyedLoaders(loaderKeys);

  const handleMarkReviewed = async (problem: Problem) => {
    handleApiCall({
      fn: () => {
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
      resultProcessor: () => {
        mutateReviewProblems((p) => {
          if (!p) return p;
          return p
            .map((pr) => {
              if (
                pr.id === problem.id &&
                pr.status < ProblemStatuses.Mastered
              ) {
                return { ...pr, status: pr.status + 1 };
              }
              return pr;
            })
            .filter((pr) => pr.status < ProblemStatuses.Mastered);
        });
      },
    });
  };

  const handleNeedsMoreReview = (problemId: number) => {
    handleApiCall({
      fn: () => api.Problems.resetReviewTimer(problemId),
      loadingSetter: (val: boolean) =>
        setLoading("handleNeedsMoreReviewLoading", problemId, val),
      action: "reset review timer",
      resultProcessor: () => {
        mutateReviewProblems((p) => {
          if (!p) return p;

          return p.map((pr) => {
            if (pr.id === problemId && pr.status > ProblemStatuses.New) {
              return { ...pr, status: pr.status - 1 };
            }
            return pr;
          });
        });
      },
    });
  };

  return (
    <div class="space-y-8">
      {/* Hero Section */}
      <Card variant="base-200" class="hero rounded-lg">
        <div class="hero-content text-center">
          <div class="max-w-md">
            <h1 class="text-5xl font-bold">Welcome Back!</h1>
            <p class="py-6">
              You have {todaysProblems()?.length || 0} problems due for review
              today. Keep up the great work! 🚀
            </p>
          </div>
        </div>
      </Card>

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
            {todaysProblems()?.length || 0}
          </div>
          <div class="stat-desc">Ready for review</div>
        </div>
      </div>

      <ProblemCardList
        problems={todaysProblems() || []}
        isLoading={isLoading}
        handleMarkReviewed={handleMarkReviewed}
        handleNeedsMoreReview={handleNeedsMoreReview}
        title={"Today's Review Queue"}
      />
      <ProblemCardList
        problems={upcomingProblems() || []}
        isLoading={isLoading}
        handleMarkReviewed={handleMarkReviewed}
        handleNeedsMoreReview={handleNeedsMoreReview}
        title={"Upcoming Reviews"}
      />
    </div>
  );
};

export default Dashboard;
