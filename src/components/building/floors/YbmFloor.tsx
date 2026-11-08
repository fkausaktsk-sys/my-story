"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import ver1 from "@/assets/ver-1.jpg";
import ver2 from "@/assets/ver-2.jpg";
import ver3 from "@/assets/ver-3.jpg";
import ver4 from "@/assets/ver-4.jpg";
import ver5 from "@/assets/ver-5.jpg";
import { EarbudCase, Laptop, Plant, Poster, SketchBook, Sticky, ToolIcon } from "@/components/building/decor";
import type { FloorSceneProps } from "@/components/building/floors/types";
import { Chair, Desk, Monitor } from "@/components/building/furniture";
import Hotspot from "@/components/building/Hotspot";
import { Block, useCanvasTexture, useImageTexture } from "@/components/building/parts";

// 4F · 2018~: 와이비엠넷. YBM Books 리뉴얼이 중심이고, 그 전 8년의 프로젝트를 한쪽 벽에 모았습니다

const FLIP_SECONDS = 2.6;

const DRAWER_COLORS = [
  ["#2f6fde", "#6f9fee", "#b9d0f7"],
  ["#1fa37a", "#68c6a8", "#b7e5d5"],
  ["#e5a33d", "#efc47f", "#f7e2bf"],
  ["#d9586a", "#e897a2", "#f4cdd2"],
];


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
    <group position={[-2.95, 2.3, -4.26]}>
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
    <group position={[-6.35, 2.25, -1.25]} rotation={[0, Math.PI / 2, 0]}>
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
    <group position={[0.75, 2.35, -4.27]}>
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
    <group position={[3.1, 2.35, -4.26]}>
      <Block size={[2.3, 1.48, 0.05]} position={[0, 0, 0]} color="#ffffff" />
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[2.2, 1.38]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
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
    <group position={[3.75, 1.72, -3.95]} rotation={[-0.35, -0.2, 0]} scale={0.8}>
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
    <group position={[3.1, 0, -4.03]} rotation={[0, -Math.PI / 2, 0]} scale={0.7}>
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

// Books 리뉴얼의 디자인 토큰을 뽑아 붙인 포스터
function TokenPoster() {
  return (
    <Poster
      position={[-5.3, 2.3, -4.27]}
      size={[1.4, 1.1]}
      canvas={[560, 440]}
      frame="#10131e"
      draw={(ctx) => {
        ctx.fillStyle = "#0f1420";
        ctx.fillRect(0, 0, 560, 440);
        ctx.fillStyle = "#9aa7bd";
        ctx.font = "600 24px Consolas, monospace";
        ctx.fillText("variables.css", 24, 42);
        const tokens: [string, string][] = [
          ["--color-primary", "#3b5bfd"],
          ["--color-accent", "#e5484d"],
          ["--color-text", "#26232b"],
          ["--space-4", "16px"],
          ["--radius-m", "12px"],
        ];
        tokens.forEach(([name, value], i) => {
          const y = 96 + i * 66;
          if (value.startsWith("#")) {
            ctx.fillStyle = value;
            ctx.fillRect(24, y - 30, 40, 40);
          } else {
            ctx.strokeStyle = "#74f0a2";
            ctx.lineWidth = 3;
            ctx.strokeRect(24, y - 30, 40, 40);
          }
          ctx.fillStyle = "#f1f1ee";
          ctx.font = "600 24px Consolas, monospace";
          ctx.fillText(name, 82, y);
          ctx.fillStyle = "#74f0a2";
          ctx.fillText(value, 360, y);
        });
      }}
    />
  );
}

export default function YbmFloor({ interactive, seen, activeStoryId, hintId, onSelectStory }: FloorSceneProps) {
  const shared = { enabled: interactive, onSelect: onSelectStory };
  const state = (id: string) => ({ id, seen: seen.has(id), active: activeStoryId === id, hinted: hintId === id });

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

      <Hotspot {...state("versions")} {...shared} label={[-2.95, 3.3, -4.05]}>
        <VersionWall />
      </Hotspot>

      <Hotspot {...state("prototype")} {...shared} label={[-5.95, 3.2, -1.25]}>
        <PrototypeScreen />
      </Hotspot>

      <Hotspot {...state("ai-image")} {...shared} label={[0.75, 3.3, -4.05]}>
        <AiGallery />
      </Hotspot>

      {/* 지금의 도구들: 포토샵 → 피그마 → 코드 → AI 순서로 왼쪽부터 읽힙니다 */}
      {(["spark", "code", "figma", "ps"] as const).map((tool, i) => (
        <ToolIcon key={tool} tool={tool} position={[-6.33, 2.6, 0.6 + i * 0.85]} rotation={[0, Math.PI / 2, 0]} size={0.6} />
      ))}
      <TokenPoster />
      <Plant position={[-5.6, 0, -3.7]} leaf="#2f7d4f" pot="#e9e6de" size={1.2} />

      {/* 책상: 노트북, 와이어프레임 공책, 무선 이어폰, 모니터의 명도 대비 메모 */}
      <Laptop position={[-2.0, 1.06, -1.85]} rotation={[0, 0.35, 0]} />
      <SketchBook position={[0.95, 1.06, -1.4]} rotation={[0, -0.2, 0]} />
      <EarbudCase position={[0.25, 1.06, -1.3]} />
      <Sticky position={[-0.02, 1.5, -2.04]} rotation={[0, 0, 0.08]} color="#c6dbff" lines={["대비", "4.5:1"]} />

      {/* 8년의 프로젝트: 인터뷰 벽, 학습 태블릿, 디자인 시스템 서랍장 */}
      <Hotspot {...state("projects")} {...shared} label={[3.1, 3.3, -4.05]}>
        <group>
          <InterviewWall />
          <DrawerCabinet />
          <LearningTablet />
        </group>
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
