import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaLock } from "react-icons/fa";
import './Login.css';
import './LoginRegister.css'
import axios from 'axios';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [userType, setUserType] = useState('');
    const [password, setPassword] = useState('');
    // const [code, setcode] = useState('');
    
    const [errorMessage, setErrorMessage] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        const sessionUser = JSON.parse(sessionStorage.getItem('user'));
        const localUser = JSON.parse(localStorage.getItem('user'));
        const user = sessionUser || localUser;
        if(localUser){
            setRememberMe(true);
        }
        if (user) {
            setEmail(user.email);
            setUserType(user.userType);
            
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            console.log("data : ",email);
            const response = await axios.post('http://localhost:8080/backend/api/Home/Login.php', { email, password });
            const data = response.data;
            console.log("data : ",data);
            if (data.success) {
                const userType = data.userType;
                const isFirstLogin = data.is_first_login;
                console.log(isFirstLogin);
                
                const user = { email, userType };
                if (rememberMe) {
                    localStorage.setItem('user', JSON.stringify(user));
                    sessionStorage.setItem('user', JSON.stringify(user));
                } else {
                    localStorage.clear();
                    sessionStorage.setItem('user', JSON.stringify(user));
                }
                if(isFirstLogin && (userType != 'admin')){
                    navigate('/ChangePassword');
                }else{
                    if (userType === 'admin') {
                        navigate('/admin/dash');
                    } else if (userType === 'company') {
                        navigate('/company/dash');
                    } else if (userType === 'customer') {
                        navigate('/customer/dash');
                    } else {
                        setErrorMessage('Invalid credentials');
                    }
                }
                
            } else {
                setErrorMessage(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('An error occurred. Please try again.');
        }
    };

    const handleforgotpassword = async (e) =>{
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const response = await axios.post("http://localhost:8080/backend/api/Home/forgotpassword.php",{email});
            const data = response.data;
            
            console.log(data);
            const code = data.message;
           
            if(data.success){
                
                sessionStorage.setItem('userType', JSON.stringify(data.userType));
                sessionStorage.setItem('userEmail', JSON.stringify(data.email));
                console.log("login code : ", code);
                navigate("/otp" , {state: { code }});
            } else{
                setErrorMessage(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('An error occurred. Please try again.');
        }
        finally {
        setIsLoading(false);  // Hide loader
    }
    }

    return (
        <div className="login">
            
            <div className="homeHeader">

                <div className="homeHeaderLinks">
                    <Link to="/" style={{fontSize:'150%'}}>Home</Link>
                    <Link to="/products" style={{fontSize:'150%'}}>Products</Link>
                    <Link to="/faqs" style={{fontSize:'150%'}}>FAQs</Link>
                    <Link to="/Login" style={{fontSize:'150%'}}>Log in</Link>
                </div>
            </div>
            {isLoading ? (
            <div className="d-flex justify-content-center align-items-center vh-100">
                
                <div className="homeHeaderLogo">
                <div className='fs-3'>Loading....</div>
                            <div id="logoContainer">
                                <div id="ring"></div>
                                <div id="ring"></div>
                                <div id="ring"></div>
                                <div id="ring"></div>
                            </div>
                            
                        </div> {/* Use the loader CSS here */}
            </div>
        ):(
            <div className="loginBody">
            <div className="homeBanner  background-opacity">
                    <div className="homePageContainer">
                        <div className="homeBannerHeader form-box">
                            <form className='form'
                                onSubmit={handleLogin}>
                                <h2 id='h1' >Login</h2 >
                                {errorMessage && (
                                    <div className='loginnerror'>
                                        <strong style={{fontSize:'115%', marginLeft:'25%'}}> {errorMessage}</strong>
                                    </div>
                                )}
                                <div className="input-box ">
                                    <input
                                        type="text"
                                        placeholder='email'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                    <FaUser className='icon text-white' />
                                </div>
                                <div className="input-box">
                                    <input
                                        type="password"
                                        placeholder='Password'
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <FaLock className='icon text-white' />
                                </div>
                                <div className="remember-forgot mt-4">
                                    <label><input 
                                    type='checkbox' 
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    /> 
                                    Remember me</label>
                                    <Link onClick={handleforgotpassword} to="#">Forgot password?</Link>

                                </div>
                                <button type='submit' className='submit mt-3'>Login</button>
                                <div className='justify-content-center d-flex fs-6 mt-2'>
                                    <span className='text-white mt-3 mb-0'>Don't have an account ?<Link to="/register" className='register text-info ms-1'> Register</Link></span>
                                </div>
                                

                            </form>

                            
                            <h1>EliteZ</h1>
                            <div className="homeHeaderLogo">
                                <div id="logoContainer">
                                    <div id="ring"></div>
                                    <div id="ring"></div>
                                    <div id="ring"></div>
                                    <div id="ring"></div>
                                </div>
                                {/* <div id="logoTitle">EliteZ</div> */}
                            </div>
                            <p>Inventory Fulfillment and Distribution</p>

                        </div>
                    </div>
                </div>


            </div>
        )}
        </div>
        // </div>
    );
};
