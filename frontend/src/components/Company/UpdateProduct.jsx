import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { BiImageAdd } from "react-icons/bi";
import { GiWeight } from "react-icons/gi";

const UpdateProduct = () => {
  const { productID } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    productName: "",
    productPrice: "",
    productQuantity: "",
    productNetweight: "",
    productImage: "",
  });
  const [image, setImage] = useState(null);
  const [imagepath, setImagePath] = useState("");
  const [message, setMessage] = useState("");
  const hiddenFileInput = useRef(null);

  useEffect(() => {
    axios
      .get(
        `http://localhost:8080/backend/api/Company/view_product.php?product_id=${productID}`
      )
      .then((response) => {
        if (response.data) {
          setProduct({
            productName: response.data.productName || "",
            productPrice: response.data.productPrice || "",
            productQuantity: response.data.productQuantity || "",
            productNetweight: response.data.productNetweight || "",
            productImage: response.data.productImage || "",
          });
          setImagePath(response.data.productImage || "");
        } else {
          console.error("Product not found");
        }
      })
      .catch((error) => console.error("Error fetching product:", error));
  }, [productID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImagePath(URL.createObjectURL(file));
    setImage(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("update_product_id", productID);
    formData.append("update_product_name", product.productName);
    formData.append("update_product_price", product.productPrice);
    formData.append("update_product_quantity", product.productQuantity);
    formData.append("update_product_netweight", product.productNetweight);
    formData.append("image", image);
    formData.append("imagePath", imagepath);

    axios
      .post(
        "http://localhost:8080/backend/api/Company/update_product.php",
        formData
      )
      .then((response) => {
        console.log("update : ", response.data);
        setMessage(response.data.message);
        setTimeout(() => {
          navigate("/Company/display-product");
        }, 2000);
      })
      .catch((error) => {
        setMessage("Error updating product.");
        console.error("Error updating product:", error);
      });
  };

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  return (
    <div>
      {message && <div className="display_message">{message}</div>}
      {productID && (
        <div className="edit_container">
          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="update_product product_container_box"
          >
            <div className="d-flex justify-content-center align-items-center w-100">
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt="upload image"
                  className="rounded-circle img-fluid"
                  style={{
                    Width: "250px",
                    height: "auto",
                    objectFit: "cover",
                  }} // Ensures responsive image sizing
                />
              ) : product.productImage ? (
                <img
                  src={product.productImage}
                  alt="product image"
                  className="rounded-circle img-fluid"
                  style={{
                    maxWidth: "200px",
                    height: "auto",
                    objectFit: "cover",
                  }} // Ensures responsive image sizing
                />
              ) : (
                <BiImageAdd
                  className="w-50 h-auto ps-2 rounded bg-white"
                  style={{ fontSize: "130px", color: "#ccc" }} // Centered and styled placeholder
                />
              )}
            </div>

            <input type="hidden" name="update_product_id" value={productID} />
            <input
              type="hidden"
              name="current_product_image"
              value={product.productImage}
            />
            <input
              type="text"
              className="input_fields fields"
              name="productName"
              value={product.productName}
              onChange={handleChange}
              required
            />
            <div className="input_fields fields price_container">
              <span className="currency_label"> Rs.</span>
              <input
                type="number"
                name="productPrice"
                value={product.productPrice}
                onChange={handleChange}
                required
              />
            </div>
            <input
              type="number"
              className="input_fields fields"
              name="productQuantity"
              value={product.productQuantity}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              className="input_fields fields"
              name="productNetweight"
              value={product.productNetweight}
              onChange={handleChange}
              required
            />
            <input
              type="file"
              className="input_fields form-control"
              ref={hiddenFileInput}
              onChange={handleFileChange}
            />
            <div className="btns">
              <input
                type="submit"
                className="edit_btn"
                value="Update Product"
                name="update_product"
              />
              <Link className="cancel_btn" to={"/company/display-product"}>
                Cancel
              </Link>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default UpdateProduct;
