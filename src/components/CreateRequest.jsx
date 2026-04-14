import { useState } from "react";
import Logo from "./Logo";
import { createUser, createRequest, createInvite, updateRequest } from "../api";

const STEPS = ["vehicle", "dealers", "invites"];

export default function CreateRequest({ onDone, onBack }) {
  const [step, setStep] = useState("vehicle");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // User info
  const [user, setUser] = useState({ name: "", email: "" });
  // Vehicle request
  const [vehicle, setVehicle] = useState({
    make: "Toyota", model: "RAV4 Hybrid",
    yearMin: "2022", yearMax: "2023",
    trims: "LE, XLE, SE",
    mileageMax: "40000", zip: "", radius: "50",
    marketValue: "", notes: "",
  });
  // Request ID (after creation)
  const [requestId, setRequestId] = useState(null);
  // Dealers to invite
  const [dealers, setDealers] = useState([{ name: "", city: "", state: "WA" }]);
  // Generated invites
  const [invites, setInvites] = useState([]);
  const [copiedIdx, setCopiedIdx] = useState(null);

  // ── Step 1: Vehicle Info ────────────────────────────────────────

  const handleVehicleSubmit = async () => {
    if (!user.name || !user.email || !vehicle.zip) {
      setError("Please fill in your name, email, and zip code.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Create or get user
      const u = await createUser(user.name, user.email);

      // Create vehicle request
      const trimTargets = vehicle.trims.split(",").map((t) => t.trim()).filter(Boolean);
      const vr = await createRequest({
        user_id: u.id,
        make: vehicle.make,
        model: vehicle.model,
        year_min: parseInt(vehicle.yearMin),
        year_max: parseInt(vehicle.yearMax),
        trim_targets: trimTargets,
        mileage_max: parseInt(vehicle.mileageMax),
        zip_code: vehicle.zip,
        radius_miles: parseInt(vehicle.radius),
        market_value: vehicle.marketValue ? parseInt(vehicle.marketValue) : null,
        notes: vehicle.notes || null,
      });

      setRequestId(vr.id);
      setStep("dealers");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Add Dealers ─────────────────────────────────────────

  const addDealer = () => setDealers([...dealers, { name: "", city: "", state: "WA" }]);
  const removeDealer = (i) => setDealers(dealers.filter((_, idx) => idx !== i));
  const updateDealer = (i, field, val) => {
    const copy = [...dealers];
    copy[i] = { ...copy[i], [field]: val };
    setDealers(copy);
  };

  const handleDealersSubmit = async () => {
    const valid = dealers.filter((d) => d.name.trim());
    if (valid.length === 0) {
      setError("Add at least one dealer.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const results = [];
      for (const d of valid) {
        const inv = await createInvite(requestId, {
          dealer_name: d.name.trim(),
          dealer_city: d.city.trim(),
          dealer_state: d.state.trim(),
        });
        results.push(inv);
      }
      setInvites(results);
      setStep("invites");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: Invite Links + Emails ───────────────────────────────

  const copyEmail = (idx) => {
    const inv = invites[idx];
    const text = `Subject: ${inv.email_subject}\n\n${inv.email_body}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    });
  };

  const openGmail = (idx) => {
    const inv = invites[idx];
    const subject = encodeURIComponent(inv.email_subject);
    const body = encodeURIComponent(inv.email_body);
    window.open(`https://mail.google.com/mail/?view=cm&su=${subject}&body=${body}`, "_blank");
  };

  // ── Shared styles ───────────────────────────────────────────────

  const inp = (err) => ({
    width: "100%", padding: "13px 16px", background: "rgba(255,255,255,0.04)",
    border: `1px solid ${err ? "var(--red)" : "rgba(255,255,255,0.08)"}`,
    borderRadius: 10, color: "#f1f5f9", fontSize: 15, fontFamily: "var(--font)",
    outline: "none", boxSizing: "border-box", transition: "border 0.2s"
  });
  const lbl = { color: "#94a3b8", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 7, display: "block" };

  const stepIdx = STEPS.indexOf(step);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", padding: "48px 20px", fontFamily: "var(--font)" }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Logo size={34} />
          <h1 style={{ color: "#f1f5f9", fontSize: 28, fontWeight: 800, margin: "24px 0 8px", letterSpacing: "-0.03em" }}>
            {step === "vehicle" ? "What are you looking for?" : step === "dealers" ? "Which dealers to invite?" : "Your invite links are ready"}
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 14, marginTop: 4 }}>
            Step {stepIdx + 1} of {STEPS.length}
          </p>
        </div>

        {/* Progress bar */}
        <div style={{ display: "flex", gap: 6, marginBottom: 36 }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{
              flex: 1, height: 4, borderRadius: 4,
              background: i <= stepIdx ? "var(--amber)" : "rgba(255,255,255,0.06)",
              transition: "background 0.3s"
            }} />
          ))}
        </div>

        {/* Error */}
        {error && (
          <div style={{
            padding: "14px 20px", marginBottom: 22, borderRadius: 12,
            background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
            color: "#ef4444", fontSize: 14, fontWeight: 600
          }}>
            {error}
          </div>
        )}

        {/* ── STEP 1: Vehicle ────────────────────────────────────────── */}
        {step === "vehicle" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div><label style={lbl}>Your Name *</label><input value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} placeholder="Rob" style={inp(!user.name && error)} /></div>
              <div><label style={lbl}>Your Email *</label><input value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} placeholder="rob@email.com" style={inp(!user.email && error)} /></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div><label style={lbl}>Make</label><input value={vehicle.make} onChange={(e) => setVehicle({ ...vehicle, make: e.target.value })} style={inp(false)} /></div>
              <div><label style={lbl}>Model</label><input value={vehicle.model} onChange={(e) => setVehicle({ ...vehicle, model: e.target.value })} style={inp(false)} /></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              <div><label style={lbl}>Year Min</label><input value={vehicle.yearMin} onChange={(e) => setVehicle({ ...vehicle, yearMin: e.target.value })} style={inp(false)} /></div>
              <div><label style={lbl}>Year Max</label><input value={vehicle.yearMax} onChange={(e) => setVehicle({ ...vehicle, yearMax: e.target.value })} style={inp(false)} /></div>
              <div><label style={lbl}>Max Mileage</label><input value={vehicle.mileageMax} onChange={(e) => setVehicle({ ...vehicle, mileageMax: e.target.value.replace(/[^0-9]/g, "") })} style={inp(false)} /></div>
            </div>
            <div><label style={lbl}>Target Trims (comma separated)</label><input value={vehicle.trims} onChange={(e) => setVehicle({ ...vehicle, trims: e.target.value })} placeholder="LE, XLE, SE" style={inp(false)} /></div>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
              <div><label style={lbl}>Your Zip Code *</label><input value={vehicle.zip} onChange={(e) => setVehicle({ ...vehicle, zip: e.target.value })} placeholder="98258" style={inp(!vehicle.zip && error)} /></div>
              <div><label style={lbl}>Radius (mi)</label><input value={vehicle.radius} onChange={(e) => setVehicle({ ...vehicle, radius: e.target.value })} style={inp(false)} /></div>
            </div>
            <div><label style={lbl}>Market Value (optional)</label><input value={vehicle.marketValue} onChange={(e) => setVehicle({ ...vehicle, marketValue: e.target.value.replace(/[^0-9]/g, "") })} placeholder="e.g. 28500 from KBB" style={inp(false)} /></div>
            <div><label style={lbl}>Notes (optional)</label><textarea value={vehicle.notes} onChange={(e) => setVehicle({ ...vehicle, notes: e.target.value })} placeholder="Any preferences or details..." rows={2} style={{ ...inp(false), resize: "vertical" }} /></div>

            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <button onClick={onBack} style={{
                padding: "16px 28px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)",
                background: "transparent", color: "#94a3b8", fontSize: 15, fontWeight: 700,
                cursor: "pointer", fontFamily: "var(--font)"
              }}>← Back</button>
              <button onClick={handleVehicleSubmit} disabled={loading} className="landing-cta" style={{
                flex: 1, padding: "16px",
                background: loading ? "rgba(245,158,11,0.5)" : "linear-gradient(135deg, var(--amber), var(--amber-dark))",
                border: "none", borderRadius: 12, color: "var(--bg)", fontSize: 16, fontWeight: 800,
                cursor: loading ? "wait" : "pointer", fontFamily: "var(--font)",
                boxShadow: "0 4px 20px rgba(245,158,11,0.25)"
              }}>{loading ? "Creating..." : "Next → Add Dealers"}</button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Dealers ────────────────────────────────────────── */}
        {step === "dealers" && (
          <div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {dealers.map((d, i) => (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: "2fr 1fr 60px 36px", gap: 10, alignItems: "end"
                }}>
                  <div><label style={lbl}>Dealer Name *</label><input value={d.name} onChange={(e) => updateDealer(i, "name", e.target.value)} placeholder="Rodland Toyota" style={inp(false)} /></div>
                  <div><label style={lbl}>City</label><input value={d.city} onChange={(e) => updateDealer(i, "city", e.target.value)} placeholder="Everett" style={inp(false)} /></div>
                  <div><label style={lbl}>State</label><input value={d.state} onChange={(e) => updateDealer(i, "state", e.target.value)} maxLength={2} style={inp(false)} /></div>
                  {dealers.length > 1 && (
                    <button onClick={() => removeDealer(i)} style={{
                      width: 36, height: 44, border: "1px solid rgba(239,68,68,0.2)",
                      background: "rgba(239,68,68,0.06)", borderRadius: 10,
                      color: "#ef4444", fontSize: 18, cursor: "pointer", marginBottom: 0
                    }}>×</button>
                  )}
                </div>
              ))}
            </div>

            <button onClick={addDealer} style={{
              width: "100%", padding: "14px", marginTop: 14, borderRadius: 10,
              border: "1px dashed rgba(255,255,255,0.1)", background: "transparent",
              color: "#64748b", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font)"
            }}>+ Add Another Dealer</button>

            <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
              <button onClick={() => setStep("vehicle")} style={{
                padding: "16px 28px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)",
                background: "transparent", color: "#94a3b8", fontSize: 15, fontWeight: 700,
                cursor: "pointer", fontFamily: "var(--font)"
              }}>← Back</button>
              <button onClick={handleDealersSubmit} disabled={loading} className="landing-cta" style={{
                flex: 1, padding: "16px",
                background: loading ? "rgba(245,158,11,0.5)" : "linear-gradient(135deg, var(--amber), var(--amber-dark))",
                border: "none", borderRadius: 12, color: "var(--bg)", fontSize: 16, fontWeight: 800,
                cursor: loading ? "wait" : "pointer", fontFamily: "var(--font)",
                boxShadow: "0 4px 20px rgba(245,158,11,0.25)"
              }}>{loading ? `Generating invites (${invites.length}/${dealers.filter(d => d.name.trim()).length})...` : "Generate Invite Links →"}</button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Invite Links ───────────────────────────────────── */}
        {step === "invites" && (
          <div>
            <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
              Copy each email and send it from your own Gmail or Outlook. Dealers will click the link and submit their best OTD quote directly to your dashboard.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {invites.map((inv, i) => (
                <div key={i} style={{
                  background: "rgba(255,255,255,0.02)", borderRadius: 14,
                  padding: "22px 24px", border: "1px solid var(--border)"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div>
                      <div style={{ color: "#f1f5f9", fontSize: 16, fontWeight: 700 }}>{inv.dealer?.name || `Dealer ${i + 1}`}</div>
                      {inv.dealer?.city && <div style={{ color: "#64748b", fontSize: 12 }}>{inv.dealer.city}, {inv.dealer?.state || "WA"}</div>}
                    </div>
                    <span style={{
                      padding: "4px 12px", borderRadius: 100, fontSize: 10, fontWeight: 700,
                      background: "rgba(245,158,11,0.08)", color: "var(--amber)"
                    }}>Ready to send</span>
                  </div>

                  <div style={{
                    background: "rgba(0,0,0,0.2)", borderRadius: 10, padding: "14px 16px",
                    marginBottom: 14, maxHeight: 120, overflowY: "auto"
                  }}>
                    <div style={{ color: "#94a3b8", fontSize: 12, fontFamily: "var(--mono)", whiteSpace: "pre-wrap", lineHeight: 1.5 }}>
                      <strong style={{ color: "#f1f5f9" }}>Subject:</strong> {inv.email_subject}{"\n\n"}{inv.email_body}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={() => openGmail(i)} style={{
                      flex: 1, padding: "11px", borderRadius: 10,
                      background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)",
                      color: "var(--green)", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font)"
                    }}>Open in Gmail</button>
                    <button onClick={() => copyEmail(i)} style={{
                      flex: 1, padding: "11px", borderRadius: 10,
                      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                      color: copiedIdx === i ? "var(--green)" : "#94a3b8",
                      fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font)"
                    }}>{copiedIdx === i ? "✓ Copied!" : "Copy Email"}</button>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => onDone(requestId)} className="landing-cta" style={{
              width: "100%", padding: "18px", marginTop: 28,
              background: "linear-gradient(135deg, var(--amber), var(--amber-dark))",
              border: "none", borderRadius: 12, color: "var(--bg)", fontSize: 17, fontWeight: 800,
              cursor: "pointer", fontFamily: "var(--font)",
              boxShadow: "0 4px 20px rgba(245,158,11,0.25)"
            }}>Go to Dashboard →</button>
          </div>
        )}

      </div>
    </div>
  );
}
