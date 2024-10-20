<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include('../Connection/connection.php');
include('../config/cors.php');

try {
    if ($_SERVER['REQUEST_METHOD'] == 'GET') {
        if (isset($_GET['customer_id'])) {
            $customer_id = $_GET['customer_id'];
            $status = "pending";
            
            // Query to select all cart items for the given customer ID
            $query = "SELECT product_id FROM cart_items WHERE customer_id = :customer_id AND status = :status";
            $stmt = $conn->prepare($query);
            $stmt->bindParam(':customer_id', $customer_id);
            $stmt->bindParam(':status', $status);

            if ($stmt->execute()) {
                $cart_items = $stmt->fetchAll(PDO::FETCH_ASSOC);

                if ($cart_items) {
                    http_response_code(200);
                    echo json_encode($cart_items);
                } else {
                    http_response_code(404);
                    echo json_encode(["message" => "No cart items found for the given customer ID."]);
                }
            } else {
                http_response_code(500);
                echo json_encode(["message" => "Error executing query."]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Invalid or missing customer ID."]);
        }
    } else {
        http_response_code(405);
        echo json_encode(["message" => "Invalid request method."]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Server error: " . $e->getMessage()]);
}


// header("Access-Control-Allow-Origin: *");
// header("Content-Type: application/json; charset=UTF-8");

// include('../Connection/connection.php');
// include('../config/cors.php');

// try {
//     if ($_SERVER['REQUEST_METHOD'] == 'GET') {
//         if (isset($_GET['customer_id']) && isset($_GET['product_id'])) {
//             $customer_id = $_GET['customer_id'];
//             $product_id = $_GET['product_id'];
//             $status = "pending";
//             $query = "SELECT * FROM cart_items WHERE customer_id = :customer_id AND product_id = :product_id AND status = :status" ;
//             $stmt = $conn->prepare($query);
//             $stmt->bindParam(':customer_id', $customer_id);
//             $stmt->bindParam(':product_id', $product_id);
//             $stmt->bindParam(':status', $status);

//             if ($stmt->execute()) {
//                 $data = $stmt->fetch(PDO::FETCH_ASSOC);

//                 if ($data) {
//                     http_response_code(200);
//                     echo json_encode($data);
//                 } else {
//                     http_response_code(404);
//                     echo json_encode(["message" => "No cart items found for the given customer and product ID."]);
//                 }
//             } else {
//                 http_response_code(500);
//                 echo json_encode(["message" => "Error executing query."]);
//             }
//         } else {
//             http_response_code(400);
//             echo json_encode(["message" => "Invalid or missing customer ID or product ID."]);
//         }
//     } else {
//         http_response_code(405);
//         echo json_encode(["message" => "Invalid request method."]);
//     }
// } catch (Exception $e) {
//     http_response_code(500);
//     echo json_encode(["message" => "Server error: " . $e->getMessage()]);
// }
?>
