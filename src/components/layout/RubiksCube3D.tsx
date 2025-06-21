import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';

function RubiksCube() {
  // 3x3x3 Rubik's cube, each face subdivided
  const cubelets = [];
  for (let x = -1; x <= 1; x++)
    for (let y = -1; y <= 1; y++)
      for (let z = -1; z <= 1; z++)
        cubelets.push([x, y, z]);

  return (
    <group>
      {cubelets.map(([x, y, z], i) => (
        <mesh
          key={i}
          position={[x * 1.05, y * 1.05, z * 1.05]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshPhysicalMaterial
            color={z === 1 ? '#fff' : '#222'}
            metalness={1}
            roughness={0.08}
            clearcoat={1}
            reflectivity={1}
            envMapIntensity={1.5}
          />
        </mesh>
      ))}
    </group>
  );
}

const RubiksCube3D = () => (
  <Canvas camera={{ position: [5, 5, 5], fov: 40 }} shadows>
    <ambientLight intensity={0.3} />
    <directionalLight position={[10, 10, 10]} intensity={1.5} castShadow />
    <directionalLight position={[-10, -10, 10]} intensity={0.5} />
    <RubiksCube />
    <OrbitControls enableZoom={false} autoRotate />
  </Canvas>
);

export default RubiksCube3D; 