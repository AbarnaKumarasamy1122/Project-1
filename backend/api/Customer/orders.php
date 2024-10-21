<?php
include('../config/cors.php');
require '../Connection/DbConnector.php';

if($_SERVER['REQUEST_METHOD'] === 'GET'){
    $db = new DbConnector();
    $conn = $db->getConnection();

    // $data = json_decode(file_get_contents('php://input'), true);
    $customer_id = $_GET['customer_id'];
    $status =$_GET['status'];

    $sql = "SELECT * FROM invoices WHERE customerID = ? AND status = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(1,$customer_id);
    $stmt->bindParam(2,$status);;

    if($stmt->execute()){
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if($data){
            echo json_encode($data);
        }else{
            echo json_encode(["message "=> "oreders not found"]);
        }
    }else{
        echo json_encode(["message "=> "error in execute query"]);

    }

}else{
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
