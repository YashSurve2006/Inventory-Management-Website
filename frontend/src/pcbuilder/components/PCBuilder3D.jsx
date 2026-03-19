import { Canvas, useFrame } from "@react-three/fiber";
import {
    OrbitControls,
    Environment,
    ContactShadows,
    Html,
    Stats,
} from "@react-three/drei";
import { Suspense, useRef, useState, useEffect } from "react";
import { useBuilder } from "../context/BuilderContext";
import CabinetModel from "./models/CabinetModel";
/* =========================================================
   LOADER (ADVANCED UX)
========================================================= */
function Loader() {
    return (
        <Html center>
            <div className="text-white text-sm bg-black/70 px-4 py-2 rounded-lg">
                Loading 3D Scene...
            </div>
        </Html>
    );
}

/* =========================================================
   CAMERA RIG (SMOOTH MOTION)
========================================================= */
function CameraRig() {
    const ref = useRef();

    useFrame((state) => {
        if (!ref.current) return;

        const t = state.clock.getElapsedTime();

        ref.current.position.x = Math.sin(t * 0.2) * 0.5;
        ref.current.position.z = 5 + Math.cos(t * 0.2) * 0.3;

        ref.current.lookAt(0, 1, 0);
    });

    return <perspectiveCamera ref={ref} makeDefault position={[5, 3, 5]} />;
}

/* =========================================================
   ADVANCED LIGHTING SYSTEM
========================================================= */
function SceneLights() {
    return (
        <>
            {/* Ambient */}
            <ambientLight intensity={0.4} />

            {/* Key Light */}
            <directionalLight
                position={[5, 10, 5]}
                intensity={1.2}
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
            />

            {/* Rim Light */}
            <directionalLight position={[-5, 5, -5]} intensity={0.5} color="#6366f1" />

            {/* Fill Light */}
            <pointLight position={[0, 3, 0]} intensity={0.5} />
        </>
    );
}

/* =========================================================
   FLOOR (REALISM)
========================================================= */
function Floor() {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color="#0f172a" />
        </mesh>
    );
}

/* =========================================================
   PLACEHOLDER PC (TEMP)
========================================================= */
function PCMock() {
    const ref = useRef();

    useFrame(() => {
        if (ref.current) {
            ref.current.rotation.y += 0.002;
        }
    });
    <CabinetModel selected={selected} />
    return (
        <group ref={ref}>
            {/* Cabinet */}
            <mesh castShadow>
                <boxGeometry args={[2, 4, 2]} />
                <meshStandardMaterial color="#6d28d9" metalness={0.6} roughness={0.3} />
            </mesh>

            {/* GPU placeholder */}
            <mesh position={[0, 0.5, 1]}>
                <boxGeometry args={[1.5, 0.5, 0.2]} />
                <meshStandardMaterial color="#22c55e" />
            </mesh>

            {/* CPU placeholder */}
            <mesh position={[0, 1.5, 0]}>
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshStandardMaterial color="#facc15" />
            </mesh>
        </group>
    );
}

/* =========================================================
   RESPONSIVE HOOK
========================================================= */
function useWindowSize() {
    const [size, setSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        const resize = () => {
            setSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
    }, []);

    return size;
}

/* =========================================================
   MAIN COMPONENT
========================================================= */
export default function PCBuilder3D() {
    const { selected } = useBuilder();
    const size = useWindowSize();

    const [quality, setQuality] = useState("high");

    /* =========================================================
       PERFORMANCE ADJUSTMENT (FUTURE READY)
    ========================================================= */
    useEffect(() => {
        if (size.width < 768) {
            setQuality("low");
        } else {
            setQuality("high");
        }
    }, [size]);

    return (
        <div className="w-full h-[450px] rounded-2xl overflow-hidden border border-white/10 bg-black">

            <Canvas
                shadows
                dpr={quality === "high" ? [1, 2] : 1}
                gl={{ antialias: true, powerPreference: "high-performance" }}
            >
                <Suspense fallback={<Loader />}>

                    {/* CAMERA */}
                    <CameraRig />

                    {/* LIGHTS */}
                    <SceneLights />

                    {/* ENVIRONMENT */}
                    <Environment preset="city" />

                    {/* FLOOR */}
                    <Floor />

                    {/* SHADOWS */}
                    <ContactShadows
                        position={[0, -1.99, 0]}
                        opacity={0.4}
                        scale={10}
                        blur={2.5}
                    />

                    {/* MODEL */}
                    <PCMock />

                    {/* CONTROLS */}
                    <OrbitControls
                        enableZoom
                        enablePan={false}
                        maxPolarAngle={Math.PI / 2}
                    />

                    {/* DEBUG (REMOVE IN PROD) */}
                    {/* <Stats /> */}

                </Suspense>
            </Canvas>
        </div>
    );
}