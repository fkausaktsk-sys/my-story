"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { FloorSceneProps } from "@/components/building/floors/BasementFloor";
import { Chair, Desk, Monitor } from "@/components/building/furniture";
import Hotspot from "@/components/building/Hotspot";
import { Block, useCanvasTexture } from "@/components/building/parts";

const WALL = { maxWidth: 2.1, minWidth: 0.72, height: 1.46, cards: 3 };
const CARD_COLORS = ["#c93a4b", "#2a62c4", "#d48a12"];

// 폭이 좁아졌다 넓어지며 카드가 재배치되는 벽. 반응형을 눈으로 보여 줍니다
function ReflowWall() {
  const stage = useRef<THREE.Mesh>(null);
  const header = useRef<THREE.Mesh>(null);
  const cards = useRef<(THREE.Mesh | null)[]>([]);
  const layout = useRef(
    Array.from({ length: WALL.cards }, () => ({ x: 0, y: 0, width: 0.5, height: 0.42 })),
  );
  const reduced = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  useFrame(({ clock }, delta) => {
    const swing = reduced ? 1 : (Math.sin(clock.elapsedTime * 0.55) + 1) / 2;
    const width = WALL.minWidth + (WALL.maxWidth - WALL.minWidth) * swing;
    if (stage.current) stage.current.scale.x = width;
    if (header.current) header.current.scale.x = width - 0.12;

    // 폭에 따라 칸 수가 3열 → 2열 → 1열로 바뀝니다
    const columns = width > 1.55 ? 3 : width > 1.05 ? 2 : 1;
    const gap = 0.08;
    const cardWidth = (width - 0.12 - gap * (columns - 1)) / columns;
    const rows = Math.ceil(WALL.cards / columns);
    const cardHeight = Math.min(0.46, (WALL.height - 0.42 - gap * (rows - 1)) / rows);

    cards.current.forEach((card, index) => {
      if (!card) return;
      const column = index % columns;
      const row = Math.floor(index / columns);
      const targetX = -width / 2 + 0.06 + cardWidth / 2 + column * (cardWidth + gap);
      const targetY = WALL.height / 2 - 0.36 - cardHeight / 2 - row * (cardHeight + gap);
      const state = layout.current[index];
      state.x = THREE.MathUtils.damp(state.x, targetX, 7, delta);
      state.y = THREE.MathUtils.damp(state.y, targetY, 7, delta);
      state.width = THREE.MathUtils.damp(state.width, cardWidth, 7, delta);
      state.height = THREE.MathUtils.damp(state.height, cardHeight, 7, delta);
      card.position.set(state.x, state.y, 0.09);
      card.scale.set(state.width, state.height, 1);
    });
  });

  return (
    <group position={[-2.95, 2.3, -3.06]}>
      <Block size={[WALL.maxWidth + 0.14, WALL.height + 0.14, 0.05]} position={[0, 0, 0]} color="#2c2a33" />
      <mesh ref={stage} position={[0, 0, 0.04]}>
        <boxGeometry args={[1, WALL.height, 0.04]} />
        <meshStandardMaterial color="#f4f1e8" roughness={0.6} />
      </mesh>
      <mesh ref={header} position={[0, WALL.height / 2 - 0.16, 0.07]}>
        <boxGeometry args={[1, 0.18, 0.03]} />
        <meshStandardMaterial color="#54465e" roughness={0.6} />
      </mesh>
      {CARD_COLORS.map((color, index) => (
        <mesh
          key={color}
          ref={(card) => {
            cards.current[index] = card;
          }}
        >
          <boxGeometry args={[1, 1, 0.04]} />
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

// 자정을 가리키는 벽시계
function MidnightClock() {
  const texture = useCanvasTexture(256, 256, (ctx) => {
    ctx.fillStyle = "#f7f4ea";
    ctx.beginPath();
    ctx.arc(128, 128, 124, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#2a2730";
    ctx.font = "700 34px Pretendard, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("12", 128, 52);
    ctx.fillText("6", 128, 232);
    ctx.fillText("3", 222, 140);
    ctx.fillText("9", 34, 140);
    ctx.fillRect(122, 62, 12, 70);
    ctx.fillRect(124, 42 + 20, 8, 70);
    ctx.fillStyle = "#e5484d";
    ctx.beginPath();
    ctx.arc(128, 128, 9, 0, Math.PI * 2);
    ctx.fill();
  });
  return (
    <group position={[-4.87, 2.55, 0.85]} rotation={[0, Math.PI / 2, 0]}>
      <mesh position={[0, 0, -0.02]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.46, 0.46, 0.07, 32]} />
        <meshStandardMaterial color="#2c2a33" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <circleGeometry args={[0.42, 32]} />
        <meshStandardMaterial map={texture} roughness={0.8} />
      </mesh>
    </group>
  );
}

// 공공 캠페인 게시판. 기관명은 넣지 않습니다
function CampaignBoard() {
  const texture = useCanvasTexture(520, 340, (ctx) => {
    ctx.fillStyle = "#39363f";
    ctx.fillRect(0, 0, 520, 340);
    const items = [
      { x: 24, y: 24, c: "#ffe680", t: ["공공 캠페인", "오픈 D-DAY"] },
      { x: 270, y: 24, c: "#b6ecc4", t: ["00:00", "페이지 공개"] },
      { x: 24, y: 180, c: "#bcd4ff", t: ["카드뉴스", "배너 최종"] },
      { x: 270, y: 180, c: "#ffb3a7", t: ["오류 없는지", "다시 확인"] },
    ];
    items.forEach(({ x, y, c, t }) => {
      ctx.fillStyle = c;
      ctx.fillRect(x, y, 226, 136);
      ctx.fillStyle = "#26211d";
      ctx.font = "700 32px Pretendard, sans-serif";
      t.forEach((line, i) => ctx.fillText(line, x + 18, y + 58 + i * 44));
    });
  });
  return (
    <group position={[-4.85, 2.2, -1.2]} rotation={[0, Math.PI / 2, 0]}>
      <Block size={[2, 1.34, 0.07]} position={[0, 0, 0]} color="#25232b" />
      <mesh position={[0, 0, 0.045]}>
        <planeGeometry args={[1.88, 1.22]} />
        <meshStandardMaterial map={texture} roughness={0.9} />
      </mesh>
    </group>
  );
}

// 혼자 맡은 캠페인 페이지 화면
function CampaignScreen() {
  const texture = useCanvasTexture(640, 400, (ctx) => {
    ctx.fillStyle = "#3a5fa0";
    ctx.fillRect(0, 0, 640, 400);
    ctx.fillStyle = "#ffffff";
    ctx.font = "800 54px Pretendard, sans-serif";
    ctx.fillText("함께 만드는 캠페인", 42, 130);
    ctx.font = "500 28px Pretendard, sans-serif";
    ctx.fillText("참여 신청은 오늘 자정부터", 44, 182);
    ctx.fillStyle = "#ffcf70";
    ctx.fillRect(44, 226, 200, 60);
    ctx.fillStyle = "#26211d";
    ctx.font = "700 28px Pretendard, sans-serif";
    ctx.fillText("참여하기", 88, 266);
  });
  return (
    <mesh position={[0, 0.1, 0.051]}>
      <planeGeometry args={[1.24, 0.78]} />
      <meshStandardMaterial map={texture} emissiveMap={texture} emissive="#ffffff" emissiveIntensity={0.9} />
    </mesh>
  );
}

export default function ResponsiveFloor({ interactive, seen, activeStoryId, onSelectStory }: FloorSceneProps) {
  const shared = { enabled: interactive, onSelect: onSelectStory };
  const state = (id: string) => ({ id, seen: seen.has(id), active: activeStoryId === id });

  return (
    <group>
      {/* 혼자 늦게까지 남은 사무실의 책상 조명 */}
      <pointLight position={[-0.6, 2.7, -0.8]} color="#ffdcb3" intensity={18} distance={11} decay={1.7} />
      <Block size={[4.4, 0.03, 3.4]} position={[-0.6, 0.015, -0.6]} color="#4c3f55" />
      <Desk top="#6f6170" leg="#4b4250" />
      <Chair color="#33303c" />

      <Monitor x={-0.6}>
        <CampaignScreen />
      </Monitor>

      {/* 확인용 태블릿과 휴대폰 */}
      <Block size={[0.5, 0.68, 0.04]} position={[0.55, 1.4, -2.15]} rotation={[-0.2, -0.2, 0]} color="#1f2026" />
      <Block size={[0.24, 0.46, 0.04]} position={[1, 1.29, -2.05]} rotation={[-0.2, -0.3, 0]} color="#1f2026" />
      <Block size={[1.05, 0.05, 0.36]} position={[-0.6, 1.09, -1.4]} color="#d6d3da" />

      <Hotspot {...state("reflow")} {...shared} label={[-2.95, 3.3, -2.85]}>
        <ReflowWall />
      </Hotspot>

      <Hotspot {...state("midnight")} {...shared} label={[-4.45, 3.15, -1.2]}>
        <group>
          <CampaignBoard />
          <MidnightClock />
        </group>
      </Hotspot>
    </group>
  );
}
