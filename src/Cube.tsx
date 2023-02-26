import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { Group, MeshBasicMaterial, Vector3 } from 'three';
import Cubie from './Cubie';

interface CubeProps {
  position: Vector3;
}

const Cube = ({ position: { x, y, z } }: CubeProps) => {
  const cubeRef = useRef<Group>(null);
  const moveGroup = useMemo(() => new Group(), []);

  console.log({ moveGroup });

  const cubieMaterials = useMemo(
    () => [
      new MeshBasicMaterial({ color: 'red' }),
      new MeshBasicMaterial({ color: 'orange' }),
      new MeshBasicMaterial({ color: 'white' }),
      new MeshBasicMaterial({ color: 'yellow' }),
      new MeshBasicMaterial({ color: 'green' }),
      new MeshBasicMaterial({ color: 'blue' })
    ],
    []
  );

  const selectedMaterial = useMemo(
    () => new MeshBasicMaterial({ color: 'hotpink' }),
    []
  );

  const cubiePositions = useMemo(() => {
    const positions = [];
    for (let i = -1 + x; i <= 1 + x; i++) {
      for (let j = -1 + y; j <= 1 + y; j++) {
        for (let k = -1 + z; k <= 1 + z; k++) {
          if (!(i === x && j === y && k === z)) {
            positions.push([i, j, k]);
          }
        }
      }
    }
    return positions;
  }, [x, y, z]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (cubeRef.current) cubeRef.current.rotation.x = Math.sin(time);
  });

  return (
    <group ref={cubeRef} position={[x, y, z]}>
      {cubiePositions.map(([x, y, z], index) => (
        <Cubie
          key={index}
          position={[x, y, z]}
          cubieMaterials={cubieMaterials}
          selectedMaterial={selectedMaterial}
        />
      ))}
    </group>
  );
};

export default Cube;
