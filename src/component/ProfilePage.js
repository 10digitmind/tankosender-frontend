import React, { useEffect, useState } from 'react';
import { FaUserCircle, FaLock, FaCreditCard } from 'react-icons/fa';
import '../styles/ProfilePage.css';
import { useSelector } from 'react-redux';
import {  getSub,getCurrentUser } from "../redux/Asyncthunk";
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';

const Api =process.env.REACT_APP_API_URL 
     const token = localStorage.getItem("authToken");


const ProfilePage = () => {
  const { subscription , user } = useSelector((state) => state.user);

  const dispatch = useDispatch()

 useEffect(() => {
    dispatch(getSub());
  }, [dispatch]);

useEffect(()=>{
    dispatch(getCurrentUser())
},[dispatch])

const [passwordData, setPasswordData] = useState({ current: '', newPassword: '', confirm: '' });
const [showSuccess, setShowSuccess] = useState(false);

const handleChange = (e) => {
const { name, value } = e.target;
setPasswordData(prev => ({ ...prev, [name]: value }));
};

const handlePasswordUpdate = async () => {
  if (passwordData.newPassword !== passwordData.confirm) {
    toast.error("New password and confirmation do not match");
    return;
  }

  if (passwordData.newPassword.length < 6) {
    toast.error("Password must be at least 6 characters");
    return;
  }
console.log(passwordData)
  try {
    const response = await axios.patch(
      `${Api}/change-password`,
      {
        oldPassword: passwordData.current,
        newPassword: passwordData.newPassword
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success("Password updated successfully!");
    setShowSuccess(true);

    setPasswordData({ current: "", newPassword: "", confirm: "" });

  } catch (error) {
    console.error("Password Change Error:", error.response?.data);
    toast.error(error.response?.data?.message || "Failed to update password");
  }
};


const hasActiveSubscription = subscription && subscription.status === 'active';

return ( <div className="profile-page"> <h2>Profile</h2> <p>Manage your account and subscription</p>

  <div className="profile-card">
    <div className="profile-info">
      <FaUserCircle size={50} style={{ marginRight: '15px' }} />
      <div>
        <p><strong>Email:</strong> {user?.email}</p>
      </div>
    </div>

    <div className="password-section">
      <h3><FaLock style={{ marginRight: '5px' }} />Change Password</h3>
      <label>
        Current Password:
        <input
          type="password"
          name="current"
          value={passwordData.current}
          onChange={handleChange}
        />
      </label>
      <label>
        New Password:
        <input
          type="password"
          name="newPassword"
          value={passwordData.newPassword}
          onChange={handleChange}
        />
      </label>
      <label>
        Confirm New Password:
        <input
          type="password"
          name="confirm"
          value={passwordData.confirm}
          onChange={handleChange}
        />
      </label>
      <button className="update-btn" onClick={handlePasswordUpdate}>
        Update Password
      </button>
      {showSuccess && <p className="success-message">Password updated successfully!</p>}
    </div>

    <div className="subscription-section">
      <h3><FaCreditCard style={{ marginRight: '5px' }} />Subscription</h3>
      {!hasActiveSubscription ? (
        <p>No active subscription. You can send up to <strong>200 emails/day</strong> with a free account.</p>
      ) : (
        <div className="subscription-info">
          <p><strong>Plan:</strong> {subscription?.plan}</p>
          <p><strong>Status:</strong> {subscription?.status}</p>
          <p><strong>Daily Limit:</strong> unlimited emails/day</p>
          <p><strong>Expiry Date:</strong> {subscription?.expiryDate}</p>
        </div>
      )}
    </div>
  </div>
</div>


);
};

export default ProfilePage;
