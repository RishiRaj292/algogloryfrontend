import { useState, useRef, useEffect } from "react";

import { speakText, stopSpeaking, startBrowserListening } from "../utils/speech";
import { startRecording, stopRecording } from "../speech/recorder";

import {
  startInterviewApi,
  submitAnswerApi,
  endInterviewApi,
} from "../api/interviewApi";

const API_BASE = "http://127.0.0.1:8000";

function InterviewPanel({ token }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [history, setHistory] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [analytics, setAnalytics] = useState(null);

  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [mode, setMode] = useState("DSA");
  const [isRecording, setIsRecording] = useState(false);
  const [speechMode, setSpeechMode] = useState("whisper");

  const historyEndRef = useRef(null);

  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const startInterview = async () => {
    if (!token) {
      alert("Please login first.");
      return;
    }

    try {
      setLoading(true);

      const data = await startInterviewApi({
        token,
        mode,
      });

      setQuestion(data.question);
      setSessionId(data.session_id);
      setAnswer("");
      setFeedback("");
      setAnalytics(null);

      setHistory([
        {
          role: "interviewer",
          text: data.question,
        },
      ]);

      speakText(data.question, voiceEnabled);
    } catch (error) {
      console.error("Error starting interview:", error);
      alert(error.message || "Could not start interview.");
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim() || !sessionId.trim()) {
      alert("Please start the interview and type an answer.");
      return;
    }

    if (!token) {
      alert("Please login first.");
      return;
    }

    const userAnswer = answer;

    try {
      setLoading(true);

      const data = await submitAnswerApi({
        token,
        sessionId,
        transcript: userAnswer,
        mode,
      });

      setHistory((prev) => [
        ...prev,
        {
          role: "candidate",
          text: userAnswer,
        },
        {
          role: "interviewer",
          text: data.next_question,
        },
      ]);

      setQuestion(data.next_question);
      speakText(data.next_question, voiceEnabled);
      setAnswer("");
    } catch (error) {
      console.error("Error submitting answer:", error);
      alert(error.message || "Could not submit answer.");
    } finally {
      setLoading(false);
    }
  };

  const endInterview = async () => {
    if (!sessionId.trim()) {
      alert("No active interview session.");
      return;
    }

    if (!token) {
      alert("Please login first.");
      return;
    }

    try {
      setLoading(true);

      const data = await endInterviewApi({
        token,
        sessionId,
      });

      setFeedback(data.feedback || "No feedback received.");
      setAnalytics(data.analytics || null);
      setSessionId("");
    } catch (error) {
      console.error("Error ending interview:", error);
      alert(error.message || "Could not end interview.");
    } finally {
      setLoading(false);
    }
  };

  const startListening = () => {
    startBrowserListening({
      onStart: () => setIsListening(true),

      onTranscript: (text) => {
        setAnswer(text);
      },

      onEnd: () => {
        setIsListening(false);
      },

      onError: (err) => {
        console.error(err);
        alert("Speech recognition failed.");
        setIsListening(false);
      },
    });
  };

  const toggleVoice = () => {
    stopSpeaking();
    setVoiceEnabled((prev) => !prev);
  };

  const handleStartRecording = async () => {
    await startRecording(() => setIsRecording(true));
  };

  const handleStopRecording = async () => {
    const audioBlob = await stopRecording();
    setIsRecording(false);

    if (!audioBlob) return;

    try {
      const formData = new FormData();
      formData.append("file", audioBlob, "recording.webm");

      const res = await fetch(`${API_BASE}/speech/transcribe`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      setAnswer(data.text || "");
    } catch (error) {
      console.error("Transcription error:", error);
      alert("Could not transcribe audio.");
    }
  };

  return (
    <div style={styles.panel}>
      <div style={styles.sectionTitle}>
        <h3>Start Practice Interview</h3>
        <p>Select a topic and begin a protected AI interview session.</p>
      </div>

      <select
        value={mode}
        onChange={(e) => setMode(e.target.value)}
        style={styles.select}
      >
        <option value="DSA">DSA</option>
        <option value="OS">OS</option>
        <option value="DBMS">DBMS</option>
        <option value="CN">CN</option>
        <option value="OOPs">OOPs</option>
        <option value="HR">HR</option>
        <option value="System Design">System Design</option>
      </select>

      <select
        value={speechMode}
        onChange={(e) => setSpeechMode(e.target.value)}
        style={styles.select}
      >
        <option value="whisper">Whisper STT</option>
        <option value="browser">Browser STT</option>
      </select>

      <button onClick={toggleVoice} style={styles.button}>
        {voiceEnabled ? "🔊 Voice On" : "🔇 Voice Off"}
      </button>

      <button onClick={startInterview} style={styles.button} disabled={loading}>
        {loading ? "Loading..." : "Start Interview"}
      </button>

      {question && (
        <>
          <div style={styles.historyBox}>
            <h3>Interview Conversation</h3>

            {history.map((item, index) => (
              <div
                key={index}
                style={{
                  ...styles.message,
                  backgroundColor:
                    item.role === "interviewer" ? "#eef4ff" : "#f3f4f6",
                }}
              >
                <strong>
                  {item.role === "interviewer" ? "Interviewer: " : "You: "}
                </strong>
                {item.text}
              </div>
            ))}

            <div ref={historyEndRef}></div>
          </div>

          <textarea
            style={styles.textarea}
            rows="6"
            placeholder="Type your answer here..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />

          {speechMode === "browser" ? (
            <button
              onClick={startListening}
              style={styles.button}
              disabled={loading || isListening}
            >
              {isListening ? "Listening..." : "🎤 Speak Answer"}
            </button>
          ) : !isRecording ? (
            <button
              onClick={handleStartRecording}
              style={styles.button}
              disabled={loading}
            >
              🎤 Start Recording
            </button>
          ) : (
            <button onClick={handleStopRecording} style={styles.button}>
              ⏹ Stop Recording
            </button>
          )}

          <button onClick={submitAnswer} style={styles.button} disabled={loading}>
            {loading ? "Submitting..." : "Submit Answer"}
          </button>

          <button onClick={endInterview} style={styles.button} disabled={loading}>
            {loading ? "Ending..." : "End Interview"}
          </button>
        </>
      )}

      {analytics && (
        <div style={styles.analyticsBox}>
          <h3>Structured Analytics</h3>

          <p>
            <strong>Overall Score:</strong> {analytics.overall_score}/10
          </p>

          <h4>Strengths</h4>
          <ul>
            {(analytics.strengths || []).map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h4>Weaknesses</h4>
          <ul>
            {(analytics.weaknesses || []).map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h4>Recommendations</h4>
          <ul>
            {(analytics.recommendations || []).map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {feedback && (
        <div style={styles.feedbackBox}>
          <h3>Raw Interview Feedback</h3>
          <pre style={styles.feedbackText}>{feedback}</pre>
        </div>
      )}
    </div>
  );
}

const styles = {
  panel: {
    marginTop: "24px",
  },

  sectionTitle: {
    marginTop: "24px",
    paddingTop: "10px",
  },

  select: {
    marginTop: "10px",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    width: "100%",
    boxSizing: "border-box",
  },

  historyBox: {
    marginTop: "20px",
    padding: "15px",
    background: "#ffffff",
    borderRadius: "8px",
    border: "1px solid #ddd",
    maxHeight: "350px",
    overflowY: "auto",
  },

  message: {
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "8px",
    lineHeight: "1.5",
  },

  textarea: {
    width: "100%",
    marginTop: "20px",
    padding: "12px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    resize: "vertical",
    boxSizing: "border-box",
  },

  button: {
    marginTop: "20px",
    padding: "12px 18px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "none",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
    width: "100%",
  },

  analyticsBox: {
    marginTop: "20px",
    padding: "15px",
    background: "#f0fdf4",
    borderRadius: "8px",
    border: "1px solid #bbf7d0",
  },

  feedbackBox: {
    marginTop: "20px",
    padding: "15px",
    background: "#fefce8",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
  },

  feedbackText: {
    whiteSpace: "pre-wrap",
    fontFamily: "inherit",
    lineHeight: "1.6",
  },
};

export default InterviewPanel;