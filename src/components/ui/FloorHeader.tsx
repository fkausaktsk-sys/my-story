"use client";

import { CONTACT_EMAIL, type Floor, floors } from "@/data/floors";

type Props = {
  floor: Floor;
  floorIndex: number;
  // 이 층에서 본 이야기 수
  seenCount: number;
  // 일화 카드가 열려 있으면 요약을 접어 카드와 겹치지 않게 합니다
  compact: boolean;
  open: boolean;
  onToggle: () => void;
};

// 층에 들어서면 상단에 보이는 이 층의 핵심 요약.
// 일화를 하나도 열지 않아도 이 층에서 무엇을 했고 무엇을 얻었는지 알 수 있게 합니다
export default function FloorHeader({ floor, floorIndex, seenCount, compact, open, onToggle }: Props) {
  const expanded = open && !compact;
  const last = floor.id === floors[floors.length - 1].id;

  return (
    <header className="glass absolute left-3 top-3 max-w-[calc(100vw-7.5rem)] rounded-2xl px-4 py-3 md:left-6 md:top-6 md:max-w-lg md:rounded-3xl md:px-6 md:py-4">
      {/* 진행률: 다섯 층 중 어디쯤인지, 이 층의 이야기를 몇 개 봤는지 */}
      <div className="mb-2 flex items-center gap-2">
        <div aria-hidden className="flex flex-1 gap-1">
          {floors.map((item, index) => (
            <span
              key={item.id}
              className={`h-1 flex-1 rounded-full ${
                index < floorIndex ? "bg-accent/60" : index === floorIndex ? "bg-accent" : "bg-white/15"
              }`}
            />
          ))}
        </div>
        <p className="shrink-0 text-[11px] font-medium text-muted">
          {floorIndex + 1} / {floors.length}층
          {floor.stories.length > 0 && ` · 이야기 ${seenCount} / ${floor.stories.length}`}
        </p>
      </div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold">
            <span className="text-accent">{floor.label}</span>
            <span className="ml-2 font-medium text-muted">{floor.era}</span>
            {floor.draft && <span className="ml-2 text-[11px] font-medium text-accent/80">임시 문구</span>}
          </p>
          <h2 className="mt-0.5 text-base font-bold md:text-lg">{floor.title}</h2>
          {floor.company && <p className="mt-0.5 text-xs font-semibold text-[#a9c2ff] md:text-sm">{floor.company}</p>}
        </div>
        {!compact && (
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            className="-mr-1 shrink-0 rounded-full px-2.5 py-1 text-xs font-medium text-muted hover:bg-white/10 hover:text-foreground"
          >
            {open ? "접기" : "요약"}
          </button>
        )}
      </div>

      {expanded && (
        <>
          <ul className="mt-2.5 space-y-1.5 text-[13px] leading-relaxed md:text-sm">
            {floor.summary.map((line) => (
              <li key={line} className="flex gap-2">
                <span aria-hidden className="mt-[0.6em] size-1 shrink-0 rounded-full bg-foreground/60" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 inline-flex flex-wrap items-baseline gap-x-2 rounded-xl bg-accent/15 px-3 py-1.5 text-xs font-bold text-accent md:text-[13px]">
            <span className="tracking-wide">{last ? "NEXT" : "LEVEL UP"}</span>
            <span className="font-semibold text-foreground">{floor.levelUp}</span>
          </p>
          <p className="mt-2 text-xs leading-relaxed text-muted">{floor.tools.join(" · ")}</p>
          {last && (
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-85"
              >
                이메일 보내기
              </a>
              <a href="/read" className="rounded-full border border-white/25 px-4 py-2 text-sm font-medium hover:bg-white/10">
                전체 이야기 글로 읽기
              </a>
            </div>
          )}
        </>
      )}
    </header>
  );
}
