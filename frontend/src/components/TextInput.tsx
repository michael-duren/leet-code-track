import type { LucideProps } from "lucide-solid";
import { Match, Switch, type Component, type JSX } from "solid-js";

interface TextInputProps {
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

const TextInput: Component<TextInputProps> = (props) => {
  const Icon = (p: LucideProps) => {
    if (props.Icon) {
      return props.Icon(p);
    }
  };
  return (
    <fieldset class="fieldset w-full">
      <legend class="fieldset-legend">
        <label for={props.name}>
          <span class="label-text font-semibold flex items-center gap-2">
            <Icon size={16} />
            {props.label}
          </span>
        </label>
      </legend>
      <Switch
        fallback={
          <input
            id={props.name}
            name={props.name}
            type={props.type || "text"}
            class={`input ${props.errors[props.name] ? "input-error" : ""}`}
            value={props.value}
            onInput={props.onInput}
          />
        }
      >
        <Match when={props.type === "textarea"}>
          <textarea
            id={props.name}
            name={props.name}
            class={`textarea ${props.errors[props.name] ? "textarea-error" : ""}`}
            value={props.value}
            // @ts-expect-error don't care for the event type its fine
            onInput={props.onInput}
          />
        </Match>
      </Switch>
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

export default TextInput;
