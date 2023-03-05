import { Edges } from "@react-three/drei";
import { MeshProps } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Material, Mesh } from "three";

interface CubieProps extends MeshProps {
  selectedMaterial: Material;
  cubieMaterials: Array<Material>;
}

export default function Cubie({
  cubieMaterials,
  selectedMaterial,
  geometry,
  ...meshProps
}: CubieProps) {
  const cubieRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  return (
    <mesh
      {...meshProps}
      ref={cubieRef}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
      castShadow
      geometry={geometry}
      material={hovered ? selectedMaterial : cubieMaterials}
    >
      <Edges />
    </mesh>
  );
}
