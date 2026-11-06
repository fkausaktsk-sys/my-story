"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
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
  viewResetKey: number;
  onRotatedChange: (rotated: boolean) => void;
};

// 왼쪽 위에서 내려다보는 아이소메트릭 시점
const CAMERA_OFFSET = new THREE.Vector3(14, 11, 14);
// 시작 화면은 건물 주변까지 보이도록 조금 멀리서 봅니다
const INTRO_FIT = 0.62;
// 드래그로 돌릴 수 있는 좌우 각도(약 35도). 더 돌리면 방의 벽 뒷면이 보입니다
const MAX_YAW = 0.61;
const DRAG_SPEED = 0.0045;
// 이만큼 돌아가 있으면 원래 시점 버튼을 보여 줍니다
const ROTATED_THRESHOLD = 0.02;

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// 캐릭터를 따라 카메라와 주 조명을 옮깁니다
function CameraRig({
  started,
  reduced,
  viewResetKey,
  onRotatedChange,
}: {
  started: boolean;
  reduced: boolean;
  viewResetKey: number;
  onRotatedChange: (rotated: boolean) => void;
}) {
  const canvas = useThree((state) => state.gl.domElement);
  const lightRef = useRef<THREE.DirectionalLight>(null);
  const lightTarget = useMemo(() => new THREE.Object3D(), []);
  const focusY = useRef(floorBaseY(0) + 1.6);
  const fit = useRef(INTRO_FIT);
  const view = useRef({ yaw: 0, target: 0, dragging: false, lastX: 0, rotated: false });

  // 드래그한 각도는 손을 놓아도 그대로 유지합니다
  useEffect(() => {
    if (!started) return;
    const state = view.current;
    const onDown = (event: PointerEvent) => {
      state.dragging = true;
      state.lastX = event.clientX;
    };
    const onMove = (event: PointerEvent) => {
      if (!state.dragging) return;
      const dx = event.clientX - state.lastX;
      state.lastX = event.clientX;
      state.target = THREE.MathUtils.clamp(state.target - dx * DRAG_SPEED, -MAX_YAW, MAX_YAW);
      const rotated = Math.abs(state.target) > ROTATED_THRESHOLD;
      if (rotated !== state.rotated) {
        state.rotated = rotated;
        onRotatedChange(rotated);
      }
    };
    const onUp = () => {
      state.dragging = false;
    };
    canvas.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      canvas.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [canvas, started, onRotatedChange]);

  // 원래 시점 버튼
  useEffect(() => {
    view.current.target = 0;
    view.current.rotated = false;
  }, [viewResetKey]);

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
    const orbit = view.current;
    orbit.yaw += (orbit.target - orbit.yaw) * (reduced ? 1 : 1 - Math.exp(-12 * Math.min(delta, 0.25)));
    const cos = Math.cos(orbit.yaw);
    const sin = Math.sin(orbit.yaw);
    ortho.position.set(
      CAMERA_OFFSET.x * cos + CAMERA_OFFSET.z * sin,
      focusY.current + CAMERA_OFFSET.y,
      CAMERA_OFFSET.z * cos - CAMERA_OFFSET.x * sin,
    );
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
  viewResetKey,
  onRotatedChange,
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
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", onContextLost);
        // 모바일에서 손가락 드래그를 스크롤이 아닌 시점 회전으로 씁니다
        gl.domElement.style.touchAction = "none";
      }}
    >
      <color attach="background" args={["#10152b"]} />
      <hemisphereLight args={["#a9b8ee", "#5a4632", 1.9]} />
      <CameraRig
        started={started}
        reduced={reduced}
        viewResetKey={viewResetKey}
        onRotatedChange={onRotatedChange}
      />
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
