/* ═══════════════════════════════════════════
   LOTDUEL — Sample Data & Scoring
   ═══════════════════════════════════════════ */

export const MARKET_VALUE = 28500;

export const REQUEST_INFO = {
  make: "Toyota",
  model: "RAV4 Hybrid",
  yearMin: 2022,
  yearMax: 2023,
  mileageMax: 40000,
  zip: "98258",
  radius: 60,
};

export const SAMPLE_OFFERS = [
  { id: 1, dealer: "Rodland Toyota", city: "Everett", year: 2023, trim: "LE", mileage: 18420, otd: 27850, certified: true, extras: "New tires, roof rack cross bars", submitted: "2 hours ago", contact: "Marcus R." },
  { id: 2, dealer: "Toyota of Kirkland", city: "Kirkland", year: 2023, trim: "XLE Premium", mileage: 22100, otd: 31200, certified: true, extras: "All-weather mats, cargo tray", submitted: "5 hours ago", contact: "Jennifer L." },
  { id: 3, dealer: "Toyota of Marysville", city: "Marysville", year: 2022, trim: "SE", mileage: 31500, otd: 25900, certified: true, extras: "Paint protection film", submitted: "1 day ago", contact: "David K." },
  { id: 4, dealer: "Toyota of Bellingham", city: "Bellingham", year: 2023, trim: "LE", mileage: 24800, otd: 28400, certified: false, extras: "None", submitted: "1 day ago", contact: "Sarah M." },
  { id: 5, dealer: "Doxon Toyota", city: "Auburn", year: 2022, trim: "XLE", mileage: 28900, otd: 26750, certified: true, extras: "Extended warranty included", submitted: "2 days ago", contact: "Chris P." },
  { id: 6, dealer: "Toyota of Puyallup", city: "Puyallup", year: 2023, trim: "XSE", mileage: 15200, otd: 33100, certified: true, extras: "Panoramic roof, BSM, advanced tech pkg", submitted: "3 days ago", contact: "Amy T." },
  { id: 7, dealer: "Toyota of Seattle", city: "Seattle", year: 2022, trim: "LE", mileage: 35600, otd: 24300, certified: false, extras: "Recently serviced", submitted: "3 days ago", contact: "Mike W." },
];

export function scoreOffer(offer, allOffers = SAMPLE_OFFERS) {
  const best = Math.min(...allOffers.map((o) => o.otd));
  const priceScore = (best / offer.otd) * 100;

  const marketDiff = MARKET_VALUE - offer.otd;
  const marketScore = Math.min(100, Math.max(0, 50 + (marketDiff / MARKET_VALUE) * 200));

  const maxMiles = Math.max(...allOffers.map((o) => o.mileage));
  const mileageScore = ((maxMiles - offer.mileage) / maxMiles) * 100;

  const trimTargets = ["LE", "XLE", "SE"];
  const trimScore = trimTargets.includes(offer.trim) ? 100 : offer.trim === "XLE Premium" ? 80 : 60;

  const certScore = offer.certified ? 100 : 60;

  return Math.round(
    priceScore * 0.55 +
    marketScore * 0.20 +
    mileageScore * 0.10 +
    trimScore * 0.10 +
    certScore * 0.05
  );
}

export function getLabel(score) {
  if (score >= 85) return { text: "Best Deal", color: "#22c55e", bg: "rgba(34,197,94,0.12)" };
  if (score >= 72) return { text: "Competitive", color: "#eab308", bg: "rgba(234,179,8,0.12)" };
  return { text: "Overpriced", color: "#ef4444", bg: "rgba(239,68,68,0.12)" };
}

export function fmt(n) {
  return "$" + n.toLocaleString();
}
