import { useState } from "react";

import AuthPanel from "./components/AuthPanel";
import DashboardPanel from "./components/DashboardPanel";
import InterviewPanel from "./components/InterviewPanel";
import ReportPanel from "./components/ReportPanel";

import "./App.css";

function App() {
  // Stores JWT token after login.
  // Empty string means the user is logged out.
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // Controls which logged-in screen React should display.
  const [activeScreen, setActiveScreen] = useState("dashboard");

  // Stores the latest completed interview report.
  // App owns this because InterviewPanel sends data upward,
  // then App displays it on the separate Report screen.
  const [latestReport, setLatestReport] = useState(null);

  const handleLoginSuccess = (newToken) => {
    setToken(newToken);
    setActiveScreen("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setLatestReport(null);
    setActiveScreen("dashboard");
  };

  const handleInterviewCompleted = (reportData) => {
    setLatestReport(reportData);
    setActiveScreen("report");
  };

  // USER IS NOT LOGGED IN
  if (!token) {
    return (
      <div className="app-page auth-page">
        <div className="auth-container">
          <div className="brand-block">
            <p className="brand-kicker">ALGOGLORY</p>

            <h1>
              Practice interviews.
              <br />
              Improve with evidence.
            </h1>

            <p className="brand-description">
              AI-powered mock interviews for DSA, CS fundamentals, backend,
              and system design preparation.
            </p>
          </div>

          <AuthPanel
            token={token}
            onLoginSuccess={handleLoginSuccess}
            onLogout={handleLogout}
          />
        </div>
      </div>
    );
  }

  // USER IS LOGGED IN
  return (
    <div className="app-page">
      <header className="topbar">
        <button
          className="brand-button"
          onClick={() => setActiveScreen("dashboard")}
        >
          Algo<span>Glory</span>
        </button>

        <nav className="topbar-nav">
          <button
            className={
              activeScreen === "dashboard"
                ? "nav-button active-nav-button"
                : "nav-button"
            }
            onClick={() => setActiveScreen("dashboard")}
          >
            Dashboard
          </button>

          <button
            className={
              activeScreen === "interview"
                ? "nav-button active-nav-button"
                : "nav-button"
            }
            onClick={() => setActiveScreen("interview")}
          >
            AI Interview
          </button>

          <button
            className={
              activeScreen === "report"
                ? "nav-button active-nav-button"
                : "nav-button"
            }
            onClick={() => setActiveScreen("report")}
            disabled={!latestReport}
            title={
              !latestReport
                ? "Complete an interview to unlock your report."
                : "View latest report"
            }
          >
            Report
          </button>

          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </header>

      <main className="app-content">
        {activeScreen === "dashboard" && (
          <section>
            <div className="page-heading">
              <p className="page-kicker">PERSONALIZED PREPARATION</p>

              <h2>Your interview command center.</h2>

              <p>
                Track your performance, identify gaps, and start your next
                practice session.
              </p>

              <button
                className="primary-button"
                onClick={() => setActiveScreen("interview")}
              >
                Start AI Interview →
              </button>
            </div>

            <DashboardPanel token={token} />
          </section>
        )}

        {activeScreen === "interview" && (
          <section>
            <div className="page-heading">
              <p className="page-kicker">AI INTERVIEW ROOM</p>

              <h2>Practice like it is the real interview.</h2>

              <p>
                Select a topic, answer naturally, and receive structured
                feedback after the session.
              </p>
            </div>

            <InterviewPanel
              token={token}
              onInterviewCompleted={handleInterviewCompleted}
            />
          </section>
        )}

        {activeScreen === "report" && (
          <section>
            <div className="page-heading">
              <p className="page-kicker">INTERVIEW REPORT</p>

              <h2>See what to improve next.</h2>

              <p>
                Your interview feedback is structured into strengths,
                weaknesses, and practical actions for the next attempt.
              </p>
            </div>

            <ReportPanel
              report={latestReport}
              onBackToDashboard={() => setActiveScreen("dashboard")}
              onStartAnother={() => setActiveScreen("interview")}
            />
          </section>
        )}
      </main>
    </div>
  );
}

export default App;