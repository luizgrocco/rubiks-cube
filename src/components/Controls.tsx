import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useControls } from 'leva';
import { RefObject, useRef, useState } from 'react';
import { useQueue } from 'react-use';
import { Group } from 'three';
import { getCubiesByFace, makeMove, Move } from '../utils';
import { RubikCube } from './Cube';

interface ControlsProps {
  cubeRef: RefObject<RubikCube>;
  position: [x: number, y: number, z: number];
}

const Controls = ({ cubeRef, position: [x, y, z] }: ControlsProps) => {
  const moveGroup = useRef<Group>(null);
  const { add, remove, first, last, size } = useQueue<Move>();
  const [currentMove, setCurrentMove] = useState<Move>();

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

  console.log({ first });
  useFrame((state) => {
    if (currentMove) {
      const delta = Math.PI / 4 / 144;
      if (moveGroup.current) makeMove(currentMove, moveGroup.current, delta);
    }
    // if (moveGroup.current) {
    //   const time = state.clock.getElapsedTime();
    //   moveGroup.current.rotation.x = Math.sin(time);
    // }
  });

  return (
    <>
      <group position={[x, y, z]} ref={moveGroup} />
      <Html position={[0, 0, 3]}>
        <button
          type="button"
          onClick={() => {
            // const leftFaces = cubeRef.current
            //   ? getCubiesByFace('FRONT', cubeRef.current)
            //   : [];

            // leftFaces.forEach((face) => {
            //   if (moveGroup.current) moveGroup.current.add(face);
            // });
            setCurrentMove("L'");
            if (moveGroup.current && cubeRef.current)
              moveGroup.current.add(
                ...getCubiesByFace('LEFT', cubeRef.current)
              );
            if (size === 0) add('R');
            if (first === 'R') remove();

            console.log({ size });

            // State after event
            console.log({ cubeRef });
            console.log({ moveGroup });
          }}>
          Click me!
        </button>
      </Html>
    </>
  );
};

export default Controls;
