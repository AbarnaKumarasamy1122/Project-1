import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Button, Modal, Table } from 'react-bootstrap';
import { useNavigate, useOutletContext } from 'react-router-dom';
import "./cartitems.css";

function CartItems() {
    const [Items, setItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [invoice, setInvoice] = useState(null);
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const { user } = useOutletContext();
    const userID = JSON.parse(sessionStorage.getItem('userID'));
    const navigate = useNavigate();
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        const fetchCartItems = async () => {
            if (userID) {
                try {
                    const response = await axios.get('http://localhost:8080/backend/api/Customer/cart_items.php', {
                        params: { customer_id: userID }
                    });
                    if (response.data) {
                        setItems(response.data);
                        // calculateTotalAmount(response.data);
                    }
                } catch (error) {
                    console.error("Error fetching cart items:", error);
                }
            }
        };

        fetchCartItems();
    }, [userID]);

    const handleProceedToPayment = async () => {
        if (selectedItems.length === 0) {
            alert('Please select items to proceed.');
            return;
        }

        const total = selectedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        console.log("selected: ",selectedItems);
        try {
            const response = await axios.post('http://localhost:8080/backend/api/Customer/generate_invoice.php', {
                customer_id: userID,
                items: selectedItems
            });
            console.log("invooice:",response.data);
            if (response.data) {
                
                setInvoice(response.data);
                axios.get(`http://localhost:8080/backend/api/Customer/get_order_details.php`, {
                    params: {
                        invoiceID: response.data.invoiceID
                    },
                    withCredentials: true
                })
                    .then((response) => {
                        setTotalAmount(total.toFixed(2)); // Set total amount in state
                        console.log
                        navigate('/customer/payment', { state: { invoice: response.data, totalAmount: total.toFixed(2), customer_id: userID } });
                    })
                    .catch((error) => console.error('Error fetching order items:', error));
            }
        } catch (error) {
            console.error("Error proceeding to payment:", error);
        }
    };


    const handleQuantityChange = (index, newQuantity) => {
        const updateItems = [...Items];
        updateItems[index].quantity = newQuantity;
        setItems(updateItems);
        // calculateTotalAmount(updateItems);
    };

    const updateCartQuantity = async (item) => {
        try {
            const response = await axios.post('http://localhost:8080/backend/api/Customer/update_cart_quantity.php', {
                id: item.id,
                quantity: item.quantity
            });
            if (!response.data.success) {
                console.error("Error updating cart item.");
            }
        } catch (error) {
            console.error("Error updating cart item:", error);
        }
    };

    const handlePlaceOrder = () => {
        const total = selectedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const totals = total.toFixed(2);
        console.log("total:", totals);
        setTotalAmount(totals);
        setShowInvoiceModal(true);
    };

    const handleCloseModal = () => {

        setShowInvoiceModal(false);
    };

    // const calculateTotalAmount = (items) => {
    //     const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    //     const totals = total.toFixed(2);
    //     setTotalAmount(totals);
    // };

    const toggleItemSelection = (item) => {
        const isSelected = selectedItems.find((selected) => selected.id === item.id);
        if (isSelected) {
            setSelectedItems(selectedItems.filter((selected) => selected.id !== item.id));
        } else {
            setSelectedItems([...selectedItems, item]);
        }

    };

    const handleRemoveItem = async (itemId) => {
        try {
            await axios.delete('http://localhost:8080/backend/api/Customer/remove_cart_item.php', {
                data: {
                    customer_id: userID, // Pass customer ID
                    item_id: itemId      // Pass item ID
                }
            });
            setItems(Items.filter((item) => item.id !== itemId));
        } catch (error) {
            console.error("Error removing item:", error);
        }
    };

    return (
        <div className="cart-items-container cart-items-card">
            <div className="cart-header">
                <div className="cart-title">
                    <h5><b>CART ITEMS</b></h5>
                </div>
                <div className="cart-action">
                    <div
                        className={`place-order-btn ${selectedItems.length > 0 ? "" : "disabled"}`}
                        aria-disabled={!selectedItems.length}
                        onClick={handlePlaceOrder}
                    >Place Order</div>
                </div>
            </div>
            <div className="cart-body">
                <table className="cart-table">
                    <thead>
                        <tr>
                            <th>Select</th>
                            <th>Product</th>
                            <th>Product Name</th>
                            <th>Price per Product</th>
                            <th>Quantity</th>
                            <th>Total Price</th>
                            <th>Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Items.map((Item, index) => (
                            <tr key={index} className="cart-item-row">
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.some((selected) => selected.id === Item.id)}
                                        onChange={() => toggleItemSelection(Item)}
                                        className='item-checkbox'
                                    />
                                </td>
                                <td style={{width:'30%'}}><img src={Item.product_image} className='product-image' style={{width:'60%'}}/></td>
                                <td className='product-name' style={{fontSize:'130%'}}>{Item.product_name}</td>
                                <td>{Item.price}</td>
                                <td>
                                    <label className="quantity-label"></label>
                                    <input
                                        type="number"
                                        value={Item.quantity}
                                        min='1'
                                        className='quantity-input'
                                        onChange={(e) => {
                                            const newQuantity = e.target.value;
                                            handleQuantityChange(index, newQuantity);
                                            updateCartQuantity(Item);
                                        }}
                                        placeholder="1" // Optional placeholder
                                    />
                                </td>

                                <td>{Item.price * Item.quantity}.00</td>
                                <td>
                                    <button className="remove-button" onClick={() => handleRemoveItem(Item.id)}>Remove</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Invoice Modal */}
            <Modal show={showInvoiceModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Your Order</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p style={{fontSize:'130%'}}> Are you sure you want to confirm this order?</p>
                    <table className="invoice-table" bordered>
                        <thead>
                            <tr style={{fontSize:'130%'}}>
                                <th>Product Name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedItems.map((item, index) => (
                                <tr key={index} className='c-table-tdata'>
                                    <td>{item.product_name}</td>
                                    <td>{item.price}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.price * item.quantity}.00</td>
                                </tr>
                            ))}
                            <tr id='tm'>
                                <td colSpan={3} className="total-amount-cell"><strong>Total Amount:</strong></td>
                                <td className='total-amount'>{totalAmount}</td>
                            </tr>
                        </tbody>
                    </table>
                </Modal.Body>
                <Modal.Footer>
                    <button className="cancel-button" onClick={handleCloseModal}>Cancel</button>
                    <button className="confirm-button" onClick={handleProceedToPayment}>Confirm</button>
                </Modal.Footer>
            </Modal>
        </div>

    )
}

export default CartItems;
