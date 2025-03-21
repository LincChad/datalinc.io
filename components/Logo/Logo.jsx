import { Canvas } from "@react-three/fiber";
import Settings from "./Settings.jsx";
import Globe from "./Globe.jsx";
import { LinearSRGBColorSpace, NoToneMapping } from "three";

const Logo = (props) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <Canvas
        gl={{
          toneMapping: NoToneMapping,
          outputColorSpace: LinearSRGBColorSpace,
        }}
        camera={{
          fov: 18,
          position: [0, 0, props.distance || 20],
        }}
      >
        <Settings {...props} />
        <Globe {...props} />
      </Canvas>
    </div>
  );
};

export default Logo;

