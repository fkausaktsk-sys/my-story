import type { IconName } from "@/data/floors";

type Name = IconName | "stairs" | "list";

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
  stairs: <path d="M3 20h5v-5h5v-5h5V5h3" />,
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
