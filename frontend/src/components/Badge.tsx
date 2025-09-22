import { clsx } from "clsx";
import { type ParentComponent, type JSX, splitProps } from "solid-js";

interface BadgeProps extends JSX.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "primary"
    | "secondary"
    | "accent"
    | "ghost"
    | "outline"
    | "info"
    | "success"
    | "warning"
    | "error";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const Badge: ParentComponent<BadgeProps> = (props) => {
  const [local, divProps] = splitProps(props, [
    "variant",
    "size",
    "children",
    "class",
  ]);

  const getVariantClass = () => {
    switch (local.variant) {
      case "primary":
        return "badge-primary";
      case "secondary":
        return "badge-secondary";
      case "accent":
        return "badge-accent";
      case "ghost":
        return "badge-ghost";
      case "outline":
        return "badge-outline";
      case "info":
        return "badge-info";
      case "success":
        return "badge-success";
      case "warning":
        return "badge-warning";
      case "error":
        return "badge-error";
      default:
        return "";
    }
  };

  const getSizeClass = () => {
    switch (local.size) {
      case "xs":
        return "badge-xs";
      case "sm":
        return "badge-sm";
      case "lg":
        return "badge-lg";
      case "xl":
        return "badge-xl";
      default:
        return "";
    }
  };

  return (
    <div
      {...divProps}
      class={clsx("badge", getVariantClass(), getSizeClass(), local.class)}
    >
      {local.children}
    </div>
  );
};

export default Badge;

