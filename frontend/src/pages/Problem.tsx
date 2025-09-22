import { createSignal, createResource, Match, Switch } from "solid-js";
import { useParams, useNavigate, useSearchParams } from "@solidjs/router";
import { CircleAlertIcon, ArrowLeft } from "lucide-solid";
import type {
  CreateProblemRequest,
  UpdateProblemRequest,
  Problem,
} from "../types/Problem";
import { useApi } from "../api/agent";
import { handleApiCall } from "../api/call-handler";
import { useKeyedLoaders } from "../api/use-loaders";
import ProblemForm from "../components/ProblemForm";
import ProblemDetails from "../components/ProblemDetails";
import Card from "../components/Card";
import Button from "../components/Button";

type ProblemMode = "view" | "edit" | "create";

const ProblemPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const api = useApi();

  const [mode, setMode] = createSignal<ProblemMode>(
    searchParams.mode === "edit" ? "edit" : params.id ? "view" : "create",
  );
  const [errors, setErrors] = createSignal<Record<string, string>>({});

  const loaderKeys = ["submitLoading", "deleteLoading"] as const;
  const { setLoading, isLoading } = useKeyedLoaders(loaderKeys);

  // Load problem data when viewing or editing
  const [problem, { mutate: mutateProblem }] = createResource(
    () => (params.id && mode() !== "create" ? parseInt(params.id) : null),
    (id) => api.Problems.getById(id),
  );

  const getPageTitle = () => {
    switch (mode()) {
      case "create":
        return "Add New Problem";
      case "edit":
        return "Edit Problem";
      case "view":
        return problem()?.title || "Problem Details";
      default:
        return "Problem";
    }
  };

  const getPageDescription = () => {
    switch (mode()) {
      case "create":
        return "Track a new LeetCode problem in your spaced repetition system";
      case "edit":
        return "Update problem details";
      case "view":
        return `Problem #${problem()?.problem_number}`;
      default:
        return "";
    }
  };

  const handleFormSubmit = async (
    data: CreateProblemRequest | UpdateProblemRequest,
  ) => {
    // TODO: Add client-side validation if needed
    setErrors({});

    await handleApiCall({
      fn: async () => {
        if (mode() === "create") {
          return await api.Problems.create(data as CreateProblemRequest);
        } else {
          return await api.Problems.update(data as UpdateProblemRequest);
        }
      },
      loadingSetter: (loading: boolean) =>
        setLoading("submitLoading", problem()?.id || 0, loading),
      action: mode() === "create" ? "create problem" : "update problem",
      resultProcessor: () => {
        if (mode() === "create") {
          navigate("/problems");
        } else {
          setMode("view");
          mutateProblem(
            (p) => ({ ...p!, ...(data as UpdateProblemRequest) }) as Problem,
          );
          navigate(`/problem/${params.id}`, { replace: true });
        }
      },
    });
  };

  const handleFormCancel = () => {
    if (mode() === "create") {
      navigate("/problems");
    } else if (mode() === "edit") {
      setMode("view");
      navigate(`/problem/${params.id}`, { replace: true });
    }
  };

  const handleEdit = () => {
    setMode("edit");
    navigate(`/problem/${params.id}?mode=edit`, { replace: true });
  };

  const handleDelete = async () => {
    if (!problem()) return;

    const confirmed = confirm(
      `Are you sure you want to delete "${problem()!.title}"? This action cannot be undone.`,
    );
    if (!confirmed) return;

    await handleApiCall({
      fn: () => api.Problems.delete(problem()!.id),
      loadingSetter: (loading: boolean) =>
        setLoading("deleteLoading", problem()?.id || 0, loading),
      action: "delete problem",
      resultProcessor: () => {
        navigate("/problems");
      },
    });
  };

  const handleDeleteNote = async (noteId: number) => {
    // TODO: Implement when backend supports notes
    console.log("Delete note", noteId);
  };

  const handleBackToList = () => {
    navigate("/problems");
  };

  return (
    <div class="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div class="flex items-center justify-between w-full gap-4">
        <div class="">
          <h1 class="text-3xl font-bold">{getPageTitle()}</h1>
          <p class="text-base-content/70">{getPageDescription()}</p>
        </div>
        <div>
          <Button variant="outline" size="sm" onClick={handleBackToList}>
            <ArrowLeft size={16} />
            Back to Problems
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {errors().submit && (
        <div class="alert alert-error">
          <CircleAlertIcon size={20} />
          <span>{errors().submit}</span>
        </div>
      )}

      {/* Loading State */}
      {problem.loading && mode() !== "create" && (
        <Card variant="base-100" shadow="xl">
          <div class="p-8 text-center">
            <div class="loading loading-spinner loading-lg"></div>
            <p class="mt-4">Loading problem...</p>
          </div>
        </Card>
      )}

      {/* Error State */}
      {problem.error && (
        <Card variant="base-100" shadow="xl">
          <div class="p-8 text-center">
            <div class="text-6xl mb-4">⚠️</div>
            <h3 class="text-xl font-semibold mb-2">Problem not found</h3>
            <p class="text-base-content/70 mb-4">
              The problem you're looking for doesn't exist or has been deleted.
            </p>
            <Button variant="primary" onClick={handleBackToList}>
              Back to Problems
            </Button>
          </div>
        </Card>
      )}

      {/* Content based on mode */}
      {!problem.loading && !problem.error && (
        <Switch>
          <Match when={mode() === "create" || mode() === "edit"}>
            <ProblemForm
              problem={mode() === "edit" ? problem() : undefined}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
              isLoading={isLoading("submitLoading", problem()?.id || 0)}
            />

            {/* Quick Tips for create mode */}
            {mode() === "create" && (
              <Card variant="base-200">
                <h3 class="card-title text-lg">💡 Quick Tips</h3>
                <ul class="list-disc list-inside space-y-1 text-sm">
                  <li>
                    Use specific problem numbers from LeetCode for easy
                    reference
                  </li>
                  <li>
                    Choose patterns that help you categorize and recall
                    solutions
                  </li>
                  <li>
                    Add notes about your approach, time complexity, or mistakes
                    made
                  </li>
                  <li>
                    The system will automatically schedule reviews using spaced
                    repetition
                  </li>
                </ul>
              </Card>
            )}
          </Match>

          <Match when={mode() === "view" && problem()}>
            <ProblemDetails
              problem={problem()!}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onDeleteNote={handleDeleteNote}
              isDeleting={isLoading("deleteLoading", problem()?.id || 0)}
            />
          </Match>
        </Switch>
      )}
    </div>
  );
};

export default ProblemPage;

