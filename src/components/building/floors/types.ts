// 층 장면이 공통으로 받는 값
export type FloorSceneProps = {
  interactive: boolean;
  seen: ReadonlySet<string>;
  activeStoryId: string | null;
  onSelectStory: (id: string) => void;
};
