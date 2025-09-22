import { clsx } from "clsx";
import { Show, splitProps, type JSX, type ParentComponent } from "solid-js";

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "error" | "outline" | "success";
  size?: "xs" | "sm" | "md" | "lg";
  loading?: boolean;
  style?: string;
}

const Button: ParentComponent<ButtonProps> = (props) => {
  const [local, buttonProps] = splitProps(props, [
    "variant",
    "size",
    "loading",
    "children",
    "class",
    "disabled",
    "style",
  ]);

  const getVariantClass = () => {
    switch (local.variant) {
      case "primary":
        return "btn-primary";
      case "secondary":
        return "btn-secondary";
      case "ghost":
        return "btn-ghost";
      case "error":
        return "btn-error";
      case "outline":
        return "btn-outline";
      case "success":
        return "btn-success";
      default:
        return "";
    }
  };

  const getSizeClass = () => {
    switch (local.size) {
      case "xs":
        return "btn-xs";
      case "sm":
        return "btn-sm";
      case "lg":
        return "btn-lg";
      default:
        return "";
    }
  };

  return (
    <button
      {...buttonProps}
      class={clsx(
        "btn w-full",
        getVariantClass(),
        getSizeClass(),
        local.loading && "loading",
        local.style,
        local.class,
      )}
      disabled={local.disabled || local.loading}
    >
      <Show when={local.loading} fallback={local.children}>
        <span class="loading loading-spinner loading-md"></span>
      </Show>
    </button>
  );
};

export default Button;
