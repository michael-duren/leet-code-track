import { createSignal, createResource, For } from "solid-js";
import { ChartColumn, TrendingUp, Target, Calendar } from "lucide-solid";
import type { ProblemStats, PatternStats } from "../types/Problem";

const Analytics = () => {
  const [timeFilter, setTimeFilter] = createSignal("30");

  const [stats] = createResource<ProblemStats>(async () => {
    // TODO: Replace with actual API call
    return {
      total_problems: 45,
      mastered_count: 18,
      new_count: 20,
      first_review_count: 5,
      second_review_count: 2,
      easy_count: 20,
      medium_count: 20,
      hard_count: 5,
      reviews_due_today: 3,
    };
  });

  const [patternStats] = createResource<PatternStats[]>(async () => {
    // TODO: Replace with actual API call
    return [
      { pattern: "Array", count: 12, mastered: 8, mastery_percentage: 67 },
      { pattern: "Hash Table", count: 8, mastered: 6, mastery_percentage: 75 },
      { pattern: "Two Pointers", count: 6, mastered: 4, mastery_percentage: 67 },
      {
        pattern: "Dynamic Programming",
        count: 10,
        mastered: 3,
        mastery_percentage: 30,
      },
      { pattern: "Tree", count: 5, mastered: 4, mastery_percentage: 80 },
      {
        pattern: "Binary Search",
        count: 4,
        mastered: 3,
        mastery_percentage: 75,
      },
    ];
  });

  const [weeklyProgress] = createResource(async () => {
    // TODO: Replace with actual API call
    return {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      reviewsCompleted: [3, 5, 2, 8, 4, 6, 1],
      reviewsScheduled: [5, 6, 4, 10, 6, 8, 3],
    };
  });

  const masteryRate = () => {
    const s = stats();
    return s ? Math.round((s.mastered_count / s.total_problems) * 100) : 0;
  };

  const getDifficultyBreakdown = () => {
    const s = stats();
    if (!s) return [];

    return [
      {
        difficulty: "Easy",
        count: s.easy_count,
        percentage: Math.round((s.easy_count / s.total_problems) * 100),
      },
      {
        difficulty: "Medium",
        count: s.medium_count,
        percentage: Math.round((s.medium_count / s.total_problems) * 100),
      },
      {
        difficulty: "Hard",
        count: s.hard_count,
        percentage: Math.round((s.hard_count / s.total_problems) * 100),
      },
    ];
  };

  const getStatusBreakdown = () => {
    const s = stats();
    if (!s) return [];

    return [
      {
        status: "New",
        count: s.new_count,
        color: "bg-info",
        percentage: Math.round((s.new_count / s.total_problems) * 100),
      },
      {
        status: "First Review",
        count: s.first_review_count,
        color: "bg-warning",
        percentage: Math.round((s.first_review_count / s.total_problems) * 100),
      },
      {
        status: "Second Review",
        count: s.second_review_count,
        color: "bg-accent",
        percentage: Math.round((s.second_review_count / s.total_problems) * 100),
      },
      {
        status: "Mastered",
        count: s.mastered_count,
        color: "bg-success",
        percentage: Math.round((s.mastered_count / s.total_problems) * 100),
      },
    ];
  };

  return (
    <div class="space-y-8">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-3xl font-bold mb-2">Analytics Dashboard</h1>
          <p class="text-base-content/70">
            Track your progress and identify areas for improvement
          </p>
        </div>

        <div class="form-control">
          <select
            class="select select-bordered"
            value={timeFilter()}
            onChange={(e) => setTimeFilter(e.target.value)}
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="all">All time</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="stat bg-base-100 shadow rounded-box">
          <div class="stat-figure text-primary">
            <Target size={32} />
          </div>
          <div class="stat-title">Total Problems</div>
          <div class="stat-value text-primary">
            {stats()?.total_problems || 0}
          </div>
          <div class="stat-desc">Problems attempted</div>
        </div>

        <div class="stat bg-base-100 shadow rounded-box">
          <div class="stat-figure text-success">
            <TrendingUp size={32} />
          </div>
          <div class="stat-title">Mastery Rate</div>
          <div class="stat-value text-success">{masteryRate()}%</div>
          <div class="stat-desc">
            {stats()?.mastered_count || 0} problems mastered
          </div>
        </div>

        <div class="stat bg-base-100 shadow rounded-box">
          <div class="stat-figure text-warning">
            <Calendar size={32} />
          </div>
          <div class="stat-title">Due Today</div>
          <div class="stat-value text-warning">
            {stats()?.reviews_due_today || 0}
          </div>
          <div class="stat-desc">Ready for review</div>
        </div>

        <div class="stat bg-base-100 shadow rounded-box">
          <div class="stat-figure text-info">
            <ChartColumn size={32} />
          </div>
          <div class="stat-title">In Progress</div>
          <div class="stat-value text-info">
            {(stats()?.first_review_count || 0) +
              (stats()?.second_review_count || 0)}
          </div>
          <div class="stat-desc">Being reviewed</div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Difficulty Breakdown */}
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title">Difficulty Breakdown</h2>
            <div class="space-y-4">
              <For each={getDifficultyBreakdown()}>
                {(item) => (
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div
                        class={`w-4 h-4 rounded ${
                          item.difficulty === "Easy"
                            ? "bg-success"
                            : item.difficulty === "Medium"
                              ? "bg-warning"
                              : "bg-error"
                        }`}
                      ></div>
                      <span class="font-semibold">{item.difficulty}</span>
                    </div>
                    <div class="text-right">
                      <div class="font-bold">{item.count}</div>
                      <div class="text-sm text-base-content/70">
                        {item.percentage}%
                      </div>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </div>
        </div>

        {/* Status Progress */}
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title">Review Progress</h2>
            <div class="space-y-4">
              <For each={getStatusBreakdown()}>
                {(item) => (
                  <div>
                    <div class="flex justify-between items-center mb-2">
                      <span class="font-semibold">{item.status}</span>
                      <span>{item.count} problems</span>
                    </div>
                    <div class="w-full bg-base-300 rounded-full h-2">
                      <div
                        class={`h-2 rounded-full ${item.color}`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <div class="text-right text-sm text-base-content/70 mt-1">
                      {item.percentage}%
                    </div>
                  </div>
                )}
              </For>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title mb-6">Weekly Review Activity</h2>
          {weeklyProgress() && (
            <div class="grid grid-cols-7 gap-2 h-48">
              <For each={weeklyProgress()!.labels}>
                {(day, index) => {
                  const completed = weeklyProgress()!.reviewsCompleted[index()];
                  const scheduled = weeklyProgress()!.reviewsScheduled[index()];
                  const maxValue = Math.max(
                    ...weeklyProgress()!.reviewsScheduled,
                  );

                  return (
                    <div class="flex flex-col items-center">
                      <div class="flex flex-col-reverse flex-1 w-full gap-1">
                        <div
                          class="bg-success rounded-t w-full"
                          style={{
                            height: `${(completed / maxValue) * 100}%`,
                            "min-height": completed > 0 ? "8px" : "0px",
                          }}
                          title={`${completed} completed`}
                        ></div>
                        <div
                          class="bg-warning rounded-t w-full"
                          style={{
                            height: `${((scheduled - completed) / maxValue) * 100}%`,
                            "min-height":
                              scheduled - completed > 0 ? "8px" : "0px",
                          }}
                          title={`${scheduled - completed} remaining`}
                        ></div>
                      </div>
                      <div class="text-xs mt-2 font-semibold">{day}</div>
                    </div>
                  );
                }}
              </For>
            </div>
          )}
          <div class="flex justify-center gap-6 mt-4">
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 bg-success rounded"></div>
              <span class="text-sm">Completed</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 bg-warning rounded"></div>
              <span class="text-sm">Scheduled</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pattern Analysis */}
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title mb-6">Pattern Mastery Analysis</h2>
          <div class="overflow-x-auto">
            <table class="table table-zebra">
              <thead>
                <tr>
                  <th>Pattern</th>
                  <th>Total Problems</th>
                  <th>Mastered</th>
                  <th>Mastery Rate</th>
                  <th>Progress</th>
                </tr>
              </thead>
              <tbody>
                <For each={patternStats()}>
                  {(pattern) => (
                    <tr>
                      <td class="font-semibold">{pattern.pattern}</td>
                      <td>{pattern.count}</td>
                      <td class="text-success font-semibold">
                        {pattern.mastered}
                      </td>
                      <td>
                        <div
                          class={`badge ${
                            pattern.mastery_percentage >= 80
                              ? "badge-success"
                              : pattern.mastery_percentage >= 60
                                ? "badge-warning"
                                : "badge-error"
                          }`}
                        >
                          {pattern.mastery_percentage}%
                        </div>
                      </td>
                      <td>
                        <div class="w-24">
                          <div class="w-full bg-base-300 rounded-full h-2">
                            <div
                              class="h-2 rounded-full bg-primary"
                              style={{ width: `${pattern.mastery_percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div class="card bg-gradient-to-r from-primary to-secondary text-primary-content shadow-xl">
        <div class="card-body">
          <h2 class="card-title text-2xl">📊 Insights & Recommendations</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div class="bg-black/20 rounded p-4">
              <h3 class="font-bold mb-2">Strongest Areas</h3>
              <p class="text-sm opacity-90">
                You're doing great with Tree problems (80% mastery). Keep it up!
              </p>
            </div>
            <div class="bg-black/20 rounded p-4">
              <h3 class="font-bold mb-2">Areas to Focus</h3>
              <p class="text-sm opacity-90">
                Dynamic Programming needs attention (30% mastery). Consider more
                practice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

