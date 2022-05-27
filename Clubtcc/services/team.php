<?php 
	include("includes/db.php");
	include("includes/functions.php");
	$type = "default";
	if(!empty($_REQUEST['type']))$type = $_REQUEST['type'];
	
	switch($type)
	{	
		case "create":
			$result = createTeam($_REQUEST,$memcache);	
			break;
		
		case "update":
			$result = updateTeam($_REQUEST,$memcache);	
			break;
		
		case "delete":
			$result = deleteTeam($_REQUEST,$memcache);	
			break;
			
		case "list":
			$result = listTeam($_REQUEST,$memcache);	
			break;
			
		case "uploadpic":
			$result = uploadPicTeam($_REQUEST,$memcache);	
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
	
	/* create Team  */
	//url = /team.php?type=create&team_name=&team_logo=&team_small_name=&team_cat=
	function createTeam($req,$memcache)
	{
		$arry =  array();

		if(empty($req['team_name']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Team Name.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		/*if(empty($req['team_logo']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Team Logo.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}*/
		$team_logo = "images/team_default.png";
		if(!empty($req['team_logo']))$team_logo = $req['team_logo'];
		if(empty($req['team_small_name']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Team Small Name.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		if(empty($req['team_cat_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Team Category.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		$arry['status'] = "false";
		$arry['msg'] = "Team name already exists, please choose another.";
		$favexits = mysql_query("select team_id from team where team_name='".$req['team_name']."'");
		if(mysql_num_rows($favexits) <= 0)
		{
			$query =  mysql_query("INSERT INTO team(team_name, team_logo, team_small_name, team_cat,description) VALUES ('".$req['team_name']."','".$team_logo."','".$req['team_small_name']."',".$req['team_cat_id'].",'".$req['description']."')");
			if(mysql_insert_id()>0)
			{
				$arry['status'] = "true";
				$arry['msg'] = "Team added successfully.";
				$arry['team_id'] = mysql_insert_id();
				$memcache->delete("teamListall");
				$memcache->delete("teamList1");
				$memcache->delete("teamList2");
			}
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* update team  */
	//url = /team.php?type=update&team_id=&team_name=&team_logo=&team_small_name=&team_cat_id=
	function updateTeam($req,$memcache)
	{
		$arry =  array();
		
		if(empty($req['team_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Team ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		$arry['status'] = "false";
		$arry['msg'] = "Incorrect/Invalid Details.";
		
		$set = "";
		if(!empty($req['team_name'])) $set .= "team_name='".mysql_escape_string($req['team_name'])."',";
		if(!empty($req['team_logo'])) $set .= "team_logo='".$req['team_logo']."',";
		if(!empty($req['team_small_name'])) $set .= "team_small_name='".$req['team_small_name']."',";
		if(!empty($req['description'])) $set .= "description='".$req['description']."',";
		if(!empty($req['team_cat'])) $set .= "team_cat=".$req['team_cat_id'].",";
		if(!empty($req['status'])) $set .= "status=".$req['status'].",";
		
		if(!empty($set))
		{
			$setValue = rtrim($set,',');
			$query =  mysql_query("update team set ".$setValue." where team_id = ".$req['team_id']);
			if(mysql_affected_rows()>0)
			{
				$arry['status'] = "true";
				$arry['msg'] = "Team updated successfully.";
				$memcache->delete("teamListall");
				$memcache->delete("teamList1");
				$memcache->delete("teamList2");
				$memcache->delete("teamNameById".$req['team_id']);
				$memcache->delete("teamSmallNameById".$req['team_id']);
			}
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* delete team  */
	//url = /team.php?type=delete&team_id=
	function deleteTeam($req,$memcache)
	{
		$arry =  array();
		if(empty($req['team_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Team ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		$arry['status'] = "false";
		$arry['msg'] = "Incorrect/Invalid Details.";
		$query =  mysql_query("delete from team where team_id = ".$req['team_id']);
		if(mysql_affected_rows()>0)
		{
			$arry['status'] = "true";
			$arry['msg'] = "Team deleted successfully.";
			$memcache->delete("teamListall");
			$memcache->delete("teamList1");
			$memcache->delete("teamList2");
			$memcache->delete("teamNameById".$req['team_id']);
			$memcache->delete("teamSmallNameById".$req['team_id']);
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* list team  */
	//url = /team.php?type=list&status=
	function listTeam($req,$memcache)
	{
		$status = "all";
		if(!empty($req['status'])) $status = $req['status'];
		
		$key = "teamList".$status;
		$arry = $memcache->get($key);
		if(!$arry)
		{
			$arry =  array();
			$lists = array(); 
			$where = ""; 
			if($status != "all")  $where="where status=$status";
			$query =  mysql_query("select t.* from team t $where order by t.team_id desc");
			if(mysql_num_rows($query) > 0)
			{
				while($row = mysql_fetch_object($query))
				{
					$list = array();
					foreach($row as $column_name=>$column_value){
						$list[$column_name] = $column_value;
					}
					$list['team_category_title'] = getCategoryBYId($memcache,$row->team_cat);
					$list['team_logo'] = "images/team_default.png";
					if($row->team_logo !="")$list['team_logo'] = $row->team_logo;
					$lists[]= $list;
					$memcache->set("teamNameById".$row->team_id,$row->team_name,0,0);
					$memcache->set("teamSmallNameById".$row->team_id,$row->team_small_name,0,0);
				}
			}
			$arry['msg'] = "Team list.";
			$arry["list"] = $lists;
			$arry['status'] = "true";
			$memcache->set($key, $arry, 0,0);
		}
		return json_encode($arry);
	}
	
	/* upload pic for team  */
	//url = /team.php?type=uploadpic
	function uploadPicTeam($req,$memcache)
	{
		$arry =  array();
		$picPath = '';
		if(!empty($_FILES)) $picPath = file_upload("team",$_FILES,$req);
		$arry['status'] = "true";
		$arry['team_logo'] = $picPath;
		logToFile('admin',"file uploaded successfuly.");
		return json_encode($arry);
	}
?>