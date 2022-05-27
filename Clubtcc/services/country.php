<?php 
include("includes/db.php");
	include("includes/functions.php");
	$type = "default";
	if(!empty($_REQUEST['type']))$type = $_REQUEST['type'];
	
	switch($type)
	{
		case "list":
			$result = getList($_REQUEST,$memcache);	
			break;
			
		case "default":
			$arry =  array();
			$arry['status'] = "false";
			$arry['msg'] = "Invalid Type";
			$result = json_encode($arry);
			break;		
	}
	ob_clean();
echo $result;
	
	//url = /country.php?type=list
	function getList($req,$memcache)
	{
		$key = "countryList";
		$arry = $memcache->get($key);
		if(!$arry)
		{
			$arry = array();
			$arry['status'] = "false";
			$query128 =  mysql_query("select * from country where phonecode!=0 order by name asc");
			$lists= array();
			if(mysql_num_rows($query128) > 0)
			{
				while($row = mysql_fetch_object($query128))
				{
					$list = array();
					foreach($row as $column_name=>$column_value){
						$list[$column_name] = $column_value;
					}
					$lists[]= $list;
					$memcache->set("countryNameById".$row->id,$row->name,0,0);
				}
			}	
			$arry['status'] = "true";
			$arry["list"] = $lists;
			$memcache->set($key, $arry, 0,0);
		}

		return json_encode($arry);
	}
	/*
		$key = "userDetails".$req['uId'];
		$arry = $memcache->get($key);
		if(!$arry)
		{
			$memcache->set($key, $arry, 0,0);
		}
		$memcache->delete($key);
	*/
	?>

