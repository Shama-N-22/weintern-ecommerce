import { useEffect, useState } from "react";

function CursorGlow() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const move = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      const target = e.target.closest(
        "button, a, .product-card, input, .fun-card"
      );
      setHovering(Boolean(target));
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      className={`cursor-glow ${hovering ? "cursor-glow-hover" : ""}`}
      style={{ left: pos.x, top: pos.y }}
    />
  );
}

export default CursorGlow;
