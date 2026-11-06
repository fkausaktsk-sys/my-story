"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { FloorSceneProps } from "@/components/building/floors/BasementFloor";
import { Chair, Desk, Monitor } from "@/components/building/furniture";
import Hotspot from "@/components/building/Hotspot";
import { Block, useCanvasTexture } from "@/components/building/parts";

const BANNERS = [
  { bg: "#e5484d", fg: "#fff4c2", main: "오늘만 70%", sub: "타임세일" },
  { bg: "#2f6fde", fg: "#ffffff", main: "무료배송", sub: "기획전" },
  { bg: "#ffc83d", fg: "#2a2118", main: "1+1 특가", sub: "오늘 마감" },
  { bg: "#1fa37a", fg: "#ffffff", main: "신상 입고", sub: "주간 베스트" },
];

// 벨트 시작과 끝 위치, 지나가는 배너 수
const BELT = { x: -4.25, start: 2.7, end: -2.5, count: 6, speed: 0.75 };

// 배너 한 장의 그림
function useBannerTexture(index: number) {
  const banner = BANNERS[index % BANNERS.length];
  return useCanvasTexture(420, 280, (ctx) => {
    ctx.fillStyle = banner.bg;
    ctx.fillRect(0, 0, 420, 280);
    ctx.fillStyle = "rgba(255, 255, 255, 0.16)";
    ctx.beginPath();
    ctx.arc(350, 50, 120, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = banner.fg;
    ctx.font = "600 34px Pretendard, sans-serif";
    ctx.fillText(banner.sub, 30, 84);
    ctx.font = "800 68px Pretendard, sans-serif";
    ctx.fillText(banner.main, 28, 180);
    ctx.fillRect(30, 212, 130, 34);
    ctx.fillStyle = banner.bg;
    ctx.font = "700 21px Pretendard, sans-serif";
    ctx.fillText("바로가기", 54, 237);
  });
}

function MovingBanner({ index, register }: { index: number; register: (i: number, g: THREE.Group | null) => void }) {
  const texture = useBannerTexture(index);
  return (
    <group ref={(group) => register(index, group)}>
      <mesh rotation={[0, Math.PI / 2, 0]} position={[0.02, 0, 0]} castShadow>
        <planeGeometry args={[0.8, 0.54]} />
        <meshStandardMaterial map={texture} side={THREE.DoubleSide} roughness={0.7} />
      </mesh>
    </group>
  );
}

// 쉬지 않고 돌아가는 배너 벨트
function BannerBelt() {
  const banners = useRef<(THREE.Group | null)[]>([]);
  const reduced = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );
  const length = BELT.start - BELT.end;
  const register = (index: number, group: THREE.Group | null) => {
    banners.current[index] = group;
  };

  useFrame(({ clock }) => {
    const moved = reduced ? 0 : clock.elapsedTime * BELT.speed;
    banners.current.forEach((group, index) => {
      if (!group) return;
      const progress = (moved + (index * length) / BELT.count) % length;
      // 벨트 양 끝에서는 배너가 일어서고 눕도록 줄입니다
      const edge = Math.min(progress, length - progress);
      const scale = THREE.MathUtils.clamp(edge / 0.35, 0.02, 1);
      group.position.set(BELT.x, 0.98 + (0.3 * scale), BELT.start - progress);
      group.scale.set(1, scale, 1);
    });
  });

  return (
    <group>
      {/* 벨트 몸체 */}
      <Block size={[0.95, 0.12, 5.5]} position={[BELT.x, 0.86, 0.1]} color="#23262c" />
      <Block size={[1.05, 0.18, 5.6]} position={[BELT.x, 0.74, 0.1]} color="#5a6470" />
      {[-2.3, -0.7, 0.9, 2.5].map((z) => (
        <Block key={z} size={[0.8, 0.66, 0.12]} position={[BELT.x, 0.33, z]} color="#3a4049" />
      ))}
      {/* 벨트 양 끝 롤러 */}
      {[-2.65, 2.85].map((z) => (
        <mesh key={z} position={[BELT.x, 0.86, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 1, 14]} />
          <meshStandardMaterial color="#8d97a3" metalness={0.5} roughness={0.4} />
        </mesh>
      ))}
      {Array.from({ length: BELT.count }, (_, index) => (
        <MovingBanner key={index} index={index} register={register} />
      ))}
    </group>
  );
}

// 표 칸에서 상자 하나가 튀어나온 벽 조형물
function BrokenTable() {
  const cells: [number, number][] = [
    [-0.5, 0.38],
    [0, 0.38],
    [0.5, 0.38],
    [-0.5, -0.12],
    [0.5, -0.12],
    [-0.5, -0.62],
    [0, -0.62],
    [0.5, -0.62],
  ];
  return (
    <group position={[0.9, 2.3, -3.06]}>
      <Block size={[1.62, 1.62, 0.05]} position={[0, -0.12, 0]} color="#d9dee0" />
      {cells.map(([x, y]) => (
        <Block key={`${x}-${y}`} size={[0.44, 0.44, 0.06]} position={[x, y, 0.04]} color="#8d9aa3" />
      ))}
      {/* 칸에서 벗어나 앞으로 나온 div */}
      <Block
        size={[0.5, 0.5, 0.32]}
        position={[0.05, -0.08, 0.28]}
        rotation={[0.12, 0.28, -0.1]}
        color="#2ec4a6"
        emissive="#2ec4a6"
        emissiveIntensity={0.18}
      />
    </group>
  );
}

// CSS 코드를 띄운 화면
function CodeScreen() {
  const texture = useCanvasTexture(640, 400, (ctx) => {
    ctx.fillStyle = "#1c2230";
    ctx.fillRect(0, 0, 640, 400);
    ctx.font = "24px Consolas, monospace";
    [
      ["#7fd4ff", ".banner {"],
      ["#e8e8e8", "  float: left;"],
      ["#e8e8e8", "  width: 200px;"],
      ["#e8e8e8", "  margin: 0 10px;"],
      ["#7fd4ff", "}"],
      ["#7fd4ff", ".clear {"],
      ["#ffcf70", "  clear: both;"],
      ["#7fd4ff", "}"],
      ["#8f98a8", "/* IE7 다시 확인 */"],
    ].forEach(([color, line], i) => {
      ctx.fillStyle = color;
      ctx.fillText(line, 28, 46 + i * 39);
    });
  });
  return (
    <mesh position={[0, 0.1, 0.051]}>
      <planeGeometry args={[1.24, 0.78]} />
      <meshStandardMaterial map={texture} emissiveMap={texture} emissive="#ffffff" emissiveIntensity={0.95} />
    </mesh>
  );
}

// 만들던 기획전 페이지 화면
function EventPageScreen() {
  const texture = useCanvasTexture(640, 400, (ctx) => {
    ctx.fillStyle = "#f7f7f5";
    ctx.fillRect(0, 0, 640, 400);
    ctx.fillStyle = "#e5484d";
    ctx.fillRect(0, 0, 640, 120);
    ctx.fillStyle = "#ffffff";
    ctx.font = "800 44px Pretendard, sans-serif";
    ctx.fillText("오늘의 기획전", 30, 78);
    ["#2f6fde", "#ffc83d", "#1fa37a", "#8a5ae0"].forEach((color, i) => {
      ctx.fillStyle = color;
      ctx.fillRect(24 + i * 150, 146, 136, 136);
      ctx.fillStyle = "#c9c9c4";
      ctx.fillRect(24 + i * 150, 296, 136, 14);
      ctx.fillRect(24 + i * 150, 320, 90, 14);
    });
  });
  return (
    <mesh position={[0, 0.1, 0.051]}>
      <planeGeometry args={[1.24, 0.78]} />
      <meshStandardMaterial map={texture} emissiveMap={texture} emissive="#ffffff" emissiveIntensity={0.9} />
    </mesh>
  );
}

// 벽에 빼곡히 붙은 지난 배너들
function PinnedBanner({ index, position }: { index: number; position: [number, number, number] }) {
  const texture = useBannerTexture(index);
  return (
    <mesh position={position} rotation={[0, 0, (index % 2 === 0 ? 1 : -1) * 0.025]}>
      <planeGeometry args={[0.72, 0.48]} />
      <meshStandardMaterial map={texture} roughness={0.8} />
    </mesh>
  );
}

export default function BannerFloor({ interactive, seen, activeStoryId, onSelectStory }: FloorSceneProps) {
  const shared = { enabled: interactive, onSelect: onSelectStory };
  const state = (id: string) => ({ id, seen: seen.has(id), active: activeStoryId === id });

  return (
    <group>
      {/* 사무실의 밝은 형광등 빛. 등 자체는 모니터를 가려서 그리지 않습니다 */}
      <pointLight position={[-0.6, 3.1, -0.4]} color="#eef4ff" intensity={36} distance={12} decay={1.6} />

      <Block size={[4.4, 0.03, 3.4]} position={[-0.6, 0.015, -0.6]} color="#3f5a55" />
      <Desk top="#b9a98f" leg="#7f715c" />
      <Chair color="#2d3a38" />

      {/* 두 모니터: 코드와 기획전 화면을 나란히 */}
      <Monitor x={-1.3} turn={0.12}>
        <CodeScreen />
      </Monitor>
      <Monitor x={0.12} turn={-0.12}>
        <EventPageScreen />
      </Monitor>

      <Block size={[1.05, 0.05, 0.36]} position={[-0.6, 1.09, -1.4]} color="#2c2f36" />
      <Block size={[0.14, 0.05, 0.22]} position={[0.08, 1.09, -1.4]} color="#2c2f36" />
      {/* 쌓여 가는 커피잔 */}
      {[
        [0.55, 1.17, -1.4],
        [0.78, 1.17, -1.55],
        [0.72, 1.17, -1.28],
      ].map(([x, y, z]) => (
        <mesh key={`${x}-${z}`} position={[x, y, z]} castShadow>
          <cylinderGeometry args={[0.09, 0.075, 0.2, 14]} />
          <meshStandardMaterial color="#e8e0d0" roughness={0.5} />
        </mesh>
      ))}

      {/* 벽에 붙은 지난 배너들 */}
      {[
        [-3.75, 2.75],
        [-2.95, 2.75],
        [-2.15, 2.75],
        [-3.75, 2.2],
        [-2.95, 2.2],
        [-2.15, 2.2],
      ].map(([x, y], i) => (
        <PinnedBanner key={`${x}-${y}`} index={i} position={[x, y, -3.09]} />
      ))}

      <Hotspot {...state("belt")} {...shared} label={[-4.25, 2.3, 0.1]}>
        <BannerBelt />
      </Hotspot>

      <Hotspot {...state("div")} {...shared} label={[0.9, 3.35, -2.85]}>
        <BrokenTable />
      </Hotspot>
    </group>
  );
}
