import { useState } from "react";
import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";
import DealerForm from "./components/DealerForm";

export default function App() {
  const [view, setView] = useState("landing");

  if (view === "landing") {
    return <LandingPage onDemo={() => setView("dashboard")} />;
  }

  return (
    <>
      {/* Demo Navigation */}
      <div style={{
        position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)",
        zIndex: 200, display: "flex", alignItems: "center", gap: 4,
        background: "rgba(6,9,15,0.92)", borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.08)",
        padding: 4, backdropFilter: "blur(16px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)"
      }}>
        <button onClick={() => setView("landing")} className="demo-toggle-btn" style={{
          padding: "9px 18px", borderRadius: 8, border: "none",
          background: "rgba(255,255,255,0.04)",
          color: "#64748b", fontSize: 12, fontWeight: 700,
          cursor: "pointer", fontFamily: "var(--font)", transition: "all 0.2s"
        }}>← Back</button>
        {[["dashboard", "Buyer Dashboard"], ["dealer", "Dealer Form"]].map(([v, l]) => (
          <button key={v} onClick={() => setView(v)} className="demo-toggle-btn" style={{
            padding: "9px 18px", borderRadius: 8, border: "none",
            background: view === v ? "rgba(245,158,11,0.12)" : "transparent",
            color: view === v ? "#f59e0b" : "#64748b",
            fontSize: 12, fontWeight: 700, cursor: "pointer",
            fontFamily: "var(--font)", transition: "all 0.2s"
          }}>{l}</button>
        ))}
      </div>

      {/* Demo Label */}
      <div style={{
        position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)",
        zIndex: 200, padding: "8px 20px", borderRadius: 100,
        background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)",
        backdropFilter: "blur(12px)"
      }}>
        <span style={{ color: "#f59e0b", fontSize: 12, fontWeight: 700, fontFamily: "var(--font)", letterSpacing: "0.03em" }}>
          ⚡ Interactive Demo — Sample Data
        </span>
      </div>

      {view === "dashboard" ? <Dashboard /> : <DealerForm />}
    </>
  );
}
