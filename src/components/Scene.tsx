import { Canvas } from '@react-three/fiber';
import {
  Stats,
  OrbitControls,
  Environment,
  PerspectiveCamera,
  Box
} from '@react-three/drei';
import Floor from './Floor';
import Cube, { RubikCube } from './Cube';
import { useRef } from 'react';
import { type Camera } from 'three';
import Controls from './Controls';

const Scene = () => {
  const cameraRef = useRef<Camera>();
  const cubeRef = useRef<RubikCube>(null);

  console.log({ cameraRef });

  return (
    <Canvas>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[7, 5, 7]}
        near={0.1}
        far={1000}>
        <Box args={[1, 0, 0]} />
      </PerspectiveCamera>
      <Environment files="sunflowers_puresky_1k.hdr" background />
      <Stats />
      <OrbitControls />

      <Cube position={[0, 0, 0]} ref={cubeRef} />

      <Floor />
      <axesHelper args={[3]} />
      <Controls cubeRef={cubeRef} position={[0, 0, 0]} />
    </Canvas>
  );
};

export default Scene;
