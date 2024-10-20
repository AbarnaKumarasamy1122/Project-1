import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';



const Resetpassword = () => {
    const [email, setEmail] = useState('');
    const [userType, setUserType] = useState('');
    // const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const userType = JSON.parse(sessionStorage.getItem('userType'));
        const email = JSON.parse(sessionStorage.getItem('userEmail'));


        if(userType && email){
            setEmail(email);
            setUserType(userType);
        }
            
            
        
    }, []);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        console.log("email",email);
        console.log("userType",userType);
        // Validate new password and confirmation
        if (newPassword !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/backend/api/Home/resetpassword.php', {
                newPassword,
                confirmPassword,
                email,
                userType
            });

            const data = response.data;
            console.log(data);

            if (data.success) {
                setSuccessMessage('Password Reset successfully');
                // Redirect to the dashboard after password change
                setTimeout(() => {
                    navigate(data.userType === 'admin' ? '/admin/dash' : 
                             data.userType === 'company' ? '/company/dash' : 
                             '/customer/dash');
                }, 2000); 
            } else {
                setErrorMessage(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('An error occurred. Please try again.');
        }
    };

    return (
        <div className='vh-100  align-items-center justify-content-center ' style={{marginTop:'10%'}}>
        <div className=" container card mt-5 p-2  shadow " style={{width:'50%'}}>
            
            <form className="form-box p-2" onSubmit={handleResetPassword}>
                <h2 className='text-center mt-4'>Reset Password</h2>
                {errorMessage && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert" style={{fontSize:'120%'}}>
                    {errorMessage}
                </div>
            )}

            {/* Success message */}
            {successMessage && (
                <div className="alert alert-success alert-dismissible fade show" role="alert" style={{fontSize:'120%'}}>
                    {successMessage}
                </div>
            )}
                
                <div className="mb-3">
                        <h6><label className="form-label">New Password</label></h6>
                        <input 
                        type="password" className="form-control mb-2" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        />
                </div>
                <div className="mb-4">
                        <h6><label className="form-label">Confirm Password</label></h6>
                        <input 
                        type="password" className="form-control mb-2" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required/>
                </div>
                
                <button type="submit" className="submit mb-3 mt-3">Update Password</button>
            </form>
        </div>
        </div>
    );
};

export default Resetpassword;
