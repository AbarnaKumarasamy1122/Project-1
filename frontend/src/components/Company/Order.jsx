import React, { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaTruck, FaHome, FaShippingFast, FaCheck, FaSearch } from "react-icons/fa";
import { MdOutlineHomeWork } from "react-icons/md";
import DatePicker from "react-datepicker"; // Import DatePicker
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { Modal, Button } from 'react-bootstrap';
import { useOutletContext } from "react-router-dom";
import { SlCalender } from "react-icons/sl";

function Order() {
  const { user } = useOutletContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingDeliveryDate, setEditingDeliveryDate] = useState(null); // State for editing delivery date
  const [currentOrderId, setCurrentOrderId] = useState(null); // State to track the current order being edited
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filteredOrder, setFilteredOrder] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleShowViewModal = (order) => {
    setSelectedOrder(order);
    setShowViewModal(true);
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

  const handleStatusChange = (orderID, newStatus) => {
    // Update the status locally for immediate UI feedback
    const updatedOrders = orders.map((order) => {
      if (order.orderID === orderID) {
        return { ...order, status: newStatus };
      }
      return order;
    });
    setOrders(updatedOrders);

    // Then send a request to update status on the server
    axios.post("http://localhost:8080/backend/api/Company/update_order_status.php", {
      orderId: orderID,
      status: newStatus,
    })
      .then((response) => {
        if (response.data.success) {
          console.log("Order status updated successfully");
          fetchOrderData();
        }
      })
      .catch((error) => {
        console.error("Error updating order status:", error);
      });
  };

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
      <section className="display_details">
        {filteredOrder.length > 0 ? (
          <table className="d-felx">
            <thead className=" fs-5">
              <tr>
                <th>Shop Name</th>
                <th>Order ID</th>
                <th>District</th>
                <th>Order Date</th>
                <th>Delivery Date</th>
                <th>Status</th>
                <th>Quantity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrder.map((order, index) => (
                <tr key={order.orderID} className="fs-6">
                  <td>{order.customerShopName}</td>
                  <td>{order.orderID}</td>
                  <td>{order.customerDistrict}</td>
                  <td>{formatDate(order.orderDate)}</td>
                  <td>{currentOrderId === order.orderID ? (
                    <>
                      <div className="datepicker-wrapper">
                        <DatePicker
                          selected={editingDeliveryDate || new Date()}  // Provide a default date if editingDeliveryDate is null
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
                        setEditingDeliveryDate(new Date(order.deliveryDate)); // Set  delivery date
                      }} className="calender-icon">

                        <SlCalender />
                      </button>
                    </>
                  )}</td>
                  <td>
                    {order.status === 'processing' && <MdOutlineHomeWork />}
                    {order.status === 'pending' && <FaShippingFast />}
                    {order.status === 'delivered' && <FaCheck />}
                    <input
                      type="range"
                      min="1"
                      max="3"
                      value={order.status === 'processing' ? 1 : order.status === 'pending' ? 2 : 3}
                      onChange={(e) => {
                        const status = e.target.value === "1" ? 'processing' : e.target.value === "2" ? 'pending' : 'delivered';
                        handleStatusChange(order.orderID, status);
                      }}
                    />
                  </td>
                  <td>{order.quantity}</td>
                  <td>
                    <button
                      className="btn btn-primary me-1"
                      onClick={() => handleShowViewModal(order)}
                    >
                      view
                    </button>
                    {/* <button className="btn btn-danger" onClick={() => handleDelete(order.orderId)}>
                    <FaTrash />
                  </button> */}
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

      {/* View Modal */}
      {selectedOrder && (
        <Modal show={showViewModal} onHide={handleCloseViewModal}>
          <Modal.Header closeButton>
            <Modal.Title>View Order Details</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ fontSize: "135%" }}>
            <p>
              <strong>Order ID:</strong> {selectedOrder.orderID}
            </p>
            <p>
              <strong>Customer Name:</strong> {selectedOrder.customerName}
            </p>
            <p>
              <strong>Shop Name:</strong> {selectedOrder.customerShopName}
            </p>
            <p>
              <strong>Customer Email:</strong> {selectedOrder.email}
            </p>
            <p>
              <strong>Contact Number:</strong> {selectedOrder.customerContactNumber}
            </p>
            <p>
              <strong>Customer Address:</strong> {selectedOrder.customerAddress}
            </p>
            <p>
              <strong>Customer District:</strong> {selectedOrder.customerDistrict}
            </p>
            <p>
              <strong>Order Date:</strong> {selectedOrder.orderDate}
            </p>
            <p>
              <strong>Delivery Date:</strong> {selectedOrder.deliveryDate}
            </p>
            <p>
              <strong>Reference No:</strong>{" "}
              {selectedOrder.customerShopReferenceNo}
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseViewModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}

    </div>
  );
}

export default Order;
