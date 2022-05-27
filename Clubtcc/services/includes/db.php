<?php
ob_start();
//$hostname = "localhost"; 
//$database = "cricketdb"; //The name of the database
//$username = "root"; //The username for the database
//$password = "Passw0rd"; // The password for the database
//$username = "cricketDB"; //The username for the database
//$password = "Cricket@3103"; // The password for the database

//$con = mysql_connect($hostname, $username, $password) or die("1. Open db.php and edit mysql variables.");
//mysql_select_db($database, $con);

//$memcache = new Memcache;

//$memcache->connect('127.0.0.1', 11211) or die ("Could not connect Memcache");

//ob_start();
//$hostname = "202.65.153.12"; 
$hostname = "198.71.231.47"; 
$database = "clubtccca"; //The name of the database
//$username = "root"; //The username for the database
//$password = "password"; // The password for the database
$username = "clubtcc"; //The username for the database
$password = "iton@123!"; // The password for the database

$con = mysql_connect($hostname, $username, $password) or die("1. Open db.php and edit mysql variables.");
mysql_select_db($database, $con);

$memcache = new Memcache;

$memcache->connect('198.71.231.47', 11211) or die ("Could not connect Memcache");
?>