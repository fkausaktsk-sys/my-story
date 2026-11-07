import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL, floors } from "@/data/floors";

export const metadata: Metadata = { title: "글로 읽기 | Saetbyul Kim" };

// 3D 없이 같은 이야기를 바로 읽는 자기소개서 버전
export default function ReadPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16 md:py-24">
      <Link href="/" className="text-sm text-muted hover:text-foreground">
        ← 빌딩으로 돌아가기
      </Link>
      <h1 className="mt-10 text-4xl font-bold leading-tight tracking-tight md:text-5xl">그때 우리는 table로 화면을 그렸습니다</h1>
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
            {floor.company && <p className="mt-1 text-sm font-semibold text-[#a9c2ff]">{floor.company}</p>}
            <ul className="mt-4 space-y-1.5 leading-relaxed">
              {floor.summary.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <p className="mt-3 text-sm font-semibold text-accent">LEVEL UP · {floor.levelUp}</p>
            <p className="mt-2 text-sm text-muted">{floor.tools.join(" · ")}</p>
            {floor.stories.map((story) => (
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
                {story.items?.map((item) => (
                  <div key={item.title} className="mt-4 border-l border-white/15 pl-4">
                    <p className="font-medium">{item.title}</p>
                    {item.then.map((line) => (
                      <p key={line} className="mt-1 leading-relaxed">
                        {line}
                      </p>
                    ))}
                    <p className="mt-1 leading-relaxed text-muted">지금은, {item.now}</p>
                  </div>
                ))}
                <p className="mt-2 leading-relaxed text-muted">지금은, {story.now}</p>
              </section>
            ))}
          </li>
        ))}
      </ol>

      <p className="mt-20 text-lg font-semibold">1층부터 직접 올라왔습니다. 다음 층은 함께 짓고 싶습니다.</p>
      <a
        href={`mailto:${CONTACT_EMAIL}`}
        className="mt-6 inline-block rounded-full bg-accent px-6 py-3 font-semibold text-background"
      >
        이메일 보내기
      </a>
    </main>
  );
}
