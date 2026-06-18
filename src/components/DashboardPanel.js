// import { useState } from "react";
// import { fetchDashboardApi } from "../api/dashboardApi";

// function DashboardPanel({ token }) {
//   const [dashboard, setDashboard] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const loadDashboard = async () => {
//     if (!token) {
//       alert("Please login first.");
//       return;
//     }

//     try {
//       setLoading(true);

//       const data = await fetchDashboardApi(token);
//       setDashboard(data);
//     } catch (error) {
//       console.error("Dashboard error:", error);
//       alert(error.message || "Could not fetch dashboard.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={styles.dashboardBox}>
//       <div style={styles.headerRow}>
//         <div>
//           <h3 style={styles.heading}>Dashboard</h3>
//           <p style={styles.subtitle}>
//             Your interview progress and analytics summary
//           </p>
//         </div>

//         <button
//           onClick={loadDashboard}
//           style={styles.smallButton}
//           disabled={loading || !token}
//         >
//           {loading ? "Loading..." : "Refresh"}
//         </button>
//       </div>

//       {!token && (
//         <p style={styles.infoText}>Login to view your personalized dashboard.</p>
//       )}

//       {token && !dashboard && (
//         <p style={styles.infoText}>
//           Click refresh to load your dashboard analytics.
//         </p>
//       )}

//       {dashboard && (
//         <>
//           <div style={styles.statsGrid}>
//             <div style={styles.statCard}>
//               <p style={styles.statLabel}>Total Interviews</p>
//               <h2 style={styles.statValue}>
//                 {dashboard.stats?.total_interviews ?? 0}
//               </h2>
//             </div>

//             <div style={styles.statCard}>
//               <p style={styles.statLabel}>Completed</p>
//               <h2 style={styles.statValue}>
//                 {dashboard.stats?.completed_interviews ?? 0}
//               </h2>
//             </div>

//             <div style={styles.statCard}>
//               <p style={styles.statLabel}>Average Score</p>
//               <h2 style={styles.statValue}>
//                 {dashboard.stats?.average_score ?? "N/A"}
//               </h2>
//             </div>
//           </div>

//           <div style={styles.section}>
//             <h4>Top Strengths</h4>
//             {dashboard.strengths?.length > 0 ? (
//               <ul>
//                 {dashboard.strengths.map((item, index) => (
//                   <li key={index}>{item}</li>
//                 ))}
//               </ul>
//             ) : (
//               <p style={styles.emptyText}>No strengths available yet.</p>
//             )}
//           </div>

//           <div style={styles.section}>
//             <h4>Weaknesses to Improve</h4>
//             {dashboard.weaknesses?.length > 0 ? (
//               <ul>
//                 {dashboard.weaknesses.map((item, index) => (
//                   <li key={index}>{item}</li>
//                 ))}
//               </ul>
//             ) : (
//               <p style={styles.emptyText}>No weaknesses available yet.</p>
//             )}
//           </div>

//           <div style={styles.section}>
//             <h4>Recommendations</h4>
//             {dashboard.recommendations?.length > 0 ? (
//               <ul>
//                 {dashboard.recommendations.map((item, index) => (
//                   <li key={index}>{item}</li>
//                 ))}
//               </ul>
//             ) : (
//               <p style={styles.emptyText}>No recommendations available yet.</p>
//             )}
//           </div>

//           <div style={styles.section}>
//             <h4>Recent Interviews</h4>

//             {dashboard.recent_interviews?.length > 0 ? (
//               <div style={styles.recentList}>
//                 {dashboard.recent_interviews.map((interview) => (
//                   <div key={interview.id} style={styles.recentItem}>
//                     <div>
//                       <strong>{interview.mode}</strong>
//                       <p style={styles.recentMeta}>
//                         Status: {interview.status}
//                       </p>
//                     </div>

//                     <div style={styles.scoreBadge}>
//                       {interview.overall_score ?? "N/A"}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p style={styles.emptyText}>No interviews yet.</p>
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// const styles = {
//   dashboardBox: {
//     marginTop: "20px",
//     padding: "18px",
//     border: "1px solid #bfdbfe",
//     borderRadius: "10px",
//     background: "#eff6ff",
//   },

//   headerRow: {
//     display: "flex",
//     justifyContent: "space-between",
//     gap: "12px",
//     alignItems: "center",
//   },

//   heading: {
//     margin: 0,
//   },

//   subtitle: {
//     marginTop: "6px",
//     color: "#4b5563",
//   },

//   smallButton: {
//     padding: "10px 14px",
//     fontSize: "14px",
//     borderRadius: "8px",
//     border: "none",
//     background: "#2563eb",
//     color: "white",
//     cursor: "pointer",
//   },

//   infoText: {
//     color: "#4b5563",
//   },

//   statsGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(3, 1fr)",
//     gap: "12px",
//     marginTop: "15px",
//   },

//   statCard: {
//     background: "white",
//     borderRadius: "8px",
//     padding: "12px",
//     border: "1px solid #dbeafe",
//   },

//   statLabel: {
//     margin: 0,
//     color: "#6b7280",
//     fontSize: "14px",
//   },

//   statValue: {
//     margin: "8px 0 0 0",
//   },

//   section: {
//     marginTop: "18px",
//     background: "white",
//     padding: "12px",
//     borderRadius: "8px",
//     border: "1px solid #dbeafe",
//   },

//   emptyText: {
//     color: "#6b7280",
//   },

//   recentList: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "10px",
//   },

//   recentItem: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: "10px",
//     borderRadius: "8px",
//     background: "#f9fafb",
//     border: "1px solid #e5e7eb",
//   },

//   recentMeta: {
//     margin: "4px 0 0 0",
//     color: "#6b7280",
//     fontSize: "14px",
//   },

//   scoreBadge: {
//     minWidth: "45px",
//     textAlign: "center",
//     padding: "6px 8px",
//     borderRadius: "999px",
//     background: "#dbeafe",
//     fontWeight: "bold",
//   },
// };

// export default DashboardPanel;
import { useState } from "react";
import { fetchDashboardApi } from "../api/dashboardApi";

function DashboardPanel({ token }) {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadDashboard = async () => {
    if (!token) {
      alert("Please login first.");
      return;
    }

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

  const averageScore = dashboard?.stats?.average_score;

  return (
    <div style={styles.dashboardBox}>
      <div style={styles.headerRow}>
        <div>
          <p style={styles.kicker}>Personalized Progress</p>
          <h2 style={styles.heading}>Dashboard</h2>
          <p style={styles.subtitle}>
            Track your interview practice, strengths, weaknesses, and improvement areas.
          </p>
        </div>

        <button
          onClick={loadDashboard}
          style={{
            ...styles.refreshButton,
            opacity: loading || !token ? 0.6 : 1,
            cursor: loading || !token ? "not-allowed" : "pointer",
          }}
          disabled={loading || !token}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {!token && (
        <div style={styles.emptyState}>
          <strong>Login required</strong>
          <p>Login to view your personalized analytics dashboard.</p>
        </div>
      )}

      {token && !dashboard && (
        <div style={styles.emptyState}>
          <strong>No dashboard loaded</strong>
          <p>Click Refresh to load your latest progress.</p>
        </div>
      )}

      {dashboard && (
        <>
          <div style={styles.statsGrid}>
            <StatCard
              label="Total Interviews"
              value={dashboard.stats?.total_interviews ?? 0}
              helper="All attempts"
            />

            <StatCard
              label="Completed"
              value={dashboard.stats?.completed_interviews ?? 0}
              helper="Finished sessions"
            />

            <StatCard
              label="Average Score"
              value={averageScore ?? "N/A"}
              helper={averageScore ? getScoreMessage(averageScore) : "No scored attempts"}
              highlight
            />
          </div>

          <div style={styles.twoColumnGrid}>
            <ChipSection
              title="Top Strengths"
              items={dashboard.strengths || []}
              emptyText="No strengths detected yet."
              type="strength"
            />

            <ChipSection
              title="Weaknesses to Improve"
              items={dashboard.weaknesses || []}
              emptyText="No weaknesses detected yet."
              type="weakness"
            />
          </div>

          <ChipSection
            title="Recommendations"
            items={dashboard.recommendations || []}
            emptyText="No recommendations available yet."
            type="recommendation"
          />

          <RecentInterviews interviews={dashboard.recent_interviews || []} />
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, helper, highlight = false }) {
  return (
    <div style={highlight ? styles.statCardHighlight : styles.statCard}>
      <p style={styles.statLabel}>{label}</p>
      <h2 style={styles.statValue}>{value}</h2>
      <p style={styles.statHelper}>{helper}</p>
    </div>
  );
}

function ChipSection({ title, items, emptyText, type }) {
  return (
    <div style={styles.sectionCard}>
      <h3 style={styles.sectionTitle}>{title}</h3>

      {items.length > 0 ? (
        <div style={styles.chipWrap}>
          {items.map((item, index) => (
            <span key={index} style={getChipStyle(type)}>
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p style={styles.emptyText}>{emptyText}</p>
      )}
    </div>
  );
}

function RecentInterviews({ interviews }) {
  return (
    <div style={styles.sectionCard}>
      <div style={styles.recentHeader}>
        <h3 style={styles.sectionTitle}>Recent Interviews</h3>
        <span style={styles.countBadge}>{interviews.length}</span>
      </div>

      {interviews.length > 0 ? (
        <div style={styles.recentList}>
          {interviews.map((interview) => (
            <div key={interview.id} style={styles.recentItem}>
              <div>
                <strong>{interview.mode}</strong>
                <p style={styles.recentMeta}>
                  {formatStatus(interview.status)}
                  {interview.started_at ? ` • ${formatDate(interview.started_at)}` : ""}
                </p>
              </div>

              <span style={getScoreBadgeStyle(interview.overall_score)}>
                {interview.overall_score ?? "N/A"}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p style={styles.emptyText}>No interviews yet.</p>
      )}
    </div>
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

function getChipStyle(type) {
  if (type === "strength") {
    return {
      ...styles.chip,
      background: "#ecfdf5",
      border: "1px solid #bbf7d0",
      color: "#166534",
    };
  }

  if (type === "weakness") {
    return {
      ...styles.chip,
      background: "#fff7ed",
      border: "1px solid #fed7aa",
      color: "#9a3412",
    };
  }

  return {
    ...styles.chip,
    background: "#eef2ff",
    border: "1px solid #c7d2fe",
    color: "#3730a3",
  };
}

function getScoreBadgeStyle(score) {
  if (score === null || score === undefined) {
    return {
      ...styles.scoreBadge,
      background: "#f3f4f6",
      color: "#4b5563",
    };
  }

  if (score >= 8) {
    return {
      ...styles.scoreBadge,
      background: "#dcfce7",
      color: "#166534",
    };
  }

  if (score >= 6) {
    return {
      ...styles.scoreBadge,
      background: "#dbeafe",
      color: "#1d4ed8",
    };
  }

  if (score >= 4) {
    return {
      ...styles.scoreBadge,
      background: "#fef3c7",
      color: "#92400e",
    };
  }

  return {
    ...styles.scoreBadge,
    background: "#fee2e2",
    color: "#991b1b",
  };
}

const styles = {
  dashboardBox: {
    marginTop: "22px",
    padding: "22px",
    border: "1px solid #dbeafe",
    borderRadius: "16px",
    background: "linear-gradient(180deg, #eff6ff 0%, #ffffff 100%)",
  },

  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    alignItems: "flex-start",
  },

  kicker: {
    margin: 0,
    color: "#2563eb",
    fontSize: "13px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },

  heading: {
    margin: "6px 0 0 0",
    fontSize: "28px",
  },

  subtitle: {
    marginTop: "8px",
    marginBottom: 0,
    color: "#4b5563",
    lineHeight: "1.5",
  },

  refreshButton: {
    padding: "11px 16px",
    fontSize: "14px",
    borderRadius: "10px",
    border: "none",
    background: "#2563eb",
    color: "white",
    fontWeight: "600",
  },

  emptyState: {
    marginTop: "18px",
    padding: "18px",
    borderRadius: "12px",
    background: "#ffffff",
    border: "1px dashed #bfdbfe",
    color: "#4b5563",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "14px",
    marginTop: "20px",
  },

  statCard: {
    background: "#ffffff",
    borderRadius: "14px",
    padding: "16px",
    border: "1px solid #e5e7eb",
  },

  statCardHighlight: {
    background: "#ffffff",
    borderRadius: "14px",
    padding: "16px",
    border: "1px solid #bfdbfe",
    boxShadow: "0 8px 18px rgba(37, 99, 235, 0.08)",
  },

  statLabel: {
    margin: 0,
    color: "#6b7280",
    fontSize: "14px",
  },

  statValue: {
    margin: "8px 0 0 0",
    fontSize: "30px",
  },

  statHelper: {
    margin: "6px 0 0 0",
    color: "#6b7280",
    fontSize: "13px",
  },

  twoColumnGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
    marginTop: "14px",
  },

  sectionCard: {
    marginTop: "14px",
    background: "#ffffff",
    padding: "16px",
    borderRadius: "14px",
    border: "1px solid #e5e7eb",
  },

  sectionTitle: {
    margin: "0 0 12px 0",
    fontSize: "17px",
  },

  chipWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },

  chip: {
    display: "inline-block",
    padding: "8px 10px",
    borderRadius: "999px",
    fontSize: "14px",
    lineHeight: "1.2",
  },

  emptyText: {
    margin: 0,
    color: "#6b7280",
  },

  recentHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  countBadge: {
    padding: "4px 9px",
    borderRadius: "999px",
    background: "#eff6ff",
    color: "#1d4ed8",
    fontWeight: "700",
    fontSize: "13px",
  },

  recentList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  recentItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px",
    borderRadius: "12px",
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
  },

  recentMeta: {
    margin: "5px 0 0 0",
    color: "#6b7280",
    fontSize: "13px",
  },

  scoreBadge: {
    minWidth: "48px",
    textAlign: "center",
    padding: "7px 9px",
    borderRadius: "999px",
    fontWeight: "800",
  },
};

export default DashboardPanel;