import { For } from "solid-js";
import { ChevronLeft, ChevronRight } from "lucide-solid";
import Button from "./Button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = (props: PaginationProps) => {
  return (
    <div class="flex justify-center items-center gap-2 p-4 border-t border-base-300">
      <Button
        size="sm"
        disabled={props.currentPage === 1}
        onClick={() => props.onPageChange(props.currentPage - 1)}
      >
        <ChevronLeft size={16} />
        Previous
      </Button>

      <div class="join">
        <For
          each={Array.from(
            { length: props.totalPages },
            (_, i) => i + 1,
          )}
        >
          {(page) => (
            <button
              class={`join-item btn btn-sm ${page === props.currentPage ? "btn-primary" : ""}`}
              onClick={() => props.onPageChange(page)}
            >
              {page}
            </button>
          )}
        </For>
      </div>

      <Button
        size="sm"
        disabled={props.currentPage === props.totalPages}
        onClick={() => props.onPageChange(props.currentPage + 1)}
      >
        Next
        <ChevronRight size={16} />
      </Button>
    </div>
  );
};

export default Pagination;