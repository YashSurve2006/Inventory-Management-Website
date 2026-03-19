import { useGLTF } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

/* =========================================================
   GPU MODEL
========================================================= */
export default function GPUModel({ selected }) {
    const group = useRef();

    const { scene } = useGLTF("/models/gpu.glb");

    /* =========================================================
       SMALL FLOATING ANIMATION (PREMIUM FEEL)
    ========================================================= */
    useFrame((state) => {
        if (group.current) {
            group.current.position.y = 0.5 + Math.sin(state.clock.elapsedTime) * 0.05;
        }
    });

    return (
        <group
            ref={group}
            position={[0, 0, 0.8]}   // adjust inside cabinet
            rotation={[0, Math.PI, 0]}
            scale={0.8}
        >
            <primitive object={scene} />
        </group>
    );
}

/* PRELOAD */
useGLTF.preload("/models/gpu.glb");