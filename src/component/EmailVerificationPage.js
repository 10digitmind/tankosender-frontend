import React, { useState } from "react";
import axios from "axios";
import "../styles/Auth.css";
import { useParams } from "react-router-dom";

export const EmailVerificationPage = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
const {email} =useParams()


  

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Email Verification</h1>
        <p>
          A verification email has been sent to <strong>{email}</strong>.
          Please check your inbox and click the verification link to continue.
        </p>


        {message && <p style={{ marginTop: "10px", color: "#333" }}>{message}</p>}

        <p className="subtext">
          Didn't receive the email? Make sure to check your spam folder.
        </p>
      </div>
    </div>
  );
};
