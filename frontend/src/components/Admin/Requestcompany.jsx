import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import './Loader.css';



const Requestcompany = ({ showRequestAddModal, handleCloseRequestAddModal, handleShowViewModal }) => {
    const [company, setCompany] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCompanyDetailsModal, setShowCompanyDetailsModal] = useState(false);
    const[isLoading, setIsLoading] = useState(false);

    const fetchCompanyRequestData = async () => {
        setLoading(true);
        try {
          const response = await fetch('http://localhost:8080/backend/api/Admin/Requestcompany.php');
          const jsonData = await response.json();
          if (jsonData.success) {
            setCompany(jsonData.data);
          } else {
            setError(jsonData.message);
          }
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
    
      useEffect(() => {
        fetchCompanyRequestData();
      }, []);
    
     if (loading) return <div>Loading...</div>;
      if (error) return <div>Error: {error}</div>;

      const handleViewRequestCompanyDetails = async (company) => {
        try {
          const response = await fetch(`http://localhost:8080/backend/api/Admin/Getrequestcompany.php?id=${company.id}`);
          const jsonData = await response.json();
          console.log('API Response:', jsonData); // Log API response
          if (jsonData.success) {
            
            setSelectedCompany(jsonData.data[0]);
            console.log('Selected Company:', jsonData.data[0]); // Log selected customer
            setShowCompanyDetailsModal(true);
          } else {
            setError(jsonData.message);
          }
        } catch (error) {
          setError(error.message);
        }
      };
    
    
      const handleCloseCompanyDetailsModal = () => {
        setSelectedCompany(null);
        setShowCompanyDetailsModal(false);
      };
    
      const handleAcceptCompany = async() => {
        console.log('accept clicked');
        const confirmed = window.confirm("Are you sure want to add this company ?");
        if(confirmed){
          setIsLoading(true);
          try {
            const response = await axios.post('http://localhost:8080/backend/api/Admin/Addcompany.php', selectedCompany);
            const data = response.data;
            console.log('data : ', data);
            if (data.success) {
              alert("Company added successfully");
              // Optionally refetch the customer list or update state to remove the accepted customer from the UI
              fetchCompanyRequestData();
              window.location.reload();
            } else {
              alert("Error adding company");
              console.error(data.message);
            }
          } catch (error) {
            console.error('Error:', error);
            alert("There was an error!");
          }finally{
            setIsLoading(false);
          }
          setShowCompanyDetailsModal(false);
        }
        
      };
    
      const handleRejectCompany = async () => {

        console.log('accept rejected');
        
        console.log(selectedCompany.id);
        const confirmed = window.confirm("Are you sure want to remove this company ?");
        if(confirmed){
          try {
            const response = await axios.post('http://localhost:8080/backend/api/Admin/deletecompany.php',selectedCompany);
            
            const data = response.data;
            console.log('data : ', data);
            if (data.success) {
              alert("Company rejected successfully");
              // Optionally refetch the customer list or update state to remove the accepted customer from the UI
              fetchCompanyRequestData();
              window.location.reload();
            } else {
              alert("Error Rejecting company");
              console.error(data.message);
            }
          } catch (error) {
            console.error('Error:', error);
            alert("There was an error!");
          }
          setShowCompanyDetailsModal(false);
        }
        // Implement reject customer logic here
        setShowCompanyDetailsModal(false);
      };

      return (
        <>
        <Modal show={showRequestAddModal} onHide={handleCloseRequestAddModal}>
          <Modal.Header closeButton>
            <Modal.Title>Company Requests</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className='table-responsive'>
              <table className='table table-bordered table-striped'>
                <thead className='thead-dark'>
                  <tr style={{ fontSize: '145%' }}>
                    <th>Company ID</th>
                    <th>Company Name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {company.map((company) => (
                    <tr key={company.id} style={{ fontSize: '145%' }}>
                      <td>{company.id}</td>
                      <td>{company.username}</td>
                      <td className='d-flex justify-content-center'>
                        <button className="btn btn-primary me-1" onClick={() => handleViewRequestCompanyDetails(company)}>View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseRequestAddModal}>Close</Button>
          </Modal.Footer>
        </Modal>

        {selectedCompany && (
        <Modal show={showCompanyDetailsModal} onHide={handleCloseCompanyDetailsModal}>
          <Modal.Header closeButton>
            <Modal.Title>View Company</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{fontSize:'135%'}}>
             <p><strong>ID:</strong> {selectedCompany.id}</p>
            <p><strong>Name:</strong> {selectedCompany.username}</p>
            <p><strong>Company Name:</strong> {selectedCompany.businessName}</p>
            <p><strong>Email:</strong> {selectedCompany.email}</p>
            <p><strong>Contact Number:</strong> {selectedCompany.contactNumber}</p>
            <p><strong>Address:</strong> {selectedCompany.address}</p>
            <p><strong>District:</strong> {selectedCompany.district}</p> 
            {/*<p><strong>Reference No:</strong> {selectedCustomer.customerShopReferenceNo}</p>*/}
            {/*<p><strong>Password:</strong> {selectedCustomer.password}</p>*/}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={handleAcceptCompany}>Accept</Button>
            <Button variant="danger" onClick={handleRejectCompany}>Reject</Button>
          </Modal.Footer>
          {isLoading &&(
              <div className='d-flex justify-content-center my-3'>
                <div className='Loader'></div>
              </div>
            )}
        </Modal>
      )}
        </>
        
      );
    }

export default Requestcompany