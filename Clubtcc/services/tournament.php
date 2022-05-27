<?php 
	include("includes/db.php");
	include("includes/functions.php");
	$type = "default";
	if(!empty($_REQUEST['type']))$type = $_REQUEST['type'];
	
	switch($type)
	{	
		case "create":
			$result = createTournament($_REQUEST,$memcache);	
			break;
		
		case "update":
			$result = updateTournament($_REQUEST,$memcache);	
			break;
		
		case "delete":
			$result = deleteTournament($_REQUEST,$memcache);	
			break;
			
		case "list":
			$result = listTournament($_REQUEST,$memcache);	
			break;
			
		case "uploadpic":
			$result = uploadPicTournament($_REQUEST,$memcache);	
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
	
	/* create tournament check */
	//url = /tournament.php?type=create&tournament_name=&tournament_logo=&start_date=&end_date=&points_table=&tour_cat=&short_name=
	function createTournament($req,$memcache)
	{
		$arry =  array();

		if(empty($req['tournament_name']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Tournament Name.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		/*if(empty($req['tournament_logo']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Tournament Logo.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}*/
		$tournament_logo = "images/tournament_default.png";
		if(!empty($req['tournament_logo']))$tournament_logo = $req['tournament_logo'];
		if(empty($req['start_date']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Tournament Start Date.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		if(empty($req['end_date']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Tournament End Date.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		if(empty($req['points_table']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Tournament Points table Value.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		if(empty($req['tour_cat']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Tournament Category.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		if(empty($req['short_name']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Tournament Short Name.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		$start = $req['start_date'];
		$startdate	= "'".date('Y-m-d', strtotime(str_replace('-', '/', $start)))."'";
		$end = $req['end_date'];
		$enddate	= "'".date('Y-m-d', strtotime(str_replace('-', '/', $end)))."'";
		
		
		$arry['status'] = "false";
		$arry['msg'] = "Tournament name already exists, please choose another.";
		$favexits = mysql_query("select tournament_id from tournament where tournament_name='".$req['tournament_name']."'");
		if(mysql_num_rows($favexits) <= 0)
		{
			$query =  mysql_query("INSERT INTO tournament(tournament_name, tournament_logo, start_date, end_date, points_table, tour_cat, short_name,year) VALUES ('".$req['tournament_name']."','".$tournament_logo."',".$startdate.",".$enddate.",".$req['points_table'].",'".$req['tour_cat']."','".$req['short_name']."','".date("Y")."')");
			if(mysql_insert_id()>0)
			{
				$arry['status'] = "true";
				$arry['msg'] = "Tournament added successfully.";
				$arry['tournament_id'] = mysql_insert_id();
				$memcache->delete("tourList");
			}
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* update tournament  */
	//url = /tournament.php?type=update&tournament_id=&tournament_name=&tournament_logo=&points_table=&tour_cat=&short_name=
	function updateTournament($req,$memcache)
	{
		$arry =  array();
		
		if(empty($req['tournament_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Tournament ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		$arry['status'] = "false";
		$arry['msg'] = "Incorrect/Invalid Details.";
		
		$set = "";
		if(!empty($req['tournament_name'])) $set .= "tournament_name='".mysql_escape_string($req['tournament_name'])."',";
		//if(!empty($req['start_date'])) $set .= "start_date=".$req['start_date'].",";
		//if(!empty($req['end_date'])) $set .= "end_date=".$req['end_date'].",";
		if(!empty($req['points_table'])) $set .= "points_table=".$req['points_table'].",";
		if(!empty($req['tour_cat'])) $set .= "tour_cat=".$req['tour_cat'].",";
		if(!empty($req['short_name'])) $set .= "short_name='".mysql_escape_string($req['short_name'])."',";
		if(!empty($req['tournament_logo'])) $set .= "tournament_logo='".$req['tournament_logo']."',";
		
		if(!empty($set))
		{
			$setValue = rtrim($set,',');
			$query =  mysql_query("update tournament set ".$setValue." where tournament_id = ".$req['tournament_id']);
			if(mysql_affected_rows()>0)
			{
				$arry['status'] = "true";
				$arry['msg'] = "Tournament updated successfully.";
				$memcache->delete("tourList");
				$memcache->delete("tourNameById".$req['tournament_id']);
				$memcache->delete("tourSmallNameById".$req['tournament_id']);
			}
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* delete tournament  */
	function deleteTournament($req,$memcache)
	{
		$arry =  array();
		if(empty($req['tournament_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Tournament ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		$arry['status'] = "false";
		$arry['msg'] = "Incorrect/Invalid Details.";
		$query =  mysql_query("delete from tournament where tournament_id = ".$req['tournament_id']);
		if(mysql_affected_rows()>0)
		{
			$arry['status'] = "true";
			$arry['msg'] = "Tournament deleted successfully.";
			$memcache->delete("tourList");
			$memcache->delete("tourNameById".$req['tournament_id']);
			$memcache->delete("tourSmallNameById".$req['tournament_id']);
		}
		logToFile('admin', $arry['msg'].$req['tournament_id']);
		return json_encode($arry);
	}
	
	/* list tournament  */
	function listTournament($req,$memcache)
	{
		$key = "tourList";
		$arry = $memcache->get($key);
		if(!$arry)
		{
			$arry =  array();
			$lists = array(); 
			$query =  mysql_query("select t.* from tournament t order by t.start_date desc");
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
					$list['tournament_logo'] = "images/tournament_default.png";
					if($row->tournament_logo !="")$list['tournament_logo'] = $row->tournament_logo;
					$lists[]= $list;
					$memcache->set("tourNameById".$row->tournament_id, $row->tournament_name, 0,0);
					$memcache->set("tourSmallNameById".$row->tournament_id, $row->short_name, 0,0);
				}
			}
			$arry['msg'] = "Tournament list.";
			$arry["list"] = $lists;
			$arry['status'] = "true";
			$memcache->set($key, $arry, 0,0);
		}
		return json_encode($arry);
	}

	/* upload pic for tournament  */
	//url = /tournament.php?type=uploadpic
	function uploadPicTournament($req,$memcache)
	{
		$arry =  array();
		$picPath = '';
		if(!empty($_FILES)) $picPath = file_upload("tournament",$_FILES,$req);
		$arry['status'] = "true";
		$arry['tournament_logo'] = $picPath;
		logToFile('admin',"file uploaded successfuly.");
		return json_encode($arry);
	}
	

?>