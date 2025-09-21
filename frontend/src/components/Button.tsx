import { clsx } from "clsx";
import { Show, type ParentComponent } from "solid-js";
interface ButtonProps {
  loading: boolean;
  onClick: () => void;
  style: string;
  disabled?: boolean;
}

const Button: ParentComponent<ButtonProps> = (props) => {
  return (
    <button
      class={clsx("btn btn-success btn-sm", props.style)}
      disabled={props.loading || props.disabled}
      onClick={props.onClick}
    >
      <Show when={props.loading} fallback={props.children}>
        <span class="loading loading-spinner loading-md"></span>
      </Show>
    </button>
  );
};

export default Button;
