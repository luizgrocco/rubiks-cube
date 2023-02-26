import type { Group } from 'three';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface SceneState {
  cubeRef: Group | null;
  setCubeRef: (cubeRef: Group) => void;
  moveGroupRef: Group | null;
  setMoveGroupRef: (moveGroup: Group) => void;
}

export const useSceneStore = create<SceneState>()(
  devtools((set) => ({
    cubeRef: null,
    setCubeRef: (cubeRef: Group) => set(() => ({ cubeRef })),
    moveGroupRef: null,
    setMoveGroupRef: (moveGroupRef: Group) => set(() => ({ moveGroupRef }))
  }))
);
