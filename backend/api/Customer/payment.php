<?php

include('../config/cors.php');
require '../Connection/DbConnector.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $db = new DbConnector();
    $conn = $db->getConnection();

    // Safely check if the keys exist
    $data = json_decode(file_get_contents('php://input'), true);
    $order_id = $data['invoiceID'];
    $payment_method = $data['paymentMethod'];
    $total_amount = $data['total'];
    $status = "pending";

    try {
        // Update invoice status
        $query = "UPDATE invoices SET status=? WHERE invoiceID=?";
        $stmt_sts = $conn->prepare($query);
        $stmt_sts->bindParam(1, $status);
        $stmt_sts->bindParam(2, $order_id);
        if ($stmt_sts->execute()) {
            $stmt_sts->closeCursor(); // Close cursor
            $orderquery = "SELECT orderID FROM orders WHERE invoiceID = ?";
            $orderID_stmt = $conn->prepare($orderquery);
            $orderID_stmt->bindParam(1, $order_id);
            $orderID_stmt->execute();
            $orderIDs = $orderID_stmt->fetchAll(PDO::FETCH_ASSOC);

            if ($orderIDs) {
                foreach ($orderIDs as $order) {
                    $update_status_query="UPDATE orders SET status=? WHERE orderID=?";
                    $update_status_stmt = $conn->prepare($update_status_query);
                    $update_status_stmt->bindParam(1,$status);
                    $update_status_stmt->bindParam(2,$order['orderID']);
                    $update_status_stmt->execute();
                }
            }
            // Select product IDs
            $product_query = "SELECT oi.productID
                              FROM orderitems oi
                              JOIN orders o ON oi.orderID = o.orderID
                              JOIN invoices i ON o.invoiceID = i.invoiceID
                              WHERE i.invoiceID = ?";
            $pro_stmt = $conn->prepare($product_query);
            $pro_stmt->bindParam(1, $order_id);
            $pro_stmt->execute();
            $products = $pro_stmt->fetchAll(PDO::FETCH_ASSOC);
            $pro_stmt->closeCursor(); // Close cursor

            $get_qua_query = "SELECT productQuantity from products WHERE productID = ?";
            $get_qua_stmt = $conn->prepare($get_qua_query);

            $get_order_qu_qury = "SELECT oi.quantity
                                  FROM orderitems oi
                                  JOIN orders o ON oi.orderID = o.orderID
                                  JOIN invoices i ON o.invoiceID = i.invoiceID
                                  WHERE oi.productID = ? AND i.invoiceID = ?";
            $get_order_qu_stmt = $conn->prepare($get_order_qu_qury);

            foreach ($products as $pro) {
                $product = $pro['productID'];
                $new_quantity = null;

                $get_qua_stmt->bindParam(1, $product);
                $get_qua_stmt->execute();
                $quantity = $get_qua_stmt->fetch();
                $get_qua_stmt->closeCursor(); // Close cursor

                $get_order_qu_stmt->bindParam(1, $product);
                $get_order_qu_stmt->bindParam(2, $order_id);
                $get_order_qu_stmt->execute();
                $order_quantity = $get_order_qu_stmt->fetch();
                $get_order_qu_stmt->closeCursor(); // Close cursor

                $new_quantity = $quantity['productQuantity'] - $order_quantity['quantity'];

                if ($new_quantity >= 0) {
                    // Update product quantity
                    $update_query = "UPDATE products SET productQuantity=? WHERE productID=?";
                    $update_stmt = $conn->prepare($update_query);
                    $update_stmt->bindParam(1, $new_quantity);
                    $update_stmt->bindParam(2, $product);
                    if ($update_stmt->execute()) {
                        $update_stmt->closeCursor(); // Close cursor
                    } else {
                        echo json_encode(['message' => "Product ID $product is out of stock"]);
                        break;
                    }
                } else {
                    echo json_encode(['message' => "Product ID $product is out of stock"]);
                    break;
                }
            }

            // Insert payment
            $sql = "INSERT INTO payments (invoiceID, paymentDate, amount, paymentMethod) VALUES (?, NOW(), ?, ?)";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(1, $order_id);
            $stmt->bindParam(2, $total_amount);
            $stmt->bindParam(3, $payment_method);
            if ($stmt->execute()) {
                echo json_encode(["success" => true, "message" => "Payment method added successfully"]);
            } else {
                echo json_encode(["success" => false, "message" => "Failed to add payment method"]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "Failed to update order status"]);
        }
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}

// include('../config/cors.php');
// require '../Connection/DbConnector.php';

// if ($_SERVER['REQUEST_METHOD'] == 'POST') {

//     $db = new DbConnector();
//     $conn = $db->getConnection();

//     // Safely check if the keys exist
//     $data = json_decode(file_get_contents('php://input'), true);
//     $order_id = $data['orderID'];
//     $payment_method = $data['paymentMethod'];
//     $total_amount = $data['total'];
//     $status = "pending";

//     try {
//         $query = "UPDATE invoices SET status=? WHERE invoiceID=?";
//         $stmt_sts = $conn->prepare($query);
//         $stmt_sts->bindParam(1, $status);
//         $stmt_sts->bindParam(2, $order_id);
//         if ($stmt_sts->execute()) {

//             $product_query = "SELECT oi.productID
//                             FROM orderitems oi
//                             JOIN orders o ON oi.orderID = o.orderID
//                             JOIN invoices i ON o.invoiceID = i.invoiceID
//                             WHERE i.invoiceID = ?;  -- replace ? with the actual invoice ID if needed
//                             ";
//             $pro_stmt = $conn->prepare($product_query);
//             $pro_stmt->bindParam(1, $order_id);
//             $pro_stmt->execute();
//             $products = $pro_stmt->fetchAll(PDO::FETCH_ASSOC);

//             $get_qua_query = "SELECT productQuantity from products WHERE productID =?";
//             $get_qua_stmt = $conn->prepare($get_qua_query);

//             $get_order_qu_qury = "SELECT oi.quantity
//                                 FROM orderitems oi
//                                 JOIN orders o ON oi.orderID = o.orderID
//                                 JOIN invoices i ON o.invoiceID = i.invoiceID
//                                 WHERE oi.productID = ? AND i.invoiceID = ?;
//                                 ";
//             $get_order_qu_stmt = $conn->prepare($get_order_qu_qury);

//             foreach ($products as $pro) {
//                 $product = $pro['productID'];
//                 $new_quantity = null;

//                 $get_qua_stmt->bindParam(1, $product);
//                 $get_qua_stmt->execute();
//                 $quantity = $get_qua_stmt->fetch();

//                 $get_order_qu_stmt->bindParam(1, $product);
//                 $get_order_qu_stmt->bindParam(2, $order_id);
//                 $get_order_qu_stmt->execute();
//                 $order_quantity = $get_order_qu_stmt->fetch();

//                 $new_quantity = $quantity['productQuantity'] - $order_quantity['quantity'];

//                 if ($new_quantity >= 0) { // Ensure quantity is not negative
//                     $update_query = "UPDATE products SET productQuantity=? WHERE productID=?";
//                     $update_stmt = $conn->prepare($update_query);
//                     $update_stmt->bindParam(1, $new_quantity); // Bind the new quantity
//                     $update_stmt->bindParam(2, $product);
//                     if ($update_stmt->execute()) {
//                     } else {
//                         echo json_encode(['message' => "Product ID $product is out of stock"]);
//                         break; // Stop processing if any product is out of stock
//                     };
//                 } else {
//                     echo json_encode(['message' => "Product ID $product is out of stock"]);
//                     break; // Stop processing if any product is out of stock
//                 }
//             }


//             $sql = "INSERT INTO payments (orderID, paymentDate, amount, paymentMethod) VALUES (?,NOW(),?,?)";
//             $stmt = $conn->prepare($sql);
//             $stmt->bindParam(1, $order_id);
//             $stmt->bindParam(2, $total_amount);
//             $stmt->bindParam(3, $payment_method);
//             if ($stmt->execute()) {
//                 echo json_encode(["success" => true, "message" => "Payment method added successfully"]);
//             } else {
//                 echo json_encode(["success" => false, "message" => "Failed to add payment method"]);
//             }
//         } else {
//             echo json_encode(["success" => false, "message" => "Failed to update order status"]);
//         }
//     } catch (PDOException $e) {
//         echo json_encode(['success' => false, 'message' => $e->getMessage()]);
//     }
// } else {
//     http_response_code(405);
//     echo json_encode(['error' => 'Method not allowed']);
// }
