"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import Character from "@/components/building/Character";
import AiFloor from "@/components/building/floors/AiFloor";
import BannerFloor from "@/components/building/floors/BannerFloor";
import BasementFloor, { type FloorSceneProps } from "@/components/building/floors/BasementFloor";
import PhotoshopFloor from "@/components/building/floors/PhotoshopFloor";
import ResponsiveFloor from "@/components/building/floors/ResponsiveFloor";
import SystemFloor from "@/components/building/floors/SystemFloor";
import Teammates from "@/components/building/Teammates";
import { Block, useCanvasTexture } from "@/components/building/parts";
import { FLOOR_HEIGHT, type Floor, floorBaseY, floors } from "@/data/floors";
import { avatar } from "@/lib/avatar";
import { STAIR } from "@/lib/route";

const ROOM = { width: 10, depth: 6.4, wall: 0.2 };

const FLOOR_SCENES: Record<string, React.ComponentType<FloorSceneProps>> = {
  b1: BasementFloor,
  "1f": PhotoshopFloor,
  "2f": BannerFloor,
  "3f": ResponsiveFloor,
  "4f": SystemFloor,
  "5f": AiFloor,
};

type Props = FloorSceneProps & {
  floorIndex: number;
  reduced: boolean;
  onArrive: () => void;
};

// 벽에 붙는 층 표지
function FloorSign({ floor }: { floor: Floor }) {
  const texture = useCanvasTexture(512, 256, (ctx) => {
    ctx.fillStyle = "#f4f1e8";
    ctx.fillRect(0, 0, 512, 256);
    ctx.fillStyle = "#1a1d2b";
    ctx.font = "800 120px Pretendard, sans-serif";
    ctx.fillText(floor.label, 32, 124);
    ctx.font = "600 38px Pretendard, sans-serif";
    ctx.fillText(floor.title.slice(0, 13), 32, 200);
  });
  return (
    <mesh position={[0, 2.1, -ROOM.depth / 2 + 0.13]}>
      <planeGeometry args={[3.2, 1.6]} />
      <meshStandardMaterial map={texture} roughness={0.9} />
    </mesh>
  );
}

// 층 뼈대: 방 바닥, 뒤쪽 두 벽, 계단참. 계단이 지나는 자리는 뚫려 있습니다
function RoomShell({ color, solidBand }: { color: string; solidBand: boolean }) {
  const { width, depth, wall } = ROOM;
  const height = FLOOR_HEIGHT - 0.2;
  const left = -width / 2;
  const roomWidth = STAIR.bandStart - left;
  const bandWidth = width / 2 - STAIR.bandStart;
  const bandX = STAIR.bandStart + bandWidth / 2;
  const landing = depth / 2 - STAIR.footZ;
  const landingZ = STAIR.footZ + landing / 2;

  return (
    <>
      <Block size={[roomWidth, 0.2, depth]} position={[left + roomWidth / 2, -0.1, 0]} color="#2c2a2a" />
      {solidBand ? (
        <Block size={[bandWidth, 0.2, depth]} position={[bandX, -0.1, 0]} color="#3a3735" />
      ) : (
        <>
          <Block size={[bandWidth, 0.2, landing]} position={[bandX, -0.1, landingZ]} color="#3a3735" />
          <Block size={[bandWidth, 0.2, landing]} position={[bandX, -0.1, -landingZ]} color="#3a3735" />
        </>
      )}
      <Block size={[width, height, wall]} position={[0, height / 2, -depth / 2]} color={color} />
      <Block size={[wall, height, depth]} position={[left, height / 2, 0]} color={color} />
    </>
  );
}

// 다음 층으로 오르는 계단. 모든 층이 앞에서 뒤로 오릅니다
function Stairs() {
  const run = STAIR.footZ * 2;
  const stepDepth = run / STAIR.steps;
  const stepRise = FLOOR_HEIGHT / STAIR.steps;
  const length = Math.hypot(run, FLOOR_HEIGHT);
  const slope = Math.atan2(FLOOR_HEIGHT, run);
  const railHeight = 0.95;
  const posts = Array.from({ length: STAIR.steps + 1 }, (_, i) => i).filter((i) => i % 2 === 0);

  return (
    <group>
      {Array.from({ length: STAIR.steps }, (_, i) => (
        <Block
          key={i}
          size={[STAIR.width, stepRise, stepDepth + 0.03]}
          position={[STAIR.x, stepRise * (i + 0.5), STAIR.footZ - stepDepth * (i + 0.5)]}
          color={i % 2 === 0 ? "#8b7c6a" : "#7d6f5f"}
        />
      ))}
      {[STAIR.x - STAIR.width / 2 - 0.04, STAIR.x + STAIR.width / 2 + 0.04].map((x) => (
        <group key={x}>
          {/* 계단 옆판 */}
          <group position={[x, FLOOR_HEIGHT / 2 - 0.1, 0]} rotation={[slope, 0, 0]}>
            <Block size={[0.06, 0.26, length]} position={[0, 0, 0]} color="#3c3833" />
          </group>
          {/* 난간 기둥: 손잡이를 계단과 이어 줍니다 */}
          {posts.map((i) => (
            <Block
              key={i}
              size={[0.045, railHeight, 0.045]}
              position={[x, stepRise * i + railHeight / 2, STAIR.footZ - stepDepth * i]}
              color="#a98a54"
            />
          ))}
          {/* 손잡이 */}
          <group position={[x, FLOOR_HEIGHT / 2 + railHeight, 0]} rotation={[slope, 0, 0]}>
            <Block size={[0.08, 0.07, length]} position={[0, 0, 0]} color="#cfa45f" />
          </group>
        </group>
      ))}
    </group>
  );
}

// 아직 내용이 없는 층: 공사 자재를 쌓아 둡니다
function ConstructionProps({ floor }: { floor: Floor }) {
  return (
    <>
      <FloorSign floor={floor} />
      <Block size={[1.2, 0.8, 0.9]} position={[-2.8, 0.4, 0.4]} color="#9a7a4f" />
      <Block size={[0.9, 0.6, 0.8]} position={[-1.7, 0.3, 1.1]} color="#8a6b43" />
      <Block size={[0.7, 0.5, 0.7]} position={[-2.7, 1.05, 0.5]} color="#a98a5c" />
      <pointLight position={[-1, 2.8, 0]} color="#ffe2b0" intensity={18} distance={10} decay={1.7} />
    </>
  );
}

// 현재 층과 캐릭터가 있는 곳까지만 지어집니다
function FloorStage({
  index,
  floorIndex,
  children,
}: {
  index: number;
  floorIndex: number;
  children: React.ReactNode;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const top = Math.max(floorBaseY(floorIndex), avatar.y + 0.6);
    const next = THREE.MathUtils.damp(group.scale.y, floorBaseY(index) <= top ? 1 : 0, 6, delta);
    group.scale.y = next;
    group.visible = next > 0.01;
  });

  return (
    <group ref={groupRef} position={[0, floorBaseY(index), 0]} scale={[1, index === 0 ? 1 : 0.001, 1]}>
      {children}
    </group>
  );
}

// 지면과 흙: B1을 땅속 단면처럼 보이게 합니다
function Ground() {
  const { width, depth } = ROOM;
  const top = FLOOR_HEIGHT;
  const back = -depth / 2 - 0.1;
  const left = -width / 2 - 0.1;
  const extent = 9;
  return (
    <group position={[0, -top, 0]}>
      <Block size={[width + extent, 1.2, depth + extent]} position={[-extent / 2, -0.8, -extent / 2]} color="#6b4f38" />
      <Block
        size={[width + extent, top, extent]}
        position={[-extent / 2, top / 2 - 0.2, back - extent / 2]}
        color="#75583f"
      />
      <Block size={[extent, top, depth]} position={[left - extent / 2, top / 2 - 0.2, 0]} color="#75583f" />
      <Block
        size={[width + extent, 0.16, extent]}
        position={[-extent / 2, top - 0.12, back - extent / 2]}
        color="#3b3e4a"
      />
      <Block size={[extent, 0.16, depth]} position={[left - extent / 2, top - 0.12, 0]} color="#3b3e4a" />
    </group>
  );
}

export default function Building({
  floorIndex,
  reduced,
  onArrive,
  interactive,
  seen,
  activeStoryId,
  onSelectStory,
}: Props) {
  return (
    <group>
      <Ground />
      {floors.map((floor, index) => {
        const FloorScene = FLOOR_SCENES[floor.id];
        return (
          <FloorStage key={floor.id} index={index} floorIndex={floorIndex}>
            <RoomShell color={floor.wall} solidBand={index === 0} />
            {index < floors.length - 1 && <Stairs />}
            {FloorScene ? (
              <FloorScene
                interactive={interactive && floorIndex === index}
                seen={seen}
                activeStoryId={activeStoryId}
                onSelectStory={onSelectStory}
              />
            ) : (
              <ConstructionProps floor={floor} />
            )}
          </FloorStage>
        );
      })}
      <Character floorIndex={floorIndex} reduced={reduced} onArrive={onArrive} />
      {interactive && <Teammates key={floorIndex} floorIndex={floorIndex} reduced={reduced} />}
    </group>
  );
}
