export default function Logo({ size = 36 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.3 }}>
      <div style={{
        width: size, height: size,
        background: "linear-gradient(135deg, #f59e0b, #d97706)",
        borderRadius: size * 0.2,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 4px 16px rgba(245,158,11,0.25)"
      }}>
        <span style={{
          fontSize: size * 0.44, fontWeight: 900,
          color: "#06090f", fontFamily: "var(--font)",
          letterSpacing: "-0.04em"
        }}>LD</span>
      </div>
      <span style={{
        color: "#f1f5f9", fontSize: size * 0.56,
        fontWeight: 800, fontFamily: "var(--font)",
        letterSpacing: "-0.03em"
      }}>
        Lot<span style={{ color: "#f59e0b" }}>Duel</span>
      </span>
    </div>
  );
}
