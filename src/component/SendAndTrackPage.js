import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { FaPlay, FaCheckCircle, FaTimesCircle, FaEnvelope } from "react-icons/fa";
import { StartJob, getEmaailJob } from "../redux/Asyncthunk";
import "../styles/sendAndTrack.css";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
const Api =process.env.REACT_APP_API_URL 

const SendAndTrackPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const { emailJob } = useSelector((state) => state.user);

  const [activeJob, setActiveJob] = useState(null);
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState({ total: 0, sent: 0, failed: 0 });
  const [emailList, setEmailList] = useState([]);
  const [errorBoxVisible, setErrorBoxVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Load active job
  useEffect(() => {
    dispatch(getEmaailJob());
  }, [dispatch]);

  useEffect(() => {
    if (emailJob && emailJob.length > 0) {
      setActiveJob(emailJob[0]);

      // Initialize recipients list
      const list = emailJob[0].recipients.map((email) => ({
        email,
        status: "pending",
      }));

      setEmailList(list);

      setProgress({
        total: emailJob[0].recipients.length,
        sent: 0,
        failed: 0,
      });
    } else {
      setActiveJob(null);
      setEmailList([]);
      setProgress({ total: 0, sent: 0, failed: 0 });
    }
  }, [emailJob]);

  // Start sending
 const handleStartJob = async () => {
  if (!activeJob) return;

  setSending(true);
  toast.success("Sending started!");

  try {
    await dispatch(StartJob({ JobId: activeJob._id })).unwrap();
  } catch (err) {
    setSending(false);

    if (err === "Daily limit reached subscribe for unlimted") {
      setErrorMessage(
        <span>
          Daily limit reached — subscribe to continue sending without limits.{" "}
          <button
            onClick={() => navigate("/dashboard/subscription")}
            style={{
              textDecoration: "none",
              color: "white",
              cursor: "pointer",
              height: "30px",
              backgroundColor: "green",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Go to subscription
          </button>
        </span>
      );
    } else if (err === "Please add/connect SMTP first") {
      setErrorMessage(
        <span>
          Please add/connect SMTP before you can send.{" "}
          <button
            onClick={() => navigate("/dashboard/smtp")}
            style={{
              textDecoration: "none",
              color: "white",
              cursor: "pointer",
              height: "30px",
              backgroundColor: "green",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Go to SMTP
          </button>
        </span>
      );
    } else {
      toast.error("Failed to start job");
      setErrorMessage(err.toString());
    }

    setErrorBoxVisible(true);
  }
};


  // Poll job status
  useEffect(() => {
    if (!sending || !activeJob) return;

    const intervalId = setInterval(async () => {
      try {
        const token = localStorage.getItem("authToken");

        const res = await axios.get(`${Api}/get-status/${activeJob._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

   const { sent, failed, pending, sentEmails, failedEmails, status, firstFailReason } = res.data;

setEmailList(prevList => 
  prevList.map(item => ({
    ...item,
    status: sentEmails.includes(item.email)
      ? "sent"
      : failedEmails.includes(item.email)
      ? "failed"
      : "pending"
  }))
);


        setProgress({
          total: sent + failed + pending,
          sent,
          failed,
        });

        if (status === "completed") {
          clearInterval(intervalId);
          setSending(false);
          toast.success("All emails sent successfully!");
        setErrorMessage(
    <span>
      All emails have been sent. Update your email job with a new recipient list to send again.{" "}
      <button
        onClick={() => navigate("/dashboard/emailjobs")}
        style={{ textDecoration: "none", color: "white", cursor: "pointer",  height:'30px', backgroundColor:'green',border:'none',borderRadius:"5px"}}
      >
        Go to Email Jobs
      </button>
    </span>
  );

  setErrorBoxVisible(true);
}

        if (status === "error") {
          clearInterval(intervalId);
          setSending(false);

          setErrorMessage(
            firstFailReason ||
              "An error occurred during sending. Check your SMTP configuration."
          );

          setErrorBoxVisible(true);

          toast.error(
            firstFailReason
              ? `Sending stopped: ${firstFailReason}. Update your FROM email in your job.`
              : "Job stopped due to an error"
          );
        }
      } catch (err) {
        clearInterval(intervalId);
        setSending(false);
        toast.error("Polling stopped due to server error");
      }
    }, (activeJob?.interval || 5) * 1000);

    return () => clearInterval(intervalId);
  }, [sending, activeJob]);

  return (
    <div className="send-track-page">
      <h2>Sending Control</h2>
      <p>Configure and manage email sending</p>

      {/* Sending Configuration */}
      <div className="sending-config">
        <label>
          Interval (seconds between each email):
          <input type="number" value={activeJob?.interval || 0} disabled />
        </label>

        <label>
          Batch (maximum emails per batch):
          <input type="number" value={activeJob?.batchSize || 50} disabled />
        </label>

        <button
          className="start-btn"
          onClick={handleStartJob}
          disabled={sending || !activeJob}
        >
          <FaPlay style={{ marginRight: "5px" }} />
          Start Sending
        </button>
      </div>


<QRCodeSVG value="https://yourlink.com" size={200} />;

      {/* Progress Bar */}
      <div className="progress-bar-container">
        <div className="progress-bar-wrapper">
          <div
            className="progress-bar-sent"
            style={{
              width: `${(progress.sent / progress.total) * 100 || 0}%`,
            }}
          ></div>
          <div
            className="progress-bar-failed"
            style={{
              width: `${(progress.failed / progress.total) * 100 || 0}%`,
            }}
          ></div>
        </div>

        <div className="progress-info">
          <span>
            <FaCheckCircle style={{ marginRight: "5px", color: "green" }} />
            Sent: {progress.sent}
          </span>
          <span>
            <FaTimesCircle style={{ marginRight: "5px", color: "red" }} />
            Failed: {progress.failed}
          </span>
          <span>
            <FaEnvelope style={{ marginRight: "5px" }} />
            Total: {progress.total}
          </span>
        </div>
      </div>

      {/* Error Modal */}
      {errorBoxVisible && (
        <div className="error-box">
          <strong>Info:</strong> {errorMessage}
          <button style={{marginLeft:'10px',backgroundColor:'black',height:"30px",color:"white",border:'none',borderRadius:'5px'}} onClick={() => setErrorBoxVisible(false)}>Close</button>
        </div>
      )}

      {/* Email Tracking List */}
      <div className="email-tracking-list">
        <h3>Email Tracking List</h3>

        {emailList.map((item, index) => (
          <div
            key={index}
            className={`email-item ${
              item.status === "sent"
                ? "sent"
                : item.status === "failed"
                ? "failed"
                : "pending"
            }`}
          >
            {item.email} - {item.status.toUpperCase()}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SendAndTrackPage;
