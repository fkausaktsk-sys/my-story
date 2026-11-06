"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { Chair, Desk } from "@/components/building/furniture";
import Hotspot from "@/components/building/Hotspot";
import { Block, useCanvasTexture } from "@/components/building/parts";

export type FloorSceneProps = {
  interactive: boolean;
  seen: ReadonlySet<string>;
  activeStoryId: string | null;
  onSelectStory: (id: string) => void;
};

const CODE_LINES = [
  '<table width="980" border="0">',
  "  <tr>",
  '    <td width="200">',
  '      <img src="spacer.gif">',
  "    </td>",
  '    <td colspan="2">',
  "      <!-- 메인 비주얼 -->",
  "    </td>",
  "  </tr>",
  "</table>",
];

// 두꺼운 모니터 화면의 table 코드
function CrtScreen() {
  const texture = useCanvasTexture(512, 400, (ctx) => {
    ctx.fillStyle = "#07170f";
    ctx.fillRect(0, 0, 512, 400);
    ctx.fillStyle = "#74f0a2";
    ctx.font = "26px Consolas, monospace";
    CODE_LINES.forEach((line, i) => ctx.fillText(line, 22, 48 + i * 33));
  });
  return (
    <mesh position={[0, 0.03, 0.481]}>
      <planeGeometry args={[0.8, 0.62]} />
      <meshStandardMaterial map={texture} emissiveMap={texture} emissive="#ffffff" emissiveIntensity={1.1} />
    </mesh>
  );
}

// 천장에 매달려 살짝 흔들리는 전구
function SwingingBulb() {
  const pivot = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (pivot.current) pivot.current.rotation.z = Math.sin(clock.elapsedTime * 0.9) * 0.05;
  });
  return (
    <group ref={pivot} position={[-0.6, 3.6, -0.7]}>
      <Block size={[0.03, 0.9, 0.03]} position={[0, -0.45, 0]} color="#151515" />
      <mesh position={[0, -0.98, 0]}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshBasicMaterial color="#ffd993" toneMapped={false} />
      </mesh>
      <pointLight position={[0, -1.05, 0]} color="#ffc97e" intensity={38} distance={11} decay={1.7} />
    </group>
  );
}

// 그 시절의 메모가 붙은 판
function NoteBoard() {
  const texture = useCanvasTexture(512, 320, (ctx) => {
    ctx.fillStyle = "#a9835b";
    ctx.fillRect(0, 0, 512, 320);
    const notes = [
      { x: 28, y: 30, c: "#ffe680", t: ["spacer.gif", "1 × 1 px"] },
      { x: 268, y: 40, c: "#ffb3a7", t: ["IE6에서", "다시 확인!"] },
      { x: 92, y: 170, c: "#b6ecc4", t: ["colspan", "다시 세기"] },
      { x: 318, y: 178, c: "#bcd4ff", t: ["이미지", "alt 넣기"] },
    ];
    notes.forEach(({ x, y, c, t }) => {
      ctx.fillStyle = c;
      ctx.fillRect(x, y, 170, 118);
      ctx.fillStyle = "#26211d";
      ctx.font = "700 27px Pretendard, sans-serif";
      t.forEach((line, i) => ctx.fillText(line, x + 16, y + 48 + i * 36));
    });
  });
  return (
    <group position={[-4.85, 2.05, -1.5]} rotation={[0, Math.PI / 2, 0]}>
      <Block size={[2.2, 1.45, 0.08]} position={[0, 0, 0]} color="#6a5038" />
      <mesh position={[0, 0, 0.05]}>
        <planeGeometry args={[2.05, 1.3]} />
        <meshStandardMaterial map={texture} roughness={0.95} />
      </mesh>
    </group>
  );
}

// 지하에서 유일하게 바깥이 보이는 높은 창
function HighWindow() {
  return (
    <group position={[-3, 3.05, -3.09]}>
      <Block size={[1.7, 0.8, 0.1]} position={[0, 0, 0]} color="#27262c" />
      <Block
        size={[1.5, 0.62, 0.05]}
        position={[0, 0, 0.05]}
        color="#223058"
        emissive="#5470c2"
        emissiveIntensity={0.7}
      />
      <Block size={[0.05, 0.62, 0.08]} position={[-0.38, 0, 0.09]} color="#17161a" />
      <Block size={[0.05, 0.62, 0.08]} position={[0.38, 0, 0.09]} color="#17161a" />
    </group>
  );
}

export default function BasementFloor({ interactive, seen, activeStoryId, onSelectStory }: FloorSceneProps) {
  const shared = { enabled: interactive, onSelect: onSelectStory };
  const state = (id: string) => ({ id, seen: seen.has(id), active: activeStoryId === id });

  return (
    <group>
      <HighWindow />
      <SwingingBulb />

      {/* 벽을 따라 지나가는 배관 */}
      <mesh position={[0, 3.25, -2.95]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.07, 0.07, 9.8, 10]} />
        <meshStandardMaterial color="#6e6660" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[-4.75, 3.05, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 6.2, 10]} />
        <meshStandardMaterial color="#7a5a46" metalness={0.4} roughness={0.55} />
      </mesh>

      {/* 바닥 깔개 */}
      <Block size={[4.4, 0.03, 3.4]} position={[-0.6, 0.015, -0.6]} color="#5b3f36" />

      <Desk />
      <Chair />

      {/* 두꺼운 모니터 */}
      <Hotspot {...state("monitor")} {...shared} label={[-0.6, 2.75, -1.9]}>
        <group position={[-0.6, 1.72, -2.05]}>
          <Block size={[1.12, 0.92, 0.92]} position={[0, 0, 0]} color="#cfc6b2" />
          <Block size={[0.5, 0.1, 0.5]} position={[0, -0.51, 0]} color="#bdb39f" />
          <CrtScreen />
        </group>
      </Hotspot>

      {/* 키보드, 마우스, 머그컵, 본체 */}
      <Block size={[1.05, 0.05, 0.36]} position={[-0.6, 1.09, -1.4]} color="#d4cdbc" />
      <Block size={[0.14, 0.05, 0.22]} position={[0.08, 1.09, -1.4]} color="#d4cdbc" />
      <mesh position={[0.45, 1.17, -1.55]} castShadow>
        <cylinderGeometry args={[0.1, 0.09, 0.2, 14]} />
        <meshStandardMaterial color="#e8e0d0" roughness={0.5} />
      </mesh>
      <Block size={[0.55, 1, 1.15]} position={[-1.85, 1.56, -2]} color="#c8bfab" />
      <Block size={[0.32, 0.05, 0.02]} position={[-1.85, 1.86, -1.415]} color="#2a2a2a" />

      {/* 메모판 */}
      <Hotspot {...state("notes")} {...shared} label={[-4.5, 3.15, -1.5]}>
        <NoteBoard />
      </Hotspot>

      {/* 왼쪽 벽 책장 */}
      <Hotspot {...state("books")} {...shared} label={[-3.9, 2.95, 1]}>
        <group position={[-4.3, 0, 1]}>
          <Block size={[0.8, 0.1, 2.3]} position={[0, 0.5, 0]} color="#6c4f36" />
          <Block size={[0.8, 0.1, 2.3]} position={[0, 1.25, 0]} color="#6c4f36" />
          <Block size={[0.8, 0.1, 2.3]} position={[0, 2, 0]} color="#6c4f36" />
          <Block size={[0.7, 2.1, 0.08]} position={[0, 1.05, -1.12]} color="#5a4230" />
          <Block size={[0.7, 2.1, 0.08]} position={[0, 1.05, 1.12]} color="#5a4230" />
          {["#b84a39", "#3f6fa8", "#d9a441", "#4f8a63", "#7b5aa6", "#c8c1af"].map((color, i) => (
            <Block key={color} size={[0.5, 0.55, 0.22]} position={[0.02, 0.83, -0.85 + i * 0.3]} color={color} />
          ))}
          {["#3f6fa8", "#b84a39", "#c8c1af", "#4f8a63"].map((color, i) => (
            <Block key={color} size={[0.5, 0.5, 0.26]} position={[0.02, 1.55, -0.3 + i * 0.32]} color={color} />
          ))}
        </group>
      </Hotspot>

      {/* 구석 상자 */}
      <Block size={[1.1, 0.8, 0.9]} position={[-3.6, 0.4, -2.4]} color="#8d7048" />
      <Block size={[0.8, 0.55, 0.7]} position={[-3.7, 1.07, -2.45]} rotation={[0, 0.25, 0]} color="#a0845a" />
    </group>
  );
}
