<?php
header('Content-Type: application/json');

$turnstile_secret = '0x4AAAAAACrjup8sIbiLP1XNztDGeq2T_2M';

// Grab form fields
$name    = strip_tags($_POST['name']    ?? '');
$company = strip_tags($_POST['company'] ?? '');
$role    = strip_tags($_POST['role']    ?? '');
$email   = filter_var($_POST['email']   ?? '', FILTER_SANITIZE_EMAIL);
$message = strip_tags($_POST['message'] ?? '');
$turnstile_response = $_POST['cf-turnstile-response'] ?? '';

// Basic validation
if (empty($name) || empty($email)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Name and email are required.']);
    exit;
}

// Verify Turnstile only if a token was submitted (widget present on page)
if (!empty($turnstile_response)) {
    $ch = curl_init('https://challenges.cloudflare.com/turnstile/v0/siteverify');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
        'secret'   => $turnstile_secret,
        'response' => $turnstile_response,
    ]));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $cf_result = json_decode(curl_exec($ch));
    curl_close($ch);

    if (!$cf_result->success) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Security check failed. Please try again.']);
        exit;
    }
}

// Build email
$to      = 'info@clasp.co.za';
$subject = "New enquiry from $name" . ($company ? " ($company)" : '');

$html_message = "
<html><head><title>New Enquiry</title></head>
<body>
  <h2>New Enquiry from CLASP Website</h2>
  <p><strong>Name:</strong> " . htmlspecialchars($name) . "</p>
  <p><strong>Institution:</strong> " . htmlspecialchars($company) . "</p>
  <p><strong>Role:</strong> " . htmlspecialchars($role) . "</p>
  <p><strong>Email:</strong> " . htmlspecialchars($email) . "</p>
  <p><strong>Message:</strong><br>" . nl2br(htmlspecialchars($message)) . "</p>
</body></html>
";

$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-type: text/html; charset=UTF-8\r\n";
$headers .= "From: info@clasp.co.za\r\n";
$headers .= "Reply-To: $email\r\n";

$mail_sent = mail($to, $subject, $html_message, $headers);

if ($mail_sent) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Server failed to send email.']);
}
?>
