import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { MeshBasicMaterial, Color } from "three";

const vertexShader = `
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

attribute vec3 position;
attribute vec2 uv;

varying vec2 vUv;

void main() {

  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);

  vUv = uv;

}
`;

const fragmentShader = `
#define PI 3.1415926538
precision mediump float;

uniform vec3 uColor;
uniform float uTime;
uniform float uSpeed;

varying vec2 vUv;

void main () {
  float progress = (cos(uTime * uSpeed + PI) + 1.0) * 0.5;
  float edge1 = 1.0 - step(progress, vUv.x);
  float edge2 = step(pow(progress, 5.0), vUv.x);

  float status = sign(sin(uTime * uSpeed + PI));
  float tail = (status + 1.0) * 0.5 + smoothstep(pow(progress, 1.6), progress, vUv.x) * (-1.0 * status);
  
  float alpha = edge1 * edge2 * tail;

  gl_FragColor = vec4(uColor, alpha);
}
`;

const Globe = ({ rotationSpeed = 1, enableBloom }) => {
  const logo = useRef(null);

  const { nodes } = useGLTF("/logo.glb");

  const colors = useRef({
    light: new Color("#dbf1fb").multiplyScalar(enableBloom ? 1.06 : 1),
    medium: new Color("#b9e4f5").multiplyScalar(enableBloom ? 1.1 : 1),
    dark: new Color("#7cd1ed").multiplyScalar(enableBloom ? 1.3 : 1),
  });

  const materials = useRef({
    Light: new MeshBasicMaterial({
      color: colors.current.light,
      transparent: true,
    }),

    Medium: new MeshBasicMaterial({
      color: colors.current.medium,
      transparent: true,
    }),

    Dark: new MeshBasicMaterial({
      color: colors.current.dark,
      transparent: true,
    }),
  });

  const [lines, setLines] = useState([]);

  useEffect(() => {
    let lineList = [];

    for (let [name, node] of Object.entries(nodes)) {
      if (name.startsWith("_")) {
        lineList.push({
          id: name,
          geometry: node.geometry,
          color:
            name[1] === "L"
              ? colors.current.light
              : name[1] === "M"
              ? colors.current.medium
              : colors.current.dark,
        });
      }
    }

    setLines(lineList);
  }, [nodes]);

  const [elapsedUniform, setElapsedUniform] = useState({ uTime: { value: 0 } });

  useFrame((state, delta) => {
    setElapsedUniform((current) => {
      let updated = { ...current };
      updated.uTime.value += delta;
      return updated;
    });

    logo.current.rotation.y -= delta * 0.04 * rotationSpeed;
  });

  return (
    <group dispose={null} ref={logo}>
      <mesh
        geometry={nodes.LightCircles.geometry}
        material={materials.current.Light}
        renderOrder={1}
      />
      <mesh
        geometry={nodes.MediumCircles.geometry}
        material={materials.current.Medium}
        renderOrder={1}
      />
      <mesh
        geometry={nodes.DarkCircles.geometry}
        material={materials.current.Dark}
        renderOrder={1}
      />

      {lines.map((line) => {
        return (
          <mesh geometry={line.geometry} key={line.id}>
            <rawShaderMaterial
              vertexShader={vertexShader}
              fragmentShader={fragmentShader}
              transparent
              depthTest={false}
              depthWrite={false}
              uniforms={{
                ...elapsedUniform,
                uSpeed: { value: 0.4 + Math.random() * 0.2 },
                uColor: { value: line.color },
              }}
            />
          </mesh>
        );
      })}
    </group>
  );
};

export default Globe;
