import API_BASE, { getAuthHeaders } from "./client";

export async function fetchDashboardApi(token) {
  const response = await fetch(`${API_BASE}/dashboard`, {
    method: "GET",
    headers: getAuthHeaders(token),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Could not fetch dashboard");
  }

  return data;
}