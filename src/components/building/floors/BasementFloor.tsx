"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import photoshopIcon from "@/assets/photoshop-icon.png";
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

// 벽에 걸린 포토샵 아이콘. 그림의 정면을 앞면으로 쓰는 두꺼운 입체 블록입니다
function IconFrame() {
  const [icon, setIcon] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    let loaded: THREE.Texture | null = null;
    let cancelled = false;
    new THREE.TextureLoader().load(photoshopIcon.src, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 4;
      loaded = texture;
      if (cancelled) texture.dispose();
      else setIcon(texture);
    });
    return () => {
      cancelled = true;
      loaded?.dispose();
    };
  }, []);

  return (
    <mesh position={[0.95, 2.25, -2.995]} castShadow receiveShadow>
      <boxGeometry args={[0.91, 0.9, 0.21]} />
      {/* 면 순서: 오른쪽, 왼쪽, 위, 아래, 앞, 뒤 */}
      <meshStandardMaterial attach="material-0" color="#003a78" roughness={0.45} />
      <meshStandardMaterial attach="material-1" color="#003a78" roughness={0.45} />
      <meshStandardMaterial attach="material-2" color="#41d9fb" roughness={0.45} />
      <meshStandardMaterial attach="material-3" color="#002a58" roughness={0.45} />
      {icon ? (
        <meshStandardMaterial key="face" attach="material-4" map={icon} roughness={0.4} />
      ) : (
        <meshStandardMaterial key="blank" attach="material-4" color="#0a55ad" roughness={0.4} />
      )}
      <meshStandardMaterial attach="material-5" color="#002a58" roughness={0.45} />
    </mesh>
  );
}

// 첫 회사에서 만들던 행사들의 포스터
function EventPoster({ z, color, title }: { z: number; color: string; title: string }) {
  const texture = useCanvasTexture(240, 340, (ctx) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 240, 340);
    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
    ctx.beginPath();
    ctx.arc(190, 70, 90, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "800 44px Pretendard, sans-serif";
    ctx.fillText(title, 20, 210);
    ctx.font = "500 22px Pretendard, sans-serif";
    ctx.fillText("2010", 22, 250);
    ctx.fillRect(22, 280, 110, 8);
  });
  return (
    <mesh position={[-4.87, 2.72, z]} rotation={[0, Math.PI / 2, 0]}>
      <planeGeometry args={[0.56, 0.8]} />
      <meshStandardMaterial map={texture} roughness={0.85} />
    </mesh>
  );
}

function EventPosters() {
  return (
    <group>
      <EventPoster z={0.35} color="#2f6c8f" title="포럼" />
      <EventPoster z={1.05} color="#a8503f" title="총회" />
      <EventPoster z={1.75} color="#4b6f4a" title="국제회의" />
    </group>
  );
}

// 플래시 타임라인 화면. 특정 프로그램이 아니라 그 시절 분위기를 그렸습니다
function FlashScreen() {
  const texture = useCanvasTexture(420, 320, (ctx) => {
    ctx.fillStyle = "#2b2c31";
    ctx.fillRect(0, 0, 420, 320);
    ctx.fillStyle = "#f4f1e8";
    ctx.fillRect(50, 20, 320, 150);
    ctx.fillStyle = "#e5484d";
    ctx.beginPath();
    ctx.arc(210, 95, 42, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#3a3b42";
    ctx.fillRect(0, 186, 420, 134);
    for (let row = 0; row < 3; row += 1) {
      for (let cell = 0; cell < 34; cell += 1) {
        ctx.fillStyle = cell % 5 === 0 ? "#585a63" : "#4a4b53";
        ctx.fillRect(12 + cell * 12, 200 + row * 38, 11, 30);
      }
      ctx.fillStyle = "#ffcf70";
      ctx.fillRect(12 + (row + 1) * 60, 200 + row * 38, 11, 30);
    }
    ctx.fillStyle = "#e5484d";
    ctx.fillRect(190, 190, 3, 130);
  });
  return (
    <mesh position={[0, 0.02, 0.356]}>
      <planeGeometry args={[0.72, 0.55]} />
      <meshStandardMaterial map={texture} emissiveMap={texture} emissive="#ffffff" emissiveIntensity={0.9} />
    </mesh>
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
      <IconFrame />
      <SwingingBulb />

      {/* 벽을 따라 지나가는 배관 */}
      <mesh position={[0, 3.25, -2.95]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.07, 0.07, 9.8, 10]} />
        <meshStandardMaterial color="#6e6660" metalness={0.5} roughness={0.5} />
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
      <NoteBoard />

      {/* 행사 포스터 */}
      <Hotspot {...state("posters")} {...shared} label={[-4.45, 3.4, 1.05]}>
        <EventPosters />
      </Hotspot>

      {/* 왼쪽 벽 책장 */}
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

      {/* 구석 상자 */}
      <Block size={[1.1, 0.8, 0.9]} position={[-3.6, 0.4, -2.4]} color="#8d7048" />

      {/* 플래시 작업대: 상자 위 작은 모니터 */}
      <Hotspot {...state("flash")} {...shared} label={[-3.6, 2.1, -2.4]}>
        <group position={[-3.6, 1.16, -2.4]}>
          <Block size={[0.9, 0.72, 0.7]} position={[0, 0, 0]} color="#cfc6b2" />
          <FlashScreen />
        </group>
      </Hotspot>
    </group>
  );
}
