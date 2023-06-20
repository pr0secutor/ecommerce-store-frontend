import React, { Suspense } from "react";
import { useMediaQuery } from "react-responsive";

import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import { Model } from "./3dComponents/Nike_air_zoom_pegasus_36";

const HeroBanner = () => {
  const isSmallerThan620 = useMediaQuery({ query: "(max-width:620px)" });

  return (
    <div className="relative w-full h-[540px] max-w-[1360px] mx-auto animate-fade-in">
      <Suspense fallback={null}>
        <Canvas camera={{ position: [0, 0, 4], fov: 40 }}>
          <ambientLight intensity={0.7} />
          <spotLight
            intensity={0.5}
            angle={0.1}
            penumbra={1}
            position={[10, 15, -5]}
            castShadow
          />
          <ContactShadows
            resolution={512}
            position={[0, -0.8, 0]}
            opacity={1}
            scale={10}
            blur={2}
            far={1}
          />
          <Model scale={isSmallerThan620 ? 1 : 1.55} />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default HeroBanner;
