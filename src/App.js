import { useState } from "react";

import AuthPanel from "./components/AuthPanel";
import DashboardPanel from "./components/DashboardPanel";
import InterviewPanel from "./components/InterviewPanel";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const handleLoginSuccess = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1>Algo-glory.ai</h1>
        <p>AI Interview Practice</p>

        <AuthPanel
          token={token}
          onLoginSuccess={handleLoginSuccess}
          onLogout={handleLogout}
        />

        <DashboardPanel token={token} />

        <InterviewPanel token={token} />
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    background: "#f4f6f8",
    padding: "20px",
  },

  card: {
    width: "100%",
    maxWidth: "800px",
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },
};

export default App;