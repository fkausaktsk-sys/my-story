import type { Metadata } from "next";
import Link from "next/link";
import { floors } from "@/data/floors";

export const metadata: Metadata = { title: "글로 읽기 | Saetbyul Kim" };

// 3D 없이 같은 이야기를 바로 읽는 자기소개서 버전
export default function ReadPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16 md:py-24">
      <Link href="/" className="text-sm text-muted hover:text-foreground">
        ← 빌딩으로 돌아가기
      </Link>
      <h1 className="mt-10 text-4xl font-bold leading-tight tracking-tight md:text-5xl">그때 우리는 표로 화면을 그렸습니다</h1>
      <p className="mt-6 text-lg leading-relaxed text-muted">
        2010년 table 코딩부터 div, 포토샵, 피그마를 거쳐 AI로 작업하는 지금까지, 한 층씩 올라온 이야기입니다.
      </p>

      <ol className="mt-16 space-y-16">
        {floors.map((floor) => (
          <li key={floor.id}>
            <p className="text-sm font-medium text-accent">
              {floor.label} · {floor.era}
            </p>
            <h2 className="mt-2 text-2xl font-semibold">{floor.title}</h2>
            <p className="mt-2 text-sm text-muted">{floor.tools.join(" · ")}</p>
            {floor.stories.length === 0 ? (
              <p className="mt-4 text-muted">이 층의 이야기는 준비 중입니다.</p>
            ) : (
              floor.stories.map((story) => (
                <section key={story.id} className="mt-8">
                  <h3 className="font-semibold">
                    {story.title}
                    {story.draft && <span className="ml-2 text-xs font-normal text-accent">임시 문구</span>}
                  </h3>
                  {story.then.map((line) => (
                    <p key={line} className="mt-2 leading-relaxed">
                      {line}
                    </p>
                  ))}
                  <p className="mt-2 leading-relaxed text-muted">지금은, {story.now}</p>
                </section>
              ))
            )}
          </li>
        ))}
      </ol>
    </main>
  );
}
