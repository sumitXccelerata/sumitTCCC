<?php
require_once('mailer/class.phpmailer.php');
function smtpmailerwithattachment($to, $from, $from_name, $subject, $body,$attachment, $is_gmail = false) { 
	global $error;
	$mail = new PHPMailer();
	//$mail->SMTPDebug = 2;
	$mail->SMTPAuth = true; 
	$mail->IsHTML();
	$mail->Username = 'support@clubtcc.ca';
	$mail->Password = 'iton@123'; 
	if ($is_gmail) {
		$mail->SMTPSecure = 'tls'; 
		$mail->IsSMTP();
		$mail->SMTPAuth = true; 
		$mail->Host = 'smtp.gmail.com';
		$mail->Port = 587;  
		$mail->Username = '';  
		$mail->Password = '';   
	} else {
		$mail->SMTPSecure = 'ssl'; 
		$mail->Host = 'p3plcpnl0552.prod.phx3.secureserver.net:465';
	}  
	$mail->SetFrom($from, $from_name);
	$mail->Subject = $subject;
	$mail->Body = $body;
	$mail->AddAddress($to);
	$mail->AddAttachment($attachment);
	//echo $to;
	//echo $mail->Send();
	if(!$mail->Send()) {
		$error = 'Mail error: '.$mail->ErrorInfo;
		//echo $error;
		return false;
	} else {
		$error = 'Message sent!';
		//echo $error;
		return true;
		
	}
}
?>