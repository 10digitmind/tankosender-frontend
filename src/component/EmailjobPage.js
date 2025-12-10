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
const [deletedAttachments, setDeletedAttachments] = useState([]);


  const [jobData, setJobData] = useState({
    recipients: "",
    from: "",
    subject: "",
    messageType: "text",
    messageContent: "",
    attachments: "",
    interval: "",
    qrLink:'',
    fromName:" "
  });
  
  useEffect(() => {
  if (!activeJob) return;
  setJobData({
    recipients: activeJob.recipients?.join(",") || "",
    from: activeJob?.from || "",
    fromName: activeJob?.fromName || "",
    subject: activeJob?.subject || "",
    messageType: activeJob?.messageType || "text",
    messageContent: activeJob?.messageContent || "",
    interval: activeJob?.interval || "",
    qrLink: activeJob?.qrLink || "",
    attachments: activeJob?.attachments || []
  });
  console.log( 'active',activeJob)
}, [activeJob]);
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


useEffect(() => {
   console.log(emailJob)
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
    recipients: activeJob.recipients?.join(",") || "",
    from: activeJob?.from || "",
    fromName: activeJob?.fromName || "",
    subject: activeJob?.subject || "",
    messageType: activeJob?.messageType || "text",
    messageContent: activeJob?.messageContent || "",
    interval: activeJob?.interval || "",
    qrLink: activeJob?.qrLink || "",
    attachments: activeJob?.attachments || []
  });
  };

  // Create new job
  const handleCreate = async () => {
  setLoading(true);
  try {
    const formData = new FormData();
    formData.append("recipients", jobData.recipients);
    formData.append("from", jobData.from);
    formData.append("subject", jobData.subject);
    formData.append("messageType", jobData.messageType);
    formData.append("messageContent", jobData.messageContent);
    formData.append("interval", jobData.interval);
     formData.append("qrLink", jobData.qrLink);
     formData.append("fromName", jobData.fromName);

    

    if (jobData.attachments && jobData.attachments.length > 0) {
      jobData.attachments.forEach(file => {
        formData.append("attachments", file);
      });
    }

    await dispatch(createEmailJob(formData)).unwrap();

    toast.success("Email job created successfully!");
    setShowForm(false);
    dispatch(getEmaailJob());
  } catch (err) {
    toast.error("Failed to create job");
  }
  setLoading(false);
};




// update job
const handleUpdate = async () => {
    setLoading(true);
    try {
      const formData = new FormData();

      // Only append fields if they are not empty (optional fields)
      if (jobData.recipients) formData.append("recipients", jobData.recipients);
      if (jobData.from) formData.append("from", jobData.from);
      if (jobData.subject) formData.append("subject", jobData.subject);
      if (jobData.messageType) formData.append("messageType", jobData.messageType);
      if (jobData.messageContent) formData.append("messageContent", jobData.messageContent);
      if (jobData.interval) formData.append("interval", jobData.interval);

      // Optional fields
      if (jobData.fromName) formData.append("fromName", jobData.fromName);
      if (jobData.qrLink) formData.append("qrLink", jobData.qrLink);
      
if (jobData.attachments && jobData.attachments.length > 0) {
  jobData.attachments.forEach(file => {
    // Only append new File objects (from input), not existing attachments
    if (file instanceof File) {
      formData.append("attachments", file);
    }
  });
}

if (deletedAttachments.length > 0) {
  deletedAttachments.forEach(filename => formData.append("deleteAttachments", filename));
}


      await dispatch(
        updateJob({ id: activeJob._id, data: formData })
      ).unwrap();

      toast.success("Job updated!");
      setShowForm(false);
      dispatch(getEmaailJob());
    } catch (err) {
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
const handleFileChange = (e) => {
  const files = Array.from(e.target.files);
  setJobData((prev) => ({ ...prev, attachments: files }));
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
            <input type="text" name="from" value={jobData?.from} onChange={handleChange} />
          </label>


              <label>
            From Name:
            <input type="text" name="fromName" value={jobData?.fromName} onChange={handleChange} />
          </label>

          <label>
            Subject:
            <input type="text" name="subject" value={jobData?.subject} onChange={handleChange} />
          </label>

          <label>
            Message Type:
            <select name="messageType" value={jobData?.messageType} onChange={handleChange}>
              <option value="text">Text</option>
              <option value="html">HTML</option>
            </select>
          </label>

           <label>
            qrLink(Optional):
            <input type="text" name="qrLink" value={jobData?.qrLink} onChange={handleChange} />
          </label>
          <label>
            Message Content:
            <textarea
              name="messageContent"
              value={jobData?.messageContent}
              onChange={handleChange}
              className="messageContent"
            />
          </label>
<label>
  Attachments:
  <input 
    type="file" 
    multiple 
    onChange={handleFileChange} 
    accept=".jpg,.jpeg,.png,.pdf,.docx,.eml,.html"
  />
</label>

{jobData?.attachments && jobData?.attachments.length > 0 && (
  <ul>
    {Array.from(jobData?.attachments).map((file, i) => (
      <li key={i} style={{color:'black'}}>
        {file.filename}
        {isEditing && (
          <button
            type="button"
            onClick={() => {
              setDeletedAttachments(prev => [...prev, file.filename]);
              setJobData(prev => ({
                ...prev,
                attachments: prev.attachments.filter(a => a.filename !== file.filename)
              }));
            }}
          >
            Remove
          </button>
        )}
      </li>
    ))}
  </ul>
)}

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
            <strong>From:</strong> {activeJob?.from}
          </p>

             <p>
            <strong>From name:</strong> {activeJob?.fromName}
          </p>

            <p>
            <strong>  qr  link:</strong> {activeJob?.qrLink}
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
{activeJob?.attachments && activeJob?.attachments.length > 0 && (
  <div>
    <strong>Attachments:</strong>
    <ul>
      {activeJob.attachments.map((a, i) => (
        <li key={i}>{a.filename}</li>
      ))}
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
