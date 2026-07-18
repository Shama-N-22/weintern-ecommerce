import { useState } from "react";

function AccordionCard({ icon, title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="accordion-card" onClick={() => setOpen((prev) => !prev)}>
      <div className="accordion-header">
        <span className="accordion-icon">{icon}</span>
        <span className="accordion-title">{title}</span>
        <span className={`faq-toggle ${open ? "faq-toggle-open" : ""}`}>+</span>
      </div>
      {open && <p className="accordion-body">{children}</p>}
    </div>
  );
}

export default AccordionCard;
