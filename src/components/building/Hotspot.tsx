"use client";

import { type ThreeEvent, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";

type Props = {
  id: string;
  label: [number, number, number];
  seen: boolean;
  active: boolean;
  enabled: boolean;
  onSelect: (id: string) => void;
  children: React.ReactNode;
};

// 누를 수 있는 소품: 위에 뜨는 표식과 눌렀을 때의 살짝 튀는 반응을 담당합니다
export default function Hotspot({ id, label, seen, active, enabled, onSelect, children }: Props) {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  const markerRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }, delta) => {
    const target = hovered || active ? 1.04 : 1;
    const group = groupRef.current;
    if (group) group.scale.setScalar(THREE.MathUtils.damp(group.scale.x, target, 10, delta));
    const marker = markerRef.current;
    if (marker) {
      marker.position.y = label[1] + Math.sin(clock.elapsedTime * 2.4) * 0.09;
      marker.rotation.y += delta * 1.6;
    }
  });

  const handleOver = (event: ThreeEvent<PointerEvent>) => {
    if (!enabled) return;
    event.stopPropagation();
    setHovered(true);
    document.body.style.cursor = "pointer";
  };
  const handleOut = () => {
    setHovered(false);
    document.body.style.cursor = "";
  };
  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    if (!enabled) return;
    event.stopPropagation();
    onSelect(id);
  };

  return (
    <group ref={groupRef} onPointerOver={handleOver} onPointerOut={handleOut} onClick={handleClick}>
      {children}
      {enabled && !seen && (
        <mesh ref={markerRef} position={label}>
          <octahedronGeometry args={[0.15, 0]} />
          <meshBasicMaterial color="#ffc56e" toneMapped={false} />
        </mesh>
      )}
    </group>
  );
}
