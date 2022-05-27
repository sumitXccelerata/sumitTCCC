<?php 

$memcache = new Memcache;
$memcache->connect('127.0.0.1', 11211) or die ("Could not connect Memcache");
if(!empty($_REQUEST['key'])) $memcache->delete($_REQUEST['key']);
echo "yes";
?>