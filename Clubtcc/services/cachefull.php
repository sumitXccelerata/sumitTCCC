<?php 

$memcache = new Memcache;
$memcache->connect('127.0.0.1', 11211) or die ("Could not connect Memcache");
$memcache->flush();
echo "yes";
?>