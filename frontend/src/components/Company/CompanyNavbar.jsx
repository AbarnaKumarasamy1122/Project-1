import React from 'react'
import {FaBars} from 'react-icons/fa';
import { MdOutlineMessage } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
export const CompanyNavbar = ({sidebarToggle,setSidebarToggle,user}) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
};

  
  return (
    <nav className={`${sidebarToggle?"ml-25":""} d-flex w-full justify-content-between px-4 align-itmes-center navbar text-white`}>
    <div className='d-flex align-items-center my-1 fs-5'>
        <div className='d-flex text-white me-1'><FaBars className={`fabar ${sidebarToggle?"d-none":""}`} onClick={()=>setSidebarToggle(!sidebarToggle)}/></div>
        <div className='d-flex text-white align-items-center'>{user.companyName}</div>
    </div>
    <div className='d-flex align-items-center'>
    {/* <div className='d-flex ms-2 align-items-center cursor-pointer'onClick={handleViewModal}><MdOutlineMessage style={{height:'20px',width:'20px'}}/></div> */}
        <div className='d-flex ms-2 align-items-center cursor-pointer'onClick={handleLogout}><IoLogOut style={{height:'20px',width:'20px'}}/><span className='px-1 d-none d-md-block d-flex' >Log Out</span></div>
       
    </div>
  </nav>
  )
}

