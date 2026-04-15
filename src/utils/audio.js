const SFX_STATE_KEY = 'p3-sfx-enabled';

export const isSfxEnabled = () => localStorage.getItem(SFX_STATE_KEY) !== '0';

export const setSfxEnabled = (val) => localStorage.setItem(SFX_STATE_KEY, val ? '1' : '0');

// Pre-created Audio instances — avoids GC pressure from new Audio() on each call
let _chooseAudio = null;
let _selectAudio = null;

const getChooseAudio = () => {
  if (!_chooseAudio) {
    _chooseAudio = new Audio('/audio/choose your character.mp3');
    _chooseAudio.volume = 0.8;
  }
  return _chooseAudio;
};

const getSelectAudio = () => {
  if (!_selectAudio) {
    _selectAudio = new Audio('/audio/select.mp3');
    _selectAudio.volume = 0.5;
  }
  return _selectAudio;
};

export const playChooseCharacterSound = () => {
  if (!isSfxEnabled()) return;
  const audio = getChooseAudio();
  audio.currentTime = 0;
  audio.play().catch(() => {});
};

export const playSelectSound = () => {
  if (!isSfxEnabled()) return;
  const audio = getSelectAudio();
  audio.currentTime = 0;
  audio.play().catch(() => {});
};

let clicBuffer = null;
let clicCtx = null;

const loadClicBuffer = async () => {
  if (clicBuffer) return clicBuffer;
  clicCtx = new (window.AudioContext || window.webkitAudioContext)();
  const res = await fetch('/audio/clic');
  const arrayBuffer = await res.arrayBuffer();
  clicBuffer = await clicCtx.decodeAudioData(arrayBuffer);
  return clicBuffer;
};

loadClicBuffer().catch(() => {});

const getCtx = async () => {
  await loadClicBuffer(); // garantit que clicCtx est créé et décodé
  if (clicCtx.state === 'suspended') await clicCtx.resume();
  return clicCtx;
};

// Son de kill instantané (mot 1 lettre, mob jamais ciblé)
export const playQuickKillSound = async () => {
  if (!isSfxEnabled()) return;
  try {
    const ctx = await getCtx();
    const t = ctx.currentTime;

    // Swish de lame — bruit haute fréquence très bref
    const bufLen = Math.floor(ctx.sampleRate * 0.07);
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const bd = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) {
      const env = Math.pow(i / bufLen, 0.15) * Math.pow(1 - i / bufLen, 0.6);
      bd[i] = (Math.random() * 2 - 1) * env;
    }
    const swish = ctx.createBufferSource();
    swish.buffer = buf;
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 4000;
    const swishGain = ctx.createGain();
    swishGain.gain.setValueAtTime(0.7, t);
    swishGain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
    swish.connect(hp); hp.connect(swishGain); swishGain.connect(ctx.destination);
    swish.start(t); swish.stop(t + 0.07);

    // Ting métallique — oscillateur descendant
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1800, t);
    osc.frequency.exponentialRampToValueAtTime(400, t + 0.13);
    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(0.35, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.13);
    osc.connect(oscGain); oscGain.connect(ctx.destination);
    osc.start(t); osc.stop(t + 0.13);
  } catch {}
};

// Bruit d'impact grave (mob qui passe à travers et touche le samuraï)
export const playMobHitSound = async () => {
  if (!isSfxEnabled()) return;
  try {
    const ctx = await getCtx();
    const t = ctx.currentTime;

    // Bruit blanc filtré bas — le "choc" sourd
    const noiseLen = Math.floor(ctx.sampleRate * 0.18);
    const noiseBuf = ctx.createBuffer(1, noiseLen, ctx.sampleRate);
    const nd = noiseBuf.getChannelData(0);
    for (let i = 0; i < noiseLen; i++) {
      nd[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / noiseLen, 1.6);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuf;

    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(380, t);
    lp.frequency.exponentialRampToValueAtTime(70, t + 0.16);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(1.4, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    noise.connect(lp);
    lp.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(t);
    noise.stop(t + 0.18);

    // Oscillateur grave — le "thud" corporel
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(130, t);
    osc.frequency.exponentialRampToValueAtTime(38, t + 0.14);

    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(0.9, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.14);
  } catch {}
};

export const playClickSound = async () => {
  if (!isSfxEnabled()) return;
  try {
    const buffer = await loadClicBuffer();
    if (clicCtx.state === 'suspended') await clicCtx.resume();

    const source = clicCtx.createBufferSource();
    source.buffer = buffer;

    const gain = clicCtx.createGain();
    gain.gain.value = 0.15;

    source.connect(gain);
    gain.connect(clicCtx.destination);

    source.start(0, 2.24, 0.97);
  } catch {
    // fallback silencieux
  }
};
