import API_BASE, { getAuthHeaders, getJsonHeaders } from "./client";

export async function startInterviewApi({ token, mode }) {
  const response = await fetch(
    `${API_BASE}/session/start?mode=${encodeURIComponent(mode)}`,
    {
      method: "POST",
      headers: getAuthHeaders(token),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Could not start interview");
  }

  return data;
}

export async function getActiveInterviewApi(token) {
  const response = await fetch(`${API_BASE}/session/active`, {
    method: "GET",
    headers: getAuthHeaders(token),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Could not restore active interview");
  }

  return data;
}

export async function submitAnswerApi({ token, sessionId, transcript, mode }) {
  const response = await fetch(`${API_BASE}/session/answer`, {
    method: "POST",
    headers: getJsonHeaders(token),
    body: JSON.stringify({
      session_id: sessionId,
      transcript,
      mode,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Could not submit answer");
  }

  return data;
}

export async function endInterviewApi({ token, sessionId }) {
  const response = await fetch(
    `${API_BASE}/session/end?session_id=${encodeURIComponent(sessionId)}`,
    {
      method: "POST",
      headers: getAuthHeaders(token),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Could not end interview");
  }

  return data;
}