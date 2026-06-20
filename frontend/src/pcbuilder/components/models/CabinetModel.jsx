import { useGLTF } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

/* =========================================================
   CABINET MODEL
========================================================= */
export default function CabinetModel({ selected }) {
    const group = useRef();

    const { scene } = useGLTF("/models/cabinet.glb");

    /* =========================================================
       AUTO ROTATION (SUBTLE)
    ========================================================= */
    useFrame(() => {
        if (group.current) {
            group.current.rotation.y += 0.002;
        }
    });

    return (
        <group ref={group} position={[0, -2, 0]} scale={1.5}>
            <primitive object={scene} />
        </group>
    );
}

/* PRELOAD */
useGLTF.preload("/models/cabinet.glb");