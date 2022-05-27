<?php
ini_set("error_reporting",E_ALL);
// Put your device token here (without spaces):
$deviceToken = "943250cfffc17f8edfa8edb7bbd915978c45bb8c3846ffa6e7eed7097ed087d2";
//2b523c35e3a38dcecbd4ae38d2d79a3bfd631e7b818cffc43ed569966381b7fd
// Put your private key's passphrase here:
$passphrase = "viatuktuk123";

// Put your alert message here:
$message = 'viatuktuk test notification new one';

////////////////////////////////////////////////////////////////////////////////

$ctx = stream_context_create();
stream_context_set_option($ctx, 'ssl', 'local_cert', '/home/tixony/public_html/services/includes/ck.pem');
stream_context_set_option($ctx, 'ssl', 'passphrase', $passphrase);

// Open a connection to the APNS server
$fp = stream_socket_client(
	'ssl://gateway.push.apple.com:2195', $err,
	$errstr, 60, STREAM_CLIENT_CONNECT|STREAM_CLIENT_PERSISTENT, $ctx);

if (!$fp)
	exit("Failed to connect: $err $errstr" . PHP_EOL);

echo 'Connected to APNS' . PHP_EOL;

// Create the payload body
$body['aps'] = array(
	'alert' => $message,
	'sound' => 'default'
	);

// Encode the payload as JSON
$payload = json_encode($body);

// Build the binary notification
$msg = chr(0) . pack('n', 32) . pack('H*', $deviceToken) . pack('n', strlen($payload)) . $payload;

// Send it to the server
$result = fwrite($fp, $msg, strlen($msg));

if (!$result)
	echo 'Message not delivered' . PHP_EOL;
else
	echo 'Message successfully delivered' . PHP_EOL;

// Close the connection to the server
fclose($fp);
?>