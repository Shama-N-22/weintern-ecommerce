import { useState } from "react";
import { motion } from "framer-motion";
import CustomDropdown from "../components/CustomDropdown";
import AnimatedCounter from "../components/AnimatedCounter";
import MiniCalendar from "../components/MiniCalendar";

const REASONS = [
  "General Inquiry", "Product Support", "Order Issues", "Business Partnership",
  "Technical Support", "Returns & Refunds", "Feedback", "Careers",
];

const MEETING_PURPOSES = ["Product Demo", "Bulk Order Discussion", "Partnership Talk", "Technical Walkthrough"];
const TIME_SLOTS = ["10:00 AM", "11:30 AM", "1:00 PM", "2:30 PM", "4:00 PM", "5:30 PM"];

const FAQS = [
  { icon: "🚚", q: "How long does delivery take?", a: "Most orders ship within 2-4 business days with a tracking link sent by email." },
  { icon: "↩️", q: "What's your return policy?", a: "30-day returns on unopened items, 14 days on opened ones if everything's in working condition." },
  { icon: "🛡", q: "Do you offer warranty on all products?", a: "Yes — every product includes at least a 1-year manufacturer warranty; laptops and PCs get 2 years." },
  { icon: "💳", q: "What payment methods do you accept?", a: "Cards, UPI, net banking, and Cash on Delivery on eligible orders." },
  { icon: "📦", q: "How do I know if a product is in stock?", a: "Stock status shows on every product page in real time before you add it to cart." },
  { icon: "🔧", q: "Do you provide technical support after purchase?", a: "Yes — our support team helps with setup and troubleshooting for the life of your warranty." },
];

function FaqItem({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="faq-item" onClick={() => setOpen((prev) => !prev)}>
      <div className="faq-question">
        <span className="faq-icon">{item.icon}</span>
        <span className="faq-q-text">{item.q}</span>
        <span className={`faq-toggle ${open ? "faq-toggle-open" : ""}`}>+</span>
      </div>
      {open && <p className="faq-answer">{item.a}</p>}
    </div>
  );
}

function FloatingInput({ type = "text", name, label, value, onChange, icon, textarea }) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;
  const Tag = textarea ? "textarea" : "input";

  return (
    <div className={`floating-field ${active ? "floating-field-active" : ""}`}>
      {icon && <span className="floating-icon">{icon}</span>}
      <Tag
        type={textarea ? undefined : type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        rows={textarea ? 4 : undefined}
        required
      />
      <label className={active ? "floating-label-active" : ""}>{label}</label>
    </div>
  );
}

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [reason, setReason] = useState(REASONS[0]);
  const [status, setStatus] = useState("idle"); // idle | loading | done

  const [demoDate, setDemoDate] = useState(null);
  const [demoSlot, setDemoSlot] = useState(TIME_SLOTS[0]);
  const [demoPurpose, setDemoPurpose] = useState(MEETING_PURPOSES[0]);
  const [demoStatus, setDemoStatus] = useState("idle");

  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterDone, setNewsletterDone] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("loading");
    // NOTE: no backend/email service wired up yet — this simulates a
    // submission so the UI flow is complete; hook up a real endpoint later.
    setTimeout(() => setStatus("done"), 1100);
  };

  const handleBookDemo = (e) => {
    e.preventDefault();
    if (!demoDate) return;
    setDemoStatus("loading");
    setTimeout(() => setDemoStatus("done"), 1100);
  };

  return (
    <div className="page-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: "center", maxWidth: 760, margin: "0 auto 60px" }}
      >
        <span className="section-eyebrow">Get in touch</span>
        <h1 className="contact-hero-heading">
          Let's Build Something Great Together
        </h1>
        <p className="story-lede" style={{ marginTop: 14 }}>
          Our team is ready to help with product inquiries, support,
          partnerships, and feedback.
        </p>
        <div className="accent-line" />
      </motion.div>

      {/* Why Contact NextGear */}
      <div className="why-contact-grid">
        <div className="why-contact-card">
          <span className="why-icon">⚡</span>
          <h2>Fast Support</h2>
          <p>Most queries answered within a few hours, not days.</p>
        </div>
        <div className="why-contact-card">
          <span className="why-icon">🔒</span>
          <h2>Secure Assistance</h2>
          <p>Your order and account details stay private, always.</p>
        </div>
        <div className="why-contact-card">
          <span className="why-icon">🎯</span>
          <h2>Expert Guidance</h2>
          <p>Real answers from people who know the products inside out.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="story-stats contact-stats">
        <div className="story-stat">
          <span className="story-stat-number"><AnimatedCounter target={2} suffix="hr" /></span>
          <span className="story-stat-label">Average response time</span>
        </div>
        <div className="story-stat">
          <span className="story-stat-number"><AnimatedCounter target={97} suffix="%" /></span>
          <span className="story-stat-label">Customer satisfaction</span>
        </div>
        <div className="story-stat">
          <span className="story-stat-number"><AnimatedCounter target={24} suffix="hr" /></span>
          <span className="story-stat-label">Avg. resolution time</span>
        </div>
        <div className="story-stat">
          <span className="story-stat-number"><AnimatedCounter target={6} suffix="/7" /></span>
          <span className="story-stat-label">Days support available</span>
        </div>
      </div>

      {/* Main glass container: info cards + form + map */}
      <div className="contact-glass-panel">
        <div className="contact-info-grid">
          <div className="contact-info-card">
            <span className="contact-info-icon">✉️</span>
            <span className="contact-info-label">Email</span>
            <p>support@nextgear.example</p>
          </div>
          <div className="contact-info-card">
            <span className="contact-info-icon">📞</span>
            <span className="contact-info-label">Phone</span>
            <p>+91 98765 43210</p>
          </div>
          <div className="contact-info-card">
            <span className="contact-info-icon">🕐</span>
            <span className="contact-info-label">Hours</span>
            <p>Mon–Sat, 9am–7pm IST</p>
          </div>
          <div className="contact-info-card">
            <span className="contact-info-icon">📍</span>
            <span className="contact-info-label">Location</span>
            <p>Mangaluru, Karnataka</p>
          </div>
        </div>

        <div className="contact-layout">
          <div>
            <h1 className="rail-title" style={{ marginBottom: 20 }}>Send a message</h1>

            {status === "done" ? (
              <div className="lab-result" style={{ maxWidth: 480 }}>
                <span className="lab-result-label">Message received</span>
                <p style={{ color: "var(--text-b)", marginTop: 8, textAlign: "center" }}>
                  Thanks, {form.name || "there"} — we'll get back to you about your{" "}
                  {reason.toLowerCase()} soon.
                </p>
              </div>
            ) : (
              <form className="premium-form" onSubmit={handleSubmit}>
                <FloatingInput
                  name="name" label="Your name" icon="👤"
                  value={form.name} onChange={handleChange}
                />
                <FloatingInput
                  name="email" type="email" label="Your email" icon="✉️"
                  value={form.email} onChange={handleChange}
                />
                <CustomDropdown
                  label="Reason"
                  options={REASONS}
                  value={reason}
                  onChange={setReason}
                />
                <FloatingInput
                  name="message" label="How can we help?" textarea
                  value={form.message} onChange={handleChange}
                />
                <button type="submit" className="btn btn-primary btn-submit" disabled={status === "loading"}>
                  {status === "loading" ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>

          <div>
            <h1 className="rail-title" style={{ marginBottom: 20 }}>Find us</h1>
            <div className="map-illustration">
              <div className="map-grid" />
              <div className="map-pin">📍</div>
              <span className="map-caption">Mangaluru, Karnataka — illustrative map</span>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <h1 className="rail-title" style={{ marginTop: 60, marginBottom: 20 }}>Frequently asked</h1>
      <div className="faq-list">
        {FAQS.map((item) => (
          <FaqItem item={item} key={item.q} />
        ))}
      </div>

      {/* Book a Demo */}
      <div className="contact-glass-panel" style={{ marginTop: 60 }}>
        <h1 className="rail-title" style={{ marginBottom: 6 }}>Book a Demo</h1>
        <p className="lab-note" style={{ marginBottom: 24 }}>
          Schedule a short call with our team — pick a date and time that works for you.
        </p>

        {demoStatus === "done" ? (
          <div className="lab-result">
            <span className="lab-result-label">Demo booked</span>
            <p style={{ color: "var(--text-b)", marginTop: 8, textAlign: "center" }}>
              Confirmed for {demoDate?.toLocaleDateString("en-IN", { day: "numeric", month: "long" })}{" "}
              at {demoSlot} — a calendar invite will follow once this is wired to a booking service.
            </p>
          </div>
        ) : (
          <form className="demo-booking-layout" onSubmit={handleBookDemo}>
            <MiniCalendar selectedDate={demoDate} onSelect={setDemoDate} />

            <div className="demo-booking-details">
              <div className="lab-row">
                <label>Time slot</label>
                <div className="time-slot-grid">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      className={`filter-chip ${demoSlot === slot ? "active" : ""}`}
                      onClick={() => setDemoSlot(slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <CustomDropdown
                label="Purpose of meeting"
                options={MEETING_PURPOSES}
                value={demoPurpose}
                onChange={setDemoPurpose}
              />

              <button
                type="submit"
                className="btn btn-primary btn-submit"
                disabled={!demoDate || demoStatus === "loading"}
                style={{ marginTop: 20 }}
              >
                {demoStatus === "loading" ? "Booking..." : demoDate ? "Confirm Booking" : "Pick a date first"}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Newsletter */}
      <div className="newsletter-banner">
        <div>
          <h2>Stay in the loop</h2>
          <p>New product launches, exclusive offers, and tech news — no spam.</p>
        </div>
        {newsletterDone ? (
          <span className="lab-result-label">Subscribed ✓</span>
        ) : (
          <form
            className="newsletter-form"
            onSubmit={(e) => {
              e.preventDefault();
              setNewsletterDone(true);
            }}
          >
            <input
              type="email"
              placeholder="you@example.com"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary">Subscribe</button>
          </form>
        )}
      </div>

      {/* Social */}
      <div className="social-icons-row">
        {["LinkedIn", "GitHub", "Instagram", "Twitter", "YouTube"].map((name) => (
          <a href="#" key={name} onClick={(e) => e.preventDefault()} className="social-icon-btn" title={name}>
            {name[0]}
          </a>
        ))}
      </div>
    </div>
  );
}

export default Contact;
