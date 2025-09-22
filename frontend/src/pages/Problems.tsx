import { createSignal, createResource, For } from "solid-js";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-solid";
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

const Problems = () => {
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

  return (
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-3xl font-bold">All Problems</h1>
          <p class="text-base-content/70">
            Showing {filteredProblems().length} of {problems()?.length || 0}{" "}
            problems
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div class="card bg-base-200 shadow-sm">
        <div class="card-body p-4">
          <div class="flex flex-col lg:flex-row gap-4">
            <SearchTextInput
              value={searchTerm()}
              onInput={(v) => setSearchTerm(v)}
            />
            {/* Difficulty Filter */}
            <Select
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
            {/* Status Filter */}
            <div class="form-control w-full lg:w-auto">
              <select
                class="select select-bordered"
                value={statusFilter()}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="New">New</option>
                <option value="FirstReview">First Review</option>
                <option value="SecondReview">Second Review</option>
                <option value="Mastered">Mastered</option>
              </select>
            </div>

            {/* Clear Filters */}
            <button class="btn btn-ghost" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Problems Table */}
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body p-0">
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
              {/* Desktop Table */}
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
                      render: ({ title }) => (
                        <td class="font-semibold">{title}</td>
                      ),
                    },
                    {
                      key: "difficulty",
                      label: "Difficulty",
                      render: ({ difficulty }) => (
                        <div class={getDifficultyBadgeClass(difficulty)}>
                          {getDifficultyLabel(difficulty)}
                        </div>
                      ),
                    },
                    {
                      key: "status",
                      label: "Status",
                      render: ({ status }) => (
                        <div
                          class={clsx(
                            getStatusBadgeClass(status),
                            "text-xs badge-xl",
                          )}
                        >
                          {getShorthandStatus(status)}
                        </div>
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
                    <div class="flex gap-2">
                      <button class="btn btn-xs btn-primary">Edit</button>
                      <button
                        onClick={() => handleDelete(problem.id)}
                        class="btn btn-xs btn-error"
                        disabled={isLoading("handleDeleteLoading", problem.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                  data={paginatedProblems()}
                />
              </div>

              {/* Mobile Cards */}
              <div class="md:hidden p-4 space-y-4">
                <For each={paginatedProblems()}>
                  {(problem) => (
                    <div class="card bg-base-200 shadow-sm">
                      <div class="card-body p-4">
                        <div class="flex items-start justify-between mb-3">
                          <div class="flex items-center gap-2">
                            <div class="badge badge-outline font-mono">
                              #{problem.problem_number}
                            </div>
                            <h3 class="font-semibold">{problem.title}</h3>
                          </div>
                          <div
                            class={getDifficultyBadgeClass(problem.difficulty)}
                          >
                            {problem.difficulty}
                          </div>
                        </div>
                        <div class="flex flex-wrap items-center gap-2 mb-3">
                          <div class={getStatusBadgeClass(problem.status)}>
                            {problem.status}
                          </div>
                          <div class="badge badge-outline">
                            {problem.pattern}
                          </div>
                        </div>
                        <div class="text-sm text-base-content/70 mb-3">
                          <span>
                            <Calendar />
                          </span>
                          Attempted:{" "}
                          {new Date(
                            problem.date_attempted,
                          ).toLocaleDateString()}
                        </div>
                        <div class="flex gap-2">
                          <button class="btn btn-xs btn-primary">Edit</button>
                          <button class="btn btn-xs btn-error">Delete</button>
                        </div>
                      </div>
                    </div>
                  )}
                </For>
              </div>

              {/* Pagination */}
              {totalPages() > 1 && (
                <div class="flex justify-center items-center gap-2 p-4 border-t border-base-300">
                  <button
                    class="btn btn-sm"
                    disabled={currentPage() === 1}
                    onClick={() => setCurrentPage(currentPage() - 1)}
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>

                  <div class="join">
                    <For
                      each={Array.from(
                        { length: totalPages() },
                        (_, i) => i + 1,
                      )}
                    >
                      {(page) => (
                        <button
                          class={`join-item btn btn-sm ${page === currentPage() ? "btn-primary" : ""}`}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      )}
                    </For>
                  </div>

                  <button
                    class="btn btn-sm"
                    disabled={currentPage() === totalPages()}
                    onClick={() => setCurrentPage(currentPage() + 1)}
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Problems;

