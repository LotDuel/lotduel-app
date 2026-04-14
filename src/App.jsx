import { useState, useEffect } from "react";
import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";
import DealerForm from "./components/DealerForm";
import CreateRequest from "./components/CreateRequest";

function parseRoute() {
  const path = window.location.pathname;

  // /submit/:token — dealer form with real invite
  const submitMatch = path.match(/^\/submit\/([a-f0-9]+)$/);
  if (submitMatch) return { view: "dealer", token: submitMatch[1] };

  // /dashboard/:requestId — real dashboard
  const dashMatch = path.match(/^\/dashboard\/(\d+)$/);
  if (dashMatch) return { view: "dashboard", requestId: parseInt(dashMatch[1]) };

  // /new — create new vehicle request
  if (path === "/new") return { view: "create" };

  // /demo — interactive demo (sample data)
  if (path === "/demo") return { view: "demo-dashboard" };
  if (path === "/demo/dealer") return { view: "demo-dealer" };

  // / — landing page
  return { view: "landing" };
}

function navigate(path) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export default function App() {
  const [route, setRoute] = useState(parseRoute);

  useEffect(() => {
    const onNav = () => setRoute(parseRoute());
    window.addEventListener("popstate", onNav);
    return () => window.removeEventListener("popstate", onNav);
  }, []);

  // Landing page
  if (route.view === "landing") {
    return <LandingPage onDemo={() => navigate("/demo")} onCreate={() => navigate("/new")} />;
  }

  // Create request flow
  if (route.view === "create") {
    return <CreateRequest onDone={(requestId) => navigate(`/dashboard/${requestId}`)} onBack={() => navigate("/")} />;
  }

  // Real dealer form (from invite link)
  if (route.view === "dealer" && route.token) {
    return <DealerForm token={route.token} />;
  }

  // Demo or real dashboard/dealer
  const isDemo = route.view.startsWith("demo");
  const activeView = route.view === "demo-dashboard" ? "dashboard"
    : route.view === "demo-dealer" ? "dealer"
    : route.view;

  return (
    <>
      {/* Navigation Bar */}
      <div style={{
        position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)",
        zIndex: 200, display: "flex", alignItems: "center", gap: 4,
        background: "rgba(6,9,15,0.92)", borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.08)",
        padding: 4, backdropFilter: "blur(16px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)"
      }}>
        <button onClick={() => navigate("/")} className="demo-toggle-btn" style={{
          padding: "9px 18px", borderRadius: 8, border: "none",
          background: "rgba(255,255,255,0.04)",
          color: "#64748b", fontSize: 12, fontWeight: 700,
          cursor: "pointer", fontFamily: "var(--font)", transition: "all 0.2s"
        }}>← Back</button>

        {isDemo ? (
          [["demo-dashboard", "Buyer Dashboard"], ["demo-dealer", "Dealer Form"]].map(([v, l]) => (
            <button key={v} onClick={() => navigate(v === "demo-dashboard" ? "/demo" : "/demo/dealer")} className="demo-toggle-btn" style={{
              padding: "9px 18px", borderRadius: 8, border: "none",
              background: route.view === v ? "rgba(245,158,11,0.12)" : "transparent",
              color: route.view === v ? "#f59e0b" : "#64748b",
              fontSize: 12, fontWeight: 700, cursor: "pointer",
              fontFamily: "var(--font)", transition: "all 0.2s"
            }}>{l}</button>
          ))
        ) : (
          <span style={{ padding: "9px 18px", color: "#94a3b8", fontSize: 12, fontWeight: 600, fontFamily: "var(--font)" }}>
            Dashboard #{route.requestId}
          </span>
        )}
      </div>

      {isDemo && (
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
      )}

      {activeView === "dashboard" ? (
        <Dashboard requestId={isDemo ? null : route.requestId} demo={isDemo} />
      ) : (
        <DealerForm demo={true} />
      )}
    </>
  );
}
