import { useState, useEffect, useCallback } from "react";
import { SAMPLE_OFFERS, MARKET_VALUE, REQUEST_INFO, scoreOffer, getLabel, fmt } from "../data/scoring";
import { getDashboard } from "../api";

export default function Dashboard({ requestId, demo }) {
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [sortBy, setSortBy] = useState("score");
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(!demo);
  const [error, setError] = useState(null);

  // Fetch real data from API
  const fetchData = useCallback(async () => {
    if (demo || !requestId) return;
    try {
      const data = await getDashboard(requestId);
      setApiData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [requestId, demo]);

  useEffect(() => {
    fetchData();
    // Auto-refresh every 30s for new offers
    if (!demo && requestId) {
      const interval = setInterval(fetchData, 30000);
      return () => clearInterval(interval);
    }
  }, [fetchData, demo, requestId]);

  // Build display data from either demo or API
  let scored, reqInfo, marketValue, avgOtd, savings, inviteCount, offerCount, status;

  if (demo) {
    // Demo mode — use hardcoded sample data
    scored = SAMPLE_OFFERS
      .map((o) => ({ ...o, score: scoreOffer(o), diff: MARKET_VALUE - o.otd, contact: o.contact }))
      .sort((a, b) => {
        if (sortBy === "score") return b.score - a.score;
        if (sortBy === "price") return a.otd - b.otd;
        if (sortBy === "mileage") return a.mileage - b.mileage;
        return 0;
      })
      .map((o, i) => ({ ...o, rank: i + 1 }));

    marketValue = MARKET_VALUE;
    avgOtd = Math.round(scored.reduce((s, o) => s + o.otd, 0) / scored.length);
    savings = avgOtd - scored[0].otd;
    inviteCount = 12;
    offerCount = scored.length;
    status = "Active";
    reqInfo = { yearMin: REQUEST_INFO.yearMin, yearMax: REQUEST_INFO.yearMax, make: REQUEST_INFO.make, model: REQUEST_INFO.model, mileageMax: REQUEST_INFO.mileageMax, zip: REQUEST_INFO.zip };
  } else if (apiData) {
    // Real mode — use API data
    const offers = apiData.offers || [];
    scored = offers
      .map((o) => ({
        id: o.id,
        dealer: o.dealer,
        city: o.city,
        year: o.year,
        trim: o.trim,
        mileage: o.mileage,
        otd: o.otd,
        certified: o.certified,
        extras: o.extras,
        contact: o.contact_name,
        score: o.total_score,
        rank: o.rank,
        label: o.label,
        diff: (apiData.stats.market_value || 28500) - o.otd,
        stock_number: o.stock_number,
        notes: o.notes,
      }))
      .sort((a, b) => {
        if (sortBy === "score") return b.score - a.score;
        if (sortBy === "price") return a.otd - b.otd;
        if (sortBy === "mileage") return a.mileage - b.mileage;
        return 0;
      })
      .map((o, i) => ({ ...o, rank: i + 1 }));

    const req = apiData.request;
    reqInfo = { yearMin: req.year_min, yearMax: req.year_max, make: req.make, model: req.model, mileageMax: req.mileage_max, zip: req.zip_code };
    marketValue = apiData.stats.market_value;
    avgOtd = apiData.stats.avg_price;
    savings = apiData.stats.savings;
    inviteCount = apiData.stats.invite_count;
    offerCount = apiData.stats.offer_count;
    status = req.status === "active" ? "Active" : req.status;
  }

  // Market data from API (comparables info)
  const marketSource = !demo && apiData?.stats?.market_source;
  const marketInfo = !demo && apiData?.request?.market;
  const numComparables = marketInfo?.num_listings || 0;

  // Loading state
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 48, height: 48, border: "3px solid rgba(245,158,11,0.2)", borderTop: "3px solid #f59e0b", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 20px" }} />
          <p style={{ color: "#94a3b8", fontSize: 15, fontFamily: "var(--font)" }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h2 style={{ color: "#f1f5f9", fontSize: 22, fontWeight: 700, fontFamily: "var(--font)", marginBottom: 8 }}>Dashboard Not Found</h2>
          <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.6, fontFamily: "var(--font)" }}>{error}</p>
        </div>
      </div>
    );
  }

  // Empty state — no offers yet
  if (!scored || scored.length === 0) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ textAlign: "center", maxWidth: 440 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
          <h2 style={{ color: "#f1f5f9", fontSize: 24, fontWeight: 800, fontFamily: "var(--font)", marginBottom: 8 }}>No Offers Yet</h2>
          <p style={{ color: "#94a3b8", fontSize: 15, lineHeight: 1.6, fontFamily: "var(--font)", marginBottom: 24 }}>
            Dealers haven't submitted any quotes yet. Send your invite emails and check back soon — this dashboard updates automatically.
          </p>
          <div style={{ color: "#475569", fontSize: 13, fontFamily: "var(--font)" }}>
            {inviteCount} invite{inviteCount !== 1 ? "s" : ""} generated · Auto-refreshes every 30s
          </div>
        </div>
      </div>
    );
  }

  const best = scored[0];
  const yearDisplay = reqInfo.yearMin === reqInfo.yearMax ? `${reqInfo.yearMin}` : `${reqInfo.yearMin}–${reqInfo.yearMax}`;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", padding: "28px 16px", fontFamily: "var(--font)" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>

        {/* Request Bar */}
        <div className="anim-fade-up" style={{
          background: "rgba(255,255,255,0.02)", borderRadius: 14,
          padding: "16px 24px", marginBottom: 22, border: "1px solid var(--border)",
          display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 14
        }}>
          <div>
            <span style={{ color: "#f1f5f9", fontSize: 17, fontWeight: 700 }}>{yearDisplay} {reqInfo.make} {reqInfo.model}</span>
            <span style={{ color: "#64748b", fontSize: 13, marginLeft: 14 }}>Under {(reqInfo.mileageMax / 1000).toFixed(0)}K mi · {reqInfo.zip}</span>
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            {[["Dealers", String(inviteCount), "#f1f5f9"], ["Offers", String(offerCount), "#f1f5f9"], ["Status", status, status === "Active" ? "var(--green)" : "#94a3b8"]].map(([l, v, c], i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ color: "#475569", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>{l}</div>
                <div style={{ color: c, fontSize: l === "Status" ? 13 : 19, fontWeight: 700, fontFamily: l === "Status" ? "var(--font)" : "var(--mono)" }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Cards */}
        <div className="anim-fade-up anim-d1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 22 }}>
          {/* Best Offer */}
          <div style={{
            background: "linear-gradient(135deg, rgba(34,197,94,0.06), rgba(34,197,94,0.01))",
            borderRadius: 16, padding: "28px 30px",
            border: "1px solid rgba(34,197,94,0.12)", position: "relative", overflow: "hidden"
          }}>
            <div style={{
              position: "absolute", top: -40, right: -40, width: 160, height: 160,
              background: "radial-gradient(circle, rgba(34,197,94,0.08), transparent 70%)", pointerEvents: "none"
            }} />
            <div style={{
              position: "absolute", top: 18, right: 22,
              background: "rgba(34,197,94,0.12)", padding: "4px 14px", borderRadius: 100,
              fontSize: 10, fontWeight: 800, color: "var(--green)", letterSpacing: "0.06em", fontFamily: "var(--mono)"
            }}>🏆 #1</div>
            <div style={{ color: "#475569", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Best Offer</div>
            <div style={{ color: "var(--green)", fontSize: 40, fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1, fontFamily: "var(--mono)" }}>{fmt(best.otd)}</div>
            <div style={{ color: "#f1f5f9", fontSize: 16, fontWeight: 700, marginTop: 10 }}>{best.dealer}</div>
            <div style={{ color: "#94a3b8", fontSize: 13, marginTop: 4 }}>
              {best.year} {reqInfo.model} {best.trim} · {best.mileage.toLocaleString()} mi {best.certified ? "· CPO ✓" : ""}
            </div>
            <div style={{ marginTop: 14, display: "inline-block", background: "rgba(34,197,94,0.08)", padding: "7px 16px", borderRadius: 8 }}>
              <span style={{ color: "var(--green)", fontSize: 15, fontWeight: 800, fontFamily: "var(--mono)" }}>
                {fmt(Math.abs(best.diff))} {best.diff >= 0 ? "below" : "above"} market
              </span>
            </div>
          </div>

          {/* Leverage */}
          <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 16, padding: "28px 30px", border: "1px solid var(--border)" }}>
            <div style={{ color: "#475569", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 20 }}>Your Leverage</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
              {[
                [marketSource === "marketcheck" ? "Market Value" : "Market Avg", fmt(marketValue), "#f1f5f9"],
                ["Offer Avg", fmt(avgOtd), "#f1f5f9"],
                ["Savings vs Avg", fmt(savings), savings > 0 ? "var(--green)" : "var(--red)"],
                ["Leverage", offerCount >= 5 ? "High" : offerCount >= 3 ? "Medium" : "Building", "var(--amber)"]
              ].map(([l, v, c], i) => (
                <div key={i}>
                  <div style={{ color: "#475569", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 4 }}>{l}</div>
                  <div style={{ color: c, fontSize: 24, fontWeight: 800, fontFamily: l === "Leverage" ? "var(--font)" : "var(--mono)", letterSpacing: "-0.02em" }}>{v}</div>
                  {i === 0 && marketSource === "marketcheck" && numComparables > 0 && (
                    <div style={{ color: "#475569", fontSize: 10, marginTop: 4 }}>Based on {numComparables} listings</div>
                  )}
                </div>
              ))}
            </div>
            <div style={{
              marginTop: 18, padding: "11px 16px",
              background: "rgba(245,158,11,0.06)", borderRadius: 10,
              border: "1px solid rgba(245,158,11,0.1)"
            }}>
              <span style={{ color: "var(--amber)", fontSize: 12, fontWeight: 700 }}>
                💡 {offerCount} competing offer{offerCount !== 1 ? "s" : ""} — {offerCount >= 5 ? "strong" : offerCount >= 3 ? "growing" : "early"} negotiating position
              </span>
            </div>
          </div>
        </div>

        {/* Sort */}
        <div className="anim-fade-up anim-d2" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <span style={{ color: "#475569", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Sort</span>
          {[["score", "Best Score"], ["price", "Lowest Price"], ["mileage", "Lowest Miles"]].map(([v, l]) => (
            <button key={v} onClick={() => setSortBy(v)} className="demo-toggle-btn" style={{
              padding: "7px 16px", borderRadius: 8,
              border: `1px solid ${sortBy === v ? "var(--amber)" : "rgba(255,255,255,0.06)"}`,
              background: sortBy === v ? "rgba(245,158,11,0.08)" : "transparent",
              color: sortBy === v ? "var(--amber)" : "#64748b",
              fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font)", transition: "all 0.2s"
            }}>{l}</button>
          ))}
          {!demo && (
            <button onClick={fetchData} className="demo-toggle-btn" style={{
              marginLeft: "auto", padding: "7px 16px", borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.06)", background: "transparent",
              color: "#64748b", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font)"
            }}>↻ Refresh</button>
          )}
        </div>

        {/* Table */}
        <div className="anim-fade-up anim-d3" style={{ borderRadius: 16, overflow: "hidden", border: "1px solid var(--border)" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.03)" }}>
                  {["#", "Dealer", "Vehicle", "Miles", "OTD", "vs Market", "Cert", "Score", ""].map((h, i) => (
                    <th key={i} style={{
                      padding: "13px 16px", textAlign: "left", color: "#475569",
                      fontSize: 9, fontWeight: 800, textTransform: "uppercase",
                      letterSpacing: "0.1em", borderBottom: "1px solid var(--border)",
                      fontFamily: "var(--font)", whiteSpace: "nowrap"
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scored.map((offer, idx) => {
                  const label = demo ? getLabel(offer.score) : { text: offer.label, ...getLabelStyle(offer.label) };
                  const isFirst = offer.rank === 1;
                  return (
                    <tr key={offer.id}
                      className={isFirst ? "offer-row-best" : "offer-row"}
                      style={{
                        background: isFirst ? "rgba(34,197,94,0.03)" : "transparent",
                        borderBottom: "1px solid rgba(255,255,255,0.03)",
                        cursor: "pointer", transition: "background 0.2s",
                        animation: `slideRow 0.4s ease-out ${idx * 0.06}s both`
                      }}
                      onClick={() => setSelectedOffer(offer)}>
                      <td style={{ padding: "16px", color: isFirst ? "var(--green)" : "#f1f5f9", fontWeight: 900, fontSize: 17, fontFamily: "var(--mono)" }}>
                        {isFirst ? "🏆" : offer.rank}
                      </td>
                      <td style={{ padding: "16px" }}>
                        <div style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 14 }}>{offer.dealer}</div>
                        <div style={{ color: "#475569", fontSize: 12 }}>{offer.city}{offer.city ? ", WA" : ""}</div>
                      </td>
                      <td style={{ padding: "16px", color: "#cbd5e1", fontSize: 14, fontWeight: 500 }}>{offer.year} {offer.trim}</td>
                      <td style={{ padding: "16px", color: "#94a3b8", fontSize: 14, fontFamily: "var(--mono)", whiteSpace: "nowrap" }}>{offer.mileage.toLocaleString()}</td>
                      <td style={{ padding: "16px", color: "#f1f5f9", fontWeight: 800, fontSize: 17, fontFamily: "var(--mono)", whiteSpace: "nowrap" }}>{fmt(offer.otd)}</td>
                      <td style={{ padding: "16px", whiteSpace: "nowrap" }}>
                        <span style={{ color: offer.diff >= 0 ? "var(--green)" : "var(--red)", fontWeight: 700, fontSize: 13, fontFamily: "var(--mono)" }}>
                          {offer.diff >= 0 ? "−" : "+"}{fmt(Math.abs(offer.diff))}
                        </span>
                      </td>
                      <td style={{ padding: "16px" }}>
                        {offer.certified
                          ? <span style={{ color: "var(--green)", fontSize: 11, fontWeight: 700, background: "rgba(34,197,94,0.1)", padding: "3px 10px", borderRadius: 6 }}>CPO</span>
                          : <span style={{ color: "#475569", fontSize: 11 }}>—</span>}
                      </td>
                      <td style={{ padding: "16px" }}>
                        <span style={{
                          display: "inline-block", padding: "4px 14px", borderRadius: 100,
                          fontSize: 11, fontWeight: 800, color: label.color, background: label.bg,
                          whiteSpace: "nowrap", letterSpacing: "0.02em"
                        }}>{label.text}</span>
                      </td>
                      <td style={{ padding: "16px", color: "#475569", fontSize: 20 }}>›</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedOffer && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 20, zIndex: 100, animation: "fadeIn 0.2s ease"
        }} onClick={() => setSelectedOffer(null)}>
          <div style={{
            maxWidth: 500, width: "100%", background: "#111827",
            borderRadius: 20, padding: "36px 32px",
            border: "1px solid rgba(255,255,255,0.08)",
            maxHeight: "90vh", overflowY: "auto",
            animation: "fadeUp 0.3s ease-out"
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 28 }}>
              <div>
                <div style={{ color: "#f1f5f9", fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em" }}>{selectedOffer.dealer}</div>
                <div style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>{selectedOffer.city}{selectedOffer.city ? ", WA" : ""}{selectedOffer.contact ? ` · Contact: ${selectedOffer.contact}` : ""}</div>
              </div>
              <button onClick={() => setSelectedOffer(null)} style={{
                background: "rgba(255,255,255,0.05)", border: "none",
                color: "#64748b", fontSize: 20, cursor: "pointer",
                width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center"
              }}>×</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
              {[
                ["OTD Price", fmt(selectedOffer.otd), "#f1f5f9", "var(--mono)"],
                ["vs Market", `${selectedOffer.diff >= 0 ? "−" : "+"}${fmt(Math.abs(selectedOffer.diff))}`, selectedOffer.diff >= 0 ? "var(--green)" : "var(--red)", "var(--mono)"],
                ["Year / Trim", `${selectedOffer.year} ${selectedOffer.trim}`, "#f1f5f9", "var(--font)"],
                ["Mileage", `${selectedOffer.mileage.toLocaleString()} mi`, "#f1f5f9", "var(--mono)"],
                ["Certified", selectedOffer.certified ? "Yes (CPO)" : "No", selectedOffer.certified ? "var(--green)" : "#94a3b8", "var(--font)"],
                ["Score", `${selectedOffer.score}/100`, (demo ? getLabel(selectedOffer.score) : getLabelStyle(selectedOffer.label)).color, "var(--mono)"]
              ].map(([label, val, color, ff], i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: "16px 18px" }}>
                  <div style={{ color: "#475569", fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{label}</div>
                  <div style={{ color, fontSize: 20, fontWeight: 800, fontFamily: ff }}>{val}</div>
                </div>
              ))}
            </div>

            {selectedOffer.extras && selectedOffer.extras !== "None" && (
              <div style={{ marginBottom: 22, padding: "16px 18px", background: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px solid var(--border)" }}>
                <div style={{ color: "#475569", fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Extras Included</div>
                <div style={{ color: "#cbd5e1", fontSize: 14, lineHeight: 1.5 }}>{selectedOffer.extras}</div>
              </div>
            )}

            <div style={{ display: "flex", gap: 12 }}>
              <button className="detail-btn" style={{
                flex: 1, padding: "15px",
                background: "linear-gradient(135deg, var(--amber), var(--amber-dark))",
                border: "none", borderRadius: 12, color: "var(--bg)",
                fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "var(--font)",
                transition: "transform 0.15s", boxShadow: "0 4px 16px rgba(245,158,11,0.2)"
              }}>Contact Dealer</button>
              <button className="detail-btn" style={{
                flex: 1, padding: "15px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12,
                color: "#f1f5f9", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font)",
                transition: "transform 0.15s"
              }}>Use as Leverage</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper: get label styles from label text (for API data)
function getLabelStyle(label) {
  if (label === "Best Deal") return { color: "#22c55e", bg: "rgba(34,197,94,0.12)" };
  if (label === "Competitive") return { color: "#eab308", bg: "rgba(234,179,8,0.12)" };
  return { color: "#ef4444", bg: "rgba(239,68,68,0.12)" };
}
