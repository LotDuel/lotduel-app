import { useState, useEffect } from "react";
import Logo from "./Logo";
import { getInvite, submitOffer } from "../api";

export default function DealerForm({ token, demo }) {
  const [form, setForm] = useState({
    year: "2023", trim: "LE", mileage: "", otd: "",
    certified: "yes", extras: "", stockNum: "", notes: "", contactName: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [inviteData, setInviteData] = useState(null);
  const [loading, setLoading] = useState(!!token);
  const [pageError, setPageError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch invite data from API
  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const data = await getInvite(token);
        setInviteData(data);
        // Pre-fill year from request
        setForm((f) => ({ ...f, year: String(data.request.year_max) }));
      } catch (err) {
        if (err.data?.already_submitted) {
          setPageError("already_submitted");
        } else {
          setPageError(err.message);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const validate = () => {
    const e = {};
    if (!form.mileage || isNaN(form.mileage)) e.mileage = true;
    if (!form.otd || isNaN(form.otd)) e.otd = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    if (demo) {
      setSubmitted(true);
      return;
    }

    // Real API submission
    setSubmitting(true);
    try {
      await submitOffer(token, {
        year: parseInt(form.year),
        trim: form.trim,
        mileage: parseInt(form.mileage),
        otd_price: parseInt(form.otd),
        certified: form.certified === "yes",
        extras: form.extras,
        stock_number: form.stockNum,
        contact_name: form.contactName,
        notes: form.notes,
      });
      setSubmitted(true);
    } catch (err) {
      if (err.data?.fields) {
        setErrors(err.data.fields);
      } else {
        setPageError(err.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Derive display data
  const req = inviteData?.request || {
    make: "Toyota", model: "RAV4 Hybrid",
    year_min: 2022, year_max: 2023, year_display: "2022–2023",
    mileage_max: 40000, zip_code: "98258", radius_miles: 60,
  };
  const dealerName = inviteData?.dealer_name;
  const yearDisplay = req.year_display || `${req.year_min}–${req.year_max}`;
  const yearOptions = [];
  for (let y = req.year_min || 2022; y <= (req.year_max || 2023); y++) yearOptions.push(y);

  // Loading state
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 48, height: 48, border: "3px solid rgba(245,158,11,0.2)", borderTop: "3px solid #f59e0b", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 20px" }} />
          <p style={{ color: "#94a3b8", fontSize: 15, fontFamily: "var(--font)" }}>Loading invite...</p>
        </div>
      </div>
    );
  }

  // Error states
  if (pageError === "already_submitted") {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ maxWidth: 440, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
          <h2 style={{ color: "#f1f5f9", fontSize: 24, fontWeight: 800, fontFamily: "var(--font)", marginBottom: 8 }}>Already Submitted</h2>
          <p style={{ color: "#94a3b8", fontSize: 15, lineHeight: 1.6, fontFamily: "var(--font)" }}>
            You've already submitted an offer for this vehicle request. The buyer will be in touch if they'd like to move forward.
          </p>
        </div>
      </div>
    );
  }

  if (pageError) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ maxWidth: 440, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h2 style={{ color: "#f1f5f9", fontSize: 24, fontWeight: 800, fontFamily: "var(--font)", marginBottom: 8 }}>Invalid Link</h2>
          <p style={{ color: "#94a3b8", fontSize: 15, lineHeight: 1.6, fontFamily: "var(--font)" }}>{pageError}</p>
        </div>
      </div>
    );
  }

  // Success state
  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ maxWidth: 520, width: "100%", textAlign: "center" }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: "rgba(34,197,94,0.1)", display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 28px", border: "2px solid rgba(34,197,94,0.2)"
          }}>
            <span style={{ fontSize: 40, color: "var(--green)" }}>✓</span>
          </div>
          <h2 style={{ color: "#f1f5f9", fontSize: 28, fontFamily: "var(--font)", fontWeight: 800, margin: "0 0 12px", letterSpacing: "-0.02em" }}>Offer Received</h2>
          <p style={{ color: "#94a3b8", fontSize: 15, lineHeight: 1.6, margin: "0 0 36px", fontFamily: "var(--font)" }}>
            This buyer is reviewing multiple quotes and will follow up with the most competitive option.
          </p>
          <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 14, padding: "22px 28px", border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ color: "#64748b", fontSize: 13 }}>Your OTD Quote</span>
              <span style={{ color: "#f1f5f9", fontSize: 16, fontWeight: 700, fontFamily: "var(--mono)" }}>${parseInt(form.otd).toLocaleString()}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#64748b", fontSize: 13 }}>Vehicle</span>
              <span style={{ color: "#f1f5f9", fontSize: 15, fontWeight: 500 }}>{form.year} {req.make} {req.model} {form.trim}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const inp = (err) => ({
    width: "100%", padding: "13px 16px", background: "rgba(255,255,255,0.04)",
    border: `1px solid ${err ? "var(--red)" : "rgba(255,255,255,0.08)"}`,
    borderRadius: 10, color: "#f1f5f9", fontSize: 15, fontFamily: "var(--font)",
    outline: "none", boxSizing: "border-box", transition: "border 0.2s"
  });
  const lbl = { color: "#94a3b8", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 7, display: "block" };
  const reqMark = <span style={{ color: "var(--red)", marginLeft: 3 }}>*</span>;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", padding: "48px 20px", fontFamily: "var(--font)" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <Logo size={34} />
          <h1 style={{ color: "#f1f5f9", fontSize: 30, fontWeight: 800, margin: "28px 0 8px", letterSpacing: "-0.03em" }}>
            Submit Your Best OTD Offer
          </h1>
          <p style={{ color: "var(--amber)", fontSize: 15, fontWeight: 700 }}>Ready buyer · Decision within 48 hours</p>
          {dealerName && (
            <p style={{ color: "#64748b", fontSize: 13, marginTop: 8 }}>Invite for: {dealerName}</p>
          )}
        </div>

        <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 14, padding: "22px 28px", marginBottom: 36, border: "1px solid var(--border)" }}>
          <div style={{ color: "#64748b", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Buyer is looking for</div>
          <div style={{ color: "#f1f5f9", fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em" }}>{yearDisplay} {req.make} {req.model}</div>
          <div style={{ color: "#94a3b8", fontSize: 14, marginTop: 6 }}>Under {(req.mileage_max || 40000).toLocaleString()} miles · Within {req.radius_miles || 60} mi of {req.zip_code || "Lake Stevens, WA"}</div>
          {req.notes && <div style={{ color: "#94a3b8", fontSize: 13, marginTop: 8, fontStyle: "italic" }}>Note: {req.notes}</div>}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={lbl}>Year{reqMark}</label>
              <select value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} style={{ ...inp(false), cursor: "pointer" }}>
                {yearOptions.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Trim{reqMark}</label>
              <select value={form.trim} onChange={(e) => setForm({ ...form, trim: e.target.value })} style={{ ...inp(false), cursor: "pointer" }}>
                {["LE", "XLE", "XLE Premium", "SE", "XSE", "Limited"].map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={lbl}>Mileage{reqMark}</label>
              <input type="text" placeholder="e.g. 24500" value={form.mileage} onChange={(e) => setForm({ ...form, mileage: e.target.value.replace(/[^0-9]/g, "") })} style={inp(errors.mileage)} />
            </div>
            <div>
              <label style={lbl}>OTD Price{reqMark}</label>
              <input type="text" placeholder="e.g. 28500" value={form.otd} onChange={(e) => setForm({ ...form, otd: e.target.value.replace(/[^0-9]/g, "") })} style={inp(errors.otd_price || errors.otd)} />
            </div>
          </div>
          <div>
            <label style={lbl}>Certified Pre-Owned?{reqMark}</label>
            <div style={{ display: "flex", gap: 12 }}>
              {["yes", "no"].map((v) => (
                <button key={v} onClick={() => setForm({ ...form, certified: v })} style={{
                  flex: 1, padding: "13px", borderRadius: 10,
                  border: `1px solid ${form.certified === v ? "var(--amber)" : "rgba(255,255,255,0.08)"}`,
                  background: form.certified === v ? "rgba(245,158,11,0.08)" : "rgba(255,255,255,0.02)",
                  color: form.certified === v ? "var(--amber)" : "#94a3b8",
                  fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font)", transition: "all 0.2s"
                }}>
                  {v === "yes" ? "Yes" : "No"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={lbl}>Extras / Add-ons Included</label>
            <input type="text" placeholder="e.g. New tires, floor mats, extended warranty" value={form.extras} onChange={(e) => setForm({ ...form, extras: e.target.value })} style={inp(false)} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div><label style={lbl}>Stock Number</label><input type="text" placeholder="Optional" value={form.stockNum} onChange={(e) => setForm({ ...form, stockNum: e.target.value })} style={inp(false)} /></div>
            <div><label style={lbl}>Contact Name</label><input type="text" placeholder="Optional" value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} style={inp(false)} /></div>
          </div>
          <div>
            <label style={lbl}>Notes</label>
            <textarea placeholder="Anything else about this vehicle..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} style={{ ...inp(false), resize: "vertical" }} />
          </div>
        </div>

        <div style={{
          marginTop: 28, padding: "14px 20px",
          background: "rgba(34,197,94,0.05)", borderRadius: 12,
          border: "1px solid rgba(34,197,94,0.1)",
          display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center", justifyContent: "center"
        }}>
          {["Serious buyer", "Reviewing multiple offers", "Will respond to best quote"].map((t, i) => (
            <span key={i} style={{ color: "var(--green)", fontSize: 12, fontWeight: 600 }}>✔ {t}</span>
          ))}
        </div>

        <button onClick={handleSubmit} disabled={submitting} className="landing-cta" style={{
          width: "100%", padding: "18px", marginTop: 22,
          background: submitting ? "rgba(245,158,11,0.5)" : "linear-gradient(135deg, var(--amber), var(--amber-dark))",
          border: "none", borderRadius: 12,
          color: "var(--bg)", fontSize: 18, fontWeight: 800,
          cursor: submitting ? "wait" : "pointer", fontFamily: "var(--font)", letterSpacing: "-0.01em",
          transition: "all 0.25s ease",
          boxShadow: "0 4px 20px rgba(245,158,11,0.25)"
        }}>
          {submitting ? "Submitting..." : "Submit Offer"}
        </button>
      </div>
    </div>
  );
}
