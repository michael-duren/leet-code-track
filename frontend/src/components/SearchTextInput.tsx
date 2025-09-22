import { createEffect, onCleanup, type Component } from "solid-js";

interface SearchTextInputProps {
  value: string;
  onInput: (val: string) => void;
}

const SearchTextInput: Component<SearchTextInputProps> = (props) => {
  let inputRef: HTMLInputElement;
  createEffect(() => {
    const downHandler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        inputRef!.focus();
      }
    };
    document.addEventListener("keydown", downHandler);

    onCleanup(() => {
      document.removeEventListener("keydown", downHandler);
    });
  });

  return (
    <label class="input w-full">
      <svg
        class="h-[1em] opacity-50"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <g
          stroke-linejoin="round"
          stroke-linecap="round"
          stroke-width="2.5"
          fill="none"
          stroke="currentColor"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
        </g>
      </svg>
      <input
        ref={inputRef!}
        value={props.value}
        onInput={(e) => props.onInput(e.target.value)}
        type="search"
        class="grow"
        placeholder="Search"
      />
      <kbd class="kbd kbd-sm">⌘</kbd>
      <kbd class="kbd kbd-sm">K</kbd>
    </label>
  );
};

export default SearchTextInput;
