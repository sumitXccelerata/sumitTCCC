<?php 
	include("includes/db.php");
	include("includes/functions.php");
	$type = "default";
	if(!empty($_REQUEST['type']))$type = $_REQUEST['type'];
	
	switch($type)
	{	
		case "create":
			$result = createPointsconfigure($_REQUEST,$memcache);	
			break;
		
		case "update":
			$result = updatePointsconfigure($_REQUEST,$memcache);	
			break;
		
		case "delete":
			$result = deletePointsconfigure($_REQUEST,$memcache);	
			break;
			
		case "list":
			$result = listPointsconfigure($_REQUEST,$memcache);	
			break;
			
		case "listbytour":
			$result = listPointsconfigureByTour($_REQUEST,$memcache);	
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
	
	/* create Pointsconfigure  */
	//url = /points_confiure.php?type=create&pc_name&tournament_id=
	function createPointsconfigure($req,$memcache)
	{
		$arry =  array();

		if(empty($req['pc_name']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Pointsconfigure Name.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
	
		if(empty($req['tournament_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Tournament ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
	
		if(empty($req['points']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Points.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		$arry['status'] = "false";
		$arry['msg'] = "Points Configuration name already exists, please choose another.";
		$favexits = mysql_query("select pc_id from points_confiure where pc_name='".$req['pc_name']."' and tournament_id=".$req['tournament_id']);
		if(mysql_num_rows($favexits) <= 0)
		{
			$query =  mysql_query("INSERT INTO points_confiure(pc_name,tournament_id,points) VALUES ('".mysql_escape_string($req['pc_name'])."',".$req['tournament_id'].",".$req['points'].")");
			if(mysql_insert_id()>0)
			{
				$arry['status'] = "true";
				$arry['msg'] = "Points Configuration added successfully.";
				$arry['pc_id'] = mysql_insert_id();
				$memcache->delete("PointsConfigureList");
				$memcache->delete("PointsConfigureList".$req['tournament_id']);
			}
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* update points_confiure  */
	//url = /points_confiure.php?type=update&pc_id=&pc_name=&tournament_id=
	function updatePointsconfigure($req,$memcache)
	{
		$arry =  array();
		
		if(empty($req['pc_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Pointsconfigure ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		$arry['status'] = "false";
		$arry['msg'] = "Incorrect/Invalid Details.";
		
		$set = "";
		if(!empty($req['pc_name'])) $set .= "pc_name='".mysql_escape_string($req['pc_name'])."',";
		if(!empty($req['tournament_id'])) $set .= "tournament_id=".$req['tournament_id'].",";
		if(!empty($req['points'])) $set .= "points=".$req['points'].",";
		
		if(!empty($set))
		{
			$setValue = rtrim($set,',');
			$query =  mysql_query("update points_confiure set ".$setValue." where pc_id = ".$req['pc_id']);
			if(mysql_affected_rows()>0)
			{
				$arry['status'] = "true";
				$arry['msg'] = "Points Configuration updated successfully.";
				$memcache->delete("PointsConfigureList");
			$memcache->delete("PointsConfigureList".$req['tournament_id']);
			}
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* delete points_confiure  */
	//url = /points_confiure.php?type=delete&tournament_id=&pc_id=
	function deletePointsconfigure($req,$memcache)
	{
		$arry =  array();
		if(empty($req['tournament_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Tournament ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		$where ="where";
		if(!empty($req['pc_id']))$where .=" pc_id=".$req['pc_id']." and";
		$arry['status'] = "false";
		$arry['msg'] = "Incorrect/Invalid Details.";
		$query =  mysql_query("delete from points_confiure $where tournament_id = ".$req['tournament_id']);
		if(mysql_affected_rows()>0)
		{
			$arry['status'] = "true";
			$arry['msg'] = "Points Configuration deleted successfully.";
			$memcache->delete("PointsConfigureList");
			$memcache->delete("PointsConfigureList".$req['tournament_id']);
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* list points_confiure  */
	//url = /points_confiure.php?type=list
	function listPointsconfigure($req,$memcache)
	{
		$key = "PointsConfigureList";
		$arry = $memcache->get($key);
		if(!$arry)
		{
			$arry =  array();
			$lists = array(); 
			$query =  mysql_query("select t.* from points_confiure t order by t.pc_id desc");
			if(mysql_num_rows($query) > 0)
			{
				while($row = mysql_fetch_object($query))
				{
					$list = array();
					foreach($row as $column_name=>$column_value){
						$list[$column_name] = $column_value;
					}
					$list['tournament_name'] = getTourBYId($memcache,$row->tournament_id);
					$lists[]= $list;
				}
			}
			$arry['msg'] = "Points Configuration list.";
			$arry["list"] = $lists;
			$arry['status'] = "true";
			$memcache->set($key, $arry, 0,0);
		}
		return json_encode($arry);
	}
	/* list points_confiure  */
	//url = /points_confiure.php?type=listbytour&tournament_id=
	function listPointsconfigureByTour($req,$memcache)
	{
		if(empty($req['tournament_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Tournament ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		$key = "PointsConfigureList".$req['tournament_id'];
		$arry = $memcache->get($key);
		if(!$arry)
		{
			$arry =  array();
			$lists = array(); 
			$query =  mysql_query("select t.* from points_confiure t where tournament_id=".$req['tournament_id']." order by t.pc_id desc");
			if(mysql_num_rows($query) > 0)
			{
				while($row = mysql_fetch_object($query))
				{
					$list = array();
					foreach($row as $column_name=>$column_value){
						$list[$column_name] = $column_value;
					}
					$list['tournament_name'] = getTourBYId($memcache,$row->tournament_id);
					$lists[]= $list;
				}
			}
			$arry['msg'] = "Points Configuration list.";
			$arry["list"] = $lists;
			$arry['status'] = "true";
			$memcache->set($key, $arry, 0,0);
		}
		return json_encode($arry);
	}
	
?>