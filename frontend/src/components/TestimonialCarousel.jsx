import { useEffect, useState } from "react";

const TESTIMONIALS = [
  { name: "Ravi K.", rating: 5, text: "Ordered a laptop and the specs matched exactly what was listed — no surprises. Refreshing." },
  { name: "Ananya S.", rating: 5, text: "The compare tool actually helped me pick between two monitors. Small thing, big help." },
  { name: "Devika R.", rating: 4, text: "Fast delivery, and support answered my question about a return within the hour." },
  { name: "Kiran M.", rating: 5, text: "Tech Lab's laptop finder recommended exactly the right machine for my budget." },
];

function Stars({ count }) {
  return (
    <span className="testimonial-stars">
      {"★".repeat(count)}
      {"☆".repeat(5 - count)}
    </span>
  );
}

function TestimonialCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const current = TESTIMONIALS[index];

  return (
    <div className="testimonial-carousel">
      <div className="testimonial-card">
        <Stars count={current.rating} />
        <p>"{current.text}"</p>
        <span className="testimonial-name">{current.name}</span>
      </div>
      <div className="testimonial-dots">
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            className={`testimonial-dot ${i === index ? "testimonial-dot-active" : ""}`}
            onClick={() => setIndex(i)}
            aria-label={`Testimonial ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default TestimonialCarousel;
