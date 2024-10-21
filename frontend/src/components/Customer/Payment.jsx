import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./payment.css";
import axios from 'axios';

function PaymentPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { invoice, totalAmount , customer_id} = location.state; // Retrieve invoice and total amount from CartItems

    const [paymentMethod, setPaymentMethod] = useState('');
    const [paymentError, setPaymentError] = useState('');
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        expiryDate: null,  // Store Date object, null as initial value
        cvv: ''
    });

    const formatCardNumber = (number) => {
        return number.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
    };
    console.log("payment:",invoice);
    // Handle form input changes for card details
    const handleCardInputChange = (e) => {
        const { name, value } = e.target;
        setCardDetails((prevDetails) => ({
            ...prevDetails,
            [name]: name === 'cardNumber' ? formatCardNumber(value) : value // Format only the card number
        }));
    };

    const handleExpiryDateChange = (date) => {
        setCardDetails((prevDetails) => ({
            ...prevDetails,
            expiryDate: date  // Store the selected date
        }));
    };

    // Handle payment submission
    const handlePayment = async () => {
        if (!paymentMethod) {
            setPaymentError('Please select a payment method.');
            return;
        }
    
        if (paymentMethod === 'credit_card') {
            // Validate card details
            if (!cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv) {
                setPaymentError('Please enter all credit card details.');
                return;
            }
        }
    
        setPaymentError('');
    
        // Simulate payment process, then navigate to a success page
        console.log('Proceeding with payment method:', paymentMethod);
        console.log('Proceeding with payment method:', totalAmount);
        console.log('Proceeding with payment method:', invoice.orderID);
    
        try {
            // Adding `await` to wait for the response
            const response = await axios.post('http://localhost:8080/backend/api/Customer/payment.php', {
                invoiceID: invoice.invoiceID,
                paymentMethod: paymentMethod,
                total: totalAmount
            });
            
            const data = response.data;
            console.log("data payment", data);  
    
            if (data.success) {
                console.log(data);
                navigate('/customer/OrderSuccess', {
                    state: {
                        invoice,
                        totalAmount,
                        paymentMethod,
                        cardDetails,
                        customer_id
                    }
                });
            } else {
                setPaymentError('Payment failed. Please try again.');
            }
    
        } catch (error) {
            console.error("Error in the payment process", error);
            setPaymentError('There was an issue processing your payment. Please try again.');
        }
    };
    
    

    return (
        <div className="payment-container">
            <h2 className="payment-title">Payment Page</h2>

            <div className="payment-card">
                <div className="payment-card-body">
                    <h5 className="payment-info"><strong>Invoice ID:</strong> {invoice.invoiceID}</h5>
                    <h5 className="payment-info"><strong>Total Amount:</strong> Rs. {totalAmount}</h5>

                    {/* Payment Method Selection */}
                    <div className="payment-method">
                        <h4 className="payment-method-title">Select Payment Method:</h4>
                        <div>
                            <input 
                                type="radio"
                                id="credit-card-option"
                                name="paymentMethod"
                                value="credit_card"
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <label htmlFor="credit-card-option">Credit Card</label>
                        </div>
                        <div>
                            <input 
                                type="radio"
                                id="cod-option"
                                name="paymentMethod"
                                value="cash_on_delivery"
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <label htmlFor="cod-option">Cash on Delivery</label>
                        </div>

                        {/* Show card details form if Credit Card is selected */}
                        {paymentMethod === 'credit_card' && (
                            <div className="payment-credit-card-form">
                                <h5 className="credit-card-form-title">Enter Credit Card Details:</h5>

                                <div className="payment-form-group">
                                    <label htmlFor="cardNumber">Card Number</label>
                                    <input
                                        type="text"
                                        id="cardNumber"
                                        name="cardNumber"
                                        placeholder="xxxx xxxx xxxx xxxx"
                                        maxLength="19"  // 16 digits + 3 spaces
                                        value={cardDetails.cardNumber}  // Use cardNumber from state
                                        onChange={handleCardInputChange}
                                        className="payment-card-input"
                                    />
                                </div>

                                <div className="payment-form-group">
                                    <label htmlFor="expiryDate">Expiry Date</label>
                                    <DatePicker
                                        id="expiryDate"
                                        selected={cardDetails.expiryDate}  // Use expiryDate from state
                                        onChange={handleExpiryDateChange}  // Handler for date change
                                        dateFormat="MM/yyyy"
                                        showMonthYearPicker  // Month and Year picker
                                        className="payment-card-input"
                                        placeholderText="MM/YYYY"
                                    />
                                </div>

                                <div className="payment-form-group">
                                    <label htmlFor="cvv">CVV</label>
                                    <input
                                        type="text"
                                        id="cvv"
                                        name="cvv"
                                        placeholder="Enter CVV"
                                        maxLength="3"
                                        value={cardDetails.cvv}  // Use cvv from state
                                        onChange={handleCardInputChange}
                                        className="payment-card-input"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Display error if no payment method is selected */}
                        {paymentError && <p className="payment-error">{paymentError}</p>}
                    </div>

                    {/* Proceed to Payment Button */}
                    <div className="payment-button-container">
                        <button className="payment-button" onClick={handlePayment}>
                            Proceed to Pay
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaymentPage;
