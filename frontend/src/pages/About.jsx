import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AnimatedCounter from "../components/AnimatedCounter";
import AccordionCard from "../components/AccordionCard";
import TestimonialCarousel from "../components/TestimonialCarousel";
import MomentsGallery from "../components/MomentsGallery";

const timeline = [
  { year: "Idea", icon: "💡", text: "Frustrated with specs buried in marketing copy, we sketched the first version of NextGear." },
  { year: "Build", icon: "🛠️", text: "A small team of five started building — auth, catalog, cart, and an admin dashboard, from scratch." },
  { year: "Today", icon: "🚀", text: "A working full-stack store: 50+ products, real filtering, comparison tools, and an honest voice." },
  { year: "Future", icon: "🔭", text: "Smarter recommendations, more categories, and a full admin analytics dashboard on the way." },
];

const principles = [
  { icon: "📋", title: "Honest Specifications", desc: "Real numbers, not rounded-up marketing claims." },
  { icon: "💎", title: "Premium Quality", desc: "Every product tested before it gets listed." },
  { icon: "🤝", title: "Customer First", desc: "Decisions get made around what helps the buyer." },
  { icon: "✨", title: "Innovation", desc: "Small team, but we ship features bigger stores skip." },
];

const whyChoose = [
  { icon: "🚚", title: "Fast Delivery", desc: "2-4 business days, tracked from checkout to door." },
  { icon: "✅", title: "Verified Products", desc: "Every listing checked against real specs." },
  { icon: "🔐", title: "Secure Payments", desc: "Your details stay private, every time." },
  { icon: "🎧", title: "Expert Support", desc: "Real answers from people who use this gear." },
  { icon: "↩️", title: "Easy Returns", desc: "30-day window, no complicated forms." },
  { icon: "🛡️", title: "Genuine Warranty", desc: "Manufacturer-backed, minimum 1 year." },
];

const team = [
  { name: "Shama N", role: "Integration & Finalization", stack: "React, Node.js, Vite, Deployment" },
  { name: "Unnati U Bhat", role: "Auth & User Management", stack: "JWT, Express, MongoDB" },
  { name: "Anshika Srivastava", role: "Shopping Experience", stack: "Cart, Checkout, Orders" },
  { name: "Muskan Soni", role: "Product Management", stack: "Catalog, Search, Filters" },
  { name: "Rudra Bambal", role: "Admin Panel", stack: "Dashboard, Inventory, Orders" },
];

const process = [
  { icon: "🔍", label: "Research" },
  { icon: "✏️", label: "Design" },
  { icon: "💻", label: "Development" },
  { icon: "🧪", label: "Testing" },
  { icon: "🚀", label: "Deployment" },
  { icon: "🤝", label: "Customer Experience" },
];

const techStack = ["React.js", "Node.js", "Express.js", "MongoDB", "JWT Authentication", "Vite", "Framer Motion"];

const behindTheScenes = [
  { icon: "🎨", title: "Design Philosophy", body: "Dark, minimal, wine-red accents — built to feel premium without shouting for attention." },
  { icon: "⚙️", title: "Development Challenges", body: "Coordinating five people across auth, catalog, cart, and admin modules without stepping on each other's files." },
  { icon: "⚡", title: "Optimization", body: "Lazy-loaded routes, minimal re-renders, and a lightweight local-storage cart instead of heavy state libraries." },
  { icon: "🔒", title: "Security Features", body: "JWT-based auth, protected routes, and role checks before any sensitive action." },
  { icon: "📱", title: "Responsive Design", body: "Every page tested down to mobile widths, not just designed at desktop size." },
  { icon: "🚀", title: "Performance", body: "Vite's fast dev server and code-split routes keep load times low even as features grew." },
];

const vision = [
  { icon: "🤖", title: "AI Shopping Assistant", desc: "Smarter recommendations based on what you actually browse." },
  { icon: "🕶️", title: "AR Product Previews", desc: "See gear in your space before you buy it." },
  { icon: "🎯", title: "Personalized Picks", desc: "A homepage that adapts to your habits, not a generic grid." },
  { icon: "🌱", title: "Sustainable Packaging", desc: "Less waste, without raising prices." },
];

const achievements = [
  { icon: "🏁", label: "Project Started" },
  { icon: "🧩", label: "Core Features Completed" },
  { icon: "🤖", label: "AI Advisor Integrated" },
  { icon: "📱", label: "Responsive Design Completed" },
  { icon: "📊", label: "Admin Dashboard Built" },
  { icon: "🔮", label: "Future Updates" },
];

function FadeSection({ children, className = "" }) {
  return (
    <motion.section
      className={className}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7 }}
    >
      {children}
    </motion.section>
  );
}

function About() {
  return (
    <div>
      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero-glow" />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="section-eyebrow">About NextGear</span>
          <h1 className="about-hero-title">Specs first. Marketing second.</h1>
          <div className="accent-line" />
          <p className="story-lede" style={{ maxWidth: 560, margin: "20px auto 0" }}>
            We got tired of shopping for electronics where the real numbers
            are buried on page 6 of a spec sheet. So we built a store that
            leads with them instead.
          </p>
        </motion.div>
      </section>

      <div className="page-container" style={{ paddingTop: 0 }}>
        {/* Timeline */}
        <FadeSection>
          <h1 className="rail-title" style={{ textAlign: "center", marginBottom: 50 }}>Our Journey</h1>
          <div className="journey-timeline">
            {timeline.map((item, i) => (
              <motion.div
                className={`journey-item ${i % 2 === 0 ? "journey-left" : "journey-right"}`}
                key={item.year}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <div className="journey-card">
                  <span className="journey-icon">{item.icon}</span>
                  <span className="timeline-year">{item.year}</span>
                  <p>{item.text}</p>
                </div>
                <span className="journey-node" />
              </motion.div>
            ))}
            <div className="journey-line" />
          </div>
        </FadeSection>

        {/* Core Principles */}
        <FadeSection>
          <h1 className="rail-title" style={{ marginBottom: 24 }}>Our Core Principles</h1>
          <div className="principles-grid">
            {principles.map((p) => (
              <div className="principle-card" key={p.title}>
                <span className="why-icon">{p.icon}</span>
                <h2>{p.title}</h2>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </FadeSection>

        {/* Why Choose NextGear */}
        <FadeSection>
          <h1 className="rail-title" style={{ marginTop: 60, marginBottom: 24 }}>Why Choose NextGear?</h1>
          <div className="why-contact-grid why-choose-grid">
            {whyChoose.map((item, i) => (
              <motion.div
                className="why-contact-card"
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <span className="why-icon">{item.icon}</span>
                <h2>{item.title}</h2>
                <p>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </FadeSection>

        {/* Stats */}
        <FadeSection className="story-stats about-stats">
          <div className="story-stat">
            <span className="story-stat-number"><AnimatedCounter target={50} suffix="+" /></span>
            <span className="story-stat-label">Products available</span>
          </div>
          <div className="story-stat">
            <span className="story-stat-number"><AnimatedCounter target={500} suffix="+" /></span>
            <span className="story-stat-label">Happy customers</span>
          </div>
          <div className="story-stat">
            <span className="story-stat-number"><AnimatedCounter target={1200} suffix="+" /></span>
            <span className="story-stat-label">Orders delivered</span>
          </div>
          <div className="story-stat">
            <span className="story-stat-number"><AnimatedCounter target={1} /></span>
            <span className="story-stat-label">Year of building this</span>
          </div>
          <div className="story-stat">
            <span className="story-stat-number"><AnimatedCounter target={97} suffix="%" /></span>
            <span className="story-stat-label">Customer satisfaction</span>
          </div>
        </FadeSection>

        {/* Inside NextGear — Moments gallery */}
        <FadeSection>
          <h1 className="rail-title" style={{ marginTop: 60, marginBottom: 8, textAlign: "center" }}>
            Inside NextGear
          </h1>
          <p className="lab-note" style={{ textAlign: "center", marginBottom: 30 }}>
            Moments at NextGear
          </p>
        </FadeSection>

        <MomentsGallery />

        {/* Meet the Team */}
        <FadeSection>
          <h1 className="rail-title" style={{ marginTop: 20, marginBottom: 24 }}>Meet the Team</h1>
          <div className="team-grid">
            {team.map((member) => (
              <div className="team-card" key={member.name}>
                <div className="team-avatar">{member.name[0]}</div>
                <h2>{member.name}</h2>
                <span className="team-role">{member.role}</span>
                <div className="team-reveal">
                  <p>{member.stack}</p>
                  <div className="team-links">
                    <span>GitHub</span>
                    <span>LinkedIn</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </FadeSection>

        {/* Development Process */}
        <FadeSection>
          <h1 className="rail-title" style={{ marginTop: 60, marginBottom: 30 }}>Development Process</h1>
          <div className="process-flow">
            {process.map((step, i) => (
              <div className="process-step" key={step.label}>
                <div className="process-icon">{step.icon}</div>
                <span>{step.label}</span>
                {i < process.length - 1 && <span className="process-connector">→</span>}
              </div>
            ))}
          </div>
        </FadeSection>

        {/* Tech Stack */}
        <FadeSection>
          <h1 className="rail-title" style={{ marginTop: 60, marginBottom: 24 }}>Technology Stack</h1>
          <div className="tech-stack-grid">
            {techStack.map((tech) => (
              <div className="tech-chip" key={tech}>{tech}</div>
            ))}
          </div>
        </FadeSection>

        {/* Behind the Scenes */}
        <FadeSection>
          <h1 className="rail-title" style={{ marginTop: 60, marginBottom: 24 }}>Behind the Scenes</h1>
          <div className="accordion-list">
            {behindTheScenes.map((item) => (
              <AccordionCard icon={item.icon} title={item.title} key={item.title}>
                {item.body}
              </AccordionCard>
            ))}
          </div>
        </FadeSection>

        {/* Testimonials */}
        <FadeSection>
          <h1 className="rail-title" style={{ marginTop: 60, marginBottom: 24, textAlign: "center" }}>
            What Customers Say
          </h1>
          <TestimonialCarousel />
        </FadeSection>

        {/* Vision */}
        <FadeSection>
          <h1 className="rail-title" style={{ marginTop: 60, marginBottom: 24 }}>Our Vision for the Future</h1>
          <div className="vision-grid">
            {vision.map((item) => (
              <div className="vision-card" key={item.title}>
                <span className="why-icon">{item.icon}</span>
                <h2>{item.title}</h2>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </FadeSection>

        {/* Achievements */}
        <FadeSection>
          <h1 className="rail-title" style={{ marginTop: 60, marginBottom: 24 }}>Milestones</h1>
          <div className="achievement-grid">
            {achievements.map((a) => (
              <div className="achievement-badge" key={a.label}>
                <span>{a.icon}</span>
                {a.label}
              </div>
            ))}
          </div>
        </FadeSection>

        {/* Global reach */}
        <FadeSection>
          <h1 className="rail-title" style={{ marginTop: 60, marginBottom: 24, textAlign: "center" }}>
            Where We're Headed
          </h1>
          <div className="map-illustration global-map">
            <div className="map-grid" />
            <span className="map-dot map-dot-1" />
            <span className="map-dot map-dot-2" />
            <span className="map-dot map-dot-3" />
            <span className="map-caption">Starting local, building toward nationwide delivery.</span>
          </div>
        </FadeSection>

        {/* Final CTA */}
        <FadeSection className="about-cta">
          <h1>Ready to see it for yourself?</h1>
          <div className="about-cta-actions">
            <Link to="/shop" className="btn btn-primary btn-hero">Explore Products</Link>
            <Link to="/compare" className="btn btn-outline">Compare Devices</Link>
            <Link to="/contact" className="btn btn-outline">Contact the Team</Link>
          </div>
        </FadeSection>
      </div>
    </div>
  );
}

export default About;
