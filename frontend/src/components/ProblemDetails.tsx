import { For } from "solid-js";
import {
  Hash,
  FileText,
  Tag,
  Calendar,
  Clock,
  NotebookText,
  Edit,
  Trash2,
} from "lucide-solid";
import type { Problem } from "../types/Problem";
import Badge from "./Badge";
import Card from "./Card";
import Button from "./Button";
import {
  getDifficultyBadgeClass,
  getDifficultyLabel,
  getStatusBadgeClass,
  getStatusLabel,
} from "../utils/problems";
import { formatToReadableDate } from "../utils/dates";

interface ProblemDetailsProps {
  problem: Problem;
  onEdit: () => void;
  onDelete: () => void;
  onDeleteNote?: (noteId: number) => void;
  isDeleting?: boolean;
}

// Mock type for notes - you mentioned you'll update backend types
interface ProblemNote {
  id: number;
  content: string;
  created_at: string;
  updated_at?: string;
}

const ProblemDetails = (props: ProblemDetailsProps) => {
  // Mock notes data - replace with actual API call
  const mockNotes: ProblemNote[] = [
    {
      id: 1,
      content: "Initial approach used nested loops - O(n²) time complexity. Need to optimize.",
      created_at: "2024-01-15T10:30:00Z",
    },
    {
      id: 2,
      content: "Discovered two-pointer technique reduces complexity to O(n). Much better!",
      created_at: "2024-01-20T14:45:00Z",
    },
    {
      id: 3,
      content: "Edge cases to remember: empty array, single element, all duplicates.",
      created_at: "2024-01-25T09:15:00Z",
    },
  ];

  return (
    <div class="space-y-6">
      {/* Problem Header */}
      <Card variant="base-100" shadow="xl">
        <div class="flex justify-between items-start mb-6">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <Badge variant="outline" class="font-mono text-lg">
                <Hash size={16} />
                #{props.problem.problem_number}
              </Badge>
              <h1 class="text-3xl font-bold">{props.problem.title}</h1>
            </div>
            <div class="flex items-center gap-4 mb-4">
              <Badge class={getDifficultyBadgeClass(props.problem.difficulty)}>
                {getDifficultyLabel(props.problem.difficulty)}
              </Badge>
              <Badge class={getStatusBadgeClass(props.problem.status)}>
                {getStatusLabel(props.problem.status)}
              </Badge>
            </div>
          </div>
          <div class="flex gap-2">
            <Button variant="primary" size="sm" onClick={props.onEdit}>
              <Edit size={16} />
              Edit
            </Button>
            <Button 
              variant="error" 
              size="sm" 
              onClick={props.onDelete}
              loading={props.isDeleting}
              disabled={props.isDeleting}
            >
              <Trash2 size={16} />
              Delete
            </Button>
          </div>
        </div>

        {/* Problem Details Grid */}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="space-y-3">
            <div class="flex items-center gap-2 text-sm text-base-content/70">
              <Tag size={16} />
              <span>Pattern/Topic</span>
            </div>
            <Badge variant="accent" size="lg">
              {props.problem.pattern}
            </Badge>
          </div>

          <div class="space-y-3">
            <div class="flex items-center gap-2 text-sm text-base-content/70">
              <Calendar size={16} />
              <span>Date Attempted</span>
            </div>
            <p class="font-semibold">
              {formatToReadableDate(props.problem.date_attempted)}
            </p>
          </div>

          <div class="space-y-3">
            <div class="flex items-center gap-2 text-sm text-base-content/70">
              <Clock size={16} />
              <span>Last Updated</span>
            </div>
            <p class="font-semibold">
              {props.problem.updated_at 
                ? formatToReadableDate(props.problem.updated_at)
                : "Never"
              }
            </p>
          </div>
        </div>

        {/* Original Notes */}
        {props.problem.notes && (
          <div class="mt-6">
            <div class="flex items-center gap-2 text-sm text-base-content/70 mb-3">
              <NotebookText size={16} />
              <span>Original Notes</span>
            </div>
            <div class="bg-base-200 p-4 rounded-lg">
              <p class="whitespace-pre-wrap">{props.problem.notes}</p>
            </div>
          </div>
        )}
      </Card>

      {/* Review Timeline */}
      <Card variant="base-200" shadow="lg">
        <h2 class="text-xl font-bold mb-4">Review Timeline</h2>
        <div class="space-y-4">
          <div class="flex items-center gap-4">
            <div class="w-3 h-3 bg-primary rounded-full"></div>
            <div>
              <p class="font-semibold">Problem Attempted</p>
              <p class="text-sm text-base-content/70">
                {formatToReadableDate(props.problem.date_attempted)}
              </p>
            </div>
          </div>
          
          {props.problem.first_review_date && (
            <div class="flex items-center gap-4">
              <div class="w-3 h-3 bg-warning rounded-full"></div>
              <div>
                <p class="font-semibold">First Review</p>
                <p class="text-sm text-base-content/70">
                  {formatToReadableDate(props.problem.first_review_date)}
                </p>
              </div>
            </div>
          )}

          {props.problem.second_review_date && (
            <div class="flex items-center gap-4">
              <div class="w-3 h-3 bg-accent rounded-full"></div>
              <div>
                <p class="font-semibold">Second Review</p>
                <p class="text-sm text-base-content/70">
                  {formatToReadableDate(props.problem.second_review_date)}
                </p>
              </div>
            </div>
          )}

          {props.problem.final_review_date && (
            <div class="flex items-center gap-4">
              <div class="w-3 h-3 bg-success rounded-full"></div>
              <div>
                <p class="font-semibold">Final Review (Mastered)</p>
                <p class="text-sm text-base-content/70">
                  {formatToReadableDate(props.problem.final_review_date)}
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Notes Section */}
      <Card variant="base-100" shadow="xl">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold">Study Notes</h2>
          <Button variant="primary" size="sm">
            <NotebookText size={16} />
            Add Note
          </Button>
        </div>

        {mockNotes.length === 0 ? (
          <div class="text-center py-8">
            <div class="text-4xl mb-4">📝</div>
            <h3 class="text-lg font-semibold mb-2">No notes yet</h3>
            <p class="text-base-content/70">
              Add your first note to track your learning progress
            </p>
          </div>
        ) : (
          <div class="space-y-4">
            <For each={mockNotes}>
              {(note) => (
                <Card variant="base-200" shadow="sm">
                  <div class="flex justify-between items-start">
                    <div class="flex-1">
                      <p class="whitespace-pre-wrap mb-3">{note.content}</p>
                      <div class="flex items-center gap-4 text-sm text-base-content/70">
                        <span>
                          Created: {formatToReadableDate(note.created_at)}
                        </span>
                        {note.updated_at && (
                          <span>
                            Updated: {formatToReadableDate(note.updated_at)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div class="flex gap-2 ml-4">
                      <Button variant="ghost" size="xs">
                        <Edit size={14} />
                      </Button>
                      <Button 
                        variant="error" 
                        size="xs"
                        onClick={() => props.onDeleteNote?.(note.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            </For>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProblemDetails;