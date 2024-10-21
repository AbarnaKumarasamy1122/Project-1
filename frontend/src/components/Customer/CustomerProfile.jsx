import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { FaCircleUser } from "react-icons/fa6";
import { useOutletContext } from 'react-router-dom';
import './CustomerProfile.css'; // Import the CSS file

function CustomerProfile() {
  const { user } = useOutletContext();
  const [image, setImage] = useState(null);
  const imagepath = user.image;
  const [edit, setEdit] = useState(false);
  const [email, setEmail] = useState();
  const [number, setNumber] = useState();
  const [address, setAddress] = useState();

  const hiddenFileInput = useRef(null);

  useEffect(() => {
    if (!email) {
      setEmail(user.email);
    }
    if (!number) {
      setNumber(user.customerContactNumber);
    }
    if (!address) {
      setAddress(user.customerAddress);
    }
  }, [edit, email, number, address, user]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const imgname = event.target.files[0].name;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxSize = Math.max(img.width, img.height);
        canvas.width = maxSize;
        canvas.height = maxSize;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(
          img,
          (maxSize - img.width) / 2,
          (maxSize - img.height) / 2
        );
        canvas.toBlob(
          (blob) => {
            const file = new File([blob], imgname, {
              type: "image/png",
              lastModified: Date.now(),
            });
            setImage(file);
          },
          "image/jpeg",
          0.8
        );
      };
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user_id = user.customerID;
    try {
      const response = await axios.post('http://localhost:8080/backend/api/customer/update_profile.php', { email, address, number, image, user_id }, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if(response.data){
        setEdit(false);
      }
    } catch (error) {
      console.error('There was an error updating the profile!', error);
    }
  };

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  return (
    <div className="customer-profile">
      {!edit && (
        <div className="profile-display">
          <div className="profile-image">
            {image ? (
              <img src={URL.createObjectURL(image)} alt="Upload" className="profile-pic" />
            ) : (
              imagepath ? (
                <img src={imagepath} alt="Profile" className="profile-pic" />
              ) : (
                <FaCircleUser className="default-pic" />
              )
            )}
          </div>
          <div className="profile-info">
            <div className="info-item"><strong>Name:</strong> {user.customerName}</div>
            <div className="info-item"><strong>Shop Name:</strong> {user.customerShopName}</div>
            <div className="info-item"><strong>Email:</strong> {user.email}</div>
            <div className="info-item"><strong>Mobile Number:</strong> {user.customerContactNumber}</div>
            <div className="info-item"><strong>District:</strong> {user.customerDistrict}</div>
            <div className="info-item"><strong>Address:</strong> {user.customerAddress}</div>
            <button className="edit-button" onClick={() => setEdit(true)}>Edit</button>
          </div>
        </div>
      )}
      {edit && (
        <form className="profile-edit" onSubmit={handleSubmit}>
          <div className="profile-image-edit">
            {image ? (
              <img src={URL.createObjectURL(image)} alt="Upload" className="profile-pic" />
            ) : (
              imagepath ? (
                <img src={imagepath} alt="Profile" className="profile-pic" />
              ) : (
                <FaCircleUser className="default-pic" />
              )
            )}
            <input
              type="file"
              onChange={handleImageChange}
              ref={hiddenFileInput}
              style={{ display: "none" }}
            />
            <button type="button" className="choose-file-button" onClick={handleClick}>Choose File</button>
          </div>
          <div className="cu-form-group">
            <label>Customer Name</label>
            <input type="text" disabled value={user.customerName} />
          </div>
          <div className="cu-form-group">
            <label>Shop Name</label>
            <input type="text" disabled value={user.customerShopName} />
          </div>
          <div className="cu-form-group">
            <label>Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="cu-form-group">
            <label>Mobile Number</label>
            <input type="number" value={number} onChange={(e) => setNumber(e.target.value)} />
          </div>
          <div className="cu-form-group">
            <label>District</label>
            <select value={user.customerDistrict} disabled>
              <option value="1">Jaffna</option>
              <option value="2">Kilinochchi</option>
              <option value="3">Mullaitivu</option>
              <option value="4">Mannar</option>
              <option value="5">Vavuniya</option>
            </select>
          </div>
          <div className="cu-form-group">
            <label>Address</label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
          <button type="submit" className="save-button">Save</button>
        </form>
      )}
    </div>
  );
}

export default CustomerProfile;
