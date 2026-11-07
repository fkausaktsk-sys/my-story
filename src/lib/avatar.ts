import { floorBaseY } from "@/data/floors";
import { type Point, SEAT } from "@/lib/route";

// 캐릭터 위치는 매 프레임 바뀌므로 React 상태가 아닌 공유 객체에 둡니다.
// 캐릭터가 쓰고, 카메라와 층 연출이 읽습니다. dir은 지금 걷는 방향(단위 벡터)으로 1인칭 시점이 씁니다
export const avatar: Point & { moving: boolean; dir: Point } = {
  x: SEAT.x,
  y: floorBaseY(0),
  z: SEAT.z,
  moving: false,
  // 자리에 앉아 있을 때는 책상(-z)을 봅니다
  dir: { x: 0, y: 0, z: -1 },
};
