-- EliteZ Database Schema
-- Generated for EliteZ: Inventory Fulfillment and Distribution Platform
-- Date: 2025-08-08

CREATE DATABASE IF NOT EXISTS `elitez`;
USE `elitez`;

-- --------------------------------------------------------
-- Table structure for table `admins`
-- --------------------------------------------------------

CREATE TABLE `admins` (
  `adminID` varchar(50) NOT NULL PRIMARY KEY,
  `adminName` varchar(255) NOT NULL,
  `email` varchar(255) UNIQUE NOT NULL,
  `password` varchar(255) NOT NULL,
  `is_first_login` boolean DEFAULT TRUE,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------
-- Table structure for table `companyowners`
-- --------------------------------------------------------

CREATE TABLE `companyowners` (
  `companyOwnerID` varchar(50) NOT NULL PRIMARY KEY,
  `companyName` varchar(255) NOT NULL,
  `companyAddress` text NOT NULL,
  `district` varchar(100) NOT NULL,
  `companyOwnerName` varchar(255) NOT NULL,
  `email` varchar(255) UNIQUE NOT NULL,
  `password` varchar(255) NOT NULL,
  `companyContactNumber` varchar(15) NOT NULL,
  `image` varchar(500) DEFAULT NULL,
  `is_first_login` boolean DEFAULT TRUE,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------
-- Table structure for table `customers`
-- --------------------------------------------------------

CREATE TABLE `customers` (
  `customerID` varchar(50) NOT NULL PRIMARY KEY,
  `customerName` varchar(255) NOT NULL,
  `email` varchar(255) UNIQUE NOT NULL,
  `password` varchar(255) NOT NULL,
  `customerContactNumber` varchar(15) NOT NULL,
  `customerShopName` varchar(255) NOT NULL,
  `customerAddress` text NOT NULL,
  `customerDistrict` varchar(100) NOT NULL,
  `customerShopReferenceNo` varchar(50) DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  `is_first_login` boolean DEFAULT TRUE,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------
-- Table structure for table `registration_requests`
-- --------------------------------------------------------

CREATE TABLE `registration_requests` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `userType` enum('Company','Shop') NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `businessName` varchar(255) NOT NULL,
  `address` text NOT NULL,
  `contactNumber` varchar(15) NOT NULL,
  `district` varchar(100) NOT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------
-- Table structure for table `products`
-- --------------------------------------------------------

CREATE TABLE `products` (
  `productID` varchar(50) NOT NULL PRIMARY KEY,
  `productName` varchar(255) NOT NULL,
  `productPrice` decimal(10,2) NOT NULL,
  `productImage` varchar(500) NOT NULL,
  `productQuantity` int(11) NOT NULL,
  `productCategory` varchar(100) NOT NULL,
  `productNetweight` varchar(50) NOT NULL,
  `companyOwnerID` varchar(50) NOT NULL,
  `status` enum('available','unavailable') DEFAULT 'available',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`companyOwnerID`) REFERENCES `companyowners`(`companyOwnerID`) ON DELETE CASCADE
);

-- --------------------------------------------------------
-- Table structure for table `invoices`
-- --------------------------------------------------------

CREATE TABLE `invoices` (
  `invoiceID` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `customerID` varchar(50) NOT NULL,
  `totalAmount` decimal(10,2) NOT NULL,
  `invoiceDate` timestamp DEFAULT CURRENT_TIMESTAMP,
  `status` enum('pending','processing','completed') DEFAULT 'pending',
  FOREIGN KEY (`customerID`) REFERENCES `customers`(`customerID`) ON DELETE CASCADE
);

-- --------------------------------------------------------
-- Table structure for table `orders`
-- --------------------------------------------------------

CREATE TABLE `orders` (
  `orderID` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `customerID` varchar(50) NOT NULL,
  `companyOwnerID` varchar(50) NOT NULL,
  `invoiceID` int(11) NOT NULL,
  `total` decimal(10,2) NOT NULL DEFAULT 0,
  `orderDate` timestamp DEFAULT CURRENT_TIMESTAMP,
  `deliveryDate` date DEFAULT NULL,
  `status` enum('pending','processing','delivered','cancelled') DEFAULT 'pending',
  FOREIGN KEY (`customerID`) REFERENCES `customers`(`customerID`) ON DELETE CASCADE,
  FOREIGN KEY (`companyOwnerID`) REFERENCES `companyowners`(`companyOwnerID`) ON DELETE CASCADE,
  FOREIGN KEY (`invoiceID`) REFERENCES `invoices`(`invoiceID`) ON DELETE CASCADE
);

-- --------------------------------------------------------
-- Table structure for table `orderitems`
-- --------------------------------------------------------

CREATE TABLE `orderitems` (
  `orderItemID` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `orderID` int(11) NOT NULL,
  `productID` varchar(50) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  FOREIGN KEY (`orderID`) REFERENCES `orders`(`orderID`) ON DELETE CASCADE,
  FOREIGN KEY (`productID`) REFERENCES `products`(`productID`) ON DELETE CASCADE
);

-- --------------------------------------------------------
-- Table structure for table `payments`
-- --------------------------------------------------------

CREATE TABLE `payments` (
  `paymentID` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `invoiceID` int(11) NOT NULL,
  `paymentDate` timestamp DEFAULT CURRENT_TIMESTAMP,
  `amount` decimal(10,2) NOT NULL,
  `paymentMethod` enum('cash','card','bank_transfer','online') NOT NULL,
  FOREIGN KEY (`invoiceID`) REFERENCES `invoices`(`invoiceID`) ON DELETE CASCADE
);

-- --------------------------------------------------------
-- Table structure for table `cart_items`
-- --------------------------------------------------------

CREATE TABLE `cart_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `customer_id` varchar(50) NOT NULL,
  `product_id` varchar(50) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `price` decimal(10,2) NOT NULL,
  `product_image` varchar(500) DEFAULT NULL,
  `status` enum('pending','ordered') DEFAULT 'pending',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`customerID`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`productID`) ON DELETE CASCADE
);

-- --------------------------------------------------------
-- Table structure for table `contact`
-- --------------------------------------------------------

CREATE TABLE `contact` (
  `contactID` varchar(50) NOT NULL PRIMARY KEY,
  `companyOwnerID` varchar(50) NOT NULL,
  `customerID` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `companyName` varchar(255) NOT NULL,
  `customerName` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `dataFile` varchar(500) DEFAULT NULL,
  `sender` enum('company','customer') NOT NULL,
  `isRead` boolean DEFAULT FALSE,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`companyOwnerID`) REFERENCES `companyowners`(`companyOwnerID`) ON DELETE CASCADE,
  FOREIGN KEY (`customerID`) REFERENCES `customers`(`customerID`) ON DELETE CASCADE
);

-- --------------------------------------------------------
-- Table structure for table `product_reviews`
-- --------------------------------------------------------

CREATE TABLE `product_reviews` (
  `reviewID` varchar(50) NOT NULL PRIMARY KEY,
  `productID` varchar(50) NOT NULL,
  `customerID` varchar(50) NOT NULL,
  `rating` int(1) NOT NULL CHECK (rating >= 1 AND rating <= 5),
  `reviewText` text DEFAULT NULL,
  `reviewDate` timestamp DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`productID`) REFERENCES `products`(`productID`) ON DELETE CASCADE,
  FOREIGN KEY (`customerID`) REFERENCES `customers`(`customerID`) ON DELETE CASCADE
);

-- --------------------------------------------------------
-- Table structure for table `review_table` (Alternative review system)
-- --------------------------------------------------------

CREATE TABLE `review_table` (
  `review_id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `productID` varchar(50) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `rating` int(1) NOT NULL CHECK (rating >= 1 AND rating <= 5),
  `message` text NOT NULL,
  `datetime` int(11) NOT NULL,
  FOREIGN KEY (`productID`) REFERENCES `products`(`productID`) ON DELETE SET NULL
);

-- --------------------------------------------------------
-- Table structure for table `subscriptions`
-- --------------------------------------------------------

CREATE TABLE `subscriptions` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `email` varchar(255) UNIQUE NOT NULL,
  `subscribed_at` timestamp DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------
-- Insert sample admin data
-- --------------------------------------------------------

INSERT INTO `admins` (`adminID`, `adminName`, `email`, `password`, `is_first_login`) VALUES
('ADMIN1', 'System Administrator', 'admin@elitez.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', FALSE);
-- Default password: 'password' (hashed)

-- --------------------------------------------------------
-- Sample data for testing (Optional)
-- --------------------------------------------------------

-- Sample Company
INSERT INTO `companyowners` (`companyOwnerID`, `companyName`, `companyAddress`, `district`, `companyOwnerName`, `email`, `password`, `companyContactNumber`) VALUES
('COMP1', 'EliteZ Manufacturing', '123 Industrial Area, Colombo', 'Colombo', 'John Smith', 'company@elitez.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0771234567');

-- Sample Customer
INSERT INTO `customers` (`customerID`, `customerName`, `email`, `password`, `customerContactNumber`, `customerShopName`, `customerAddress`, `customerDistrict`) VALUES
('CUST1', 'Jane Doe', 'customer@elitez.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0777654321', 'Elite Shop', '456 Market Street, Kandy', 'Kandy');

-- Sample Product
INSERT INTO `products` (`productID`, `productName`, `productPrice`, `productImage`, `productQuantity`, `productCategory`, `productNetweight`, `companyOwnerID`) VALUES
('P001', 'Sample Product', 1500.00, '/images/products/P001/sample.jpg', 100, 'Electronics', '1kg', 'COMP1');

-- --------------------------------------------------------
-- Create indexes for better performance
-- --------------------------------------------------------

CREATE INDEX idx_products_company ON products(companyOwnerID);
CREATE INDEX idx_orders_customer ON orders(customerID);
CREATE INDEX idx_orders_company ON orders(companyOwnerID);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orderitems_order ON orderitems(orderID);
CREATE INDEX idx_orderitems_product ON orderitems(productID);
CREATE INDEX idx_cart_customer ON cart_items(customer_id);
CREATE INDEX idx_contact_company ON contact(companyOwnerID);
CREATE INDEX idx_contact_customer ON contact(customerID);
CREATE INDEX idx_reviews_product ON product_reviews(productID);

-- --------------------------------------------------------
-- End of EliteZ Database Schema
-- --------------------------------------------------------
