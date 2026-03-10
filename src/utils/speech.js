export const speakText = (text, voiceEnabled = true) => {
  if (!window.speechSynthesis || !voiceEnabled) {
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 1;
  utterance.pitch = 1;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
};

export const stopSpeaking = () => {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
};

export const startBrowserListening = ({
  onTranscript,
  onStart,
  onEnd,
  onError,
}) => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    if (onError) onError("Speech recognition is not supported in this browser.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  if (onStart) onStart();

  recognition.onresult = (event) => {
    let transcript = "";

    for (let i = 0; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript + " ";
    }

    if (onTranscript) onTranscript(transcript.trim());
  };

  recognition.onerror = (event) => {
    if (onError) onError(event.error);
    if (onEnd) onEnd();
  };

  recognition.onend = () => {
    if (onEnd) onEnd();
  };

  recognition.start();
};