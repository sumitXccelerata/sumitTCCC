<?php 
	include("includes/db.php");
	include("includes/functions.php");
	$type = "default";
	if(!empty($_REQUEST['type']))$type = $_REQUEST['type'];
	
	switch($type)
	{	
		case "create":
			$result = createUmpire($_REQUEST,$memcache);	
			break;
		
		case "update":
			$result = updateUmpire($_REQUEST,$memcache);	
			break;
			
		case "updatestatus":
			$result = updateUmpireStatus($_REQUEST,$memcache);	
			break;
		
		
		case "delete":
			$result = deleteUmpire($_REQUEST,$memcache);	
			break;
			
		case "list":
			$result = listUmpire($_REQUEST,$memcache);	
			break;
			
		case "uploadpic":
			$result = uploadPicUmpire($_REQUEST,$memcache);	
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
	
	/* create Umpire  */
	//url = /umpire.php?type=create&umpire_name=&umpire_country_id=&umpire_dob=&umpire_logo=
	function createUmpire($req,$memcache)
	{
		$arry =  array();

		if(empty($req['umpire_name']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Umpire Name.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		if(empty($req['umpire_country_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Umpire Country.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		if(empty($req['umpire_dob']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Umpire DOB.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		$dob = $req['umpire_dob'];
		$umpire_dob	= "'".date('Y-m-d', strtotime(str_replace('-', '/', $dob)))."'";
		
		$arry['status'] = "false";
		$arry['msg'] = "Umpire name already exists, please choose another.";
		$favexits = mysql_query("select umpire_id from umpire where umpire_name='".$req['umpire_name']."'");
		
		if(mysql_num_rows($favexits) <= 0)
		{
			$query =  mysql_query("INSERT INTO umpire(umpire_name,umpire_logo,umpire_country,umpire_dob) VALUES ('".$req['umpire_name']."','".$req['umpire_logo']."',".$req['umpire_country_id'].",$umpire_dob)");
			if(mysql_insert_id()>0)
			{
				$arry['status'] = "true";
				$arry['msg'] = "Umpire added successfully.";
				$arry['umpire_id'] = mysql_insert_id();
				$memcache->delete("umpireList");
			}
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* update umpire  */
	//url = /umpire.php?type=update&umpire_id=&umpire_name=&umpire_country=&umpire_logo=
	function updateUmpire($req,$memcache)
	{
		$arry =  array();
		if(empty($req['umpire_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Umpire ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		if(empty($req['umpire_name']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Umpire Name.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		if(empty($req['umpire_country_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Umpire Country.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		if(empty($req['umpire_logo']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Umpire Picture.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		$arry['status'] = "false";
		$arry['msg'] = "Incorrect/Invalid Details.";
		
		$set = "";
		if(!empty($req['umpire_name'])) $set .= "umpire_name='".mysql_escape_string($req['umpire_name'])."',";
		if(!empty($req['umpire_logo'])) $set .= "umpire_logo='".$req['umpire_logo']."',";
		if(!empty($req['umpire_country_id'])) $set .= "umpire_country=".$req['umpire_country_id'].",";
		if(!empty($req['umpire_dob']))
		{ 
			$dob = $req['umpire_dob'];
			$set .= "umpire_dob='".date('Y-m-d', strtotime(str_replace('-', '/', $dob)))."',";
		}
		if(!empty($set))
		{
			$setValue = rtrim($set,',');
			$query =  mysql_query("update umpire set ".$setValue." where umpire_id = ".$req['umpire_id']);
			if(mysql_affected_rows()>0)
			{
				$arry['status'] = "true";
				$arry['msg'] = "Umpire updated successfully.";
				$memcache->delete("umpireList");
				$memcache->delete("umpiredetailsById".$req['umpire_id']);
			}
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* update umpire status */
	//url = /umpire.php?type=updatestatus&umpire_id=&umpire_status=
	function updateUmpireStatus($req,$memcache)
	{
		$arry =  array();
		if(empty($req['umpire_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Umpire ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		if(empty($req['umpire_status']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Umpire Status.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		$arry['status'] = "false";
		$arry['msg'] = "Incorrect/Invalid Details.";
		
		$set = "";
		if(!empty($req['umpire_status'])) $set .= "umpire_status=".$req['umpire_status'].",";
		if(!empty($set))
		{
			$setValue = rtrim($set,',');
			$query =  mysql_query("update umpire set ".$setValue." where umpire_id = ".$req['umpire_id']);
			if(mysql_affected_rows()>0)
			{
				$arry['status'] = "true";
				$arry['msg'] = "Umpire updated successfully.";
				$memcache->delete("umpireList");
				$memcache->delete("umpiredetailsById".$req['umpire_id']);
			}
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* delete umpire  */
	//url = /umpire.php?type=delete&umpire_id=
	function deleteUmpire($req,$memcache)
	{
		$arry =  array();
		if(empty($req['umpire_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Umpire ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		$arry['status'] = "false";
		$arry['msg'] = "Incorrect/Invalid Details.";
		$query =  mysql_query("delete from umpire where umpire_id = ".$req['umpire_id']);
		if(mysql_affected_rows()>0)
		{
			$arry['status'] = "true";
			$arry['msg'] = "Umpire deleted successfully.";
		$memcache->delete("umpireList");
				$memcache->delete("umpiredetailsById".$req['umpire_id']);
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* list umpire  */
	//url = /umpire.php?type=list
	function listUmpire($req,$memcache)
	{
		$key = "umpireList";
		$arry = $memcache->get($key);
		if(!$arry)
		{
			$arry =  array();
			$lists = array(); 
			$query =  mysql_query("select t.* from umpire t order by t.umpire_name desc");
			if(mysql_num_rows($query) > 0)
			{
				while($row = mysql_fetch_object($query))
				{
					$list = array();
					foreach($row as $column_name=>$column_value){
						$list[$column_name] = $column_value;
					}
					$list['umpire_country_name']=getCountryNameBYId($memcache,$row->umpire_country_id);
					$lists[]= $list;
					$memcache->set("umpiredetailsById".$row->umpire_id, $row->umpire_name, 0,0);
				}
			}
			$arry['msg'] = "Umpire list.";
			$arry["list"] = $lists;
			$arry['status'] = "true";
			$memcache->set($key, $arry, 0,0);
		}
		return json_encode($arry);
	}
	
	/* upload pic for umpire  */
	//url = /umpire.php?type=uploadpic
	function uploadPicUmpire($req,$memcache)
	{
		$arry =  array();
		$picPath = '';
		if(!empty($_FILES)) $picPath = file_upload("umpire",$_FILES,$req);
		$arry['status'] = "true";
		$arry['umpire_logo'] = $picPath;
		logToFile('admin',"file uploaded successfuly.");
		return json_encode($arry);
	}
?>