import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import Requestcustomer from "./Requestcustomer";

function Customerdetails() {
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showRequestAddModal, setShowRequestAddModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const[isLoading, setIsLoading] = useState(false);
  const handleShowViewModal = (customer) => {
    setSelectedCustomer(customer);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => setShowViewModal(false);
  const handleShowRequestAddModal = () => setShowRequestAddModal(true);
  const handleCloseRequestAddModal = () => setShowRequestAddModal(false);
  const handleSaveAddModal = () => {
    // Fetch updated records here if necessary
    setShowRequestAddModal(false);
  };

  const [unreadRequestCount, setUnreadRequestsCount] = useState(0);

  useEffect(() => {
    // if(showRequestAddModal){
    //   window.location.reload();
    // }
  }, []);

  const fetchCustomerData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:8080/backend/api/Admin/Listcustomer.php"
      );
      const jsonData = await response.json();
      if (jsonData.success) {
        setCustomers(jsonData.data);
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
    fetchCustomerData();
    //fetchRequestCount();
  }, []);

  useEffect(() => {
    const fetchUnreadRequest = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8080/backend/api/Admin/requestcustomerCounts.php"
        );
        if (response.data.unreadCount !== undefined) {
          setUnreadRequestsCount(response.data.unreadCount);
        }
      } catch (error) {
        console.error("Error fetching unread messages:", error);
      }
    };

    fetchUnreadRequest();
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mt-5" style={{ bodyBackground: "#eaeaea" }}>
      <div className="row justify-content-center">
        <div className="col-md-11 col-lg-11">
          <div className="card">
            <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
              <form className="d-flex" role="search">
                <input
                  className="form-control"
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search"
                  aria-label="Search"
                />
              </form>
              <h1 className="h4 text-center">Customers Details</h1>
              <button
                className="btn btn-info text-dark m-2"
                onClick={handleShowRequestAddModal}
              >
                Customer Request
                {unreadRequestCount > 0 && (
                  <div className="notification-badge">{unreadRequestCount}</div> // Notification Badge
                )}
              </button>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-bordered table-striped">
                  <thead className="thead-dark">
                    <tr style={{ fontSize: "105%" }}>
                      <th>Customer Name</th>
                      <th>Shop Name</th>
                      <th>Email</th>
                      <th>Mobile</th>
                      <th>Option</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers
                      .filter((customer) => {
                        return search.toLowerCase() === ""
                          ? customers
                          : customer.customerName
                              .toLowerCase()
                              .includes(search);
                      })
                      .map((customer) => (
                        <tr
                          key={customer.customerID}
                          style={{ fontSize: "55%" }}
                        >
                          <td>{customer.customerName}</td>
                          <td>{customer.customerShopName}</td>
                          <td>{customer.email}</td>
                          <td>{customer.customerContactNumber}</td>

                          <td className="d-flex justify-content-center">
                            <button
                              className="btn btn-primary me-1"
                              onClick={() => handleShowViewModal(customer)}
                            >
                              View
                            </button>
                            {/*<button className="btn btn-success me-1">Edit</button>*/}
                            {/* <button className="btn btn-danger me-1 ">Delete</button> */}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedCustomer && (
        <Modal show={showViewModal} onHide={handleCloseViewModal}>
          <Modal.Header closeButton>
            <Modal.Title>View Customer</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ fontSize: "135%" }}>
            <p>
              <strong>ID:</strong> {selectedCustomer.customerID}
            </p>
            <p>
              <strong>Name:</strong> {selectedCustomer.customerName}
            </p>
            <p>
              <strong>Shop Name:</strong> {selectedCustomer.customerShopName}
            </p>
            <p>
              <strong>Email:</strong> {selectedCustomer.email}
            </p>
            <p>
              <strong>Contact Number:</strong>{" "}
              {selectedCustomer.customerContactNumber}
            </p>
            <p>
              <strong>Address:</strong> {selectedCustomer.customerAddress}
            </p>
            <p>
              <strong>District:</strong> {selectedCustomer.customerDistrict}
            </p>
            {/* <p>
              <strong>Reference No:</strong>{" "}
              {selectedCustomer.customerShopReferenceNo}
            </p> */}
            <p>
              <strong>Password:</strong> {selectedCustomer.password}
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseViewModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      <Requestcustomer
        showRequestAddModal={showRequestAddModal}
        handleCloseRequestAddModal={handleCloseRequestAddModal}
        handleShowViewModal={handleShowViewModal}
      />
    </div>
  );
}

export default Customerdetails;
