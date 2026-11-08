// 층 장면이 공통으로 받는 값
export type FloorSceneProps = {
  interactive: boolean;
  seen: ReadonlySet<string>;
  activeStoryId: string | null;
  // 안내 말풍선이 추천하는 다음 이야기
  hintId: string | null;
  onSelectStory: (id: string) => void;
};
