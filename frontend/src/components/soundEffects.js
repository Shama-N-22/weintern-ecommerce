// Tiny synthesized sound effects using the Web Audio API — no external
// audio files needed, so nothing to break or license.
let ctx;

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  return ctx;
}

function beep({ freq = 440, duration = 0.08, type = "sine", volume = 0.05 }) {
  try {
    const audioCtx = getCtx();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = volume;
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    osc.stop(audioCtx.currentTime + duration);
  } catch {
    // Web Audio not available — fail silently
  }
}

export const playSelectSound = () => beep({ freq: 520, duration: 0.06 });
export const playSuccessSound = () => {
  beep({ freq: 440, duration: 0.09 });
  setTimeout(() => beep({ freq: 660, duration: 0.12 }), 90);
};
