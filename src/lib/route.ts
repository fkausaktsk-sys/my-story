import { floorBaseY } from "@/data/floors";

export type Point = { x: number; y: number; z: number };

// 계단실: 방 오른쪽 띠. 모든 층의 계단은 앞에서 뒤로 오릅니다
export const STAIR = {
  x: 4.3,
  width: 1.2,
  landingZ: 2.7,
  footZ: 2.1,
  bandStart: 3.6,
  steps: 12,
};

// 층에 도착하면 앉는 책상 앞 자리
export const SEAT = { x: -0.6, z: -0.25 };
// 계단실 옆 복도와, 책상을 돌아가기 위해 거치는 지점
const WALKWAY_X = 3.2;
const AISLE = { x: 2.2, z: 0.7 };

const at = (floor: number, x: number, z: number): Point => ({ x, y: floorBaseY(floor), z });

// 계단실 앞쪽에서 자리까지
const leaveSeat = (floor: number): Point[] => [
  at(floor, SEAT.x, SEAT.z),
  at(floor, SEAT.x, SEAT.z + 0.45),
  at(floor, AISLE.x, AISLE.z),
  at(floor, WALKWAY_X, STAIR.landingZ),
  at(floor, STAIR.x, STAIR.landingZ),
];

// 위층 뒤쪽 계단참에서 복도를 지나 자리까지
const reachSeat = (floor: number): Point[] => [
  at(floor, STAIR.x, -STAIR.landingZ),
  at(floor, WALKWAY_X, -STAIR.landingZ),
  at(floor, AISLE.x, AISLE.z),
  at(floor, SEAT.x, SEAT.z + 0.45),
  at(floor, SEAT.x, SEAT.z),
];

// 위층 뒤쪽 계단참에서 복도를 따라 다음 계단 앞으로
const crossFloor = (floor: number): Point[] => [
  at(floor, STAIR.x, -STAIR.landingZ),
  at(floor, WALKWAY_X, -STAIR.landingZ),
  at(floor, WALKWAY_X, STAIR.landingZ),
  at(floor, STAIR.x, STAIR.landingZ),
];

// floor 층에서 바로 위층까지 오르는 구간
const stairRun = (floor: number): Point[] => [
  at(floor, STAIR.x, STAIR.footZ),
  at(floor + 1, STAIR.x, -STAIR.footZ),
];

// 위로 가는 경로를 만들고, 내려갈 때는 뒤집어서 씁니다
const routeUp = (from: number, to: number): Point[] => {
  const route = leaveSeat(from);
  for (let floor = from; floor < to; floor += 1) {
    route.push(...stairRun(floor));
    route.push(...(floor + 1 === to ? reachSeat(to) : crossFloor(floor + 1)));
  }
  return route;
};

// 자리에서 일어나 계단을 지나 목표 층 자리에 앉기까지의 경로
export const buildRoute = (from: number, to: number): Point[] =>
  to > from ? routeUp(from, to) : routeUp(to, from).reverse();
