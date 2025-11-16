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
    $company = json_decode($input, true);

    if ($company) {
        $errors = [];

        $sanitizedemail = filter_var($company['email'], FILTER_SANITIZE_EMAIL);
        $Validatedemail = filter_var($sanitizedemail, FILTER_VALIDATE_EMAIL);
        if ($Validatedemail) {
            $email = strtolower($Validatedemail);
        } else {
            $errors[] = "Invalid Email";
        }

        if (empty($company['username'])) {
            $errors[] = "company name is required";
        } else {
            $fname = htmlspecialchars($company['username']);
        }

        if (empty($company['businessName'])) {
            $errors[] = "Shop name is required";
        } else {
            $shopname = htmlspecialchars($company['businessName']);
        }

        if (!isset($company['contactNumber']) || !preg_match("/^\d{10}$/", $company['contactNumber'])) {
            $errors[] = "Invalid Contact Number";
        } else {
            $contact = $company['contactNumber'];
        }

        if (empty($company['address'])) {
            $errors[] = "Address is required";
        } else {
            $address = htmlspecialchars($company['address']);
        }

        if (empty($company['district'])) {
            $errors[] = "District is required";
        } else {
            $district = htmlspecialchars($company['district']);
        }

        // if (empty($company['companyShopReferenceNo'])) {
        //     $errors[] = "Reference number is required";
        // } else {
        //     $refno = htmlspecialchars($company['companyShopReferenceNo']);
        // }

        if (!empty($errors)) {
            echo json_encode(['success' => false, 'message' => 'Validation errors', 'errors' => $errors]);
            exit;
        }

        $highest_id_query = $conn->prepare("SELECT companyOwnerID FROM `companyowners` ORDER BY companyOwnerID DESC LIMIT 1");
        $highest_id_query->execute();
        $highest_id_row = $highest_id_query->fetch(PDO::FETCH_ASSOC);

        if ($highest_id_row) {
            $highest_id = $highest_id_row['companyOwnerID'];
            $numeric_part = (int)substr($highest_id, 4); // Get the numeric part of the highest ID
            $new_id = 'COMP' . str_pad($numeric_part + 1, '0', STR_PAD_LEFT); // Increment and pad with zeros
        } else {
            $new_id = 'COMP1'; // If no product exists, start with P001
        }
        // Generate a Unique Customer ID
        $ID = $new_id;

        // Generate a Unique company ID
        //    Generate company ID
        //$ID = uniqid("CMP", true);
        // $ID = 1;

        //$refno='4545';
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

        try {
            // Start a transaction
            $conn->beginTransaction();

            // Insert into companyowners table
            $sql = "INSERT INTO `companyowners` (`companyOwnerID`, `companyName`, `companyAddress`, `district`, `companyOwnerName`, `email`, `password`, `companyContactNumber`)
                    VALUES (?, ?, ?, ?, ?, ?, ?,?)";
            $pstmt = $conn->prepare($sql);
            $pstmt->bindParam(1, $ID);
            $pstmt->bindParam(2, $shopname);
            $pstmt->bindParam(3, $address);
            $pstmt->bindParam(4, $district);
            $pstmt->bindParam(5, $fname);
            $pstmt->bindParam(6, $email);
            $pstmt->bindParam(7, $hash);
            $pstmt->bindParam(8, $contact);
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
                    $pstmtDelete->bindParam(1, $company['id']);
                    $pstmtDelete->execute();

                    $conn->commit();
                    echo json_encode(['success' => true, 'message' => $message]);
                } catch (Exception $e) {
                    $sqlDelete = "DELETE FROM companyowners WHERE companyOwnerID = ?";
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
