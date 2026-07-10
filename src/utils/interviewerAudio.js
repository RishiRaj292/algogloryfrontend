import API_BASE from "../api/client";

let currentAudio = null;
let currentAudioUrl = null;

export async function playInterviewerAudio(text, token) {
  if (!text?.trim()) {
    return;
  }

  try {
    stopInterviewerAudio();

    const response = await fetch(
      `${API_BASE}/speech/interviewer-audio`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        errorText || "Could not generate interviewer audio."
      );
    }

    const audioBlob = await response.blob();
    currentAudioUrl = URL.createObjectURL(audioBlob);

    currentAudio = new Audio(currentAudioUrl);

    currentAudio.onended = cleanupAudio;
    currentAudio.onerror = cleanupAudio;

    await currentAudio.play();
  } catch (error) {
    console.error("Interviewer TTS failed:", error);
    cleanupAudio();
    throw error;
  }
}

export function stopInterviewerAudio() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  cleanupAudio();
}

function cleanupAudio() {
  if (currentAudioUrl) {
    URL.revokeObjectURL(currentAudioUrl);
  }

  currentAudio = null;
  currentAudioUrl = null;
}