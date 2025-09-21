import { createStore, produce } from "solid-js/store";

export const useKeyedLoaders = <const T extends readonly string[]>(keys: T) => {
  type StateKey = T[number];
  type GetLoader = (key: StateKey) => Record<number, boolean>;
  type SetLoading = (key: StateKey, id: number, isLoading: boolean) => void;

  const initialState = keys.reduce(
    (acc, key) => {
      acc[key as StateKey] = {} as Record<number, boolean>;
      return acc;
    },
    {} as Record<StateKey, Record<number, boolean>>,
  );

  const [loaders, setLoaders] = createStore(initialState);

  const getLoader: GetLoader = (key: StateKey) => loaders[key];

  const setLoading: SetLoading = (
    key: StateKey,
    id: number,
    isLoading: boolean,
  ) => {
    setLoaders(
      produce((state) => {
        if (isLoading) {
          state[key][id] = true;
        } else {
          delete state[key][id];
        }
      }),
    );
  };

  const isLoading = (key: StateKey, id: number) => !!loaders[key][id];

  return { getLoader, setLoading, isLoading };
};
