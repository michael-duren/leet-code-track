import clsx from "clsx";
import { For, Show, type JSX, type ParentComponent } from "solid-js";

interface ColumnConfig<T, K extends keyof T = keyof T> {
  label: string;
  key: K;
  render?: (item: T) => JSX.Element;
}

interface TableProps<T> {
  columns: ColumnConfig<T>[];
  data: T[];
  hover?: boolean;
  containerClasses?: string;
  actions: (item: T) => JSX.Element;
}

const Th: ParentComponent = (props) => {
  return (
    <th class="max-w-sm @md/simple-table:max-w-md @xl/simple-table:max-w-lg">
      {props.children}
    </th>
  );
};

const SimpleTable = <T,>(props: TableProps<T>): JSX.Element => {
  return (
    <div
      class={clsx(
        "overflow-x-auto @container/simple-table",
        props.containerClasses,
      )}
    >
      <table class="table table-xs @md/simple-table:table-md @xl/simple-table:table-lg p-4 rounded-lg table-zebra">
        <thead>
          <tr>
            <For each={props.columns}>
              {(col) => {
                return <Th>{col.label}</Th>;
              }}
            </For>
            <Show when={props.actions}>
              <Th>Actions</Th>
            </Show>
          </tr>
        </thead>
        <tbody>
          <For each={props.data}>
            {(d) => (
              <tr class={props.hover ? "hover hover:underline" : "hover"}>
                <For each={props.columns}>
                  {(col) => {
                    const value = d[col.key];
                    let content;

                    if (col.render) {
                      content = col.render(d);
                    } else {
                      if (typeof value === "function") {
                        content = value();
                      } else {
                        content = value?.toString() || "";
                      }
                    }

                    return <td>{content}</td>;
                  }}
                </For>
                <Show when={props.actions}>
                  <td>{props.actions(d)}</td>
                </Show>
              </tr>
            )}
          </For>
        </tbody>
      </table>
    </div>
  );
};

export default SimpleTable;
