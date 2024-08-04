<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Database connection settings
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "elitez";

try {
    // Create a new PDO instance
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    // Set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Prepare and execute the SQL statement
    $stmt = $conn->prepare("SELECT * FROM products");
    $stmt->execute();

    // Fetch all products as an associative array
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Output the products as a JSON array
    echo json_encode($products);

} catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
}

// Close the connection
$conn = null;
?>
