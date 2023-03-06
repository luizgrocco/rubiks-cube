import { create } from "zustand";
import { MoveAction } from "../components/Controls";

type QueueState = {
  moveQueue: MoveAction[];
};

type QueueAction = {
  updateMoveQueue: (newQueue: QueueState["moveQueue"]) => void;
};

export const useQueueStore = create<QueueState & QueueAction>((set) => ({
  moveQueue: [],
  updateMoveQueue: (newQueue) => set(() => ({ moveQueue: newQueue }))
}));
