import React, { useState, useEffect } from "react";
import "../styles/emailJobs.css";
import { useSelector, useDispatch } from "react-redux";
import { createEmailJob, deleteJob, getEmaailJob, updateJob } from "../redux/Asyncthunk";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import 'react-confirm-alert/src/react-confirm-alert.css';

const EmailJobsPage = () => {
  const dispatch = useDispatch();
  const { emailJob,smtp } = useSelector((state) => state.user);

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeJob, setActiveJob] = useState(null);

  const [jobData, setJobData] = useState({
    recipients: "",
    from: "",
    subject: "",
    messageType: "text",
    messageContent: "",
    attachments: "",
    interval: "",
  });

  // Fetch jobs on mount
  useEffect(() => {
    dispatch(getEmaailJob());
  }, [dispatch]);

  // Set active job when job list changes
  useEffect(() => {
    if (emailJob && emailJob.length > 0) {
      setActiveJob(emailJob[0]);
    } else {
      setActiveJob(null);
    }
  }, [emailJob]);

  // Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData((prev) => ({ ...prev, [name]: value }));
  };

  // Reset form
  const resetForm = () => {
    setJobData({
      recipients: "",
      from: "",
      subject: "",
      messageType: "text",
      messageContent: "",
      attachments: "",
      interval: "",
    });
  };

  // Open Create Form
  const openCreateForm = () => {
    resetForm();
    setIsEditing(false);
    setShowForm(true);
  };

  // Open Edit Form
  const openEditForm = () => {
    if (!activeJob) return;
    setIsEditing(true);
    setShowForm(true);

    setJobData({
      recipients: activeJob.recipients.join(", "),
      from: activeJob.from,
      subject: activeJob.subject,
      messageType: activeJob.messageType,
      messageContent: activeJob.messageContent,
      attachments: activeJob.attachments || "",
      interval: activeJob.interval,
    });
  };

  // Create new job
  const handleCreate = async () => {
    setLoading(true);
    try {
      await dispatch(createEmailJob(jobData)).unwrap();
      toast.success("Email job created successfully!");
      setShowForm(false);
      dispatch(getEmaailJob());
    } catch {
      toast.error("Failed to create job");
    }
    setLoading(false);
  };

// update job
  const handleUpdate = async () => {
    setLoading(true);
    try {
     await dispatch(updateJob({
  id: activeJob._id,
  data: jobData
})).unwrap();
      toast.success("Job updated!");
      setShowForm(false);
      setIsEditing(false);
      dispatch(getEmaailJob());
    } catch {
      toast.error("Failed to update job");
    }
    setLoading(false);
  };


const handleDeleteJob = () => {
  if (!activeJob?._id) return;

  confirmAlert({
    title: "Confirm Delete",
    message: "Are you sure you want to delete this SMTP account? This action cannot be undone.",
    buttons: [
      {
        label: "Yes, Delete",
        onClick: () => {
          dispatch(deleteJob(activeJob._id))
            .unwrap()
            .then(() => {
              toast.success("SMTP deleted successfully!");
              setActiveJob(null);
             
            })
            .catch(() => toast.error("Failed to delete job"));
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
    <div className="email-jobs-page">
      <h2>Email Jobs</h2>
      <p>Manage your automated email sending jobs — free 200 per day.</p>

      {/* When no job exists */}
      {!showForm && !activeJob && (
        <button className="add-job-btn" onClick={openCreateForm}>
          Create Email Job
        </button>
      )}

      {/* Form */}
      {showForm && (
        <div className="job-form">
          <label>
            Recipients:
            <textarea
              name="recipients"
              value={jobData.recipients}
              onChange={handleChange}
              placeholder="Comma separated emails"
              className="emailContent"
            />
          </label>

          <label>
            From:
            <input type="text" name="from" value={jobData.from} onChange={handleChange} />
          </label>

          <label>
            Subject:
            <input type="text" name="subject" value={jobData.subject} onChange={handleChange} />
          </label>

          <label>
            Message Type:
            <select name="messageType" value={jobData.messageType} onChange={handleChange}>
              <option value="text">Text</option>
              <option value="html">HTML</option>
            </select>
          </label>

          <label>
            Message Content:
            <textarea
              name="messageContent"
              value={jobData.messageContent}
              onChange={handleChange}
              className="messageContent"
            />
          </label>

          <label>
            Interval (seconds):
            <input type="number" name="interval" value={jobData.interval} onChange={handleChange} />
          </label>

          <div className="form-buttons">
            <button onClick={() => setShowForm(false)}>Cancel</button>

            {isEditing ? (
              <button onClick={handleUpdate} disabled={loading}>
                {loading ? "Updating..." : "Update Job"}
                
              </button>
            ) : (
              <button onClick={handleCreate} disabled={loading}>
                {loading ? "Creating..." : "Create Job"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Show Active Job */}
      {activeJob && !showForm && (
        <div className="active-job">
          <h3>Active Email Job</h3>

          <p>
            <strong>Recipients:</strong> {activeJob.recipients.join(", ")}
          </p>
          <p>
            <strong>From:</strong> {activeJob.from}
          </p>
          <p>
            <strong>Subject:</strong> {activeJob.subject}
          </p>
          <p>
            <strong>Type:</strong> {activeJob.messageType}
          </p>
          <p>
            <strong>Interval:</strong> {activeJob.interval} seconds
          </p>
          <p>
            <strong>Message:</strong> {activeJob.messageContent}
          </p>

          <div className="active-buttons">
            <button onClick={openEditForm}>Edit</button>
            <button onClick={handleDeleteJob}>Delete</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailJobsPage;
