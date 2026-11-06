"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";

type Vec3 = [number, number, number];

// 그림자를 주고받는 기본 상자. 모든 소품의 재료입니다
export function Block({
  size,
  position,
  rotation,
  color,
  roughness = 0.85,
  emissive,
  emissiveIntensity = 0,
}: {
  size: Vec3;
  position: Vec3;
  rotation?: Vec3;
  color: string;
  roughness?: number;
  emissive?: string;
  emissiveIntensity?: number;
}) {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        roughness={roughness}
        emissive={emissive ?? "#000000"}
        emissiveIntensity={emissiveIntensity}
      />
    </mesh>
  );
}

// 캔버스에 그린 그림을 3D 재질로 씁니다. 글꼴 파일 없이 한글을 표시할 수 있습니다
export function useCanvasTexture(width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (ctx) draw(ctx);
    const result = new THREE.CanvasTexture(canvas);
    result.colorSpace = THREE.SRGBColorSpace;
    result.anisotropy = 4;
    return result;
    // 그림은 처음 한 번만 만듭니다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height]);

  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}
