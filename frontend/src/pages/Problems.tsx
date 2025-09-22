import { createSignal, createResource, For } from "solid-js";
import { Calendar } from "lucide-solid";
import { useNavigate } from "@solidjs/router";
import { useApi } from "../api/agent";
import {
  getDifficultyBadgeClass,
  getDifficultyLabel,
  getShorthandStatus,
  getStatusBadgeClass,
  getStatusLabel,
} from "../utils/problems";
import clsx from "clsx";
import { handleApiCall } from "../api/call-handler";
import { useKeyedLoaders } from "../api/use-loaders";
import SimpleTable from "../components/Table";
import { formatToReadableDate } from "../utils/dates";
import SearchTextInput from "../components/SearchTextInput";
import Select from "../components/Select";
import Button from "../components/Button";
import Badge from "../components/Badge";
import Card from "../components/Card";
import Pagination from "../components/Pagination";

const Problems = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = createSignal("");
  const [difficultyFilter, setDifficultyFilter] = createSignal("all");
  const [statusFilter, setStatusFilter] = createSignal("all");
  const [currentPage, setCurrentPage] = createSignal(1);
  const pageSize = 10;
  const api = useApi();
  const loaderKeys = ["handleDeleteLoading"] as const;
  const { setLoading, isLoading } = useKeyedLoaders(loaderKeys);

  const [problems, { mutate: mutateProblems }] = createResource(
    api.Problems.list,
  );

  const filteredProblems = () => {
    const allProblems = problems() || [];
    return allProblems.filter((problem) => {
      const matchesSearch =
        !searchTerm() ||
        problem.title.toLowerCase().includes(searchTerm().toLowerCase()) ||
        problem.problem_number.toString().includes(searchTerm());

      const matchesDifficulty =
        difficultyFilter() === "all" ||
        getDifficultyLabel(problem.difficulty) === difficultyFilter();

      const matchesStatus =
        statusFilter() === "all" ||
        getStatusLabel(problem.status) === statusFilter();

      return matchesSearch && matchesDifficulty && matchesStatus;
    });
  };

  const paginatedProblems = () => {
    const filtered = filteredProblems();
    const startIndex = (currentPage() - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filtered.slice(startIndex, endIndex);
  };

  const totalPages = () => Math.ceil(filteredProblems().length / pageSize);

  const clearFilters = () => {
    setSearchTerm("");
    setDifficultyFilter("all");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  function handleDelete(id: number): void {
    handleApiCall({
      fn: () => api.Problems.delete(id),
      loadingSetter: (loading: boolean) =>
        setLoading("handleDeleteLoading", id, loading),
      action: "delete problem",
      resultProcessor: () => {
        mutateProblems((probs) => probs?.filter((p) => p.id !== id) || []);
      },
    });
  }

  const handleViewProblem = (id: number) => {
    navigate(`/problem/${id}`);
  };

  const handleEditProblem = (id: number) => {
    navigate(`/problem/${id}?mode=edit`);
  };

  return (
    <div class="flex flex-col gap-8">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-3xl font-bold">All Problems</h1>
          <p class="text-base-content/70">
            Showing {filteredProblems().length} of {problems()?.length || 0}{" "}
            problems
          </p>
        </div>
      </div>

      <Card variant="base-200" shadow="sm" padding="md">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-center w-full">
          <SearchTextInput
            value={searchTerm()}
            onInput={(v) => setSearchTerm(v)}
          />
          {/* Difficulty Filter */}
          <Select
            hideLabel
            value={difficultyFilter()}
            onInput={(v) => setDifficultyFilter(v)}
            label="Difficulty"
            name="difficulty"
            errors={{}}
            options={[
              { value: "all", label: "All Difficulties" },
              { value: "Easy", label: "Easy" },
              { value: "Medium", label: "Medium" },
              { value: "Hard", label: "Hard" },
            ]}
          />
          <Select
            hideLabel
            value={statusFilter()}
            onInput={(v) => setStatusFilter(v)}
            label="Status"
            name="status"
            errors={{}}
            options={[
              { value: "all", label: "All Statuses" },
              { value: "New", label: "New" },
              { value: "FirstReview", label: "First Review" },
              { value: "SecondReview", label: "Second Review" },
              { value: "Mastered", label: "Mastered" },
            ]}
          />

          <div>
            <Button variant="secondary" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      <Card variant="base-100" shadow="xl" padding="none">
        {problems.loading && (
          <div class="p-8 text-center">
            <div class="loading loading-spinner loading-lg"></div>
            <p class="mt-4">Loading problems...</p>
          </div>
        )}

        {filteredProblems().length === 0 && !problems.loading && (
          <div class="p-8 text-center">
            <div class="text-6xl mb-4">🔍</div>
            <h3 class="text-xl font-semibold mb-2">No problems found</h3>
            <p class="text-base-content/70">
              Try adjusting your filters or search term.
            </p>
          </div>
        )}

        {filteredProblems().length > 0 && (
          <>
            <div class="hidden md:block overflow-x-auto">
              <SimpleTable
                columns={[
                  {
                    key: "problem_number",
                    label: "Problem #",
                    render: ({ problem_number }) => (
                      <td class="font-mono">{problem_number}</td>
                    ),
                  },
                  {
                    key: "title",
                    label: "Title",
                    render: ({ title, id }) => (
                      <td
                        class="font-semibold hover:underline cursor-pointer"
                        onClick={() => handleViewProblem(id)}
                      >
                        {title}
                      </td>
                    ),
                  },
                  {
                    key: "difficulty",
                    label: "Difficulty",
                    render: ({ difficulty }) => (
                      <Badge class={getDifficultyBadgeClass(difficulty)}>
                        {getDifficultyLabel(difficulty)}
                      </Badge>
                    ),
                  },
                  {
                    key: "status",
                    label: "Status",
                    render: ({ status }) => (
                      <Badge
                        size="xl"
                        class={clsx(getStatusBadgeClass(status), "text-xs")}
                      >
                        {getShorthandStatus(status)}
                      </Badge>
                    ),
                  },
                  {
                    key: "pattern",
                    label: "Pattern",
                    render: ({ pattern }) => (
                      <For each={pattern.split(" ")}>
                        {(p) => <kbd class="text-xs kbd">{p}</kbd>}
                      </For>
                    ),
                  },
                  {
                    key: "date_attempted",
                    label: "Date Attempted",
                    render: ({ date_attempted }) => (
                      <span>{formatToReadableDate(date_attempted)}</span>
                    ),
                  },
                ]}
                actions={(problem) => (
                  <div class="flex flex-col gap-2">
                    <Button
                      variant="primary"
                      size="xs"
                      onClick={() => handleEditProblem(problem.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="error"
                      size="xs"
                      onClick={() => handleDelete(problem.id)}
                      disabled={isLoading("handleDeleteLoading", problem.id)}
                    >
                      Delete
                    </Button>
                  </div>
                )}
                data={paginatedProblems()}
              />
            </div>

            <div class="md:hidden p-4 space-y-4">
              <For each={paginatedProblems()}>
                {(problem) => (
                  <Card variant="base-200" shadow="sm" padding="md">
                    <div class="flex items-start justify-between mb-3">
                      <div class="flex items-center gap-2">
                        <Badge variant="outline" class="font-mono">
                          #{problem.problem_number}
                        </Badge>
                        <h3
                          class="font-semibold hover:underline cursor-pointer"
                          onClick={() => handleViewProblem(problem.id)}
                        >
                          {problem.title}
                        </h3>
                      </div>
                      <Badge
                        class={getDifficultyBadgeClass(problem.difficulty)}
                      >
                        {problem.difficulty}
                      </Badge>
                    </div>
                    <div class="flex flex-wrap items-center gap-2 mb-3">
                      <Badge class={getStatusBadgeClass(problem.status)}>
                        {problem.status}
                      </Badge>
                      <Badge variant="outline">{problem.pattern}</Badge>
                    </div>
                    <div class="text-sm text-base-content/70 mb-3">
                      <span>
                        <Calendar />
                      </span>
                      Attempted:{" "}
                      {new Date(problem.date_attempted).toLocaleDateString()}
                    </div>
                    <div class="flex gap-2">
                      <Button
                        variant="primary"
                        size="xs"
                        onClick={() => handleEditProblem(problem.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="error"
                        size="xs"
                        onClick={() => handleDelete(problem.id)}
                        disabled={isLoading("handleDeleteLoading", problem.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </Card>
                )}
              </For>
            </div>

            {totalPages() > 1 && (
              <Pagination
                currentPage={currentPage()}
                totalPages={totalPages()}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default Problems;
