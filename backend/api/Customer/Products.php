<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin:*');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, GET ,OPTIONS');

include('../Connection/connection.php');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $query ="SELECT * FROM products where status='available' ";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($products);
    exit;
}