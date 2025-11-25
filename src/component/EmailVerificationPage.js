import React, { useState } from "react";
import axios from "axios";
import "../styles/Auth.css";
import { useParams } from "react-router-dom";

export const EmailVerificationPage = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
const {email} =useParams()

const API_URL =process.env.REACT_APP_API_URL 

  const resendEmail = async () => {
    try {
      setLoading(true);
      setMessage("");
      // Call backend API to resend verification email
      const res = await axios.post("/api/resendVerification", { email });
      setMessage(res.data.message || "Verification email sent!");
    } catch (error) {
      console.error(error);
      setMessage("Failed to resend verification email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Email Verification</h1>
        <p>
          A verification email has been sent to <strong>{email}</strong>.
          Please check your inbox and click the verification link to continue.
        </p>

        <button className="auth-btn" onClick={resendEmail} disabled={loading}>
          {loading ? "Sending..." : "Resend Verification Email"}
        </button>

        {message && <p style={{ marginTop: "10px", color: "#333" }}>{message}</p>}

        <p className="subtext">
          Didn't receive the email? Make sure to check your spam folder.
        </p>
      </div>
    </div>
  );
};
