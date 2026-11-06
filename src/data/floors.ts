// 층과 일화 데이터 — 3D 체험과 글 버전이 같은 내용을 사용합니다.
// draft: true인 일화는 사용자 확인 전 임시 문구입니다. 공개 전에 실제 이야기로 교체합니다.

export type IconName = "monitor" | "pin" | "books" | "pen" | "slice" | "folder" | "banner" | "box" | "poster" | "flash" | "ruler" | "clock" | "note" | "tablet" | "drawer" | "spark" | "screen" | "layers" | "terminal";

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
  draft?: boolean;
};

export type Floor = {
  id: string;
  label: string;
  era: string;
  title: string;
  // 그 시절의 도구
  tools: string[];
  wall: string;
  stories: Story[];
};

export const floors: Floor[] = [
  {
    id: "b1",
    label: "B1",
    era: "2010~",
    title: "칸을 세며 화면을 배우다",
    tools: ["table", "드림위버", "플래시"],
    wall: "#4a4034",
    stories: [
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
        id: "flash",
        name: "플래시 작업대",
        icon: "flash",
        title: "지금은 재생되지 않는 작업",
        then: ["플래시 타임라인에 키프레임을 찍어 가며 움직임을 만들었습니다. 그 파일들은 이제 어디서도 재생되지 않습니다."],
        now: "도구는 사라져도 움직임을 설계하는 감각은 남았습니다.",
        draft: true,
      },
    ],
  },
  {
    id: "1f",
    label: "1F",
    era: "2012~",
    title: "화면 밖까지 맡다",
    tools: ["포토샵", "일러스트", "인쇄물"],
    wall: "#3d4658",
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
        id: "slice",
        name: "슬라이스 시안",
        icon: "slice",
        title: "시안을 잘라 웹에 올렸습니다",
        then: ["완성한 시안을 칸칸이 잘라 이미지로 저장하고, 그 조각을 table에 다시 맞췄었죠."],
        now: "지금은 시안 없이 동작하는 화면으로 바로 이야기합니다.",
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
  // 2F의 div 전환, 4F의 피그마 전환 시기는 사용자 확인 후 조정합니다
  {
    id: "2f",
    label: "2F",
    era: "2013~",
    title: "많이 만들며 패턴을 보다",
    tools: ["대량 배너", "기획전", "div·CSS"],
    wall: "#3c5350",
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
    era: "2015~",
    title: "혼자 끝까지 책임지다",
    tools: ["반응형", "워드프레스", "카페24", "캠페인"],
    wall: "#54465e",
    stories: [
      {
        id: "reflow",
        name: "줄어드는 벽",
        icon: "ruler",
        title: "화면이 하나가 아니게 됐습니다",
        then: ["처음 혼자 만든 반응형 사이트였습니다. 고정된 시안 하나로는 더 이상 끝나지 않았죠."],
        now: "화면 한 장이 아니라, 폭이 달라져도 무너지지 않는 규칙을 설계합니다.",
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
    ],
  },
  {
    id: "4f",
    label: "4F",
    era: "2018~",
    title: "그리기 전에 듣다",
    tools: ["피그마", "UX 리서치", "디자인 시스템"],
    wall: "#a9b9b5",
    stories: [
      {
        id: "interview",
        name: "포스트잇 벽",
        icon: "note",
        title: "화면보다 인터뷰가 먼저였습니다",
        then: ["학원개설 안내 페이지를 만들 때 이해관계자 인터뷰로 요구사항부터 찾았습니다. 그리기 전에 듣기 시작한 때였죠."],
        now: "쓰는 사람이 헤매지 않는 화면을 먼저 생각합니다.",
        draft: true,
      },
      {
        id: "tablet",
        name: "태블릿",
        icon: "tablet",
        title: "설명 없이 쓸 수 있는가",
        then: ["매일 쓰는 태블릿 학습 화면을 만들었습니다. 안내 문구를 더하기보다 보자마자 쓸 수 있어야 했습니다."],
        now: "'설명 없이 쓸 수 있는가'는 지금도 제 판단 기준입니다.",
        draft: true,
      },
      {
        id: "drawer",
        name: "부품 서랍장",
        icon: "drawer",
        title: "처음 만들어 본 디자인 시스템",
        then: ["쿠폰 안내 페이지에서 디자인 시스템을 처음 시도했습니다."],
        now: "한 곳을 고치면 전부 같이 바뀌는 구조로 일합니다.",
        draft: true,
      },
    ],
  },
  {
    id: "5f",
    label: "5F",
    era: "2024~",
    title: "빨라진 만큼 더 판단하다",
    tools: ["AI 이미지", "Claude Code"],
    wall: "#2f4468",
    stories: [
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
        id: "prototype",
        name: "회의실 화면",
        icon: "screen",
        title: "시안 대신 움직이는 화면으로",
        then: ["YBM Books 리뉴얼에서는 시안 이미지 대신 실제로 동작하는 HTML 화면을 보며 고객사와 결정했습니다."],
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
    ],
  },
  { id: "rf", label: "RF", era: "지금", title: "다음 층을 찾다", tools: ["다음 회사"], wall: "#26304f", stories: [] },
];

export const FLOOR_HEIGHT = 3.8;

// B1 바닥이 지면 아래 한 층에 오도록 층별 높이를 계산합니다
export const floorBaseY = (index: number) => (index - 1) * FLOOR_HEIGHT;
