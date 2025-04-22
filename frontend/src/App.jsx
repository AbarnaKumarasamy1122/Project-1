import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import "./components/Company/CompanyApp.css";
import "./components/Company/CompanyProduct.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Ensure Router is imported
import Header from './components/Home/Header'
// import { Sidebar } from './components/Customer/Sidebar'
import CustomerProfile from './components/Customer/CustomerProfile';

import ProuductList from './components/Customer/ProuductList';
import ProductDetail from './components/Customer/ProductDetail';

// import { BrowserRouter as Router,Routes, Route} from 'react-router-dom'; // Ensure Router is imported
// import 'bootstrap/dist/css/bootstrap.min.css';
import AddProduct from './components/Company/AddProduct';
import UpdateProduct from './components/Company/UpdateProduct';
import ViewProducts from './components/Company/ViewProducts';
// import { CompanyDashboard } from './components/Company/CompanyDashboard';
import Customer from './components/Company/Customer';
import Order from './components/Company/Order';
import { CompanyDashboard } from './components/Company/CompanyDashbord';
import Review from './components/Company/review/Review';
import ReviewLayout from './components/Company/review/ReviewLayout';
import Dash from './components/Admin/Dash';
import CompanyLayout from './components/Company/CompanyLayout';
import Customerdetails from './components/Admin/Customerdetails';
import Companydetails from './components/Admin/Companydetails';
import CompanyProfile from './components/Company/CompanyProfile';
import MessageList from './components/Company/MessageList';
import MessageDetail  from './components/Company/MessageDetail';

import Contactus from './components/Admin/Contactus';
import Aboutus from './components/Admin/Aboutus';
import { Home } from './components/Home/Home';
import { Login } from './components/Home/Login';
import OTP from './components/Home/OTP';
import AdminLayout from './components/Admin/AdminLayout';
import AdminOrder from './components/Admin/Order';
import CustomerLayout from './components/Customer/CustomerLayout';
import CartItems from './components/Customer/CartItems';
// import PlaceOrder from './components/Customer/PlaceOrder';
import { Faqs } from './components/Home/Faqs';
import Register from './components/Home/Register';
import Footer from './components/Home/Footer';
import Products from './components/Home/Products'
import Setting from './components/Customer/Setting';
import { useState } from 'react';
import Payment from './components/Customer/Payment';
import OrderSuccess from './components/Customer/OrderSuccess';
import MessageInfo from './components/Customer/Message/MessageInfo';
import MessageCard from './components/Customer/Message/MessageCard';
import ReviewMainLayout from './components/Customer/Review/ReviewMainLayout';

// import MessageList from './components/Company/MessageList';
// import MessageDetail  from './components/Company/MessageDetail';
import ChangePassword from './components/Home/ChangePassword';
import Orders from './components/Customer/Orders';
import Resetpassword from './components/Home/Resetpassword';
import Otp from './components/Company/Otp';
import AnalyzeReports from './components/Company/AnalyzeReports';


function App() {
  const [toggle, setToggle] = useState(false);


  return (

    <div className=''>

      <Router>
        <Header />
        <Routes>
          <Route path='/Aboutus' element={<Aboutus />} />
          <Route path="/Contactus" element={<Contactus />} />
          {/* home */}

          <Route path='/' element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path='/otp' element={<OTP />} />
          <Route path='/Resetpassword' element={<Resetpassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/faqs" element={<Faqs />} />
          <Route path='/products' element={<Products />} />
          <Route path='/ChangePassword' element={<ChangePassword />} />
          {/* admin */}
          <Route path="/admin" element={<AdminLayout setToggle={setToggle} />}>
            <Route path="dash" element={<Dash />} />
            <Route path="Customerdetails" element={<Customerdetails />} />
            <Route path="Companydetails" element={<Companydetails />} />
            <Route path='Order' element={<AdminOrder />} />

          </Route>
          {/* customer */}
          <Route path="/customer" element={<CustomerLayout setToggle={setToggle} />}>
            <Route path="dash" element={<ProuductList />} />
            <Route path="shop" element={<ProuductList />} />
            <Route path="CartItems" element={<CartItems />} />
            {/* <Route path="cart" element={<CartItems />} /> */}
            <Route path="payment" element={<Payment/>} />
            <Route path="orders" element={<Orders/>}/>
            <Route path="OrderSuccess" element={<OrderSuccess/>} />
            {/* <Route path="PlaceOrder" element={<PlaceOrder />} /> */}
            <Route path="profile" element={<CustomerProfile />} />
            <Route path="productDetail" element={<ProductDetail />} />
            <Route path="setting" element={<Setting />} />
            <Route path="message-list" element={<MessageCard />} />
            <Route path="message-info/:contactID" element={<MessageInfo />} />
            <Route exact path="review-layout/:productID" element={<ReviewMainLayout />} />
          </Route>
          {/* company */}
          <Route path="/company/*" element={<CompanyLayout setToggle={setToggle} />} >
            <Route exact path="dash" element={<CompanyDashboard />} />
            <Route exact path="add-product" element={<AddProduct />} />
            <Route exact path="display-product" element={<ViewProducts />} />
            <Route exact path="update/:productID" element={<UpdateProduct />} />
            <Route exact path="customer" element={<Customer />} />
            <Route exact path="order" element={<Order />} />
            <Route exact path="review" element={<Review />} />
            <Route exact path="reviewlayout/:productID" element={<ReviewLayout />} />
            <Route exact path="profile" element={<CompanyProfile />} />
            <Route exact path="messagelist" element={<MessageList />} />  
            <Route exact path="messageDetail/:contactID" element={<MessageDetail />} />
            <Route exact path="otp" element={<Otp/>}/>
            <Route exact path="analyze" element={<AnalyzeReports/>}/>
          </Route>
        </Routes>
        <Footer toggle={toggle} />
      </Router>
      {/* <Sidebar
          sidebarToggle={sidebarToggle}
          setSidebarToggle={setSidebarToggle} /> */}
      {/* <CompanyHeader />
        <CompanySidebar sidebarToggle={sidebarToggle} setSidebarToggle={setSidebarToggle} /> */}

      {/* <Route path="/" element={<ProuductList sidebarToggle={sidebarToggle}
            setSidebarToggle={setSidebarToggle} />} /> */}



      {/* <main className={`content ${sidebarToggle ? 'sidebar-open' : 'sidebar-closed'}`}> */}
      {/* <Routes> */}
      {/* <Route exact path="/" element={<CompanyDashboard />} />  */}
      {/* // <div className=''> */}
      {/* <Router>
        <Header />
        <Sidebar
          sidebarToggle={sidebarToggle}
          setSidebarToggle={setSidebarToggle} />
        <Routes>
          <Route path='/' element={<Dash />} />
          <Route path='/Order' element={<AdminOrder />} />
        </Routes>
      </Router> */}


      {/* <CompanyHeader />
    <CompanySidebar sidebarToggle={sidebarToggle} setSidebarToggle={setSidebarToggle} />
    <main className={`content ${sidebarToggle ? 'sidebar-open' : 'sidebar-closed'}`}> */}
      {/* <Routes> */}
      {/* <Route exact path="/" element={<CompanyDashboard />} />  */}

      {/* </Routes> */}
      {/* </main> */}
    </div>

    /*<Companyregister/>*/
    //  <BrowserRouter>
    //       <Header/>
    //       <Sidebar 
    //       sidebarToggle={sidebarToggle}
    //       setSidebarToggle={setSidebarToggle}/>
    //       <Routes>
    //       {/*<Route path='/Contactus' element={<Contactus/>} />
    //       <Route path='/Aboutus' element={<Aboutus/>} />*/}
    //       <Route path='/' element={<Dash/>} />
    //       <Route path='/Customerdetails' element={<Customerdetails/>} />
    //       <Route path='/Order' element={<Order/>}  />

    //       </Routes>
    //     </BrowserRouter>


    // </Routes>
    // </main>
    // </div>


    // </Router>
  )
}

export default App
