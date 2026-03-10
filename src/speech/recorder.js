let mediaRecorder = null;
let audioChunks = [];
let stream = null;

export const startRecording = async (onStart) => {
  stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  mediaRecorder = new MediaRecorder(stream);
  audioChunks = [];

  mediaRecorder.ondataavailable = (event) => {
    audioChunks.push(event.data);
  };

  mediaRecorder.start();

  if (onStart) onStart();
};

export const stopRecording = () => {
  return new Promise((resolve) => {
    if (!mediaRecorder) return resolve(null);

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });

      // 🔴 important: stop microphone stream
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      resolve(audioBlob);
    };

    mediaRecorder.stop();
  });
};