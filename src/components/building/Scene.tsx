"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import Building from "@/components/building/Building";
import { floorBaseY } from "@/data/floors";
import { avatar } from "@/lib/avatar";

type Props = {
  started: boolean;
  floorIndex: number;
  moving: boolean;
  seen: ReadonlySet<string>;
  activeStoryId: string | null;
  onSelectStory: (id: string) => void;
  onArrive: () => void;
  onContextLost: () => void;
};

// 왼쪽 위에서 내려다보는 아이소메트릭 시점
const CAMERA_OFFSET = new THREE.Vector3(14, 11, 14);
// 시작 화면은 건물 주변까지 보이도록 조금 멀리서 봅니다
const INTRO_FIT = 0.62;

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// 캐릭터를 따라 카메라와 주 조명을 옮깁니다
function CameraRig({ started, reduced }: { started: boolean; reduced: boolean }) {
  const lightRef = useRef<THREE.DirectionalLight>(null);
  const lightTarget = useMemo(() => new THREE.Object3D(), []);
  const focusY = useRef(floorBaseY(0) + 1.6);
  const fit = useRef(INTRO_FIT);

  useFrame(({ camera, size }, delta) => {
    const narrow = size.width < 768;
    const targetY = avatar.y + 1.6;
    const targetFit = started ? 1 : INTRO_FIT;
    const step = reduced ? 1 : 1 - Math.exp(-3.2 * Math.min(delta, 0.25));

    focusY.current += (targetY - focusY.current) * step;
    fit.current += (targetFit - fit.current) * step;

    // 방이 화면의 약 90%를 채우도록 방의 투영 크기(가로 11.6, 세로 8.8)로 확대합니다
    const base = Math.min(size.width / 12.2, size.height / 9.8);
    const ortho = camera as THREE.OrthographicCamera;
    ortho.zoom = base * fit.current;
    ortho.position.set(CAMERA_OFFSET.x, focusY.current + CAMERA_OFFSET.y, CAMERA_OFFSET.z);
    // 하단 도크에 가리지 않도록 방을 화면 위쪽으로 조금 올립니다
    const lift = started ? (size.height * (narrow ? 0.07 : 0.018)) / ortho.zoom / 0.87 : 0;
    ortho.lookAt(0, focusY.current - lift, 0);
    ortho.updateProjectionMatrix();

    if (lightRef.current) {
      lightRef.current.position.set(9, focusY.current + 15, 11);
      lightTarget.position.set(0, focusY.current - 1, 0);
      lightTarget.updateMatrixWorld();
    }
  });

  return (
    <>
      <primitive object={lightTarget} />
      <directionalLight
        ref={lightRef}
        target={lightTarget}
        intensity={1.5}
        color="#b9c6ff"
        castShadow
        shadow-mapSize={[1536, 1536]}
        shadow-camera-left={-13}
        shadow-camera-right={13}
        shadow-camera-top={13}
        shadow-camera-bottom={-13}
        shadow-camera-near={1}
        shadow-camera-far={60}
        shadow-bias={-0.0006}
      />
    </>
  );
}

function ResetCursor() {
  useEffect(() => () => void (document.body.style.cursor = ""), []);
  return null;
}

export default function Scene({
  started,
  floorIndex,
  moving,
  seen,
  activeStoryId,
  onSelectStory,
  onArrive,
  onContextLost,
}: Props) {
  const lowPower = typeof window !== "undefined" && window.innerWidth < 768;
  const reduced = useMemo(() => prefersReducedMotion(), []);

  return (
    <Canvas
      orthographic
      shadows={lowPower ? false : "percentage"}
      dpr={lowPower ? [1, 1.5] : [1, 2]}
      camera={{ position: [14, 8, 14], zoom: 30, near: -100, far: 200 }}
      gl={{ antialias: true }}
      onCreated={({ gl }) => gl.domElement.addEventListener("webglcontextlost", onContextLost)}
    >
      <color attach="background" args={["#10152b"]} />
      <hemisphereLight args={["#a9b8ee", "#5a4632", 1.9]} />
      <CameraRig started={started} reduced={reduced} />
      <ResetCursor />
      <Building
        floorIndex={floorIndex}
        reduced={reduced}
        onArrive={onArrive}
        interactive={started && !moving}
        seen={seen}
        activeStoryId={activeStoryId}
        onSelectStory={onSelectStory}
      />
    </Canvas>
  );
}
