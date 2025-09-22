import { createSignal, createResource, createEffect } from "solid-js";
import {
  Plus,
  Calendar,
  Hash,
  FileText,
  Tag,
  NotebookText,
  Save,
} from "lucide-solid";
import type {
  CreateProblemRequest,
  UpdateProblemRequest,
  Difficulty,
  Problem,
} from "../types/Problem";
import TextInput from "./TextInput";
import Button from "./Button";
import Badge from "./Badge";
import Card from "./Card";
import { getDifficultyValue, getDifficultyLabel } from "../utils/problems";

interface ProblemFormProps {
  problem?: Problem | null;
  onSubmit: (
    data: CreateProblemRequest | UpdateProblemRequest,
  ) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const ProblemForm = (props: ProblemFormProps) => {
  const [errors, setErrors] = createSignal<Record<string, string>>({});

  const [problemNumber, setProblemNumber] = createSignal("");
  const [title, setTitle] = createSignal("");
  const [difficulty, setDifficulty] = createSignal<Difficulty>("Easy");
  const [pattern, setPattern] = createSignal("");
  const [notes, setNotes] = createSignal("");
  const [dateAttempted, setDateAttempted] = createSignal("");

  const isEditMode = () => !!props.problem;

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

  // Initialize form with problem data when editing
  createEffect(() => {
    if (props.problem) {
      setProblemNumber(props.problem.problem_number.toString());
      setTitle(props.problem.title);
      setDifficulty(getDifficultyLabel(props.problem.difficulty) as Difficulty);
      setPattern(props.problem.pattern);
      setNotes(props.problem.notes || "");
      setDateAttempted(props.problem.date_attempted.split("T")[0]); // Convert to date input format
    }
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!isEditMode()) {
      if (!problemNumber().trim()) {
        newErrors.problem_number = "Problem number is required";
      } else if (!/^\d+$/.test(problemNumber().trim())) {
        newErrors.problem_number = "Problem number must be a valid number";
      }
    }

    if (!title().trim()) {
      newErrors.title = "Title is required";
    }

    if (!pattern().trim()) {
      newErrors.pattern = "Pattern is required";
    }

    if (!isEditMode() && !dateAttempted()) {
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

    try {
      if (isEditMode()) {
        const updateData: UpdateProblemRequest = {
          id: props.problem!.id,
          title: title().trim(),
          difficulty: difficulty(),
          pattern: pattern().trim(),
          notes: notes().trim() || undefined,
        };
        await props.onSubmit(updateData);
      } else {
        const createData: CreateProblemRequest = {
          problem_number: parseInt(problemNumber().trim()),
          title: title().trim(),
          difficulty: getDifficultyValue(difficulty()),
          pattern: pattern().trim(),
          notes: notes().trim() || undefined,
        };
        await props.onSubmit(createData);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({
        submit: `Failed to ${isEditMode() ? "update" : "create"} problem. Please try again.`,
      });
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
    <Card variant="base-100" shadow="xl">
      <form class="space-y-6" onSubmit={handleSubmit}>
        {/* Problem Number - only show in create mode */}
        {!isEditMode() && (
          <TextInput
            name="problem_number"
            label="Problem Number *"
            Icon={Hash}
            onInput={(e) => setProblemNumber(e.target.value)}
            value={problemNumber()}
            errors={errors()}
          />
        )}

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
                    <Badge
                      variant={pattern() === p ? "primary" : "outline"}
                      class="hover:badge-primary cursor-pointer transition-colors"
                      onClick={() => handlePatternClick(p)}
                    >
                      {p}
                    </Badge>
                  ))}
              </div>
            </fieldset>
          )}
        </div>

        {/* Date Attempted - only show in create mode */}
        {!isEditMode() && (
          <TextInput
            name="date_attempted"
            label="Date Attempted *"
            type="date"
            Icon={Calendar}
            onInput={(e) => setDateAttempted(e.target.value)}
            errors={errors()}
            value={dateAttempted()}
          />
        )}

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
          {!isEditMode() && (
            <Button
              variant="ghost"
              type="button"
              onClick={clearForm}
              disabled={props.isLoading}
            >
              Clear Form
            </Button>
          )}
          <Button
            variant="outline"
            type="button"
            onClick={props.onCancel}
            disabled={props.isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            loading={props.isLoading}
            disabled={props.isLoading}
          >
            {!props.isLoading &&
              (isEditMode() ? <Save size={16} /> : <Plus size={16} />)}
            {props.isLoading
              ? isEditMode()
                ? "Updating..."
                : "Adding..."
              : isEditMode()
                ? "Update Problem"
                : "Add Problem"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ProblemForm;

