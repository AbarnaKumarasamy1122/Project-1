<?php
include('../config/cors.php');
require '../Connection/DbConnector.php';

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $db = new DbConnector();
    $conn = $db->getConnection();

    
    $response = [];
    $orders_details=[];
    if (isset($_GET['companyOwnerID'])) {
        $companyOwnerID = $_GET['companyOwnerID'];
    }

    if (empty($companyOwnerID)) {
        $invoiceId = $_GET['invoiceID']; 
        try {
            // Fetch all orderIDs associated with the given invoiceID
            $query = "SELECT orderID FROM orders WHERE invoiceID = ?";
            $orderID_stmt = $conn->prepare($query);
            $orderID_stmt->bindParam(1, $invoiceId);
            $orderID_stmt->execute();
            $orderIDs = $orderID_stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'get orders id query error: ' . $e->getMessage()]);
            return;
        }

        if ($orderIDs) {
            foreach ($orderIDs as $order) {
                $order_id = $order['orderID']; // Correct orderID handling

                try {
                    $sql = "SELECT 
                                oi.orderItemID,
                                oi.orderID,
                                oi.productID,
                                oi.quantity,
                                oi.price,
                                p.productName
                            FROM 
                                orderitems oi
                            JOIN 
                                products p ON oi.productID = p.productID
                            WHERE 
                                oi.orderID = ?";
                    $stmt = $conn->prepare($sql);
                    $stmt->bindParam(1, $order_id);
                    $stmt->execute();
                    $datas = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    if ($datas) {
                       $total = 0;
                        foreach($datas as $data){
                            $response[] = $data;
                            $total+= $data['quantity']*$data['price'];
                        }
                        $orders_detail = [
                            'orderID' => $order_id,
                            'total_per_order' =>$total,
                            'items' => $datas
                        ];
                        $orders_details[]=$orders_detail;
                         // Collect responses
                    }


                } catch (PDOException $e) {
                    http_response_code(500);
                    echo json_encode(['error' => 'get orders query error: ' . $e->getMessage()]);
                    return;
                }
            }
            $responses= [
                'orders' => $orders_details,
                'invoiceID'=> $invoiceId,
                'items' => $response
            ];
            echo json_encode($responses); // Return all order items
        } else {
            echo json_encode(["message" => "No orders found for this invoiceID"]);
        }
    } else {
        try {
            $order_id = $_GET['invoiceID'];
            // Handle specific query for companyOwnerID
            $sql = "SELECT 
                        oi.orderItemID,
                        oi.orderID,
                        oi.productID,
                        oi.quantity,
                        oi.price,
                        p.productName
                    FROM 
                        orderitems oi
                    JOIN 
                        products p ON oi.productID = p.productID
                    WHERE 
                        oi.orderID = ? AND p.companyOwnerID = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(1, $order_id);
            $stmt->bindParam(2, $companyOwnerID);
            $stmt->execute();
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
            if ($data) {
                $response = [
                    'orderID' => $order_id,
                    'items' => $data
                ];
                echo json_encode($response); // Return response for the specific order
            } else {
                echo json_encode(["message" => "No order items found for this order and company owner"]);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'get orders query error: ' . $e->getMessage()]);
        }
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
