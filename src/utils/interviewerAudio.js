const API_BASE = "http://127.0.0.1:8000";

let currentAudio = null;

export async function playInterviewerAudio(text, token) {
  if (!text?.trim()) {
    return;
  }

  try {
    stopInterviewerAudio();

    const response = await fetch(`${API_BASE}/speech/interviewer-audio`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        text,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Could not generate interviewer audio.");
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    currentAudio = new Audio(audioUrl);

    currentAudio.onended = () => {
      URL.revokeObjectURL(audioUrl);
      currentAudio = null;
    };

    currentAudio.onerror = () => {
      URL.revokeObjectURL(audioUrl);
      currentAudio = null;
    };

    await currentAudio.play();
  } catch (error) {
    console.error("Interviewer TTS failed:", error);
    throw error;
  }
}

export function stopInterviewerAudio() {
  if (!currentAudio) {
    return;
  }

  currentAudio.pause();
  currentAudio.currentTime = 0;
  currentAudio = null;
}