import { clsx } from "clsx";
import { type ParentComponent, type JSX, splitProps } from "solid-js";

interface CardProps extends JSX.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "base"
    | "base-100"
    | "base-200"
    | "base-300"
    | "primary"
    | "secondary"
    | "accent";
  shadow?: "sm" | "md" | "lg" | "xl" | "2xl" | "none";
  padding?: "none" | "sm" | "md" | "lg";
}

const Card: ParentComponent<CardProps> = (props) => {
  const [local, divProps] = splitProps(props, [
    "variant",
    "shadow",
    "padding",
    "children",
    "class",
  ]);

  const getVariantClass = () => {
    switch (local.variant) {
      case "base":
        return "bg-base";
      case "base-100":
        return "bg-base-100";
      case "base-200":
        return "bg-base-200";
      case "base-300":
        return "bg-base-300";
      case "primary":
        return "bg-primary";
      case "secondary":
        return "bg-secondary";
      case "accent":
        return "bg-accent";
      default:
        return "bg-base-100";
    }
  };

  const getShadowClass = () => {
    switch (local.shadow) {
      case "sm":
        return "shadow-sm";
      case "md":
        return "shadow-md";
      case "lg":
        return "shadow-lg";
      case "xl":
        return "shadow-xl";
      case "2xl":
        return "shadow-2xl";
      case "none":
        return "";
      default:
        return "shadow-xl";
    }
  };

  const getPaddingClass = () => {
    switch (local.padding) {
      case "none":
        return "p-0";
      case "sm":
        return "p-2";
      case "md":
        return "p-4";
      case "lg":
        return "p-6";
      default:
        return "";
    }
  };

  return (
    <div
      {...divProps}
      class={clsx("card", getVariantClass(), getShadowClass(), local.class)}
    >
      <div class={clsx("card-body", getPaddingClass())}>{local.children}</div>
    </div>
  );
};

export default Card;

