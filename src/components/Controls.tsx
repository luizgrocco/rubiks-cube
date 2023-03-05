import { useFrame, useThree } from "@react-three/fiber";
import { Html, ScreenSpace } from "@react-three/drei";
import { useControls } from "leva";
import { useEffect, useMemo } from "react";
import { Group } from "three";
import { useHotkeys } from "react-hotkeys-hook";
import { addMoveToQueue, cleanUpMove, makeMove, Move } from "../helpers/utils";
import { RubikCube } from "./Cube";
import { useQueue } from "../helpers/hooks";

export interface QueueAction {
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
  } = useQueue<QueueAction>();

  console.log({ queue });

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

  useHotkeys(keyboardMode ? "r" : "d", () =>
    addMoveToQueue(cube, moveGroup, add, "R")
  );
  useHotkeys(keyboardMode ? "l" : "a", () =>
    addMoveToQueue(cube, moveGroup, add, "L")
  );
  useHotkeys(keyboardMode ? "u" : "w", () =>
    addMoveToQueue(cube, moveGroup, add, "U")
  );
  useHotkeys(keyboardMode ? "d" : "s", () =>
    addMoveToQueue(cube, moveGroup, add, "D")
  );
  useHotkeys(keyboardMode ? "f" : "e", () =>
    addMoveToQueue(cube, moveGroup, add, "F")
  );
  useHotkeys(keyboardMode ? "b" : "q", () =>
    addMoveToQueue(cube, moveGroup, add, "B")
  );
  useHotkeys(keyboardMode ? "shift+r" : "shift+d", () =>
    addMoveToQueue(cube, moveGroup, add, "R'")
  );
  useHotkeys(keyboardMode ? "shift+l" : "shift+a", () =>
    addMoveToQueue(cube, moveGroup, add, "L'")
  );
  useHotkeys(keyboardMode ? "shift+u" : "shift+w", () =>
    addMoveToQueue(cube, moveGroup, add, "U'")
  );
  useHotkeys(keyboardMode ? "shift+d" : "shift+s", () =>
    addMoveToQueue(cube, moveGroup, add, "D'")
  );
  useHotkeys(keyboardMode ? "shift+f" : "shift+e", () =>
    addMoveToQueue(cube, moveGroup, add, "F'")
  );
  useHotkeys(keyboardMode ? "shift+b" : "shift+q", () =>
    addMoveToQueue(cube, moveGroup, add, "B'")
  );

  useFrame(() => {
    if (isThereAMoveToExecute) {
      if (!currentMove.initialized) {
        console.log({ currentMove: currentMove.move });
        currentMove.initializationFn();
      }
      if (!currentMove.stopCondition()) {
        const delta = Math.PI / 4 / 60;
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
      <ScreenSpace depth={5}>
        <Html position={[0, 2, 0]}>
          <div> WHERE IS MY DIIIIIIIIIIV </div>
        </Html>
      </ScreenSpace>
    </>
  );
};

export default Controls;
