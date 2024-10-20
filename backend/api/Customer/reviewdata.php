<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../Connection/connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (isset($input['rating_value'])) {
        $rating = $input['rating_value'];
        $customerID = $input['customerID'];
        $reviewText = $input['userMessage'];
        $productID = $input['productID'];
        // Generate new reviewID
        $highest_id_query = $conn->prepare("SELECT reviewID FROM `product_reviews` ORDER BY reviewID DESC LIMIT 1");
        $highest_id_query->execute();
        $highest_id_row = $highest_id_query->fetch(PDO::FETCH_ASSOC);

        if ($highest_id_row) {
            $highest_id = $highest_id_row['reviewID'];
            $numeric_part = (int) substr($highest_id, 1);
            $new_id = 'R' . str_pad($numeric_part + 1, 3, '0', STR_PAD_LEFT);
        } else {
            $new_id = 'R001';
        }

        $reviewID = $new_id;
        $reviewDate = date('Y-m-d H:i:s');

        // Insert review into the database
        $sql = "INSERT INTO product_reviews (reviewID, productID, customerID, rating, reviewText, reviewDate) 
        VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(1, $reviewID);
        $stmt->bindValue(2, $productID);
        $stmt->bindValue(3, $customerID);
        $stmt->bindValue(4, $rating);
        $stmt->bindValue(5, $reviewText);
        $stmt->bindValue(6, $reviewDate);

        if ($stmt->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Review submitted successfully']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Error submitting review']);
        }
    }
}
?>