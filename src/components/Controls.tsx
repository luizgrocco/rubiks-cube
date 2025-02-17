import { useFrame, useThree } from "@react-three/fiber";
import { useControls, button } from "leva";
import { useEffect, useMemo } from "react";
import { Group } from "three";
import { useHotkeys } from "react-hotkeys-hook";
import {
  addMoveToQueue,
  cleanUpMove,
  generateTNoodleScramble,
  makeMove,
  Move
} from "../helpers/utils";
import { RubikCube } from "./Cube";
import { useQueue } from "../helpers/hooks";
import { useQueueStore } from "../store/zustand";

export interface MoveAction {
  move: Move;
  initialized: boolean;
  initializationFn: () => void;
  stopCondition: () => boolean;
}

interface ControlsProps {
  // cubeRef: RefObject<RubikCube>;
  position: [x: number, y: number, z: number];
  cube: RubikCube;
}

const Controls = ({ position, cube }: ControlsProps) => {
  const { scene } = useThree();
  const { updateMoveQueue } = useQueueStore();

  const moveGroup = useMemo(() => {
    const group = new Group();
    group.position.set(...position);
    return group;
  }, [position]);

  useEffect(() => {
    scene.add(moveGroup);
  }, [moveGroup, scene]);

  const {
    enqueue,
    dequeue,
    first: currentMove,
    size,
    queue
  } = useQueue<MoveAction>();

  useEffect(() => {
    updateMoveQueue([...queue]);
  }, [queue, updateMoveQueue]);

  const isThereAMoveToExecute = useMemo(() => size > 0, [size]);

  const [{ keyboardMode }] = useControls(() => ({
    rotateX: {
      value: 0,
      min: 0,
      max: 360,
      step: 1,
      onChange: (rotateX) => {
        cube.rotation.x = (rotateX * Math.PI) / 180;
      }
    },
    rotateY: {
      value: 0,
      min: 0,
      max: 360,
      step: 1,
      onChange: (rotateY) => {
        cube.rotation.y = (rotateY * Math.PI) / 180;
      }
    },
    rotateZ: {
      value: 0,
      min: 0,
      max: 360,
      step: 1,
      onChange: (rotateZ) => {
        cube.rotation.z = (rotateZ * Math.PI) / 180;
      }
    },
    resetCube: button(() => {
      cube.rotation.set(0, 0, 0);
      cube.position.set(...position);
      cube.children.forEach((child) => child.rotation.set(0, 0, 0));
    }),
    scrambleCube: button(() => {
      const moves = generateTNoodleScramble();
      console.log(moves);
      for (const move of moves) {
        addMoveToQueue(cube, moveGroup, enqueue, move);
      }
    }),
    keyboardMode: {
      value: false
    }
  }));

  useHotkeys(keyboardMode ? "x" : "1", () =>
    addMoveToQueue(cube, moveGroup, enqueue, "X")
  );
  useHotkeys(keyboardMode ? "shift+x" : "shift+1", () =>
    addMoveToQueue(cube, moveGroup, enqueue, "X'")
  );
  useHotkeys(keyboardMode ? "y" : "2", () =>
    addMoveToQueue(cube, moveGroup, enqueue, "Y")
  );
  useHotkeys(keyboardMode ? "shift+y" : "shift+2", () =>
    addMoveToQueue(cube, moveGroup, enqueue, "Y'")
  );
  useHotkeys(keyboardMode ? "z" : "3", () =>
    addMoveToQueue(cube, moveGroup, enqueue, "Z")
  );
  useHotkeys(keyboardMode ? "shift+z" : "shift+3", () =>
    addMoveToQueue(cube, moveGroup, enqueue, "Z'")
  );
  useHotkeys(keyboardMode ? "r" : "d", () =>
    addMoveToQueue(cube, moveGroup, enqueue, "R")
  );
  useHotkeys(keyboardMode ? "shift+r" : "shift+d", () =>
    addMoveToQueue(cube, moveGroup, enqueue, "R'")
  );
  useHotkeys(keyboardMode ? "l" : "a", () =>
    addMoveToQueue(cube, moveGroup, enqueue, "L")
  );
  useHotkeys(keyboardMode ? "shift+l" : "shift+a", () =>
    addMoveToQueue(cube, moveGroup, enqueue, "L'")
  );
  useHotkeys(keyboardMode ? "u" : "w", () =>
    addMoveToQueue(cube, moveGroup, enqueue, "U")
  );
  useHotkeys(keyboardMode ? "shift+u" : "shift+w", () =>
    addMoveToQueue(cube, moveGroup, enqueue, "U'")
  );
  useHotkeys(keyboardMode ? "d" : "s", () =>
    addMoveToQueue(cube, moveGroup, enqueue, "D")
  );
  useHotkeys(keyboardMode ? "shift+d" : "shift+s", () =>
    addMoveToQueue(cube, moveGroup, enqueue, "D'")
  );
  useHotkeys(keyboardMode ? "f" : "q", () =>
    addMoveToQueue(cube, moveGroup, enqueue, "F")
  );
  useHotkeys(keyboardMode ? "shift+f" : "shift+q", () =>
    addMoveToQueue(cube, moveGroup, enqueue, "F'")
  );
  useHotkeys(keyboardMode ? "b" : "e", () =>
    addMoveToQueue(cube, moveGroup, enqueue, "B")
  );
  useHotkeys(keyboardMode ? "shift+b" : "shift+e", () =>
    addMoveToQueue(cube, moveGroup, enqueue, "B'")
  );

  useFrame(() => {
    if (isThereAMoveToExecute) {
      if (!currentMove.initialized) {
        console.log({ currentMove: currentMove.move });
        currentMove.initializationFn();
      }

      if (!currentMove.stopCondition()) {
        const delta = Math.PI / 4 / 30;
        makeMove(currentMove.move, moveGroup, delta);
      } else {
        cleanUpMove(currentMove.move, moveGroup);
        const newChildren = [...moveGroup.children];
        newChildren.forEach((child) => cube.attach(child));
        moveGroup.rotation.set(0, 0, 0);
        dequeue();
      }
    }
  });

  return (
    <>
      {/* <ScreenSpace depth={5}>
        <Html position={[0, 2, 0]}>
          <div style={{ display: "flex" }}> WHERE IS MY DIV </div>
        </Html>
      </ScreenSpace> */}
    </>
  );
};

export default Controls;
