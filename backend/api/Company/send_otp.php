<?php

include '../config/cors.php';
include '../Connection/connection.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../Phpmailer/src/Exception.php';
require '../Phpmailer/src/PHPMailer.php';
require '../Phpmailer/src/SMTP.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    if (isset($data->email)) {
        $email = $data->email;
        $fname = $data->fname;
        $message = $data->message;
        $subject = $data->subject;
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
            $mail = new PHPMailer(true);

            require_once '../../config/email_config.php';
            $emailConfig = EmailConfig::validateConfig();
            
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
                $mail->Subject = $subject;
                $mail->Body    = "Dear $fname,<br><br>Your verification pin : $duplicatepin <br><br> $message";
                // $mail->AltBody = "Dear $fname,\n\nYour account login password is: $duplicatePassword\n\nYou can now log in to your account using your email ($email) and password.";

                $mail->send();
                $message = "OTP sent successfully .";
                echo json_encode([
                    'success' => true,
                    'message' => $duplicatepin, // Ensure this sends the OTP correctly
                ]);
            } catch (Exception $e) {

                $message = " email could not be sent. Mailer Error: {$mail->ErrorInfo}";
                error_log($message);
                echo json_encode(['success' => false, 'message' => $message]);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'not find password code']);
        }
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
