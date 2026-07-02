import { useEffect, useRef, useState } from "react";

import { speakText, stopSpeaking, startBrowserListening } from "../utils/speech";
import {
  playInterviewerAudio,
  stopInterviewerAudio,
} from "../utils/interviewerAudio";
import { startRecording, stopRecording } from "../speech/recorder";

import {
  startInterviewApi,
  submitAnswerApi,
  endInterviewApi,
} from "../api/interviewApi";

const API_BASE = "http://127.0.0.1:8000";

function InterviewPanel({ token, onInterviewCompleted }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const [sessionId, setSessionId] = useState("");
  const [history, setHistory] = useState([]);

  // Kept temporarily even though App now owns the final report screen.
  // It helps this component know whether an interview has been completed.
  const [analytics, setAnalytics] = useState(null);

  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const [mode, setMode] = useState("DSA");
  const [isRecording, setIsRecording] = useState(false);
  const [speechMode, setSpeechMode] = useState("whisper");

  const historyEndRef = useRef(null);

  const hasActiveInterview = Boolean(sessionId);
  const hasCompletedInterview = Boolean(analytics);

  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const speakInterviewerQuestion = async (questionText) => {
    if (!voiceEnabled) {
      return;
    }

    try {
      await playInterviewerAudio(questionText, token);
    } catch (error) {
      // Backup only. If backend TTS fails, interview must still continue.
      speakText(questionText, true);
    }
  };

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
      setAnalytics(null);

      setHistory([
        {
          role: "interviewer",
          text: data.question,
        },
      ]);

      speakInterviewerQuestion(data.question);
    } catch (error) {
      console.error("Error starting interview:", error);
      alert(error.message || "Could not start interview.");
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim() || !sessionId.trim()) {
      alert("Please start the interview and provide an answer.");
      return;
    }

    if (!token) {
      alert("Please login first.");
      return;
    }

    const userAnswer = answer.trim();

    try {
      setLoading(true);

      const data = await submitAnswerApi({
        token,
        sessionId,
        transcript: userAnswer,
        mode,
      });

      setHistory((previousHistory) => [
        ...previousHistory,
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
      setAnswer("");

      speakInterviewerQuestion(data.next_question);
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
      stopSpeaking();
      stopInterviewerAudio();
      const data = await endInterviewApi({
        token,
        sessionId,
      });

      const completedAnalytics = data.analytics || null;

      /*
        Important flow:

        1. Backend returns analytics from /session/end.
        2. InterviewPanel sends that analytics upward to App.
        3. App saves it in latestReport.
        4. App switches activeScreen to "report".
      */
      setAnalytics(completedAnalytics);

      setSessionId("");
      setIsListening(false);
      setIsRecording(false);

      onInterviewCompleted({
        analytics: completedAnalytics,
        mode,
      });
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

      onError: (errorMessage) => {
        console.error(errorMessage);
        alert("Speech recognition failed.");
        setIsListening(false);
      },
    });
  };

  const toggleVoice = () => {
    stopSpeaking();
    stopInterviewerAudio();

    setVoiceEnabled((previousValue) => !previousValue);
  };

  const handleStartRecording = async () => {
    try {
      await startRecording(() => setIsRecording(true));
    } catch (error) {
      console.error("Recording error:", error);
      alert("Could not access your microphone.");
    }
  };

  const handleStopRecording = async () => {
    const audioBlob = await stopRecording();
    setIsRecording(false);

    if (!audioBlob) {
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", audioBlob, "recording.webm");

      const response = await fetch(`${API_BASE}/speech/transcribe`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || "Could not transcribe audio.");
      }

      setAnswer(data.text || "");
    } catch (error) {
      console.error("Transcription error:", error);
      alert(error.message || "Could not transcribe audio.");
    } finally {
      setLoading(false);
    }
  };

  const resetForNewInterview = () => {
    stopSpeaking();

    setQuestion("");
    setAnswer("");
    setSessionId("");
    setHistory([]);
    setAnalytics(null);

    setIsListening(false);
    setIsRecording(false);
  };

  return (
    <div className="interview-panel">
      {!hasActiveInterview && !hasCompletedInterview && (
        <section className="interview-setup-card">
          <div className="interview-setup-header">
            <div>
              <p className="interview-kicker">START A PRACTICE SESSION</p>

              <h3>Set up your interview</h3>

              <p>
                Pick a topic and answer naturally. AlgoGlory will ask
                follow-up questions based on your responses.
              </p>
            </div>

            <button
              type="button"
              className={
                voiceEnabled
                  ? "voice-toggle voice-toggle-active"
                  : "voice-toggle"
              }
              onClick={toggleVoice}
            >
              {voiceEnabled ? "🔊 Voice on" : "🔇 Voice off"}
            </button>
          </div>

          <div className="interview-setup-grid">
            <label className="field-group">
              <span>Interview topic</span>

              <select
                value={mode}
                onChange={(event) => setMode(event.target.value)}
              >
                <option value="DSA">DSA</option>
                <option value="OS">Operating Systems</option>
                <option value="DBMS">DBMS</option>
                <option value="CN">Computer Networks</option>
                <option value="OOPs">OOPs</option>
                <option value="HR">HR / Behavioral</option>
                <option value="System Design">System Design</option>
              </select>
            </label>

            <label className="field-group">
              <span>Answer input</span>

              <select
                value={speechMode}
                onChange={(event) => setSpeechMode(event.target.value)}
              >
                <option value="whisper">
                  Record with Whisper transcription
                </option>
                <option value="browser">
                  Use browser speech recognition
                </option>
              </select>
            </label>
          </div>

          <button
            type="button"
            className="start-interview-button"
            onClick={startInterview}
            disabled={loading}
          >
            {loading ? "Preparing interview..." : `Start ${mode} interview →`}
          </button>
        </section>
      )}

      {hasActiveInterview && (
        <section className="interview-room">
          <header className="interview-room-header">
            <div>
              <p className="interview-kicker">LIVE PRACTICE SESSION</p>

              <h3>{mode} interview</h3>

              <p>
                Answer clearly, give examples, and treat this like a real
                technical interview.
              </p>
            </div>

            <div className="interview-header-actions">
              <button
                type="button"
                className={
                  voiceEnabled
                    ? "voice-toggle voice-toggle-active"
                    : "voice-toggle"
                }
                onClick={toggleVoice}
              >
                {voiceEnabled ? "🔊 Voice on" : "🔇 Voice off"}
              </button>

              <button
                type="button"
                className="end-interview-button"
                onClick={endInterview}
                disabled={loading}
              >
                {loading ? "Ending..." : "End interview"}
              </button>
            </div>
          </header>

          <div className="conversation-card">
            <div className="conversation-header">
              <div>
                <p className="conversation-title">Interview conversation</p>

                <p className="conversation-subtitle">
                  Your transcript remains visible throughout this session.
                </p>
              </div>

              <span className="question-count">
                {
                  history.filter(
                    (item) => item.role === "interviewer"
                  ).length
                }{" "}
                questions
              </span>
            </div>

            <div className="conversation-list">
              {history.map((item, index) => (
                <article
                  key={index}
                  className={
                    item.role === "interviewer"
                      ? "chat-message interviewer-message"
                      : "chat-message candidate-message"
                  }
                >
                  <p className="message-role">
                    {item.role === "interviewer"
                      ? "AlgoGlory Interviewer"
                      : "You"}
                  </p>

                  <p className="message-text">{item.text}</p>
                </article>
              ))}

              <div ref={historyEndRef} />
            </div>
          </div>

          <section className="answer-card">
            <div className="answer-card-header">
              <div>
                <h4>Your answer</h4>

                <p>
                  Type your answer, or use your selected voice input method.
                </p>
              </div>

              <span className="answer-count">
                {answer.length} characters
              </span>
            </div>

            <textarea
              rows="7"
              placeholder="Start explaining your answer here..."
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              disabled={loading}
            />

            <div className="answer-actions">
              {speechMode === "browser" ? (
                <button
                  type="button"
                  className={
                    isListening
                      ? "recording-button recording-button-active"
                      : "recording-button"
                  }
                  onClick={startListening}
                  disabled={loading || isListening}
                >
                  {isListening ? "● Listening..." : "🎤 Speak answer"}
                </button>
              ) : !isRecording ? (
                <button
                  type="button"
                  className="recording-button"
                  onClick={handleStartRecording}
                  disabled={loading}
                >
                  🎤 Record answer
                </button>
              ) : (
                <button
                  type="button"
                  className="recording-button recording-button-active"
                  onClick={handleStopRecording}
                  disabled={loading}
                >
                  ■ Stop and transcribe
                </button>
              )}

              <button
                type="button"
                className="submit-answer-button"
                onClick={submitAnswer}
                disabled={loading || !answer.trim()}
              >
                {loading ? "Processing..." : "Submit answer →"}
              </button>
            </div>
          </section>
        </section>
      )}

      {/* This should normally disappear quickly because App switches to Report. */}
      {hasCompletedInterview && (
        <section className="completion-card">
          <p className="interview-kicker">INTERVIEW COMPLETE</p>

          <h3>Nice work. Your report is ready.</h3>

          <p className="completion-summary">
            Redirecting you to your detailed interview report.
          </p>

          <button
            type="button"
            className="start-interview-button"
            onClick={resetForNewInterview}
          >
            Start another interview →
          </button>
        </section>
      )}
    </div>
  );
}

export default InterviewPanel;