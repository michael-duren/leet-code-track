import { createSignal, createResource, For } from 'solid-js';
import { Search, ChevronLeft, ChevronRight } from 'lucide-solid';
import type { Problem } from '../types/Problem';

const Problems = () => {
  const [searchTerm, setSearchTerm] = createSignal('');
  const [difficultyFilter, setDifficultyFilter] = createSignal('all');
  const [statusFilter, setStatusFilter] = createSignal('all');
  const [currentPage, setCurrentPage] = createSignal(1);
  const pageSize = 10;

  const [problems] = createResource<Problem[]>(async () => {
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
      },
      {
        id: 3,
        problemNumber: 121,
        title: "Best Time to Buy and Sell Stock",
        difficulty: "Easy" as const,
        dateAttempted: "2025-01-03",
        status: "Mastered" as const,
        pattern: "Dynamic Programming",
        notes: "Simple DP problem",
      },
    ];
  });

  const filteredProblems = () => {
    const allProblems = problems() || [];
    return allProblems.filter(problem => {
      const matchesSearch = !searchTerm() || 
        problem.title.toLowerCase().includes(searchTerm().toLowerCase()) ||
        problem.problemNumber.toString().includes(searchTerm());
      
      const matchesDifficulty = difficultyFilter() === 'all' || 
        problem.difficulty === difficultyFilter();
      
      const matchesStatus = statusFilter() === 'all' || 
        problem.status === statusFilter();
      
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

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'New':
        return 'badge badge-info';
      case 'FirstReview':
        return 'badge badge-warning';
      case 'SecondReview':
        return 'badge badge-accent';
      case 'Mastered':
        return 'badge badge-success';
      default:
        return 'badge badge-ghost';
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setDifficultyFilter('all');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  return (
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-3xl font-bold">All Problems</h1>
          <p class="text-base-content/70">
            Showing {filteredProblems().length} of {problems()?.length || 0} problems
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div class="card bg-base-200 shadow-sm">
        <div class="card-body p-4">
          <div class="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div class="flex-1">
              <div class="form-control">
                <div class="input-group">
                  <span class="bg-base-300">
                    <Search size={20} />
                  </span>
                  <input
                    type="text"
                    placeholder="Search by title or number..."
                    class="input input-bordered w-full"
                    value={searchTerm()}
                    onInput={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Difficulty Filter */}
            <div class="form-control w-full lg:w-auto">
              <select
                class="select select-bordered"
                value={difficultyFilter()}
                onChange={(e) => setDifficultyFilter(e.target.value)}
              >
                <option value="all">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

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
            <button
              class="btn btn-ghost"
              onClick={clearFilters}
            >
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
              <p class="text-base-content/70">Try adjusting your filters or search term.</p>
            </div>
          )}

          {filteredProblems().length > 0 && (
            <>
              {/* Desktop Table */}
              <div class="hidden md:block overflow-x-auto">
                <table class="table table-zebra">
                  <thead>
                    <tr>
                      <th>Problem #</th>
                      <th>Title</th>
                      <th>Difficulty</th>
                      <th>Status</th>
                      <th>Pattern</th>
                      <th>Date Attempted</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <For each={paginatedProblems()}>
                      {(problem) => (
                        <tr>
                          <td class="font-mono">{problem.problemNumber}</td>
                          <td class="font-semibold">{problem.title}</td>
                          <td>
                            <div class={getDifficultyBadgeClass(problem.difficulty)}>
                              {problem.difficulty}
                            </div>
                          </td>
                          <td>
                            <div class={getStatusBadgeClass(problem.status)}>
                              {problem.status}
                            </div>
                          </td>
                          <td>
                            <div class="badge badge-outline">{problem.pattern}</div>
                          </td>
                          <td>
                            {new Date(problem.dateAttempted).toLocaleDateString()}
                          </td>
                          <td>
                            <div class="flex gap-2">
                              <button class="btn btn-xs btn-primary">Edit</button>
                              <button class="btn btn-xs btn-error">Delete</button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </For>
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div class="md:hidden p-4 space-y-4">
                <For each={paginatedProblems()}>
                  {(problem) => (
                    <div class="card bg-base-200 shadow-sm">
                      <div class="card-body p-4">
                        <div class="flex items-start justify-between mb-3">
                          <div class="flex items-center gap-2">
                            <div class="badge badge-outline font-mono">#{problem.problemNumber}</div>
                            <h3 class="font-semibold">{problem.title}</h3>
                          </div>
                          <div class={getDifficultyBadgeClass(problem.difficulty)}>
                            {problem.difficulty}
                          </div>
                        </div>
                        <div class="flex flex-wrap items-center gap-2 mb-3">
                          <div class={getStatusBadgeClass(problem.status)}>
                            {problem.status}
                          </div>
                          <div class="badge badge-outline">{problem.pattern}</div>
                        </div>
                        <div class="text-sm text-base-content/70 mb-3">
                          Attempted: {new Date(problem.dateAttempted).toLocaleDateString()}
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
                    <For each={Array.from({ length: totalPages() }, (_, i) => i + 1)}>
                      {(page) => (
                        <button
                          class={`join-item btn btn-sm ${page === currentPage() ? 'btn-primary' : ''}`}
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