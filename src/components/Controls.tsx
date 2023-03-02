import { useFrame, useThree } from '@react-three/fiber';
import { useControls } from 'leva';
import { useEffect, useMemo } from 'react';
import { useQueue } from 'react-use';
import { Group } from 'three';
import { useHotkeys } from 'react-hotkeys-hook';
import { addMoveToQueue, cleanUpMove, makeMove, Move } from '../utils';
import { RubikCube } from './Cube';

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

  const { add, remove, first: currentMove, size } = useQueue<QueueAction>();
  const isThereAMoveToExecute = useMemo(() => size > 0, [size]);

  useHotkeys('r', () => addMoveToQueue(add, 'R', moveGroup, cube));
  useHotkeys('l', () => addMoveToQueue(add, 'L', moveGroup, cube));
  useHotkeys('u', () => addMoveToQueue(add, 'U', moveGroup, cube));
  useHotkeys('d', () => addMoveToQueue(add, 'D', moveGroup, cube));
  useHotkeys('f', () => addMoveToQueue(add, 'F', moveGroup, cube));
  useHotkeys('b', () => addMoveToQueue(add, 'B', moveGroup, cube));
  useHotkeys('shift+r', () => addMoveToQueue(add, "R'", moveGroup, cube));
  useHotkeys('shift+l', () => addMoveToQueue(add, "L'", moveGroup, cube));
  useHotkeys('shift+u', () => addMoveToQueue(add, "U'", moveGroup, cube));
  useHotkeys('shift+d', () => addMoveToQueue(add, "D'", moveGroup, cube));
  useHotkeys('shift+f', () => addMoveToQueue(add, "F'", moveGroup, cube));
  useHotkeys('shift+b', () => addMoveToQueue(add, "B'", moveGroup, cube));

  useControls(() => ({
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
    }
  }));

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
      {/* <Html position={[0, 0, 3]}>
        <button type="button">Click me!</button>
      </Html> */}
    </>
  );
};

export default Controls;
