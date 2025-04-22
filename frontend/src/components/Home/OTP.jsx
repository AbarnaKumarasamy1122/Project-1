import React, { useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const OTP = () => {
  const location = useLocation();
  const code = location.state?.code;
  console.log("code is : ", code);

  const [v1, setV1] = useState('');
  const [v2, setV2] = useState('');
  const [v3, setV3] = useState('');
  const [v4, setV4] = useState('');
  const [v5, setV5] = useState('');
  const [v6, setV6] = useState('');
  const [email, setEmail] = useState(''); 
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Initialize the ref array
  const inputsRef = useRef([]);

  const handleVerify = (e) => {
    e.preventDefault();
    const enteredOTP = `${v1}${v2}${v3}${v4}${v5}${v6}`;
    if (code === enteredOTP) {
      navigate('/Resetpassword');
    } else {
      setErrorMessage("Pin number does not match");
    }
  };

  const handleResend = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/backend/api/Home/forgotpassword.php", { email });
      const data = response.data;
      if (data.success) {
        console.log("Resend code : ", data.code); // Adjust as needed
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  const handleKeyUp = (e, index) => {
    if (e.key === 'Backspace' && index > 0 && e.target.value === '') {
      inputsRef.current[index - 1].focus();
    } else if (e.target.value.length === 1 && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleChange = (e, setValue, index) => {
    const value = e.target.value;
    if (value.length <= 1) {
      setValue(value);
    }
  };

  return (
    <div className="d-flex vh-100 align-items-center justify-content-center">
      {errorMessage && (
        <div id="errorMessage" className="text-danger mb-4 text-center">
          <strong></strong> <p>{errorMessage}</p>
        </div>
      )}

      <div className="card p-4 shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
        {/* Card Header */}
        <div className="card-header text-center text-danger">
          <h3>OTP VERIFICATION</h3>
        </div>

        {/* Card Body */}
        <div className="card-body">
          <p className="mb-4" style={{ fontSize: '100%' }}>
            We've sent a password reset code to your email. Please check your email and enter the code number.
          </p>

          <div className="d-flex justify-content-between mb-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                className="form-control text-center mx-1"
                style={{ width: '50px', fontSize: '24px' }}
                value={[v1, v2, v3, v4, v5, v6][index]}
                onChange={(e) => handleChange(e, [setV1, setV2, setV3, setV4, setV5, setV6][index], index)}
                onKeyUp={(e) => handleKeyUp(e, index)}
                ref={(el) => (inputsRef.current[index] = el)} // Properly set the ref here
              />
            ))}
          </div>

          <p className="text-center mb-4" style={{ fontSize: '80%' }}>
            Didn't get the code?
            <Link onClick={handleResend} className="ms-1 text-primary" to="#" style={{ textDecoration: 'underline' }}>
              Resend
            </Link>
          </p>
        </div>

        {/* Card Footer */}
        <div className="card-footer text-center">
          <button onClick={handleVerify} className="btn btn-primary btn-lg w-100">Verify</button>
        </div>
      </div>
    </div>
  );
}

export default OTP;
