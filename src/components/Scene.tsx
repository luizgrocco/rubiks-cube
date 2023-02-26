import { Canvas } from '@react-three/fiber';
import {
  Stats,
  OrbitControls,
  Environment,
  PerspectiveCamera
} from '@react-three/drei';
import Floor from './Floor';
import Cube from './Cube';
import { Vector3 } from 'three';
import Cubie from './Cubie';

const Scene = () => {
  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[7, 5, 7]} near={0.1} far={1000}>
        <Cubie position={[3, 3, 3]} visible={true} />
      </PerspectiveCamera>
      <Environment files="sunflowers_puresky_1k.hdr" background />
      <Stats />
      <OrbitControls />

      <Cube position={new Vector3(0, 0, 0)} />

      <Floor />
      <axesHelper args={[3]} />
    </Canvas>
  );
};

export default Scene;
