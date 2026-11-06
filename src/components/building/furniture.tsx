"use client";

import { Block } from "@/components/building/parts";

// 층마다 쓰는 책상. 시대에 따라 색만 바꿉니다
export function Desk({ top = "#8b6a48", leg = "#6e5238" }: { top?: string; leg?: string }) {
  return (
    <>
      <Block size={[3.8, 0.12, 1.5]} position={[-0.6, 1, -1.9]} color={top} />
      <Block size={[0.12, 1, 1.3]} position={[-2.35, 0.5, -1.9]} color={leg} />
      <Block size={[0.12, 1, 1.3]} position={[1.15, 0.5, -1.9]} color={leg} />
    </>
  );
}

// 캐릭터가 앉는 의자. 등받이는 카메라 쪽에 있습니다
export function Chair({ color = "#2f3545" }: { color?: string }) {
  return (
    <group position={[-0.6, 0, -0.1]}>
      <Block size={[0.72, 0.1, 0.72]} position={[0, 0.58, -0.1]} color={color} />
      <Block size={[0.72, 0.8, 0.1]} position={[0, 1, 0.26]} color={color} />
      <Block size={[0.12, 0.54, 0.12]} position={[0, 0.27, -0.1]} color="#1e2230" />
    </group>
  );
}

// 책상 위 평면 모니터. 화면은 children으로 넘깁니다
export function Monitor({ x, turn = 0, children }: { x: number; turn?: number; children: React.ReactNode }) {
  return (
    <group position={[x, 1.82, -2.1]} rotation={[0, turn, 0]}>
      <Block size={[1.36, 0.92, 0.09]} position={[0, 0.1, 0]} color="#22252c" />
      <Block size={[0.12, 0.42, 0.12]} position={[0, -0.54, -0.04]} color="#31343c" />
      <Block size={[0.54, 0.05, 0.4]} position={[0, -0.74, 0]} color="#31343c" />
      {children}
    </group>
  );
}
