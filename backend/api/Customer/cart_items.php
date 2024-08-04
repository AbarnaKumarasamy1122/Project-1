<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

include('../Connection/connection.php');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['customer_id'])) {
        $customer_id = $_GET['customer_id'];

        $query = "SELECT * FROM cart_items WHERE customer_id = :customer_id";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':customer_id', $customer_id);
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
