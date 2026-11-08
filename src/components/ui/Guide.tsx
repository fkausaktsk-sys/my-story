"use client";

import { useEffect, useState } from "react";

export type GuideAction = { label: string; onClick?: () => void; href?: string };

type Props = {
  message: string;
  sub?: string;
  action?: GuideAction;
  secondary?: GuideAction;
};

// 가만히 있으면 말풍선이 살짝 흔들려 다음 행동을 알려 줍니다
const IDLE_MS = 7000;

function ActionButton({ action, primary }: { action: GuideAction; primary: boolean }) {
  const className = primary
    ? "shrink-0 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-85"
    : "shrink-0 rounded-full px-3 py-2 text-xs font-medium text-muted underline-offset-4 hover:text-foreground hover:underline";
  if (action.href) {
    return (
      <a href={action.href} className={className}>
        {action.label}
      </a>
    );
  }
  return (
    <button type="button" onClick={action.onClick} className={className}>
      {action.label}
    </button>
  );
}

// 지금 무엇을 하면 되는지 하나만 알려 주는 샛별의 말풍선
export default function Guide({ message, sub, action, secondary }: Props) {
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    let timer = window.setTimeout(() => setIdle(true), IDLE_MS);
    const wake = () => {
      setIdle(false);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setIdle(true), IDLE_MS);
    };
    window.addEventListener("pointerdown", wake);
    window.addEventListener("keydown", wake);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pointerdown", wake);
      window.removeEventListener("keydown", wake);
    };
  }, [message]);

  return (
    <div className="absolute bottom-40 left-1/2 w-[min(34rem,calc(100vw-1.5rem))] -translate-x-1/2 md:bottom-32">
      <div
        key={message}
        role="status"
        className={`guide-in glass flex items-center gap-3 rounded-2xl px-3 py-2.5 md:px-4 ${idle ? "guide-nudge" : ""}`}
      >
      <span
        aria-hidden
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#e0795a] text-[11px] font-bold text-white"
      >
        샛별
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold leading-snug">{message}</p>
        {sub && <p className="mt-0.5 text-xs leading-snug text-muted">{sub}</p>}
      </div>
      <div className="flex shrink-0 flex-col items-end gap-0.5 md:flex-row md:items-center md:gap-1">
        {action && <ActionButton action={action} primary />}
        {secondary && <ActionButton action={secondary} primary={false} />}
      </div>
      </div>
    </div>
  );
}
