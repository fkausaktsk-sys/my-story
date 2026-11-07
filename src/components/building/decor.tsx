"use client";

import photoshopIcon from "@/assets/photoshop-icon.png";
import { Block, useCanvasTexture, useImageTexture } from "@/components/building/parts";

// 층마다 그 시절을 떠올리게 하는 소품들.
// 프로그램 아이콘은 원본 이미지가 아니라, 그 시절 도구를 알아볼 만큼만 직접 그렸습니다 (포토샵 제외)

type Vec3 = [number, number, number];

// ---------- 도구 아이콘 액자 ----------

export type Tool = "ps" | "dw" | "fl" | "ai" | "figma" | "code" | "spark" | "unknown";

type Face = { bg: string; side: string; draw: (ctx: CanvasRenderingContext2D) => void };

const letters = (text: string, color: string, border: string) => (ctx: CanvasRenderingContext2D) => {
  ctx.strokeStyle = border;
  ctx.lineWidth = 14;
  ctx.strokeRect(16, 16, 224, 224);
  ctx.fillStyle = color;
  ctx.font = "800 120px 'Segoe UI', Pretendard, sans-serif";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(text, 40, 178);
};

const FACES: Record<Exclude<Tool, "ps">, Face> = {
  dw: { bg: "#072401", side: "#0c3a03", draw: letters("Dw", "#4af626", "#4af626") },
  fl: { bg: "#3b0000", side: "#560000", draw: letters("Fl", "#ff4136", "#ff4136") },
  ai: { bg: "#330000", side: "#4a1600", draw: letters("Ai", "#ff9a00", "#ff9a00") },
  figma: {
    bg: "#1e1e1e",
    side: "#2c2c2c",
    draw: (ctx) => {
      const r = 34;
      const cells: [number, number, string, "round" | "left" | "drop"][] = [
        [94, 62, "#f24e1e", "left"],
        [162, 62, "#ff7262", "round"],
        [94, 130, "#a259ff", "left"],
        [162, 130, "#1abcfe", "round"],
        [94, 198, "#0acf83", "drop"],
      ];
      cells.forEach(([x, y, color]) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      });
      // 왼쪽 칸은 반쪽 사각형으로 이어 붙입니다
      ctx.fillStyle = "#f24e1e";
      ctx.fillRect(94, 28, 34, 68);
      ctx.fillStyle = "#ff7262";
      ctx.fillRect(128, 28, 34, 68);
      ctx.fillStyle = "#a259ff";
      ctx.fillRect(94, 96, 34, 68);
      ctx.fillStyle = "#0acf83";
      ctx.fillRect(94, 164, 34, 34);
    },
  },
  code: {
    bg: "#1f6feb",
    side: "#1550ad",
    draw: (ctx) => {
      ctx.fillStyle = "#ffffff";
      ctx.font = "800 104px Consolas, monospace";
      ctx.fillText("</>", 30, 164);
    },
  },
  spark: {
    bg: "#d97757",
    side: "#b85f42",
    draw: (ctx) => {
      // Claude Code: 주황 바탕에 길이가 제각각인 크림색 빛줄기
      const cx = 128;
      const cy = 108;
      const rays = [70, 56, 74, 60, 68, 52, 76, 58, 66, 54, 72, 62];
      ctx.fillStyle = "#faf6ef";
      rays.forEach((length, i) => {
        const angle = (i / rays.length) * Math.PI * 2 - Math.PI / 2 + (i % 2) * 0.06;
        const base = 13;
        const tip = 6.5;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        // 가운데는 굵고 끝으로 갈수록 가늘어지는 빛줄기
        ctx.beginPath();
        ctx.moveTo(cx - sin * base, cy + cos * base);
        ctx.lineTo(cx + cos * length - sin * tip, cy + sin * length + cos * tip);
        ctx.arc(cx + cos * length, cy + sin * length, tip, angle + Math.PI / 2, angle - Math.PI / 2, true);
        ctx.lineTo(cx + sin * base, cy - cos * base);
        ctx.closePath();
        ctx.fill();
      });
      ctx.beginPath();
      ctx.arc(cx, cy, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = "700 30px 'Segoe UI', Pretendard, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Claude Code", 128, 226);
    },
  },
  unknown: {
    bg: "#26304f",
    side: "#1b2440",
    draw: (ctx) => {
      ctx.setLineDash([16, 12]);
      ctx.strokeStyle = "#ffc56e";
      ctx.lineWidth = 8;
      ctx.strokeRect(22, 22, 212, 212);
      ctx.setLineDash([]);
      ctx.fillStyle = "#ffc56e";
      ctx.font = "800 150px Pretendard, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("?", 128, 182);
    },
  },
};

function DrawnFace({ face }: { face: Face }) {
  const texture = useCanvasTexture(256, 256, (ctx) => {
    ctx.fillStyle = face.bg;
    ctx.fillRect(0, 0, 256, 256);
    face.draw(ctx);
  });
  return <meshStandardMaterial attach="material-4" map={texture} roughness={0.4} />;
}

function PhotoshopFace() {
  const texture = useImageTexture(photoshopIcon.src);
  return texture ? (
    <meshStandardMaterial key="face" attach="material-4" map={texture} roughness={0.4} />
  ) : (
    <meshStandardMaterial key="blank" attach="material-4" color="#0a55ad" roughness={0.4} />
  );
}

// 벽에 거는 두꺼운 입체 아이콘. 면 순서: 오른쪽, 왼쪽, 위, 아래, 앞, 뒤
export function ToolIcon({ tool, position, rotation, size = 0.7 }: { tool: Tool; position: Vec3; rotation?: Vec3; size?: number }) {
  const side = tool === "ps" ? "#003a78" : FACES[tool].side;
  const top = tool === "ps" ? "#41d9fb" : FACES[tool].side;
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={[size, size, size * 0.23]} />
      <meshStandardMaterial attach="material-0" color={side} roughness={0.45} />
      <meshStandardMaterial attach="material-1" color={side} roughness={0.45} />
      <meshStandardMaterial attach="material-2" color={top} roughness={0.45} />
      <meshStandardMaterial attach="material-3" color={side} roughness={0.45} />
      {tool === "ps" ? <PhotoshopFace /> : <DrawnFace face={FACES[tool]} />}
      <meshStandardMaterial attach="material-5" color={side} roughness={0.45} />
    </mesh>
  );
}

// ---------- 벽에 붙이는 그림 ----------

// 액자에 넣은 그림. 캔버스 크기 비율과 실제 크기 비율을 맞춰 넘깁니다
export function Poster({
  position,
  rotation,
  size,
  canvas,
  draw,
  frame = "#1d1d22",
  glow = 0,
}: {
  position: Vec3;
  rotation?: Vec3;
  size: [number, number];
  canvas: [number, number];
  draw: (ctx: CanvasRenderingContext2D) => void;
  frame?: string | null;
  glow?: number;
}) {
  const texture = useCanvasTexture(canvas[0], canvas[1], draw);
  return (
    <group position={position} rotation={rotation}>
      {frame && <Block size={[size[0] + 0.08, size[1] + 0.08, 0.04]} position={[0, 0, 0]} color={frame} />}
      <mesh position={[0, 0, 0.025]}>
        <planeGeometry args={size} />
        <meshStandardMaterial map={texture} emissiveMap={texture} emissive="#ffffff" emissiveIntensity={glow} roughness={0.85} />
      </mesh>
    </group>
  );
}

// 포스트잇 한 장
export function Sticky({
  position,
  rotation,
  color = "#ffe680",
  lines,
  size = 0.18,
}: {
  position: Vec3;
  rotation?: Vec3;
  color?: string;
  lines: string[];
  size?: number;
}) {
  const texture = useCanvasTexture(128, 128, (ctx) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 128, 128);
    ctx.fillStyle = "#2a241d";
    ctx.font = "700 24px Pretendard, sans-serif";
    lines.forEach((line, i) => ctx.fillText(line, 10, 40 + i * 32));
  });
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[size, size]} />
      <meshStandardMaterial map={texture} roughness={0.95} side={2} />
    </mesh>
  );
}

// ---------- 책상 위 소품 ----------

// 2010년의 폴더폰. 반쯤 열어 둡니다
export function FlipPhone({ position, rotation }: { position: Vec3; rotation?: Vec3 }) {
  return (
    <group position={position} rotation={rotation}>
      <Block size={[0.12, 0.025, 0.22]} position={[0, 0.0125, 0]} color="#b7bcc6" />
      <group position={[0, 0.025, -0.11]} rotation={[0.9, 0, 0]}>
        <Block size={[0.12, 0.022, 0.22]} position={[0, 0, -0.11]} color="#c9ced6" />
        <Block size={[0.09, 0.005, 0.12]} position={[0, -0.013, -0.12]} color="#5470c2" emissive="#5470c2" emissiveIntensity={0.6} />
      </group>
    </group>
  );
}

// 스마트폰. 화면 그림은 색으로만 표시합니다
export function SmartPhone({ position, rotation, screen = "#3d7bf0" }: { position: Vec3; rotation?: Vec3; screen?: string }) {
  return (
    <group position={position} rotation={rotation}>
      <Block size={[0.15, 0.018, 0.3]} position={[0, 0.009, 0]} color="#1b1c21" />
      <Block size={[0.13, 0.004, 0.26]} position={[0, 0.02, 0]} color={screen} emissive={screen} emissiveIntensity={0.5} />
    </group>
  );
}

// 머그컵이나 텀블러
export function Cup({ position, color = "#e8e0d0", tall = false }: { position: Vec3; color?: string; tall?: boolean }) {
  const height = tall ? 0.3 : 0.2;
  return (
    <mesh position={[position[0], position[1] + height / 2, position[2]]} castShadow>
      <cylinderGeometry args={[tall ? 0.07 : 0.09, tall ? 0.065 : 0.075, height, 14]} />
      <meshStandardMaterial color={color} roughness={tall ? 0.3 : 0.5} metalness={tall ? 0.4 : 0} />
    </mesh>
  );
}

// 에너지 음료 캔
export function Can({ position, color = "#3fbf5f" }: { position: Vec3; color?: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.08, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.045, 0.16, 12]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.163, 0]}>
        <cylinderGeometry args={[0.04, 0.045, 0.01, 12]} />
        <meshStandardMaterial color="#c9ced6" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

// 작업본을 구워 두던 CD-R 묶음
export function CdStack({ position }: { position: Vec3 }) {
  return (
    <group position={position}>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[0.01 * i, 0.012 + i * 0.024, 0.006 * i]} castShadow>
          <boxGeometry args={[0.3, 0.02, 0.3]} />
          <meshStandardMaterial color={i % 2 === 0 ? "#dfe3ea" : "#a7b6d6"} roughness={0.3} transparent opacity={0.92} />
        </mesh>
      ))}
    </group>
  );
}

// 모니터 옆 작은 스피커
export function Speaker({ position }: { position: Vec3 }) {
  return (
    <group position={position}>
      <Block size={[0.2, 0.34, 0.2]} position={[0, 0.17, 0]} color="#d4cdbc" />
      <mesh position={[0, 0.2, 0.101]}>
        <circleGeometry args={[0.065, 16]} />
        <meshStandardMaterial color="#3a3a3a" roughness={0.9} />
      </mesh>
    </group>
  );
}

// 노트북. 화면은 children 대신 색으로만 표시합니다
export function Laptop({ position, rotation, screen = "#f1f2f5" }: { position: Vec3; rotation?: Vec3; screen?: string }) {
  return (
    <group position={position} rotation={rotation}>
      <Block size={[0.62, 0.025, 0.42]} position={[0, 0.0125, 0]} color="#c7cad1" />
      <group position={[0, 0.025, -0.21]} rotation={[-0.25, 0, 0]}>
        <Block size={[0.62, 0.4, 0.02]} position={[0, 0.2, 0]} color="#c7cad1" />
        <Block size={[0.56, 0.34, 0.004]} position={[0, 0.2, 0.012]} color={screen} emissive={screen} emissiveIntensity={0.45} />
      </group>
    </group>
  );
}

// 와이어프레임을 그린 공책
export function SketchBook({ position, rotation }: { position: Vec3; rotation?: Vec3 }) {
  const texture = useCanvasTexture(256, 180, (ctx) => {
    ctx.fillStyle = "#fbfaf4";
    ctx.fillRect(0, 0, 256, 180);
    ctx.strokeStyle = "#5a5f6e";
    ctx.lineWidth = 3;
    ctx.strokeRect(14, 14, 104, 150);
    ctx.strokeRect(138, 14, 104, 150);
    [30, 60, 90].forEach((y) => ctx.strokeRect(24, y, 84, 20));
    ctx.beginPath();
    ctx.moveTo(148, 30);
    ctx.lineTo(232, 90);
    ctx.moveTo(232, 30);
    ctx.lineTo(148, 90);
    ctx.stroke();
    ctx.strokeRect(148, 110, 84, 22);
  });
  return (
    <group position={position} rotation={rotation}>
      <Block size={[0.5, 0.02, 0.35]} position={[0, 0.01, 0]} color="#3a3f52" />
      <mesh position={[0, 0.021, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.48, 0.33]} />
        <meshStandardMaterial map={texture} roughness={0.95} />
      </mesh>
    </group>
  );
}

// 컬러칩 부채
export function ColorChips({ position, rotation }: { position: Vec3; rotation?: Vec3 }) {
  const colors = ["#e5484d", "#f2a65a", "#f2c230", "#3fbf5f", "#3d7bf0", "#9b6ae0"];
  return (
    <group position={position} rotation={rotation}>
      {colors.map((color, i) => (
        <group key={color} rotation={[0, (i - 2.5) * 0.18, 0]}>
          <Block size={[0.06, 0.006 + i * 0.002, 0.3]} position={[0, 0.005 + i * 0.004, -0.15]} color={color} />
        </group>
      ))}
    </group>
  );
}

// 무선 이어폰 케이스
export function EarbudCase({ position }: { position: Vec3 }) {
  return (
    <mesh position={[position[0], position[1] + 0.03, position[2]]} scale={[1, 0.7, 0.8]} castShadow>
      <sphereGeometry args={[0.06, 14, 14]} />
      <meshStandardMaterial color="#f7f7f5" roughness={0.3} />
    </mesh>
  );
}

// 2017년의 휴대용 미니 선풍기
export function MiniFan({ position, color = "#9fd3ff" }: { position: Vec3; color?: string }) {
  return (
    <group position={position}>
      <Block size={[0.05, 0.22, 0.05]} position={[0, 0.11, 0]} color={color} />
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.04, 18]} />
        <meshStandardMaterial color={color} roughness={0.5} transparent opacity={0.85} />
      </mesh>
    </group>
  );
}

// ---------- 바닥 소품 ----------

// 화분. 시대가 지날수록 큰 잎이 됩니다
export function Plant({ position, leaf = "#4f8f62", pot = "#d5c6ae", size = 1 }: { position: Vec3; leaf?: string; pot?: string; size?: number }) {
  return (
    <group position={position} scale={size}>
      <Block size={[0.42, 0.46, 0.42]} position={[0, 0.23, 0]} color={pot} />
      {[
        [0, 0.95, 0, 0.36],
        [0.18, 0.78, 0.1, 0.26],
        [-0.16, 0.8, -0.08, 0.28],
        [0.04, 1.18, -0.06, 0.22],
      ].map(([x, y, z, r]) => (
        <mesh key={`${x}-${y}`} position={[x, y, z]} castShadow>
          <sphereGeometry args={[r, 12, 12]} />
          <meshStandardMaterial color={leaf} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

// 테이프를 붙인 택배 상자
export function ParcelBox({ position, size = [0.7, 0.5, 0.55], rotation }: { position: Vec3; size?: Vec3; rotation?: Vec3 }) {
  return (
    <group position={position} rotation={rotation}>
      <Block size={size} position={[0, size[1] / 2, 0]} color="#b48a5a" />
      <Block size={[size[0] + 0.005, 0.01, 0.1]} position={[0, size[1] + 0.001, 0]} color="#d9c08f" />
    </group>
  );
}

// 행사장에 세우는 롤업 배너
export function RollBanner({
  position,
  rotation,
  draw,
}: {
  position: Vec3;
  rotation?: Vec3;
  draw: (ctx: CanvasRenderingContext2D) => void;
}) {
  const texture = useCanvasTexture(220, 560, draw);
  return (
    <group position={position} rotation={rotation}>
      <Block size={[0.86, 0.1, 0.24]} position={[0, 0.05, 0]} color="#c9ced6" />
      <mesh position={[0, 1.08, 0.02]} castShadow>
        <planeGeometry args={[0.8, 2.02]} />
        <meshStandardMaterial map={texture} roughness={0.8} side={2} />
      </mesh>
      <Block size={[0.03, 2.1, 0.03]} position={[0, 1.05, -0.06]} color="#8d97a3" />
    </group>
  );
}
