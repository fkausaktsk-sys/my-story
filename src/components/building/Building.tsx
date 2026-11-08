"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import Character from "@/components/building/Character";
import BannerFloor from "@/components/building/floors/BannerFloor";
import CampaignFloor from "@/components/building/floors/CampaignFloor";
import FirstFloor from "@/components/building/floors/FirstFloor";
import NextFloor from "@/components/building/floors/NextFloor";
import type { FloorSceneProps } from "@/components/building/floors/types";
import YbmFloor from "@/components/building/floors/YbmFloor";
import Teammates from "@/components/building/Teammates";
import { Block } from "@/components/building/parts";
import { FLOOR_HEIGHT, floorBaseY, floors } from "@/data/floors";
import { avatar } from "@/lib/avatar";
import { ROOM, STAIR } from "@/lib/route";

// 층마다 꾸민 장면: 1F table·포토샵, 2F 오픈마켓 배너, 3F 관공서 캠페인, 4F YBM, 5F 다음 층
const FLOOR_SCENES: Record<string, React.ComponentType<FloorSceneProps>> = {
  "1f": FirstFloor,
  "2f": BannerFloor,
  "3f": CampaignFloor,
  "4f": YbmFloor,
  "5f": NextFloor,
};

type Props = FloorSceneProps & {
  started: boolean;
  floorIndex: number;
  reduced: boolean;
  onArrive: () => void;
};

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

const CEILING = "#d9d3c6";

// 앞쪽과 오른쪽 벽, 천장: 안쪽 면만 그려서 바깥(아이소메트릭 카메라)에서는 보이지 않고,
// 1인칭으로 방 안을 걸을 때만 보입니다. 클릭과 그림자에는 끼어들지 않습니다
function InnerWalls({ color }: { color: string }) {
  const { width, depth } = ROOM;
  const height = FLOOR_HEIGHT - 0.2;
  const noRaycast = () => null;
  const left = -width / 2;
  const roomWidth = STAIR.bandStart - left;
  const bandWidth = width / 2 - STAIR.bandStart;
  const bandX = STAIR.bandStart + bandWidth / 2;
  const landing = depth / 2 - STAIR.footZ;
  const landingZ = STAIR.footZ + landing / 2;
  const ceiling: { size: [number, number]; center: [number, number] }[] = [
    { size: [roomWidth, depth], center: [left + roomWidth / 2, 0] },
    { size: [bandWidth, landing], center: [bandX, landingZ] },
    { size: [bandWidth, landing], center: [bandX, -landingZ] },
  ];
  return (
    <>
      <mesh position={[0, height / 2, depth / 2]} rotation={[0, Math.PI, 0]} raycast={noRaycast} receiveShadow>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      <mesh position={[width / 2, height / 2, 0]} rotation={[0, -Math.PI / 2, 0]} raycast={noRaycast} receiveShadow>
        <planeGeometry args={[depth, height]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      {/* 천장: 계단이 지나는 구멍만 비워 둡니다 */}
      {ceiling.map(({ size, center }) => (
        <mesh
          key={center.join()}
          position={[center[0], height, center[1]]}
          rotation={[Math.PI / 2, 0, 0]}
          raycast={noRaycast}
        >
          <planeGeometry args={size} />
          <meshStandardMaterial color={CEILING} roughness={0.95} />
        </mesh>
      ))}
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

// 시작 화면: 현재 층과 캐릭터가 있는 곳까지만 지어집니다.
// 들어간 뒤: 사무실 안만 보이도록 현재 층만 남깁니다
function FloorStage({
  index,
  started,
  floorIndex,
  children,
}: {
  index: number;
  started: boolean;
  floorIndex: number;
  children: React.ReactNode;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const base = floorBaseY(index);
    let show: boolean;
    if (!started) show = base <= Math.max(floorBaseY(floorIndex), avatar.y + 0.6);
    // 계단을 걷는 동안: 발밑 층과 그 아래층만. 위층은 도착할 때 지어지듯 나타납니다
    else if (avatar.moving) show = base <= avatar.y + 0.05 && base > avatar.y - FLOOR_HEIGHT - 0.1;
    else show = index === floorIndex;
    const next = THREE.MathUtils.damp(group.scale.y, show ? 1 : 0, 6, delta);
    group.scale.y = next;
    group.visible = next > 0.01;
  });

  return (
    <group ref={groupRef} position={[0, floorBaseY(index), 0]} scale={[1, index === 0 ? 1 : 0.001, 1]}>
      {children}
    </group>
  );
}

// 1층 주변의 지면: 건물이 길가에 서 있는 것처럼 보도와 연석을 깝니다
function Ground() {
  const { width, depth } = ROOM;
  const extent = 7;
  return (
    <group>
      <Block size={[width + extent * 2, 0.3, depth + extent * 2]} position={[0, -0.36, 0]} color="#252a3b" />
      <Block size={[width + 1.6, 0.06, depth + 1.6]} position={[0, -0.18, 0]} color="#3a3f52" />
    </group>
  );
}

export default function Building({
  started,
  floorIndex,
  reduced,
  onArrive,
  interactive,
  seen,
  activeStoryId,
  hintId,
  onSelectStory,
}: Props) {
  return (
    <group>
      <Ground />
      {floors.map((floor, index) => {
        const FloorScene = FLOOR_SCENES[floor.id];
        return (
          <FloorStage key={floor.id} index={index} started={started} floorIndex={floorIndex}>
            <RoomShell color={floor.wall} solidBand={index === 0} />
            {started && <InnerWalls color={floor.wall} />}
            {index < floors.length - 1 && <Stairs />}
            <FloorScene
              interactive={interactive && floorIndex === index}
              seen={seen}
              activeStoryId={activeStoryId}
              hintId={hintId}
              onSelectStory={onSelectStory}
            />
          </FloorStage>
        );
      })}
      <Character floorIndex={floorIndex} reduced={reduced} onArrive={onArrive} />
      {interactive && <Teammates key={floorIndex} floorIndex={floorIndex} reduced={reduced} />}
    </group>
  );
}
