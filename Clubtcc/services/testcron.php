<?php 
	include("includes/db.php");
	include("includes/functions.php");
	$body = "smtp test mail.";
	sendMail($_REQUEST['key'],$body,array(),"smtp test mail...");
?>