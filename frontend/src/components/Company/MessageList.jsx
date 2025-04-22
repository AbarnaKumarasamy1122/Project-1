import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
import {  FaSearch } from 'react-icons/fa';

const MessageList = () => {
  const { user } = useOutletContext();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredMessage, setFilteredMessage] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); 

  useEffect(() => {
    fetchMessageData();
  }, [user.companyOwnerID]);

  const fetchMessageData = async () => {
    setLoading(true); // Start loading
    try {
      if (user) {
        const response = await axios.post(
          "http://localhost:8080/backend/api/Company/Message/message_list.php",
          {
            companyOwnerID: user.companyOwnerID,
          }
        );
        if (Array.isArray(response.data)) {
          setMessages(response.data);
          setFilteredMessage(response.data);
        } else {
          setError("Error fetching messages: Invalid response format");
        }
      }
    } catch (error) {
      setError(
        error.response
      );
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const markAsRead = async (contactID) => {
    try {
      // Send POST request to mark the message as read
      const response = await axios.post(
        "http://localhost:8080/backend/api/Company/Message/markAsRead.php",
        {
          contactID: contactID, 
        }
      );

    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value === '') {
      setFilteredMessage(messages); // Show all products if search is empty
    } else {
      const filtered = messages.filter((message) =>
        message.customerName.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setFilteredMessage(filtered);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <div className="maincontainer">
       <div className="table_heading">
      <h1 className="text-center my-3">Message Details</h1>
       {/* Search bar and icon */}
       <div className="search_container">
          <input
            type="text"
            placeholder="Search by Customer name"
            value={searchTerm}
            onChange={handleSearch}
            className="search_input"
          />
          <FaSearch className="search_icon" />
        </div>
      </div>
      {filteredMessage.length > 0 ? (
      <div className="container">
        <div className="row">
        {filteredMessage.map((message) => (
            <div className="col-md-6 mb-2 mt-3" key={message.contactID}>
              <div className="card h-100">
              <div className="card-color">
                <div className="thumbnail">
                  {/* Optional: Add an image here if needed */}
                </div>
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-center">
                    {message.customerName}
                  </h5>
                  <p className="card-text text-end">
                    Date : {new Date(message.date).toLocaleDateString()}
                  </p>
                  <p className="card-text">Email : {message.email}</p>
                  <p className="card-text">
                    Message:{" "}
                    {message.message.split(" ").slice(0, 6).join(" ") +
                      (message.message.split(" ").length > 6 ? "....." : "")}
                  </p>
                  <Link
                     to={`/company/messageDetail/${message.contactID}`}
                     className={`btn mt-auto w-40 ml-auto ${
                       message.isRead ? "btn-danger" : "btn-success"
                     }`} 
                     style={{ marginLeft: "auto" }}
                     onClick={() => markAsRead(message.contactID)} 
                   >
                    { message.isRead ? "Viewed" : "Read more" }
                  </Link>
                </div>
              </div>
              </div>
            </div>
          ))}
        </div>
      </div>
       ) : (
        <div className="empty_text">No Messages Available</div>
      )}
      </div> 
    </div>
  );
};

export default MessageList;
