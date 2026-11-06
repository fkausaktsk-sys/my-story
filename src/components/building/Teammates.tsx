"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { NameTag } from "@/components/building/Character";
import { floorBaseY } from "@/data/floors";

type Hair = "short" | "long" | "bun" | "cap";

type Look = {
  role: string;
  shirt: string;
  pants: string;
  hair: string;
  skin: string;
  style: Hair;
  glasses?: boolean;
};

// 층마다 다른 팀원 2~3명. 시대가 바뀌면 함께 일하는 사람도 바뀝니다
const TEAMS: Look[][] = [
  [
    { role: "사수", shirt: "#4f7fb5", pants: "#2c3347", hair: "#1f1a18", skin: "#efc7a3", style: "short", glasses: true },
    { role: "개발자", shirt: "#6f8f5e", pants: "#3b3a44", hair: "#2d221c", skin: "#e9bd97", style: "cap" },
  ],
  [
    { role: "팀장님", shirt: "#8a5a9e", pants: "#2f3040", hair: "#30241e", skin: "#f1cba8", style: "bun" },
    { role: "기획자", shirt: "#d9a441", pants: "#39425c", hair: "#171412", skin: "#ecc29d", style: "short" },
    { role: "개발자", shirt: "#4e9a93", pants: "#343441", hair: "#2a1f19", skin: "#e6b993", style: "short", glasses: true },
  ],
  [
    { role: "MD", shirt: "#c9604f", pants: "#2e3548", hair: "#3a2a20", skin: "#f0c8a4", style: "long" },
    { role: "디자이너", shirt: "#5b78c7", pants: "#3a3a46", hair: "#191614", skin: "#ebc09b", style: "cap" },
  ],
  [
    { role: "마케터", shirt: "#d4789a", pants: "#2f3546", hair: "#2b201b", skin: "#f1caa7", style: "bun" },
    { role: "개발자", shirt: "#5e8a70", pants: "#37363f", hair: "#1c1815", skin: "#e8bc96", style: "short", glasses: true },
    { role: "PM", shirt: "#7a6fc0", pants: "#30384c", hair: "#35261e", skin: "#edc39f", style: "short" },
  ],
  [
    { role: "UX 리서처", shirt: "#3f9fb5", pants: "#2e3446", hair: "#231b17", skin: "#f0c9a5", style: "long", glasses: true },
    { role: "개발자", shirt: "#b5864f", pants: "#393843", hair: "#1a1613", skin: "#e7bb95", style: "short" },
  ],
  [
    { role: "기획자", shirt: "#9d7bd0", pants: "#2d3446", hair: "#2a1f1a", skin: "#efc6a2", style: "bun" },
    { role: "개발자", shirt: "#4c8fcf", pants: "#33343f", hair: "#181512", skin: "#e9be98", style: "cap" },
    { role: "디자이너", shirt: "#d98a5e", pants: "#39415a", hair: "#3b2a20", skin: "#f1cba8", style: "long" },
  ],
  [
    { role: "동료", shirt: "#6d8fc4", pants: "#2e3446", hair: "#231b17", skin: "#efc6a2", style: "short" },
    { role: "동료", shirt: "#c98aa8", pants: "#363542", hair: "#2f231c", skin: "#ecc29d", style: "long" },
  ],
];

// 가구를 피하고 계단 뒤로 가려지지 않는 빈 공간의 산책로. 서로 겹치지 않게 나눠 놓았습니다
const PATROLS: [number, number][][] = [
  [
    [-0.9, 2.5],
    [1.9, 2.6],
    [0.6, 1.5],
  ],
  [
    [2.9, 1.3],
    [1.7, -0.6],
    [2.3, 0.5],
  ],
  [
    [-3.2, -0.7],
    [-1.7, -0.75],
    [-2.5, -0.6],
  ],
];

const WALK_SPEED = 1.1;

function Teammate({ look, index, reduced }: { look: Look; index: number; reduced: boolean }) {
  const patrol = PATROLS[index];
  const root = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  const legL = useRef<THREE.Group>(null);
  const legR = useRef<THREE.Group>(null);
  const motion = useRef({
    x: patrol[0][0],
    z: patrol[0][1],
    target: 1,
    // 모두 동시에 걷기 시작하지 않도록 쉬는 시간을 다르게 줍니다
    wait: 0.4 + index * 0.9,
    scale: 0,
  });

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.2);
    const state = motion.current;
    const group = root.current;
    if (!group) return;

    state.scale = THREE.MathUtils.damp(state.scale, 1, 7, dt);
    group.scale.setScalar(state.scale);

    let walking = false;
    if (!reduced) {
      if (state.wait > 0) {
        state.wait -= dt;
      } else {
        const [tx, tz] = patrol[state.target];
        const dx = tx - state.x;
        const dz = tz - state.z;
        const distance = Math.hypot(dx, dz);
        const step = WALK_SPEED * dt;
        if (distance <= step) {
          state.x = tx;
          state.z = tz;
          state.target = (state.target + 1) % patrol.length;
          state.wait = 1.4 + ((state.target + index) % 3) * 0.9;
        } else {
          walking = true;
          state.x += (dx / distance) * step;
          state.z += (dz / distance) * step;
          const heading = Math.atan2(dx, dz);
          const diff = Math.atan2(Math.sin(heading - group.rotation.y), Math.cos(heading - group.rotation.y));
          group.rotation.y += diff * Math.min(1, dt * 8);
        }
      }
    }

    group.position.set(state.x, 0, state.z);
    const t = clock.elapsedTime + index;
    const swing = walking ? Math.sin(t * 8.5) : 0;
    if (legL.current) legL.current.rotation.x = swing * 0.6;
    if (legR.current) legR.current.rotation.x = -swing * 0.6;
    if (armL.current) armL.current.rotation.x = -swing * 0.5;
    if (armR.current) armR.current.rotation.x = swing * 0.5;
  });

  const limbs = useMemo(
    () => ({
      shirt: <meshStandardMaterial color={look.shirt} roughness={0.85} />,
      pants: <meshStandardMaterial color={look.pants} roughness={0.9} />,
      hair: <meshStandardMaterial color={look.hair} roughness={0.9} />,
    }),
    [look],
  );

  return (
    <group ref={root} position={[patrol[0][0], 0, patrol[0][1]]} scale={0.001}>
      <group ref={legL} position={[-0.12, 0.46, 0]}>
        <mesh position={[0, -0.21, 0]} castShadow>
          <capsuleGeometry args={[0.085, 0.28, 4, 8]} />
          {limbs.pants}
        </mesh>
      </group>
      <group ref={legR} position={[0.12, 0.46, 0]}>
        <mesh position={[0, -0.21, 0]} castShadow>
          <capsuleGeometry args={[0.085, 0.28, 4, 8]} />
          {limbs.pants}
        </mesh>
      </group>

      <mesh position={[0, 0.76, 0]} castShadow>
        <capsuleGeometry args={[0.22, 0.26, 6, 12]} />
        {limbs.shirt}
      </mesh>
      <group ref={armL} position={[-0.27, 0.92, 0]}>
        <mesh position={[0, -0.2, 0]} castShadow>
          <capsuleGeometry args={[0.065, 0.26, 4, 8]} />
          {limbs.shirt}
        </mesh>
      </group>
      <group ref={armR} position={[0.27, 0.92, 0]}>
        <mesh position={[0, -0.2, 0]} castShadow>
          <capsuleGeometry args={[0.065, 0.26, 4, 8]} />
          {limbs.shirt}
        </mesh>
      </group>

      <group position={[0, 1.33, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.32, 18, 18]} />
          <meshStandardMaterial color={look.skin} roughness={0.75} />
        </mesh>
        <mesh position={[0, 0.07, -0.05]} scale={[1.07, 0.98, 1.05]} castShadow>
          <sphereGeometry args={[0.32, 18, 18, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
          {limbs.hair}
        </mesh>
        {look.style === "long" && (
          <mesh position={[0, -0.26, -0.13]} scale={[1.02, 1.4, 0.62]} castShadow>
            <sphereGeometry args={[0.3, 16, 16]} />
            {limbs.hair}
          </mesh>
        )}
        {look.style === "bun" && (
          <mesh position={[0, 0.34, -0.14]} castShadow>
            <sphereGeometry args={[0.13, 14, 14]} />
            {limbs.hair}
          </mesh>
        )}
        {look.style === "cap" && (
          <>
            <mesh position={[0, 0.14, -0.03]} scale={[1.1, 0.72, 1.1]} castShadow>
              <sphereGeometry args={[0.32, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
              <meshStandardMaterial color={look.shirt} roughness={0.8} />
            </mesh>
            <mesh position={[0, 0.15, 0.32]} rotation={[0.12, 0, 0]} castShadow>
              <boxGeometry args={[0.36, 0.035, 0.24]} />
              <meshStandardMaterial color={look.shirt} roughness={0.8} />
            </mesh>
          </>
        )}
        <mesh position={[-0.11, 0, 0.3]}>
          <sphereGeometry args={[0.026, 10, 10]} />
          <meshStandardMaterial color="#1c1412" roughness={0.4} />
        </mesh>
        <mesh position={[0.11, 0, 0.3]}>
          <sphereGeometry args={[0.026, 10, 10]} />
          <meshStandardMaterial color="#1c1412" roughness={0.4} />
        </mesh>
        {look.glasses && (
          <>
            <mesh position={[-0.11, 0, 0.31]}>
              <torusGeometry args={[0.065, 0.011, 8, 18]} />
              <meshStandardMaterial color="#1a1a1e" roughness={0.4} />
            </mesh>
            <mesh position={[0.11, 0, 0.31]}>
              <torusGeometry args={[0.065, 0.011, 8, 18]} />
              <meshStandardMaterial color="#1a1a1e" roughness={0.4} />
            </mesh>
          </>
        )}
      </group>

      <NameTag text={look.role} y={1.95} size={0.72} />
    </group>
  );
}

// 지금 있는 층의 팀원들. 층이 바뀌면 새 팀원으로 교체됩니다
export default function Teammates({ floorIndex, reduced }: { floorIndex: number; reduced: boolean }) {
  return (
    <group position={[0, floorBaseY(floorIndex), 0]}>
      {TEAMS[floorIndex].map((look, index) => (
        <Teammate key={`${look.role}-${index}`} look={look} index={index} reduced={reduced} />
      ))}
    </group>
  );
}
