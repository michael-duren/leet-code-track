import type { Setter } from "solid-js";
import toast from "solid-toast";

type ApiFunction = () => Promise<unknown>;
type ApiCall = {
  fn: ApiFunction;
  loadingSetter: (val: boolean) => void;
  action: string;
  resultSetter?: Setter<unknown>;
  resultProcessor?: (res: unknown) => void;
};

export const handleApiCall = async ({
  fn,
  loadingSetter,
  action,
  resultSetter,
  resultProcessor,
}: ApiCall) => {
  try {
    loadingSetter(true);
    const res = await fn();
    if (resultSetter) {
      resultSetter(res);
    }

    if (resultProcessor) {
      resultProcessor(res);
    }
    if (res && typeof res === "object" && "message" in res) {
      toast.success((res as { message: string }).message);
    } else {
      toast.success(`Successfully completed ${action}.`);
    }
  } catch (error) {
    console.error(`Error during ${action}:`, error);
    toast.error(`Failed to ${action}. Please try again.`);
  } finally {
    loadingSetter(false);
  }
};

export const idSetHander = (
  id: number,
  set: Set<number>,
  setter: (set: Set<number>) => void,
) => {
  return (val: boolean) => {
    if (val) {
      setter(new Set(set).add(id));
    } else {
      const newSet = new Set(set);
      newSet.delete(id);
      setter(newSet);
    }
  };
};
