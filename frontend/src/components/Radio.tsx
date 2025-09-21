import type { LucideProps } from "lucide-solid";
import type { JSX } from "solid-js";
import type { Component } from "solid-js/types/server/rendering.js";

interface RadioProps {
  Icon?: (props: LucideProps) => JSX.Element;
  errors: Record<string, string>;
  value: string;
  name: string;
  label: string;
  type?: string;
  onInput: (
    e: InputEvent & {
      currentTarget: HTMLInputElement;
      target: HTMLInputElement;
    },
  ) => void;
}

const Radio: Component<RadioProps> = (props) => {
  const Icon = (p: LucideProps) => {
    if (props.Icon) {
      return props.Icon(p);
    }
  };
  return (
    <fieldset class="fieldset">
      <legend class="fieldset-legend">
        <span class="label-text font-semibold flex items-center gap-2">
          <Icon size={16} />
          {props.label}
        </span>
      </legend>
      <input
        name={props.name}
        type={"radio"}
        class={`radio ${props.errors[props.name] ? "input-error" : ""}`}
        value={props.value}
        onInput={props.onInput}
      />
      {props.errors[props.name] && (
        <label class="label">
          <span class="label-text-alt text-error">
            {props.errors[props.name]}
          </span>
        </label>
      )}
    </fieldset>
  );
};

export default Radio;
