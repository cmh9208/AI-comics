import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import styled from 'styled-components';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

type ModelProps = {
  [propName: string]: any;
};

type GLTFResult = GLTF & {
  nodes: {
    [name: string]: THREE.Mesh;
  };
  materials: {
    [name: string]: THREE.Material;
  };
};

function Model(props: ModelProps) {
  const group = useRef<THREE.Group>(null);
  const { nodes, materials } = useGLTF('/3d/scene.gltf') as GLTFResult;
  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <group rotation={[-Math.PI / 2, 0, 0]} scale={100}>
            <mesh geometry={nodes.Cube_Material_0.geometry} material={materials.Material} />
          </group>
        </group>
      </group>
    </group>
  );
}

function Example() {
  return (
    <Container>
      <Canvas>
        <ambientLight intensity={0.5} />
        <spotLight intensity={0.8} position={[300, 300, 400]} />
        <Model />
        <OrbitControls />
      </Canvas>
    </Container>
  );
}

const Container = styled.div`
  width: 470px;
  height: 470px;
  background: #ffffff;
`;

export default Example;
