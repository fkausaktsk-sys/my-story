"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";
import { floors } from "@/data/floors";

type Props = {
  currentIndex: number;
  moving: boolean;
  seen: ReadonlySet<string>;
  onMove: (index: number) => void;
  onSelectStory: (id: string) => void;
};

// 하단 도크: 이 층의 소품과 계단 이동
export default function Dock({ currentIndex, moving, seen, onMove, onSelectStory }: Props) {
  const [listOpen, setListOpen] = useState(false);
  const floor = floors[currentIndex];
  const next = floors[currentIndex + 1];
  const allSeen = floor.stories.every((story) => seen.has(story.id));

  const move = (index: number) => {
    setListOpen(false);
    onMove(index);
  };

  if (moving) {
    return (
      <p
        role="status"
        className="glass absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-6 py-3 text-sm font-medium md:bottom-8"
      >
        {floor.label}로 걸어가는 중…
      </p>
    );
  }

  return (
    <div className="absolute inset-x-3 bottom-3 flex flex-col items-center gap-2 md:bottom-7">
      {listOpen && (
        <nav aria-label="층 이동" className="glass w-full max-w-xs rounded-3xl p-2">
          <ol>
            {floors
              .map((item, index) => ({ item, index }))
              .reverse()
              .map(({ item, index }) => (
                <li key={item.id}>
                  <button
                    type="button"
                    aria-current={index === currentIndex ? "true" : undefined}
                    onClick={() => move(index)}
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-2.5 text-left text-sm transition-colors hover:bg-white/10 ${
                      index === currentIndex ? "bg-white/10" : ""
                    }`}
                  >
                    <span className="w-7 font-bold text-accent">{item.label}</span>
                    <span>{item.title}</span>
                  </button>
                </li>
              ))}
          </ol>
        </nav>
      )}

      <div className="glass flex max-w-full items-stretch gap-0.5 overflow-x-auto rounded-3xl p-1.5 [scrollbar-width:none] md:rounded-[2rem] md:p-2">
        {floor.stories.map((story) => (
          <button
            key={story.id}
            type="button"
            onClick={() => onSelectStory(story.id)}
            className="relative flex w-13 shrink-0 flex-col items-center gap-1 rounded-2xl px-0.5 py-2 text-[11px] font-medium leading-tight transition-colors hover:bg-white/10 md:w-22 md:px-1 md:text-[13px]"
          >
            <Icon name={story.icon} />
            <span className="text-center">{story.name}</span>
            {!seen.has(story.id) && (
              <span aria-hidden className="absolute right-3 top-1.5 size-2 rounded-full bg-accent" />
            )}
            <span className="sr-only">{seen.has(story.id) ? "(봤음)" : "(안 봤음)"}</span>
          </button>
        ))}

        {floor.stories.length > 0 && <span aria-hidden className="my-2 w-px shrink-0 md:mx-1 bg-white/15" />}

        {next && (
          <button
            type="button"
            onClick={() => move(currentIndex + 1)}
            className={`flex w-15 shrink-0 flex-col items-center gap-1 rounded-2xl px-0.5 py-2 text-[11px] font-bold leading-tight transition-colors md:w-22 md:px-1 md:text-[13px] ${
              allSeen ? "bg-accent text-background" : "text-accent hover:bg-white/10"
            }`}
          >
            <Icon name="stairs" />
            <span className="text-center">{next.label}로 올라가기</span>
          </button>
        )}
        <button
          type="button"
          aria-expanded={listOpen}
          onClick={() => setListOpen((open) => !open)}
          className="flex w-11 shrink-0 flex-col items-center gap-1 rounded-2xl px-0.5 py-2 text-[11px] font-medium leading-tight transition-colors hover:bg-white/10 md:w-16 md:px-1 md:text-[13px]"
        >
          <Icon name="list" />
          <span>층 목록</span>
        </button>
      </div>
    </div>
  );
}
