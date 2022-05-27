<?php
//error_reporting(0);
// error_reporting(E_ALL & ~E_WARNING);
set_time_limit(0);

date_default_timezone_set("Asia/Calcutta");
$url="http://85.154.44.62/EMeeting_UI/api/Meeting/BeforeOnedayNotification";
//$url="http://10.10.8.105/EMeetingAPI/api/Meeting/BeforeOnedayNotification";
	$curl = curl_init();
		// Set some options - we are passing in a useragent too here
		curl_setopt_array($curl, array(
			CURLOPT_RETURNTRANSFER => 1,
			CURLOPT_URL => $url,
			CURLOPT_USERAGENT => 'Codular Sample cURL Request'
		));
		// Send the request & save response to $resp
		$resp = curl_exec($curl);
		//print_r($resp);
		//$dt=json_decode($resp);
		$pdata = json_decode($resp,true);
foreach($pdata as $n => $value)
{
	@$pdata[$n]['yaml'] = urldecode($value['yaml']);
}
curl_close($curl);
$passphrase = 'emeeting@123';
//$xml = file_get_contents($lang);
// SimpleXML seems to have problems with the colon ":" in the <xxx:yyy> response tags, so take them out 

$stream_context = stream_context_create();
$ctx = stream_context_create();
stream_context_set_option($ctx, 'ssl', 'local_cert', 'C:/xampp/htdocs/Notifications/ck.pem');
stream_context_set_option($ctx, 'ssl', 'passphrase',$passphrase);

// Open a connection to the APNS server
$fp = stream_socket_client(
	'ssl://gateway.push.apple.com:2195', $err,
	$errstr, 60, STREAM_CLIENT_CONNECT|STREAM_CLIENT_PERSISTENT, $ctx);

if (!$fp)
	exit("Failed to connect: $err $errstr" . PHP_EOL);

//echo 'Connected to APNS' . PHP_EOL;
$i=1;
//'badge' => $badge,
$badge = 1;
$file = fopen("logs.txt","w");
fwrite($file,"Timestamp---".date("F j, Y, g:i a")."\n");
if (! empty($pdata)) {
foreach($pdata as $rs)
{
$logmsg =$i;
$deviceToken=(string)$rs['UDID'];
$logmsg .= $deviceToken;
	$body['aps'] = array(
	'alert' => $rs['Notification'],
	'sound' => 'default');
// Encode the payload as JSON
$payload = json_encode($body);
// Build the binary notification
$msg = chr(0) . pack('n', 32) . pack('H*', $deviceToken) . pack('n', strlen($payload)) . $payload;
$logmsg .="**".$msg."**";
$result = fwrite($fp, $msg, strlen($msg));
if (!$result)
{
	echo 'Message not delivered' . PHP_EOL;
	$sus='Message not delivered' .'***'	;
}
else
{
$i++;
$sus='Message delivered' .'***';	
}
$logmsg .= $sus ;
//echo $logmsg;
fwrite($file,$logmsg);
}
}
fwrite($file,"Total sent messages".$i."\n");
// Close the connection to the server
echo "SUCCESS";
fclose($file);
fclose($fp);
set_time_limit(30);
?>