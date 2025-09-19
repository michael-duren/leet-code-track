import { createSignal, createResource } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { Plus, Calendar, Hash, FileText, Tag, AlertCircle } from 'lucide-solid';
import type { CreateProblemRequest, Difficulty } from '../types/Problem';

const AddProblem = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [errors, setErrors] = createSignal<Record<string, string>>({});

  // Form fields
  const [problemNumber, setProblemNumber] = createSignal('');
  const [title, setTitle] = createSignal('');
  const [difficulty, setDifficulty] = createSignal<Difficulty>('Easy');
  const [pattern, setPattern] = createSignal('');
  const [notes, setNotes] = createSignal('');
  const [dateAttempted, setDateAttempted] = createSignal(
    new Date().toISOString().split('T')[0]
  );

  // Mock data for pattern suggestions
  const [commonPatterns] = createResource(async () => {
    return [
      'Array', 'Hash Table', 'Two Pointers', 'Sliding Window',
      'Dynamic Programming', 'Binary Search', 'Tree', 'Graph',
      'Backtracking', 'Greedy', 'Stack', 'Queue', 'Heap',
      'Linked List', 'String', 'Math', 'Bit Manipulation'
    ];
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!problemNumber().trim()) {
      newErrors.problem_number = 'Problem number is required';
    } else if (!/^\d+$/.test(problemNumber().trim())) {
      newErrors.problem_number = 'Problem number must be a valid number';
    }

    if (!title().trim()) {
      newErrors.title = 'Title is required';
    }

    if (!pattern().trim()) {
      newErrors.pattern = 'Pattern is required';
    }

    if (!dateAttempted()) {
      newErrors.date_attempted = 'Date attempted is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const problemData: CreateProblemRequest = {
        problem_number: parseInt(problemNumber().trim()),
        title: title().trim(),
        difficulty: difficulty(),
        pattern: pattern().trim(),
        notes: notes().trim() || undefined,
      };

      // TODO: Replace with actual API call
      console.log('Submitting problem:', problemData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to problems page on success
      navigate('/problems');
    } catch (error) {
      console.error('Error creating problem:', error);
      setErrors({ submit: 'Failed to create problem. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePatternClick = (selectedPattern: string) => {
    setPattern(selectedPattern);
  };

  const clearForm = () => {
    setProblemNumber('');
    setTitle('');
    setDifficulty('Easy');
    setPattern('');
    setNotes('');
    setDateAttempted(new Date().toISOString().split('T')[0]);
    setErrors({});
  };

  return (
    <div class="max-w-2xl mx-auto space-y-6">
      <div class="text-center">
        <h1 class="text-3xl font-bold mb-2">Add New Problem</h1>
        <p class="text-base-content/70">
          Track a new LeetCode problem in your spaced repetition system
        </p>
      </div>

      {errors().submit && (
        <div class="alert alert-error">
          <AlertCircle size={20} />
          <span>{errors().submit}</span>
        </div>
      )}

      <div class="card bg-base-100 shadow-xl">
        <form class="card-body space-y-6" onSubmit={handleSubmit}>
          {/* Problem Number */}
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold flex items-center gap-2">
                <Hash size={16} />
                Problem Number *
              </span>
            </label>
            <input
              type="text"
              placeholder="e.g., 1, 15, 121"
              class={`input input-bordered ${errors().problem_number ? 'input-error' : ''}`}
              value={problemNumber()}
              onInput={(e) => setProblemNumber(e.target.value)}
            />
            {errors().problem_number && (
              <label class="label">
                <span class="label-text-alt text-error">{errors().problem_number}</span>
              </label>
            )}
          </div>

          {/* Title */}
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold flex items-center gap-2">
                <FileText size={16} />
                Title *
              </span>
            </label>
            <input
              type="text"
              placeholder="e.g., Two Sum, 3Sum, Best Time to Buy and Sell Stock"
              class={`input input-bordered ${errors().title ? 'input-error' : ''}`}
              value={title()}
              onInput={(e) => setTitle(e.target.value)}
            />
            {errors().title && (
              <label class="label">
                <span class="label-text-alt text-error">{errors().title}</span>
              </label>
            )}
          </div>

          {/* Difficulty */}
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold">Difficulty *</span>
            </label>
            <div class="flex gap-4">
              {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map((diff) => (
                <label class="label cursor-pointer flex items-center gap-2">
                  <input
                    type="radio"
                    name="difficulty"
                    class={`radio ${diff === 'Easy' ? 'radio-success' : diff === 'Medium' ? 'radio-warning' : 'radio-error'}`}
                    checked={difficulty() === diff}
                    onChange={() => setDifficulty(diff)}
                  />
                  <span class="label-text">{diff}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Pattern */}
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold flex items-center gap-2">
                <Tag size={16} />
                Pattern/Topic *
              </span>
            </label>
            <input
              type="text"
              placeholder="e.g., Hash Table, Two Pointers, Dynamic Programming"
              class={`input input-bordered ${errors().pattern ? 'input-error' : ''}`}
              value={pattern()}
              onInput={(e) => setPattern(e.target.value)}
            />
            {errors().pattern && (
              <label class="label">
                <span class="label-text-alt text-error">{errors().pattern}</span>
              </label>
            )}
            
            {/* Pattern Suggestions */}
            {commonPatterns() && (
              <div class="mt-2">
                <label class="label">
                  <span class="label-text-alt">Quick select:</span>
                </label>
                <div class="flex flex-wrap gap-2">
                  {commonPatterns()!.slice(0, 8).map((p) => (
                    <button
                      type="button"
                      class={`badge badge-outline hover:badge-primary cursor-pointer transition-colors ${
                        pattern() === p ? 'badge-primary' : ''
                      }`}
                      onClick={() => handlePatternClick(p)}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Date Attempted */}
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold flex items-center gap-2">
                <Calendar size={16} />
                Date Attempted *
              </span>
            </label>
            <input
              type="date"
              class={`input input-bordered ${errors().date_attempted ? 'input-error' : ''}`}
              value={dateAttempted()}
              onInput={(e) => setDateAttempted(e.target.value)}
            />
            {errors().date_attempted && (
              <label class="label">
                <span class="label-text-alt text-error">{errors().date_attempted}</span>
              </label>
            )}
          </div>

          {/* Notes */}
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold">Notes (Optional)</span>
            </label>
            <textarea
              class="textarea textarea-bordered h-24"
              placeholder="Add any notes, approach, or reminders about this problem..."
              value={notes()}
              onInput={(e) => setNotes(e.target.value)}
            ></textarea>
            <label class="label">
              <span class="label-text-alt">{notes().length}/500 characters</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div class="card-actions justify-end pt-4">
            <button
              type="button"
              class="btn btn-ghost"
              onClick={clearForm}
              disabled={isSubmitting()}
            >
              Clear Form
            </button>
            <button
              type="button"
              class="btn btn-outline"
              onClick={() => navigate('/problems')}
              disabled={isSubmitting()}
            >
              Cancel
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              disabled={isSubmitting()}
            >
              {isSubmitting() ? (
                <>
                  <span class="loading loading-spinner loading-sm"></span>
                  Adding...
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Add Problem
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Quick Tips */}
      <div class="card bg-base-200">
        <div class="card-body">
          <h3 class="card-title text-lg">💡 Quick Tips</h3>
          <ul class="list-disc list-inside space-y-1 text-sm">
            <li>Use specific problem numbers from LeetCode for easy reference</li>
            <li>Choose patterns that help you categorize and recall solutions</li>
            <li>Add notes about your approach, time complexity, or mistakes made</li>
            <li>The system will automatically schedule reviews using spaced repetition</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddProblem;