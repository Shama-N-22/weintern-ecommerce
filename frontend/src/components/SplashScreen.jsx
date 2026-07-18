import { useEffect, useState } from "react";

const STAGES = [
  "Initializing System...",
  "Checking Components...",
  "Loading Experience...",
  "Ready.",
];

function SplashScreen({ onFinish }) {
  const [stageIndex, setStageIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const stageTimer = setInterval(() => {
      setStageIndex((prev) => Math.min(prev + 1, STAGES.length - 1));
    }, 450);

    const fadeTimer = setTimeout(() => setFading(true), 2000);
    const doneTimer = setTimeout(() => onFinish(), 2600);

    return () => {
      clearInterval(stageTimer);
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onFinish]);

  const progress = ((stageIndex + 1) / STAGES.length) * 100;

  return (
    <div className={`splash-screen ${fading ? "splash-fading" : ""}`}>
      <div className="splash-logo">NEXTGEAR</div>
      <div className="splash-line" />
      <div className="splash-progress-track">
        <div className="splash-progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="splash-stage">{STAGES[stageIndex]}</div>
    </div>
  );
}

export default SplashScreen;
