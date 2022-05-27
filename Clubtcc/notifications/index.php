<?php
//error_reporting(0);
// error_reporting(E_ALL & ~E_WARNING);
set_time_limit(0);
date_default_timezone_set("Asia/Calcutta");
if(isset($_REQUEST['input']) && isset($_REQUEST['userid'])):
$url="http://85.154.44.62/EMeeting_UI/api/Meeting/Notification?input=".$_REQUEST['input']."&userid=".$_REQUEST['userid'];
//$url="http://103.231.76.10/EMeetingAPI/api/Meeting/Notification?input=".$_REQUEST['input']."&userid=".$_REQUEST['userid'];
	$curl = curl_init();
		// Set some options - we are passing in a useragent too here
		curl_setopt_array($curl, array(
			CURLOPT_RETURNTRANSFER => 1,
			CURLOPT_URL => $url,
			CURLOPT_USERAGENT => 'Codular Sample cURL Request'
		));
		// Send the request & save response to $resp
		$resp = curl_exec($curl);
		//$dt=json_decode($resp);
		//print_r($resp);
		$pdata = json_decode($resp,true);
/*foreach($pdata as $n => $value)
{
	@$pdata[$n]['yaml'] = urldecode($value['yaml']);
} */
curl_close($curl);
$passphrase = 'emeeting@123';
$stream_context = stream_context_create();
$ctx = stream_context_create();
stream_context_set_option($ctx, 'ssl', 'local_cert', 'ck.pem');
stream_context_set_option($ctx, 'ssl', 'passphrase',$passphrase);

// Open a connection to the APNS server
$fp = stream_socket_client(
	'ssl://gateway.push.apple.com:2195', $err,
	$errstr, 60, STREAM_CLIENT_CONNECT|STREAM_CLIENT_PERSISTENT, $ctx);

if (!$fp)
	exit("Failed to connect: $err $errstr" . PHP_EOL);

//echo 'Connected to APNS' . PHP_EOL;
$i=0;
$badge = 1;
//'badge' => $badge,
$file = fopen("logs.txt","a");
fwrite($file,"Timestamp---".date("F j, Y, g:i a")."\n");
foreach($pdata as $rs)
{
$logmsg =$i;

$deviceToken=(string)$rs['UDID'];
echo $deviceToken;
$logmsg .= $deviceToken;
	$body['aps'] = array(
	'alert' => $rs['Notification'],
	'sound' => 'default');
// Encode the payload as JSON
$payload = json_encode($body);
// Build the binary notification
//$msg="sample";
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
fwrite($file,"Total sent messages".$i."\n");
//fwrite($file ,"Total sent messages".$i."\n");
fwrite($file,"\n");
// Close the connection to the server
echo "SUCCESS";
fclose($file);
fclose($fp);
else:
echo "Invalid access";
endif;
set_time_limit(30);
