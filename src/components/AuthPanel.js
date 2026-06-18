import { useState } from "react";
import { registerUser, loginUser } from "../api/authApi";

function AuthPanel({ token, onLoginSuccess, onLogout }) {
  const [email, setEmail] = useState("newuser@test.com");
  const [password, setPassword] = useState("test123");
  const [fullName, setFullName] = useState("New User");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    try {
      setLoading(true);

      await registerUser({
        email,
        password,
        fullName,
      });

      alert("Registered successfully. Now login.");
    } catch (error) {
      console.error("Register error:", error);
      alert(error.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      setLoading(true);

      const data = await loginUser({
        email,
        password,
      });

      localStorage.setItem("token", data.access_token);
      onLoginSuccess(data.access_token);

      alert("Login successful.");
    } catch (error) {
      console.error("Login error:", error);
      alert(error.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    onLogout();
  };

  return (
    <div style={styles.authBox}>
      <h3>Authentication</h3>

      <input
        style={styles.input}
        placeholder="Full name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />

      <input
        style={styles.input}
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        style={styles.input}
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {!token ? (
        <>
          <button onClick={handleRegister} style={styles.button} disabled={loading}>
            {loading ? "Please wait..." : "Register"}
          </button>

          <button onClick={handleLogin} style={styles.button} disabled={loading}>
            {loading ? "Please wait..." : "Login"}
          </button>
        </>
      ) : (
        <>
          <p style={styles.successText}>Logged in</p>

          <button onClick={handleLogout} style={styles.secondaryButton}>
            Logout
          </button>
        </>
      )}
    </div>
  );
}

const styles = {
  authBox: {
    marginTop: "20px",
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    background: "#f9fafb",
  },

  input: {
    marginTop: "10px",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    width: "100%",
    boxSizing: "border-box",
  },

  button: {
    marginTop: "15px",
    padding: "12px 18px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "none",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
    width: "100%",
  },

  secondaryButton: {
    marginTop: "15px",
    padding: "12px 18px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "none",
    background: "#6b7280",
    color: "white",
    cursor: "pointer",
    width: "100%",
  },

  successText: {
    color: "#16a34a",
    fontWeight: "bold",
  },
};

export default AuthPanel;