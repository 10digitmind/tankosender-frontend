import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEnvelope, FaCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import { useDispatch } from "react-redux";
import { getCurrentUser } from "../redux/Asyncthunk";

const Api =process.env.REACT_APP_API_URL 

const VerifyLanding = () => {
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
const dispatch = useDispatch()
  // Helper to get token from URL
    const query = new URLSearchParams(useLocation().search);
  // Call verify-email API
  useEffect(() => {
    const verifyEmail = async () => {
  const token = query.get("token");

      if (!token) {
        setStatus("error");
        setMessage("Invalid verification link.");
        return;
      }
 
      try {
        const res = await axios.post(`${Api}/verify-email?token=${token}`);
        setStatus("success");
        setMessage(res.data.message);
        toast.success(res.data.message);
         await dispatch(getCurrentUser())

        // Store JWT for login
        if (res.data.token) localStorage.setItem("authToken", res.data.token);
        const now = Date.now()
 const expiresAt = now + 24 * 60 *60 * 1000; 
        localStorage.setItem("expiresAt", expiresAt);
        // Optional: redirect after 3 seconds
        setTimeout(() => navigate("/dashboard"), 3000);
      } catch (err) {
        const errMsg = err.response?.data?.message || "Verification failed.";
        setStatus("error");
        setMessage(errMsg);
        toast.error(errMsg);
      }
    };

    verifyEmail();
  }, [location.search, navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffffffff",
        fontFamily: "Arial, sans-serif",
        padding: "20px"
      }}
    >
      <div
        style={{
          maxWidth: "500px",
          width: "100%",
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          padding: "40px 30px",
          textAlign: "center"
        }}
      >
        <FaEnvelope size={50} color="#000" style={{ marginBottom: "20px" }} />

        <h2 style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "10px" }}>
          {status === "success" ? "Email Verified!" : "Verify Your Email"}
        </h2>

        <p style={{ color: "#666", marginBottom: "30px" }}>{message}</p>

        {status === "success" && (
          <>
            <FaCheckCircle size={40} color="#000" style={{ marginBottom: "20px" }} />
            <p style={{ marginTop: "20px", color: "#333" }}>Redirecting to your dashboard...</p>
          </>
        )}

        {status === "error" && (
          <p style={{ color: "red", fontWeight: "bold" }}>
            Unable to verify your email. Please check the link or contact support.
          </p>
        )}
      </div>
    </div>
  );
};

export default VerifyLanding;
