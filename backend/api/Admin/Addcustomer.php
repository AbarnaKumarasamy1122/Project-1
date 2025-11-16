<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, Authorization, X-Requested-With");
header('Content-Type: application/json');

include '../Connection/connection.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../Phpmailer/src/Exception.php';
require '../Phpmailer/src/PHPMailer.php';
require '../Phpmailer/src/SMTP.php';
// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $input = file_get_contents('php://input');
    $customer = json_decode($input, true);

    if ($customer) {
        $errors = [];

        $sanitizedemail = filter_var($customer['email'], FILTER_SANITIZE_EMAIL);
        $Validatedemail = filter_var($sanitizedemail, FILTER_VALIDATE_EMAIL);
        if ($Validatedemail) {
            $email = strtolower($Validatedemail);
        } else {
            $errors[] = "Invalid Email";
        }

        if (empty($customer['username'])) {
            $errors[] = "Customer name is required";
        } else {
            $fname = htmlspecialchars($customer['username']);
        }

        if (empty($customer['businessName'])) {
            $errors[] = "Shop name is required";
        } else {
            $shopname = htmlspecialchars($customer['businessName']);
        }

        if (!isset($customer['contactNumber']) || !preg_match("/^\d{10}$/", $customer['contactNumber'])) {
            $errors[] = "Invalid Contact Number";
        } else {
            $contact = $customer['contactNumber'];
        }

        if (empty($customer['address'])) {
            $errors[] = "Address is required";
        } else {
            $address = htmlspecialchars($customer['address']);
        }

        if (empty($customer['district'])) {
            $errors[] = "District is required";
        } else {
            $district = htmlspecialchars($customer['district']);
        }

        // if (empty($customer['customerShopReferenceNo'])) {
        //     $errors[] = "Reference number is required";
        // } else {
        //     $refno = htmlspecialchars($customer['customerShopReferenceNo']);
        // }

        if (!empty($errors)) {
            echo json_encode(['success' => false, 'message' => 'Validation errors', 'errors' => $errors]);
            exit;
        }
        $highest_id_query = $conn->prepare("SELECT customerID FROM `customers` ORDER BY customerID DESC LIMIT 1");
        $highest_id_query->execute();
        $highest_id_row = $highest_id_query->fetch(PDO::FETCH_ASSOC);

        if ($highest_id_row) {
            $highest_id = $highest_id_row['customerID'];
            $numeric_part = (int)substr($highest_id, 4); // Get the numeric part of the highest ID
            $new_id = 'CUST' . str_pad($numeric_part + 1, '0', STR_PAD_LEFT); // Increment and pad with zeros
        } else {
            $new_id = 'CUST1'; // If no product exists, start with P001
        }
        // Generate a Unique Customer ID
        $ID = $new_id;

        $refno = '4545';
        // Generate a random password
        // $PW = bin2hex(random_bytes(4));
        function generateRandomPassword($length)
        {
            $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*';
            $charactersLength = strlen($characters);
            $randomPassword = '';
            for ($i = 0; $i < $length; $i++) {
                $randomPassword .= $characters[random_int(0, $charactersLength - 1)];
            }
            return $randomPassword;
        }
        $password = generateRandomPassword(6);
        $hash = password_hash($password, PASSWORD_DEFAULT);
        $duplicatePassword = $password;
        // $password = password_hash($password, PASSWORD_DEFAULT);

        try {
            $conn->beginTransaction();

            // Insert into customers table
            $sql = "INSERT INTO customers (customerID, customerName, email, password, customerContactNumber, customerShopName, customerAddress, customerDistrict, customerShopReferenceNo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $pstmt = $conn->prepare($sql);
            $pstmt->bindParam(1, $ID);
            $pstmt->bindParam(2, $fname);
            $pstmt->bindParam(3, $email);
            $pstmt->bindParam(4, $hash);
            $pstmt->bindParam(5, $contact);
            $pstmt->bindParam(6, $shopname);
            $pstmt->bindParam(7, $address);
            $pstmt->bindParam(8, $district);
            $pstmt->bindParam(9, $refno);

            $r = $pstmt->execute();

            if ($r) {
                // Remove from request table
                require_once '../../../config/email_config.php';
                $emailConfig = EmailConfig::validateConfig();
                
                $mail = new PHPMailer(true);
                try {
                    //Server settings
                    $mail->isSMTP();                                            // Send using SMTP
                    $mail->Host       = $emailConfig['smtp_host'];              // Set the SMTP server to send through
                    $mail->SMTPAuth   = true;                                   // Enable SMTP authentication
                    $mail->Username   = $emailConfig['smtp_username'];          // SMTP username
                    $mail->Password   = $emailConfig['smtp_password'];          // SMTP password
                    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;         // Enable TLS encryption; `PHPMailer::ENCRYPTION_SMTPS` encouraged
                    $mail->Port       = $emailConfig['smtp_port'];              // TCP port to connect to

                    //Recipients
                    $mail->setFrom($emailConfig['from_email'], $emailConfig['from_name']);
                    $mail->addAddress($email, $fname);

                    // Content
                    $mail->isHTML(true);
                    $mail->Subject = 'Your Account Login Details';
                    $mail->Body    = "Dear $fname,<br><br>Your account login password is: $duplicatePassword.<br><br>You can now log in to your account using your email ($email) and password.";
                    $mail->AltBody = "Dear $fname,\n\nYour account login password is: $duplicatePassword\n\nYou can now log in to your account using your email ($email) and password.";

                    $mail->send();
                    $message = "New user added successfully and password sent to your email.";
                    $sqlDelete = "DELETE FROM registration_requests WHERE id = ?";
                    $pstmtDelete = $conn->prepare($sqlDelete);
                    $pstmtDelete->bindParam(1, $customer['id']);
                    $pstmtDelete->execute();
                    $conn->commit();
                    echo json_encode(['success' => true, 'message' => $message]);
                } catch (Exception $e) {
                    $sqlDelete = "DELETE FROM customers WHERE customerID = ?";
                    $pstmtDelete = $conn->prepare($sqlDelete);
                    $pstmtDelete->bindParam(1, $ID);
                    $pstmtDelete->execute();

                    $message = " email could not be sent. Mailer Error: {$mail->ErrorInfo}";
                    $conn->commit();
                    echo json_encode(['success' => false, 'message' => $message]);
                }

                
            } else {
                $conn->rollBack();
                $errorInfo = $pstmt->errorInfo();
                echo json_encode(['success' => false, 'message' => 'Error in Register', 'error' => $errorInfo[2]]);
            }
        } catch (Exception $e) {
            if ($conn->inTransaction()) {
                $conn->rollBack();
            }
            echo json_encode(['success' => false, 'message' => 'Transaction failed', 'error' => $e->getMessage()]);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid input']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
