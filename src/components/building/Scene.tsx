"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import Building from "@/components/building/Building";
import { floorBaseY } from "@/data/floors";
import { avatar } from "@/lib/avatar";
import { ROOM, STAIR } from "@/lib/route";

type Props = {
  started: boolean;
  floorIndex: number;
  moving: boolean;
  seen: ReadonlySet<string>;
  activeStoryId: string | null;
  hintId: string | null;
  onSelectStory: (id: string) => void;
  onArrive: () => void;
  onContextLost: () => void;
  viewResetKey: number;
  onRotatedChange: (rotated: boolean) => void;
};

// 시작 화면: 왼쪽 위에서 건물 전체를 내려다보는 아이소메트릭 시점
const CAMERA_OFFSET = new THREE.Vector3(14, 11, 14);
const INTRO_FIT = 0.62;
// 방의 아이소메트릭 투영 크기(가로, 세로). 시작 화면 확대 비율의 기준입니다
const ROOM_PROJECTED = { width: 15.8, height: 12.7 };
// 들어간 뒤: 사무실 앞쪽 오른편 구석 천장 가까이에서 방 안을 바라보는 원근 시점(층 바닥 기준)
const ROOM_EYE = new THREE.Vector3(4.5, 3.3, 4.15);
const ROOM_LOOK = new THREE.Vector3(-1.9, 0.2, -2.1);
const ROOM_FOV = 60;
// 시작 화면에서 사무실 안까지 확대되며 들어가는 시간(초)
const ENTER_DURATION = 2.2;
const ENTER_START_FOV = 8;
// 이동 중: 샛별의 등 뒤 위쪽에서 따라갑니다
const FOLLOW = { back: 3.1, min: 2.2, up: 2.3, ahead: 0.9, lookY: 1.0, fov: 62 };
// 따라가는 카메라가 뒤쪽·왼쪽 벽을 뚫고 나가지 않고, 위아래 층 계단이 겹치는 계단실 칸에도 들어가지 않게 막는 경계
const INSIDE = { left: -ROOM.width / 2 + 0.45, back: -ROOM.depth / 2 + 0.45, right: STAIR.bandStart - 0.5 };
const clampInside = (value: number, axis: "x" | "z") =>
  axis === "x" ? THREE.MathUtils.clamp(value, INSIDE.left, INSIDE.right) : Math.max(INSIDE.back, value);
// 물러날 때 향하는 방 안쪽 지점
const ROOM_CENTER = { x: 0, z: 1.5 };
// 드래그로 고개를 돌릴 수 있는 좌우 각도(약 35도)
const MAX_YAW = 0.61;
const DRAG_SPEED = 0.0035;
// 이만큼 돌아가 있으면 원래 시점 버튼을 보여 줍니다
const ROTATED_THRESHOLD = 0.02;

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// 세로로 긴 화면에서는 좌우가 너무 좁아지지 않도록 시야를 넓힙니다
const fovFor = (base: number, aspect: number) => (aspect < 1 ? base + (1 - aspect) * 34 : base);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const halfTan = (fov: number) => Math.tan(THREE.MathUtils.degToRad(fov) / 2);

type Rig = {
  ortho: THREE.OrthographicCamera;
  eye: THREE.PerspectiveCamera;
  // 원근 카메라의 현재 위치·바라보는 점·시야각. 목표값을 향해 부드럽게 따라갑니다
  pos: THREE.Vector3;
  look: THREE.Vector3;
  fov: number;
  goalPos: THREE.Vector3;
  goalLook: THREE.Vector3;
  heading: THREE.Vector3;
  // 들어가기 연출: 시작 화면 구도에서 출발한 진행도(0~1). null이면 끝났습니다
  enter: { t: number; look: THREE.Vector3; dir: THREE.Vector3; frame: number } | null;
};

// 시작 화면은 정사영 카메라로 건물을 보고, 들어가면 원근 카메라로 확대되며 사무실 안으로 들어갑니다.
// 층을 옮길 때는 같은 원근 카메라가 샛별을 뒤에서 따라갑니다
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
  const setThree = useThree((state) => state.set);
  const getThree = useThree((state) => state.get);
  const rig = useRef<Rig | null>(null);
  const getRig = useCallback(
    () =>
      (rig.current ??= {
        ortho: getThree().camera as THREE.OrthographicCamera,
        eye: new THREE.PerspectiveCamera(ROOM_FOV, 1, 0.05, 400),
        pos: new THREE.Vector3(),
        look: new THREE.Vector3(),
        fov: ROOM_FOV,
        goalPos: new THREE.Vector3(),
        goalLook: new THREE.Vector3(),
        heading: new THREE.Vector3(0, 0, -1),
        enter: null,
      }),
    [getThree],
  );
  const lightRef = useRef<THREE.DirectionalLight>(null);
  const lightTarget = useMemo(() => new THREE.Object3D(), []);
  const focusY = useRef(floorBaseY(0) + 1.6);
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

  // 들어가면 시작 화면과 같은 구도의 원근 카메라로 바꾼 뒤 방 안으로 확대해 들어갑니다
  useEffect(() => {
    if (!started) return;
    const state = getRig();
    const { ortho, eye } = state;
    const { size } = getThree();
    // 정사영 화면의 세로 절반 높이. 같은 높이가 보이도록 먼 거리에서 좁은 시야로 시작합니다
    const frame = size.height / ortho.zoom / 2;
    state.enter = reduced
      ? null
      : { t: 0, look: new THREE.Vector3(0, focusY.current, 0), dir: CAMERA_OFFSET.clone().normalize(), frame };
    setThree({ camera: eye });
    return () => setThree({ camera: ortho });
  }, [started, reduced, getRig, getThree, setThree]);

  useFrame(({ size }, delta) => {
    const state = getRig();
    const { ortho, eye, pos, look, goalPos, goalLook, heading } = state;
    const dt = Math.min(delta, 0.25);
    const step = reduced ? 1 : 1 - Math.exp(-3.2 * dt);
    focusY.current += (avatar.y + 1.6 - focusY.current) * step;
    const aspect = size.width / size.height;

    if (!started) {
      ortho.zoom = Math.min(size.width / ROOM_PROJECTED.width, size.height / ROOM_PROJECTED.height) * INTRO_FIT;
      ortho.position.set(CAMERA_OFFSET.x, focusY.current + CAMERA_OFFSET.y, CAMERA_OFFSET.z);
      ortho.lookAt(0, focusY.current, 0);
      ortho.updateProjectionMatrix();
    } else {
      // 이번 프레임의 목표 구도
      let goalFov: number;
      if (avatar.moving) {
        // 걷는 방향을 부드럽게 따라 등 뒤로 돌아갑니다
        const flat = Math.hypot(avatar.dir.x, avatar.dir.z);
        if (flat > 0.01) {
          heading.lerp({ x: avatar.dir.x / flat, y: 0, z: avatar.dir.z / flat }, 1 - Math.exp(-3 * dt));
          heading.normalize();
        }
        let camX = avatar.x - heading.x * FOLLOW.back;
        let camZ = avatar.z - heading.z * FOLLOW.back;
        // 벽이나 계단실 경계에 막혀 너무 가까워지면, 방 가운데 쪽으로 물러나서 봅니다
        if (Math.hypot(clampInside(camX, "x") - avatar.x, clampInside(camZ, "z") - avatar.z) < FOLLOW.min) {
          const toCenterX = ROOM_CENTER.x - avatar.x;
          const toCenterZ = ROOM_CENTER.z - avatar.z;
          const length = Math.hypot(toCenterX, toCenterZ) || 1;
          camX = avatar.x + (toCenterX / length) * FOLLOW.back;
          camZ = avatar.z + (toCenterZ / length) * FOLLOW.back;
        }
        goalPos.set(clampInside(camX, "x"), avatar.y + FOLLOW.up, clampInside(camZ, "z"));
        goalLook.set(
          avatar.x + heading.x * FOLLOW.ahead,
          avatar.y + FOLLOW.lookY,
          avatar.z + heading.z * FOLLOW.ahead,
        );
        goalFov = fovFor(FOLLOW.fov, aspect);
      } else {
        // 사무실 안: 구석에 서서 방을 봅니다. 드래그하면 그 자리에서 고개를 좌우로 돌립니다
        const orbit = view.current;
        orbit.yaw += (orbit.target - orbit.yaw) * (reduced ? 1 : 1 - Math.exp(-12 * dt));
        goalPos.set(ROOM_EYE.x, avatar.y + ROOM_EYE.y, ROOM_EYE.z);
        goalLook
          .subVectors(ROOM_LOOK, ROOM_EYE)
          .applyAxisAngle(THREE.Object3D.DEFAULT_UP, -orbit.yaw)
          .add(goalPos);
        goalFov = fovFor(ROOM_FOV, aspect);
      }

      const enter = state.enter;
      if (enter) {
        // 시작 화면 구도에서 목표 구도까지: 보이는 범위를 지수로 줄이며 가까이 다가갑니다
        enter.t = Math.min(1, enter.t + dt / ENTER_DURATION);
        const e = easeInOut(enter.t);
        look.lerpVectors(enter.look, goalLook, e);
        state.fov = THREE.MathUtils.lerp(ENTER_START_FOV, goalFov, e);
        const dir = pos.subVectors(goalPos, goalLook);
        const endDistance = dir.length();
        const frame = enter.frame ** (1 - e) * (endDistance * halfTan(goalFov)) ** e;
        dir.normalize().lerp(enter.dir, 1 - e).normalize();
        pos.multiplyScalar(frame / halfTan(state.fov)).add(look);
        if (enter.t >= 1) state.enter = null;
      } else {
        const follow = reduced ? 1 : 1 - Math.exp(-(avatar.moving ? 4 : 2.6) * dt);
        pos.lerp(goalPos, follow);
        look.lerp(goalLook, reduced ? 1 : 1 - Math.exp(-(avatar.moving ? 7 : 3.5) * dt));
        state.fov += (goalFov - state.fov) * follow;
      }

      eye.position.copy(pos);
      eye.lookAt(look);
      setLens(eye, state.fov, aspect);
    }

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

function setLens(camera: THREE.PerspectiveCamera, fov: number, aspect: number) {
  if (camera.fov === fov && camera.aspect === aspect) return;
  camera.fov = fov;
  camera.aspect = aspect;
  camera.updateProjectionMatrix();
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
  hintId,
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
        started={started}
        floorIndex={floorIndex}
        reduced={reduced}
        onArrive={onArrive}
        interactive={started && !moving}
        seen={seen}
        activeStoryId={activeStoryId}
        hintId={hintId}
        onSelectStory={onSelectStory}
      />
    </Canvas>
  );
}
