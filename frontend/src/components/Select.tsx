import type { LucideProps } from "lucide-solid";
import { For, Show, type Component, type JSX } from "solid-js";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  Icon?: (props: LucideProps) => JSX.Element;
  errors: Record<string, string>;
  value: string;
  options: Option[];
  name: string;
  label: string;
  type?: string;
  includeEmptyOption?: boolean;
  onInput: (val: string) => void;
  hideLabel?: boolean;
}

const Select: Component<SelectProps> = (props) => {
  const Icon = (p: LucideProps) => {
    if (props.Icon) {
      return props.Icon(p);
    }
  };
  return (
    <fieldset class="fieldset w-full">
      <Show when={!props.hideLabel}>
        <legend class="fieldset-legend">
          <label for={props.name}>
            <span class="label-text font-semibold flex items-center gap-2">
              <Icon size={16} />
              {props.label}
            </span>
          </label>
        </legend>
      </Show>
      <select
        value={props.value}
        id={props.name}
        name={props.name}
        class="select w-full"
        onInput={(e) => props.onInput((e.target as HTMLSelectElement).value)}
      >
        <Show when={props.includeEmptyOption}>
          <option value="">Select an option</option>
        </Show>
        <For each={props.options}>
          {(o) => <option value={o.value}>{o.label}</option>}
        </For>
      </select>
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

export default Select;
