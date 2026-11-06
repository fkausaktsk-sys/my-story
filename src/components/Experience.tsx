"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import Dock from "@/components/ui/Dock";
import StoryCard from "@/components/ui/StoryCard";
import { floors } from "@/data/floors";

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
  const [hasRotated, setHasRotated] = useState(false);
  const [viewResetKey, setViewResetKey] = useState(0);
  const webgl = useSyncExternalStore(subscribeNothing, canUseWebGL, () => true);

  const floor = floors[floorIndex];
  const openStory = useMemo(
    () => floor.stories.find((story) => story.id === openStoryId) ?? null,
    [floor, openStoryId],
  );

  const selectStory = useCallback((id: string) => {
    setOpenStoryId(id);
    setSeen((prev) => new Set(prev).add(id));
  }, []);
  const closeStory = useCallback(() => setOpenStoryId(null), []);
  const arrive = useCallback(() => setMoving(false), []);
  const loseContext = useCallback(() => setContextLost(true), []);
  const changeRotated = useCallback((next: boolean) => {
    setRotated(next);
    if (next) setHasRotated(true);
  }, []);
  const resetView = () => {
    setRotated(false);
    setViewResetKey((key) => key + 1);
  };

  const moveTo = (index: number) => {
    if (moving || index === floorIndex) return;
    setOpenStoryId(null);
    setMoving(true);
    setFloorIndex(index);
  };

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
          onSelectStory={selectStory}
          onArrive={arrive}
          onContextLost={loseContext}
          viewResetKey={viewResetKey}
          onRotatedChange={changeRotated}
        />
      </div>

      {!started && (
        <div className="absolute inset-0 flex flex-col justify-center bg-gradient-to-r from-background/90 via-background/25 to-transparent px-6 md:px-16">
          <p className="text-sm font-medium text-accent">Saetbyul Kim · 15년의 웹 변천사</p>
          <h1 className="mt-5 max-w-xl text-4xl font-bold leading-[1.2] tracking-tight md:text-6xl">
            그때 우리는
            <br />
            표로 화면을
            <br />
            그렸습니다.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
            2010년 지하 작업실에서 계단을 따라 지금까지. 끝까지 3~5분이면 충분합니다.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setStarted(true)}
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
          <header className="glass absolute left-3 top-3 max-w-[calc(100vw-7.5rem)] rounded-2xl px-4 py-2.5 md:left-6 md:top-6 md:max-w-md md:rounded-3xl md:px-6 md:py-3">
            <p className="text-sm font-bold">
              <span className="text-accent">{floor.label}</span>
              <span className="ml-2 font-medium text-muted">{floor.era}</span>
            </p>
            <h2 className="mt-0.5 text-sm font-medium md:text-base">{floor.title}</h2>
            <p className="mt-1 text-xs leading-relaxed text-muted md:text-sm">{floor.tools.join(" · ")}</p>
          </header>
          <Link
            href="/read"
            className="glass absolute right-3 top-3 rounded-full px-4 py-2.5 text-sm font-medium md:right-6 md:top-6 md:px-5 md:py-3"
          >
            글로 읽기
          </Link>
          {rotated && (
            <button
              type="button"
              onClick={resetView}
              className="glass absolute right-3 top-16 rounded-full px-4 py-2.5 text-sm font-medium md:right-6 md:top-22 md:px-5 md:py-3"
            >
              원래 시점
            </button>
          )}
          {!hasRotated && !moving && !openStory && (
            <p className="glass pointer-events-none absolute bottom-29 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium md:bottom-32">
              드래그해서 둘러보기
            </p>
          )}
          <Dock
            currentIndex={floorIndex}
            moving={moving}
            seen={seen}
            onMove={moveTo}
            onSelectStory={selectStory}
          />
          {openStory && <StoryCard story={openStory} onClose={closeStory} />}
        </>
      )}
    </main>
  );
}
