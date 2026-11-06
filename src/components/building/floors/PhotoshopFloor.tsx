"use client";

import type { FloorSceneProps } from "@/components/building/floors/BasementFloor";
import { Chair, Desk } from "@/components/building/furniture";
import Hotspot from "@/components/building/Hotspot";
import { Block, useCanvasTexture } from "@/components/building/parts";

// 특정 프로그램의 화면이 아니라, 그 시절 이미지 편집기의 분위기만 직접 그렸습니다
function EditorScreen() {
  const texture = useCanvasTexture(800, 500, (ctx) => {
    ctx.fillStyle = "#3a3a3d";
    ctx.fillRect(0, 0, 800, 500);
    // 도구 막대
    ctx.fillStyle = "#2b2b2e";
    ctx.fillRect(0, 0, 54, 500);
    ctx.fillStyle = "#77777d";
    for (let i = 0; i < 11; i += 1) ctx.fillRect(14, 16 + i * 42, 26, 26);
    ctx.fillStyle = "#ffc56e";
    ctx.fillRect(14, 142, 26, 26);

    // 작업 화면의 투명 격자
    for (let y = 0; y < 22; y += 1) {
      for (let x = 0; x < 26; x += 1) {
        ctx.fillStyle = (x + y) % 2 === 0 ? "#f0f0f0" : "#cfcfcf";
        ctx.fillRect(70 + x * 20, 30 + y * 20, 20, 20);
      }
    }

    // 누끼를 따는 중인 운동화 모양
    const shape = () => {
      ctx.beginPath();
      ctx.moveTo(150, 330);
      ctx.bezierCurveTo(150, 260, 190, 180, 240, 170);
      ctx.bezierCurveTo(275, 215, 330, 240, 400, 262);
      ctx.bezierCurveTo(470, 280, 520, 300, 525, 345);
      ctx.lineTo(525, 372);
      ctx.lineTo(150, 372);
      ctx.closePath();
    };
    shape();
    ctx.fillStyle = "#c9513c";
    ctx.fill();
    ctx.fillStyle = "#f4f1e8";
    ctx.fillRect(150, 348, 375, 24);

    // 펜툴 점선과 고정점
    shape();
    ctx.setLineDash([9, 7]);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#111111";
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#1a4fd6";
    ctx.lineWidth = 2;
    [
      [150, 330],
      [240, 170],
      [400, 262],
      [525, 345],
      [525, 372],
      [150, 372],
    ].forEach(([x, y]) => {
      ctx.fillRect(x - 6, y - 6, 12, 12);
      ctx.strokeRect(x - 6, y - 6, 12, 12);
    });

    // 레이어 목록
    ctx.fillStyle = "#2b2b2e";
    ctx.fillRect(600, 0, 200, 500);
    ctx.font = "600 17px Pretendard, sans-serif";
    ["레이어 1 복사본 3", "누끼_02", "누끼_01", "그림자", "배경"].forEach((name, i) => {
      ctx.fillStyle = i === 1 ? "#4a6fb0" : "#38383c";
      ctx.fillRect(610, 16 + i * 46, 180, 40);
      ctx.fillStyle = "#eeeeee";
      ctx.fillText(name, 622, 42 + i * 46);
    });
    ctx.fillStyle = "#b9b9c0";
    ctx.font = "15px Pretendard, sans-serif";
    ctx.fillText("시안_최종_진짜최종.psd", 612, 476);
  });

  return (
    <mesh position={[0, 0.12, 0.061]}>
      <planeGeometry args={[1.74, 1.08]} />
      <meshStandardMaterial map={texture} emissiveMap={texture} emissive="#ffffff" emissiveIntensity={0.95} />
    </mesh>
  );
}

// 칸칸이 잘린 시안 출력물
function SliceSheet() {
  const texture = useCanvasTexture(420, 540, (ctx) => {
    ctx.fillStyle = "#fbfaf5";
    ctx.fillRect(0, 0, 420, 540);
    ctx.fillStyle = "#c9513c";
    ctx.fillRect(30, 30, 360, 60);
    ctx.fillStyle = "#3f6fa8";
    ctx.fillRect(30, 104, 360, 170);
    ctx.fillStyle = "#d9a441";
    ctx.fillRect(30, 288, 170, 210);
    ctx.fillStyle = "#4f8a63";
    ctx.fillRect(214, 288, 176, 210);
    // 슬라이스 선
    ctx.strokeStyle = "#ff3b7f";
    ctx.lineWidth = 3;
    ctx.setLineDash([12, 7]);
    [97, 281].forEach((y) => {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(420, y);
      ctx.stroke();
    });
    ctx.beginPath();
    ctx.moveTo(207, 281);
    ctx.lineTo(207, 540);
    ctx.stroke();
  });
  return (
    <group position={[-4.85, 2, -1.45]} rotation={[0, Math.PI / 2, 0]}>
      <Block size={[1.45, 1.85, 0.06]} position={[0, 0, 0]} color="#ece7d8" />
      <mesh position={[0, 0, 0.04]}>
        <planeGeometry args={[1.32, 1.7]} />
        <meshStandardMaterial map={texture} roughness={0.95} />
      </mesh>
    </group>
  );
}

export default function PhotoshopFloor({ interactive, seen, activeStoryId, onSelectStory }: FloorSceneProps) {
  const shared = { enabled: interactive, onSelect: onSelectStory };
  const state = (id: string) => ({ id, seen: seen.has(id), active: activeStoryId === id });

  return (
    <group>
      {/* 스탠드 조명 */}
      <pointLight position={[-0.6, 2.7, -1]} color="#dfe6ff" intensity={30} distance={11} decay={1.7} />
      <Block size={[0.05, 1.3, 0.05]} position={[-2.25, 1.7, -2.3]} color="#272a33" />
      <Block size={[0.7, 0.1, 0.34]} position={[-1.95, 2.35, -2.3]} rotation={[0, 0, 0.2]} color="#272a33" />

      <Block size={[4.4, 0.03, 3.4]} position={[-0.6, 0.015, -0.6]} color="#39465f" />
      <Desk top="#c7c2b4" leg="#8a8678" />
      <Chair color="#3a3e4a" />

      {/* 얇아진 평면 모니터와 편집 화면 */}
      <Hotspot {...state("cutout")} {...shared} label={[-0.6, 3.05, -2.1]}>
        <group position={[-0.6, 1.98, -2.15]}>
          <Block size={[1.95, 1.34, 0.1]} position={[0, 0.12, 0]} color="#1c1d21" />
          <Block size={[0.14, 0.5, 0.14]} position={[0, -0.72, -0.05]} color="#2c2d32" />
          <Block size={[0.7, 0.05, 0.5]} position={[0, -0.9, 0]} color="#2c2d32" />
          <EditorScreen />
        </group>
      </Hotspot>

      {/* 태블릿 펜과 키보드 */}
      <Block size={[1.05, 0.05, 0.36]} position={[-1.2, 1.09, -1.4]} color="#e6e6e8" />
      <Block size={[0.72, 0.04, 0.46]} position={[0.2, 1.08, -1.42]} color="#2a2a30" />
      <Block size={[0.03, 0.03, 0.42]} position={[0.2, 1.13, -1.42]} rotation={[0, 0.6, 0]} color="#d9d9de" />

      {/* 슬라이스 출력물 */}
      <Hotspot {...state("slice")} {...shared} label={[-4.5, 3.2, -1.45]}>
        <SliceSheet />
      </Hotspot>

      {/* '최종' 폴더가 쌓인 선반 */}
      <Hotspot {...state("psd")} {...shared} label={[-3.9, 2.6, 1]}>
        <group position={[-4.3, 0, 1]}>
          <Block size={[0.8, 1.45, 1.6]} position={[0, 0.72, 0]} color="#7f8798" />
          {["#ffd36b", "#ffc24a", "#ffdf8f", "#f5b13a"].map((color, i) => (
            <Block
              key={color}
              size={[0.62, 0.11, 1.25]}
              position={[0.03, 1.51 + i * 0.13, 0.02 * i]}
              rotation={[0, i * 0.05, 0]}
              color={color}
            />
          ))}
        </group>
      </Hotspot>
    </group>
  );
}
