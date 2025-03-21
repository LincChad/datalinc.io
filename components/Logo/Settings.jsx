import { OrbitControls } from "@react-three/drei";
import { Perf } from "r3f-perf";

const Settings = ({ showDebugPanel = false }) => {
  return (
    <>
      {showDebugPanel ? <Perf position="top-left" /> : null}
      <OrbitControls
        enablePan={false}
        minPolarAngle={Math.PI * 0.5}
        maxPolarAngle={Math.PI * 0.5}
        enableZoom={false}
      />
    </>
  );
};

export default Settings;
