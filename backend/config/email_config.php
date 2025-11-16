<?php
/**
 * Email Configuration
 * Store email credentials securely using environment variables
 */

// Load environment variables
require_once __DIR__ . '/env_loader.php';

class EmailConfig {
    public static function getConfig() {
        return [
            'smtp_host' => $_ENV['SMTP_HOST'] ?? 'smtp.gmail.com',
            'smtp_port' => $_ENV['SMTP_PORT'] ?? 587,
            'smtp_username' => $_ENV['SMTP_USERNAME'] ?? '',
            'smtp_password' => $_ENV['SMTP_PASSWORD'] ?? '',
            'from_email' => $_ENV['FROM_EMAIL'] ?? '',
            'from_name' => $_ENV['FROM_NAME'] ?? 'Admin of Elitez'
        ];
    }
    
    public static function validateConfig() {
        $config = self::getConfig();
        if (empty($config['smtp_username']) || empty($config['smtp_password'])) {
            throw new Exception('Email credentials not configured. Please set SMTP_USERNAME and SMTP_PASSWORD environment variables.');
        }
        return $config;
    }
}
?>
