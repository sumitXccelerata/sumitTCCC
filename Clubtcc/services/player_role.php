<?php 
	include("includes/db.php");
	include("includes/functions.php");
	$type = "default";
	if(!empty($_REQUEST['type']))$type = $_REQUEST['type'];
	
	switch($type)
	{	
		case "create":
			$result = createPlayer_Role($_REQUEST,$memcache);	
			break;
		
		case "update":
			$result = updatePlayer_Role($_REQUEST,$memcache);	
			break;
		
		case "delete":
			$result = deletePlayer_Role($_REQUEST,$memcache);	
			break;
			
		case "list":
			$result = listPlayer_Role($_REQUEST,$memcache);	
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
	
	/* create Player_Role  */
	//url = /player_role.php?type=create&player_role_title=
	function createPlayer_Role($req,$memcache)
	{
		$arry =  array();

		if(empty($req['player_role_title']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Player Role.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		$arry['status'] = "false";
		$arry['msg'] = "Player Role already exists, please choose another.";
		$favexits = mysql_query("select player_role_id from player_role where player_role_title='".$req['player_role_title']."'");
		//echo "select player_role_id from player_role where player_role_title='".$req['player_role_title']."'";
		if(mysql_num_rows($favexits) <= 0)
		{
			$query =  mysql_query("INSERT INTO player_role(player_role_title) VALUES ('".$req['player_role_title']."')");
			//echo "INSERT INTO player_role(player_role_title) VALUES ('".$req['player_role_title']."')";
			if(mysql_insert_id()>0)
			{
				$arry['status'] = "true";
				$arry['msg'] = "Player Role added successfully.";
				$arry['player_role_id'] = mysql_insert_id();
				$memcache->delete("playerRoleList");
			}
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* update match type  */
	//url = /player_role.php?type=update&player_role_id=&player_role_title
	function updatePlayer_Role($req,$memcache)
	{
		$arry =  array();
		
		if(empty($req['player_role_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Player Role ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		$arry['status'] = "false";
		$arry['msg'] = "Incorrect/Invalid Details.";
		
		$set = "";
		if(!empty($req['player_role_title'])) $set .= "player_role_title='".mysql_escape_string($req['player_role_title'])."',";
		
		if(!empty($set))
		{
			$setValue = rtrim($set,',');
			$query =  mysql_query("update player_role set ".$setValue." where player_role_id = ".$req['player_role_id']);
			if(mysql_affected_rows()>0)
			{
				$arry['status'] = "true";
				$arry['msg'] = "Player Role updated successfully.";
				$memcache->delete("playerRoleList");
				$memcache->delete("playerRoleById".$req['player_role_id']);
			}
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* delete match type  */
	//url = /player_role.php?type=delete&player_role_id=
	function deletePlayer_Role($req,$memcache)
	{
		$arry =  array();
		if(empty($req['player_role_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Player Role ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		$arry['status'] = "false";
		$arry['msg'] = "Incorrect/Invalid Details.";
		$query =  mysql_query("delete from player_role where player_role_id = ".$req['player_role_id']);
		if(mysql_affected_rows()>0)
		{
			$arry['status'] = "true";
			$arry['msg'] = "Player Role deleted successfully.";
			$memcache->delete("playerRoleList");
			$memcache->delete("playerRoleById".$req['player_role_id']);
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* list match type  */
	//url = /player_role.php?type=list
	function listPlayer_Role($req,$memcache)
	{
		$key = "playerRoleList";
		$arry = $memcache->get($key);
		if(!$arry)
		{
			$arry =  array();
			$lists = array(); 
			$query =  mysql_query("select t.* from player_role t order by t.player_role_id desc");
			if(mysql_num_rows($query) > 0)
			{
				while($row = mysql_fetch_object($query))
				{
					$list = array();
					foreach($row as $column_name=>$column_value){
						$list[$column_name] = $column_value;
					}
					$lists[]= $list;
					$memcache->set("playerRoleById".$row->player_role_id, $row->player_role_title, 0,0);
				}
			}
			$arry['msg'] = "Player Role list.";
			$arry["list"] = $lists;
			$arry['status'] = "true";
			$memcache->set($key, $arry, 0,0);
		}
		return json_encode($arry);
	}

?>