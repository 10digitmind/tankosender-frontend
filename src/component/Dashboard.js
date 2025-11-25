// Dashboard.js
import React, { useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
FaEnvelope,
FaUsers,
FaPaperPlane,
FaFileAlt,
FaCreditCard,
FaUserCircle,
FaSignOutAlt,
FaSteamSymbol
} from 'react-icons/fa';
import '../styles/dashboard.css';
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/userSlice";
import { getCurrentUser } from "../redux/Asyncthunk";


const Dashboard = () => {
 const dispatch = useDispatch()

 const  {user} = useSelector((state) => state.user)
useEffect(()=>{
    dispatch(getCurrentUser())
},[dispatch])

const location = useLocation();
const navigate = useNavigate();
     

const menuItems = [
{ name: 'SMTP Accounts', icon: <FaEnvelope />, path: '/dashboard/smtp' },
{ name: 'Email Jobs', icon: <FaUsers />, path: '/dashboard/emailjobs' },
{ name: 'Send & Track', icon: <FaPaperPlane />, path: '/dashboard/send-track' },
{ name: 'Email Logs', icon: <FaFileAlt />, path: '/dashboard/logs' },
{ name: 'Subscription', icon: <FaCreditCard />, path: '/dashboard/subscription' },
{ name: 'Profile', icon: <FaUserCircle />, path: '/dashboard/profile' },

];

const handleLogout = async () => {
 
    localStorage.clear()
   await dispatch(logout())
    navigate('/login')


  }
return ( <div className="dashboard"> <aside className="sidebar"> <h2 className="logo">EmailDash</h2> <ul>
{menuItems.map(item => (
<li
key={item.name}
className={location.pathname === item.path ? 'active' : ''}
> <NavLink to={item.path} className="menu-link"> <span className="icon">{item.icon}</span> <span className="text">{item.name}</span> </NavLink> </li>
))} </ul>

 <div className="profile-section">

    <div className="profile-info">
      <p className="welcome-text">Welcome, {user?.username}</p>
      <p className="profile-email">{user?.email}</p>
    </div>
  </div>

 <button className="logout-btn" onClick={handleLogout}> 
<FaSignOutAlt style={{ marginRight: '8px' }} /> Logout </button> </aside> <main className="main-content"> <Outlet /> </main> </div>

);

};

export default Dashboard;
