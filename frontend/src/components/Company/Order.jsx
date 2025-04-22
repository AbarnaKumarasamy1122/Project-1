import React, { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaTruck, FaHome, FaShippingFast, FaCheck, FaSearch } from "react-icons/fa";
import { MdOutlineHomeWork } from "react-icons/md";
import DatePicker from "react-datepicker"; // Import DatePicker
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { Modal, Button } from 'react-bootstrap';
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { SlCalender } from "react-icons/sl";

function Order() {
  const { user } = useOutletContext();
  const [orders, setOrders] = useState([]);
  // const location = useLocation();
  // const {status } = location.state;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingDeliveryDate, setEditingDeliveryDate] = useState(null); // State for editing delivery date
  const [currentOrderId, setCurrentOrderId] = useState(null); // State to track the current order being edited
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filteredOrder, setFilteredOrder] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleShowViewModal = async (order) => {
    try {
      axios.get(`http://localhost:8080/backend/api/Customer/get_order_details.php`, {
        params: {
          invoiceID: order.orderID,
          companyOwnerID: user.companyOwnerID
        },
        withCredentials: true
      }) // Fetch items for a specific order
        .then((response) => {
          console.log("Fetched order details: ", response.data); // Log the fetched data
          if (response.data) {

            setSelectedOrder(response.data.items); // Set selected order details
          }
        })
        .catch((error) => console.error('Error fetching order items:', error));
    } catch (error) {
      console.error("Error fetching succeeded orders:", error);
    }
    if (setSelectedOrder) {
      
      console.log("selected : ", selectedOrder);
      setShowViewModal(true);
    }
    console.log(order);
  };
  const handleCloseViewModal = () => setShowViewModal(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Formats the date without time
  };

  const fetchOrderData = async () => {
    setLoading(true);
    try {
      if (user) {
        const response = await axios.post(
          "http://localhost:8080/backend/api/Company/view_orders.php",
          {
            companyOwnerID: user.companyOwnerID,
          }
        );
        console.log("companyOrders:", response.data);
        if (Array.isArray(response.data)) {
          setOrders(response.data);
          setFilteredOrder(response.data);
        } else {
          setError("Error fetching orders");
        }
      }
    } catch (error) {
      setError("Error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderData();
  }, [user.companyOwnerID]);

  // const handleDelete = (orderId) => {
  //   if (window.confirm("Are you sure you want to delete this order?")) {
  //     axios
  //       .get(`http://localhost/Project-1/backend/api/Company/delete_order.php?delete=${orderId}`)
  //       .then((response) => {
  //         if (response.data.success) {
  //           setOrders(orders.filter((order) => order.orderId !== orderId));
  //         } else {
  //           console.error("Error deleting order:", response.data.error);
  //         }
  //       })
  //       .catch((error) => console.error("Error deleting order:", error));
  //   }
  // };

  const handleStatusChange = async (orderID, newStatus) => {
    setLoading(true)
    // Update the status locally for immediate UI feedback
    const updatedOrders = orders.map((order) => {
      if (order.orderID === orderID) {
        return { ...order, status: newStatus };
      }
      return order;
    });
    setOrders(updatedOrders);
    try {
      // Send request to update status on the server
      const updateResponse = await axios.post("http://localhost:8080/backend/api/Company/update_order_status.php", {
        orderId: orderID,
        status: newStatus,
        purpose: 'verify',
      });
    
      if (updateResponse.data) {
        console.log("get orderID user email:", updateResponse.data);
    
        const subject = "Your Order delivered verification";
        const email = updateResponse.data[0].email; // Ensure the email exists in the response
        console.log("email",updateResponse.data[0].email);
        const message = "If you received the ordered items, please verify the delivery.";
    
        try {
          // Send OTP
          const otpResponse = await axios.post("http://localhost:8080/backend/api/Company/send_otp.php", {
            subject: subject,
            email: email,
            message: message,
            fname: updateResponse.data[0].customerName,
          });
    
          if (otpResponse.data && otpResponse.data.success) {
            console.log("OTP sent successfully:", otpResponse.data.message); // Log the OTP code
            const code = otpResponse.data.message; // OTP code
            navigate("/company/otp", {
              state: { code: code, email: email, orderID: orderID, status: newStatus }
            });
          } else {
            console.error("OTP error:", otpResponse.data); // Log detailed OTP response error
          }
    
        } catch (otpError) {
          console.error("Error sending OTP:", otpError); // Log errors if OTP request fails
        }
    
      } else {
        console.error("Order update failed. No response data:", updateResponse);
      }
    
    } catch (error) {
      console.error("Error updating order status:", error); // Log error in updating order status
    } finally {
      setLoading(false);
    }
  }

  const handleDateChange = (date) => {
    setEditingDeliveryDate(date);
  };

  const saveDeliveryDate = (orderID) => {
    const updatedOrders = orders.map((order) => {
      if (order.orderID === orderID) {
        return { ...order, deliveryDate: editingDeliveryDate }; // Update delivery date
      }
      return order;
    });
    setOrders(updatedOrders);

    // Send the updated delivery date to the server
    axios.post("http://localhost:8080/backend/api/Company/update_delivery_date.php", {
      orderId: orderID,
      deliveryDate: editingDeliveryDate,
    })
      .then((response) => {
        if (response.data.success) {
          console.log("Delivery date updated successfully");
          fetchOrderData();
        } else {
          console.error("Failed to update delivery date:", response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error updating delivery date:", error);
      });

    setEditingDeliveryDate(null);
    setCurrentOrderId(null);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value === "") {
      setFilteredOrder(orders); // Show all customers if search is empty
    } else {
      const filtered = orders.filter((order) =>
        order.customerName
          .toLowerCase()
          .includes(e.target.value.toLowerCase()) ||
        order.customerShopName
          .toLowerCase()
          .includes(e.target.value.toLowerCase()) ||
        order.orderID
          .toString().includes(e.target.value)
      );
      setFilteredOrder(filtered);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) { return <div className="error">{error}</div>; }

  return (
    <div className="maincontainer ">

      <div className="table_heading">
        <h3>Order Details</h3>
        {/* Search bar and icon */}
        <div className="search_container">
          <input
            type="text"
            placeholder="Search by OrderID"
            value={searchTerm}
            onChange={handleSearch}
            className="search_input"
          />
          <FaSearch className="search_icon" />
        </div>
      </div>
      {loading ? (
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
      ) : (
        <section className="display_details">
          {filteredOrder.length > 0 ? (
            <table className="d-felx">
              <thead className=" fs-5">
                <tr>
                  <th>Shop Name</th>
                  <th>Order ID</th>
                  <th>District</th>
                  <th>Address</th>
                  <th>Order Date</th>
                  {/* <th>Payment Method</th> */}
                  <th>Status</th>
                  <th>Total Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrder.map((order, index) => (
                  <tr key={`${order.orderID}-${index}`} className="fs-6">
                    <td>{order.customerShopName}</td>
                    <td>{order.orderID}</td>
                    <td>{order.customerDistrict}</td>
                    <td>{order.customerAddress}</td>
                    <td>{formatDate(order.orderDate)}</td>
                    {/* <td>{order.paymentMethod ? order.paymentMethod : "Pending"}</td> */}
                      {/* {currentOrderId === order.orderID ? (
                      <>
                        <div className="datepicker-wrapper">
                          <DatePicker
                            selected={editingDeliveryDate || new Date()}
                            onChange={handleDateChange}
                            dateFormat="yyyy/MM/dd"
                            className="small-datepicker"
                          />
                        </div>
                        <button className="save-button" onClick={() => saveDeliveryDate(order.orderID)}>Save</button>
                      </>
                    ) : (
                      <>
                        {formatDate(order.deliveryDate)}
                        <button onClick={() => {
                          setCurrentOrderId(order.orderID);
                          setEditingDeliveryDate(new Date(order.deliveryDate));
                        }} className="calender-icon">
                          <SlCalender />
                        </button>
                      </>
                    )} */}
                    
                    <td>
                      {order.status === 'processing' && <MdOutlineHomeWork />}
                      {order.status === 'pending' && <FaShippingFast />}
                      {order.status === 'delivered' && <FaCheck />}
                      <input
                        type="range"
                        min="1"
                        max="3"
                        // className={`${ order.status === 'delivered' ? "disabled" : ""}`}
                        value={order.status === 'processing' ? 1 : order.status === 'pending' ? 2 : 3}
                        onChange={(e) => {
                          const status = e.target.value === "1" ? 'processing' : e.target.value === "2" ? 'pending' : 'delivered';
                          handleStatusChange(order.orderID, status);
                        }}
                        disabled={order.status === 'delivered' || order.paymentMethod === null}

                      />
                    </td>
                    <td>Rs.{order.totalAmount}</td>
                    <td>
                      <button className="btn btn-primary me-1" onClick={() => handleShowViewModal(order)}>
                        view
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

              <tfoot>
                <tr>
                  <td
                    colSpan="8"
                    style={{ textAlign: "center", fontWeight: "bold" }}
                  >
                    Total Orders: {filteredOrder.length}
                  </td>
                </tr>
              </tfoot>
            </table>
          ) : (
            <div className="empty_text">No Orders Available</div>
          )}
        </section>
      )}
      {/* View Modal */}
      {selectedOrder && (
        <Modal show={showViewModal} onHide={handleCloseViewModal}>
          <Modal.Header closeButton>
            <Modal.Title>Order Items of Order ID : {selectedOrder[0].orderID} </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {Array.isArray(selectedOrder) && selectedOrder.length > 0 ? (
              
              <table className="table table-bordered">
                <thead>
                <h5>Payment Method : {selectedOrder[0].payment}</h5>
                <h6>Total : <b>Rs.{selectedOrder[0].total}.00</b></h6>
                  <tr>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.map((item) => (
                    <tr key={item.orderItemID}>
                      <td>{item.productName}</td>
                      <td>Rs. {item.price}</td>
                      <td>{item.quantity}</td>
                      <td>Rs. {item.price * item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No items found for this order.</p>
            )}
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseViewModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        // <Modal show={showViewModal} onHide={handleCloseViewModal}>
        //   <Modal.Header closeButton>
        //     <Modal.Title>View Order Details</Modal.Title>
        //   </Modal.Header>
        //   <Modal.Body style={{ fontSize: "135%" }}>
        //     <p>
        //       <strong>Order ID:</strong> {selectedOrder.orderID}
        //     </p>
        //     <p>
        //       <strong>Customer Name:</strong> {selectedOrder.customerName}
        //     </p>
        //     <p>
        //       <strong>Shop Name:</strong> {selectedOrder.customerShopName}
        //     </p>
        //     <p>
        //       <strong>Customer Email:</strong> {selectedOrder.email}
        //     </p>
        //     <p>
        //       <strong>Contact Number:</strong> {selectedOrder.customerContactNumber}
        //     </p>
        //     <p>
        //       <strong>Customer Address:</strong> {selectedOrder.customerAddress}
        //     </p>
        //     <p>
        //       <strong>Customer District:</strong> {selectedOrder.customerDistrict}
        //     </p>
        //     <p>
        //       <strong>Order Date:</strong> {selectedOrder.orderDate}
        //     </p>
        //     <p>
        //       <strong>Delivery Date:</strong> {selectedOrder.deliveryDate}
        //     </p>
        //     <p>
        //       <strong>Reference No:</strong>{" "}
        //       {selectedOrder.customerShopReferenceNo}
        //     </p>
        //   </Modal.Body>
        //   <Modal.Footer>
        //     <Button variant="secondary" onClick={handleCloseViewModal}>
        //       Close
        //     </Button>
        //   </Modal.Footer>
        // </Modal>
      )}

    </div>
  );
}

export default Order;
