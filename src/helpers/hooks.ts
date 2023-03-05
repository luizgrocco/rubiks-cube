import { useList } from "react-use";

export const useQueue = <T>(initialValue: T[] = []) => {
  const [list, { push, removeAt, clear }] = useList<T>(initialValue);

  return {
    add: push,
    remove: () => removeAt(0),
    first: list[0],
    queue: list,
    size: list.length,
    clear
  };
};
