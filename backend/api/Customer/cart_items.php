<?php
include('../config/cors.php');
include('../Connection/connection.php');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['customer_id'])) {
        $customer_id = $_GET['customer_id'];
        $status = 'pending'; // Define the status as a variable

        $query = "SELECT * FROM cart_items WHERE customer_id = :customer_id AND status= :status";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':customer_id', $customer_id, PDO::PARAM_STR);
        $stmt->bindParam(':status', $status, PDO::PARAM_STR);
        $stmt->execute();

        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($data) {
            http_response_code(200);
            echo json_encode($data);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "No cart items found for the given customer ID."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Invalid or missing customer ID."]);
    }
} else {
    http_response_code(405);
    echo json_encode(["message" => "Method Not Allowed."]);
}
?>
