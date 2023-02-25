export default function Floor() {
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, -2, 0]} receiveShadow>
      <circleGeometry args={[7]} />
      <meshStandardMaterial color="black" />
    </mesh>
  );
}
