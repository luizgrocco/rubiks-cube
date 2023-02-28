import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useControls } from 'leva';
import { RefObject, useMemo, useRef } from 'react';
import { useQueue } from 'react-use';
import { Group } from 'three';
import { getCubiesByMove, makeMove, Move } from '../utils';
import { RubikCube } from './Cube';

interface QueueAction {
  move: Move;
  initialized: boolean;
  initializationFn: () => void;
  stopCondition: () => boolean;
}

interface ControlsProps {
  cubeRef: RefObject<RubikCube>;
  position: [x: number, y: number, z: number];
}

const Controls = ({ cubeRef, position: [x, y, z] }: ControlsProps) => {
  const moveGroup = useRef<Group>(null);
  const { add, remove, first: currentMove, size } = useQueue<QueueAction>();
  const isThereMoveToExecute = useMemo(() => size > 0, [size]);

  useControls(() => ({
    rotateX: {
      value: 0,
      min: 0,
      max: 360,
      step: 1,
      onChange: (rotateX) => {
        if (cubeRef.current)
          cubeRef.current.rotation.x = (rotateX * Math.PI) / 180;
      }
    },
    rotateY: {
      value: 0,
      min: 0,
      max: 360,
      step: 1,
      onChange: (rotateY) => {
        if (cubeRef.current)
          cubeRef.current.rotation.y = (rotateY * Math.PI) / 180;
      }
    },
    rotateZ: {
      value: 0,
      min: 0,
      max: 360,
      step: 1,
      onChange: (rotateZ) => {
        if (cubeRef.current)
          cubeRef.current.rotation.z = (rotateZ * Math.PI) / 180;
      }
    },
    resetCube: {
      value: true,
      onChange: () => {
        if (cubeRef.current) {
          cubeRef.current.rotation.set(0, 0, 0);
          cubeRef.current.position.set(x, y, z);
        }
      }
    }
  }));

  useFrame(() => {
    if (isThereMoveToExecute) {
      if (!currentMove.initialized) currentMove.initializationFn();
      if (!currentMove.stopCondition()) {
        const delta = Math.PI / 4 / 144;
        if (moveGroup.current)
          makeMove(currentMove.move, moveGroup.current, delta);
      } else {
        remove();
      }
    }
  });

  return (
    <>
      <group position={[x, y, z]} ref={moveGroup} />
      <Html position={[0, 0, 3]}>
        <button
          type="button"
          onClick={() => {
            add({
              move: 'R',
              initialized: false,
              initializationFn: function () {
                if (moveGroup.current && cubeRef.current) {
                  console.log('initialized');
                  moveGroup.current.add(
                    ...getCubiesByMove('R', cubeRef.current)
                  );
                  this.initialized = true;
                } else {
                  this.initialized = false;
                }
                console.log(this.initialized);
              },
              stopCondition: () => {
                if (moveGroup.current) {
                  return moveGroup.current.rotation.x >= Math.PI / 4;
                } else {
                  return false;
                }
              }
            });
            // const leftFaces = cubeRef.current
            //   ? getCubiesByFace('FRONT', cubeRef.current)
            //   : [];
            // leftFaces.forEach((face) => {
            //   if (moveGroup.current) moveGroup.current.add(face);
            // });
            // if (moveGroup.current && cubeRef.current)
            //   moveGroup.current.add(
            //     ...getCubiesByFace('LEFT', cubeRef.current)
            //   );
            // if (size === 0) add('R');
            // if (first === 'R') remove();
            // console.log({ size });
            // // State after event
            // console.log({ cubeRef });
            // console.log({ moveGroup });
          }}>
          Click me!
        </button>
        {/* <ul>
          <li>first: {first}</li>
          <li>last: {last}</li>
          <li>size: {size}</li>
        </ul>
        <button onClick={() => add((last || 0) + 1)}>Add</button>
        <button
          onClick={() => {
            const removedValue = remove();
            console.log({ removedValue });
          }}>
          Remove
        </button> */}
      </Html>
    </>
  );
};

export default Controls;
