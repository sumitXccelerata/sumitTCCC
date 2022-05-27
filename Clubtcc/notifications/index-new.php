<?php
//error_reporting(0);
// error_reporting(E_ALL & ~E_WARNING);
if(isset($_REQUEST['input'])):
$url="http://85.154.44.62/EMeeting_UI/api/Meeting/Notification?input=".$_REQUEST['input'];
	$curl = curl_init();
		// Set some options - we are passing in a useragent too here
		curl_setopt_array($curl, array(
			CURLOPT_RETURNTRANSFER => 1,
			CURLOPT_URL => $url,
			CURLOPT_USERAGENT => 'Codular Sample cURL Request'
		));
		// Send the request & save response to $resp
		$resp = curl_exec($curl);
		$pdata = json_decode($resp,true);
print_r($pdata);
foreach($pdata as $rs)
{
if($rs['UDID'] != "(null)"):
echo $rs['UDID'];
endif;
}	
exit;	
curl_close($curl);
$passphrase = 'emeeting@123';
//$xml = file_get_contents($lang);
// SimpleXML seems to have problems with the colon ":" in the <xxx:yyy> response tags, so take them out 

$stream_context = stream_context_create();
$ctx = stream_context_create();
stream_context_set_option($ctx, 'ssl', 'local_cert', 'ck_lat.pem');
stream_context_set_option($ctx, 'ssl', 'passphrase',$passphrase);

// Open a connection to the APNS server
$fp = stream_socket_client(
	'ssl://gateway.sandbox.push.apple.com:2195', $err,
	$errstr, 60, STREAM_CLIENT_CONNECT|STREAM_CLIENT_PERSISTENT, $ctx);

if (!$fp)
	exit("Failed to connect: $err $errstr" . PHP_EOL);

//echo 'Connected to APNS' . PHP_EOL;
foreach($pdata as $rs)
{
if($rs['UDID'] != "(null)"):
//echo $rs['UDID'];
$deviceToken=(string)$rs['UDID'];
	$body['aps'] = array(
	'alert' => $rs['Notification'],
	'sound' => 'default');
// Encode the payload as JSON
$payload = json_encode($body);
// Build the binary notification
$msg = chr(0) . pack('n', 32) . pack('H*', $deviceToken) . pack('n', strlen($payload)) . $payload;
$result = fwrite($fp, $msg, strlen($msg));
if (!$result)
{
	echo 'Message not delivered' . PHP_EOL;
}
endif;
}
// Close the connection to the server
echo "SUCCESS";
fclose($fp);
else:
echo "Invalid access";
endif;
?>