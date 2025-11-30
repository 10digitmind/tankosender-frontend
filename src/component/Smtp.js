// SMTPAccountPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/smtp.css';
import { useDispatch, useSelector } from 'react-redux';
import { getSmtp,createSmtp,connectSmtp,testSmtp,deleteSmtp } from "../redux/Asyncthunk";
import { toast } from 'react-toastify';
import { confirmAlert } from "react-confirm-alert";
import 'react-confirm-alert/src/react-confirm-alert.css';



const Smtp = () => {
const [showForm, setShowForm] = useState(false);

const [status, setStatus] = useState('idle'); // idle | success | error
const [activeSmtp, setActiveSmtp] = useState(null);
const [errorMessage, setErrorMessage] = useState('');
const [showTestForm, setShowTestForm] = useState(false);
const [testEmail, setTestEmail] = useState("");

const [loading, setLoading] = useState(false);

 const  {smtp} = useSelector((state) => state.user)
  const dispatch = useDispatch()
// Fetch existing SMTP account on mount
useEffect(() => {
  dispatch(getSmtp());
}, [dispatch]);

useEffect(() => {
  if (smtp && smtp.length > 0) {
    setActiveSmtp(smtp[0]);
  } else {
    setActiveSmtp(null);
  }

}, [smtp]);

const handleChange = (e) => {
const { name, value, type, checked } = e.target;
setActiveSmtp(prev => ({
...prev,
[name]: type === 'checkbox' ? checked : value,
}));
};




const createSmtpHandler = () => {

 if (
    !activeSmtp?.label ||
    !activeSmtp?.host ||
    !activeSmtp?.port ||
    !activeSmtp?.username ||
    !activeSmtp?.password 
    
  ) {
    toast.error('All feild is required')
    return
  }

  dispatch(
    createSmtp({
      label: activeSmtp.label,
      host: activeSmtp.host,
      port: activeSmtp.port,
      username: activeSmtp.username,
      password: activeSmtp.password,
      secure: activeSmtp.secure,
    })
  )
    .unwrap()
    .then((data) => {
      // success
      setActiveSmtp(data);
      setShowForm(false);
      setStatus("success");
    })
    .catch((err) => {
      // error
      setStatus("error");
      console.log("SMTP create error:", err);
    });
};

const handleConnect = async () => {
  if (!activeSmtp._id) return; // make sure it exists

setLoading(true);

  setStatus("loading");

  try {
    const updatedSmtp = await dispatch(connectSmtp({ smtpId: activeSmtp._id })).unwrap();

    // Update local state immediately
    setActiveSmtp(updatedSmtp);

    // Optional: Update Redux store if you store SMTP list globally
   

    setStatus("success");
    toast.success("SMTP connected successfully!");
  } catch (err) {
    setStatus("error");
    toast.error(err || "Failed to connect SMTP");
  }finally {
    setLoading(false); // re-enable button
  }
};




const handleTestSmtp = async () => {
  if (!activeSmtp?._id || !testEmail) {
    toast.error("Please select SMTP and enter a recipient email");
    return;
  }

  setStatus("loading");

  try {
    const updatedSmtp = await dispatch(
      testSmtp({ smtpId: activeSmtp._id, to: testEmail })
    ).unwrap();

    // Update active SMTP immediately
    setActiveSmtp(prev => ({ ...prev, connected: updatedSmtp.connected }));

    setStatus("success");
    toast.success(`Test email ${updatedSmtp.connected ? "test email sent successfully" : "failed"}`);
    setTestEmail('')
  } catch (err) {
    setStatus("error");
    toast.error(err || "SMTP test failed");
  }
};


const handleDeleteSMTP = () => {
  if (!activeSmtp?._id) return;

  confirmAlert({
    title: "Confirm Delete",
    message: "Are you sure you want to delete this SMTP account? This action cannot be undone.",
    buttons: [
      {
        label: "Yes, Delete",
        onClick: () => {
          dispatch(deleteSmtp(activeSmtp._id))
            .unwrap()
            .then(() => {
              toast.success("SMTP deleted successfully!");
              setActiveSmtp(null);
              setShowForm(true); // allow adding new
            })
            .catch(() => toast.error("Failed to delete SMTP"));
        },
      },
      {
        label: "Cancel",
        onClick: () => {} // do nothing
      },
    ],
  });
};





return (
  <div className="smtp-page">
    <h2>SMTP Accounts</h2>
    <p>Manage your email sending accounts</p>

  
  

    {/* ==== SHOW FORM WHEN ADDING OR EDITING ==== */}
    {(showForm || smtp.length === 0) && (
      <div
        className={`smtp-form ${
          status === "success" ? "success" : status === "error" ? "error" : ""
        }`}
      >
        <label>
          SMTP Name:
          <input
            type="text"
            name="label"
            value={activeSmtp?.label || ""}
            onChange={handleChange}
            placeholder="The name you want to call it"
          />
        </label>

        <label>
          Host:
          <input
            type="text"
            name="host"
            value={activeSmtp?.host || ""}
            onChange={handleChange}
          />
        </label>

        <label>
          Port:
          <select name="port" value={activeSmtp?.port || ""} onChange={handleChange}>
            <option value="">Select Port</option>
            <option value="587">587 (TLS/STARTTLS)</option>
            <option value="465">465 (SSL)</option>
            <option value="25">25 (Unencrypted)</option>
          </select>
        </label>

        <label>
          Username:
          <input
            type="text"
            name="username"
            value={activeSmtp?.username || ""}
            onChange={handleChange}
          />
        </label>

        <label>
          Password:
          <input
            type="password"
            name="password"
            value={activeSmtp?.password || ""}
            onChange={handleChange}
          />
        </label>

        <label>
          Secure (SSL/TLS):
          <select
            name="secure"
            value={activeSmtp?.secure ? "true" : "false"}
            onChange={(e) =>
              handleChange({
                target: { name: "secure", value: e.target.value === "true" },
              })
            }
          >
            <option value="false">False (TLS or None)</option>
            <option value="true">True (SSL)</option>
          </select>
        </label>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <div className="form-buttons">
          {smtp.length > 0 && <button onClick={() => setShowForm(false)}>Cancel</button>}
          <button onClick={createSmtpHandler}>
            {smtp.length === 0 ? "Add SMTP" : "Save Changes"}
          </button>
        </div>
      </div>
    )}

    {/* ==== CASE 2: SHOW ACTIVE SMTP (IF EXISTS & NOT EDITING) ==== */}
    {smtp.length > 0 && !showForm && activeSmtp && (
<div
  style={{
    border: `2px solid ${activeSmtp.connected ? "green" : "red"}`
  }}
  className="active-smtp"
>
        <h3>Active SMTP Account</h3>

        <p><strong>Name:</strong> {activeSmtp.label}</p>
        <p><strong>Host:</strong> {activeSmtp.host}</p>
        <p><strong>Username:</strong> {activeSmtp.username}</p>
<p>
  <strong>Subscription:</strong>{" "}
  <span style={{ color: activeSmtp.isSubscribed ? "green" : "red" }}>
    {activeSmtp.isSubscribed
      ? "Active - send unlimited emails"
      : "No subscription - send 200 per day"}
  </span>
</p>
        <p>
          <strong>Status:</strong> {activeSmtp.connected ? "Connected" : "Not Connected"}
        </p>

        <div className="active-buttons">
         
          <button onClick={handleDeleteSMTP}>Delete</button>

          {activeSmtp.connected?<button onClick={() => setShowTestForm(!showTestForm)}>Test SMTP</button>:<button onClick={handleConnect} disabled={loading}>
  {loading ? "Connecting..." : "Connect SMTP"}
</button>}
        </div>

        {showTestForm && (
          <div className="test-smtp-box">
            <label>
              Send Test Email To:
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="your@email.com"
              />
            </label>
            <button className="send-test-btn" onClick={handleTestSmtp}>Send Test</button>
          </div>
        )}
      </div>
    )}
  </div>
);


}

export default Smtp
