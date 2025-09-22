import { For, Show, type Component } from "solid-js";
import { type Problem, ProblemStatuses } from "../types/Problem";
import { getDifficultyBadgeClass, getDifficultyLabel } from "../utils/problems";
import Button from "./Button";
import Card from "./Card";
import Badge from "./Badge";
import clsx from "clsx";
import { isPast, isToday } from "../utils/dates";
import KeyValue from "./KeyValue";

type ProblemWithReviewDate = Problem & { next_review_date?: string };

interface ProblemCardListProps {
  problems: ProblemWithReviewDate[];
  isLoading: (
    key: "handleMarkReviewLoading" | "handleNeedsMoreReviewLoading",
    id: number,
  ) => boolean;
  handleMarkReviewed: (problem: Problem) => Promise<void>;
  handleNeedsMoreReview: (problemId: number) => void;
  title: string;
}
const ProblemCardList: Component<ProblemCardListProps> = (props) => {
  return (
    <Card variant="base-100" shadow="xl">
      <h2 class="card-title text-2xl mb-4">
        {props.title}
        <Badge variant="secondary">{props.problems.length || 0}</Badge>
      </h2>

      {props.problems.length === 0 && (
        <div class="text-center py-8">
          <div class="text-6xl mb-4">🎉</div>
          <h3 class="text-xl font-semibold mb-2">All caught up!</h3>
          <p class="text-base-content/70">
            No problems due for review today. Great job!
          </p>
        </div>
      )}
      <div class="grid gap-4">
        <For each={props.problems}>
          {(problem) => (
            <Card variant="base-200" shadow="md">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <Badge variant="outline" class="font-mono text-sm">
                      #{problem.problem_number}
                    </Badge>
                    <h3 class="font-semibold text-lg">{problem.title}</h3>
                    <KeyValue
                      label="Difficulty"
                      value={
                        <Badge
                          class={getDifficultyBadgeClass(problem.difficulty)}
                        >
                          {getDifficultyLabel(problem.difficulty)}
                        </Badge>
                      }
                    />
                    <Show when={problem.next_review_date}>
                      <KeyValue
                        label="Due:"
                        value={
                          <div
                            class={clsx(
                              isToday(problem.next_review_date ?? "")
                                ? "badge-warning"
                                : isPast(problem.next_review_date ?? "")
                                  ? "badge-error"
                                  : "badge-primary",
                              "ml-auto text-xs font-semibold badge",
                            )}
                          >
                            {new Date(
                              problem?.next_review_date ?? "",
                            ).toLocaleDateString()}
                          </div>
                        }
                      />
                    </Show>
                  </div>
                  <div class="flex items-center gap-4 text-sm text-base-content/70">
                    <Badge variant="ghost">{problem.pattern}</Badge>
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
                    variant="success"
                    size="sm"
                    loading={props.isLoading(
                      "handleMarkReviewLoading",
                      problem.id,
                    )}
                    onClick={() => props.handleMarkReviewed(problem)}
                    disabled={problem.status === ProblemStatuses.Mastered}
                  >
                    ✅ Mark Reviewed
                  </Button>
                  <Button
                    variant="warning"
                    size="sm"
                    loading={props.isLoading(
                      "handleNeedsMoreReviewLoading",
                      problem.id,
                    )}
                    onClick={() => props.handleNeedsMoreReview(problem.id)}
                    disabled={problem.status === ProblemStatuses.New}
                  >
                    🔄 Need More Review
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </For>
      </div>
    </Card>
  );
};

export default ProblemCardList;
