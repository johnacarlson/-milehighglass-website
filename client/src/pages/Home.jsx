import { useState, useEffect, useRef } from 'react';
import {
  Phone,
  Star,
  CheckCircle2,
  ChevronDown,
  Shield,
  Clock,
  Award,
  Users,
  Droplets,
  Sun,
  Home as HomeIcon,
  Building2,
} from 'lucide-react';
import axios from 'axios';

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663185405705/XWktSgb6MUdpB4asHcYi7A/mhg_logo_cdb20e13.png";
const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663185405705/XWktSgb6MUdpB4asHcYi7A/mhg_hero_main-KFbHbqafoY4mdxZJbKhGxy.webp";
const SHOWER_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663185405705/XWktSgb6MUdpB4asHcYi7A/mhg_shower_service-bUjwPRZB4Mi4JoGGa9NBCy.webp";
const WINDOW_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663185405705/XWktSgb6MUdpB4asHcYi7A/mhg_window_service-baNnQ6x8WwNPud2aYqJKAV.webp";
const TINT_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663185405705/XWktSgb6MUdpB4asHcYi7A/mhg_tint_service-QKW8ysL9LQYaGL3CzjW4f9.webp";
const RESIDENTIAL_1 = "https://d2xsxph8kpxj0f.cloudfront.net/310519663185405705/XWktSgb6MUdpB4asHcYi7A/mhg_residential_1-fXZcvVr5MAKPTbA9fKjBGg.webp";
const RESIDENTIAL_2 = "https://d2xsxph8kpxj0f.cloudfront.net/310519663185405705/XWktSgb6MUdpB4asHcYi7A/mhg_residential_2-oRYytgohgRuGbcM6XTDj6r.webp";
const COMMERCIAL_1 = "https://d2xsxph8kpxj0f.cloudfront.net/310519663185405705/XWktSgb6MUdpB4asHcYi7A/mhg_commercial_1-6hpSPCsa9WAhDeZ3NSMEBm.webp";
const COMMERCIAL_2 = "https://d2xsxph8kpxj0f.cloudfront.net/310519663185405705/XWktSgb6MUdpB4asHcYi7A/mhg_commercial_2-HV4LjDN4WWKCGF86NzmmPM.webp";

const services = [
  {
    id: "shower-doors",
    label: "Shower Doors",
    icon: <Droplets size={22} />,
    image: SHOWER_IMG,
    headline: "Frameless Shower Doors — Installed in 5-7 Days",
    tagline: "Transform Your Bathroom Without a Full Remodel",
    description:
      "Crystal clear glass that stays spotless for 5+ years. No mold, no maintenance headaches, no compromise on luxury. We build frameless enclosures with premium hardware that make your bathroom feel like a high-end spa — at a fraction of the cost.",
    features: [
      "Professional installation in 5-7 days",
      "Frameless & semi-frameless options",
      "Stays crystal clear + spot-resistant coating",
      "Mold-resistant, rust-proof hardware",
      "Lifetime warranty on craftsmanship",
    ],
  },
  {
    id: "windows",
    label: "Window Replacement",
    icon: <HomeIcon size={22} />,
    image: WINDOW_IMG,
    headline: "Save ~30% on AC Bills — Energy-Efficient Windows",
    tagline: "Lower Bills. More Comfort. Higher Home Value.",
    description:
      "Colorado's harsh sun costs you money every month. Our professional window installation seals out summer heat and winter drafts — keeping your home comfortable year-round while cutting energy costs by an average of 30%. Plus boost your home value by $4K-$8K.",
    features: [
      "Save ~30% on annual AC/heating bills",
      "Insulated glass reduces outside noise",
      "Boost home value by $4K-$8K",
      "Built to withstand Colorado weather",
      "10-year performance guarantee",
    ],
  },
  {
    id: "window-tint",
    label: "Window Tinting",
    icon: <Sun size={22} />,
    image: TINT_IMG,
    headline: "Professional Window Tinting — Blocks 99% of UV",
    tagline: "Stay Cool. Protect Your Furniture. Keep Your Privacy.",
    description:
      "Professional window film that rejects solar heat (lower AC costs), blocks 99% of UV rays (protects skin & furniture), and adds daytime privacy — all while keeping your crystal clear view. Zero peeling, zero bubbling, zero hassle.",
    features: [
      "Rejects solar heat — lower AC costs",
      "Blocks 99% of UV rays (protects furniture & skin)",
      "Daytime privacy without darkness",
      "Reduces glare on screens & surfaces",
      "10+ year durability guarantee",
    ],
  },
  {
    id: "residential",
    label: "Residential Glass",
    icon: <HomeIcon size={22} />,
    image: RESIDENTIAL_1,
    headline: "Custom Residential Glass — Railings, Mirrors, Panels",
    tagline: "Precision Craftsmanship. Every Detail Matters.",
    description:
      "Glass railings that make your deck feel luxurious. Custom mirrors that brighten your space. Decorative panels that complete your design vision. We measure once, install perfectly — every time.",
    features: [
      "Custom glass railings & balustrades",
      "Bespoke mirrors & decorative panels",
      "Glass shelving & tabletops",
      "Same-day free estimates",
      "Precision installation guaranteed",
    ],
  },
  {
    id: "commercial",
    label: "Commercial Glass",
    icon: <Building2 size={22} />,
    image: COMMERCIAL_1,
    headline: "Commercial Glass Solutions — Fast Turnaround",
    tagline: "Built to Code. Zero Downtime. Built to Impress.",
    description:
      "Retail storefronts, office partitions, large-scale glazing projects — we serve Denver businesses of all sizes. Our commercial team works around your schedule, minimizes downtime, and delivers code-compliant results that impress tenants and clients.",
    features: [
      "Storefront & entrance glass (fast turnaround)",
      "Office glass partitions (soundproof available)",
      "Commercial window replacement",
      "Code-compliant safety glass",
      "ADA-compliant installations",
    ],
  },
];

const testimonials = [
  {
    name: "Launi Pistone",
    location: "Denver, CO",
    stars: 5,
    text: "Mile High was great — super responsive, really nice, and helpful with answering my questions. The install team was super quick, considerate, and respectful. We had two small very old windows replaced and a crappy old film window glass replaced. They look a million bucks better now. Would be happy to use them again for future projects!",
    service: "Window Replacement",
    googleReviewUrl: "https://www.google.com/maps/place/Mile+High+Glass+Solutions/@39.7391743,-104.9920929,15z/data=!4m6!3m5!1s0x876b8778f000d87f:0xbece82300637b489!8m2!3d39.7391743!4d-104.9920929!16s%2Fg%2F11b6z8v8qp"
  },
  {
    name: "Maison Keehley",
    location: "Denver, CO",
    stars: 5,
    text: "I've worked with Mile High Glass several times and they've always been great to work with. They're professional, quick, and very thorough with their work. The team communicates well, shows up when they say they will, and makes sure everything is done right. I definitely recommend them and will keep using them for future projects.",
    service: "Commercial Glass & Renovation",
    googleReviewUrl: "https://www.google.com/maps/place/Mile+High+Glass+Solutions/@39.7391743,-104.9920929,15z/data=!4m6!3m5!1s0x876b8778f000d87f:0xbece82300637b489!8m2!3d39.7391743!4d-104.9920929!16s%2Fg%2F11b6z8v8qp"
  },
  {
    name: "Taylor Littleton",
    location: "Denver, CO",
    stars: 5,
    text: "Let me start off by saying that Quentin and team are beyond phenomenal! I had a client want room dividers that were literally custom in every way. Quentin problem-solved by coming with an exact plan to get the job executed to perfection! Him and his team were always on time, very communicative, and up for any challenge they faced. They also did the bathroom shower glass door for this client that came out seamlessly!",
    service: "Custom Glass & Shower Doors",
    googleReviewUrl: "https://www.google.com/maps/place/Mile+High+Glass+Solutions/@39.7391743,-104.9920929,15z/data=!4m6!3m5!1s0x876b8778f000d87f:0xbece82300637b489!8m2!3d39.7391743!4d-104.9920929!16s%2Fg%2F11b6z8v8qp"
  },
];

const stats = [
  { value: "40+", label: "Years Serving Denver" },
  { value: "1,000+", label: "Happy Customers" },
  { value: "100+", label: "Years Combined Experience" },
  { value: "Free", label: "Estimates — Always" },
];

const trustBadges = [
  { icon: <Shield size={20} />, text: "Licensed & Insured" },
  { icon: <Award size={20} />, text: "40+ Years Experience" },
  { icon: <Clock size={20} />, text: "Same-Day Estimates" },
  { icon: <Users size={20} />, text: "1,000+ Customers Served" },
];

function QuoteForm({ dark = true }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    zipCode: "",
    service: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setSubmitting(true);

    try {
      const response = await axios.post(
        "/api/leads/submit",
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          zipCode: formData.zipCode || undefined,
          service: formData.service || undefined,
          message: formData.message || undefined,
        }
      );

      if (response.data.success) {
        setSuccess(true);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          zipCode: "",
          service: "",
          message: "",
        });
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (err) {
      setError("Something went wrong. Please call us at (303) 455-9552.");
      console.error("Lead submission error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = dark ? "mhg-input" : "mhg-input";
  const labelClass = dark
    ? "block text-xs font-medium uppercase tracking-widest mb-1.5 text-white"
    : "block text-xs font-medium uppercase tracking-widest mb-1.5 text-white";

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem", padding: "2rem" }}>
      <div className="form-row-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        <div>
          <label className={labelClass} style={{ fontFamily: "Oswald, sans-serif", color: "white" }}>
            First Name *
          </label>
          <input
            name="firstName"
            required
            value={formData.firstName}
            onChange={handleChange}
            placeholder="John"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} style={{ fontFamily: "Oswald, sans-serif", color: "white" }}>
            Last Name *
          </label>
          <input
            name="lastName"
            required
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Smith"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass} style={{ fontFamily: "Oswald, sans-serif", color: "white" }}>
          Email Address *
        </label>
        <input
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
          placeholder="john@email.com"
          className={inputClass}
        />
      </div>

      <div className="form-row-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        <div>
          <label className={labelClass} style={{ fontFamily: "Oswald, sans-serif", color: "white" }}>
            Phone Number *
          </label>
          <input
            name="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={handleChange}
            placeholder="(303) 555-0000"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} style={{ fontFamily: "Oswald, sans-serif", color: "white" }}>
            Zip Code *
          </label>
          <input
            name="zipCode"
            required
            value={formData.zipCode}
            onChange={handleChange}
            placeholder="80201"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass} style={{ fontFamily: "Oswald, sans-serif", color: "white" }}>
          I'm Interested In *
        </label>
        <div style={{ position: "relative" }}>
          <select
            name="service"
            required
            value={formData.service}
            onChange={handleChange}
            className="mhg-select"
          >
            <option value="">Select a service...</option>
            <option value="shower-doors">Custom Shower Doors</option>
            <option value="window-replacement">Window Replacement</option>
            <option value="window-tinting">Window Tinting</option>
            <option value="mirrors">Custom Mirrors</option>
            <option value="commercial">Commercial Glass</option>
            <option value="other">Other / Not Sure</option>
          </select>
          <ChevronDown
            size={16}
            style={{
              position: "absolute",
              right: "0.75rem",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              color: "rgba(255,255,255,0.4)",
            }}
          />
        </div>
      </div>

      <div>
        <label className={`${labelClass} textarea-label`} style={{ fontFamily: "Oswald, sans-serif" }}>
          Tell Us About Your Project
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={3}
          placeholder="Briefly describe what you need..."
          className={inputClass}
          style={{ resize: "none" }}
        />
      </div>

      {error && (
        <p
          style={{
            textAlign: "center",
            fontSize: "0.875rem",
            padding: "0.75rem",
            borderRadius: "0.125rem",
            background: "rgba(220,38,38,0.15)",
            color: "#fca5a5",
            border: "1px solid rgba(220,38,38,0.3)",
            fontFamily: "Source Serif 4, serif",
          }}
        >
          {error}
        </p>
      )}

      {success && (
        <p
          style={{
            textAlign: "center",
            fontSize: "0.875rem",
            padding: "0.75rem",
            borderRadius: "0.125rem",
            background: "rgba(34,197,94,0.15)",
            color: "#86efac",
            border: "1px solid rgba(34,197,94,0.3)",
            fontFamily: "Source Serif 4, serif",
          }}
        >
          ✓ Thank you! We'll be in touch shortly.
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="btn-gold pulse-gold"
        style={{ width: "100%", justifyContent: "center", marginTop: "0.5rem" }}
      >
        {submitting ? "Submitting..." : "Get Your Free Estimate"}
      </button>

      <p
        style={{
          textAlign: "center",
          fontSize: "0.7rem",
          color: dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.6)",
          fontFamily: "Source Serif 4, serif",
          marginTop: "1rem",
          lineHeight: 1.4,
        }}
      >
        ✓ 100% Free Estimate — No Obligation<br/>
        ✓ Your info is secure & never shared<br/>
        ✓ We'll call within 24 hours
      </p>
    </form>
  );
}

export default function Home() {
  const [activeService, setActiveService] = useState(0);
  const formRef = useRef(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--mhg-offwhite)" }}>
      <style>{`
        @media (max-width: 640px) {
          .sticky-mobile-cta { display: flex !important; }
        }
        @media (max-width: 768px) {
          .container { padding-left: 1rem; padding-right: 1rem; }
          h1 { font-size: 2rem !important; }
          h2 { font-size: 1.5rem !important; }
          .hero-grid { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
          .form-row-2 { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 1rem !important; }
          .service-grid { grid-template-columns: 1fr !important; }
          .testimonials-grid { grid-template-columns: 1fr !important; }
          .service-content { padding: 1.5rem !important; }
          @media (max-width: 480px) {
            .hero-grid { gap: 1rem !important; padding-top: 2rem !important; padding-bottom: 2rem !important; }
            .stats-grid { grid-template-columns: 1fr !important; }
            .trust-badges { flex-direction: column; gap: 0.75rem; }
            .top-bar-phone { display: flex !important; }
            .top-bar-quote { display: none !important; }
          }
        }
      `}</style>
      {/* Sticky Top Bar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.625rem 1rem",
          background: "var(--mhg-charcoal)",
          boxShadow: "0 2px 20px rgba(0,0,0,0.4)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <img src={LOGO_URL} alt="Mile High Glass" style={{ height: "36px", width: "auto" }} />
          <span
            style={{
              display: "none",
              color: "white",
              fontWeight: "500",
              fontSize: "0.875rem",
              fontFamily: "Oswald, sans-serif",
              letterSpacing: "0.05em",
            }}
          >
            MILE HIGH GLASS
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <a
            href="tel:3034559552"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "white",
              fontWeight: "600",
              fontSize: "1rem",
              textDecoration: "none",
              fontFamily: "Oswald, sans-serif",
              letterSpacing: "0.05em",
            }}
          >
            <Phone size={16} style={{ color: "var(--mhg-gold)" }} />
            (303) 455-9552
          </a>
          <button
            onClick={scrollToForm}
            className="btn-gold"
            style={{ display: "none", fontSize: "0.875rem", padding: "0.5rem 1rem" }}
          >
            Free Quote
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          paddingTop: "4rem",
          background: "var(--mhg-charcoal)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${HERO_IMG})`,
            backgroundSize: "cover",
            backgroundPosition: "center right",
            opacity: 0.55,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(105deg, rgba(20,18,14,0.92) 0%, rgba(20,18,14,0.75) 45%, rgba(20,18,14,0.35) 100%)",
          }}
        />

        <div className="container" style={{ position: "relative", zIndex: 10, paddingTop: "4rem", paddingBottom: "6rem" }}>
          <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }}>
            <div>
              <div className="section-label">Denver's Premier Glass Specialists — 40+ Years, 1,000+ Satisfied Clients</div>
              <h1
                style={{
                  fontSize: "3.5rem",
                  fontWeight: "bold",
                  color: "white",
                  lineHeight: 1,
                  marginBottom: "1.5rem",
                  fontFamily: "Oswald, sans-serif",
                  letterSpacing: "-0.01em",
                }}
              >
                GLASS THAT
                <br />
                <span style={{ color: "var(--mhg-gold)" }}>TRANSFORMS</span>
                <br />
                YOUR SPACE
              </h1>
              <div
                style={{
                  backgroundColor: "rgba(201, 168, 76, 0.1)",
                  border: "1px solid rgba(201, 168, 76, 0.3)",
                  borderRadius: "0.25rem",
                  padding: "1rem",
                  marginBottom: "1.5rem",
                  fontSize: "0.875rem",
                  color: "var(--mhg-gold)",
                  fontWeight: "600",
                  fontFamily: "Oswald, sans-serif",
                  letterSpacing: "0.05em",
                  textAlign: "center",
                }}
              >
                ✓ 100% FREE ESTIMATE — NO OBLIGATION — SAME-DAY APPOINTMENTS AVAILABLE
              </div>
              <p
                style={{
                  fontSize: "1.125rem",
                  color: "#d1d5db",
                  marginBottom: "2rem",
                  maxWidth: "28rem",
                  lineHeight: 1.6,
                  fontFamily: "Source Serif 4, serif",
                }}
              >
                Frameless shower doors that stay crystal clear. Energy-efficient windows that cut AC bills by 30%. Professional window tinting that blocks 99% of UV rays. Mile High Glass delivers luxury results without the luxury price tag.
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
                {trustBadges.map((badge, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      fontSize: "0.875rem",
                      color: "#d1d5db",
                      fontFamily: "Source Serif 4, serif",
                    }}
                  >
                    <span style={{ color: "var(--mhg-gold)" }}>{badge.icon}</span>
                    {badge.text}
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
                <button onClick={scrollToForm} className="btn-gold" style={{ fontSize: "1rem" }}>
                  Get My Free Quote
                </button>
                <a href="tel:3034559552" className="btn-outline-gold" style={{ fontSize: "1rem", textDecoration: "none" }}>
                  <Phone size={18} /> Call Now
                </a>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1.5rem" }}>
                <div style={{ display: "flex" }}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill="var(--mhg-gold)"
                      style={{ color: "var(--mhg-gold)" }}
                    />
                  ))}
                </div>
                <span
                  style={{
                    fontSize: "0.875rem",
                    color: "#9ca3af",
                    fontFamily: "Source Serif 4, serif",
                  }}
                >
                  5.0 — Trusted by 1,000+ Denver homeowners
                </span>
              </div>
            </div>

            <div ref={formRef}>
              <div
                style={{
                  borderRadius: "0.125rem",
                  padding: "2rem",
                  background: "var(--mhg-charcoal-mid)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
                }}
              >
                <div style={{ marginBottom: "1.5rem" }}>
                  <div className="section-label">100% Free — No Obligation</div>
                  <h2
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                      color: "white",
                      fontFamily: "Oswald, sans-serif",
                    }}
                  >
                    Get Your Free Quote Today
                  </h2>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "#9ca3af",
                      marginTop: "0.25rem",
                      fontFamily: "Source Serif 4, serif",
                    }}
                  >
                    We'll respond within 24 hours with a custom estimate.
                  </p>
                </div>
                <QuoteForm dark={true} />
              </div>
            </div>
          </div>
        </div>

        <div style={{ position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", color: "#6b7280" }}>
          <span
            style={{
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              fontFamily: "Oswald, sans-serif",
            }}
          >
            Explore
          </span>
          <ChevronDown size={20} style={{ animation: "bounce 2s infinite" }} />
        </div>
      </section>

      {/* Stats Bar */}
      <section style={{ background: "var(--mhg-gold)", padding: "2rem 0" }}>
        <div className="container">
          <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }}>
            {stats.map((stat, i) => (
              <div key={i} className="reveal stat-card" style={{ textAlign: "center", transitionDelay: `${i * 0.1}s` }}>
                <div
                  style={{
                    fontSize: "2.25rem",
                    fontWeight: "bold",
                    fontFamily: "Oswald, sans-serif",
                    color: "var(--mhg-charcoal)",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    marginTop: "0.25rem",
                    fontFamily: "Source Serif 4, serif",
                    color: "rgba(20,18,14,0.75)",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section style={{ paddingTop: "5rem", paddingBottom: "7rem", background: "var(--mhg-offwhite)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }} className="reveal">
            <div className="section-label" style={{ borderLeft: "none", paddingLeft: 0, margin: "0 auto 0.5rem" }}>
              What We Do
            </div>
            <h2
              style={{
                fontSize: "2.25rem",
                fontWeight: "bold",
                marginTop: "0.5rem",
                fontFamily: "Oswald, sans-serif",
                color: "var(--mhg-charcoal)",
              }}
            >
              GLASS SOLUTIONS FOR EVERY SPACE
            </h2>
            <p
              style={{
                fontSize: "1.125rem",
                color: "#4b5563",
                marginTop: "1rem",
                maxWidth: "42rem",
                margin: "1rem auto 0",
                fontFamily: "Source Serif 4, serif",
              }}
            >
              Whether it's a master bath makeover, energy-efficient windows, or professional
              window film — we tailor every job to fit your layout, style, and budget.
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginBottom: "2.5rem", flexWrap: "wrap" }} className="reveal">
            {services.map((service, i) => (
              <button
                key={service.id}
                onClick={() => setActiveService(i)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.625rem 1.25rem",
                  borderRadius: "0.125rem",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  fontFamily: "Oswald, sans-serif",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  background: activeService === i ? "var(--mhg-charcoal)" : "transparent",
                  color: activeService === i ? "var(--mhg-gold)" : "var(--mhg-charcoal)",
                  border: `2px solid var(--mhg-charcoal)`,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {service.icon}
                {service.label}
              </button>
            ))}
          </div>

          {services.map((service, i) =>
            i === activeService ? (
              <div
                key={service.id}
                className="service-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 0,
                  overflow: "hidden",
                  borderRadius: "0.125rem",
                  boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
                }}
              >
                <div style={{ position: "relative", minHeight: "18rem" }}>
                  <img
                    src={service.image}
                    alt={service.headline}
                    style={{ width: "100%", height: "100%", objectFit: "cover", minHeight: "320px" }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to right, rgba(20,18,14,0.3) 0%, transparent 60%)",
                    }}
                  />
                </div>
                <div
                  className="service-content"
                  style={{
                    padding: "2rem 3rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    background: "var(--mhg-charcoal)",
                  }}
                >
                  <div className="section-label">{service.label}</div>
                  <h3
                    style={{
                      fontSize: "1.875rem",
                      fontWeight: "bold",
                      color: "white",
                      marginBottom: "0.75rem",
                      fontFamily: "Oswald, sans-serif",
                    }}
                  >
                    {service.headline}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      marginBottom: "1rem",
                      color: "var(--mhg-gold)",
                      fontFamily: "Source Serif 4, serif",
                      fontStyle: "italic",
                    }}
                  >
                    {service.tagline}
                  </p>
                  <p
                    style={{
                      color: "#d1d5db",
                      lineHeight: 1.6,
                      marginBottom: "1.5rem",
                      fontFamily: "Source Serif 4, serif",
                    }}
                  >
                    {service.description}
                  </p>
                  <ul style={{ marginBottom: "2rem" }}>
                    {service.features.map((f, fi) => (
                      <li
                        key={fi}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "0.5rem",
                          fontSize: "0.875rem",
                          color: "#d1d5db",
                          marginBottom: "0.5rem",
                          fontFamily: "Source Serif 4, serif",
                        }}
                      >
                        <CheckCircle2
                          size={16}
                          style={{
                            marginTop: "0.125rem",
                            flexShrink: 0,
                            color: "var(--mhg-gold)",
                          }}
                        />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={scrollToForm}
                    className="btn-gold"
                    style={{ alignSelf: "flex-start" }}
                  >
                    Get a Free Quote
                  </button>
                </div>
              </div>
            ) : null
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ paddingTop: "5rem", paddingBottom: "7rem", background: "var(--mhg-stone)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }} className="reveal">
            <div className="section-label" style={{ borderLeft: "none", paddingLeft: 0, margin: "0 auto 0.5rem" }}>
              What Customers Say
            </div>
            <h2
              style={{
                fontSize: "2.25rem",
                fontWeight: "bold",
                marginTop: "0.5rem",
                fontFamily: "Oswald, sans-serif",
                color: "var(--mhg-charcoal)",
              }}
            >
              REAL REVIEWS FROM REAL DENVERITES
            </h2>
            <a
              href="https://www.google.com/maps/place/Mile+High+Glass+Solutions/@39.7391743,-104.9920929,15z/data=!4m6!3m5!1s0x876b8778f000d87f:0xbece82300637b489!8m2!3d39.7391743!4d-104.9920929!16s%2Fg%2F11b6z8v8qp"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                marginTop: "1rem",
                padding: "0.625rem 1rem",
                background: "white",
                border: "1px solid #dadce0",
                borderRadius: "0.25rem",
                textDecoration: "none",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#3c4043",
                fontFamily: "Source Serif 4, serif",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
                e.currentTarget.style.background = "#f8f9fa";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.background = "white";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "20px", height: "20px", fontSize: "14px", fontWeight: "bold", color: "#EA4335" }}>
                G
              </div>
              Verified on Google
            </a>
          </div>

          <div className="testimonials-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="reveal testimonial-card"
                style={{
                  padding: "2rem",
                  borderRadius: "0.125rem",
                  background: "white",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
                  borderTop: "3px solid var(--mhg-gold)",
                  transitionDelay: `${i * 0.1}s`,
                }}
              >
                <div style={{ display: "flex", marginBottom: "1rem" }}>
                  {[...Array(t.stars)].map((_, si) => (
                    <Star
                      key={si}
                      size={16}
                      fill="var(--mhg-gold)"
                      style={{ color: "var(--mhg-gold)" }}
                    />
                  ))}
                </div>
                <blockquote
                  style={{
                    color: "#4b5563",
                    lineHeight: 1.6,
                    marginBottom: "1.5rem",
                    fontSize: "0.875rem",
                    fontFamily: "Source Serif 4, serif",
                    fontStyle: "italic",
                  }}
                >
                  "{t.text}"
                </blockquote>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "9999px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.875rem",
                      fontWeight: "bold",
                      background: "var(--mhg-charcoal)",
                      color: "var(--mhg-gold)",
                      fontFamily: "Oswald, sans-serif",
                    }}
                  >
                    {t.name[0]}
                  </div>
                  <div>
                    <a
                      href={t.googleReviewUrl !== "#" ? t.googleReviewUrl : undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontWeight: "600",
                        fontSize: "0.875rem",
                        fontFamily: "Oswald, sans-serif",
                        color: t.googleReviewUrl !== "#" ? "var(--mhg-gold)" : "var(--mhg-charcoal)",
                        textDecoration: t.googleReviewUrl !== "#" ? "underline" : "none",
                        cursor: t.googleReviewUrl !== "#" ? "pointer" : "default",
                        display: "block",
                      }}
                    >
                      {t.name}
                    </a>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#6b7280",
                        fontFamily: "Source Serif 4, serif",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {t.service}
                    </div>
                    <div
                      style={{
                        fontSize: "0.7rem",
                        color: "#9ca3af",
                        fontFamily: "Source Serif 4, serif",
                        fontStyle: "italic",
                      }}
                    >
                      {t.location}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ paddingTop: "5rem", paddingBottom: "5rem", background: "var(--mhg-offwhite)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }} className="reveal">
            <div className="section-label" style={{ borderLeft: "none", paddingLeft: 0, margin: "0 auto 0.5rem" }}>
              Questions Answered
            </div>
            <h2
              style={{
                fontSize: "2.25rem",
                fontWeight: "bold",
                marginTop: "0.5rem",
                fontFamily: "Oswald, sans-serif",
                color: "var(--mhg-charcoal)",
              }}
            >
              FREQUENTLY ASKED QUESTIONS
            </h2>
          </div>

          <div style={{ maxWidth: "42rem", margin: "0 auto" }}>
            {[
              {
                q: "How much do shower doors cost?",
                a: "Frameless shower doors typically range from $2,500–$6,000 depending on size, glass type, and hardware. We provide a free, no-obligation estimate so you know exactly what to expect.",
              },
              {
                q: "How long does installation take?",
                a: "Most shower door installations are completed in 5–7 days. Window replacement takes 7–10 days. We schedule around your timeline and minimize disruption.",
              },
              {
                q: "How much can I save on my AC bills?",
                a: "Energy-efficient windows typically reduce AC/heating costs by 20–30% annually. We provide a free energy audit and can show you projected savings before you decide.",
              },
              {
                q: "Are you licensed and insured?",
                a: "Yes. We're fully licensed in Colorado and carry comprehensive liability and workers' compensation insurance. Verification available upon request.",
              },
              {
                q: "Do you offer financing?",
                a: "Yes! We work with several financing partners offering flexible payment plans with competitive rates. Ask about options when we call with your estimate.",
              },
              {
                q: "What's your warranty?",
                a: "We guarantee all installation craftsmanship for life. Glass products come with manufacturer warranties (typically 5–10 years). Details provided with your estimate.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  marginBottom: "1.5rem",
                  padding: "1.5rem",
                  background: "white",
                  borderLeft: "3px solid var(--mhg-gold)",
                  borderRadius: "0.125rem",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{
                    fontWeight: "600",
                    fontSize: "0.95rem",
                    color: "var(--mhg-charcoal)",
                    marginBottom: "0.5rem",
                    fontFamily: "Oswald, sans-serif",
                  }}
                >
                  {item.q}
                </div>
                <div
                  style={{
                    fontSize: "0.875rem",
                    color: "#4b5563",
                    lineHeight: 1.6,
                    fontFamily: "Source Serif 4, serif",
                  }}
                >
                  {item.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section
        style={{
          paddingTop: "5rem",
          paddingBottom: "7rem",
          background: "var(--mhg-charcoal)",
        }}
      >
        <div className="container">
          <div style={{ maxWidth: "42rem", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "2.5rem" }} className="reveal">
              <div className="section-label" style={{ borderLeft: "none", paddingLeft: 0, margin: "0 auto 0.5rem" }}>
                Free Consultation
              </div>
              <h2
                style={{
                  fontSize: "2.25rem",
                  fontWeight: "bold",
                  color: "white",
                  marginTop: "0.5rem",
                  fontFamily: "Oswald, sans-serif",
                }}
              >
                READY FOR CRYSTAL CLEAR VIEWS?
              </h2>
              <p
                style={{
                  color: "#9ca3af",
                  marginTop: "1rem",
                  lineHeight: 1.6,
                  fontFamily: "Source Serif 4, serif",
                }}
              >
                Don't let damaged glass, outdated shower doors, or inefficient windows hold
                you back. Get your free, no-obligation estimate today. We serve Denver,
                Boulder, Aurora, Arvada, Westminster, Thornton, Littleton, and all
                surrounding areas.
              </p>
            </div>

            <div
              style={{
                padding: "2.5rem",
                borderRadius: "0.125rem",
                background: "var(--mhg-charcoal-mid)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
              }}
              className="reveal reveal-delay-1"
            >
              <QuoteForm dark={true} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.5rem", marginTop: "2.5rem" }} className="reveal reveal-delay-2">
              <a
                href="tel:3034559552"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "white",
                  fontWeight: "600",
                  textDecoration: "none",
                  fontFamily: "Oswald, sans-serif",
                  letterSpacing: "0.05em",
                }}
              >
                <Phone size={18} style={{ color: "var(--mhg-gold)" }} />
                (303) 455-9552
              </a>
              <span style={{ color: "#4b5563", display: "none" }}>|</span>
              <a
                href="mailto:Admin@MileHighGlassDenver.com"
                style={{
                  color: "#9ca3af",
                  fontSize: "0.875rem",
                  textDecoration: "none",
                  fontFamily: "Source Serif 4, serif",
                  transition: "color 0.2s",
                }}
              >
                Admin@MileHighGlassDenver.com
              </a>
              <div
                style={{
                  marginTop: "1.5rem",
                  padding: "1.5rem",
                  background: "rgba(201, 168, 76, 0.08)",
                  border: "1px solid rgba(201, 168, 76, 0.2)",
                  borderRadius: "0.25rem",
                  textAlign: "center",
                  fontSize: "0.85rem",
                  color: "#d1d5db",
                  lineHeight: 1.5,
                  fontFamily: "Source Serif 4, serif",
                }}
              >
                <div style={{ color: "var(--mhg-gold)", fontWeight: "600", marginBottom: "0.5rem", fontFamily: "Oswald, sans-serif" }}>
                  ✓ FINANCING AVAILABLE
                </div>
                <div>
                  Flexible payment plans with approved credit. We work with multiple lenders to make your project affordable.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Mobile CTA */}
      <div
        className="sticky-mobile-cta"
        style={{
          display: "none",
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          background: "var(--mhg-charcoal)",
          borderTop: "2px solid var(--mhg-gold)",
          padding: "0.75rem 1rem",
          boxShadow: "0 -4px 12px rgba(0,0,0,0.2)",
          gap: "0.75rem",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <a
          href="tel:3034559552"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "var(--mhg-gold)",
            fontWeight: "600",
            fontSize: "0.95rem",
            textDecoration: "none",
            fontFamily: "Oswald, sans-serif",
            flex: 1,
          }}
        >
          <Phone size={18} />
          (303) 455-9552
        </a>
        <button
          onClick={scrollToForm}
          style={{
            background: "var(--mhg-gold)",
            color: "var(--mhg-charcoal)",
            border: "none",
            padding: "0.65rem 1.25rem",
            borderRadius: "0.125rem",
            fontWeight: "600",
            fontSize: "0.85rem",
            cursor: "pointer",
            fontFamily: "Oswald, sans-serif",
            whiteSpace: "nowrap",
          }}
        >
          FREE ESTIMATE
        </button>
      </div>

      {/* Footer */}
      <footer
        style={{
          padding: "2rem 0",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          background: "var(--mhg-charcoal)",
        }}
      >
        <div className="container" style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "flex-start" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <img src={LOGO_URL} alt="Mile High Glass" style={{ height: "32px", width: "auto" }} />
            <span
              style={{
                color: "#9ca3af",
                fontSize: "0.875rem",
                fontFamily: "Source Serif 4, serif",
              }}
            >
              © 2026 Mile High Glass Denver. All rights reserved.
            </span>
          </div>
          <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.75rem", fontFamily: "Source Serif 4, serif" }}>
            <a href="#privacy" style={{ color: "#9ca3af", textDecoration: "none" }}>
              Privacy Policy
            </a>
            <span style={{ color: "#4b5563" }}>•</span>
            <a href="#terms" style={{ color: "#9ca3af", textDecoration: "none" }}>
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
