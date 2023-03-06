import { useFrame, useThree } from "@react-three/fiber";
import { useControls } from "leva";
import { useEffect, useMemo } from "react";
import { Group } from "three";
import { useHotkeys } from "react-hotkeys-hook";
import { addMoveToQueue, cleanUpMove, makeMove, Move } from "../helpers/utils";
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
    add,
    remove,
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
    resetCube: {
      value: true,
      onChange: () => {
        cube.rotation.set(0, 0, 0);
        cube.position.set(...position);
        const children = [...cube.children];
        cube.children = [];
        cube.add(...children);
      }
    },
    keyboardMode: {
      value: false
    }
  }));

  useHotkeys(keyboardMode ? "x" : "1", () =>
    addMoveToQueue(cube, moveGroup, add, "X")
  );
  useHotkeys(keyboardMode ? "shift+x" : "shift+1", () =>
    addMoveToQueue(cube, moveGroup, add, "X'")
  );
  useHotkeys(keyboardMode ? "y" : "2", () =>
    addMoveToQueue(cube, moveGroup, add, "Y")
  );
  useHotkeys(keyboardMode ? "shift+y" : "shift+2", () =>
    addMoveToQueue(cube, moveGroup, add, "Y'")
  );
  useHotkeys(keyboardMode ? "z" : "3", () =>
    addMoveToQueue(cube, moveGroup, add, "Z")
  );
  useHotkeys(keyboardMode ? "shift+z" : "shift+3", () =>
    addMoveToQueue(cube, moveGroup, add, "Z'")
  );
  useHotkeys(keyboardMode ? "r" : "d", () =>
    addMoveToQueue(cube, moveGroup, add, "R")
  );
  useHotkeys(keyboardMode ? "shift+r" : "shift+d", () =>
    addMoveToQueue(cube, moveGroup, add, "R'")
  );
  useHotkeys(keyboardMode ? "l" : "a", () =>
    addMoveToQueue(cube, moveGroup, add, "L")
  );
  useHotkeys(keyboardMode ? "shift+l" : "shift+a", () =>
    addMoveToQueue(cube, moveGroup, add, "L'")
  );
  useHotkeys(keyboardMode ? "u" : "w", () =>
    addMoveToQueue(cube, moveGroup, add, "U")
  );
  useHotkeys(keyboardMode ? "shift+u" : "shift+w", () =>
    addMoveToQueue(cube, moveGroup, add, "U'")
  );
  useHotkeys(keyboardMode ? "d" : "s", () =>
    addMoveToQueue(cube, moveGroup, add, "D")
  );
  useHotkeys(keyboardMode ? "shift+d" : "shift+s", () =>
    addMoveToQueue(cube, moveGroup, add, "D'")
  );
  useHotkeys(keyboardMode ? "f" : "q", () =>
    addMoveToQueue(cube, moveGroup, add, "F")
  );
  useHotkeys(keyboardMode ? "shift+f" : "shift+q", () =>
    addMoveToQueue(cube, moveGroup, add, "F'")
  );
  useHotkeys(keyboardMode ? "b" : "e", () =>
    addMoveToQueue(cube, moveGroup, add, "B")
  );
  useHotkeys(keyboardMode ? "shift+b" : "shift+e", () =>
    addMoveToQueue(cube, moveGroup, add, "B'")
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
        remove();
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
