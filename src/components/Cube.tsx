import { useEffect, useMemo, useRef } from 'react';
import { BoxGeometry, Group, MeshBasicMaterial } from 'three';
import Cubie from './Cubie';
import { useSceneStore } from '../store/zustand';

interface CubeProps {
  position: [x: number, y: number, z: number];
}

const Cube = ({ position: [x, y, z] }: CubeProps) => {
  const { setCubeRef, setMoveGroupRef } = useSceneStore();
  const cubeRef = useRef<Group>(null);
  const moveGroup = useMemo(() => {
    const group = new Group();
    group.position.set(x, y, z);
    return group;
  }, [x, y, z]);

  useEffect(() => {
    if (cubeRef.current) setCubeRef(cubeRef.current);

    return () => setCubeRef(null);
  }, [cubeRef, setCubeRef]);

  useEffect(() => {
    setMoveGroupRef(moveGroup);

    return () => setMoveGroupRef(null);
  }, [moveGroup, setMoveGroupRef]);

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

  const cubieGeometry = useMemo(() => new BoxGeometry(1, 1), []);

  return (
    <group ref={cubeRef} position={[x, y, z]}>
      {cubiePositions.map(([x, y, z], index) => (
        <Cubie
          key={index}
          position={[x, y, z]}
          geometry={cubieGeometry}
          cubieMaterials={cubieMaterials}
          selectedMaterial={selectedMaterial}
        />
      ))}
    </group>
  );
};

export default Cube;
