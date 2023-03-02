import { useState } from 'react';
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
import Controls from './Controls';

const Scene = () => {
  const [cube, setCube] = useState<RubikCube | null>(null);

  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[7, 5, 7]} near={0.1} far={1000}>
        <Box args={[1, 0, 0]} />
      </PerspectiveCamera>
      <Environment files="sunflowers_puresky_1k.hdr" background />
      <Stats />
      <OrbitControls />
      <Cube position={[0, 0, 0]} ref={(node) => setCube(node)} />
      <Floor />
      <axesHelper args={[3]} />
      {cube && <Controls cube={cube} position={[0, 0, 0]} />}
      {/* TODO: Refactor Controls and Cube to be contained by another component (no setState in this component!) */}
    </Canvas>
  );
};

export default Scene;
