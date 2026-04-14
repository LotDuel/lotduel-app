/*
 * LotDuel API Client
 * All frontend ↔ backend communication goes through here.
 */

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function apiFetch(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const err = new Error(data?.error || `API error ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

// ── Users ──────────────────────────────────────────────────────────

export function createUser(name, email) {
  return apiFetch("/api/users", {
    method: "POST",
    body: JSON.stringify({ name, email }),
  });
}

// ── Vehicle Requests ───────────────────────────────────────────────

export function createRequest(data) {
  return apiFetch("/api/requests", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getRequest(requestId) {
  return apiFetch(`/api/requests/${requestId}`);
}

export function updateRequest(requestId, data) {
  return apiFetch(`/api/requests/${requestId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function getUserRequests(userId) {
  return apiFetch(`/api/users/${userId}/requests`);
}

// ── Dashboard ──────────────────────────────────────────────────────

export function getDashboard(requestId) {
  return apiFetch(`/api/requests/${requestId}/dashboard`);
}

export function recalculateOffers(requestId) {
  return apiFetch(`/api/requests/${requestId}/recalculate`, { method: "POST" });
}

// ── Invites ────────────────────────────────────────────────────────

export function createInvite(requestId, dealerData) {
  return apiFetch(`/api/requests/${requestId}/invites`, {
    method: "POST",
    body: JSON.stringify(dealerData),
  });
}

export function listInvites(requestId) {
  return apiFetch(`/api/requests/${requestId}/invites`);
}

// ── Dealer (public) ────────────────────────────────────────────────

export function getInvite(token) {
  return apiFetch(`/api/invites/${token}`);
}

export function submitOffer(token, offerData) {
  return apiFetch(`/api/invites/${token}/submit`, {
    method: "POST",
    body: JSON.stringify(offerData),
  });
}
