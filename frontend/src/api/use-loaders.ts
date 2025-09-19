import { createStore, produce } from "solid-js/store";

export const useKeyedLoaders = <const T extends readonly string[]>(keys: T) => {
  type StateKey = T[number];
  type GetLoader = (key: StateKey) => Set<number>;
  type SetLoading = (key: StateKey, id: number, isLoading: boolean) => void;

  const initialState = keys.reduce(
    (acc, key) => {
      acc[key as StateKey] = new Set<number>();
      return acc;
    },
    {} as Record<StateKey, Set<number>>,
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
          state[key].add(id);
        } else {
          state[key].delete(id);
        }
      }),
    );
  };
  const isLoading = (key: StateKey, id: number) => loaders[key].has(id);

  return { getLoader, setLoading, isLoading };
};
