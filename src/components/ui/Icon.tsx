import type { IconName } from "@/data/floors";

type Name = IconName | "stairs" | "stairs-down" | "list";

// 선 아이콘: 외부 아이콘 라이브러리 없이 필요한 것만 그립니다
const PATHS: Record<Name, React.ReactNode> = {
  monitor: (
    <>
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M9 21h6M12 17v4" />
    </>
  ),
  pin: (
    <>
      <path d="M9 3h6l-1 6 3 3v2H7v-2l3-3z" />
      <path d="M12 14v7" />
    </>
  ),
  books: (
    <>
      <path d="M4 4h4v16H4zM10 4h4v16h-4z" />
      <path d="m16.5 5 3.5 1-3.5 14-3-1" />
    </>
  ),
  pen: (
    <>
      <path d="m12 3 6 10-6 8-6-8z" />
      <circle cx="12" cy="12" r="1.5" />
      <path d="M12 3v7.5" />
    </>
  ),
  slice: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="1" />
      <path d="M4 9h16M4 15h16M12 15v6" strokeDasharray="3 2" />
    </>
  ),
  folder: <path d="M3 6a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />,
  banner: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="1.5" />
      <path d="M7 10h6M7 14h3M2 21h20" />
    </>
  ),
  box: (
    <>
      <path d="M4 4h6v6H4zM4 14h6v6H4zM14 14h6v6h-6z" />
      <path d="m15 3 6 2-2 6-6-2z" />
    </>
  ),
  poster: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="1" />
      <path d="M8 8h8M8 12h8M8 16h4" />
    </>
  ),
  flash: <path d="m13 2-8 12h6l-1 8 9-13h-6z" />,
  ruler: (
    <>
      <rect x="2" y="8" width="20" height="8" rx="1" />
      <path d="M7 8v3M12 8v4M17 8v3" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 6v6" />
    </>
  ),
  note: (
    <>
      <path d="M4 4h16v11l-5 5H4z" />
      <path d="M15 20v-5h5" />
    </>
  ),
  tablet: (
    <>
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path d="M11 18h2" />
    </>
  ),
  drawer: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="1" />
      <path d="M4 12h16M10 7.5h4M10 16.5h4" />
    </>
  ),
  spark: <path d="M12 3c1 5 3 7 8 9-5 1-7 3-8 9-1-6-3-8-8-9 5-2 7-4 8-9z" />,
  screen: (
    <>
      <rect x="2" y="4" width="20" height="13" rx="1.5" />
      <path d="M2 8h20M8 21h8" />
    </>
  ),
  layers: <path d="m12 3 9 5-9 5-9-5zM3 13l9 5 9-5" />,
  terminal: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="m7 9 3 3-3 3M12 15h5" />
    </>
  ),
  stairs: <path d="M3 20h5v-5h5v-5h5V5h3" />,
  "stairs-down": <path d="M3 5h3v5h5v5h5v5h5" />,
  list: <path d="M4 6h16M4 12h16M4 18h16" />,
};

export default function Icon({ name, className = "size-6" }: { name: Name; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      {PATHS[name]}
    </svg>
  );
}
