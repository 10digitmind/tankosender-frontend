import React, { useEffect, useState } from "react";
import { FaEnvelope, FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from "react-icons/fa";
import "../styles/EmailStats.css";
import {  getSmtp } from "../redux/Asyncthunk";
import { useDispatch, useSelector } from "react-redux";

const EmailStats = () => {
const [activeSmtp, setActiveSmtp] = useState(null);
 const  {smtp} = useSelector((state) => state.user)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getSmtp());
  }, [dispatch]);

  
  useEffect(() => {
    if (smtp && smtp.length > 0) {
      setActiveSmtp(smtp[0]);
    } else {
      setActiveSmtp(null);
    }
  }
)
  return (
    <div className="email-stats-container">

      <div className="stat-card sent">
        <div className="stat-icon"><FaEnvelope /></div>
        <div className="stat-text">
          <h4>All time Total Sent</h4>
          <p>{activeSmtp?.Totalsent}</p>
        </div>
      </div>

      <div className="stat-card sent-today">
        <div className="stat-icon"><FaCheckCircle /></div>
        <div className="stat-text">
          <h4>Sent Today</h4>
          <p>{activeSmtp?.sentToday}</p>
        </div>
      </div>

      <div className="stat-card failed">
        <div className="stat-icon"><FaTimesCircle /></div>
        <div className="stat-text">
          <h4>All time Total Failed</h4>
          <p>{activeSmtp?.Totalfailed}</p>
        </div>
      </div>

      <div className="stat-card failed-today">
        <div className="stat-icon"><FaExclamationTriangle /></div>
        <div className="stat-text">
          <h4>Failed Today</h4>
          <p>{activeSmtp?.failedToday||0}</p>
        </div>
      </div>

    </div>
  );
};

export default EmailStats;
