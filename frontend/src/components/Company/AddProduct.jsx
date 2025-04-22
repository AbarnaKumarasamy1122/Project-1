import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaRegTimesCircle } from "react-icons/fa";
import { BiImageAdd } from "react-icons/bi";
import { useOutletContext } from 'react-router-dom';

function AddProduct() {
    const { user } = useOutletContext();
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [image, setImage] = useState(null);
    const [quantity, setQuantity] = useState('');
    const [productCategory, setProductCategory] = useState('');
    const [netWeight, setNetWeight] = useState('');
    const [productNameError, setProductNameError] = useState('');
    const [productPriceError, setProductPriceError] = useState('');
    const [productImageError, setProductImageError] = useState('');
    const [quantityError, setQuantityError] = useState('');
    const [productCategoryError, setProductCategoryError] = useState('');
    const [netWeightError, setNetWeightError] = useState('');
    const [message, setMessage] = useState('');
    const [isMessageVisible, setIsMessageVisible] = useState(false);
    const fileInputRef = useRef(null);

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
    
                console.log(file);
                setImage(file);
              },
              "image/jpeg",
              0.8
            );
          };
        };
      };

    useEffect(() => {
        if (productName.trim()) {
            setProductNameError('');
        }
    }, [productName]);

    useEffect(() => {
        if (productPrice.trim()) {
            setProductPriceError('');
        }
    }, [productPrice]);

    useEffect(() => {
        if (image) {
            setProductImageError('');
        }
    }, [image]);

    useEffect(() => {
        if (quantity.trim()) {
            setQuantityError('');
        }
    }, [quantity]);

    useEffect(() => {
        if (productCategory.trim()) {
            setProductCategoryError('');
        }
    }, [productCategory]);

    useEffect(() => {
        if (netWeight.trim()) {
            setNetWeightError('');
        }
    }, [netWeight]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setProductNameError('');
        setProductPriceError('');
        setProductImageError('');
        setQuantityError('');
        setProductCategoryError('');
        setNetWeightError('');

        let formValid = true;

        if (!productName.trim()) {
            setProductNameError('Product name is required');
            formValid = false;
        } else if (!productPrice.trim()) {
            setProductPriceError('Product price is required');
            formValid = false;
        } else if (!image) {
            setProductImageError('Product image is required');
            formValid = false;
        } else if (!quantity.trim()) {
            setQuantityError('Product quantity is required');
            formValid = false;
        } else if (!productCategory.trim()) {
            setProductCategoryError('Product category is required');
            formValid = false;
        } else if (!netWeight.trim()) {
            setNetWeightError('Product net weight is required');
            formValid = false;
        }

        if (!formValid) {
            setMessage('Invalid input. Please check.');
            setIsMessageVisible(true);
            setTimeout(() => {
                setIsMessageVisible(false);
            }, 5000);
            return;
        }

        const formData = new FormData();
        formData.append('companyOwnerID', user.companyOwnerID); // Add company owner ID to form data
        formData.append('product_name', productName);
        formData.append('product_price', productPrice);
        formData.append('product_image', image);
        formData.append('quantity', quantity);
        formData.append('product_category', productCategory);
        formData.append('net_weight', netWeight);

        try {
            const response = await axios.post('http://localhost:8080/backend/api/Company/add_product.php', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setMessage(response.data.message);
            setIsMessageVisible(true);
            setProductName('');
            setProductPrice('');
            setImage(null);
            setQuantity('');
            setProductCategory('');
            setNetWeight('');
            fileInputRef.current.value = '';
            if(response){
               // alert("product added Successfully..!");
            }
            setTimeout(() => {
                setIsMessageVisible(false);
            }, 5000);
        } catch (error) {
            console.error('Error:', error);
            setMessage('Failed to add product. Please try again later.');
            setIsMessageVisible(true);

            setTimeout(() => {
                setIsMessageVisible(false);
            }, 5000);
        }
    };

    const handleCloseMessage = () => {
        setIsMessageVisible(false);
    };

    return (
        <div className="add-container rounded mt-5 w-75">
            {isMessageVisible && message && (
                <div className="display_message">
                    {message}
                    <FaRegTimesCircle onClick={handleCloseMessage} />
                </div>
            )}
            <h3 className="heading">Add Products</h3>
            <form onSubmit={handleSubmit} className="add_product justify-content-center">
                <div className='d-flex justify-content-center w-32 h-32 m-auto bg-dark p-1 rounded'>
                    {image ? (
                        <img src={URL.createObjectURL(image)} alt="upload image" className="w-100 h-100 rounded align-items-center justify-content-center" />
                    ) : (
                        <BiImageAdd className="w-100 h-100 ps-2 rounded bg-white" />
                    )}
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        className="input_fields form-control"
                        placeholder="Enter product name"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                    />
                    {productNameError && <div className="error_message">{productNameError}</div>}
                </div>
                <div className="form-group">
                    <input
                        type="number"
                        className="input_fields form-control"
                        placeholder="Enter product price"
                        value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value)}
                    />
                    {productPriceError && <div className="error_message">{productPriceError}</div>}
                </div>
                <div className="form-group">
                    <input
                        type="number"
                        className="input_fields form-control"
                        placeholder="Enter product quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                    />
                    {quantityError && <div className="error_message">{quantityError}</div>}
                </div>
                <div className="form-group">
                    <select
                        className="input_fields form-control"
                        value={productCategory}
                        onChange={(e) => setProductCategory(e.target.value)}
                    >
                        <option value="">Select Product Category</option>
                        <option value="Soap & Washing powders">Soap & Washing powders</option>
                        <option value="Milk powder & Tea Powder">Milk powder & Tea Powder</option>
                        <option value="Soft Drinks">Soft Drinks</option>
                        <option value="Flour">Flour</option>
                        <option value="Chocolates">Chocolates</option>
                        <option value="Biscuits">Biscuits</option>
                        <option value="Rice and Grains">Rice and Grains</option>
                        <option value="Oil">Oil</option>
                        <option value="Stationary items">Stationary items</option>
                        <option value="Cosmetic Items">Cosmetic Items</option>
                        <option value="Baby products">Baby products</option>
                        <option value="Noodles">Noodles</option>
                    </select>
                    {productCategoryError && <div className="error_message">{productCategoryError}</div>}
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        className="input_fields form-control"
                        placeholder="Enter product net weight"
                        value={netWeight}
                        onChange={(e) => setNetWeight(e.target.value)}
                    />
                    {netWeightError && <div className="error_message">{netWeightError}</div>}
                </div>
                <div className="form-group">
                    <input
                        type="file"
                        className="input_fields form-control"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                    />
                    {productImageError && <div className="error_message">{productImageError}</div>}
                </div>

                <button type="submit" className="submit_btn">Add Product</button>
            </form>
        </div>
    );
}

export default AddProduct;
