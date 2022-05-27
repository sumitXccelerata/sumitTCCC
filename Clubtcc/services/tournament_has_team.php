<?php 
	include("includes/db.php");
	include("includes/functions.php");
	$type = "default";
	if(!empty($_REQUEST['type']))$type = $_REQUEST['type'];
	
	switch($type)
	{	
		case "create":
			$result = createTour_Team($_REQUEST,$memcache);	
			break;
		
		case "createmulti":
			$result = createTour_Team_Multi($_REQUEST,$memcache);	
			break;
		
		case "delete":
			$result = deleteTour_Team($_REQUEST,$memcache);	
			break;
			
		case "list":
			$result = listTour_Team($_REQUEST,$memcache);	
			break;
		
		case "listbyteam":
			$result = listTour_ByTeam($_REQUEST,$memcache);	
			break;
			
		case "totallist":
			$result = listTour_TeamTotal($_REQUEST,$memcache);	
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
	
	/* create Tour_Team  */
	//url = /tournament_has_team.php?type=create&tournament_id=&team_id=
	function createTour_Team($req,$memcache)
	{
		$arry =  array();

		if(empty($req['tournament_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Tournament ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		if(empty($req['team_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Team ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		$arry['status'] = "false";
		$arry['msg'] = "Team already exists in Tournament, please choose another.";
		$favexits = mysql_query("select tht_id from tournament_has_team where tournament_id=".$req['tournament_id']." and team_id=".$req['team_id']);
		if(mysql_num_rows($favexits) <= 0)
		{
			$query =  mysql_query("INSERT INTO tournament_has_team(tournament_id,team_id) VALUES (".$req['tournament_id'].",".$req['team_id'].")");
			if(mysql_insert_id()>0)
			{
				$arry['status'] = "true";
				$arry['msg'] = "Tour_Team added successfully.";
				$arry['tht_id'] = mysql_insert_id();
				$memcache->delete("tourTeamList".$req['tournament_id']);
				$memcache->delete("tourlistbyTeam".$req['team_id']);
				$memcache->delete("tourTeamPoints".$req['tournament_id']);
				$memcache->delete("tourTeamPoints");
				$memcache->delete("tourTeamTotaalList");
			}
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* create Tour Team multi  */
	//url = /tournament_has_team.php?type=createmulti&tournament_id=&team_ids=
	function createTour_Team_Multi($req,$memcache)
	{
		$arry =  array();
		$notadd =  array();
		if(empty($req['tournament_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Tournament ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		if(empty($req['team_ids']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Team ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		$team_ids = explode(",",$req['team_ids']);
		foreach($team_ids as $team_id)
		{
			if(!empty($team_id))
			{
				$arry['status'] = "true";
				$favexits = mysql_query("select tht_id from tournament_has_team where tournament_id=".$req['tournament_id']." and team_id=".$team_id);
				if(mysql_num_rows($favexits) <= 0)
				{
					$query =  mysql_query("INSERT INTO tournament_has_team(tournament_id,team_id) VALUES (".$req['tournament_id'].",".$team_id.")");
					if(mysql_insert_id()>0)
					{
						//$arry['status'] = "true";
						$arry['msg'] = "Tour Team added successfully.";
						$arry['tht_id'] = mysql_insert_id();
						$memcache->delete("tourlistbyTeam".$team_id);
					}
				}
				else $notadd[] = $team_id;			
			}
		}
		
		if(!empty($notadd)){ $arry['duplicates'] = implode(",",$notadd); $arry['msg'] = "Tour Team has duplicates.";}
		
		$memcache->delete("tourTeamList".$req['tournament_id']);
		$memcache->delete("tourTeamPoints".$req['tournament_id']);
		$memcache->delete("tourTeamPoints");
		$memcache->delete("tourTeamTotaalList");
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* delete tournament_has_team  */
	//url = /tournament_has_team.php?type=delete&tournament_id=&team_id=
	function deleteTour_Team($req,$memcache)
	{
		$arry =  array();
		if(empty($req['tournament_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Tournament ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		if(empty($req['team_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Team ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		$arry['status'] = "false";
		$arry['msg'] = "Incorrect/Invalid Details.";
		$query =  mysql_query("delete from tournament_has_team where tournament_id=".$req['tournament_id']." and team_id=".$req['team_id']);
		if(mysql_affected_rows()>0)
		{
			$arry['status'] = "true";
			$arry['msg'] = "Tour Team deleted successfully.";
			$memcache->delete("tourTeamList".$req['tournament_id']);
			$memcache->delete("tourlistbyTeam".$req['team_id']);
			$memcache->delete("tourTeamPoints".$req['tournament_id']);
			$memcache->delete("tourTeamPoints");
			$memcache->delete("tourTeamTotaalList");
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* list tournament_has_team  */
	//url = /tournament_has_team.php?type=list&tournament_id=
	function listTour_Team($req,$memcache)
	{
		$arry =  array();
		if(empty($req['tournament_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Tournament ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		$key = "tourTeamList".$req['tournament_id'];
		$arry = $memcache->get($key);
		if(!$arry)
		{
			$arry =  array();
			$lists = array(); 
			$query =  mysql_query("select tt.*,t.team_name,t.team_small_name,t.team_logo from tournament_has_team tt, team t where tt.tournament_id=".$req['tournament_id']." and tt.team_id=t.team_id order by tt.team_id desc");
			//echo "select tt.*,t.team_name,t.team_small_name from tournament_has_team tt, team t where tt.tournament_id=".$req['tournament_id']." and tt.team_id=t.team_id order by tt.team_id desc";
			if(mysql_num_rows($query) > 0)
			{
				while($row = mysql_fetch_object($query))
				{
					$list = array();
					foreach($row as $column_name=>$column_value){
						$list[$column_name] = $column_value;
					}
					$list['team_logo'] = "images/team_default.png";
					if($row->team_logo !="")$list['team_logo'] = $row->team_logo;
					$lists[]= $list;
				}
			}
			$arry['msg'] = "Tour Team list.";
			$arry["list"] = $lists;
			$arry['status'] = "true";
			$memcache->set($key, $arry, 0,0);
			
		}
		return json_encode($arry);
	}
	
	/* list tournament_has_team  */
	//url = /tournament_has_team.php?type=listbyteam&team_id=
	function listTour_ByTeam($req,$memcache)
	{
		$arry =  array();
		if(empty($req['team_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Team ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		$key = "tourlistbyTeam".$req['team_id'];
		$arry = $memcache->get($key);
		if(!$arry)
		{
			$arry =  array();
			$lists = array(); 
			$query =  mysql_query("select t.* from tournament_has_team tt, tournament t where tt.tournament_id=t.tournament_id and tt.team_id=".$req['team_id']." group by t.tournament_id order by t.start_date desc");
			if(mysql_num_rows($query) > 0)
			{
				while($row = mysql_fetch_object($query))
				{
					$list = array();
					foreach($row as $column_name=>$column_value){
						$list[$column_name] = $column_value;
					}
					$list['category_title'] = "";
					if($row->tour_cat !=0)$list['category_title'] = getCategoryBYId($memcache,$row->tour_cat);
					$lists[]= $list;
					$memcache->set("tourNameById".$row->tournament_id, $row->tournament_name, 0,0);
				}
			}
			$arry['msg'] = "Team Tour list.";
			$arry["list"] = $lists;
			$arry['status'] = "true";
			$memcache->set($key, $arry, 0,0);
			
		}
		return json_encode($arry);
	}
	
	/* list tournament_has_team  */
	//url = /tournament_has_team.php?type=totallist
	function listTour_TeamTotal($req,$memcache)
	{
		$arry =  array();
		
		$key = "tourTeamTotaalList";
		$arry = $memcache->get($key);
		if(!$arry)
		{
			$arry =  array();
			$lists = array(); 
			$query =  mysql_query("select tt.*,t.team_name,t.team_small_name,t.team_logo from tournament_has_team tt, team t where tt.team_id=t.team_id order by tt.team_id desc");
			if(mysql_num_rows($query) > 0)
			{
				while($row = mysql_fetch_object($query))
				{
					$list = array();
					foreach($row as $column_name=>$column_value){
						$list[$column_name] = $column_value;
					}
					$lists[]= $list;
				}
			}
			$arry['msg'] = "Tour Team list.";
			$arry["list"] = $lists;
			$arry['status'] = "true";
			$memcache->set($key, $arry, 0,0);
			
		}
		return json_encode($arry);
	}
	
?>