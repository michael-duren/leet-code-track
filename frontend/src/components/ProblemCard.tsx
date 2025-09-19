import type { ProblemCardProps } from "../types/Problem";
import { Calendar, PenLine, EllipsisVertical } from "lucide-solid";

const ProblemCard = (props: ProblemCardProps) => {
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

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "New":
        return "badge badge-info";
      case "FirstReview":
        return "badge badge-warning";
      case "SecondReview":
        return "badge badge-accent";
      case "Mastered":
        return "badge badge-success";
      default:
        return "badge badge-ghost";
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Not scheduled";
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = () => {
    if (!props.problem.next_review_date) return false;
    const reviewDate = new Date(props.problem.next_review_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    reviewDate.setHours(0, 0, 0, 0);
    return reviewDate < today;
  };

  return (
    <div
      class={`card bg-base-100 shadow-md hover:shadow-lg transition-shadow ${
        props.problem.is_review_due ? "ring-2 ring-warning ring-opacity-50" : ""
      }`}
    >
      <div class="card-body p-4">
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-2 flex-wrap">
            <div class="badge badge-outline font-mono text-xs">
              #{props.problem.problem_number}
            </div>
            <h3 class="font-semibold text-lg leading-tight">
              {props.problem.title}
            </h3>
            <div class={getDifficultyBadgeClass(props.problem.difficulty)}>
              {props.problem.difficulty}
            </div>
          </div>

          {props.on_edit && (
            <div class="dropdown dropdown-end">
              <label tabindex={0} class="btn btn-ghost btn-sm btn-square">
                <EllipsisVertical size={16} />
              </label>
              <ul
                tabindex={0}
                class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-32"
              >
                <li>
                  <button onClick={() => props.on_edit!(props.problem.id)}>
                    <PenLine size={14} />
                    Edit
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>

        <div class="flex items-center gap-2 mb-3">
          <div class={getStatusBadgeClass(props.problem.status)}>
            {props.problem.status}
          </div>
          <div class="badge badge-outline text-xs">{props.problem.pattern}</div>
        </div>

        {/* Review Status */}
        <div class="flex items-center gap-2 text-sm mb-3">
          <Calendar size={14} />
          <span class="text-base-content/70">Next Review:</span>
          <span class={isOverdue() ? "text-error font-medium" : ""}>
            {formatDate(props.problem.next_review_date)}
          </span>
          {isOverdue() && <div class="badge badge-error badge-xs">Overdue</div>}
        </div>

        {/* Notes Preview */}
        {props.problem.notes && (
          <div class="collapse collapse-arrow bg-base-200 mb-3">
            <input type="checkbox" />
            <div class="collapse-title text-sm font-medium">Notes</div>
            <div class="collapse-content text-sm">
              <p>{props.problem.notes}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div class="card-actions justify-end">
          {props.problem.status !== "Mastered" && (
            <>
              <button
                class="btn btn-success btn-sm"
                onClick={() => props.on_mark_reviewed(props.problem.id)}
              >
                ✅ Mark Reviewed
              </button>
              <button
                class="btn btn-warning btn-sm"
                onClick={() => props.on_needs_more_review(props.problem.id)}
              >
                🔄 More Review
              </button>
            </>
          )}
          {props.problem.status === "Mastered" && (
            <div class="btn btn-success btn-sm cursor-not-allowed opacity-50">
              🏆 Mastered
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemCard;

