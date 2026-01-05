const API_BASE = "http://localhost:3000";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchRiderFromToken() {
  const res = await fetch(`${API_BASE}/api/get/rider/username`, {
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to fetch rider: ${res.status} ${text}`);
  }
  return res.json();
}

export async function fetchRiderStats(riderId) {
  const res = await fetch(`${API_BASE}/api/get/stats/${riderId}`);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to fetch stats: ${res.status} ${text}`);
  }
  return res.json();
}

export async function fetchRecentPayments(riderId) {
  const res = await fetch(`${API_BASE}/api/get/payments/recent/${riderId}`);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to fetch recent payments: ${res.status} ${text}`);
  }
  return res.json();
}

export async function fetchMissedPayments(riderId) {
  const res = await fetch(`${API_BASE}/api/get/payments/missed/${riderId}`);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to fetch missed payments: ${res.status} ${text}`);
  }
  return res.json();
}

// export async function todayCollectionCountRider() {
//   const res = await fetch(`${API_BASE}/api/analytics/today/collection/rider`);
//   if (!res.ok) {
//     const text = await res.text().catch(() => "");
//     throw new Error(`Failed to fetch today's collection:`, text)
//   }
//   return res.json();
// }