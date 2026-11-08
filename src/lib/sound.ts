// 배경음악과 효과음. 음원 파일 없이 Web Audio로 직접 합성합니다.
// 브라우저는 사용자가 한 번 누르기 전에는 소리를 낼 수 없어서, 들어가기 버튼에서 start()를 부릅니다

const STORAGE_KEY = "my-story:sound";

// 잔잔한 코드 진행: Cmaj9 → Am9 → Fmaj9 → G6/9 (각 8초)
const CHORDS = [
  [130.81, 196.0, 246.94, 293.66, 329.63],
  [110.0, 164.81, 196.0, 246.94, 261.63],
  [87.31, 130.81, 164.81, 196.0, 220.0],
  [98.0, 146.83, 196.0, 220.0, 246.94],
];
const CHORD_SECONDS = 8;
// 가끔 들리는 맑은 음: 펜타토닉
const MELODY = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let musicBus: GainNode | null = null;
let fxBus: GainNode | null = null;
let noise: AudioBuffer | null = null;
let scheduler: number | null = null;
let nextChordAt = 0;
let chordIndex = 0;
let enabled = true;

const readPreference = () => {
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== "off";
  } catch {
    return true;
  }
};

const writePreference = (on: boolean) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
  } catch {
    // 저장이 막힌 환경에서는 이번 방문 동안만 기억합니다
  }
};

function setup() {
  if (ctx) return ctx;
  const AudioCtor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtor) return null;
  ctx = new AudioCtor();
  master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  // 배경음악은 부드럽게 깎고, 효과음은 따로 둡니다
  const warm = ctx.createBiquadFilter();
  warm.type = "lowpass";
  warm.frequency.value = 1400;
  warm.connect(master);
  musicBus = ctx.createGain();
  musicBus.gain.value = 0.55;
  musicBus.connect(warm);

  // 아주 짧은 메아리로 공간감을 줍니다
  const delay = ctx.createDelay();
  delay.delayTime.value = 0.38;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.28;
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(warm);
  musicBus.connect(delay);

  fxBus = ctx.createGain();
  fxBus.gain.value = 0.9;
  fxBus.connect(master);

  // 발소리에 쓰는 백색 소음
  noise = ctx.createBuffer(1, ctx.sampleRate * 0.25, ctx.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
  return ctx;
}

// 천천히 커졌다 사라지는 음 하나
function pad(frequency: number, start: number, length: number, level: number) {
  if (!ctx || !musicBus) return;
  for (const [type, detune, mix] of [
    ["sine", 0, 1],
    ["triangle", 6, 0.35],
  ] as const) {
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.value = frequency;
    osc.detune.value = detune;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(level * mix, start + 2.5);
    gain.gain.setValueAtTime(level * mix, start + length - 2.5);
    gain.gain.linearRampToValueAtTime(0, start + length + 1.5);
    osc.connect(gain);
    gain.connect(musicBus);
    osc.start(start);
    osc.stop(start + length + 1.6);
  }
}

// 종소리처럼 짧게 울리고 사라지는 음
function bell(frequency: number, start: number, level: number, bus: GainNode | null, decay = 1.8) {
  if (!ctx || !bus) return;
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.value = frequency;
  const overtone = ctx.createOscillator();
  overtone.type = "sine";
  overtone.frequency.value = frequency * 2.01;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(level, start + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + decay);
  const overtoneGain = ctx.createGain();
  overtoneGain.gain.value = 0.25;
  osc.connect(gain);
  overtone.connect(overtoneGain);
  overtoneGain.connect(gain);
  gain.connect(bus);
  osc.start(start);
  overtone.start(start);
  osc.stop(start + decay + 0.05);
  overtone.stop(start + decay + 0.05);
}

// 앞으로 몇 초 분량의 음악을 미리 예약합니다
function schedule() {
  if (!ctx) return;
  while (nextChordAt < ctx.currentTime + 4) {
    const chord = CHORDS[chordIndex % CHORDS.length];
    chord.forEach((frequency, i) => pad(frequency, nextChordAt, CHORD_SECONDS, i === 0 ? 0.05 : 0.028));
    // 한 코드에 맑은 음 두세 개를 드문드문
    const notes = 2 + (chordIndex % 2);
    for (let i = 0; i < notes; i += 1) {
      const at = nextChordAt + 1 + Math.random() * (CHORD_SECONDS - 2);
      bell(MELODY[Math.floor(Math.random() * MELODY.length)], at, 0.035, musicBus, 2.6);
    }
    nextChordAt += CHORD_SECONDS;
    chordIndex += 1;
  }
}

function fadeMaster(to: number, seconds: number) {
  if (!ctx || !master) return;
  const now = ctx.currentTime;
  master.gain.cancelScheduledValues(now);
  master.gain.setValueAtTime(master.gain.value, now);
  master.gain.linearRampToValueAtTime(to, now + seconds);
}

export const sound = {
  // 들어가기 버튼처럼 사용자가 누른 순간에 부릅니다
  start() {
    enabled = readPreference();
    const audio = setup();
    if (!audio) return enabled;
    void audio.resume();
    if (scheduler === null) {
      nextChordAt = audio.currentTime + 0.1;
      schedule();
      scheduler = window.setInterval(schedule, 1000);
    }
    fadeMaster(enabled ? 0.9 : 0, 3);
    return enabled;
  },

  isEnabled() {
    return enabled;
  },

  setEnabled(on: boolean) {
    enabled = on;
    writePreference(on);
    if (on) {
      void ctx?.resume();
      fadeMaster(0.9, 1);
    } else {
      fadeMaster(0, 0.4);
    }
  },

  // 발소리 한 걸음: 발이 닿는 낮은 "쿵"과 신발이 스치는 부드러운 소리를 섞습니다.
  // 계단에서는 나무 디딤판을 밟듯 울림을 조금 더 높고 길게 둡니다
  step(onStairs: boolean) {
    if (!ctx || !fxBus || !noise || !enabled) return;
    const now = ctx.currentTime;
    const vary = 0.92 + Math.random() * 0.16;

    // 1) 낮은 울림: 짧게 떨어지는 사인파
    const thump = ctx.createOscillator();
    thump.type = "sine";
    const top = (onStairs ? 150 : 110) * vary;
    thump.frequency.setValueAtTime(top, now);
    thump.frequency.exponentialRampToValueAtTime(top * 0.5, now + 0.12);
    const thumpGain = ctx.createGain();
    thumpGain.gain.setValueAtTime(0.0001, now);
    thumpGain.gain.exponentialRampToValueAtTime(onStairs ? 0.5 : 0.32, now + 0.008);
    thumpGain.gain.exponentialRampToValueAtTime(0.0001, now + (onStairs ? 0.2 : 0.14));
    thump.connect(thumpGain);
    thumpGain.connect(fxBus);
    thump.start(now);
    thump.stop(now + 0.25);

    // 2) 신발 마찰: 높은 소리를 깎은 잡음을 천천히 올렸다 내립니다
    const source = ctx.createBufferSource();
    source.buffer = noise;
    source.playbackRate.value = vary;
    const soft = ctx.createBiquadFilter();
    soft.type = "lowpass";
    soft.frequency.value = onStairs ? 900 : 650;
    soft.Q.value = 0.5;
    const scuffGain = ctx.createGain();
    scuffGain.gain.setValueAtTime(0.0001, now);
    scuffGain.gain.exponentialRampToValueAtTime(onStairs ? 0.16 : 0.1, now + 0.015);
    scuffGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);
    source.connect(soft);
    soft.connect(scuffGain);
    scuffGain.connect(fxBus);
    source.start(now);
    source.stop(now + 0.15);
  },

  // 새 층에 도착했을 때 엘리베이터처럼 맑은 두 음
  arrive() {
    if (!ctx || !enabled) return;
    const now = ctx.currentTime;
    bell(659.25, now, 0.12, fxBus);
    bell(987.77, now + 0.16, 0.1, fxBus);
  },

  // 이야기 카드를 열 때 짧은 톡 소리
  open() {
    if (!ctx || !enabled) return;
    bell(880, ctx.currentTime, 0.07, fxBus, 0.35);
  },
};
