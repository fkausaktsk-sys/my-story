"use client";

import { ColorChips, Cup, MiniFan, Poster, RollBanner, ToolIcon } from "@/components/building/decor";
import type { FloorSceneProps } from "@/components/building/floors/types";
import { Chair, Desk, Monitor } from "@/components/building/furniture";
import Hotspot from "@/components/building/Hotspot";
import { Block, useCanvasTexture } from "@/components/building/parts";

// 3F · 2017~2018: 카카오경기센터의 관공서 캠페인을 디자인하던 사무실.
// 캠페인 그래픽은 원본 이미지를 쓰지 않고 분위기만 직접 그렸습니다

type Campaign = { org: string; title: [string, string]; from: string; to: string; ink: string };

const CAMPAIGNS: Campaign[] = [
  { org: "서울시", title: ["내일연구소 서울", "2017년 10대 뉴스"], from: "#cfe9ff", to: "#f6c2e2", ink: "#3446b8" },
  { org: "경기도청", title: ["누구나 알기 쉬운", "경기도 사용설명서"], from: "#ffffff", to: "#f7a640", ink: "#1f4f9c" },
  { org: "한국사회적기업진흥원", title: ["함께한 10년", "함께할 100년"], from: "#d8f1c8", to: "#74c35e", ink: "#1f5a2e" },
  { org: "한국관광공사", title: ["관광씨앗,", "함께 심다"], from: "#a9dcff", to: "#86d25a", ink: "#c2372b" },
  { org: "한국도자재단", title: ["2017", "G-세라믹페어"], from: "#fff4a8", to: "#ffc8e2", ink: "#d1337f" },
];

// 캠페인 한 건의 액자
function CampaignPoster({ campaign, x }: { campaign: Campaign; x: number }) {
  const texture = useCanvasTexture(360, 250, (ctx) => {
    const gradient = ctx.createLinearGradient(0, 0, 360, 250);
    gradient.addColorStop(0, campaign.from);
    gradient.addColorStop(1, campaign.to);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 360, 250);
    // 위쪽 제휴 띠
    ctx.fillStyle = "rgba(20, 30, 60, 0.78)";
    ctx.fillRect(0, 0, 360, 34);
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 18px Pretendard, sans-serif";
    ctx.fillText(campaign.org, 14, 23);
    ctx.fillStyle = campaign.ink;
    ctx.font = "800 34px Pretendard, sans-serif";
    ctx.fillText(campaign.title[0], 18, 100);
    ctx.fillText(campaign.title[1], 18, 146);
    // 참여 버튼
    ctx.fillStyle = campaign.ink;
    ctx.fillRect(18, 184, 130, 40);
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 19px Pretendard, sans-serif";
    ctx.fillText("참여하기", 44, 211);
  });
  return (
    <group position={[x, 2.05, -4.27]}>
      <Block size={[1.18, 0.84, 0.05]} position={[0, 0, 0]} color="#1c1b22" />
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[1.1, 0.76]} />
        <meshStandardMaterial map={texture} roughness={0.75} />
      </mesh>
    </group>
  );
}

// 벽에 붙인 회사 표지. 로고 없이 글자만 씁니다
function KakaoCenterSign() {
  const texture = useCanvasTexture(900, 140, (ctx) => {
    ctx.fillStyle = "#fee500";
    ctx.fillRect(0, 0, 900, 140);
    ctx.fillStyle = "#191919";
    ctx.font = "800 58px Pretendard, sans-serif";
    ctx.fillText("카카오경기센터", 36, 90);
    ctx.font = "600 36px Pretendard, sans-serif";
    ctx.fillText("관공서 캠페인 디자인", 470, 88);
  });
  return (
    <group position={[-2.8, 3.05, -4.27]}>
      <Block size={[3.7, 0.6, 0.05]} position={[0, 0, 0]} color="#191919" />
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[3.6, 0.56]} />
        <meshStandardMaterial map={texture} emissiveMap={texture} emissive="#ffffff" emissiveIntensity={0.25} />
      </mesh>
    </group>
  );
}

// 자정을 가리키는 벽시계
function MidnightClock() {
  const texture = useCanvasTexture(256, 256, (ctx) => {
    ctx.fillStyle = "#f7f4ea";
    ctx.beginPath();
    ctx.arc(128, 128, 124, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#2a2730";
    ctx.font = "700 34px Pretendard, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("12", 128, 52);
    ctx.fillText("6", 128, 232);
    ctx.fillText("3", 222, 140);
    ctx.fillText("9", 34, 140);
    ctx.fillRect(122, 62, 12, 70);
    ctx.fillRect(124, 42 + 20, 8, 70);
    ctx.fillStyle = "#e5484d";
    ctx.beginPath();
    ctx.arc(128, 128, 9, 0, Math.PI * 2);
    ctx.fill();
  });
  return (
    <group position={[-6.37, 2.55, 0.85]} rotation={[0, Math.PI / 2, 0]}>
      <mesh position={[0, 0, -0.02]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.46, 0.46, 0.07, 32]} />
        <meshStandardMaterial color="#2c2a33" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <circleGeometry args={[0.42, 32]} />
        <meshStandardMaterial map={texture} roughness={0.8} />
      </mesh>
    </group>
  );
}

// 오픈 당일 확인 목록을 붙인 게시판
function LaunchBoard() {
  const texture = useCanvasTexture(520, 340, (ctx) => {
    ctx.fillStyle = "#39363f";
    ctx.fillRect(0, 0, 520, 340);
    const items = [
      { x: 24, y: 24, c: "#ffe680", t: ["캠페인", "오픈 D-DAY"] },
      { x: 270, y: 24, c: "#b6ecc4", t: ["00:00", "페이지 공개"] },
      { x: 24, y: 180, c: "#bcd4ff", t: ["카드뉴스", "배너 최종"] },
      { x: 270, y: 180, c: "#ffb3a7", t: ["오류 없는지", "다시 확인"] },
    ];
    items.forEach(({ x, y, c, t }) => {
      ctx.fillStyle = c;
      ctx.fillRect(x, y, 226, 136);
      ctx.fillStyle = "#26211d";
      ctx.font = "700 32px Pretendard, sans-serif";
      t.forEach((line, i) => ctx.fillText(line, x + 18, y + 58 + i * 44));
    });
  });
  return (
    <group position={[-6.35, 2.2, -1.2]} rotation={[0, Math.PI / 2, 0]}>
      <Block size={[2, 1.34, 0.07]} position={[0, 0, 0]} color="#25232b" />
      <mesh position={[0, 0, 0.045]}>
        <planeGeometry args={[1.88, 1.22]} />
        <meshStandardMaterial map={texture} roughness={0.9} />
      </mesh>
    </group>
  );
}

// 카드뉴스와 광고 배너를 붙인 벽
function CardNewsWall() {
  const texture = useCanvasTexture(600, 400, (ctx) => {
    ctx.fillStyle = "#2b2932";
    ctx.fillRect(0, 0, 600, 400);
    const tiles = [
      ["#ff7a59", "카드뉴스"],
      ["#3d7bf0", "광고 배너"],
      ["#2fb38a", "랜딩"],
      ["#f2c230", "SNS 이벤트"],
      ["#9b6ae0", "설명회"],
      ["#e5484d", "D-3"],
    ];
    tiles.forEach(([color, word], i) => {
      const x = 18 + (i % 3) * 194;
      const y = 18 + Math.floor(i / 3) * 192;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 176, 176);
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      ctx.fillRect(x + 16, y + 118, 110, 10);
      ctx.fillRect(x + 16, y + 138, 76, 10);
      ctx.fillStyle = "#ffffff";
      ctx.font = "800 30px Pretendard, sans-serif";
      ctx.fillText(word, x + 16, y + 62);
    });
  });
  return (
    <group position={[-6.35, 2.1, 2.9]} rotation={[0, Math.PI / 2, 0]}>
      <Block size={[2.1, 1.44, 0.06]} position={[0, 0, 0]} color="#1f1d24" />
      <mesh position={[0, 0, 0.04]}>
        <planeGeometry args={[2, 1.34]} />
        <meshStandardMaterial map={texture} roughness={0.85} />
      </mesh>
    </group>
  );
}

// 샛별이 맡은 캠페인 페이지 화면
function CampaignScreen() {
  const texture = useCanvasTexture(640, 400, (ctx) => {
    const gradient = ctx.createLinearGradient(0, 0, 640, 400);
    gradient.addColorStop(0, "#cfe9ff");
    gradient.addColorStop(1, "#f6c2e2");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 640, 400);
    ctx.fillStyle = "rgba(20, 30, 60, 0.78)";
    ctx.fillRect(0, 0, 640, 40);
    ctx.fillStyle = "#3446b8";
    ctx.font = "800 54px Pretendard, sans-serif";
    ctx.fillText("함께 만드는 캠페인", 42, 140);
    ctx.font = "500 28px Pretendard, sans-serif";
    ctx.fillText("참여 신청은 오늘 자정부터", 44, 192);
    ctx.fillStyle = "#3446b8";
    ctx.fillRect(44, 236, 200, 60);
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 28px Pretendard, sans-serif";
    ctx.fillText("참여하기", 88, 276);
  });
  return (
    <mesh position={[0, 0.1, 0.051]}>
      <planeGeometry args={[1.24, 0.78]} />
      <meshStandardMaterial map={texture} emissiveMap={texture} emissive="#ffffff" emissiveIntensity={0.9} />
    </mesh>
  );
}

// SNS 피드 화면을 크게 뽑은 포스터. 카드뉴스가 실제로 어떻게 보이는지 확인하던 화면입니다
function SnsFeedPoster() {
  return (
    <Poster
      position={[3.8, 2.15, -4.27]}
      size={[0.8, 1.4]}
      canvas={[320, 560]}
      frame="#111216"
      draw={(ctx) => {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 320, 560);
        ctx.fillStyle = "#f0f0f2";
        ctx.fillRect(0, 0, 320, 56);
        ctx.fillStyle = "#d4789a";
        ctx.beginPath();
        ctx.arc(32, 28, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#26232b";
        ctx.font = "700 20px Pretendard, sans-serif";
        ctx.fillText("campaign_official", 58, 35);
        const gradient = ctx.createLinearGradient(0, 56, 320, 376);
        gradient.addColorStop(0, "#cfe9ff");
        gradient.addColorStop(1, "#f6c2e2");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 56, 320, 320);
        ctx.fillStyle = "#3446b8";
        ctx.font = "800 36px Pretendard, sans-serif";
        ctx.fillText("참여 이벤트", 30, 200);
        ctx.font = "600 22px Pretendard, sans-serif";
        ctx.fillText("1/10 · 카드뉴스", 30, 240);
        ctx.fillStyle = "#e5484d";
        ctx.font = "800 30px Pretendard, sans-serif";
        ctx.fillText("♥ 1,024", 18, 420);
        ctx.fillStyle = "#26232b";
        ctx.font = "500 20px Pretendard, sans-serif";
        ctx.fillText("#캠페인 #참여이벤트 #공유", 18, 460);
        ctx.fillStyle = "#9a97a3";
        ctx.fillText("댓글 238개 모두 보기", 18, 500);
      }}
    />
  );
}

// 카드뉴스 규격 메모
function CardSizeNote() {
  return (
    <Poster
      position={[-6.36, 3.2, 2.9]}
      rotation={[0, Math.PI / 2, 0]}
      size={[1.7, 0.34]}
      canvas={[680, 136]}
      frame={null}
      draw={(ctx) => {
        ctx.fillStyle = "#ffe680";
        ctx.fillRect(0, 0, 680, 136);
        ctx.fillStyle = "#26211d";
        ctx.font = "800 44px Pretendard, sans-serif";
        ctx.fillText("카드뉴스 1080 × 1080 · 10장", 24, 86);
      }}
    />
  );
}

export default function CampaignFloor({ interactive, seen, activeStoryId, onSelectStory }: FloorSceneProps) {
  const shared = { enabled: interactive, onSelect: onSelectStory };
  const state = (id: string) => ({ id, seen: seen.has(id), active: activeStoryId === id });

  return (
    <group>
      {/* 늦게까지 남은 사무실의 책상 조명 */}
      <pointLight position={[-0.6, 2.7, -0.8]} color="#ffdcb3" intensity={20} distance={12} decay={1.7} />
      <pointLight position={[-3, 2.9, -2.6]} color="#fff1d6" intensity={12} distance={8} decay={1.6} />
      <Block size={[4.4, 0.03, 3.4]} position={[-0.6, 0.015, -0.6]} color="#4c3f55" />
      <Desk top="#6f6170" leg="#4b4250" />
      <Chair color="#33303c" />

      <Monitor x={-0.6}>
        <CampaignScreen />
      </Monitor>

      {/* 확인용 태블릿과 휴대폰 */}
      <Block size={[0.5, 0.68, 0.04]} position={[0.55, 1.4, -2.15]} rotation={[-0.2, -0.2, 0]} color="#1f2026" />
      <Block size={[0.24, 0.46, 0.04]} position={[1, 1.29, -2.05]} rotation={[-0.2, -0.3, 0]} color="#1f2026" />
      <Block size={[1.05, 0.05, 0.36]} position={[-0.6, 1.09, -1.4]} color="#d6d3da" />

      <KakaoCenterSign />

      {/* 그 시절 도구들: 포토샵, 일러스트 */}
      <ToolIcon tool="ps" position={[1.4, 2.95, -4.23]} size={0.6} />
      <ToolIcon tool="ai" position={[2.15, 2.95, -4.23]} size={0.6} />
      <SnsFeedPoster />
      <CardSizeNote />
      <RollBanner
        position={[2.4, 0, -3.8]}
        draw={(ctx) => {
          const gradient = ctx.createLinearGradient(0, 0, 0, 560);
          gradient.addColorStop(0, "#a9dcff");
          gradient.addColorStop(1, "#86d25a");
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, 220, 560);
          ctx.fillStyle = "#c2372b";
          ctx.font = "800 40px Pretendard, sans-serif";
          ctx.fillText("함께", 24, 120);
          ctx.fillText("참여해요", 24, 168);
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(24, 420, 172, 56);
          ctx.fillStyle = "#c2372b";
          ctx.font = "700 24px Pretendard, sans-serif";
          ctx.fillText("QR로 참여", 48, 456);
        }}
      />

      {/* 2017년의 책상: 휴대용 선풍기, 텀블러, 컬러칩 */}
      <MiniFan position={[-1.7, 1.06, -2.3]} />
      <Cup position={[-2.05, 1.06, -1.6]} color="#9aa7bd" tall />
      <ColorChips position={[0.85, 1.06, -1.4]} rotation={[0, -0.4, 0]} />
      <Hotspot {...state("campaigns")} {...shared} label={[-2.8, 2.75, -4.05]}>
        <group>
          {CAMPAIGNS.map((campaign, i) => (
            <CampaignPoster key={campaign.org} campaign={campaign} x={-5.4 + i * 1.3} />
          ))}
        </group>
      </Hotspot>

      <Hotspot {...state("midnight")} {...shared} label={[-5.95, 3.15, -1.2]}>
        <group>
          <LaunchBoard />
          <MidnightClock />
        </group>
      </Hotspot>

      <Hotspot {...state("cardnews")} {...shared} label={[-5.95, 3.1, 2.9]}>
        <CardNewsWall />
      </Hotspot>
    </group>
  );
}
