<?php
include("includes/db.php");
	include("includes/functions.php");
	//mail( "satyakishore.garapati@gmail.com", "test",$message, "From:support@vaituktuk.com" );
	//smtpmailer("satya.g@iton.com", "support@vaituktuk.com", "cricket","test", "Registration mail from Toronto City Cricket Club", $is_gmail = false);
sendMail("satya.g@iton.com","test",array(),"Registration mail from Toronto City Cricket Club");
?>