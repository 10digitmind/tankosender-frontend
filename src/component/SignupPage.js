// ===== SIGN UP PAGE =====

import React, { useState } from "react";
import "../styles/Auth.css";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createUser } from "../redux/Asyncthunk";
// Simple icon placeholders
const EmailIcon = () => <span style={{ marginRight: "8px" }}>📧</span>;
const PasswordIcon = () => <span style={{ marginRight: "8px" }}>🔑</span>;
const LoginIcon = () => <span style={{ marginLeft: "8px" }}>➡️</span>;


const getPasswordStrength = (password) => {
  if (!password) return "";
  if (password.length < 6) return "Weak";
  if (password.length < 10) return "Medium";
  return "Strong";
};



export const SignUpPage = () => {

 const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsChecked, setTermsChecked] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

 const dispatch = useDispatch();
  const navigate = useNavigate()

 const handleSignUp = async (e) => {
    e.preventDefault();

  if (!navigator.onLine) {
  toast.error("No internet connection. Please check your network.");
  return;
}

  if (!email || !password) {
    toast.error("Please input email and password");
    return;
  }
  console.log(email,password)

  setLoading(true);
  setError(null);

  try {
    // Optional: handle network timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, 10000); // 10 seconds

    const resultAction = await dispatch(createUser({ email, password, signal: controller.signal })).unwrap();
console.log(resultAction)
    clearTimeout(timeout);

    if (resultAction?._id) {
    
      setTimeout(() => {
        navigate(`/verify-email/${email}`);
      }, 200);
    }
  } catch (err) {
    if (err.name === "AbortError") {
      toast.error("Network is slow. Please try again.");
    } else {
      toast.error(err?.message || "Sign-up failed. Please try again.");
    }
    setError(err);
  } finally {
    setLoading(false);
  }
};



 

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Create Account </h1>
        <p>Get started with batch email sending</p>

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

          <div className="terms">
            <input
              type="checkbox"
              checked={termsChecked}
              onChange={(e) => setTermsChecked(e.target.checked)}
              id="terms"
            />
            <label htmlFor="terms">
              I agree to the{" "}
              <span className="link" onClick={() => setShowTermsModal(true)}>
                Terms & Conditions
              </span>
            </label>
          </div>

          <button  type="button" // <-- THIS is crucial
  className="auth-btn"
  onClick={handleSignUp}
  disabled={!termsChecked}>
            Sign Up <LoginIcon />
          </button>
        </form>

        <p className="subtext">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>

      {showTermsModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Terms & Conditions</h2>
            <p>
              By using TankoSender, you agree to use the email sending service responsibly. We
              provide the platform for sending emails; we are not responsible for how it is used.
              
            </p>
            <button onClick={() => setShowTermsModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};
