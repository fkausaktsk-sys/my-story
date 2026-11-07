"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Poster, ToolIcon } from "@/components/building/decor";
import { Chair, Desk, Monitor } from "@/components/building/furniture";
import { Block, useCanvasTexture } from "@/components/building/parts";

// 5F · 다음: 아직 다 지어지지 않은 층. 문틈과 창 너머로 다음 세상이 비칩니다.
// 일화가 없는 엔딩 층이라 층 장면 공통 값은 받지 않습니다

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// 살짝 열린 문. 문틈으로 따뜻한 빛이 새어 나옵니다
function GlowDoor() {
  const leaf = useRef<THREE.Group>(null);
  const reduced = useMemo(() => prefersReducedMotion(), []);
  useFrame(({ clock }) => {
    if (leaf.current && !reduced) leaf.current.rotation.y = -0.55 - Math.sin(clock.elapsedTime * 0.6) * 0.08;
  });
  return (
    <group position={[-1.2, 0, -4.25]}>
      {/* 문 너머의 빛 */}
      <mesh position={[0, 1.3, -0.02]}>
        <planeGeometry args={[1.3, 2.6]} />
        <meshBasicMaterial color="#fff2c9" toneMapped={false} />
      </mesh>
      <pointLight position={[0, 1.4, 0.6]} color="#ffd98a" intensity={30} distance={10} decay={1.6} />
      {/* 문틀 */}
      <Block size={[0.12, 2.8, 0.18]} position={[-0.71, 1.4, 0]} color="#d9d2c2" />
      <Block size={[0.12, 2.8, 0.18]} position={[0.71, 1.4, 0]} color="#d9d2c2" />
      <Block size={[1.54, 0.12, 0.18]} position={[0, 2.8, 0]} color="#d9d2c2" />
      {/* 경첩을 축으로 열린 문짝 */}
      <group ref={leaf} position={[-0.65, 0, 0.05]} rotation={[0, -0.55, 0]}>
        <Block size={[1.3, 2.6, 0.07]} position={[0.65, 1.3, 0]} color="#3d4a74" />
        <Block size={[0.06, 0.06, 0.12]} position={[1.15, 1.25, 0.06]} color="#ffc56e" />
      </group>
    </group>
  );
}

// 아직 그려지는 중인 다음 층의 청사진
function Blueprint() {
  const group = useRef<THREE.Group>(null);
  const reduced = useMemo(() => prefersReducedMotion(), []);
  const edges = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(2.6, 1.5, 1.8)), []);
  const innerEdges = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(1.1, 0.7, 0.8)), []);
  useFrame(({ clock }) => {
    if (!group.current || reduced) return;
    group.current.rotation.y = clock.elapsedTime * 0.25;
    group.current.position.y = 2.5 + Math.sin(clock.elapsedTime * 0.8) * 0.06;
  });
  return (
    <group ref={group} position={[3.2, 2.5, -2.6]} scale={0.6}>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color="#7fb2ff" toneMapped={false} />
      </lineSegments>
      <lineSegments geometry={innerEdges} position={[-0.5, -0.4, 0.2]}>
        <lineBasicMaterial color="#ffc56e" toneMapped={false} />
      </lineSegments>
      <mesh position={[0, -0.75, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.6, 1.8]} />
        <meshBasicMaterial color="#7fb2ff" transparent opacity={0.12} toneMapped={false} side={2} />
      </mesh>
    </group>
  );
}

// 다음 층 공사 안내 표지
function NextSign() {
  const texture = useCanvasTexture(640, 400, (ctx) => {
    ctx.fillStyle = "#f2c230";
    ctx.fillRect(0, 0, 640, 400);
    // 공사 줄무늬
    for (let i = -2; i < 12; i += 1) {
      ctx.fillStyle = "#1d1d22";
      ctx.beginPath();
      ctx.moveTo(i * 60, 0);
      ctx.lineTo(i * 60 + 30, 0);
      ctx.lineTo(i * 60 + 70, 44);
      ctx.lineTo(i * 60 + 40, 44);
      ctx.fill();
    }
    ctx.fillStyle = "#1d1d22";
    ctx.font = "800 40px Pretendard, sans-serif";
    ctx.fillText("NEXT FLOOR", 40, 112);
    ctx.font = "800 64px Pretendard, sans-serif";
    ctx.fillText("다음 층 공사 예정", 40, 200);
    ctx.font = "600 36px Pretendard, sans-serif";
    ctx.fillText("함께 지을 회사를 찾습니다", 40, 268);
    ctx.font = "500 26px Pretendard, sans-serif";
    ctx.fillText("설계 · 디자인 · 구현 모두 가능", 40, 330);
  });
  return (
    <group position={[-6.35, 2.15, 0.6]} rotation={[0, Math.PI / 2, 0]}>
      <Block size={[2.5, 1.6, 0.07]} position={[0, 0, 0]} color="#1d1d22" />
      <mesh position={[0, 0, 0.045]}>
        <planeGeometry args={[2.4, 1.5]} />
        <meshStandardMaterial map={texture} emissiveMap={texture} emissive="#ffffff" emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}

// 창 너머의 밤 도시
function SkyWindow({ x }: { x: number }) {
  const texture = useCanvasTexture(400, 260, (ctx) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 260);
    gradient.addColorStop(0, "#1b2a5c");
    gradient.addColorStop(1, "#5a4f9a");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 400, 260);
    ctx.fillStyle = "#ffffff";
    for (let i = 0; i < 40; i += 1) {
      ctx.globalAlpha = 0.4 + ((i * 37) % 60) / 100;
      ctx.fillRect((i * 97) % 400, (i * 53) % 150, 2, 2);
    }
    ctx.globalAlpha = 1;
    // 멀리 보이는 건물들과 불 켜진 창
    for (let i = 0; i < 9; i += 1) {
      const w = 34 + ((i * 13) % 20);
      const h = 50 + ((i * 41) % 90);
      const bx = i * 46;
      ctx.fillStyle = "#121733";
      ctx.fillRect(bx, 260 - h, w, h);
      ctx.fillStyle = "#ffd98a";
      for (let j = 0; j < 4; j += 1) ctx.fillRect(bx + 8 + (j % 2) * 14, 260 - h + 14 + Math.floor(j / 2) * 22, 6, 8);
    }
  });
  return (
    <group position={[x, 2.4, -4.29]}>
      <Block size={[1.9, 1.3, 0.1]} position={[0, 0, 0]} color="#2c2a2e" />
      <mesh position={[0, 0, 0.06]}>
        <planeGeometry args={[1.76, 1.16]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  );
}

// 새 책상의 빈 화면: 다음 화면을 기다립니다
function BlankScreen() {
  const texture = useCanvasTexture(640, 400, (ctx) => {
    ctx.fillStyle = "#f7f7f4";
    ctx.fillRect(0, 0, 640, 400);
    ctx.strokeStyle = "#c9ccd6";
    ctx.setLineDash([12, 8]);
    ctx.lineWidth = 3;
    ctx.strokeRect(40, 40, 560, 320);
    ctx.setLineDash([]);
    ctx.fillStyle = "#2f3550";
    ctx.font = "700 40px Pretendard, sans-serif";
    ctx.fillText("다음 화면을 함께 그려요", 92, 196);
    ctx.fillStyle = "#3b5bfd";
    ctx.fillRect(92, 222, 4, 44);
  });
  return (
    <mesh position={[0, 0.1, 0.051]}>
      <planeGeometry args={[1.24, 0.78]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

// 공사 고깔
function Cone({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.3, 0]} castShadow>
        <coneGeometry args={[0.2, 0.6, 16]} />
        <meshStandardMaterial color="#f07a2c" roughness={0.7} />
      </mesh>
      <Block size={[0.44, 0.04, 0.44]} position={[0, 0.02, 0]} color="#2a2a2e" />
    </group>
  );
}

export default function NextFloor() {
  return (
    <group>
      <pointLight position={[-0.6, 2.9, -0.4]} color="#cfdcff" intensity={22} distance={12} decay={1.6} />
      <Block size={[4.4, 0.03, 3.4]} position={[-0.6, 0.015, -0.6]} color="#2a3352" />

      <SkyWindow x={-4.3} />
      <SkyWindow x={3.7} />
      <GlowDoor />
      <NextSign />

      {/* 도구 변천: 포토샵 → 피그마 → AI → 다음 도구는? */}
      {(["ps", "figma", "spark", "unknown"] as const).map((tool, i) => (
        <ToolIcon key={tool} tool={tool} position={[0.4 + i * 0.55, 2.75, -4.25]} size={0.45} />
      ))}
      <Poster
        position={[1.23, 2.3, -4.28]}
        size={[2.1, 0.26]}
        canvas={[840, 104]}
        frame={null}
        draw={(ctx) => {
          ctx.fillStyle = "#1b2440";
          ctx.fillRect(0, 0, 840, 104);
          ctx.fillStyle = "#c9d3f0";
          ctx.font = "700 44px Pretendard, sans-serif";
          ctx.fillText("2010 → 2018 → 2024 → 다음", 40, 68);
        }}
      />
      <Blueprint />

      {/* 막 들여놓은 새 책상 */}
      <Desk top="#e9e6de" leg="#bdb8aa" />
      <Chair color="#3b5bfd" />
      <Monitor x={-0.6}>
        <BlankScreen />
      </Monitor>

      <Cone position={[2.6, 0, 3.9]} />
      <Cone position={[3.6, 0, 3.8]} />
      {/* 쌓아 둔 자재 */}
      <Block size={[1.4, 0.2, 0.5]} position={[-4.6, 0.1, 2.8]} color="#9a7a4f" />
      <Block size={[1.4, 0.2, 0.5]} position={[-4.5, 0.3, 2.85]} rotation={[0, 0.08, 0]} color="#a98a5c" />
    </group>
  );
}
