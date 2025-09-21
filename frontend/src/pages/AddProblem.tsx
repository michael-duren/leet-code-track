import { createSignal, createResource } from "solid-js";
import { useNavigate } from "@solidjs/router";
import {
  Plus,
  Calendar,
  Hash,
  FileText,
  Tag,
  CircleAlertIcon,
  NotebookText,
} from "lucide-solid";
import type { CreateProblemRequest, Difficulty } from "../types/Problem";
import { useApi } from "../api/agent";
import TextInput from "../components/TextInput";
import { getDifficultyValue } from "../utils/problems";

const AddProblem = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [errors, setErrors] = createSignal<Record<string, string>>({});

  const [problemNumber, setProblemNumber] = createSignal("");
  const [title, setTitle] = createSignal("");
  const [difficulty, setDifficulty] = createSignal<Difficulty>("Easy");
  const [pattern, setPattern] = createSignal("");
  const [notes, setNotes] = createSignal("");
  const [dateAttempted, setDateAttempted] = createSignal("");
  const api = useApi();

  // Mock data for pattern suggestions
  const [commonPatterns] = createResource(async () => {
    return [
      "Array",
      "Hash Table",
      "Two Pointers",
      "Sliding Window",
      "Dynamic Programming",
      "Binary Search",
      "Tree",
      "Graph",
      "Backtracking",
      "Greedy",
      "Stack",
      "Queue",
      "Heap",
      "Linked List",
      "String",
      "Math",
      "Bit Manipulation",
    ];
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!problemNumber().trim()) {
      newErrors.problem_number = "Problem number is required";
    } else if (!/^\d+$/.test(problemNumber().trim())) {
      newErrors.problem_number = "Problem number must be a valid number";
    }

    if (!title().trim()) {
      newErrors.title = "Title is required";
    }

    if (!pattern().trim()) {
      newErrors.pattern = "Pattern is required";
    }

    if (!dateAttempted()) {
      newErrors.date_attempted = "Date attempted is required";
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
        difficulty: getDifficultyValue(difficulty()),
        pattern: pattern().trim(),
        notes: notes().trim() || undefined,
      };

      await api.Problems.create(problemData);
      navigate("/problems");
    } catch (error) {
      console.error("Error creating problem:", error);
      setErrors({ submit: "Failed to create problem. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePatternClick = (selectedPattern: string) => {
    setPattern(selectedPattern);
  };

  const clearForm = () => {
    setProblemNumber("");
    setTitle("");
    setDifficulty("Easy");
    setPattern("");
    setNotes("");
    setDateAttempted("");
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
          <CircleAlertIcon size={20} />
          <span>{errors().submit}</span>
        </div>
      )}

      <div class="card bg-base-100 shadow-xl">
        <form class="card-body space-y-6" onSubmit={handleSubmit}>
          {/* Problem Number */}
          <TextInput
            name="problem_number"
            label="Problem Number *"
            Icon={Hash}
            onInput={(e) => setProblemNumber(e.target.value)}
            value={problemNumber()}
            errors={errors()}
          />
          <TextInput
            name="title"
            label="Title *"
            onInput={(e) => setTitle(e.target.value)}
            value={title()}
            errors={errors()}
            Icon={FileText}
          />

          {/* Difficulty */}
          <fieldset class="fieldset">
            <label class="label">
              <span class="label-text font-semibold">Difficulty *</span>
            </label>
            <div class="flex gap-4">
              {(["Easy", "Medium", "Hard"] as Difficulty[]).map((diff) => (
                <label class="label cursor-pointer flex items-center gap-2">
                  <input
                    type="radio"
                    name="difficulty"
                    class={`radio ${diff === "Easy" ? "radio-success" : diff === "Medium" ? "radio-warning" : "radio-error"}`}
                    checked={difficulty() === diff}
                    onChange={() => setDifficulty(diff)}
                  />
                  <span class="label-text">{diff}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Pattern */}
          <div class="form-control">
            <TextInput
              Icon={Tag}
              name="pattern"
              label="Pattern/Topic *"
              errors={errors()}
              value={pattern()}
              onInput={(e) => setPattern(e.target.value)}
            />

            {/* Pattern Suggestions */}
            {commonPatterns() && (
              <fieldset class="fieldset">
                <label class="label">
                  <span class="label-text-alt">Quick select:</span>
                </label>
                <div class="flex flex-wrap gap-2">
                  {commonPatterns()!
                    .slice(0, 8)
                    .map((p) => (
                      <button
                        type="button"
                        class={`badge badge-outline hover:badge-primary cursor-pointer transition-colors ${
                          pattern() === p ? "badge-primary" : ""
                        }`}
                        onClick={() => handlePatternClick(p)}
                      >
                        {p}
                      </button>
                    ))}
                </div>
              </fieldset>
            )}
          </div>

          <TextInput
            name="date_attempted"
            label="Date Attempted *"
            type="date"
            Icon={Calendar}
            onInput={(e) => setDateAttempted(e.target.value)}
            errors={errors()}
            value={dateAttempted()}
          />

          <TextInput
            type="textarea"
            name="notes"
            label="Notes (Optional)"
            Icon={NotebookText}
            onInput={(e) => setNotes(e.target.value)}
            errors={errors()}
            value={notes()}
          />

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
              onClick={() => navigate("/problems")}
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
            <li>
              Use specific problem numbers from LeetCode for easy reference
            </li>
            <li>
              Choose patterns that help you categorize and recall solutions
            </li>
            <li>
              Add notes about your approach, time complexity, or mistakes made
            </li>
            <li>
              The system will automatically schedule reviews using spaced
              repetition
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddProblem;

