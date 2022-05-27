<?php 
	include("includes/db.php");
	include("includes/functions.php");
	$type = "default";
	if(!empty($_REQUEST['type']))$type = $_REQUEST['type'];
	
	switch($type)
	{	
		case "create":
			$result = createBatting_Style($_REQUEST,$memcache);	
			break;
		
		case "update":
			$result = updateBatting_Style($_REQUEST,$memcache);	
			break;
		
		case "delete":
			$result = deleteBatting_Style($_REQUEST,$memcache);	
			break;
			
		case "list":
			$result = listBatting_Style($_REQUEST,$memcache);	
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
	
	/* create Batting_Style  */
	//url = /bat_style.php?type=create&bat_style_title=
	function createBatting_Style($req,$memcache)
	{
		$arry =  array();

		if(empty($req['bat_style_title']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Batting Style.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		$arry['status'] = "false";
		$arry['msg'] = "Batting Style already exists, please choose another.";
		$favexits = mysql_query("select bat_style_id from bat_style where bat_style_title='".$req['bat_style_title']."'");
		if(mysql_num_rows($favexits) <= 0)
		{
			$query =  mysql_query("INSERT INTO bat_style(bat_style_title) VALUES ('".$req['bat_style_title']."')");
			if(mysql_insert_id()>0)
			{
				$arry['status'] = "true";
				$arry['msg'] = "Batting Style added successfully.";
				$arry['bat_style_id'] = mysql_insert_id();
				$memcache->delete("battingStyleList");
			}
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* update match type  */
	//url = /bat_style.php?type=update&bat_style_id=&bat_style_title
	function updateBatting_Style($req,$memcache)
	{
		$arry =  array();
		
		if(empty($req['bat_style_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Batting Style ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		$arry['status'] = "false";
		$arry['msg'] = "Incorrect/Invalid Details.";
		
		$set = "";
		if(!empty($req['bat_style_title'])) $set .= "bat_style_title='".mysql_escape_string($req['bat_style_title'])."',";
		
		if(!empty($set))
		{
			$setValue = rtrim($set,',');
			$query =  mysql_query("update bat_style set ".$setValue." where bat_style_id = ".$req['bat_style_id']);
			if(mysql_affected_rows()>0)
			{
				$arry['status'] = "true";
				$arry['msg'] = "Batting Style updated successfully.";
				$memcache->delete("battingStyleList");
				$memcache->delete("battingStyleById".$req['bat_style_id']);
			}
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* delete match type  */
	//url = /bat_style.php?type=delete&bat_style_id=
	function deleteBatting_Style($req,$memcache)
	{
		$arry =  array();
		if(empty($req['bat_style_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Batting Style ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		$arry['status'] = "false";
		$arry['msg'] = "Incorrect/Invalid Details.";
		$query =  mysql_query("delete from bat_style where bat_style_id = ".$req['bat_style_id']);
		if(mysql_affected_rows()>0)
		{
			$arry['status'] = "true";
			$arry['msg'] = "Batting Style deleted successfully.";
			$memcache->delete("battingStyleList");
			$memcache->delete("battingStyleById".$req['bat_style_id']);
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* list match type  */
	//url = /bat_style.php?type=list
	function listBatting_Style($req,$memcache)
	{
		$key = "battingStyleList";
		$arry = $memcache->get($key);
		if(!$arry)
		{
			$arry =  array();
			$lists = array(); 
			$query =  mysql_query("select t.* from bat_style t order by t.bat_style_id desc");
			if(mysql_num_rows($query) > 0)
			{
				while($row = mysql_fetch_object($query))
				{
					$list = array();
					foreach($row as $column_name=>$column_value){
						$list[$column_name] = $column_value;
					}
					$lists[]= $list;
					$memcache->set("battingStyleById".$row->bat_style_id, $row->bat_style_title, 0,0);
				}
			}
			$arry['msg'] = "Batting Style list.";
			$arry["list"] = $lists;
			$arry['status'] = "true";
			$memcache->set($key, $arry, 0,0);
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}

?>