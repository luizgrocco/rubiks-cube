import { Canvas } from '@react-three/fiber';
import { Stats, OrbitControls, Environment } from '@react-three/drei';
import Floor from './Floor';

const App = () => {
  return (
    <Canvas camera={{ position: [-0.5, 1, 2] }}>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <Floor />

      <Stats />
      <Environment preset="forest" background />
      <OrbitControls />
      <axesHelper args={[5]} />
    </Canvas>
  );
};

export default App;
