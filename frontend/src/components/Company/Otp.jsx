import React, { useEffect, useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'
//import './Loader.css';

const Otp = () => {
  const location = useLocation();
  const {code, email , orderID, status} = location.state;
  console.log("code is : ", code);


  const [v1, setV1] = useState('');
  const [v2, setV2] = useState('');
  const [v3, setV3] = useState('');
  const [v4, setV4] = useState('');
  const [v5, setV5] = useState('');
  const [v6, setV6] = useState('');

  const [userType, setUserType]= useState('')
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  const ref1 = useRef();
  const ref2 = useRef();
  const ref3 = useRef();
  const ref4 = useRef();
  const ref5 = useRef();
  const ref6 = useRef();
  
  const handleverify = async(e) =>{
    e.preventDefault();
    const enteredOTP = `${v1}${v2}${v3}${v4}${v5}${v6}`;
    try {
      if (code === enteredOTP) {
        const newStatus = 'update';
        
        // Make sure the function is async
        const response = await axios.post("http://localhost:8080/backend/api/Company/update_order_status.php", {
          orderId: orderID,
          status: status,
          purpose: 'update',
        });
        
        // Check the response once awaited
        if (response.data.success) {
          navigate("/company/order");
        } else {
          console.error("Failed to update order status:", response.data.message);
        }
        
      } else {
        console.log("PIN number does not match");
        setErrorMessage("PIN number does not match");
      }
    } catch (error) {
      console.error('Error:', error);
    }
    
  }

  const handleResend = async (e) =>{
    e.preventDefault();
    //setIsLoading(true);
    
    try {
        const response = await axios.post("http://localhost:8080/backend/api/Home/forgotpassword.php",{email});
        const data = response.data;
        
        console.log(data);
        if(data.success){
          console.log("login code : ", code);
          navigate("" , {state: { code }});
        } else{
            setErrorMessage(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        setErrorMessage('An error occurred. Please try again.');
    }
}

const handleChange = (e, setValue, nextRef) => {
  const value = e.target.value;
  if (value.length === 1) {
    setValue(value); // Update the state with the entered value
    if (nextRef && nextRef.current) {
      nextRef.current.focus(); // Move to the next input only if nextRef exists
    }
  }
};

  return (
    <div className="d-flex vh-100 align-items-center justify-content-center">
    {errorMessage && (
      <div id="errorMessage" className="text-danger mb-4 text-center">
        <strong> </strong> <p>{errorMessage}</p>
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
          <input type="text" maxLength="1" className="form-control text-center mx-1" style={{ width: '50px', fontSize: '24px' }} value={v1} onChange={(e) => handleChange(e, setV1, ref2)}
              ref={ref1} />
          <input type="text" maxLength="1" className="form-control text-center mx-1" style={{ width: '50px', fontSize: '24px' }} value={v2} onChange={(e) => handleChange(e, setV2, ref3)}
              ref={ref2} />
          <input type="text" maxLength="1" className="form-control text-center mx-1" style={{ width: '50px', fontSize: '24px' }} value={v3} onChange={(e) => handleChange(e, setV3, ref4)}
              ref={ref3} />
          <input type="text" maxLength="1" className="form-control text-center mx-1" style={{ width: '50px', fontSize: '24px' }} value={v4} onChange={(e) => handleChange(e, setV4, ref5)}
              ref={ref4} />
          <input type="text" maxLength="1" className="form-control text-center mx-1" style={{ width: '50px', fontSize: '24px' }} value={v5} onChange={(e) => handleChange(e, setV5, ref6)}
              ref={ref5} />
          <input type="text" maxLength="1" className="form-control text-center mx-1" style={{ width: '50px', fontSize: '24px' }} value={v6} onChange={(e) => handleChange(e, setV6, null)}
              ref={ref6} />
        </div>

        {/* {isLoading && (
          <div className="loader"></div>
        )} */}
  
        <p className="text-center mb-4" style={{ fontSize: '80%' }}>
          Didn't get the code?
          <Link onClick={handleResend} className="ms-1 text-primary" to="#">Resend</Link>
        </p>
      </div>
  
      {/* Card Footer */}
      <div className="card-footer text-center">
        <button onClick={handleverify} className="btn btn-primary btn-lg w-100">Verify</button>
      </div>
    </div>
  </div>
  

  );
}

export default Otp;
