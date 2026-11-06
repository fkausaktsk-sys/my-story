import { floorBaseY } from "@/data/floors";
import { type Point, SEAT } from "@/lib/route";

// 캐릭터 위치는 매 프레임 바뀌므로 React 상태가 아닌 공유 객체에 둡니다.
// 캐릭터가 쓰고, 카메라와 층 연출이 읽습니다
export const avatar: Point & { moving: boolean } = {
  x: SEAT.x,
  y: floorBaseY(0),
  z: SEAT.z,
  moving: false,
};
