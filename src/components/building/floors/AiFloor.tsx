"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import ver1 from "@/assets/ver-1.jpg";
import ver2 from "@/assets/ver-2.jpg";
import ver3 from "@/assets/ver-3.jpg";
import ver4 from "@/assets/ver-4.jpg";
import ver5 from "@/assets/ver-5.jpg";
import type { FloorSceneProps } from "@/components/building/floors/BasementFloor";
import { Chair, Desk, Monitor } from "@/components/building/furniture";
import Hotspot from "@/components/building/Hotspot";
import { Block, useCanvasTexture, useImageTexture } from "@/components/building/parts";

const FLIP_SECONDS = 2.6;

// 메인 시안이 다섯 번 바뀌는 벽
function VersionWall() {
  const textures = [
    useImageTexture(ver1.src),
    useImageTexture(ver2.src),
    useImageTexture(ver3.src),
    useImageTexture(ver4.src),
    useImageTexture(ver5.src),
  ];
  const [index, setIndex] = useState(0);
  const shown = useRef(0);

  useFrame(({ clock }) => {
    const next = Math.floor(clock.elapsedTime / FLIP_SECONDS) % textures.length;
    if (next !== shown.current) {
      shown.current = next;
      setIndex(next);
    }
  });

  const texture = textures[index];

  return (
    <group position={[-2.95, 2.3, -3.06]}>
      <Block size={[2.34, 1.5, 0.06]} position={[0, 0, 0]} color="#10131e" />
      {texture && (
        <mesh position={[0, 0.03, 0.035]}>
          <planeGeometry args={[2.22, 1.32]} />
          <meshBasicMaterial key={index} map={texture} toneMapped={false} />
        </mesh>
      )}
      {/* 지금 몇 번째 시안인지 보여 주는 눈금 */}
      {textures.map((_, i) => (
        <Block
          key={i}
          size={[0.3, 0.04, 0.02]}
          position={[-0.76 + i * 0.38, -0.69, 0.04]}
          color={i === index ? "#ffc56e" : "#4a5068"}
          emissive={i === index ? "#ffc56e" : undefined}
          emissiveIntensity={i === index ? 0.8 : 0}
        />
      ))}
    </group>
  );
}

// 회의실 벽의 동작하는 화면
function PrototypeScreen() {
  const texture = useCanvasTexture(640, 380, (ctx) => {
    ctx.fillStyle = "#f6f7fa";
    ctx.fillRect(0, 0, 640, 380);
    ctx.fillStyle = "#2a2d38";
    ctx.fillRect(0, 0, 640, 34);
    ["#e5484d", "#e2b34f", "#1fa37a"].forEach((color, i) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(20 + i * 22, 17, 7, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.fillStyle = "#3b5bfd";
    ctx.fillRect(28, 62, 170, 240);
    ctx.fillStyle = "#d9dde6";
    ctx.fillRect(226, 70, 240, 22);
    ctx.fillRect(226, 110, 190, 18);
    ctx.fillStyle = "#e5484d";
    ctx.fillRect(226, 158, 200, 56);
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 26px Pretendard, sans-serif";
    ctx.fillText("학습자료", 276, 196);
    ctx.fillStyle = "#ffe680";
    ctx.fillRect(362, 236, 256, 110);
    ctx.fillStyle = "#26211d";
    ctx.font = "600 23px Pretendard, sans-serif";
    ctx.fillText("이 버튼이 더 눈에", 378, 280);
    ctx.fillText("띄면 좋겠어요", 378, 316);
  });
  return (
    <group position={[-4.85, 2.25, -1.25]} rotation={[0, Math.PI / 2, 0]}>
      <Block size={[2.2, 1.34, 0.07]} position={[0, 0, 0]} color="#11141f" />
      <mesh position={[0, 0, 0.045]}>
        <planeGeometry args={[2.08, 1.22]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  );
}

// AI로 만든 이미지 후보들. 여러 장 중에서 고르는 장면입니다
function AiGallery() {
  const texture = useCanvasTexture(420, 420, (ctx) => {
    ctx.fillStyle = "#171b2b";
    ctx.fillRect(0, 0, 420, 420);
    const tiles = [
      ["#7a5cff", "#ff8fb1"],
      ["#2ec4a6", "#3b5bfd"],
      ["#ffc56e", "#ff6b6b"],
      ["#5cc8ff", "#b48bff"],
    ];
    tiles.forEach(([from, to], i) => {
      const x = 16 + (i % 2) * 200;
      const y = 16 + Math.floor(i / 2) * 200;
      const gradient = ctx.createLinearGradient(x, y, x + 188, y + 188);
      gradient.addColorStop(0, from);
      gradient.addColorStop(1, to);
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, 188, 188);
      ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
      ctx.beginPath();
      ctx.arc(x + 70 + i * 16, y + 86, 34, 0, Math.PI * 2);
      ctx.fill();
    });
    // 고른 한 장을 표시합니다
    ctx.strokeStyle = "#ffc56e";
    ctx.lineWidth = 8;
    ctx.strokeRect(216, 216, 188, 188);
  });
  return (
    <group position={[0.75, 2.35, -3.07]}>
      <Block size={[1.32, 1.32, 0.06]} position={[0, 0, 0]} color="#10131e" />
      <mesh position={[0, 0, 0.035]}>
        <planeGeometry args={[1.24, 1.24]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  );
}

// 퇴근 전에 일을 맡겨 둔 터미널
function TerminalScreen() {
  const texture = useCanvasTexture(640, 400, (ctx) => {
    ctx.fillStyle = "#0f1420";
    ctx.fillRect(0, 0, 640, 400);
    ctx.font = "23px Consolas, monospace";
    [
      ["#9aa7bd", "> 퇴근 프롬프트"],
      ["#f1f1ee", "  전체 페이지를 점검하고"],
      ["#f1f1ee", "  고칠 내용을 정리해 줘"],
      ["#74f0a2", "  작업 중..."],
      ["#74f0a2", "  12 / 55 확인"],
      ["#9aa7bd", ""],
      ["#ffc56e", "  내일 아침에 확인할게요"],
    ].forEach(([color, line], i) => {
      ctx.fillStyle = color;
      ctx.fillText(line, 26, 54 + i * 44);
    });
  });
  return (
    <mesh position={[0, 0.1, 0.051]}>
      <planeGeometry args={[1.24, 0.78]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

export default function AiFloor({ interactive, seen, activeStoryId, onSelectStory }: FloorSceneProps) {
  const shared = { enabled: interactive, onSelect: onSelectStory };
  const state = (id: string) => ({ id, seen: seen.has(id), active: activeStoryId === id });

  return (
    <group>
      <pointLight position={[-1, 2.9, -0.4]} color="#cfdcff" intensity={34} distance={12} decay={1.6} />
      <Block size={[4.4, 0.03, 3.4]} position={[-0.6, 0.015, -0.6]} color="#26324f" />
      <Desk top="#3a3f52" leg="#2a2e3d" />
      <Chair color="#1e2230" />

      <Hotspot {...state("overnight")} {...shared} label={[-0.6, 2.85, -2.1]}>
        <Monitor x={-0.6}>
          <TerminalScreen />
        </Monitor>
      </Hotspot>
      <Block size={[1.05, 0.05, 0.36]} position={[-0.6, 1.09, -1.4]} color="#2a2e3b" />
      {/* 아침을 기다리는 커피 한 잔 */}
      <mesh position={[0.5, 1.17, -1.5]} castShadow>
        <cylinderGeometry args={[0.09, 0.075, 0.2, 14]} />
        <meshStandardMaterial color="#e8e0d0" roughness={0.5} />
      </mesh>

      <Hotspot {...state("versions")} {...shared} label={[-2.95, 3.3, -2.85]}>
        <VersionWall />
      </Hotspot>

      <Hotspot {...state("prototype")} {...shared} label={[-4.45, 3.2, -1.25]}>
        <PrototypeScreen />
      </Hotspot>

      <Hotspot {...state("ai-image")} {...shared} label={[0.75, 3.3, -2.85]}>
        <AiGallery />
      </Hotspot>

      {/* 회의용 의자 */}
      {[-0.1, 1.5].map((z) => (
        <group key={z} position={[-4.2, 0, z]}>
          <Block size={[0.6, 0.08, 0.6]} position={[0, 0.5, 0]} color="#3b4560" />
          <Block size={[0.1, 0.46, 0.1]} position={[0, 0.23, 0]} color="#1e2230" />
        </group>
      ))}
    </group>
  );
}
