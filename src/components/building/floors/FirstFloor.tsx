"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { CdStack, FlipPhone, Poster, Speaker, Sticky, ToolIcon } from "@/components/building/decor";
import type { FloorSceneProps } from "@/components/building/floors/types";
import { Chair, Desk } from "@/components/building/furniture";
import Hotspot from "@/components/building/Hotspot";
import { Block, useCanvasTexture } from "@/components/building/parts";

// 1F · 2010~2013: table 코딩과 포토샵으로 화면을 손으로 짓던 첫 사무실

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

// 옆 책상 모니터의 table 코드
function CrtCodeScreen() {
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

// 샛별의 모니터: 펜툴로 누끼를 따고 있는 화면.
// 특정 프로그램의 화면이 아니라, 그 시절 이미지 편집기의 분위기만 직접 그렸습니다
function CutoutScreen() {
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
    <mesh position={[0, 0.03, 0.481]}>
      <planeGeometry args={[0.92, 0.575]} />
      <meshStandardMaterial map={texture} emissiveMap={texture} emissive="#ffffff" emissiveIntensity={0.95} />
    </mesh>
  );
}

// 두꺼운 CRT 모니터 상자. 화면은 children으로 넘깁니다
function Crt({ position, children }: { position: [number, number, number]; children: React.ReactNode }) {
  return (
    <group position={position}>
      <Block size={[1.12, 0.92, 0.92]} position={[0, 0, 0]} color="#cfc6b2" />
      <Block size={[0.5, 0.1, 0.5]} position={[0, -0.51, 0]} color="#bdb39f" />
      {children}
    </group>
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
      <pointLight position={[0, -1.05, 0]} color="#ffc97e" intensity={38} distance={12} decay={1.7} />
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
    <group position={[-5, 1.95, -4.26]}>
      <Block size={[2.2, 1.45, 0.08]} position={[0, 0, 0]} color="#6a5038" />
      <mesh position={[0, 0, 0.05]}>
        <planeGeometry args={[2.05, 1.3]} />
        <meshStandardMaterial map={texture} roughness={0.95} />
      </mesh>
    </group>
  );
}

// 행사마다 만들던 사이트의 포스터
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
    <mesh position={[-6.37, 2.72, z]} rotation={[0, Math.PI / 2, 0]}>
      <planeGeometry args={[0.56, 0.8]} />
      <meshStandardMaterial map={texture} roughness={0.85} />
    </mesh>
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
    <group position={[-6.35, 2, -2.3]} rotation={[0, Math.PI / 2, 0]}>
      <Block size={[1.45, 1.85, 0.06]} position={[0, 0, 0]} color="#ece7d8" />
      <mesh position={[0, 0, 0.04]}>
        <planeGeometry args={[1.32, 1.7]} />
        <meshStandardMaterial map={texture} roughness={0.95} />
      </mesh>
    </group>
  );
}

// 벽에 건 설명회 현수막
function PrintBanner() {
  const texture = useCanvasTexture(760, 150, (ctx) => {
    ctx.fillStyle = "#1f5fa8";
    ctx.fillRect(0, 0, 760, 150);
    ctx.fillStyle = "#ffffff";
    ctx.font = "800 64px Pretendard, sans-serif";
    ctx.fillText("설명회 · 세미나 · 박람회", 38, 98);
  });
  return (
    <mesh position={[-2.4, 2.95, -4.28]}>
      <planeGeometry args={[2.5, 0.5]} />
      <meshStandardMaterial map={texture} roughness={0.85} />
    </mesh>
  );
}

// 세워 둔 X배너
function XBanner() {
  const texture = useCanvasTexture(220, 560, (ctx) => {
    ctx.fillStyle = "#fbf6ea";
    ctx.fillRect(0, 0, 220, 560);
    ctx.fillStyle = "#e0663f";
    ctx.fillRect(0, 0, 220, 170);
    ctx.fillStyle = "#ffffff";
    ctx.font = "800 42px Pretendard, sans-serif";
    ctx.fillText("X배너", 28, 104);
    ctx.fillStyle = "#3a3f4b";
    [230, 280, 330, 380].forEach((y, i) => ctx.fillRect(28, y, 164 - i * 22, 16));
  });
  return (
    <group position={[-3.3, 0, -3.7]}>
      <mesh position={[0, 1.08, 0]} castShadow>
        <planeGeometry args={[0.72, 1.84]} />
        <meshStandardMaterial map={texture} side={2} roughness={0.8} />
      </mesh>
      <Block size={[0.05, 2.02, 0.05]} position={[0.38, 1.01, -0.05]} color="#50545e" />
      <Block size={[0.05, 2.02, 0.05]} position={[-0.38, 1.01, -0.05]} color="#50545e" />
      <Block size={[0.9, 0.04, 0.28]} position={[0, 0.03, -0.05]} color="#50545e" />
    </group>
  );
}

// 지상층 창문: 바깥 밤하늘이 보입니다
function Window() {
  return (
    <group position={[3.75, 2.55, -4.29]}>
      <Block size={[2.1, 1.3, 0.1]} position={[0, 0, 0]} color="#2c2a2e" />
      <Block size={[1.9, 1.1, 0.05]} position={[0, 0, 0.05]} color="#223058" emissive="#5470c2" emissiveIntensity={0.7} />
      <Block size={[0.05, 1.1, 0.08]} position={[0, 0, 0.09]} color="#17161a" />
      <Block size={[1.9, 0.05, 0.08]} position={[0, 0, 0.09]} color="#17161a" />
    </group>
  );
}

// 웹 안전 색상 216색표. 모니터마다 색이 달라 이 색만 골라 쓰던 시절입니다
function WebSafeChart() {
  return (
    <Poster
      position={[-6.36, 2.15, -0.8]}
      rotation={[0, Math.PI / 2, 0]}
      size={[0.95, 1.2]}
      canvas={[380, 480]}
      frame="#f4f1e8"
      draw={(ctx) => {
        ctx.fillStyle = "#f4f1e8";
        ctx.fillRect(0, 0, 380, 480);
        ctx.fillStyle = "#26211d";
        ctx.font = "800 30px Pretendard, sans-serif";
        ctx.fillText("Web Safe 216", 20, 42);
        const steps = ["00", "33", "66", "99", "CC", "FF"];
        let i = 0;
        for (const r of steps) {
          for (const g of steps) {
            for (const b of steps) {
              const x = 20 + (i % 12) * 28.3;
              const y = 62 + Math.floor(i / 12) * 22;
              ctx.fillStyle = `#${r}${g}${b}`;
              ctx.fillRect(x, y, 26, 20);
              i += 1;
            }
          }
        }
      }}
    />
  );
}

// "1024×768에 최적화" 안내문
function OptimizedSign() {
  return (
    <Poster
      position={[-6.36, 2.85, 3.2]}
      rotation={[0, Math.PI / 2, 0]}
      size={[1.5, 0.42]}
      canvas={[600, 168]}
      frame="#c8c1af"
      draw={(ctx) => {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 600, 168);
        ctx.fillStyle = "#1b3f8f";
        ctx.font = "700 34px Gulim, Dotum, sans-serif";
        ctx.fillText("이 사이트는 1024×768 해상도와", 22, 68);
        ctx.fillText("IE6에 최적화되어 있습니다", 22, 120);
      }}
    />
  );
}

// 2010년 벽걸이 달력
function Calendar2010() {
  return (
    <Poster
      position={[-2.2, 1.95, -4.28]}
      size={[0.62, 0.8]}
      canvas={[248, 320]}
      frame={null}
      draw={(ctx) => {
        ctx.fillStyle = "#fbfaf5";
        ctx.fillRect(0, 0, 248, 320);
        ctx.fillStyle = "#c9513c";
        ctx.fillRect(0, 0, 248, 70);
        ctx.fillStyle = "#ffffff";
        ctx.font = "800 40px Pretendard, sans-serif";
        ctx.fillText("2010.08", 22, 50);
        ctx.fillStyle = "#3a3f4b";
        ctx.font = "500 20px Pretendard, sans-serif";
        for (let d = 0; d < 31; d += 1) {
          const x = 14 + (d % 7) * 33;
          const y = 104 + Math.floor(d / 7) * 40;
          ctx.fillText(String(d + 1), x, y);
        }
        // 첫 출근 날
        ctx.strokeStyle = "#e5484d";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(14 + 1 * 33 + 6, 104 - 6, 16, 0, Math.PI * 2);
        ctx.stroke();
      }}
    />
  );
}

// 옆 책상: table 코드를 띄운 두 번째 모니터
function SideDesk() {
  return (
    <group position={[3.1, 0, -3.7]}>
      <Block size={[1.8, 0.1, 1]} position={[0, 1, 0]} color="#8b6a48" />
      <Block size={[0.1, 1, 0.9]} position={[-0.8, 0.5, 0]} color="#6e5238" />
      <Block size={[0.1, 1, 0.9]} position={[0.8, 0.5, 0]} color="#6e5238" />
    </group>
  );
}

export default function FirstFloor({ interactive, seen, activeStoryId, onSelectStory }: FloorSceneProps) {
  const shared = { enabled: interactive, onSelect: onSelectStory };
  const state = (id: string) => ({ id, seen: seen.has(id), active: activeStoryId === id });

  return (
    <group>
      <Window />
      {/* 그 시절 도구들: 포토샵, 드림위버, 일러스트, 플래시 */}
      <ToolIcon tool="ps" position={[0.95, 2.25, -4.195]} size={0.91} />
      <ToolIcon tool="dw" position={[1.95, 2.6, -4.23]} size={0.6} />
      <ToolIcon tool="ai" position={[1.95, 1.9, -4.23]} size={0.6} />
      <ToolIcon tool="fl" position={[-5.1, 3.2, -4.24]} size={0.5} />
      <WebSafeChart />
      <OptimizedSign />
      <Calendar2010 />
      <SwingingBulb />
      <NoteBoard />
      <PrintBanner />
      <XBanner />

      {/* 바닥 깔개 */}
      <Block size={[4.4, 0.03, 3.4]} position={[-0.6, 0.015, -0.6]} color="#5b3f36" />

      <Desk />
      <Chair />

      {/* 샛별의 모니터: 펜툴 누끼 화면 */}
      <Hotspot {...state("cutout")} {...shared} label={[-0.6, 2.75, -1.9]}>
        <Crt position={[-0.6, 1.72, -2.05]}>
          <CutoutScreen />
        </Crt>
      </Hotspot>

      {/* 키보드, 마우스, 펜 태블릿, 본체, 홍보용 부채 */}
      <Block size={[1.05, 0.05, 0.36]} position={[-0.6, 1.09, -1.4]} color="#d4cdbc" />
      <Block size={[0.14, 0.05, 0.22]} position={[0.08, 1.09, -1.4]} color="#d4cdbc" />
      <Block size={[0.6, 0.04, 0.42]} position={[0.6, 1.08, -1.45]} color="#2a2a30" />
      <Block size={[0.03, 0.03, 0.38]} position={[0.6, 1.13, -1.45]} rotation={[0, 0.6, 0]} color="#d9d9de" />
      <Block size={[0.55, 1, 1.15]} position={[-1.85, 1.56, -2]} color="#c8bfab" />
      <Block size={[0.32, 0.05, 0.02]} position={[-1.85, 1.86, -1.415]} color="#2a2a2a" />
      {/* 폴더폰, 작업본을 구운 CD-R, 스피커, 모니터에 붙인 메모 */}
      <FlipPhone position={[-1.55, 1.06, -1.35]} rotation={[0, 0.4, 0]} />
      <CdStack position={[-2.2, 1.06, -1.5]} />
      <Speaker position={[-1.35, 1.06, -2.3]} />
      <Speaker position={[0.2, 1.06, -2.3]} />
      <Sticky position={[-0.13, 2.08, -1.565]} rotation={[0, 0, -0.12]} lines={["굴림", "12px"]} />
      <Sticky position={[-1.07, 1.37, -1.565]} rotation={[0, 0, 0.1]} color="#ffb3a7" lines={["IE6", "확인!"]} />
      <group position={[1.0, 1.075, -1.9]} rotation={[-Math.PI / 2, 0, 0.5]}>
        <mesh position={[0, 0.2, 0]} castShadow>
          <circleGeometry args={[0.26, 24]} />
          <meshStandardMaterial color="#f2a65a" side={2} roughness={0.8} />
        </mesh>
        <Block size={[0.04, 0.34, 0.02]} position={[0, -0.2, 0]} color="#e8e0d0" />
      </group>

      {/* 옆 책상의 table 코드 모니터 */}
      <SideDesk />
      <Hotspot {...state("monitor")} {...shared} label={[3.1, 2.65, -3.7]}>
        <Crt position={[3.1, 1.6, -3.75]}>
          <CrtCodeScreen />
        </Crt>
      </Hotspot>

      {/* 행사 포스터 */}
      <Hotspot {...state("posters")} {...shared} label={[-5.95, 3.4, 1.05]}>
        <group>
          <EventPoster z={0.35} color="#2f6c8f" title="포럼" />
          <EventPoster z={1.05} color="#a8503f" title="총회" />
          <EventPoster z={1.75} color="#4b6f4a" title="국제회의" />
        </group>
      </Hotspot>

      {/* 왼쪽 벽 책장 */}
      <group position={[-5.8, 0, 1]}>
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

      {/* 슬라이스 출력물 */}
      <Hotspot {...state("slice")} {...shared} label={[-6, 3.2, -2.3]}>
        <SliceSheet />
      </Hotspot>

      {/* '최종' 폴더가 쌓인 선반 */}
      <Hotspot {...state("psd")} {...shared} label={[-5.4, 2.6, 3.2]}>
        <group position={[-5.8, 0, 3.2]}>
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

      {/* 플래시 작업대: 상자 위 작은 모니터 */}
      <Block size={[1.1, 0.8, 0.9]} position={[-5.1, 0.4, -3.6]} color="#8d7048" />
      <Hotspot {...state("flash")} {...shared} label={[-5.1, 2.1, -3.6]}>
        <group position={[-5.1, 1.16, -3.6]}>
          <Block size={[0.9, 0.72, 0.7]} position={[0, 0, 0]} color="#cfc6b2" />
          <FlashScreen />
        </group>
      </Hotspot>
    </group>
  );
}
