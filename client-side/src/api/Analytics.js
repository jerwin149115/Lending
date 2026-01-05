const API_BASE = "http://localhost:3000/api";

export async function fetchMonthlyAnalytics(month) {
  const res = await fetch(`${API_BASE}/monthly?month=${month}`);
  if (!res.ok) throw new Error("Failed to fetch monthly analytics");
  return res.json();
}

export async function fetchDailyTrend(month) {
  const res = await fetch(`${API_BASE}/daily-trend?month=${month}`);
  if (!res.ok) throw new Error("Failed to fetch daily trend");
  return res.json();
}

export async function fetchCompanyPerformance() {
  const res = await fetch(`${API_BASE}/company-performance`);
  if (!res.ok) throw new Error("Failed to fetch company performance");
  return res.json();
}

export async function fetchWeeklyComparison(month) {
  const res = await fetch(`${API_BASE}/weekly-comparison?month=${month}`);
  if (!res.ok) throw new Error("Failed to fetch weekly comparison");
  return res.json();
}

export async function fetchLoanCategories() {
  const res = await fetch(`${API_BASE}/loan-categories`);
  if (!res.ok) throw new Error("Failed to fetch loan categories");
  return res.json();
}

export async function fetchAreaGrowth(month) {
  const res = await fetch(`${API_BASE}/area-growth?month=${month}`);
  if (!res.ok) throw new Error("Failed to fetch area growth");
  return res.json();
}

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

export async function fetchRecentPayments() {
  const res = await fetch(`${API_BASE}/api/get/payments/recent/`);
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

export async function todayCollectionCount() {
  const res = await fetch(`${API_BASE}/api/get/today/count`);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to fetch today's collection:`, text)
  }
  return res.json();
}
