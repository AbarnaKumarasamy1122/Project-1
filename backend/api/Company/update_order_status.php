<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include '../Connection/DbConnector.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../Phpmailer/src/Exception.php';
require '../Phpmailer/src/PHPMailer.php';
require '../Phpmailer/src/SMTP.php';

$db = new DbConnector();
$conn = $db->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));

    if (isset($data->purpose)) {
        $purpose = $data->purpose;
        $status = $data->status;
        $orderId = $data->orderId;

        if ($purpose == 'verify' && $status == 'delivered') {
            $sql = "SELECT c.*
                    FROM customers c
                    JOIN orders o ON c.customerID = o.customerID
                    WHERE o.orderID = :orderId";  // corrected the placeholder
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':orderId', $orderId);  // ensuring this matches the placeholder

            if ($stmt->execute()) {
                $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($data);
            }
        } else if ($purpose == 'update' && $status == 'delivered') {
            $query = "UPDATE orders SET status = :status WHERE orderID = :orderId";
            $pstmt = $conn->prepare($query);
            $pstmt->bindParam(':status', $status);
            $pstmt->bindParam(':orderId', $orderId);

            // Execute the query
            if ($pstmt->execute()) {
                echo json_encode(['success' => true, 'message' => 'Order status updated successfully']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to update order status']);
            }
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid input']);
    }
}
?>
