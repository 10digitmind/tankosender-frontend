import React, { useEffect, useState } from 'react';
import { FaCreditCard, FaCalendarAlt, FaExclamationCircle, FaArrowUp } from 'react-icons/fa';
import '../styles/SubscriptionPage.css';
import { confirmAlert } from "react-confirm-alert";
import 'react-confirm-alert/src/react-confirm-alert.css';
import axios from "axios";
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

import { getSub } from "../redux/Asyncthunk";
 const token = localStorage.getItem("authToken");

const Api =process.env.REACT_APP_API_URL 



const SubscriptionPage = () => {
  const dispatch = useDispatch();
  const { subscription } = useSelector((state) => state.user);

  const [showSubscribeForm, setShowSubscribeForm] = useState(false);
  const [paymentData, setPaymentData] = useState({ wallet: "" });
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch subscription
  useEffect(() => {
    dispatch(getSub());
  }, [dispatch]);



  const activeSub = subscription;
  const hasActive = activeSub?.status === "active";
  const subRequested = activeSub?.subRequested;

  // Show pending modal automatically if subscription request is pending
  useEffect(() => {
    if (subRequested && !hasActive) {
      setShowPendingModal(true);
    }
  }, [subRequested, hasActive]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle payment confirmation
  const handlePaymentSubmit = () => {
    if (!paymentData.wallet.trim()) {
      return toast.error("Enter your wallet address.");
    }

    confirmAlert({
      title: "Confirm Payment",
      message: `Are you sure you have sent the $100 USDC (TRC20) payment from wallet:

${paymentData.wallet}

to:

TFDnv4vbwJ6HQLSaDtRLa674mPWHyV4ik7 ?

Proceed only if you have sent the payment.`,
      buttons: [
        {
          label: "Yes, I Have Sent It",
          onClick: async () => submitPaymentRequest()
        },
        { label: "Cancel" }
      ]
    });
  };

  // Send payment request to backend
  const submitPaymentRequest = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${Api}/create-sub`,
        {
          amount: 100,
          userWallet: paymentData.wallet,
          yourWallet: "0xf354d5816648B4EAcD3E2fDA319BDbe49A1b7c3F"
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Subscription request created!");
      setShowSubscribeForm(false);
      setShowPendingModal(true);

    } catch (error) {
      console.error("Payment Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to create subscription.");
    } finally {
      setLoading(false);
    }
  };



  const  copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText('0xf354d5816648B4EAcD3E2fDA319BDbe49A1b7c3F');
      alert("wallet Copied!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };


  return (
    <div className="subscription-page">
      <h2>Subscription Plan</h2>
      <p>View and manage your subscription</p>

      {/* ======================
          NO ACTIVE SUBSCRIPTION & SUB REQUEST AVAILABLE
        ====================== */}
      {!hasActive && !subRequested && (
        <div className="no-subscription">
          <FaExclamationCircle size={40} style={{ color: "#f44336" }} />
          <h3>No Active Subscription</h3>
          <p>
            You currently do not have an active subscription.  
            With a free account, you can send up to <strong>200 emails/day</strong>.
          </p>

          {!showSubscribeForm ? (
            <button className="subscribe-btn" onClick={() => setShowSubscribeForm(true)}>
              Subscribe Now
            </button>
          ) : (
            <div className="subscribe-form">
              <h2>Subscribe to Send Unlimited Daily Emails</h2>

              <label>
                Plan Price (USD):
                <input type="text" value="$100" disabled />
              </label>

              <label>
                Your Wallet Address:
                <input
                  type="text"
                  name="wallet"
                  value={paymentData.wallet}
                  onChange={handleChange}
                  placeholder="Enter your wallet address"
                />
              </label>

              <label>
                Pay To (ERC20 / USDT):
                <input type="text" value="0xf354d5816648B4EAcD3E2fDA319BDbe49A1b7c3F" disabled />
              </label>

              <div className="form-buttons">
                <button onClick={() => setShowSubscribeForm(false)}>Cancel</button>
                <button onClick={handlePaymentSubmit} disabled={loading}>
                  {loading ? "Processing..." : "I Have Sent Coin"}
                </button>
                    <button onClick={copyToClipboard} >
                Copy Admin Address 
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================
          ACTIVE SUBSCRIPTION CARD
        ====================== */}
      {hasActive && (
        <div className="subscription-card">
          <div className="plan-header">
            <FaCreditCard size={24} style={{ marginRight: "8px" }} />
            <h3>{activeSub?.plan} Plan</h3>
          </div>

          <p>Status: <strong>{activeSub?.status.toUpperCase()}</strong></p>
          <p>Daily Limit: <strong>Unlimited emails/day</strong></p>
          <p>Emails Sent Today: <strong>{activeSub?.emailsSentToday}</strong></p>
          <p><FaCalendarAlt /> Expiry Date: {activeSub?.expiryDate}</p>
          <p><FaArrowUp /> Last Payment: {activeSub?.lastPayment}</p>

          <div className="subscription-actions">
            <button className="upgrade-btn">Contact Admin</button>
          </div>
        </div>
      )}

      {/* ======================
          MODAL — PENDING CONFIRMATION
        ====================== */}
     {showPendingModal && (
  <div className="subscription-modal">
    <div className="modal-content">
      <h3>Subscription Request Submitted</h3>
      <p>
        Your payment is awaiting confirmation.  
        Please wait while the admin confirms and activates your subscription.  
        This will only take 1 hour at most.
      </p>

      <p>If you need assistance, you can chat with the admin on Telegram.</p>

      <a
        href="https://t.me/ktank225"
        target="_blank"
        rel="noopener noreferrer"
        className="telegram-btn"
      >
        Contact Admin on Telegram
      </a>

      <button disabled={true}>Close</button>
    </div>
  </div>
)}

    </div>
  );
};

export default SubscriptionPage;



