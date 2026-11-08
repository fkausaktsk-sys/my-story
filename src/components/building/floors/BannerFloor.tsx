"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Can, ColorChips, ParcelBox, Poster, SmartPhone, Sticky, ToolIcon } from "@/components/building/decor";
import type { FloorSceneProps } from "@/components/building/floors/types";
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
const BELT = { x: -5.75, start: 2.7, end: -2.5, count: 6, speed: 0.75 };

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
    <group position={[0.9, 2.3, -4.26]}>
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

// 배너 규격표. 같은 배너를 크기별로 몇 벌씩 만들었습니다
function BannerSizeGuide() {
  return (
    <Poster
      position={[-6.36, 2.78, 0.1]}
      rotation={[0, Math.PI / 2, 0]}
      size={[1.9, 0.78]}
      canvas={[760, 312]}
      frame="#d9dee0"
      draw={(ctx) => {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 760, 312);
        ctx.fillStyle = "#1d2a33";
        ctx.font = "800 34px Pretendard, sans-serif";
        ctx.fillText("배너 규격표", 24, 48);
        const rows: [string, string, number][] = [
          ["메인 배너", "980 × 400", 300],
          ["띠 배너", "980 × 80", 300],
          ["기획전 썸네일", "300 × 300", 120],
          ["모바일 배너", "640 × 300", 220],
        ];
        rows.forEach(([name, px, w], i) => {
          const y = 92 + i * 54;
          ctx.fillStyle = ["#e5484d", "#3d7bf0", "#f2c230", "#2fb38a"][i];
          ctx.fillRect(24, y - 30, w, 38);
          ctx.fillStyle = "#1d2a33";
          ctx.font = "700 26px Pretendard, sans-serif";
          ctx.fillText(name, 360, y - 4);
          ctx.font = "600 26px Consolas, monospace";
          ctx.fillText(px, 560, y - 4);
        });
      }}
    />
  );
}

// 이번 달 기획전 일정을 적은 화이트보드
function PromoBoard() {
  return (
    <Poster
      position={[-5.35, 2.3, -4.27]}
      size={[1.5, 1.1]}
      canvas={[600, 440]}
      frame="#9aa3ab"
      draw={(ctx) => {
        ctx.fillStyle = "#f7f9fa";
        ctx.fillRect(0, 0, 600, 440);
        ctx.fillStyle = "#1f4f9c";
        ctx.font = "800 40px Pretendard, sans-serif";
        ctx.fillText("이번 달 기획전", 24, 56);
        ctx.font = "600 30px Pretendard, sans-serif";
        [
          ["월", "시즌오프 메인 교체", true],
          ["화", "패션팀 기획전 3건", true],
          ["수", "띠배너 12종", false],
          ["목", "뉴스레터 발송", false],
          ["금", "주말 특가 오픈!", false],
        ].forEach(([day, task, done], i) => {
          const y = 116 + i * 62;
          ctx.fillStyle = "#e5484d";
          ctx.fillText(String(day), 28, y);
          ctx.fillStyle = "#26303a";
          ctx.fillText(String(task), 86, y);
          ctx.strokeStyle = "#26303a";
          ctx.lineWidth = 3;
          ctx.strokeRect(520, y - 28, 34, 34);
          if (done) {
            ctx.strokeStyle = "#2fb38a";
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.moveTo(526, y - 12);
            ctx.lineTo(536, y);
            ctx.lineTo(552, y - 26);
            ctx.stroke();
          }
        });
      }}
    />
  );
}

export default function BannerFloor({ interactive, seen, activeStoryId, hintId, onSelectStory }: FloorSceneProps) {
  const shared = { enabled: interactive, onSelect: onSelectStory };
  const state = (id: string) => ({ id, seen: seen.has(id), active: activeStoryId === id, hinted: hintId === id });

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

      {/* 그 시절 도구들: 포토샵, 일러스트, 드림위버 */}
      <ToolIcon tool="ps" position={[2.3, 2.5, -4.23]} size={0.6} />
      <ToolIcon tool="ai" position={[3.0, 2.5, -4.23]} size={0.6} />
      <ToolIcon tool="dw" position={[3.7, 2.5, -4.23]} size={0.6} />
      <BannerSizeGuide />
      <PromoBoard />

      {/* 스마트폰, 야근의 에너지 음료, 컬러칩, 모니터에 붙인 메모 */}
      <SmartPhone position={[-2.05, 1.06, -1.45]} rotation={[0, 0.3, 0]} />
      <Can position={[1.0, 1.06, -2.25]} />
      <Can position={[1.18, 1.06, -2.08]} color="#2f6fde" />
      <ColorChips position={[-1.95, 1.06, -2.3]} rotation={[0, 0.5, 0]} />
      <Sticky position={[0.709, 1.52, -1.965]} rotation={[0, -0.12, 0.08]} lines={["IE8", "확인"]} />
      <Sticky position={[-1.888, 2.27, -1.965]} rotation={[0, 0.12, -0.1]} color="#b6ecc4" lines={["크롬", "OK"]} />

      {/* 쌓여 있는 택배 상자 */}
      <ParcelBox position={[3.0, 0, -3.65]} />
      <ParcelBox position={[3.05, 0.5, -3.6]} size={[0.55, 0.4, 0.45]} rotation={[0, 0.2, 0]} />
      <ParcelBox position={[2.2, 0, -3.8]} size={[0.6, 0.35, 0.5]} rotation={[0, -0.3, 0]} />

      {/* 벽에 붙은 지난 배너들 */}
      {[
        [-3.75, 2.75],
        [-2.95, 2.75],
        [-2.15, 2.75],
        [-3.75, 2.2],
        [-2.95, 2.2],
        [-2.15, 2.2],
      ].map(([x, y], i) => (
        <PinnedBanner key={`${x}-${y}`} index={i} position={[x, y, -4.29]} />
      ))}

      <Hotspot {...state("belt")} {...shared} label={[-5.75, 2.3, 0.1]}>
        <BannerBelt />
      </Hotspot>

      <Hotspot {...state("div")} {...shared} label={[0.9, 3.35, -4.05]}>
        <BrokenTable />
      </Hotspot>
    </group>
  );
}
