import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import './ProductList.css'; // Import your custom CSS file for styles

function ProductList({ sidebarToggle }) {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [userID] = useState(JSON.parse(sessionStorage.getItem('userID')));
  const [addedToCart, setAddedToCart] = useState({});
  const navigate = useNavigate();


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:8080/backend/api/Customer/products.php');
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const checkCartItems = async () => {
      try {
        const response = await axios.get('http://localhost:8080/backend/api/Customer/check_cart_item.php', {
          params: { customer_id: userID },
        });
        const cartItems = response.data.reduce((acc, item) => {
          acc[item.product_id] = true;
          return acc;
        }, {});
        setAddedToCart(cartItems);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchProducts();
    checkCartItems();
  }, [navigate]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const addToCart = async (product) => {
    if (!addedToCart[product.productID]) {
      try {
        const response = await axios.post('http://localhost:8080/backend/api/Customer/add_cart_item.php', {
          customer_id: userID,
          product_id: product.productID,
          price: product.productPrice,
          name: product.productName,
          image: product.productImage
        });
        if (response.data) {
          setAddedToCart((prev) => ({ ...prev, [product.productID]: true }));
          alert("Product successfully added to cart.");
        }
      } catch (error) {
        console.error("There was an error adding the product to the cart:", error);
      }
    } else {
      alert("Item is already added to the cart!");
    }
  };

  const filteredItems = products.filter(product =>
    product.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`d-flex`}>
      <div className={`${sidebarToggle ? "ml-25" : "w-full"} z-0 card d-flex`}>
        <div className='card-header align-items-center justify-content-between d-flex'>
          <div className="row align-items-center d-flex">
            <div className="d-flex mt-2"><h4><b>Product List</b></h4></div>
          </div>
          <div className='d-flex align-items-end mb-2'>
            <div className='position-relative align-items-center'>
              <span className='ms-0 sm-relative md-absolute align-items-center bg-success rounded'>
                <button className='btn btn-none d-flex align-items-center h-10'><FaSearch className='text-dark m-auto' /></button>
              </span>
              <input type='text' className='rounded focus-outline-none w-full h-10 ps-5 px-4 d-none d-md-block bg-dark text-white'
                value={searchQuery}
                onChange={handleSearch} />
            </div>
          </div>
        </div>

        <div className='container'>
          <div className='row cursor-pointer'>
            {filteredItems.map((product, index) => (
              <div className="col-md-3 col-sm-4 col-6" key={index}>
                <div className="card my-3 product-card">
                  <img src={product.productImage} className="card-img-top" alt="Product" />
                  <div className="card-body">
                    <h5 className="card-title">{product.productName}</h5>
                    <h6 className='card-title rounded fw-bold'>Rs. {product.productPrice}.00</h6>
                    <button
                      className={`btn ${addedToCart[product.productID]? 'btn-secondary' : 'btn-danger'} rounded-pill md-w-75 sm-w-75 xs-w-100 mb-2`}
                      onClick={() => addToCart(product)}
                    >
                      {addedToCart[product.productID] ? 'Added to Cart' : 'Add to Cart'}
                    </button>
                    
                    <Link to={`/customer/review-layout/${product.productID}`} className='btn btn-dark rounded-pill md-w-75 sm-w-75 xs-w-100 mt-3'>
                      View Reviews
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductList;

// import React, { useEffect, useState } from 'react';
// import { Link, useOutletContext } from 'react-router-dom';
// import axios from 'axios';
// import { FaSearch, FaUserCircle } from 'react-icons/fa';


// function ProductList({ sidebarToggle, setSidebarToggle }) {
//   const [products, setProducts] = useState([]);
//   const [selectedProduct, setSelectedProduct] = useState();
//   const [searchQuery, setSearchQuery] = useState('');
//   // const { searchQuery } = useOutletContext();

//   const onProductClick = (product) => {
//     setSelectedProduct(product);
//   };

//   useEffect(() => {
//     axios.get('http://localhost:8080/backend/api/Customer/products.php')
//       .then((res) => {
//         setProducts(res.data);
//       });
//   }, []);
//   const filteredItems = products.filter(product =>
//     product.productName.toLowerCase().includes(searchQuery.toLowerCase())
//   );
//   const handleSearch = (event) => {
//     setSearchQuery(event.target.value);
//   };
//   return (
//     <div className={`d-flex`}>
//       <div className={`${sidebarToggle ? "ml-25" : "w-full"} z-0 card d-flex`}>
//         <div className='card-header align-items-center justify-content-between d-flex'>
//           <div className="row align-items-center  d-flex">
//             <div className="d-flex mt-2"><h4><b>Product List</b></h4>
//             </div>
//           </div>
//           <div className='d-flex align-items-end mb-2'>
//                 <div className={` position-relative align-items-center  `}>
//                   <span className='ms-0 sm-relative md-absolute  align-items-center bg-success rounded '>
//                     <button className='btn btn-none d-flex align-items-center  h-10' ><FaSearch className='text-dark m-auto' /></button></span>
//                   <input type='text' className='rounded focus-outline-none w-full h-10 ps-5 px-4  d-none d-md-block bg-dark text-white'
//                     value={searchQuery}
//                     onChange={handleSearch} />
//                 </div>
//                 {/* <Link to='/customer/profile' className='text-decoration-none text-white'><div className='  d-flex ms-2 align-items-center cursor-pointer'><FaUserCircle style={{ height: '20px', width: '20px' }} /><span className='px-1 d-none d-md-block d-flex' onClick={(e) => setSearch(false)}>Profile</span></div></Link> */}
//               </div>
//         </div>
//         {/* <ProductDetail product={selectedProduct} className='d-none'/> */}
//         <div className='container'>
//           {/* <input type="text"  value={searchQuery}/> */}
//           {filteredItems ? (
//             <div className='row cursor-pointer' >
//               {filteredItems.map((product, index) => (
//                 <div className="col-md-3 col-sm-4 col-6" key={index}>
//                   <Link to={{ pathname: "/customer/productDetail" }}
//                     state={{ product }}
//                     onClick={() => onProductClick(product)}>
//                     <div className="card my-3">
//                       <img src={product.productImage} className="card-img-top" alt="Product Image" />
//                       <div className="card-body">
//                         <h5 className="card-title">{product.productName}</h5>
//                         <h6 className='card-title rounded fw-bold'>Rs. {product.productPrice}.00</h6>
//                       </div>
//                     </div>
//                   </Link>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className='row cursor-pointer' >
//               {products.map((product, index) => (
//                 <div className="col-md-3 col-sm-4 col-6" key={index}>
//                   <Link to={{ pathname: "/customer/productDetail" }}
//                     state={{ product }}
//                     onClick={() => onProductClick(product)}>
//                     <div className="card my-3">
//                       <img src={product.productImage} className="card-img-top" alt="Product Image" />
//                       <div className="card-body">
//                         <h5 className="card-title">{product.productName}</h5>
//                         <h6 className='card-title rounded fw-bold'>Rs. {product.productPrice}.00</h6>
//                       </div>
//                     </div>
//                   </Link>
//                 </div>
//               ))}
//             </div>
//           )};
//           {/* <div className='row cursor-pointer' >
//             {products.map((product, index) => (
//               <div className="col-md-3 col-sm-4 col-6" key={index}>
//                 <Link to={{ pathname: "/customer/productDetail" }}
//                   state={{ product }} 
//                   onClick={() => onProductClick(product)}>
//                   <div className="card my-3">
//                     <img src={product.productImage} className="card-img-top" alt="Product Image" />
//                     <div className="card-body">
//                       <h5 className="card-title">{product.productName}</h5>
//                       <h6 className='card-title rounded fw-bold'>Rs. {product.productPrice}.00</h6> 
//                     </div>
//                   </div>
//                 </Link>
//               </div>
//             ))}
//           </div> */}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ProductList;
