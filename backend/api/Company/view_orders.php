<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include '../Connection/connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Fetch the raw POST data
    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data['companyOwnerID'])) {
        echo json_encode(['error' => 'Company Owner ID is required.']);
        exit;
    }

    $companyOwnerID = $data['companyOwnerID'];

    try {
        // Prepare the SQL query to get customer details and payment method based on companyOwnerID
        $pstmt = $conn->prepare("
        SELECT 
            o.orderID, 
            SUM(oi.quantity * oi.price) AS totalAmount,  -- Calculate total per order
            o.orderDate, 
            o.status,    
            o.deliveryDate, 
            py.paymentMethod, 
            c.*, 
            GROUP_CONCAT(p.productName) AS productNames -- Concatenate product names to avoid repetition
        FROM 
            orders o
        JOIN 
            orderitems oi ON o.orderID = oi.orderID
        JOIN 
            products p ON oi.productID = p.productID
        JOIN 
            customers c ON o.customerID = c.customerID
        JOIN 
            invoices i ON o.invoiceID = i.invoiceID
        LEFT JOIN 
            payments py ON i.invoiceID = py.invoiceID
        WHERE 
            p.companyOwnerID = ?
        GROUP BY 
            o.orderID -- Group by orderID to get unique orders
    ");
    
    $pstmt->bindParam(1, $companyOwnerID);
    $pstmt->execute();
    $orders = $pstmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($orders);
        
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}
