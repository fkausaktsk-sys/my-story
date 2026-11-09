// 층과 일화 데이터 — 3D 체험과 글 버전이 같은 내용을 사용합니다.
// draft: true인 일화는 사용자 확인 전 임시 문구입니다. 공개 전에 실제 이야기로 교체합니다.

export type IconName = "monitor" | "pin" | "books" | "pen" | "slice" | "folder" | "banner" | "box" | "poster" | "flash" | "ruler" | "clock" | "note" | "tablet" | "drawer" | "spark" | "screen" | "layers" | "terminal";

// 묶음 일화 안에 들어가는 작은 이야기
export type StoryItem = {
  title: string;
  then: string[];
  now: string;
};

export type Story = {
  id: string;
  name: string;
  icon: IconName;
  title: string;
  // 그때의 기억
  then: string[];
  // 지금은 어떻게 달라졌는지
  now: string;
  // 그 시절 코드나 파일명처럼 카드에 함께 보여 줄 조각
  relic?: string;
  // 한 사물에 여러 이야기를 묶을 때 씁니다
  items?: StoryItem[];
  draft?: boolean;
};

export type Floor = {
  id: string;
  label: string;
  era: string;
  title: string;
  // 층에 들어서자마자 상단에 보이는 핵심 요약. 일화를 열지 않아도 이 층의 이야기를 알 수 있게 합니다
  summary: string[];
  // 이 층에서 얻은 능력 한 줄
  levelUp: string;
  // 회사명은 지오시스 지마켓, 카카오경기센터, 와이비엠넷만 씁니다
  company?: string;
  // 그 시절의 도구
  tools: string[];
  wall: string;
  stories: Story[];
  // 요약 문구가 확인 전 임시 문구인지
  draft?: boolean;
};

export const floors: Floor[] = [
  {
    id: "1f",
    label: "1F",
    era: "2010~2013",
    title: "칸을 세며 화면을 배우다",
    summary: [
      "행사마다 열리는 사이트를 table로 짜고, 포토샵 펜툴로 누끼를 따서 채웠습니다.",
      "포럼·총회·국제회의 사이트와 뉴스레터, 설명회 콘텐츠, 현수막·X배너까지 맡았습니다.",
    ],
    levelUp: "화면을 칸과 픽셀 단위로 직접 짓는 기본기",
    tools: ["table 코딩", "포토샵", "드림위버", "플래시"],
    wall: "#4a4034",
    draft: true,
    stories: [
      {
        id: "cutout",
        name: "펜툴 누끼",
        icon: "pen",
        title: "하나하나 누끼를 땄었죠",
        then: [
          "포토샵 펜툴로 점을 찍어 가며 누끼를 하나하나 땄었습니다.",
          "머리카락 한 올 앞에서는 밤이 깊어졌죠.",
        ],
        now: "지금은 클릭 한 번에 배경이 사라집니다. 그래도 어디까지 살릴지 보는 눈은 그 밤들이 만들어 줬습니다.",
        draft: true,
      },
      {
        id: "monitor",
        name: "두꺼운 모니터",
        icon: "monitor",
        title: "table 안에 table 안에 table",
        then: [
          "화면은 전부 표였습니다. tr, td, colspan을 손으로 세어 가며 하드코딩했었죠.",
          "칸 하나만 어긋나도 표 전체가 무너졌습니다.",
        ],
        now: "이제 구조는 디자인 시스템과 AI가 함께 잡아 줍니다. 그래도 화면을 칸으로 읽는 눈은 이때 생겼습니다.",
        relic: `<table width="980" border="0">
  <tr>
    <td width="200">
      <img src="spacer.gif">
    </td>
    <td colspan="2">...</td>
  </tr>
</table>`,
        draft: true,
      },
      {
        id: "posters",
        name: "행사 포스터",
        icon: "poster",
        title: "행사가 열릴 때마다 사이트가 하나",
        then: ["포럼, 총회, 국제회의가 열릴 때마다 홈페이지와 페이지를 만들어 채웠습니다. 행사 날짜는 미뤄지지 않았죠."],
        now: "마감이 있는 일을 몸으로 익혔습니다. 일정이 당겨져도 예정대로 여는 감각은 여기서 시작됐습니다.",
        draft: true,
      },
      {
        id: "slice",
        name: "슬라이스 시안",
        icon: "slice",
        title: "시안을 잘라 웹에 올렸습니다",
        then: ["완성한 시안을 칸칸이 잘라 이미지로 저장하고, 그 조각을 table에 다시 맞췄었죠."],
        now: "지금은 시안 없이 동작하는 화면으로 바로 이야기합니다.",
        draft: true,
      },
      {
        id: "flash",
        name: "플래시 작업대",
        icon: "flash",
        title: "지금은 재생되지 않는 작업",
        then: ["플래시 타임라인에 키프레임을 찍어 가며 움직임을 만들었습니다. 그 파일들은 이제 어디서도 재생되지 않습니다."],
        now: "도구는 사라져도 움직임을 설계하는 감각은 남았습니다.",
        draft: true,
      },
      {
        id: "psd",
        name: "최종 폴더",
        icon: "folder",
        title: "최종_진짜최종.psd",
        then: ["파일 이름 뒤에 '최종'이 늘어날수록 마감이 가까워졌습니다."],
        now: "지금은 git이 모든 버전을 기억합니다. 그래도 가끔 그 이름들이 그립습니다.",
        relic: `시안_최종.psd
시안_최종_수정.psd
시안_최종_진짜최종.psd
시안_최종_진짜최종_이게마지막.psd`,
        draft: true,
      },
    ],
  },
  {
    id: "2f",
    label: "2F",
    era: "2013~2015",
    title: "많이 만들며 패턴을 보다",
    company: "지오시스 지마켓 · 쇼핑몰 기획전과 배너",
    summary: [
      "지오시스 지마켓에서 팀별 기획전과 메인 배너, 메일을 공장처럼 쉬지 않고 만들었습니다.",
      "table에서 div로 넘어가며 레이아웃을 처음부터 다시 배웠습니다.",
    ],
    levelUp: "속도와 반복 속에서 패턴을 보는 눈",
    tools: ["기획전", "대량 배너", "메일", "div·CSS"],
    wall: "#3c5350",
    draft: true,
    stories: [
      {
        id: "belt",
        name: "배너 벨트",
        icon: "banner",
        title: "오늘의 기획전",
        then: ["기획전과 배너가 끝없이 이어지던 나날이었습니다. 하나를 올리면 다음 배너가 기다리고 있었죠."],
        now: "많이 만들수록 패턴이 보였습니다. 그 반복이 훗날 디자인 시스템의 씨앗이 됐습니다.",
        draft: true,
      },
      {
        id: "div",
        name: "칸을 벗어난 상자",
        icon: "box",
        title: "table을 버리고 div로",
        then: ["칸에 갇혀 있던 화면이 상자가 됐습니다. float와 clear로 레이아웃을 처음부터 다시 배웠죠."],
        now: "구조와 모양을 나누는 사고방식은 그때 몸에 뱄습니다.",
        relic: `<div class="banner">...</div>
<div class="banner">...</div>
<div class="clear"></div>

.banner { float: left; }
.clear  { clear: both; }`,
        draft: true,
      },
    ],
  },
  {
    id: "3f",
    label: "3F",
    era: "2017~2018",
    title: "많은 사람 앞에 화면을 열다",
    company: "카카오경기센터 관공서 캠페인 디자인",
    summary: [
      "카카오경기센터가 맡은 관공서 캠페인 사이트를 단독으로 디자인했습니다.",
      "서울시 · 경기도청 · 한국사회적기업진흥원 · 한국관광공사 · 한국도자재단",
      "랜딩페이지, 광고 배너, 카드뉴스, SNS 이벤트까지 함께 만들었습니다.",
    ],
    levelUp: "수많은 사람이 동시에 여는 화면을 책임지는 감각",
    tools: ["캠페인 사이트", "랜딩페이지", "광고 배너", "카드뉴스"],
    wall: "#54465e",
    draft: true,
    stories: [
      {
        id: "campaigns",
        name: "캠페인 게시판",
        icon: "pin",
        title: "관공서 캠페인을 혼자 디자인했습니다",
        then: [
          "카카오경기센터가 맡은 관공서 캠페인 페이지를 기획 의도에 맞춰 처음부터 끝까지 혼자 디자인했습니다.",
          "기관마다 전하고 싶은 메시지도, 참여시키고 싶은 사람도 달랐습니다.",
        ],
        now: "누가 들어와서 무엇을 하고 나가야 하는지부터 정리하는 습관이 여기서 생겼습니다.",
        relic: `서울시 · <내일연구소 서울> 2017년 10대 뉴스
경기도청 · 누구나 알기 쉬운 경기도 사용설명서
한국사회적기업진흥원 · 사회적기업 10년 캠페인
한국관광공사 · 관광씨앗, 함께 심다
한국도자재단 · 2017 G-세라믹페어`,
        draft: true,
      },
      {
        id: "midnight",
        name: "자정의 게시판",
        icon: "clock",
        title: "자정에 문이 열리는 페이지",
        then: [
          "공공 캠페인 페이지는 오픈일 자정부터 많은 사람이 들어왔습니다. 오류가 나지 않을지, 디자인이 잘 나올지 긴장하며 기다렸죠.",
          "많은 유입과 참여로 이어졌을 때의 뿌듯함은 지금도 기억납니다.",
        ],
        now: "화면 너머의 사람을 먼저 생각하는 책임감이 남았습니다.",
        draft: true,
      },
      {
        id: "cardnews",
        name: "카드뉴스 벽",
        icon: "layers",
        title: "한 장에 한 가지 메시지",
        then: [
          "학원, 병원, 협회 같은 여러 광고주의 랜딩페이지와 광고 배너, 카드뉴스, SNS 이벤트를 쉬지 않고 만들었습니다.",
        ],
        now: "작은 화면 한 장으로 한 가지를 확실히 전하는 연습이 됐습니다.",
        draft: true,
      },
    ],
  },
  {
    id: "4f",
    label: "4F",
    era: "2018~",
    title: "기획부터 구현까지 혼자 끝까지",
    company: "와이비엠넷 · YBM Books 리뉴얼 PM",
    summary: [
      "와이비엠넷에서 교육·출판·어학원 사이트를 기획, 디자인, 반응형 퍼블리싱까지 맡았습니다.",
      "YBM Books 리뉴얼에서는 PM을 맡아 고객사 협의를 이끌며 화면 39개 분석, IA 재설계, HTML 프로토타입, 디자인 시스템까지 혼자 진행했습니다.",
      "Claude Code를 도입해 디자인·퍼블리싱 공수를 기존 방식 추정치 대비 약 44% 줄였습니다 (5.9 → 3.3 M/M).",
    ],
    levelUp: "기획부터 구현까지, AI와 함께 판단하는 디자이너",
    tools: ["피그마", "HTML·CSS", "디자인 시스템", "Claude Code", "AI 이미지"],
    wall: "#2f4468",
    draft: true,
    stories: [
      {
        id: "prototype",
        name: "회의실 화면",
        icon: "screen",
        title: "시안 대신 움직이는 화면으로",
        then: [
          "YBM Books 리뉴얼에서 PM을 맡아 고객사와의 협의를 직접 이끌었습니다.",
          "시안 이미지 대신 실제로 동작하는 HTML 화면을 보며 고객사와 결정했습니다.",
        ],
        now: "1층에서 시안을 잘라 올리던 일이 여기서 끝났습니다. 회의 중에 나온 요청을 화면에서 바로 확인합니다.",
        draft: true,
      },
      {
        id: "versions",
        name: "시안 변천",
        icon: "layers",
        title: "메인 화면의 다섯 번 변신",
        then: ["첫 화면부터 오픈까지 메인 화면이 다섯 번 바뀌었습니다."],
        now: "각 단계의 판단을 설명할 수 있어야 진짜 내 디자인입니다.",
        draft: true,
      },
      {
        id: "overnight",
        name: "켜 둔 모니터",
        icon: "terminal",
        title: "퇴근 프롬프트",
        then: ["퇴근하면서 일을 맡기고, 다음 날 아침에 결과를 확인했습니다. 내가 자리에 없는 시간까지 쓰는 방법이었죠."],
        now: "AI는 속도를 줬고 판단은 제가 했습니다. 디자인·퍼블리싱 공수는 기존 방식 추정치 대비 약 44% 줄었습니다. 그래서 아래층의 15년이 필요했습니다.",
        draft: true,
      },
      {
        id: "ai-image",
        name: "AI 이미지",
        icon: "spark",
        title: "처음 AI로 그려 본 이벤트 페이지",
        then: ["2024년, 이벤트 페이지에 AI 이미지 생성을 처음 썼습니다. 펜툴로 누끼를 따던 밤이 떠올랐죠."],
        now: "이미지는 금방 나옵니다. 어떤 것을 고를지 보는 눈은 여전히 아래층에서 배운 것입니다.",
        draft: true,
      },
      {
        id: "projects",
        name: "8년의 프로젝트",
        icon: "drawer",
        title: "Books 리뉴얼 전까지 쌓은 것들",
        then: ["와이비엠넷에서 교육·출판·어학원 사이트를 짧은 주기로 구축하며 일하는 방식이 하나씩 바뀌었습니다."],
        now: "이 경험들이 있어서 Books 리뉴얼을 기획부터 구현까지 혼자 끝까지 맡을 수 있었습니다.",
        items: [
          {
            title: "화면보다 인터뷰가 먼저였습니다",
            then: ["학원개설 안내 페이지를 만들 때 이해관계자 인터뷰로 요구사항부터 찾았습니다. 그리기 전에 듣기 시작한 때였죠."],
            now: "쓰는 사람이 헤매지 않는 화면을 먼저 생각합니다.",
          },
          {
            title: "설명 없이 쓸 수 있는가",
            then: ["매일 쓰는 태블릿 학습 화면을 만들었습니다. 안내 문구를 더하기보다 보자마자 쓸 수 있어야 했습니다."],
            now: "'설명 없이 쓸 수 있는가'는 지금도 제 판단 기준입니다.",
          },
          {
            title: "처음 만들어 본 디자인 시스템",
            then: ["쿠폰 안내 페이지에서 디자인 시스템을 처음 시도했습니다."],
            now: "한 곳을 고치면 전부 같이 바뀌는 구조로 일합니다.",
          },
          {
            title: "화면이 하나가 아니게 됐습니다",
            then: ["구현까지 책임지려고 반응형 퍼블리싱을 따로 공부해 실무에 적용했습니다. 고정된 시안 하나로는 더 이상 끝나지 않았죠."],
            now: "화면 한 장이 아니라, 폭이 달라져도 무너지지 않는 규칙을 설계합니다.",
          },
        ],
        draft: true,
      },
    ],
  },
  {
    id: "5f",
    label: "5F",
    era: "다음",
    title: "다음 층을 지을 준비가 됐습니다",
    summary: [
      "1층의 table부터 4층의 AI까지, 화면을 만드는 방식이 바뀔 때마다 직접 배워 올라왔습니다.",
      "다음 층에서는 한 서비스에 깊이 몰입해, 사용자 데이터를 근거로 끝까지 다듬어 가는 디자이너가 되고 싶습니다.",
    ],
    levelUp: "다음 층은 함께 짓고 싶습니다",
    tools: ["다음 회사", "다음 동료", "다음 서비스"],
    wall: "#26304f",
    draft: true,
    stories: [],
  },
];

// 마지막 층에서 보여 주는 연락처
export const CONTACT_EMAIL = "fkausaktsk@gmail.com";

export const FLOOR_HEIGHT = 3.8;

// 1F 바닥이 지면에 오도록 층별 높이를 계산합니다
export const floorBaseY = (index: number) => index * FLOOR_HEIGHT;
