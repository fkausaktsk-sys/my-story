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
    // 시점을 돌리려고 끈 동작은 클릭으로 치지 않습니다
    if (!enabled || event.delta > 6) return;
    event.stopPropagation();
    onSelect(id);
  };

  return (
    // 방 중심이 아니라 소품 위치를 기준으로 커져야 벽에 붙은 소품이 벽 속으로 밀리지 않습니다
    <group ref={groupRef} position={label} onPointerOver={handleOver} onPointerOut={handleOut} onClick={handleClick}>
      <group position={[-label[0], -label[1], -label[2]]}>
        {children}
        {enabled && !seen && (
          <mesh ref={markerRef} position={label}>
            <octahedronGeometry args={[0.15, 0]} />
            <meshBasicMaterial color="#ffc56e" toneMapped={false} />
          </mesh>
        )}
      </group>
    </group>
  );
}
