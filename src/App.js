import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./component/LoginPage";
import { SignUpPage } from "./component/SignupPage";
import { EmailVerificationPage } from "./component/EmailVerificationPage";
import Dashboard from "./component/Dashboard";
import Smtp from "./component/Smtp";
import EmailJobsPage from "./component/EmailjobPage";
import SendAndTrackPage from "./component/SendAndTrackPage";
import EmailStats from "./component/Emailstats";
import SubscriptionPage from "./component/SubscriptionPage";
import ProfilePage from "./component/ProfilePage";
import { ToastContainer } from "react-toastify";
import VerifyLanding from "./component/VerifyLanding";
import GuestRoute from "./component/GuestRoute";

function App() {
  return (
    <Router>
       <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
          <Route element={<GuestRoute/>}>
    
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
         <Route path="/verify-email/:email" element={<EmailVerificationPage />} />
          <Route path="/email-verification" element={<VerifyLanding />} />

      </Route>

         <Route path="/dashboard/*" element={<Dashboard />}>
          <Route path="smtp" element={<div><Smtp/></div>} />
          <Route path="emailjobs" element={<div><EmailJobsPage/></div>} />
  
          <Route path="send-track" element={<div><SendAndTrackPage/></div>} />
          <Route path="logs" element={<div><EmailStats/></div>} />
          <Route path="subscription" element={<div><SubscriptionPage/></div>} />
          <Route path="profile" element={<div><ProfilePage/></div>} />
          </Route>
         
        {/* You can add protected dashboard routes later */}
      </Routes>
    </Router>
  );
}

export default App;
