import type { Group } from 'three';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface SceneState {
  cubeRef: Group | null;
  setCubeRef: (cubeRef: Group | null) => void;
  moveGroupRef: Group | null;
  setMoveGroupRef: (moveGroup: Group | null) => void;
}

export const useSceneStore = create<SceneState>()(
  devtools((set) => ({
    cubeRef: null,
    setCubeRef: (cubeRef: Group | null) => set(() => ({ cubeRef: cubeRef })),
    moveGroupRef: null,
    setMoveGroupRef: (moveGroupRef: Group | null) =>
      set(() => ({ moveGroupRef: moveGroupRef }))
  }))
);
