import { createSignal } from 'solid-js';
import { Search, X } from 'lucide-solid';

export interface FilterConfig {
  searchTerm: string;
  difficulty: string;
  status: string;
  pattern: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface FilterBarProps {
  onFiltersChange: (filters: FilterConfig) => void;
  showPatternFilter?: boolean;
  showSortOptions?: boolean;
  placeholder?: string;
}

const FilterBar = (props: FilterBarProps) => {
  const [filters, setFilters] = createSignal<FilterConfig>({
    searchTerm: '',
    difficulty: 'all',
    status: 'all',
    pattern: 'all',
    sortBy: 'dateAttempted',
    sortOrder: 'desc'
  });

  const updateFilters = (newFilters: Partial<FilterConfig>) => {
    const updated = { ...filters(), ...newFilters };
    setFilters(updated);
    props.onFiltersChange(updated);
  };

  const clearFilters = () => {
    const clearedFilters: FilterConfig = {
      searchTerm: '',
      difficulty: 'all',
      status: 'all',
      pattern: 'all',
      sortBy: 'dateAttempted',
      sortOrder: 'desc'
    };
    setFilters(clearedFilters);
    props.onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = () => {
    const f = filters();
    return f.searchTerm !== '' || 
           f.difficulty !== 'all' || 
           f.status !== 'all' || 
           f.pattern !== 'all';
  };

  return (
    <div class="card bg-base-200 shadow-sm">
      <div class="card-body p-4">
        <div class="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div class="flex-1 min-w-0">
            <div class="form-control">
              <div class="input-group">
                <span class="bg-base-300">
                  <Search size={20} />
                </span>
                <input
                  type="text"
                  placeholder={props.placeholder || "Search problems..."}
                  class="input input-bordered w-full"
                  value={filters().searchTerm}
                  onInput={(e) => updateFilters({ searchTerm: e.target.value })}
                />
                {filters().searchTerm && (
                  <button
                    class="btn btn-square btn-ghost"
                    onClick={() => updateFilters({ searchTerm: '' })}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Filter Controls */}
          <div class="flex flex-wrap gap-3">
            {/* Difficulty Filter */}
            <div class="form-control w-full sm:w-auto">
              <select
                class="select select-bordered select-sm"
                value={filters().difficulty}
                onChange={(e) => updateFilters({ difficulty: e.target.value })}
              >
                <option value="all">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            {/* Status Filter */}
            <div class="form-control w-full sm:w-auto">
              <select
                class="select select-bordered select-sm"
                value={filters().status}
                onChange={(e) => updateFilters({ status: e.target.value })}
              >
                <option value="all">All Statuses</option>
                <option value="New">New</option>
                <option value="FirstReview">First Review</option>
                <option value="SecondReview">Second Review</option>
                <option value="Mastered">Mastered</option>
              </select>
            </div>

            {/* Pattern Filter */}
            {props.showPatternFilter && (
              <div class="form-control w-full sm:w-auto">
                <select
                  class="select select-bordered select-sm"
                  value={filters().pattern}
                  onChange={(e) => updateFilters({ pattern: e.target.value })}
                >
                  <option value="all">All Patterns</option>
                  <option value="Array">Array</option>
                  <option value="Hash Table">Hash Table</option>
                  <option value="Two Pointers">Two Pointers</option>
                  <option value="Dynamic Programming">Dynamic Programming</option>
                  <option value="Tree">Tree</option>
                  <option value="Graph">Graph</option>
                </select>
              </div>
            )}

            {/* Sort Options */}
            {props.showSortOptions && (
              <div class="form-control w-full sm:w-auto">
                <select
                  class="select select-bordered select-sm"
                  value={`${filters().sortBy}_${filters().sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('_');
                    updateFilters({ sortBy, sortOrder: sortOrder as 'asc' | 'desc' });
                  }}
                >
                  <option value="dateAttempted_desc">Newest First</option>
                  <option value="dateAttempted_asc">Oldest First</option>
                  <option value="problemNumber_asc">Problem # (Low to High)</option>
                  <option value="problemNumber_desc">Problem # (High to Low)</option>
                  <option value="title_asc">Title (A-Z)</option>
                  <option value="title_desc">Title (Z-A)</option>
                  <option value="difficulty_asc">Difficulty (Easy First)</option>
                  <option value="difficulty_desc">Difficulty (Hard First)</option>
                </select>
              </div>
            )}

            {/* Clear Filters Button */}
            {hasActiveFilters() && (
              <button
                class="btn btn-ghost btn-sm"
                onClick={clearFilters}
              >
                <X size={16} />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters() && (
          <div class="flex flex-wrap gap-2 mt-3 pt-3 border-t border-base-300">
            {filters().searchTerm && (
              <div class="badge badge-primary gap-2">
                <span>Search: "{filters().searchTerm}"</span>
                <button
                  class="btn btn-xs btn-circle btn-ghost"
                  onClick={() => updateFilters({ searchTerm: '' })}
                >
                  <X size={12} />
                </button>
              </div>
            )}
            {filters().difficulty !== 'all' && (
              <div class="badge badge-secondary gap-2">
                <span>Difficulty: {filters().difficulty}</span>
                <button
                  class="btn btn-xs btn-circle btn-ghost"
                  onClick={() => updateFilters({ difficulty: 'all' })}
                >
                  <X size={12} />
                </button>
              </div>
            )}
            {filters().status !== 'all' && (
              <div class="badge badge-accent gap-2">
                <span>Status: {filters().status}</span>
                <button
                  class="btn btn-xs btn-circle btn-ghost"
                  onClick={() => updateFilters({ status: 'all' })}
                >
                  <X size={12} />
                </button>
              </div>
            )}
            {props.showPatternFilter && filters().pattern !== 'all' && (
              <div class="badge badge-info gap-2">
                <span>Pattern: {filters().pattern}</span>
                <button
                  class="btn btn-xs btn-circle btn-ghost"
                  onClick={() => updateFilters({ pattern: 'all' })}
                >
                  <X size={12} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;