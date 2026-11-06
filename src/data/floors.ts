// 층과 일화 데이터 — 3D 체험과 글 버전이 같은 내용을 사용합니다.
// draft: true인 일화는 사용자 확인 전 임시 문구입니다. 공개 전에 실제 이야기로 교체합니다.

export type IconName = "monitor" | "pin" | "books" | "pen" | "slice" | "folder";

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
        id: "notes",
        name: "메모판",
        icon: "pin",
        title: "1픽셀 투명 이미지",
        then: ["간격 하나를 벌리려고 투명한 이미지를 끼워 넣었었죠. width와 height만 바꿔 가면서요."],
        now: "지금은 토큰 하나만 고치면 55개 화면의 간격이 함께 바뀝니다.",
        draft: true,
      },
      {
        id: "books",
        name: "책장",
        icon: "books",
        title: "모르면 책부터 폈습니다",
        then: ["막히면 두꺼운 책을 펴고, 안 되면 소스 보기를 눌러 남의 사이트를 뜯어봤었죠."],
        now: "지금은 AI에게 묻습니다. 다만 답이 맞는지 판단하는 일은 여전히 제 몫입니다.",
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
    stories: [],
  },
  {
    id: "3f",
    label: "3F",
    era: "2015~",
    title: "혼자 끝까지 책임지다",
    tools: ["반응형", "워드프레스", "카페24", "캠페인"],
    wall: "#54465e",
    stories: [],
  },
  {
    id: "4f",
    label: "4F",
    era: "2018~",
    title: "그리기 전에 듣다",
    tools: ["피그마", "UX 리서치", "디자인 시스템"],
    wall: "#5c4a3f",
    stories: [],
  },
  {
    id: "5f",
    label: "5F",
    era: "2024~",
    title: "빨라진 만큼 더 판단하다",
    tools: ["AI 이미지", "Claude Code"],
    wall: "#2f4468",
    stories: [],
  },
  { id: "rf", label: "RF", era: "지금", title: "다음 층을 찾다", tools: ["다음 회사"], wall: "#26304f", stories: [] },
];

export const FLOOR_HEIGHT = 3.8;

// B1 바닥이 지면 아래 한 층에 오도록 층별 높이를 계산합니다
export const floorBaseY = (index: number) => (index - 1) * FLOOR_HEIGHT;
