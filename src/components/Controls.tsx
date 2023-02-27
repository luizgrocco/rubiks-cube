import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useControls } from 'leva';
import { useSceneStore } from '../store/zustand';

const Controls = () => {
  const { cubeRef } = useSceneStore();

  useControls(() => ({
    rotateX: {
      value: 0,
      min: 0,
      max: 360,
      step: 1,
      onChange: (rotateX) => {
        if (cubeRef) cubeRef.rotation.x = (rotateX * Math.PI) / 180;
      }
    },
    rotateY: {
      value: 0,
      min: 0,
      max: 360,
      step: 1,
      onChange: (rotateY) => {
        if (cubeRef) cubeRef.rotation.y = (rotateY * Math.PI) / 180;
      }
    },
    rotateZ: {
      value: 0,
      min: 0,
      max: 360,
      step: 1,
      onChange: (rotateZ) => {
        if (cubeRef) cubeRef.rotation.z = (rotateZ * Math.PI) / 180;
      }
    },
    resetCube: {
      value: true,
      onChange: () => {
        console.log({ cubeRef });
        cubeRef?.rotation.set(0, 0, 0);
      }
    }
  }));

  useFrame((state) => {
    // if (cubeRef) {
    //   cubeRef.rotation.x = (rotateX * Math.PI) / 180;
    //   cubeRef.rotation.y = (rotateY * Math.PI) / 180;
    //   cubeRef.rotation.z = (rotateZ * Math.PI) / 180;
    // }
  });

  return (
    <Html position={[0, 0, 3]}>
      <button type="button">Click me!</button>
    </Html>
  );
};

export default Controls;
