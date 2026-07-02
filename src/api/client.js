const API_BASE =
  process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000";

export function getAuthHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
  };
}

export function getJsonHeaders(token = null) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

export default API_BASE;