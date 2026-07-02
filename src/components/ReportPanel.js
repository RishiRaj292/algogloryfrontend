function ReportPanel({ report, onBackToDashboard, onStartAnother }) {
  if (!report?.analytics) {
    return (
      <section className="report-panel report-empty-card">
        <h3>No report selected yet.</h3>

        <p>
          Complete an AI interview to generate your personalized report.
        </p>

        <button
          type="button"
          className="start-interview-button"
          onClick={onStartAnother}
        >
          Start an interview →
        </button>
      </section>
    );
  }

  const { analytics, mode } = report;

  return (
    <section className="report-panel">
      <header className="report-hero-card">
        <div>
          <p className="interview-kicker">SESSION COMPLETE</p>

          <h3>{mode} interview report</h3>

          <p>
            Focus on the actions below before your next practice attempt.
          </p>
        </div>

        <div className="report-score-circle">
          <strong>{analytics.overall_score ?? "N/A"}</strong>
          <span>/10</span>
        </div>
      </header>

      <section className="report-summary-card">
        <h4>Interview summary</h4>

        <p>
          {analytics.summary ||
            "Your feedback has been generated successfully. Review the areas below and practice again."}
        </p>
      </section>

      <div className="report-insight-grid">
        <ReportList
          title="What you did well"
          items={analytics.strengths || []}
          type="strength"
          emptyText="No strengths were detected in this report."
        />

        <ReportList
          title="What to improve"
          items={analytics.weaknesses || []}
          type="weakness"
          emptyText="No improvement areas were detected in this report."
        />
      </div>

      <section className="report-action-card">
        <div>
          <p className="interview-kicker">NEXT PRACTICE PLAN</p>
          <h4>Recommended actions</h4>
        </div>

        {(analytics.recommendations || []).length > 0 ? (
          <ol className="report-action-list">
            {analytics.recommendations.map((recommendation, index) => (
              <li key={index}>
                <span>{index + 1}</span>
                <p>{recommendation}</p>
              </li>
            ))}
          </ol>
        ) : (
          <p className="report-empty-text">
            Complete more interviews to receive targeted recommendations.
          </p>
        )}
      </section>

      <div className="report-footer-actions">
        <button
          type="button"
          className="report-secondary-button"
          onClick={onBackToDashboard}
        >
          Back to dashboard
        </button>

        <button
          type="button"
          className="submit-answer-button"
          onClick={onStartAnother}
        >
          Start another interview →
        </button>
      </div>
    </section>
  );
}

function ReportList({ title, items, type, emptyText }) {
  return (
    <section className="report-list-card">
      <h4>{title}</h4>

      {items.length > 0 ? (
        <ul>
          {items.map((item, index) => (
            <li key={index}>
              <span
                className={
                  type === "strength"
                    ? "report-list-dot report-list-dot-strength"
                    : "report-list-dot report-list-dot-weakness"
                }
              />

              <p>{item}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="report-empty-text">{emptyText}</p>
      )}
    </section>
  );
}

export default ReportPanel;