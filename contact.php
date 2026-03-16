<?php
// Set headers to allow JSON response
header('Content-Type: application/json');

// 1. Securely store your Cloudflare Turnstile key
$turnstile_secret = '0x4AAAAAACrjup8sIbiLP1XNztDGeq2T_2M';

// 2. Grab the data sent from the frontend form
$name = strip_tags($_POST['name'] ?? '');
$company = strip_tags($_POST['company'] ?? '');
$email = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
$message = strip_tags($_POST['message'] ?? '');
$turnstile_response = $_POST['cf-turnstile-response'] ?? '';

// 3. Verify the Turnstile Token with Cloudflare
$verify_url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
$verify_data = [
    'secret' => $turnstile_secret,
    'response' => $turnstile_response
];

$ch = curl_init($verify_url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($verify_data));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$cf_response = curl_exec($ch);
curl_close($ch);

$cf_result = json_decode($cf_response);

if (!$cf_result->success) {
    // Bot detected
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Security check failed. Please try again.']);
    exit;
}

// 4. Format the email for Xneelo's native mail server
$to = 'info@clasp.co.za';
$subject = "New IT Assessment Request from $name ($company)";

// The HTML email body
$html_message = "
<html>
<head><title>New Assessment Request</title></head>
<body>
    <h2>New Assessment Request</h2>
    <p><strong>Name:</strong> $name</p>
    <p><strong>FSP Name:</strong> $company</p>
    <p><strong>Work Email:</strong> $email</p>
    <p><strong>Compliance Status:</strong><br/> " . nl2br(htmlspecialchars($message)) . "</p>
</body>
</html>
";

// Required headers for HTML email and proper routing
// Note: The "From" address MUST be a real email address hosted on your Xneelo account
$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-type: text/html; charset=UTF-8\r\n";
$headers .= "From: website@clasp.co.za\r\n"; 
$headers .= "Reply-To: $email\r\n";

// 5. Send the email using PHP's built-in mail function
$mail_sent = mail($to, $subject, $html_message, $headers);

// 6. Send success or error message back to the website UI
if ($mail_sent) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Server failed to send email.']);
}
?>