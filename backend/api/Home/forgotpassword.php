<?php

include '../config/cors.php';
// header('Content-Type: application/json');
// header('Access-Control-Allow-Origin:*');
// header('Access-Control-Allow-Headers: Content-Type');
// header('Access-Control-Allow-Methods: POST');

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
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    include "../Connection/connection.php";
    include('User.php');
    $data = json_decode(file_get_contents('php://input'), true);
    $email = $data['email'];
     
    $User= new User();
    $userType = $User->getUserType($email);

    if ($userType) {

        switch ($userType) {
            case 'admin':
                $cpsql = "SELECT adminName as fname FROM admins WHERE email =?";
                break;
            case 'customer':
                $cpsql = "SELECT customerName as fname FROM customers WHERE email =?";
                break;
            case 'company':
                $cpsql = "SELECT companyOwnerName as fname FROM companyowners WHERE email =?";
                break;
            default:
                $message = "Invalid user type $userType cheking current password ";
                echo json_encode(['success' => false, 'message' => $message]);
                exit;
            }
            $cpstmt = $conn->prepare($cpsql);
            $cpstmt->bindParam(1, $email);
            $cpstmt->execute();
            $user = $cpstmt->fetch(PDO::FETCH_ASSOC);


    
            $fname = $user['fname'];
            function generateRandomPin($length)
            {
                $code = '0123456789';
                $codeLength = strlen($code);
                $randompin = '';
                for ($i = 0; $i < $length; $i++) {
                    $randompin .= $code[random_int(0, $codeLength - 1)];
                }
                return $randompin;
            }
            $pin = generateRandomPin(6);
            $duplicatepin = $pin;

            if ($duplicatepin) {
                require_once '../../config/email_config.php';
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
                    $mail->Subject = 'Your Password Code';
                    $mail->Body    = "Dear $fname,<br><br>Your Account Password Code is: $duplicatepin.<br><br>You can now log in to your account using your this password code.";
                    // $mail->AltBody = "Dear $fname,\n\nYour account login password is: $duplicatePassword\n\nYou can now log in to your account using your email ($email) and password.";
        
                    $mail->send();
                    $message = "Password Code sent successfully .";
                    // $sqlDelete = "DELETE FROM registration_requests WHERE id = ?";
                    // $pstmtDelete = $conn->prepare($sqlDelete);
                    // $pstmtDelete->bindParam(1, $company['id']);
                    // $pstmtDelete->execute();
        
                    // $conn->commit();
                    echo json_encode(['success' => true, 
                    'message' => $duplicatepin,
                    'userType' => $userType,
                    'email' => $email
                ]);
                } catch (Exception $e) {
                    // $sqlDelete = "DELETE FROM companyowners WHERE companyOwnerID = ?";
                    // $pstmtDelete = $conn->prepare($sqlDelete);
                    // $pstmtDelete->bindParam(1, $ID);
                    // $pstmtDelete->execute();
        
                    $message = " email could not be sent. Mailer Error: {$mail->ErrorInfo}";
                    error_log($message);
                    echo json_encode(['success' => false, 'message' => $message]);
                }
            } else {
                echo json_encode(['success' => false, 'message' => 'not find password code']);
            }
    }else {
        echo json_encode(['success' => false, 'message' => 'email is not exist in Elitez']);
    }


   
}
