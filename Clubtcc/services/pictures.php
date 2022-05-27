<?php 
	include("includes/db.php");
	include("includes/functions.php");
	$type = "default";
	if(!empty($_REQUEST['type']))$type = $_REQUEST['type'];
	
	switch($type)
	{	
		case "create":
			$result = createPictures($_REQUEST,$memcache);	
			break;
		
		case "update":
			$result = updatePictures($_REQUEST,$memcache);	
			break;
		
		case "delete":
			$result = deletePictures($_REQUEST,$memcache);	
			break;
			
		case "list":
			$result = listPictures($_REQUEST,$memcache);	
			break;
			
		case "listbytype":
			$result = listByTypePictures($_REQUEST,$memcache);	
			break;
			
		case "uploadpic":
			$result = uploadPicPictures($_REQUEST,$memcache);	
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
	
	/* create pictures  */
	//picture_title, picture_description, picture_type, picture_type_id, createdOn, updatedOn
	//url = /pictures.php?type=create&picture_title=&picture_description=&picture_type=&picture_type_id=&picture_logo=
	function createPictures($req,$memcache)
	{
		$arry =  array();

		if(empty($req['picture_title']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Picture Name.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
	
		if(empty($req['picture_type']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Picture type.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		if(empty($req['picture_type_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Picture type id.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		if(empty($req['picture_logo']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Picture Path.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		$query =  mysql_query("INSERT INTO pictures(picture_title, picture_type, picture_type_id, pic_path, picture_description) VALUES ('".$req['picture_title']."','".$req['picture_type']."',".$req['picture_type_id'].",'".$req['picture_logo']."','".$req['picture_description']."')");
		if(mysql_insert_id()>0)
		{
			$arry['status'] = "true";
			$arry['msg'] = "Picture added successfully.";
			$arry['picture_id'] = mysql_insert_id();
			$memcache->delete("pictureList");
			$memcache->delete("pictureTypeList".$req['picture_type']."_".$req['picture_type_id']);
			if($req['picture_type'] == "tournament")
			{
				$memcache->delete("pictureTypeListbyteamtour".$req['picture_type_id']);
				$memcache->delete("pictureTypeListbyplayertour".$req['picture_type_id']);
			}
			if($req['picture_type'] == "team" || $req['picture_type'] == "player")
			{
				$tour_id = getTourIdbyTeamorPlayer($memcache,$req['picture_type'],$req['picture_type_id']);
				$memcache->delete("pictureTypeListbyteamtour".$tour_id);
				$memcache->delete("pictureTypeListbyplayertour".$tour_id);
			}
		}
		
		
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* update pictures  */
	//url = /pictures.php?type=update&picture_id=&picture_title=&picture_description=&picture_type=&picture_type_id=&pic_path=
	function updatePictures($req,$memcache)
	{
		$arry =  array();
		
		if(empty($req['picture_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Picture ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		$arry['status'] = "false";
		$arry['msg'] = "Incorrect/Invalid Details.";
		
		$set = "";
		if(!empty($req['picture_title'])) $set .= "picture_title='".mysql_escape_string($req['picture_title'])."',";
		if(!empty($req['picture_type'])) $set .= "picture_type='".$req['picture_type']."',";
		if(!empty($req['picture_type_id'])) $set .= "picture_type_id=".$req['picture_type_id'].",";
		if(!empty($req['picture_description'])) $set .= "picture_description='".mysql_escape_string($req['picture_description'])."',";
		if(!empty($req['pic_path'])) $set .= "pic_path='".$req['pic_path']."',";
		
		if(!empty($set))
		{
			$setValue = rtrim($set,',');
			$query =  mysql_query("update pictures set ".$setValue." where picture_id = ".$req['picture_id']);
			if(mysql_affected_rows()>0)
			{
				$arry['status'] = "true";
				$arry['msg'] = "Picture updated successfully.";
				$memcache->delete("pictureList");
				$memcache->delete("pictureTypeList".$req['picture_type']."_".$req['picture_type_id']);
				if($req['picture_type'] == "tournament")
				{
					$memcache->delete("pictureTypeListbyteamtour".$req['picture_type_id']);
					$memcache->delete("pictureTypeListbyplayertour".$req['picture_type_id']);
				}
				if($req['picture_type'] == "team" || $req['picture_type'] == "player")
				{
					$tour_id = getTourIdbyTeamorPlayer($memcache,$req['picture_type'],$req['picture_type_id']);
					$memcache->delete("pictureTypeListbyteamtour".$tour_id);
					$memcache->delete("pictureTypeListbyplayertour".$tour_id);
				}
			}
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* delete pictures  */
	//url = /pictures.php?type=delete&picture_id=&picture_type=&picture_type_id=
	function deletePictures($req,$memcache)
	{
		$arry =  array();
		if(empty($req['picture_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Pictures ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		$arry['status'] = "false";
		$arry['msg'] = "Incorrect/Invalid Details.";
		$query =  mysql_query("delete from pictures where picture_id = ".$req['picture_id']);
		if(mysql_affected_rows()>0)
		{
			$arry['status'] = "true";
			$arry['msg'] = "Picture deleted successfully.";
			$memcache->delete("pictureList");
			$memcache->delete("pictureTypeList".$req['picture_type']."_".$req['picture_type_id']);
			if($req['picture_type'] == "tournament")
			{
				$memcache->delete("pictureTypeListbyteamtour".$req['picture_type_id']);
				$memcache->delete("pictureTypeListbyplayertour".$req['picture_type_id']);
			}
			if($req['picture_type'] == "team" || $req['picture_type'] == "player")
			{
				$tour_id = getTourIdbyTeamorPlayer($memcache,$req['picture_type'],$req['picture_type_id']);
				$memcache->delete("pictureTypeListbyteamtour".$tour_id);
				$memcache->delete("pictureTypeListbyplayertour".$tour_id);
			}
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* list pictures  */
	//url = /pictures.php?type=list
	function listPictures($req,$memcache)
	{
		$key = "pictureList";
		$arry = $memcache->get($key);
		if(!$arry)
		{
			$arry =  array();
			$lists = array(); 
			$query =  mysql_query("select t.* from pictures t order by t.createdOn desc");
			if(mysql_num_rows($query) > 0)
			{
				while($row = mysql_fetch_object($query))
				{
					$list = array();
					foreach($row as $column_name=>$column_value){
						$list[$column_name] = $column_value;
					}
					$list['shortname'] = '';
					if($row->picture_type == 'tournament') $list['shortname'] = getTourSmallBYId($memcache,$row->picture_type_id);
					if($row->picture_type == 'team') $list['shortname'] = getTeamSmallBYId($memcache,$row->picture_type_id);
					$lists[]= $list;
				}
			}
			$arry['msg'] = "Pictures list.";
			$arry["list"] = $lists;
			$arry['status'] = "true";
			$memcache->set($key, $arry, 0,0);
		}
		return json_encode($arry);
	}
	
	/* list pictures  */
	//url = /pictures.php?type=listbytype&picture_type=&picture_type_id=
	function listByTypePictures($req,$memcache)
	{
		if(empty($req['picture_type']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Picture type.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		$key = "pictureTypeList".$req['picture_type']."_".$req['picture_type_id'];
		$arry = $memcache->get($key);
		if(!$arry)
		{
			$arry =  array();
			$lists = array(); 
			$where = "where picture_type='".$req['picture_type']."'";
			if(!empty($req['picture_type_id'])) $where .= " and picture_type_id=".$req['picture_type_id'];
			$query =  mysql_query("select t.* from pictures t $where order by t.createdOn desc");
			if(mysql_num_rows($query) > 0)
			{
				while($row = mysql_fetch_object($query))
				{
					$list = array();
					foreach($row as $column_name=>$column_value){
						$list[$column_name] = $column_value;
					}
					$list['shortname'] = '';
					if($row->picture_type == 'tournament') $list['shortname'] = getTourSmallBYId($memcache,$row->picture_type_id);
					if($row->picture_type == 'team') $list['shortname'] = getTeamSmallBYId($memcache,$row->picture_type_id);
					$lists[]= $list;
				}
			}
			$arry['msg'] = "Pictures Types list.";
			$arry["list"] = $lists;
			$arry['status'] = "true";
			$memcache->set($key, $arry, 0,0);
		}
		return json_encode($arry);
	}
	
	
	/* upload pic for pictures  */
	//url = /pictures.php?type=uploadpic&picture_type=
	function uploadPicPictures($req,$memcache)
	{
		$arry =  array();
		$picPath = '';
		if(!empty($_FILES)) $picPath = file_upload("pictures/".$req['picture_type'],$_FILES,$req);
		$arry['status'] = "true";
		$arry['picture_logo'] = $picPath;
		logToFile('admin',"file uploaded successfuly.");
		return json_encode($arry);
	}
	

?>