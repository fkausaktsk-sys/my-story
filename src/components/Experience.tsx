"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import Dock from "@/components/ui/Dock";
import FloorHeader from "@/components/ui/FloorHeader";
import FloorIntro from "@/components/ui/FloorIntro";
import Guide, { type GuideAction } from "@/components/ui/Guide";
import StoryCard from "@/components/ui/StoryCard";
import { CONTACT_EMAIL, floors, type Story } from "@/data/floors";
import { sound } from "@/lib/sound";

// 3D 코드는 무거워서 브라우저에서만, 첫 화면 뒤에 불러옵니다
const Scene = dynamic(() => import("@/components/building/Scene"), { ssr: false });

// 렌더링마다 불리므로 결과를 저장합니다. 컨텍스트는 개수 제한이 있어 확인 후 바로 해제합니다
let webglSupport: boolean | null = null;
const canUseWebGL = () => {
  if (webglSupport !== null) return webglSupport;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    webglSupport = Boolean(gl);
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    webglSupport = false;
  }
  return webglSupport;
};
const subscribeNothing = () => () => {};

// 체험 전체 상태: 시작 여부, 현재 층, 이동 중 여부, 열린 일화, 본 일화
export default function Experience() {
  const [started, setStarted] = useState(false);
  const [floorIndex, setFloorIndex] = useState(0);
  const [moving, setMoving] = useState(false);
  const [openStoryId, setOpenStoryId] = useState<string | null>(null);
  const [seen, setSeen] = useState<ReadonlySet<string>>(() => new Set());
  const [contextLost, setContextLost] = useState(false);
  const [rotated, setRotated] = useState(false);
  const [viewResetKey, setViewResetKey] = useState(0);
  // 층 소개 카드는 새 층에 도착할 때마다 먼저 보여 줍니다
  const [introOpen, setIntroOpen] = useState(true);
  const [soundOn, setSoundOn] = useState(true);
  const webgl = useSyncExternalStore(subscribeNothing, canUseWebGL, () => true);

  const floor = floors[floorIndex];
  const openStory = useMemo(
    () => floor.stories.find((story) => story.id === openStoryId) ?? null,
    [floor, openStoryId],
  );

  const selectStory = useCallback((id: string) => {
    sound.open();
    setOpenStoryId(id);
    setSeen((prev) => new Set(prev).add(id));
  }, []);
  const closeStory = useCallback(() => setOpenStoryId(null), []);
  const arrive = useCallback(() => {
    setMoving(false);
    sound.arrive();
  }, []);
  // 들어가기를 누른 순간에만 소리를 켤 수 있습니다(브라우저 정책)
  const enter = () => {
    setSoundOn(sound.start());
    setStarted(true);
  };
  const toggleSound = () => {
    const next = !soundOn;
    sound.setEnabled(next);
    setSoundOn(next);
  };
  const loseContext = useCallback(() => setContextLost(true), []);
  const changeRotated = useCallback((next: boolean) => setRotated(next), []);
  const closeIntro = useCallback(() => setIntroOpen(false), []);
  const openIntro = () => {
    setOpenStoryId(null);
    setIntroOpen(true);
  };
  const resetView = () => {
    setRotated(false);
    setViewResetKey((key) => key + 1);
  };

  const moveTo = (index: number) => {
    if (moving || index === floorIndex) return;
    setOpenStoryId(null);
    setMoving(true);
    setFloorIndex(index);
    setIntroOpen(true);
  };

  // ---------- 다음 행동 안내 ----------
  // 수동적인 유저도 멈추지 않도록, 지금 할 일을 항상 하나만 골라 보여 줍니다
  const nextFloor = floors[floorIndex + 1];
  const unseen = floor.stories.filter((story) => !seen.has(story.id));
  const seenCount = floor.stories.length - unseen.length;
  const hintId = unseen[0]?.id ?? null;
  const goUp: GuideAction | undefined = nextFloor
    ? { label: `${nextFloor.label}로 올라가기`, onClick: () => moveTo(floorIndex + 1) }
    : undefined;

  let guide: { message: string; sub?: string; action?: GuideAction; secondary?: GuideAction };
  if (!nextFloor) {
    guide = {
      message: "끝까지 올라와 주셔서 감사합니다.",
      sub: "다음 층을 함께 지을 이야기를 기다리고 있어요.",
      action: { label: "이메일 보내기", href: `mailto:${CONTACT_EMAIL}` },
    };
  } else if (unseen.length === floor.stories.length && unseen[0]) {
    guide = {
      message: `${unseen[0].name}부터 볼까요?`,
      sub:
        seen.size === 0
          ? "반짝이는 ◆나 아래 버튼을 눌러도 돼요. 화면을 드래그하면 둘러볼 수 있어요."
          : `이 층에는 이야기가 ${floor.stories.length}개 있어요.`,
      action: { label: "이야기 보기", onClick: () => selectStory(unseen[0].id) },
      secondary: goUp && { ...goUp, label: `${nextFloor.label}로 바로 가기` },
    };
  } else if (unseen[0]) {
    guide = {
      message: `이 층 이야기가 ${unseen.length}개 남았어요.`,
      sub: `다음은 '${unseen[0].name}'이에요.`,
      action: { label: "다음 이야기", onClick: () => selectStory(unseen[0].id) },
      secondary: goUp,
    };
  } else {
    guide = {
      message: `${nextFloor.label}로 올라가 볼까요?`,
      sub: `${nextFloor.era} · ${nextFloor.title}`,
      action: goUp,
    };
  }

  // 일화 카드 아래의 다음 행동: 이 층의 남은 이야기, 다 봤으면 다음 층
  let cardNext: { label: string; onClick: () => void } | undefined;
  if (openStory) {
    const index = floor.stories.indexOf(openStory);
    const remaining: Story | undefined =
      floor.stories.slice(index + 1).find((story) => !seen.has(story.id)) ??
      floor.stories.find((story) => !seen.has(story.id));
    if (remaining) cardNext = { label: `다음 이야기 · ${remaining.name}`, onClick: () => selectStory(remaining.id) };
    else if (goUp?.onClick) cardNext = { label: `${nextFloor.label}로 올라가기`, onClick: goUp.onClick };
  }

  if (!webgl || contextLost) {
    return (
      <main className="flex min-h-svh flex-col items-start justify-center gap-6 px-6 md:px-16">
        <h1 className="text-3xl font-bold">3D 빌딩을 표시할 수 없습니다.</h1>
        <p className="text-muted">같은 이야기를 글로 읽으실 수 있습니다.</p>
        <Link href="/read" className="rounded-full bg-accent px-6 py-3 font-semibold text-background">
          글로 읽기
        </Link>
      </main>
    );
  }

  return (
    <main className="relative h-svh w-full overflow-hidden">
      <div className="absolute inset-0">
        <Scene
          started={started}
          floorIndex={floorIndex}
          moving={moving}
          seen={seen}
          activeStoryId={openStoryId}
          hintId={moving ? null : hintId}
          onSelectStory={selectStory}
          onArrive={arrive}
          onContextLost={loseContext}
          viewResetKey={viewResetKey}
          onRotatedChange={changeRotated}
        />
      </div>

      {!started && (
        <div className="absolute inset-0 flex flex-col justify-center bg-gradient-to-r from-background/90 via-background/25 to-transparent px-6 md:px-16">
          <p className="text-sm font-medium text-accent">Saetbyul Kim · 15년의 UI 디자인 여정</p>
          <h1 className="mt-5 max-w-xl text-4xl font-bold leading-[1.2] tracking-tight md:text-6xl">
            그때 우리는
            <br />
            table로 화면을
            <br />
            그렸습니다.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
            2010년 table 코딩부터 AI와 일하는 지금까지, 다섯 층을 계단으로 올라갑니다. 끝까지 3분이면 충분합니다.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={enter}
              className="rounded-full bg-accent px-7 py-3.5 font-semibold text-background transition-opacity hover:opacity-85"
            >
              그때로 들어가기
            </button>
            <Link href="/read" className="glass rounded-full px-7 py-3.5 font-medium">
              글로 읽기
            </Link>
          </div>
        </div>
      )}

      {started && (
        <>
          {/* 소개 카드가 떠 있는 동안에는 작은 층 표시를 숨겨 같은 정보가 겹치지 않게 합니다 */}
          {!(introOpen && !moving) && (
            <FloorHeader floor={floor} floorIndex={floorIndex} seenCount={seenCount} onOpenIntro={openIntro} />
          )}
          <Link
            href="/read"
            className="glass absolute right-3 top-3 rounded-full px-4 py-2.5 text-sm font-medium md:right-6 md:top-6 md:px-5 md:py-3"
          >
            글로 읽기
          </Link>
          <button
            type="button"
            onClick={toggleSound}
            aria-pressed={soundOn}
            aria-label={soundOn ? "소리 끄기" : "소리 켜기"}
            className="glass absolute right-3 top-16 flex size-[2.625rem] items-center justify-center rounded-full md:right-[8.5rem] md:top-6 md:size-12"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-5">
              <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
              {soundOn ? (
                <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" />
              ) : (
                <path d="M16 9.5l5 5M21 9.5l-5 5" />
              )}
            </svg>
          </button>
          {rotated && (
            <button
              type="button"
              onClick={resetView}
              className="glass absolute right-3 top-29 rounded-full px-4 py-2.5 text-sm font-medium md:right-6 md:top-22 md:px-5 md:py-3"
            >
              원래 시점
            </button>
          )}
          {!moving && !openStory && !introOpen && <Guide {...guide} />}
          <Dock
            currentIndex={floorIndex}
            moving={moving}
            seen={seen}
            hintId={hintId}
            onMove={moveTo}
            onSelectStory={selectStory}
          />
          {openStory && <StoryCard key={openStory.id} story={openStory} onClose={closeStory} next={cardNext} />}
          {/* 계단을 다 올라 도착한 뒤에 층 소개를 띄웁니다 */}
          {introOpen && !moving && (
            <FloorIntro key={floor.id} floor={floor} floorIndex={floorIndex} onClose={closeIntro} />
          )}
        </>
      )}
    </main>
  );
}
