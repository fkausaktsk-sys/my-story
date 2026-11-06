"use client";

import type { FloorSceneProps } from "@/components/building/floors/BasementFloor";
import { Chair, Desk, Monitor } from "@/components/building/furniture";
import Hotspot from "@/components/building/Hotspot";
import { Block, useCanvasTexture } from "@/components/building/parts";

const DRAWER_COLORS = [
  ["#2f6fde", "#6f9fee", "#b9d0f7"],
  ["#1fa37a", "#68c6a8", "#b7e5d5"],
  ["#e5a33d", "#efc47f", "#f7e2bf"],
  ["#d9586a", "#e897a2", "#f4cdd2"],
];

// 인터뷰 내용을 붙여 정리한 벽
function InterviewWall() {
  const texture = useCanvasTexture(640, 400, (ctx) => {
    ctx.fillStyle = "#f8f8f4";
    ctx.fillRect(0, 0, 640, 400);
    ctx.fillStyle = "#3e4a50";
    ctx.font = "700 26px Pretendard, sans-serif";
    ["누가 쓰나요", "어디서 막히나요", "무엇을 해야 하나요"].forEach((title, column) => {
      ctx.fillStyle = "#3e4a50";
      ctx.fillText(title, 18 + column * 212, 42);
      const colors = ["#ffe680", "#ffc9b8", "#bfe9cf", "#c6dbff"];
      for (let row = 0; row < 3; row += 1) {
        ctx.fillStyle = colors[(column + row) % colors.length];
        ctx.fillRect(18 + column * 212, 62 + row * 108, 186, 94);
        ctx.fillStyle = "rgba(50, 50, 50, 0.45)";
        ctx.fillRect(32 + column * 212, 84 + row * 108, 130, 8);
        ctx.fillRect(32 + column * 212, 106 + row * 108, 92, 8);
      }
    });
  });
  return (
    <group position={[-2.95, 2.3, -3.06]}>
      <Block size={[2.3, 1.48, 0.05]} position={[0, 0, 0]} color="#ffffff" />
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[2.2, 1.38]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  );
}

// 컴포넌트를 정리한 화면. 특정 프로그램의 화면이 아니라 직접 그렸습니다
function ComponentScreen() {
  const texture = useCanvasTexture(640, 400, (ctx) => {
    ctx.fillStyle = "#f1f2f5";
    ctx.fillRect(0, 0, 640, 400);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 130, 400);
    ctx.fillStyle = "#c3c7cf";
    for (let i = 0; i < 8; i += 1) ctx.fillRect(16, 26 + i * 40, 92 - (i % 3) * 16, 12);
    ["#2f6fde", "#1fa37a", "#e5a33d"].forEach((color, i) => {
      ctx.fillStyle = color;
      ctx.fillRect(170, 40 + i * 74, 170, 54);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(210, 62 + i * 74, 90, 10);
    });
    ctx.strokeStyle = "#8a5ae0";
    ctx.setLineDash([10, 6]);
    ctx.lineWidth = 3;
    ctx.strokeRect(156, 26, 198, 238);
    ctx.setLineDash([]);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(390, 40, 214, 300);
    ctx.fillStyle = "#2f6fde";
    ctx.fillRect(390, 40, 214, 96);
    ctx.fillStyle = "#d4d7dd";
    [160, 196, 232].forEach((y) => ctx.fillRect(408, y, 176, 18));
    ctx.fillStyle = "#2f6fde";
    ctx.fillRect(408, 278, 176, 42);
  });
  return (
    <mesh position={[0, 0.1, 0.051]}>
      <planeGeometry args={[1.24, 0.78]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

// 매일 쓰는 학습 화면을 띄운 태블릿
function LearningTablet() {
  const texture = useCanvasTexture(300, 400, (ctx) => {
    ctx.fillStyle = "#fbfcff";
    ctx.fillRect(0, 0, 300, 400);
    ctx.fillStyle = "#3f9fb5";
    ctx.fillRect(0, 0, 300, 72);
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 28px Pretendard, sans-serif";
    ctx.fillText("오늘의 학습", 22, 46);
    ["#ffd98a", "#b8e6c9", "#c6dbff"].forEach((color, i) => {
      ctx.fillStyle = color;
      ctx.fillRect(22, 96 + i * 92, 256, 76);
    });
  });
  return (
    <group position={[0.65, 1.2, -1.75]} rotation={[-0.75, -0.25, 0]}>
      <Block size={[0.62, 0.82, 0.04]} position={[0, 0, 0]} color="#30333c" />
      <mesh position={[0, 0, 0.023]}>
        <planeGeometry args={[0.56, 0.76]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  );
}

// 색과 부품이 칸마다 정리된 서랍장
function DrawerCabinet() {
  return (
    <group position={[-4.4, 0, 0.95]}>
      <Block size={[0.72, 2, 2.1]} position={[0, 1, 0]} color="#f2f3f0" />
      {DRAWER_COLORS.flatMap((row, rowIndex) =>
        row.map((color, column) => (
          <group key={color} position={[0.37, 1.72 - rowIndex * 0.47, -0.66 + column * 0.66]}>
            <Block size={[0.04, 0.4, 0.58]} position={[0, 0, 0]} color={color} />
            <Block size={[0.05, 0.05, 0.18]} position={[0.03, 0, 0]} color="#ffffff" />
          </group>
        )),
      )}
    </group>
  );
}

export default function SystemFloor({ interactive, seen, activeStoryId, onSelectStory }: FloorSceneProps) {
  const shared = { enabled: interactive, onSelect: onSelectStory };
  const state = (id: string) => ({ id, seen: seen.has(id), active: activeStoryId === id });

  return (
    <group>
      {/* 층 중 가장 밝고 정돈된 사무실 */}
      <pointLight position={[-0.8, 3.1, 0]} color="#fff6e6" intensity={20} distance={13} decay={1.5} />
      <Block size={[4.4, 0.03, 3.4]} position={[-0.6, 0.015, -0.6]} color="#b9c9c4" />
      <Desk top="#efece4" leg="#c9c5ba" />
      <Chair color="#6f8f88" />

      <Monitor x={-0.75}>
        <ComponentScreen />
      </Monitor>
      <Block size={[1.05, 0.05, 0.36]} position={[-0.75, 1.09, -1.4]} color="#e8e8ea" />

      {/* 화분 */}
      <group position={[1.9, 0, -2.6]}>
        <Block size={[0.42, 0.46, 0.42]} position={[0, 0.23, 0]} color="#d5c6ae" />
        <mesh position={[0, 0.86, 0]} castShadow>
          <sphereGeometry args={[0.42, 14, 14]} />
          <meshStandardMaterial color="#5d9a72" roughness={0.9} />
        </mesh>
      </group>

      <Hotspot {...state("interview")} {...shared} label={[-2.95, 3.3, -2.85]}>
        <InterviewWall />
      </Hotspot>

      <Hotspot {...state("tablet")} {...shared} label={[0.65, 2, -1.75]}>
        <LearningTablet />
      </Hotspot>

      <Hotspot {...state("drawer")} {...shared} label={[-4.3, 2.45, 0.95]}>
        <DrawerCabinet />
      </Hotspot>
    </group>
  );
}
