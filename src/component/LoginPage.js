import React, { useState } from "react";
import "../styles/Auth.css";
import axios from "axios";
import { useDispatch} from "react-redux";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import { loginUser } from "../redux/Asyncthunk";
// Simple icon placeholders
const EmailIcon = () => <span style={{ marginRight: "8px" }}>📧</span>;
const PasswordIcon = () => <span style={{ marginRight: "8px" }}>🔑</span>;
const LoginIcon = () => <span style={{ marginLeft: "8px" }}>➡️</span>;
const API_URL =process.env.REACT_APP_API_URL 
// Password strength indicator
const getPasswordStrength = (password) => {
  if (!password) return "";
  if (password.length < 6) return "Weak";
  if (password.length < 10) return "Medium";
  return "Strong";
};

// ===== LOGIN PAGE =====
export const LoginPage = () => {
const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotModal, setForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
    const [loading, setLoading]= useState(false)
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

const handleLogin = async () => {

  if (!navigator.onLine) {
  toast.error("No internet connection. Please check your network.");
  return;
}
  if (!email || !password) {
    return toast.error("Please input your email and password");
  }

  setLoading(true);
  setError(null);





  try {
    // Optional: set a timeout for slow networks
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, 10000); // 10 seconds timeout

    const result = await dispatch(
      loginUser({ email, password, signal: controller.signal })
    ).unwrap();

    clearTimeout(timeout);

    if (result?.token) {
      localStorage.setItem("authToken", result.token);
        const now = Date.now();
      const expiresAt = now + 24 * 60 *60 * 1000; 
        localStorage.setItem("expiresAt", expiresAt);
      toast.success("Login successful!");
      navigate("/dashboard/smtp");
    }
} catch (error) {
  if (error?.name === "AbortError") {
    toast.error("Network is slow. Please try again.");
  } else if (error === "Email not verified" || error?.message === "Email not verified") {
    toast.error("Please verify your email before logging in.");
    navigate(`//verify-email/${email}`);
  } else {
    toast.error(
      typeof error === "string" ? error : error?.message || "Login failed. Please try again."
    );
  }
  setError(error);
} finally {
    setLoading(false);
  }
};

  

  const handleForgotPassword = async () => {
    try {
      setResetLoading(true);
      setResetMessage("");
      const res = await axios.post(`${API_URL}/forgotPassword`, { email: resetEmail });
      setResetMessage(res.data.message || "Password reset email sent!");
    } catch (error) {
      console.error(error);
      setResetMessage("Failed to send reset email.");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Welcome Back</h1>
        <p>Login to start batch email sending</p>

        <form className="auth-form">
          <label>Email</label>
          <div className="input-group">
            <EmailIcon />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <label>Password</label>
          <div className="input-group">
            <PasswordIcon />
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="toggle-pass"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? "🙈" : "👁️"}
            </button>
          </div>

          {password && (
            <p className={`strength ${getPasswordStrength(password).toLowerCase()}`}>
              {getPasswordStrength(password)}
            </p>
          )}

          <button onClick={handleLogin} type="button" className="auth-btn">
            Login <LoginIcon />
          </button>
        </form>

        <p className="subtext">
          <span
            style={{ cursor: "pointer", textDecoration: "underline" }}
            onClick={() => setForgotModal(true)}
          >
            Forgot Password?
          </span>
        </p>

        <p className="subtext">
          Don't have an account? <a href="/signup">Create Account</a>
        </p>
      </div>

      {/* Forgot Password Modal */}
      {forgotModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Reset Password</h2>
            <p>Enter your email to receive a password reset link.</p>
            <input
              type="email"
              placeholder="Email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            />
            <button
              className="auth-btn"
              onClick={handleForgotPassword}
              disabled={resetLoading}
            >
              {resetLoading ? "Sending..." : "Send Reset Email"}
            </button>
            {resetMessage && <p style={{ marginTop: "10px" }}>{resetMessage}</p>}
            <button
              style={{
                marginTop: "15px",
                padding: "8px 16px",
                background: "#ff0000ff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
              }}
              onClick={() => setForgotModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
