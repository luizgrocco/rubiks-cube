import { useList } from "react-use";

export const useQueue = <T>(initialValue: T[] = []) => {
  const [list, { push, removeAt, clear }] = useList<T>(initialValue);

  return {
    enqueue: push,
    dequeue: () => {
      const el = list[0];
      removeAt(0);
      return el;
    },
    first: list[0],
    queue: list,
    size: list.length,
    clear
  };
};
