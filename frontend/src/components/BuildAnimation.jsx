import { useEffect, useState } from "react";

const STAGES = [
  "Initializing AI...",
  "Analyzing Budget...",
  "Finding Compatible Products...",
  "Building Workspace...",
  "Optimizing Performance...",
  "Dream Setup Ready ✔",
];

function BuildAnimation({ onDone }) {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStageIndex((prev) => {
        if (prev >= STAGES.length - 1) {
          clearInterval(timer);
          setTimeout(onDone, 500);
          return prev;
        }
        return prev + 1;
      });
    }, 420);
    return () => clearInterval(timer);
  }, [onDone]);

  return (
    <div className="build-animation-backdrop">
      <div className="build-animation-panel">
        {STAGES.slice(0, stageIndex + 1).map((stage, i) => (
          <div className="build-stage-line" key={stage}>
            <span>{stage}</span>
            {i < STAGES.length - 1 && (
              <div className="build-stage-bar">
                <div className="build-stage-fill" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default BuildAnimation;
