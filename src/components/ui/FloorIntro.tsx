"use client";

import { useEffect, useRef } from "react";
import { CONTACT_EMAIL, type Floor, floors } from "@/data/floors";

type Props = {
  floor: Floor;
  floorIndex: number;
  onClose: () => void;
};

// 층에 처음 도착하면 화면 가운데 뜨는 소개 카드.
// 이 층에서 무엇을 했고 무엇을 얻었는지 먼저 읽고, 닫으면 3D 공간을 둘러봅니다
export default function FloorIntro({ floor, floorIndex, onClose }: Props) {
  const startRef = useRef<HTMLButtonElement>(null);
  const last = floorIndex === floors.length - 1;

  useEffect(() => {
    startRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="intro-backdrop absolute inset-0 z-20 flex items-center justify-center bg-background/45 p-3 md:p-6" onClick={onClose}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="floor-intro-title"
        onClick={(event) => event.stopPropagation()}
        className="intro-in glass-strong max-h-[calc(100svh-1.5rem)] w-full max-w-xl overflow-y-auto rounded-3xl p-6 md:p-8"
      >
        {/* 진행률: 다섯 층 중 어디쯤인지 */}
        <div className="flex items-center gap-2">
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
          <p className="shrink-0 text-xs font-medium text-muted">
            {floorIndex + 1} / {floors.length}층
          </p>
        </div>

        <p className="mt-6 text-sm font-bold">
          <span className="text-accent">{floor.label}</span>
          <span className="ml-2 font-medium text-muted">{floor.era}</span>
          {floor.draft && <span className="ml-2 text-xs font-medium text-accent/80">임시 문구</span>}
        </p>
        <h2 id="floor-intro-title" className="mt-1.5 text-2xl font-bold leading-snug md:text-3xl">
          {floor.title}
        </h2>
        {floor.company && <p className="mt-1 text-sm font-semibold text-[#a9c2ff]">{floor.company}</p>}

        <ul className="mt-5 space-y-2 leading-relaxed md:text-[17px]">
          {floor.summary.map((line) => (
            <li key={line} className="flex gap-2.5">
              <span aria-hidden className="mt-[0.65em] size-1.5 shrink-0 rounded-full bg-foreground/60" />
              <span>{line}</span>
            </li>
          ))}
        </ul>

        <p className="mt-5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5 rounded-2xl bg-accent/15 px-4 py-2.5 text-sm font-bold text-accent">
          <span className="tracking-wide">{last ? "NEXT" : "LEVEL UP"}</span>
          <span className="font-semibold text-foreground">{floor.levelUp}</span>
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted">{floor.tools.join(" · ")}</p>

        <div className="mt-7 flex flex-wrap items-center gap-2">
          <button
            ref={startRef}
            type="button"
            onClick={onClose}
            className="rounded-full bg-accent px-6 py-3 font-semibold text-background transition-opacity hover:opacity-85"
          >
            {floor.stories.length > 0 ? "이 층 둘러보기" : "둘러보기"}
          </button>
          {last && (
            <>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="rounded-full border border-white/25 px-5 py-3 text-sm font-medium hover:bg-white/10"
              >
                이메일 보내기
              </a>
              <a href="/read" className="rounded-full px-4 py-3 text-sm font-medium text-muted hover:text-foreground">
                전체 이야기 글로 읽기
              </a>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
