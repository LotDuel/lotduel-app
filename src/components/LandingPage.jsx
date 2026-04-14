import Logo from "./Logo";

export default function LandingPage({ onDemo }) {
  return (
    <div style={{ background: "var(--bg)", color: "#f1f5f9", fontFamily: "var(--font)", position: "relative", overflow: "hidden" }}>

      {/* Grid Background */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        backgroundImage: "linear-gradient(rgba(245,158,11,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.03) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
        animation: "gridPulse 8s ease-in-out infinite"
      }} />

      {/* Radial Glow */}
      <div style={{
        position: "fixed", top: "-30%", left: "50%", transform: "translateX(-50%)",
        width: "120vw", height: "80vh",
        background: "radial-gradient(ellipse, rgba(245,158,11,0.06) 0%, transparent 65%)",
        zIndex: 0, pointerEvents: "none"
      }} />

      {/* Nav */}
      <nav className="anim-fade-up" style={{
        position: "relative", zIndex: 10,
        maxWidth: 1100, margin: "0 auto", padding: "28px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <Logo size={34} />
        <button onClick={onDemo} className="landing-cta" style={{
          padding: "10px 24px", background: "rgba(245,158,11,0.1)",
          border: "1px solid rgba(245,158,11,0.25)", borderRadius: 8,
          color: "#f59e0b", fontSize: 14, fontWeight: 700, cursor: "pointer",
          fontFamily: "var(--font)", transition: "all 0.3s ease"
        }}>
          See Demo
        </button>
      </nav>

      {/* Hero */}
      <section style={{
        position: "relative", zIndex: 10,
        maxWidth: 1100, margin: "0 auto", padding: "80px 24px 60px",
        textAlign: "center"
      }}>
        <div className="anim-fade-up anim-d1" style={{
          display: "inline-block", padding: "6px 18px", borderRadius: 100,
          background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.15)",
          marginBottom: 28
        }}>
          <span style={{ color: "#f59e0b", fontSize: 13, fontWeight: 600, letterSpacing: "0.03em" }}>
            Stop negotiating blind
          </span>
        </div>

        <h1 className="anim-fade-up anim-d2" style={{
          fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 900,
          lineHeight: 1.05, letterSpacing: "-0.04em",
          maxWidth: 800, margin: "0 auto 24px"
        }}>
          Make dealerships<br />
          <span style={{
            background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>compete for your deal</span>
        </h1>

        <p className="anim-fade-up anim-d3" style={{
          fontSize: "clamp(17px, 2vw, 20px)", color: "#94a3b8",
          maxWidth: 580, margin: "0 auto 40px", lineHeight: 1.6, fontWeight: 400
        }}>
          Send one request. Get multiple out-the-door quotes from local dealers.
          Compare side-by-side. Walk in with leverage.
        </p>

        <div className="anim-fade-up anim-d4" style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={onDemo} className="landing-cta" style={{
            padding: "16px 40px",
            background: "linear-gradient(135deg, #f59e0b, #d97706)",
            border: "none", borderRadius: 12,
            color: "#06090f", fontSize: 17, fontWeight: 800,
            cursor: "pointer", fontFamily: "var(--font)", letterSpacing: "-0.01em",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 24px rgba(245,158,11,0.25)"
          }}>
            See It In Action
          </button>
          <a href="#how-it-works" style={{
            padding: "16px 32px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid var(--border)", borderRadius: 12,
            color: "#94a3b8", fontSize: 17, fontWeight: 600,
            cursor: "pointer", fontFamily: "var(--font)", textDecoration: "none",
            transition: "all 0.3s ease"
          }}>
            How It Works
          </a>
        </div>

        {/* Stats */}
        <div className="anim-fade-up anim-d5" style={{
          marginTop: 48, display: "flex", alignItems: "center", justifyContent: "center", gap: 24, flexWrap: "wrap"
        }}>
          {[["7+", "Competing offers"], ["$1,800", "Avg. savings"], ["< 60 sec", "Dealer submit time"]].map(([val, label], i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: "#f59e0b", fontSize: 18, fontWeight: 800, fontFamily: "var(--mono)" }}>{val}</span>
              <span style={{ color: "#64748b", fontSize: 13, fontWeight: 500 }}>{label}</span>
              {i < 2 && <span style={{ color: "rgba(255,255,255,0.08)", margin: "0 8px", fontSize: 20 }}>|</span>}
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div style={{ maxWidth: 1100, margin: "40px auto", padding: "0 24px", position: "relative", zIndex: 10 }}>
        <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(245,158,11,0.2), transparent)" }} />
      </div>

      {/* Aha Section */}
      <section style={{
        position: "relative", zIndex: 10,
        maxWidth: 800, margin: "0 auto", padding: "40px 24px 60px", textAlign: "center"
      }}>
        <p style={{
          fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 600,
          color: "#cbd5e1", lineHeight: 1.5, letterSpacing: "-0.02em"
        }}>
          Most buyers negotiate with{" "}
          <span style={{ color: "#ef4444", fontWeight: 800, textDecoration: "line-through", textDecorationColor: "rgba(239,68,68,0.4)" }}>one dealership</span>.
          <br />
          With LotDuel, you'll have{" "}
          <span style={{
            background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 900
          }}>ten negotiating against each other</span>.
        </p>
      </section>

      {/* How It Works */}
      <section id="how-it-works" style={{
        position: "relative", zIndex: 10,
        maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px"
      }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{
            display: "inline-block", padding: "5px 16px", borderRadius: 100,
            background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", marginBottom: 16
          }}>
            <span style={{ color: "#64748b", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>How It Works</span>
          </div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, letterSpacing: "-0.03em" }}>
            Four steps to a <span style={{ color: "#f59e0b" }}>better deal</span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 20 }}>
          {[
            { num: "01", icon: "🎯", title: "Pick your car", desc: "Tell us exactly what you want — make, model, year range, mileage, and how far you'll drive to get it." },
            { num: "02", icon: "📨", title: "Send your request", desc: "We generate a clean, professional quote request. Send it to every dealer in your radius with one click." },
            { num: "03", icon: "⚔️", title: "Dealers compete", desc: "Dealers submit real OTD prices through your secure link. No phone tag. No pressure. Just numbers." },
            { num: "04", icon: "🏆", title: "Choose the winner", desc: "Compare offers ranked by price, value, and extras. Walk into the best deal with full leverage." }
          ].map((step, i) => (
            <div key={i} className="step-card" style={{
              background: "rgba(255,255,255,0.02)", borderRadius: 16, padding: "32px 28px",
              border: "1px solid var(--border)", transition: "all 0.35s ease", cursor: "default", position: "relative"
            }}>
              <div style={{
                position: "absolute", top: 20, right: 20,
                color: "rgba(245,158,11,0.12)", fontSize: 48, fontWeight: 900,
                fontFamily: "var(--mono)", lineHeight: 1
              }}>{step.num}</div>
              <div style={{ fontSize: 32, marginBottom: 16 }}>{step.icon}</div>
              <h3 style={{ fontSize: 19, fontWeight: 700, marginBottom: 10, letterSpacing: "-0.02em" }}>{step.title}</h3>
              <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.65, fontWeight: 400 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Demo CTA */}
      <section style={{
        position: "relative", zIndex: 10,
        maxWidth: 800, margin: "0 auto", padding: "40px 24px 80px", textAlign: "center"
      }}>
        <div style={{
          background: "linear-gradient(135deg, rgba(245,158,11,0.06), rgba(245,158,11,0.02))",
          borderRadius: 24, padding: "56px 40px",
          border: "1px solid rgba(245,158,11,0.12)", position: "relative", overflow: "hidden"
        }}>
          <div style={{
            position: "absolute", top: "-50%", right: "-20%",
            width: 400, height: 400,
            background: "radial-gradient(circle, rgba(245,158,11,0.08), transparent 70%)",
            pointerEvents: "none"
          }} />
          <h2 style={{ fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 12, position: "relative" }}>
            See the dashboard in action
          </h2>
          <p style={{ color: "#94a3b8", fontSize: 16, marginBottom: 32, position: "relative", maxWidth: 460, margin: "0 auto 32px" }}>
            Explore a live demo with real dealer data. Click through offers, compare scores, and feel what it's like to have leverage.
          </p>
          <button onClick={onDemo} className="landing-cta" style={{
            padding: "18px 48px",
            background: "linear-gradient(135deg, #f59e0b, #d97706)",
            border: "none", borderRadius: 14,
            color: "#06090f", fontSize: 18, fontWeight: 800,
            cursor: "pointer", fontFamily: "var(--font)",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 32px rgba(245,158,11,0.3)",
            animation: "pulseGlow 3s ease-in-out infinite",
            position: "relative"
          }}>
            Launch Demo →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        position: "relative", zIndex: 10,
        maxWidth: 1100, margin: "0 auto", padding: "32px 24px",
        borderTop: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16
      }}>
        <Logo size={26} />
        <p style={{ color: "#475569", fontSize: 13, fontWeight: 400 }}>© 2026 LotDuel. Built in Washington State.</p>
      </footer>
    </div>
  );
}
