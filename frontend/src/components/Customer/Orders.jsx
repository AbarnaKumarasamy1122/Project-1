import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';

function Orders() {
    const [pendingOrders, setPendingOrders] = useState([]);
    const [succeededOrders, setSucceededOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState([]); // For displaying order items
    const [selectedOrders, setSelectedOrders] = useState([]); // For displaying order items
    const [showModal, setShowModal] = useState(false); // Modal state
    const [selectedOrderID, setSelectedOrderID] = useState('');
    const [invoice, setInvoice] = useState(null);
    const [total, setTotal] = useState('');
    const userID = JSON.parse(sessionStorage.getItem('userID'));
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch pending orders
        const fetchOreders = async () => {
            if (userID) {
                try {
                    const response = await axios.get('http://localhost:8080/backend/api/Customer/orders.php', {
                        params: {
                            status: 'processing',
                            customer_id: userID // Assuming `userID` is already defined
                        },
                        withCredentials: true // Including credentials (e.g., cookies or auth tokens)
                    });

                    if (response.data) {
                        console.log("pending orders", response.data);
                        setPendingOrders(response.data); // Set the pending orders state
                    }
                } catch (error) {
                    console.error("Error fetching pending orders:", error);
                }

                try {
                    const response = await axios.get('http://localhost:8080/backend/api/Customer/orders.php', {
                        params: {
                            status: 'pending',
                            customer_id: userID // Assuming `userID` is already defined
                        },
                        withCredentials: true // Including credentials (e.g., cookies or auth tokens)
                    });

                    if (response.data) {
                        console.log("succeed orders", response.data);
                        setSucceededOrders(response.data); // Set the succeeded orders state
                    }
                } catch (error) {
                    console.error("Error fetching succeeded orders:", error);
                }
            }

        }
        fetchOreders();
    }, [userID]);

    // Handle order click to display items
    const handleOrderClick = (invoiceID, status) => {
        console.log("invoiceID : : ",invoiceID);
        setSelectedOrderID(invoiceID);
        axios.get(`http://localhost:8080/backend/api/Customer/get_order_details.php`, {
            params: {
                invoiceID: invoiceID
            },
            withCredentials: true
        }) // Fetch items for a specific order
            .then((response) => {
                console.log("Fetched order details: ", response.data); // Log the fetched data
                if (response.data) {
                    
                    // setSelectedOrder(response.data.items); // Set selected order details
                    setSelectedOrders(response.data.orders); // Set selected order details
                }
                if(selectedOrders && total){
                    if (status == 'pay') {
                        console.log("total: ", total);
                        console.log("total pay: ", selectedOrder);
                        navigate('/customer/payment', { state: { invoice: response.data, totalAmount: total, customer_id: userID } })
                    }
                }
                if (selectedOrders && (status == 'view')) {
                    setShowModal(true);
                }
                // if (invoice && (status == 'pay')) {
                //     navigate('/customer/payment', { state: { invoice: invoice, totalAmount: total } })
                // }

            })
            .catch((error) => console.error('Error fetching order items:', error));
    };



    // Close the modal
    const handleCloseModal = () => {
        console.log("close: ", selectedOrders);
        setShowModal(false);
        setSelectedOrder(null);
        setSelectedOrder(null); // Reset selected order
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center">My Orders</h2>

            <div className="card mt-4">
                <div className="card-header">
                    <h4>Pending Payment Orders</h4>
                </div>
                <div className="card-body">
                    {Array.isArray(pendingOrders) && pendingOrders.length > 0 ? (
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Invoice ID</th>
                                    <th>Total Amount</th>
                                    <th>Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingOrders.map((order) => (
                                    <tr key={order.invoiceID}>
                                        <td>{order.invoiceID}</td>
                                        <td>Rs. {order.totalAmount}</td>
                                        <td>{order.invoiceDate}</td>
                                        <td>
                                            <Button variant="primary" onClick={() => {
                                                setTotal(order.totalAmount);
                                                handleOrderClick(order.invoiceID, 'pay');
                                            }}>
                                                {/* <Button variant="primary" onClick={() => navigate('/customer/payment', { state: { invoice: order , totalAmount: order.total} })}> */}
                                                Pay Now
                                            </Button>
                                            <Button variant="info" className="ml-2" onClick={() => handleOrderClick(order.invoiceID, 'view')}>
                                                View Items
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No pending orders found.</p>
                    )}
                </div>
            </div>

            <div className="card mt-4">
                <div className="card-header">
                    <h4>Succeeded Orders</h4>
                </div>
                <div className="card-body">
                    {Array.isArray(succeededOrders) && succeededOrders.length > 0 ? (
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Invoice ID</th>
                                    <th>Total Amount</th>
                                    <th>Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {succeededOrders.map((order) => (
                                    <tr key={order.invoiceID}>
                                        <td>{order.invoiceID}</td>
                                        <td>Rs. {order.totalAmount}</td>
                                        <td>{order.invoiceDate}</td>
                                        <td>
                                            <Button variant="info" className="ml-2" onClick={() => handleOrderClick(order.invoiceID, 'view')}>
                                                View Items
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No succeeded orders found.</p>
                    )}
                </div>
            </div>

            <Button className="mt-3" variant="secondary" onClick={() => navigate('/customer/dash')}>
                Back to Dashboard
            </Button>

            {/* Order Items Modal */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Order Items for Invoice: {selectedOrderID}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedOrders.length > 0 ? (
                        selectedOrders.map((order) => (
                            <div key={order.orderID}>
                                <h5>Order ID: {order.orderID}</h5>
                                <h6> Order Total amount : <b>Rs.{order.total_per_order}.00</b></h6>
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Product Name</th>
                                            <th>Price</th>
                                            <th>Quantity</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.items.map((item) => (
                                            <tr key={item.orderItemID}>
                                                <td>{item.productName}</td>
                                                <td>Rs. {item.price}</td>
                                                <td>{item.quantity}</td>
                                                <td>Rs. {item.price * item.quantity}</td>
                                            </tr>
                                            
                                        ))}
                                        
                                    </tbody>
                                    
                                </table>
                            </div>
                        ))
                    ) : (
                        <p>No items found for this order.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
}

export default Orders;
