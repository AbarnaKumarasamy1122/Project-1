import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaEdit, FaSearch } from 'react-icons/fa'; // Add FaSearch for the search icon
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';

const ViewProducts = () => {
  const { user } = useOutletContext(); // assuming user context contains companyOwnerID
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); // For storing filtered products
  const [searchTerm, setSearchTerm] = useState(''); // To store the search term
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if(user){
        const response = await axios.post('http://localhost:8080/backend/api/Company/view_product.php', {
          companyOwnerID: user.companyOwnerID,
        });

        if (Array.isArray(response.data)) {
          setProducts(response.data);
          setFilteredProducts(response.data); // Initially show all products
        } else {
          setError('Invalid response format');
        }
      }
      } catch (error) {
        setError('Error fetching products');
      }
    };

    fetchProducts();
  }, [user.companyOwnerID]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value === '') {
      setFilteredProducts(products); // Show all products if search is empty
    } else {
      const filtered = products.filter((product) =>
        product.productName.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  const handleDelete = async (productID) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await axios.get(`http://localhost:8080/backend/api/Company/delete_product.php?delete=${productID}`);

        if (response.data.success) {
          setProducts(products.filter(product => product.productID !== productID));
          setFilteredProducts(filteredProducts.filter(product => product.productID !== productID));
        } else {
          console.error('Error deleting product:', response.data.error);
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="maincontainer">
      <div className="table_heading">
        <h3>Product details</h3>
        {/* Search bar and icon */}
        <div className="search_container">
          <input
            type="text"
            placeholder="Search by product name"
            value={searchTerm}
            onChange={handleSearch}
            className="search_input"
          />
          <FaSearch className="search_icon" />
        </div>
      </div>
      <section className="display_details">
        {filteredProducts.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>S No</th>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Netweight</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <tr key={product.productID}>
                  <td>{index + 1}</td>
                  <td className='col-1'><img src={product.productImage} alt={product.productName} style={{ width: '70px', height: '70px' }} 
                  /></td>
                  <td>{product.productName}</td>
                  <td>{product.productPrice}</td>
                  <td>{product.productQuantity}</td>
                  <td>{product.productNetweight}</td>
                  <td>
                    <button className="delete_product_btn" onClick={() => handleDelete(product.productID)}><FaTrash /></button>
                    <Link className="update_product_btn" to={`/company/update/${product.productID}`}><FaEdit /></Link>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', fontWeight: 'bold' }}>
                  Total Products: {filteredProducts.length}
                </td>
              </tr>
            </tfoot>
          </table>
        ) : (
          <div className="empty_text">No Products Available</div>
        )}
      </section>
    </div>
  );
};

export default ViewProducts;
