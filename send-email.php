<?php
// Enable error reporting for debugging (remove in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set response header
header('Content-Type: application/json');

// Check if form was submitted via POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

// Sanitize and validate input
$name = isset($_POST['name']) ? trim(strip_tags($_POST['name'])) : '';
$email = isset($_POST['email']) ? trim(strip_tags($_POST['email'])) : '';
$phone = isset($_POST['phone']) ? trim(strip_tags($_POST['phone'])) : '';
$service = isset($_POST['service']) ? trim(strip_tags($_POST['service'])) : '';
$message = isset($_POST['message']) ? trim(strip_tags($_POST['message'])) : '';

// Validate required fields
if (empty($name) || empty($email) || empty($message)) {
    echo json_encode(['success' => false, 'message' => 'Please fill in all required fields.']);
    exit;
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Please enter a valid email address.']);
    exit;
}

// Email configuration
$to = 'k.a.waters65@gmail.com';
$subject = 'New Enquiry from Waters Earthmoving Website';

// Build email body
$emailBody = "New enquiry received from Waters Earthmoving website\n\n";
$emailBody .= "Name: " . $name . "\n";
$emailBody .= "Email: " . $email . "\n";
$emailBody .= "Phone: " . ($phone ?: 'Not provided') . "\n";
$emailBody .= "Service: " . ($service ?: 'Not specified') . "\n\n";
$emailBody .= "Message:\n" . $message . "\n";

// Build HTML email body
$htmlBody = "
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #d4a017; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #d4a017; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>New Enquiry - Waters Earthmoving</h2>
        </div>
        <div class='content'>
            <div class='field'>
                <span class='label'>Name:</span> {$name}
            </div>
            <div class='field'>
                <span class='label'>Email:</span> {$email}
            </div>
            <div class='field'>
                <span class='label'>Phone:</span> " . ($phone ?: 'Not provided') . "
            </div>
            <div class='field'>
                <span class='label'>Service Enquiry:</span> " . ($service ?: 'Not specified') . "
            </div>
            <div class='field'>
                <span class='label'>Message:</span><br>
                " . nl2br(htmlspecialchars($message)) . "
            </div>
        </div>
        <div class='footer'>
            This enquiry was submitted from the Waters Earthmoving website contact form.
        </div>
    </div>
</body>
</html>
";

// Email headers
$headers = "From: Waters Earthmoving <noreply@watersearthmoving.com.au>\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: multipart/alternative; boundary=\"boundary-string\"\r\n";

// Build multipart email
$emailMessage = "--boundary-string\r\n";
$emailMessage .= "Content-Type: text/plain; charset=UTF-8\r\n";
$emailMessage .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
$emailMessage .= $emailBody . "\r\n";
$emailMessage .= "--boundary-string\r\n";
$emailMessage .= "Content-Type: text/html; charset=UTF-8\r\n";
$emailMessage .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
$emailMessage .= $htmlBody . "\r\n";
$emailMessage .= "--boundary-string--";

// Send email using PHP mail() function (works with Hostinger's SMTP)
if (mail($to, $subject, $emailMessage, $headers)) {
    echo json_encode([
        'success' => true, 
        'message' => 'Thank you for your enquiry! We will get back to you shortly.'
    ]);
} else {
    echo json_encode([
        'success' => false, 
        'message' => 'Sorry, there was an error sending your message. Please try calling us directly.'
    ]);
}
?>
