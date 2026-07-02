import { useEffect, useState } from "react";
import { fetchDashboardApi } from "../api/dashboardApi";

function DashboardPanel({ token }) {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    if (!token) return;

    try {
      setLoading(true);

      const data = await fetchDashboardApi(token);
      setDashboard(data);
    } catch (error) {
      console.error("Dashboard error:", error);
      alert(error.message || "Could not fetch dashboard.");
    } finally {
      setLoading(false);
    }
  };

  // Whenever a valid token reaches this component,
  // automatically load the user's dashboard data.
  useEffect(() => {
    loadDashboard();
  }, [token]);

  const averageScore = dashboard?.stats?.average_score;

  if (loading) {
    return (
      <section className="dashboard-panel dashboard-loading-card">
        <p className="dashboard-loading-title">Loading your progress...</p>
        <p className="dashboard-loading-text">
          Fetching your interview analytics from AlgoGlory.
        </p>
      </section>
    );
  }

  return (
    <section className="dashboard-panel">
      <div className="dashboard-panel-header">
        <div>
          <p className="dashboard-kicker">PERSONALIZED PROGRESS</p>

          <h3 className="dashboard-title">Your performance overview</h3>

          <p className="dashboard-subtitle">
            See what is improving, what needs work, and what to practice next.
          </p>
        </div>

        <button
          className="dashboard-refresh-button"
          onClick={loadDashboard}
          disabled={loading}
        >
          Refresh
        </button>
      </div>

      {!dashboard ? (
        <div className="dashboard-empty-state">
          <strong>No dashboard data yet.</strong>

          <p>
            Complete an interview to unlock your personalized strengths,
            weaknesses, and recommendations.
          </p>
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <StatCard
              label="Total interviews"
              value={dashboard.stats?.total_interviews ?? 0}
              helper="All attempts"
            />

            <StatCard
              label="Completed"
              value={dashboard.stats?.completed_interviews ?? 0}
              helper="Finished sessions"
            />

            <StatCard
              label="Average score"
              value={averageScore ?? "N/A"}
              helper={
                averageScore
                  ? getScoreMessage(averageScore)
                  : "No scored attempts"
              }
              highlight
            />
          </div>

          <div className="insight-grid">
            <ChipSection
              title="Top strengths"
              items={dashboard.strengths || []}
              emptyText="No strengths detected yet."
              type="strength"
            />

            <ChipSection
              title="Areas to improve"
              items={dashboard.weaknesses || []}
              emptyText="No weaknesses detected yet."
              type="weakness"
            />
          </div>

          <ChipSection
            title="Recommended next actions"
            items={dashboard.recommendations || []}
            emptyText="Complete another interview to receive recommendations."
            type="recommendation"
          />

          <RecentInterviews interviews={dashboard.recent_interviews || []} />
        </>
      )}
    </section>
  );
}

function StatCard({ label, value, helper, highlight = false }) {
  return (
    <article className={highlight ? "stat-card stat-card-highlight" : "stat-card"}>
      <p className="stat-label">{label}</p>
      <h2 className="stat-value">{value}</h2>
      <p className="stat-helper">{helper}</p>
    </article>
  );
}

function ChipSection({ title, items, emptyText, type }) {
  return (
    <section className="insight-card">
      <h4 className="insight-title">{title}</h4>

      {items.length > 0 ? (
        <div className="chip-wrap">
          {items.map((item, index) => (
            <span key={index} className={`insight-chip ${type}-chip`}>
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p className="dashboard-empty-text">{emptyText}</p>
      )}
    </section>
  );
}

function RecentInterviews({ interviews }) {
  return (
    <section className="insight-card recent-interviews-card">
      <div className="recent-header">
        <h4 className="insight-title">Recent interviews</h4>

        <span className="count-badge">{interviews.length}</span>
      </div>

      {interviews.length > 0 ? (
        <div className="recent-list">
          {interviews.map((interview) => (
            <article key={interview.id} className="recent-item">
              <div>
                <p className="recent-mode">{interview.mode}</p>

                <p className="recent-meta">
                  {formatStatus(interview.status)}
                  {interview.started_at
                    ? ` • ${formatDate(interview.started_at)}`
                    : ""}
                </p>
              </div>

              <span className={getScoreClass(interview.overall_score)}>
                {interview.overall_score ?? "N/A"}
              </span>
            </article>
          ))}
        </div>
      ) : (
        <p className="dashboard-empty-text">No interviews yet.</p>
      )}
    </section>
  );
}

function getScoreMessage(score) {
  if (score >= 8) return "Strong performance";
  if (score >= 6) return "Good progress";
  if (score >= 4) return "Needs improvement";
  return "Early stage";
}

function formatStatus(status) {
  if (!status) return "Unknown";

  return status
    .replace("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(dateString) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString();
}

function getScoreClass(score) {
  if (score === null || score === undefined) {
    return "score-badge score-badge-neutral";
  }

  if (score >= 8) return "score-badge score-badge-strong";
  if (score >= 6) return "score-badge score-badge-good";
  if (score >= 4) return "score-badge score-badge-average";

  return "score-badge score-badge-low";
}

export default DashboardPanel;