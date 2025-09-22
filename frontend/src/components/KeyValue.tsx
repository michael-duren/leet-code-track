import type { Component, JSX } from "solid-js";

interface KeyValueProps {
  label: string;
  value: JSX.Element | string | number | null | undefined;
}

const KeyValue: Component<KeyValueProps> = (props) => {
  return (
    <div class="flex flex-col">
      <span class="text-xs text-base-content/60 mb-1">{props.label}</span>
      {props.value}
    </div>
  );
};

export default KeyValue;
