import React, { useState, useEffect } from "react";
import "../styles/emailJobs.css";
import { useSelector, useDispatch } from "react-redux";
import { createEmailJob, deleteJob, getEmaailJob, updateJob } from "../redux/Asyncthunk";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import 'react-confirm-alert/src/react-confirm-alert.css';

const EmailJobsPage = () => {
  const dispatch = useDispatch();
  const { emailJob } = useSelector(state => state.user);

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeJob, setActiveJob] = useState(null);
  const [deletedAttachments, setDeletedAttachments] = useState([]);
  const [removeHtmlAttachment, setRemoveHtmlAttachment] = useState(true)
  const [inline,setInline] = useState(true)

  const [jobData, setJobData] = useState({
    recipients: "",
    from: "",
    fromName: "",
    subject: "",
    messageType: "text",
    messageContent: "",
    messageBody: "",
    htmlAttachment: "",
    sendAs: "inline",
    attachments: [],
    interval: "",
    qrLink: ""
  });

  // -------------------------
  // Load active job into form
  // -------------------------
  useEffect(() => {
    if (!activeJob) return;
    setJobData({
      recipients: activeJob.recipients?.join(",") || "",
      from: activeJob.from || "",
      fromName: activeJob.fromName || "",
      subject: activeJob.subject || "",
      messageType: activeJob.messageType || "text",
      messageContent: activeJob.messageContent || "",
      messageBody: activeJob.messageBody || "",
      htmlAttachment: activeJob.htmlAttachment || "",
      sendAs: activeJob.sendAs || "inline",
      attachments: activeJob.attachments || [],
      interval: activeJob.interval || "",
      qrLink: activeJob.qrLink || ""
    });
  }, [activeJob]);

  // -------------------------
  // Fetch jobs on mount
  // -------------------------
  useEffect(() => {
    dispatch(getEmaailJob());
  }, [dispatch]);

  // -------------------------
  // Set first active job
  // -------------------------
  useEffect(() => {
    if (emailJob && emailJob.length > 0) setActiveJob(emailJob[0]);
    else setActiveJob(null);
  }, [emailJob]);

  // -------------------------
  // Handle input change
  // -------------------------
const handleChange = (e) => {
  const { name, value } = e.target;

  setJobData(prev => ({ ...prev, [name]: value }));

  if (name === "messageType") {
    // Hide HTML attachment when messageType is "html"
    setRemoveHtmlAttachment(value !== "html");
  }


  if (name === "messageType") {
    // Hide HTML attachment when messageType is "html"
    setInline(value !== "text");
  }
};


  // -------------------------
  // Reset form
  // -------------------------
  const resetForm = () => {
    setJobData({
      recipients: "",
      from: "",
      fromName: "",
      subject: "",
      messageType: "text",
      messageContent: "",
      messageBody: "",
      htmlAttachment: "",
      sendAs: "inline",
      attachments: [],
      interval: "",
      qrLink: ""
    });
    setDeletedAttachments([]);
  };

  // -------------------------
  // Open forms
  // -------------------------
  const openCreateForm = () => { resetForm(); setIsEditing(false); setShowForm(true); };
  const openEditForm = () => {
    if (!activeJob) return;
    setIsEditing(true);
    setShowForm(true);
  };

  // -------------------------
  // File input change
  // -------------------------
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setJobData(prev => ({ ...prev, attachments: [...prev.attachments, ...files] }));
  };

  // -------------------------
  // Create job
  // -------------------------
  const handleCreate = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(jobData).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      // Append new attachments
      jobData.attachments.forEach(file => {
        if (file instanceof File) formData.append("attachments", file);
      });

      await dispatch(createEmailJob(formData)).unwrap();
      toast.success("Email job created successfully!");
      setShowForm(false);
      dispatch(getEmaailJob());
    } catch (err) {
      toast.error("Failed to create job");
    }
    setLoading(false);
  };

  // -------------------------
  // Update job
  // -------------------------
  const handleUpdate = async () => {
    setLoading(true);
    try {
      const formData = new FormData();

      // Append all updated fields
      Object.entries(jobData).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      // New files only
      jobData.attachments.forEach(file => {
        if (file instanceof File) formData.append("attachments", file);
      });

      // Deleted files
      deletedAttachments.forEach(filename => formData.append("deleteAttachments", filename));

      await dispatch(updateJob({ id: activeJob._id, data: formData })).unwrap();
      toast.success("Job updated successfully!");
      setShowForm(false);
      setDeletedAttachments([]);
      dispatch(getEmaailJob());
    } catch (err) {
      toast.error("Failed to update job");
    }
    setLoading(false);
  };

  // -------------------------
  // Delete job
  // -------------------------
  const handleDeleteJob = () => {
    if (!activeJob?._id) return;

    confirmAlert({
      title: "Confirm Delete",
      message: "Are you sure you want to delete this job? This action cannot be undone.",
      buttons: [
        {
          label: "Yes, Delete",
          onClick: () => {
            dispatch(deleteJob(activeJob._id))
              .unwrap()
              .then(() => { toast.success("Job deleted"); setActiveJob(null); })
              .catch(() => toast.error("Failed to delete job"));
          }
        },
        { label: "Cancel", onClick: () => {} }
      ]
    });
  };

  // -------------------------
  // JSX
  // -------------------------
  return (
    <div className="email-jobs-page">
      <h2>Email Jobs</h2>
      <p>Manage your automated email sending jobs — free 200 per day.</p>

      {!showForm && !activeJob && (
        <button onClick={openCreateForm}>Create Email Job</button>
      )}

      {showForm && (
        <div className="job-form">
          <label>Recipients:
            <textarea style={{resize:'none', height:'200px'}}  name="recipients" value={jobData.recipients} onChange={handleChange} placeholder="Comma separated emails" />
          </label>
 
          <label>From:
            <input type="text" name="from" value={jobData.from} onChange={handleChange} />
          </label>

          <label>From Name:
            <input type="text" name="fromName" value={jobData.fromName} onChange={handleChange} />
          </label>

          <label>Subject:
            <input type="text" name="subject" value={jobData.subject} onChange={handleChange} />
          </label>

          <label>Message Type:
            <select name="messageType" value={jobData.messageType} onChange={handleChange}>
              <option value="text">Text</option>
              <option value="html">HTML</option>
            </select>
          </label>

          <label>QR Link (optional):
            <input type="text" name="qrLink" value={jobData.qrLink} onChange={handleChange} />
          </label>

          <label>Message Body (text) (optional):
            <textarea style={{resize:'none', height:'400px'}} name="messageBody" value={jobData.messageBody} onChange={handleChange} placeholder="This will be sent as the email body" />
          </label>

{removeHtmlAttachment && (
  <label>
    HTML / Attachment:
    <textarea
      style={{resize:'none', height:'400px'}}
      name="htmlAttachment"
      value={jobData.htmlAttachment}
      onChange={handleChange}
      placeholder="Paste HTML or leave empty"
    />
  </label>
)}


          <label>Send HTML As:
            <select name="sendAs" value={jobData.sendAs} onChange={handleChange}>
             {inline? <option value="inline">Inline in email</option>:'' }
              {removeHtmlAttachment?<option value="pdf">PDF attachment</option>:''}
             {removeHtmlAttachment? <option value="eml">EML attachment</option>:''}
               {removeHtmlAttachment?<option value="htmlFile">HTML file attachment</option>:''}
            </select>
          </label>

          <label>Attachments:
            <input type="file" multiple onChange={handleFileChange} accept=".jpg,.jpeg,.png,.pdf,.docx,.eml,.html" />
          </label>

          {jobData.attachments.length > 0 && (
            <ul>
              {jobData.attachments.map((file, i) => (
                <li key={i}>
                  {file.filename || file.name}
                  {isEditing && (
                    <button type="button" onClick={() => {
                      setDeletedAttachments(prev => [...prev, file.filename || file.name]);
                      setJobData(prev => ({
                        ...prev,
                        attachments: prev.attachments.filter(a => (a.filename || a.name) !== (file.filename || file.name))
                      }));
                    }}>Remove</button>
                  )}
                </li>
              ))}
            </ul>
          )}

          <label>Interval (seconds):
            <input type="number" name="interval" value={jobData.interval} onChange={handleChange} />
          </label>

          <div className="form-buttons">
            <button onClick={() => setShowForm(false)}>Cancel</button>
            {isEditing ? (
              <button onClick={handleUpdate} disabled={loading}>{loading ? "Updating..." : "Update Job"}</button>
            ) : (
              <button onClick={handleCreate} disabled={loading}>{loading ? "Creating..." : "Create Job"}</button>
            )}
          </div>
        </div>
      )}

      {/* Show Active Job */}
      {activeJob && !showForm && (
        <div className="active-job">
          <h3>Active Email Job</h3>
          <p><strong>Recipients:</strong> {activeJob.recipients.join(", ")}</p>
          <p><strong>From:</strong> {activeJob.from}</p>
          <p><strong>From Name:</strong> {activeJob.fromName}</p>
          <p><strong>QR Link:</strong> {activeJob.qrLink}</p>
          <p><strong>Subject:</strong> {activeJob.subject}</p>
          <p><strong>Type:</strong> {activeJob.messageType}</p>
          <p><strong>Interval:</strong> {activeJob.interval} seconds</p>
          <p><strong>Message Body:</strong> {activeJob.messageBody}</p>
          <p><strong>HTML Attachment:</strong> {activeJob?.htmlAttachment}</p>

          {activeJob.attachments.length > 0 && (
            <div>
              <strong>Attachments:</strong>
              <ul>
                {activeJob.attachments.map((a, i) => <li key={i}>{a.filename}</li>)}
              </ul>
            </div>
          )}

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
