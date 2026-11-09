"use client";

import { type Floor, floors } from "@/data/floors";

type Props = {
  floor: Floor;
  floorIndex: number;
  // 이 층에서 본 이야기 수
  seenCount: number;
  // 층 소개 카드를 다시 엽니다
  onOpenIntro: () => void;
};

// 소개 카드를 닫은 뒤 왼쪽 위에 남는 작은 층 표시.
// 화면을 가리지 않도록 층·제목·진행률만 보여 주고, 누르면 소개를 다시 봅니다
export default function FloorHeader({ floor, floorIndex, seenCount, onOpenIntro }: Props) {
  return (
    <button
      type="button"
      onClick={onOpenIntro}
      aria-label={`${floor.label} ${floor.title} 층 소개 다시 보기`}
      className="glass group absolute left-3 top-3 max-w-[calc(100vw-7.5rem)] rounded-2xl px-4 py-2.5 text-left transition-colors hover:bg-white/10 md:left-6 md:top-6 md:max-w-sm md:px-5 md:py-3"
    >
      <span className="flex items-center gap-2">
        <span aria-hidden className="flex w-20 gap-0.5">
          {floors.map((item, index) => (
            <span
              key={item.id}
              className={`h-1 flex-1 rounded-full ${
                index < floorIndex ? "bg-accent/60" : index === floorIndex ? "bg-accent" : "bg-white/15"
              }`}
            />
          ))}
        </span>
        {floor.stories.length > 0 && (
          <span className="text-[11px] font-medium text-muted">
            이야기 {seenCount} / {floor.stories.length}
          </span>
        )}
      </span>
      <span className="mt-1 flex items-center gap-2">
        <span className="text-sm font-bold text-accent">{floor.label}</span>
        <span className="truncate text-sm font-bold md:text-base">{floor.title}</span>
        <span className="ml-1 shrink-0 text-[11px] font-medium text-muted group-hover:text-foreground">소개 ⓘ</span>
      </span>
    </button>
  );
}
