import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUser, FaLock, FaSave, FaUndo } from 'react-icons/fa';
import { useNavigate, useOutletContext } from 'react-router-dom';
import './Setting.css'; // Assuming you're using an external CSS file for styling

export const Setting = () => {
  const { user } = useOutletContext();
  const [customerName, setCustomerName] = useState(user ? user.customerName : '');
  const [email, setEmail] = useState(user ? user.email : '');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setCustomerName(user.customerName);
      setEmail(user.email);
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    try {
      const response = await axios.put('/api/customer/update', {
        customerName,
        email,
      });
      setSuccessMessage('Profile updated successfully!');
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating profile');
    }
  };

  const handleChangePassword = async () => {
    try {
      const response = await axios.put('/api/customer/change-password', {
        password,
        newPassword,
      });
      setSuccessMessage('Password changed successfully!');
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Error changing password');
    }
  };

  return (
    <div className="setting-container">
      <h2 className="setting-title">Settings</h2>
      {error && <div className="setting-alert setting-alert-danger">{error}</div>}
      {successMessage && <div className="setting-alert setting-alert-success">{successMessage}</div>}

      <div className="setting-form-group">
        <label className="setting-form-label"><FaUser /> Name</label>
        <input
          type="text"
          className="setting-form-control"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          disabled
        />
      </div>

      <div className="setting-form-group">
        <label className="setting-form-label"><FaUser /> Email</label>
        <input
          type="email"
          className="setting-form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled
        />
      </div>

      <div className="setting-form-group">
        <label className="setting-form-label"><FaLock /> Current Password</label>
        <input
          type="password"
          className="setting-form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="setting-form-group">
        <label className="setting-form-label"><FaLock /> New Password</label>
        <input
          type="password"
          className="setting-form-control"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>

      <div className="setting-button-group">
        <button className="setting-btn setting-btn-primary" onClick={handleUpdateProfile}>
          <FaSave /> Save Changes
        </button>
        <button className="setting-btn setting-btn-secondary" onClick={handleChangePassword}>
          <FaUndo /> Change Password
        </button>
      </div>
      <div className="setting-button-group my-3">
        <button className="setting-btn setting-btn-secondary" onClick={() => navigate('/customer/dash')}>
          <FaSave /> Back
        </button>
      </div>
    </div>
  );
};

export default Setting;
