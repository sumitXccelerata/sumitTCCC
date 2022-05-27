<?php 
	include("includes/db.php");
	include("includes/functions.php");
	$type = "default";
	if(!empty($_REQUEST['type']))$type = $_REQUEST['type'];
	
	switch($type)
	{	
		case "create":
			$result = createBowling_Style($_REQUEST,$memcache);	
			break;
		
		case "update":
			$result = updateBowling_Style($_REQUEST,$memcache);	
			break;
		
		case "delete":
			$result = deleteBowling_Style($_REQUEST,$memcache);	
			break;
			
		case "list":
			$result = listBowling_Style($_REQUEST,$memcache);	
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
	
	/* create Bowling_Style  */
	//url = /bowl_style.php?type=create&bowl_style_title=
	function createBowling_Style($req,$memcache)
	{
		$arry =  array();

		if(empty($req['bowl_style_title']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Bowling Style.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		$arry['status'] = "false";
		$arry['msg'] = "Bowling Style already exists, please choose another.";
		$favexits = mysql_query("select bowl_style_id from bowl_style where bowl_style_title='".$req['bowl_style_title']."'");
		if(mysql_num_rows($favexits) <= 0)
		{
			$query =  mysql_query("INSERT INTO bowl_style(bowl_style_title) VALUES ('".$req['bowl_style_title']."')");
			if(mysql_insert_id()>0)
			{
				$arry['status'] = "true";
				$arry['msg'] = "Bowling Style added successfully.";
				$arry['bowl_style_id'] = mysql_insert_id();
				$memcache->delete("bowlingStyleList");
			}
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* update match type  */
	//url = /bowl_style.php?type=update&bowl_style_id=&bowl_style_title
	function updateBowling_Style($req,$memcache)
	{
		$arry =  array();
		
		if(empty($req['bowl_style_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Bowling Style ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		$arry['status'] = "false";
		$arry['msg'] = "Incorrect/Invalid Details.";
		
		$set = "";
		if(!empty($req['bowl_style_title'])) $set .= "bowl_style_title='".mysql_escape_string($req['bowl_style_title'])."',";
		
		if(!empty($set))
		{
			$setValue = rtrim($set,',');
			$query =  mysql_query("update bowl_style set ".$setValue." where bowl_style_id = ".$req['bowl_style_id']);
			if(mysql_affected_rows()>0)
			{
				$arry['status'] = "true";
				$arry['msg'] = "Bowling Style updated successfully.";
				$memcache->delete("bowlingStyleList");
				$memcache->delete("bowlingStyleById".$req['bowl_style_id']);
			}
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* delete match type  */
	//url = /bowl_style.php?type=delete&bowl_style_id=
	function deleteBowling_Style($req,$memcache)
	{
		$arry =  array();
		if(empty($req['bowl_style_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Bowling Style ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		$arry['status'] = "false";
		$arry['msg'] = "Incorrect/Invalid Details.";
		$query =  mysql_query("delete from bowl_style where bowl_style_id = ".$req['bowl_style_id']);
		if(mysql_affected_rows()>0)
		{
			$arry['status'] = "true";
			$arry['msg'] = "Bowling Style deleted successfully.";
			$memcache->delete("bowlingStyleList");
			$memcache->delete("bowlingStyleById".$req['bowl_style_id']);
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* list match type  */
	//url = /bowl_style.php?type=list
	function listBowling_Style($req,$memcache)
	{
		$key = "bowlingStyleList";
		$arry = $memcache->get($key);
		if(!$arry)
		{
			$arry =  array();
			$lists = array(); 
			$query =  mysql_query("select t.* from bowl_style t order by t.bowl_style_id desc");
			if(mysql_num_rows($query) > 0)
			{
				while($row = mysql_fetch_object($query))
				{
					$list = array();
					foreach($row as $column_name=>$column_value){
						$list[$column_name] = $column_value;
					}
					$lists[]= $list;
					$memcache->set("bowlingStyleById".$row->bowl_style_id, $row->bowl_style_title, 0,0);
				}
			}
			$arry['msg'] = "Bowling Style list.";
			$arry["list"] = $lists;
			$arry['status'] = "true";
			$memcache->set($key, $arry, 0,0);
		}
		logToFile($req['uId'], $arry['msg']);
		return json_encode($arry);
	}

?>