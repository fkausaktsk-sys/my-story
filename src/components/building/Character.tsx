"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useCanvasTexture } from "@/components/building/parts";
import { floorBaseY, floors } from "@/data/floors";
import { avatar } from "@/lib/avatar";
import { buildRoute, type Point, SEAT } from "@/lib/route";

type Props = {
  floorIndex: number;
  reduced: boolean;
  onArrive: () => void;
};

const SHIRT = "#e0795a";
const SKIN = "#f2cdaa";
const HAIR = "#2a1e1a";
const PANTS = "#34405e";

// 샛별 캐릭터: 계단을 걸어 다니고, 도착하면 책상에 앉아 일합니다
// 머리 위 이름표. 항상 카메라를 향합니다
export function NameTag({ text, y = 2.05, size = 1 }: { text: string; y?: number; size?: number }) {
  const texture = useCanvasTexture(320, 96, (ctx) => {
    ctx.fillStyle = "rgba(20, 24, 42, 0.82)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(4, 4, 312, 88, 44);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#f4f1e8";
    ctx.font = "600 38px Pretendard, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 160, 50);
  });
  return (
    <sprite position={[0, y, 0]} scale={[1.33 * size, 0.4 * size, 1]} renderOrder={10}>
      <spriteMaterial map={texture} transparent depthTest={false} toneMapped={false} />
    </sprite>
  );
}

export default function Character({ floorIndex, reduced, onArrive }: Props) {
  const root = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  const legL = useRef<THREE.Group>(null);
  const legR = useRef<THREE.Group>(null);

  const route = useRef<Point[] | null>(null);
  const segment = useRef(0);
  const speed = useRef(3);
  const currentFloor = useRef(floorIndex);
  const seated = useRef(1);
  const heading = useRef(Math.PI);

  useEffect(() => {
    if (floorIndex === currentFloor.current) return;
    const from = currentFloor.current;
    currentFloor.current = floorIndex;
    const next = buildRoute(from, floorIndex);
    const target = next[next.length - 1];
    if (reduced) {
      Object.assign(avatar, target, { moving: false });
      onArrive();
      return;
    }
    route.current = next;
    segment.current = 0;
    // 여러 층을 한 번에 이동하면 더 빨리 걷습니다
    speed.current = 3 + Math.abs(floorIndex - from) * 0.8;
    avatar.moving = true;
  }, [floorIndex, reduced, onArrive]);

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.2);
    const state = avatar;
    const t = clock.elapsedTime;

    if (route.current) {
      let budget = speed.current * dt;
      while (route.current && budget > 0) {
        const next = route.current[segment.current];
        const dx = next.x - state.x;
        const dy = next.y - state.y;
        const dz = next.z - state.z;
        const distance = Math.hypot(dx, dy, dz);
        if (distance <= budget) {
          state.x = next.x;
          state.y = next.y;
          state.z = next.z;
          budget -= distance;
          segment.current += 1;
          if (segment.current >= route.current.length) {
            route.current = null;
            state.moving = false;
            onArrive();
          }
        } else {
          const ratio = budget / distance;
          state.x += dx * ratio;
          state.y += dy * ratio;
          state.z += dz * ratio;
          budget = 0;
          if (Math.hypot(dx, dz) > 0.001) heading.current = Math.atan2(dx, dz);
        }
      }
    }

    const walking = state.moving;
    const sitTarget = walking ? 0 : 1;
    seated.current = THREE.MathUtils.damp(seated.current, sitTarget, 8, dt);
    const sit = seated.current;
    if (!walking) heading.current = Math.PI;

    const group = root.current;
    if (group) {
      group.position.set(state.x, state.y + sit * 0.42, state.z);
      let diff = heading.current - group.rotation.y;
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      group.rotation.y += diff * Math.min(1, dt * 12);
    }

    const swing = walking ? Math.sin(t * 11) : 0;
    if (legL.current) legL.current.rotation.x = swing * 0.75 - sit * 1.5;
    if (legR.current) legR.current.rotation.x = -swing * 0.75 - sit * 1.5;
    if (armL.current) armL.current.rotation.x = -swing * 0.6 - sit * (1.25 + Math.sin(t * 13) * 0.1);
    if (armR.current) armR.current.rotation.x = swing * 0.6 - sit * (1.25 + Math.sin(t * 13 + 2.2) * 0.1);
    if (body.current) body.current.position.y = walking ? Math.abs(Math.cos(t * 11)) * 0.05 : 0;
    if (head.current) head.current.rotation.x = sit * (Math.sin(t * 0.8) * 0.05 + 0.08);
  });

  return (
    <group ref={root} position={[SEAT.x, floorBaseY(0) + 0.42, SEAT.z]} rotation={[0, Math.PI, 0]}>
      <group ref={body}>
        {/* 다리 */}
        <group ref={legL} position={[-0.12, 0.46, 0]}>
          <mesh position={[0, -0.21, 0]} castShadow>
            <capsuleGeometry args={[0.085, 0.28, 4, 8]} />
            <meshStandardMaterial color={PANTS} roughness={0.9} />
          </mesh>
        </group>
        <group ref={legR} position={[0.12, 0.46, 0]}>
          <mesh position={[0, -0.21, 0]} castShadow>
            <capsuleGeometry args={[0.085, 0.28, 4, 8]} />
            <meshStandardMaterial color={PANTS} roughness={0.9} />
          </mesh>
        </group>

        {/* 몸 */}
        <mesh position={[0, 0.76, 0]} castShadow>
          <capsuleGeometry args={[0.22, 0.26, 6, 12]} />
          <meshStandardMaterial color={SHIRT} roughness={0.85} />
        </mesh>

        {/* 팔 */}
        <group ref={armL} position={[-0.27, 0.92, 0]}>
          <mesh position={[0, -0.2, 0]} castShadow>
            <capsuleGeometry args={[0.065, 0.26, 4, 8]} />
            <meshStandardMaterial color={SHIRT} roughness={0.85} />
          </mesh>
        </group>
        <group ref={armR} position={[0.27, 0.92, 0]}>
          <mesh position={[0, -0.2, 0]} castShadow>
            <capsuleGeometry args={[0.065, 0.26, 4, 8]} />
            <meshStandardMaterial color={SHIRT} roughness={0.85} />
          </mesh>
        </group>

        {/* 머리: 큰 머리로 미니어처 느낌을 줍니다 */}
        <group ref={head} position={[0, 1.33, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.32, 20, 20]} />
            <meshStandardMaterial color={SKIN} roughness={0.75} />
          </mesh>
          <mesh position={[0, 0.07, -0.05]} scale={[1.07, 0.98, 1.05]} castShadow>
            <sphereGeometry args={[0.32, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.62]} />
            <meshStandardMaterial color={HAIR} roughness={0.9} />
          </mesh>
          {/* 어깨 아래로 내려오는 긴 머리와 앞머리 */}
          <mesh position={[0, -0.26, -0.13]} scale={[1.02, 1.5, 0.62]} castShadow>
            <sphereGeometry args={[0.3, 18, 18]} />
            <meshStandardMaterial color={HAIR} roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.17, 0.2]} rotation={[0.55, 0, 0]} scale={[0.9, 0.34, 0.5]} castShadow>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial color={HAIR} roughness={0.9} />
          </mesh>
          {/* 눈과 볼 */}
          <mesh position={[-0.11, 0.0, 0.3]}>
            <sphereGeometry args={[0.027, 10, 10]} />
            <meshStandardMaterial color="#1c1412" roughness={0.4} />
          </mesh>
          <mesh position={[0.11, 0.0, 0.3]}>
            <sphereGeometry args={[0.027, 10, 10]} />
            <meshStandardMaterial color="#1c1412" roughness={0.4} />
          </mesh>
          <mesh position={[-0.17, -0.07, 0.26]} scale={[1, 0.6, 0.4]}>
            <sphereGeometry args={[0.045, 10, 10]} />
            <meshStandardMaterial color="#f2a08c" roughness={0.8} />
          </mesh>
          <mesh position={[0.17, -0.07, 0.26]} scale={[1, 0.6, 0.4]}>
            <sphereGeometry args={[0.045, 10, 10]} />
            <meshStandardMaterial color="#f2a08c" roughness={0.8} />
          </mesh>
        </group>
      </group>

      <NameTag key={floorIndex} text={`샛별 · ${floors[floorIndex].era.length > 4 ? floors[floorIndex].label : floors[floorIndex].era}`} />
    </group>
  );
}
