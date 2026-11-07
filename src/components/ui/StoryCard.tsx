"use client";

import { useEffect, useRef } from "react";
import type { Story } from "@/data/floors";

type Props = {
  story: Story;
  onClose: () => void;
};

// 일화 카드: 그때의 기억과 지금을 나란히 보여 줍니다
export default function StoryCard({ story, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <section
      role="dialog"
      aria-label={story.title}
      className="glass-strong absolute inset-x-3 bottom-3 z-10 max-h-[78svh] overflow-y-auto rounded-3xl p-6 md:inset-x-auto md:bottom-auto md:left-6 md:top-28 md:max-h-[calc(100svh-9rem)] md:w-[26rem]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted">
            {story.name}
            {story.draft && <span className="ml-2 text-xs text-accent">임시 문구</span>}
          </p>
          <h3 className="mt-1 text-2xl font-bold leading-snug">{story.title}</h3>
        </div>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="flex size-10 shrink-0 items-center justify-center rounded-full text-xl text-muted hover:bg-white/10 hover:text-foreground"
        >
          ×
        </button>
      </div>

      <div className="mt-5">
        <p className="text-xs font-bold tracking-wide text-accent">그때</p>
        <div className="mt-2 space-y-2 leading-relaxed">
          {story.then.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        {story.relic && (
          <pre className="mt-3 overflow-x-auto rounded-xl bg-black/45 p-3 font-mono text-[13px] leading-relaxed text-[#74f0a2]">
            {story.relic}
          </pre>
        )}
      </div>

      {story.items && (
        <ol className="mt-5 space-y-4 border-t border-white/15 pt-4">
          {story.items.map((item) => (
            <li key={item.title}>
              <p className="font-semibold">{item.title}</p>
              {item.then.map((line) => (
                <p key={line} className="mt-1 text-[15px] leading-relaxed">
                  {line}
                </p>
              ))}
              <p className="mt-1 text-sm leading-relaxed text-muted">{item.now}</p>
            </li>
          ))}
        </ol>
      )}

      <div className="mt-5 border-t border-white/15 pt-4">
        <p className="text-xs font-bold tracking-wide text-[#a9c2ff]">지금</p>
        <p className="mt-2 leading-relaxed text-muted">{story.now}</p>
      </div>
    </section>
  );
}
