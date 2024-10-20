
import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useOutletContext} from 'react-router-dom';
import './reviewStyle.css'; 

const ReviewModal = ({ show, onHide, onSubmit, onRatingChange }) => {
    const { user } = useOutletContext();
    const [userMessage, setUserMessage] = useState('');
    const [rating, setRating] = useState(0);

    const handleRatingChange = (ratingValue) => {
        setRating(ratingValue);
        onRatingChange(ratingValue);
    };

    const handleSubmit = () => {
        if (rating === 0) {
            alert('Please select at least one star for your rating.');
            return; 
        }
        if (userMessage.trim() === '') {
            alert('Feedback is required. Please enter your feedback.');
            return;
        }
        
        onSubmit(userMessage);  
        setUserMessage(''); 
        setRating(0);
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton className="modal-header-custom">
                <Modal.Title className="modal-title-custom">Write your Review</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center modal-body-custom">
                <h4 className="rating-stars-custom">
                    {[...Array(5)].map((star, index) => (
                        <i
                            key={index}
                            className={`fa fa-star star-light submit_star mr-1 ${index < rating ? 'text-warning' : ''}`}
                            onMouseEnter={() => handleRatingChange(index + 1)}
                            onClick={() => handleRatingChange(index + 1)}
                        ></i>
                    ))}
                </h4>
               
                <Form.Group className="form-group-custom">
                    <Form.Control
                        type="text"
                        placeholder="Enter Name"
                        value={user.customerName}
                        readOnly
                    />
                </Form.Group>
                <Form.Group className="form-group-custom">
                    <Form.Control
                        as="textarea"
                        placeholder="Enter your feedback"
                        value={userMessage}
                        onChange={(e) => setUserMessage(e.target.value)}
                        className="feedback-input-custom"
                    />
                </Form.Group>
                <Button className="btn-primary submit-btn-custom" onClick={handleSubmit}>Submit</Button>
            </Modal.Body>
        </Modal>
    );
};

export default ReviewModal;
