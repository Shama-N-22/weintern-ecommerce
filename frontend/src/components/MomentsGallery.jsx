import { useRef } from "react";

const MOMENTS = [
  {
    emoji: "🖥️",
    title: "Engineering Workspace",
    date: "March 2026",
    story: "Where the backend and frontend architecture came together, line by line.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=700&q=80&auto=format&fit=crop",
  },
  {
    emoji: "💻",
    title: "Product Testing",
    date: "May 2026",
    story: "Every listed spec gets checked against the real hardware before it goes live.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=700&q=80&auto=format&fit=crop",
  },
  {
    emoji: "📦",
    title: "Packaging Orders",
    date: "June 2026",
    story: "Simulating the packaging and delivery flow that ships every order.",
    image: "https://images.unsplash.com/photo-1607166452427-7e4477079cb9?w=700&q=80&auto=format&fit=crop",
  },
  {
    emoji: "☕",
    title: "Team Collaboration",
    date: "April 2026",
    story: "Five people, one repo, and a lot of coffee-fueled debugging sessions.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=700&q=80&auto=format&fit=crop",
  },
  {
    emoji: "🎨",
    title: "UI Design",
    date: "March 2026",
    story: "Sketching the wine-red-on-black look that became NextGear's identity.",
    image: "https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=700&q=80&auto=format&fit=crop",
  },
  {
    emoji: "🚀",
    title: "Launch Day",
    date: "July 2026",
    story: "Months of design, development, and testing finally came together to launch the NextGear experience.",
    image: "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=700&q=80&auto=format&fit=crop",
  },
  {
    emoji: "🔍",
    title: "Quality First",
    date: "May 2026",
    story: "Every product carefully selected before it earns a spot in the catalog.",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=700&q=80&auto=format&fit=crop",
  },
  {
    emoji: "💬",
    title: "Customer Focus",
    date: "June 2026",
    story: "Technology built around people, not just specs.",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=700&q=80&auto=format&fit=crop",
  },
];

function MomentCard({ moment }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) scale(1.06)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = "";
  };

  return (
    <div
      className="moment-card"
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <img src={moment.image} alt={moment.title} className="moment-image" />
      <div className="moment-overlay">
        <span className="moment-date">{moment.date}</span>
        <h3>{moment.emoji} {moment.title}</h3>
        <p>{moment.story}</p>
      </div>
    </div>
  );
}

function MomentsGallery() {
  const track = [...MOMENTS, ...MOMENTS];

  return (
    <div className="moments-section">
      <div className="moments-particles">
        {Array.from({ length: 14 }).map((_, i) => (
          <span
            key={i}
            className="particle"
            style={{
              left: `${(i * 71) % 100}%`,
              animationDelay: `${(i % 8) * 1}s`,
              animationDuration: `${10 + (i % 5)}s`,
            }}
          />
        ))}
      </div>

      <div className="moments-track-wrapper">
        <div className="moments-track">
          {track.map((moment, i) => (
            <MomentCard moment={moment} key={`${moment.title}-${i}`} />
          ))}
        </div>
      </div>

      <p className="moments-philosophy">
        Behind every product is a team passionate about innovation, quality,
        and creating technology experiences that people genuinely enjoy. From
        design to deployment, every decision is made with performance,
        reliability, and customer satisfaction in mind.
      </p>
    </div>
  );
}

export default MomentsGallery;
