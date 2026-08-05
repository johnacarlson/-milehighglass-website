import { Phone } from 'lucide-react';

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663185405705/XWktSgb6MUdpB4asHcYi7A/mhg_logo_cdb20e13.png";

export default function ThankYou() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--mhg-stone)", display: "flex", flexDirection: "column" }}>
      {/* Top Bar */}
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
        </div>
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
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "4rem",
          paddingBottom: "2rem",
          padding: "4rem 1rem 2rem",
        }}
      >
        <div style={{ maxWidth: "600px", textAlign: "center" }}>
          {/* Success Icon */}
          <div
            style={{
              fontSize: "4rem",
              marginBottom: "1.5rem",
              color: "var(--mhg-gold)",
            }}
          >
            ✓
          </div>

          {/* Heading */}
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "700",
              color: "var(--mhg-charcoal)",
              marginBottom: "1rem",
              fontFamily: "Oswald, sans-serif",
              letterSpacing: "-0.01em",
            }}
          >
            Thank You
          </h1>

          {/* Subheading */}
          <p
            style={{
              fontSize: "1.125rem",
              color: "#4b5563",
              marginBottom: "2rem",
              lineHeight: 1.6,
              fontFamily: "Source Serif 4, serif",
            }}
          >
            We appreciate your interest. Your quote request has been received, and our team will respond within 24 hours with a custom estimate.
          </p>

          {/* Secondary Message */}
          <div
            style={{
              background: "rgba(201, 168, 76, 0.1)",
              border: "1px solid rgba(201, 168, 76, 0.3)",
              borderRadius: "0.25rem",
              padding: "1.5rem",
              marginBottom: "2rem",
            }}
          >
            <p
              style={{
                color: "var(--mhg-charcoal)",
                fontSize: "0.95rem",
                lineHeight: 1.6,
                fontFamily: "Source Serif 4, serif",
              }}
            >
              In the meantime, if you have any urgent questions or want to expedite your estimate, feel free to call us directly. We're ready to help.
            </p>
          </div>

          {/* Call CTA */}
          <a
            href="tel:3034559552"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "var(--mhg-gold)",
              color: "var(--mhg-charcoal)",
              padding: "1rem 2rem",
              borderRadius: "0.125rem",
              fontSize: "1rem",
              fontWeight: "600",
              textDecoration: "none",
              fontFamily: "Oswald, sans-serif",
              letterSpacing: "0.05em",
              border: "none",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => e.target.style.background = "#b89a3d"}
            onMouseLeave={(e) => e.target.style.background = "var(--mhg-gold)"}
          >
            <Phone size={18} />
            Call 303-455-9552
          </a>

          {/* Contact Info */}
          <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid rgba(0,0,0,0.1)" }}>
            <p
              style={{
                fontSize: "0.875rem",
                color: "#6b7280",
                marginBottom: "0.5rem",
                fontFamily: "Source Serif 4, serif",
              }}
            >
              Questions? Reach out anytime:
            </p>
            <a
              href="mailto:admin@milehighglassdenver.com"
              style={{
                fontSize: "0.875rem",
                color: "var(--mhg-gold)",
                textDecoration: "none",
                fontFamily: "Source Serif 4, serif",
                fontWeight: "500",
              }}
            >
              admin@milehighglassdenver.com
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          padding: "2rem 1rem",
          borderTop: "1px solid rgba(0,0,0,0.1)",
          background: "rgba(0,0,0,0.02)",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "0.75rem",
            color: "#6b7280",
            fontFamily: "Source Serif 4, serif",
          }}
        >
          © 2026 Mile High Glass Denver. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
