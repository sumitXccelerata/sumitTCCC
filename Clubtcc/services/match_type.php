<?php 
	include("includes/db.php");
	include("includes/functions.php");
	$type = "default";
	if(!empty($_REQUEST['type']))$type = $_REQUEST['type'];
	
	switch($type)
	{	
		case "create":
			$result = createMatch_Type($_REQUEST,$memcache);	
			break;
		
		case "update":
			$result = updateMatch_Type($_REQUEST,$memcache);	
			break;
		
		case "delete":
			$result = deleteMatch_Type($_REQUEST,$memcache);	
			break;
			
		case "list":
			$result = listMatch_Type($_REQUEST,$memcache);	
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
	
	/* create Match_Type  */
	//url = /match_type.php?type=create&match_type_title=
	function createMatch_Type($req,$memcache)
	{
		$arry =  array();

		if(empty($req['match_type_title']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Match Type.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		$arry['status'] = "false";
		$arry['msg'] = "Match Type already exists, please choose another.";
		$favexits = mysql_query("select match_type_id from match_type where match_type_title='".$req['match_type_title']."'");
		if(mysql_num_rows($favexits) <= 0)
		{
			$query =  mysql_query("INSERT INTO match_type(match_type_title) VALUES ('".$req['match_type_title']."')");
			if(mysql_insert_id()>0)
			{
				$arry['status'] = "true";
				$arry['msg'] = "Match Type added successfully.";
				$arry['match_type_id'] = mysql_insert_id();
				$memcache->delete("matchTypeList");
			}
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* update match type  */
	//url = /match_type.php?type=update&match_type_id=&match_type_title
	function updateMatch_Type($req,$memcache)
	{
		$arry =  array();
		
		if(empty($req['match_type_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Match Type ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		$arry['status'] = "false";
		$arry['msg'] = "Incorrect/Invalid Details.";
		
		$set = "";
		if(!empty($req['match_type_title'])) $set .= "match_type_title='".mysql_escape_string($req['match_type_title'])."',";
		
		if(!empty($set))
		{
			$setValue = rtrim($set,',');
			$query =  mysql_query("update match_type set ".$setValue." where match_type_id = ".$req['match_type_id']);
			if(mysql_affected_rows()>0)
			{
				$arry['status'] = "true";
				$arry['msg'] = "Match Type updated successfully.";
				$memcache->delete("matchTypeList");
				$memcache->delete("matchTypeById".$req['match_type_id']);
			}
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* delete match type  */
	//url = /match_type.php?type=delete&match_type_id=
	function deleteMatch_Type($req,$memcache)
	{
		$arry =  array();
		if(empty($req['match_type_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Match Type ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		$arry['status'] = "false";
		$arry['msg'] = "Incorrect/Invalid Details.";
		$query =  mysql_query("delete from match_type where match_type_id = ".$req['match_type_id']);
		if(mysql_affected_rows()>0)
		{
			$arry['status'] = "true";
			$arry['msg'] = "Match Type deleted successfully.";
			$memcache->delete("matchTypeList");
			$memcache->delete("matchTypeById".$req['match_type_id']);
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* list match type  */
	//url = /match_type.php?type=list
	function listMatch_Type($req,$memcache)
	{
		$key = "matchTypeList";
		$arry = $memcache->get($key);
		if(!$arry)
		{
			$arry =  array();
			$lists = array(); 
			$query =  mysql_query("select t.* from match_type t order by t.match_type_id desc");
			if(mysql_num_rows($query) > 0)
			{
				while($row = mysql_fetch_object($query))
				{
					$list = array();
					foreach($row as $column_name=>$column_value){
						$list[$column_name] = $column_value;
					}
					$lists[]= $list;
					$memcache->set("matchTypeById".$row->match_type_id, $row->match_type_title, 0,0);
				}
			}
			$arry['msg'] = "Match Type list.";
			$arry["list"] = $lists;
			$arry['status'] = "true";
			$memcache->set($key, $arry, 0,0);
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}

?>