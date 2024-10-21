<?php

// Database connection
require_once '../Connection/DbConnector.php';
require '../config/cors.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the customer ID and items from the request
    $data = json_decode(file_get_contents('php://input'), true);
    $customerId = $data['customer_id'] ?? null;
    $items = $data['items'] ?? null;

    if (!$customerId || !$items) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid input']);
        exit;
    }


        $db = new DbConnector();
        $pdo = $db->getConnection();

        // Step 1: Insert the Invoice
        $totalAmount = 0;
        foreach ($items as $item) {
            $totalAmount += $item['price'] * $item['quantity'];
        }
        $totalAmount = number_format($totalAmount, 2, '.', '');
        
        $invoiceStmt = $pdo->prepare("INSERT INTO invoices (customerID, totalAmount, invoiceDate) VALUES (?, ?, NOW())");
        if($invoiceStmt->execute([$customerId, $totalAmount])){
            $invoiceId = $pdo->lastInsertId();
        }else{
            echo json_encode(['error' => 'Invoice failed']);
        }

        // Get the last inserted invoice ID
        

        // Step 2: Retrieve companyID for each product and create orders per company
        $orders = []; // Store orders by companyID

        foreach ($items as $item) {
            // Get the companyID for the product
            $companyStmt = $pdo->prepare("SELECT companyOwnerID FROM products WHERE productID = ?");
            $companyStmt->execute([$item['product_id']]);
            $company = $companyStmt->fetch(PDO::FETCH_ASSOC);

            if ($company) {
                $companyID = $company['companyOwnerID'];

                // Check if there's already an order for this company
                if (!isset($orders[$companyID])) {
                    // Create a new order for this company
                    $orderStmt = $pdo->prepare("INSERT INTO orders (customerID, companyOwnerID, total ,invoiceID) VALUES (?,?, ?, ?)");
                    $orderStmt->execute([$customerId, $companyID, $totalAmount,$invoiceId]);
                    $orderId = $pdo->lastInsertId();

                    // Store the orderID by companyID
                    $orders[$companyID] = $orderId;
                }

                // Step 3: Insert the product into the orderitems table
                $orderItemStmt = $pdo->prepare("INSERT INTO orderitems (orderID, productID, quantity, price) VALUES (?, ?, ?, ?)");
                $orderItemStmt->execute([$orders[$companyID], $item['product_id'], $item['quantity'], $item['price']]);

                // Update cart item status to "ordered"
                $updateCartStmt = $pdo->prepare("UPDATE cart_items SET status = ? WHERE product_id = ? AND customer_id = ?");
                $updateCartStmt->execute(["ordered", $item['product_id'], $customerId]);
            }
        }

        // Prepare the response data
        $response = [
            'invoiceID' => $invoiceId,
            'customer_id' => $customerId,
            'total_amount' => $totalAmount,
            'items' => $items
        ];

        echo json_encode($response);
    // } catch (PDOException $e) {
    //     http_response_code(500);
    //     echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    // }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}

// // Database connection
// require_once '../Connection/DbConnector.php';

// // Start session
// require '../config/cors.php';



// if ($_SERVER['REQUEST_METHOD'] === 'POST') {
//     // Get the customer ID and items from the request
//     $data = json_decode(file_get_contents('php://input'), true);
//     $customerId = $data['customer_id'] ?? null;
//     $items = $data['items'] ?? null;

//     if (!$customerId || !$items) {
//         http_response_code(400);
//         echo json_encode(['error' => 'Invalid input']);
//         exit;
//     }

//     try {
//         $db = new DbConnector();
//         $pdo = $db->getConnection();

//         // Prepare the invoice insert statement
//         // $invoiceStmt = $pdo->prepare("INSERT INTO invoices (customer_id, total_amount, created_at) VALUES (?, ?, NOW())");
//         $invoiceStmt = $pdo->prepare("INSERT INTO orders (customerID, total) VALUES (?, ?)");
        
//         // Calculate total amount
//         $totalAmount = 0;
//         foreach ($items as $item) {
//             $totalAmount += $item['price'] * $item['quantity'];
//         }
//         $totalAmount = number_format($totalAmount, 2, '.', '');
//         // Execute invoice insert
//         $invoiceStmt->execute([$customerId, $totalAmount]);

//         // Get the last inserted invoice ID
//         $invoiceId = $pdo->lastInsertId();

//         // Prepare the invoice items insert statement
//         // $invoiceItemStmt = $pdo->prepare("INSERT INTO invoice_items (invoice_id, product_id, quantity, price) VALUES (?, ?, ?, ?)");
//         $invoiceItemStmt = $pdo->prepare("INSERT INTO orderitems (orderID, productID, quantity, price) VALUES (?, ?, ?, ?)");
//         $invoiceOrderItemStmt = $pdo->prepare("UPDATE cart_items SET status=? WHERE product_id = ? AND customer_id = ?");
//         // Insert each item into the invoice_items table
//         $status = "ordered";
//         foreach ($items as $item) {
//             $invoiceItemStmt->execute([$invoiceId, $item['product_id'], $item['quantity'], $item['price']]);
            
//         }
//         foreach ($items as $item) {
//         $invoiceOrderItemStmt->execute( [$status, $item['product_id'], $customerId] );
//         }
//         // Prepare response data
//         $response = [
//             'orderID' => $invoiceId,
//             'customer_id' => $customerId,
//             'total_amount' => $totalAmount,
//             'items' => $items
//         ];

//         echo json_encode($response);
//     } catch (PDOException $e) {
//         http_response_code(500);
//         echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
//     }
// } else {
//     http_response_code(405);
//     echo json_encode(['error' => 'Method not allowed']);
// }
?>
