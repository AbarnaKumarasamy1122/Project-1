import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom'; // Import Link component from react-router-dom
import { FaWindowClose, FaUser,FaUserCircle } from 'react-icons/fa';
import { IoAnalyticsOutline, IoBagAdd } from "react-icons/io5";
import { RiLogoutCircleLine, RiMessage2Fill } from "react-icons/ri";
import { AiFillDashboard, AiFillProduct } from "react-icons/ai";
import { MdViewComfyAlt } from "react-icons/md";
import { CompanyDashboard } from './CompanyDashbord';
import { CompanyNavbar } from './CompanyNavbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Login } from '../Home/Login';

const CompanySidebar = ({ sidebarToggle, setSidebarToggle,error, user,setToggle}) => {

    const [scrolled, setScrolled] = useState(false);
    const [scrollDirection, setScrollDirection] = useState(null);
    const [prevScrollPos, setPrevScrollPos] = useState(window.pageYOffset);
    const navigate = useNavigate();
    // const [scrollpos,setScrollpos]=useState();

    // if (sidebarToggle) {
    //     window.scrollTo(0,0);
    // }

    const handleScroll = () => {
        const currentScrollPos = window.pageYOffset;
        // setScrollpos(currentScrollPos);
        // Determine scroll direction
        if (prevScrollPos < currentScrollPos) {
            setScrollDirection('up');
            setScrolled(false);
            setSidebarToggle(false);
        } else if (prevScrollPos > currentScrollPos) {
            setScrollDirection('down');
            setScrolled(true);
        } else {
            setScrolled(false);
        }

        setPrevScrollPos(currentScrollPos);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [prevScrollPos]);


    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/');
    };
    useEffect(()=>{
        setToggle(sidebarToggle);
    });

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
       <div className={`${scrolled ? "sticky-top" : ""} d-flex z-3`}>
            {/* <CompanyDashboard
    sidebarToggle={sidebarToggle}
    setSidebarToggle={setSidebarToggle}
    /> */}
            <CompanyNavbar
                sidebarToggle={sidebarToggle}
                setSidebarToggle={setSidebarToggle}
                user={user}
            />

            <div className={`${sidebarToggle ? "" : "d-none"} w-25 d-felx  fixed bg-color h-full ${scrolled ? "justify-content-start position-absolute z-1000 " : ""}`}>
                <div className='mx-2 z-3 d-flex fs-5 fw-bold h-12 text-white align-items-center justify-content-between'>
                    <span>{user ? user.companyName : 'Loading...'} DashBoard</span>
                    <FaWindowClose className='fabar w-6 h-6' onClick={() => setSidebarToggle(!sidebarToggle)} />
                </div>
                <hr className='text-dark m-0'></hr>
                <ul className=' text-white list-unstyled fw-bold bg-color pt-3 h-100vh '>
                    <li className='mb-2 hover-bg-blue-500 py-1 rounded align-items-center'>
                        <a href="/company/dash" className='text-decoration-none text-white fs-5 px-2'>
                            <AiFillDashboard className='w-6 h-6 mx-3 pb-1' />Dashboard
                        </a>
                    </li>
                    <li className='mb-2 hover-bg-blue-500 py-1 rounded align-items-center'>
                        <a href="/company/add-product" className='text-decoration-none text-white fs-5 px-2'>
                            <IoBagAdd className='w-6 h-6 mx-3 pb-1' />Add Product
                        </a>
                    </li>
                    <li className='mb-2 hover-bg-blue-500 py-1 rounded align-items-center'>
                        <a href="/company/display-product" className='text-decoration-none text-white fs-5 px-2'>
                            <AiFillProduct className='w-6 h-6 mx-3 pb-1' />View Product
                        </a>
                    </li>
                    <li className='mb-2 hover-bg-blue-500 py-1 rounded align-items-center'>
                        <a href="/company/order" className='text-decoration-none text-white fs-5 px-2'>
                            <MdViewComfyAlt className='w-6 h-6 mx-3 pb-1' />Orders
                        </a>
                    </li>
                    <li className='mb-2 hover-bg-blue-500 py-1 rounded align-items-center'>
                        <a href="/company/customer" className='text-decoration-none text-white fs-5 px-2'>
                            <FaUser className='w-6 h-6 mx-3 pb-1' />Customers
                        </a>
                    </li>
                    <li className='mb-2 hover-bg-blue-500 py-1 rounded align-items-center'>
                        <a href="/company/review" className='text-decoration-none text-white fs-5 px-2'>
                            <RiMessage2Fill className='w-6 h-6 mx-3 pb-1' />Reviews
                        </a>
                    </li>
                    <li className='mb-2 hover-bg-blue-500 py-1 rounded align-items-center' >
                        <a href="/company/profile" className='text-decoration-none text-white fs-5 px-2' >
                            <FaUserCircle className='w-6 h-6 mx-3 pb-1' />Profile
                        </a>
                    </li>
                    <li className='mb-2 hover-bg-blue-500 py-1 rounded align-items-center' >
                        <a href="/company/analyze" className='text-decoration-none text-white fs-5 px-2' >
                            <IoAnalyticsOutline className='w-6 h-6 mx-3 pb-1' />Analyze Reports
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    )
};

export default CompanySidebar;
