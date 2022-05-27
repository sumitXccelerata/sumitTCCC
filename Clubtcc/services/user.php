<?php 
	include("includes/db.php");
	include("includes/functions.php");
	$type = "default";
	if(!empty($_REQUEST['type']))$type = $_REQUEST['type'];
	//admin@clubtcc.ca
	switch($type)
	{	
		case "create":
			$result = createUser($_REQUEST,$memcache);	
			break;
		
		case "update":
			$result = updateUser($_REQUEST,$memcache);	
			break;
		
		case "delete":
			$result = deleteUser($_REQUEST,$memcache);	
			break;
			
		case "list":
			$result = listUser($_REQUEST,$memcache);	
			break;
			
		case "detailbyid":
			$result = getDetailedById($_REQUEST,$memcache);	
			break;
		
		case "login":
			$result = loginUser($_REQUEST,$memcache);	
			break;
			
		case "updateudid":
			$result = updateUDID($_REQUEST,$memcache);	
			break;
			
		case "updatepassword":
			$result = updatePassword($_REQUEST,$memcache);	
			break;
			
		case "forgotpassword":
			$result = resetPassword($_REQUEST,$memcache);	
			break;
			
		case "changepassword":
			$result = changePassword($_REQUEST,$memcache);	
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
	
	/* create User  */
	//url = /users.php?type=create&username&role_name=&team_id=
	function createUser($req,$memcache)
	{
		$arry =  array();

		if(empty($req['username']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid User Name.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
	
		if(empty($req['role_name']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Role.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
	
		if(empty($req['password']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Password.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
	
		if(empty($req['emailId']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Email ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		$team_id=0;
		if(!empty($req['team_id'])) $team_id=$req['team_id'];
		
		
		$arry['msg'] = "Email Id already exists, please choose another.";
		$favexits1 = mysql_query("select uId from users where emailId='".$req['emailId']."'");
		//echo "select uId from users where username='".$req['username']."'";
		if(mysql_num_rows($favexits1) <= 0)
		{
			if($req['role_name'] == "Team Manager")
			{
				$favexits1 = mysql_query("select uId from users where team_id=".$req['team_id']);
				//echo "select uId from users where username='".$req['username']."'";
				if(mysql_num_rows($favexits1) > 0)
				{
					$arry['status'] = "false";
					$arry['msg'] = "Team manager Already exists for given team.";
					logToFile('admin', $arry['msg']);
					return json_encode($arry);
				}
			}
			$newpassword = hash_hmac("md5",$req['password'],"donotouchtccc");
			$query =  mysql_query("INSERT INTO users(username,role_name,emailId,password,team_id) VALUES ('".mysql_escape_string($req['username'])."','".mysql_escape_string($req['role_name'])."','".$req['emailId']."','".$newpassword."',".$team_id.")");
			if(mysql_insert_id()>0)
			{
				$arry['status'] = "true";
				$arry['msg'] = "User added successfully.";
				$array_template = array('{{username}}','{{verify}}','{{password}}','{{emailId}}');
				$bdy = file_get_contents('templates/register.html');
				$array_user = array();
				$array_user['username'] = $req['username'];
				$array_user['verify'] = "You are successfully registered with Toronto City Cricket Club";
				$array_user['password'] = $req['password'];
				$array_user['emailId'] = $req['emailId'];
				//echo $bdy;
				$body = str_replace($array_template, $array_user, $bdy);
				sendMail($req['emailId'],$body,$array_user,"Registration mail from Toronto City Cricket Club");
				$arry['uId'] = mysql_insert_id();
				$memcache->delete("userListall");
				$memcache->delete("userList1");
				$memcache->delete("userList2");
			}
			
		}
		logToFile('admin', $arry['msg']);
		ob_clean();
		return json_encode($arry);
	}
	
	/* update users  */
	//url = /users.php?type=update&uId=&role_name=&team_id=&username=
	function updateUser($req,$memcache)
	{
		$arry =  array();
		
		if(empty($req['uId']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid User ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		$arry['status'] = "false";
		$arry['msg'] = "Incorrect/Invalid Details.";
		
		$set = "";
		$newpassword = "";
		$password = "";
		if(!empty($req['password'])){$password =$req['password']; $newpassword = hash_hmac("md5",$req['password'],"donotouchtccc");}
		if(!empty($req['username'])) $set .= "username='".mysql_escape_string($req['username'])."',";
		if(!empty($req['role_name'])) $set .= "role_name='".mysql_escape_string($req['role_name'])."',";
		if(!empty($newpassword)) $set .= "password='".$newpassword."',";
	//	if(!empty($req['emailId'])) $set .= "emailId='".$req['emailId']."',";
		if(!empty($req['role_name']) && $req['role_name'] =="Team Manager") if(!empty($req['team_id'])) $set .= "team_id=".$req['team_id'].",";
		if(!empty($req['status'])) $set .= "ustatus=".$req['status'].",";
		
		if(!empty($set))
		{
			$setValue = rtrim($set,',');
			$query =  mysql_query("update users set ".$setValue." where uId = ".$req['uId']);
			if(mysql_affected_rows()>0)
			{
				$arry['status'] = "true";
				if(!empty($req['password']))
				{
					$query128 =  mysql_query("select emailId,username,uId from users where uId=".$req['uId']);
					//echo "select emailId,username,uId from users where emailId='".$req['emailId']."'";
					if(mysql_num_rows($query128) > 0)
					{
						$row = mysql_fetch_row($query128);
						$array_template = array('{{username}}','{{verify}}');
						$bdy = file_get_contents('templates/changepassword.html');
						$array_user = array();
						$array_user['username'] = $row[1];
						$array_user['password'] = $password;
						$array_user['verify'] =  "You are successfully changed Clubtcc password.";
						$body = str_replace($array_template, $array_user, $bdy);
						sendMail('admin@clubtcc.ca',$body,$row,"Password changed from Clubtcc");	
					}
				}
				$arry['msg'] = "User updated successfully.";
				$memcache->delete("userListall");
				$memcache->delete("userList1");
				$memcache->delete("userList2");
			}
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
		
	//url = /user.php?type=login&emailId=&password=
	function loginUser($req,$memcache)
	{
		$arry= array();
		$arry['status'] = "false";
		$arry['msg'] = "Incorrect/Invalid User ID.";
		if(empty($req['emailId'])) return json_encode($arry);
		
		if(empty($req['password']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Invalid Password";
			return json_encode($arry);
		}
		$arry['msg'] = "Incorrect/Invalid User ID / Password.";
		$password = hash_hmac("md5",$req['password'],"donotouchtccc");
		$query128 =  mysql_query("SELECT * FROM users where emailId='".$req['emailId']."' and password='".$password."' and ustatus=2");
		echo "SELECT * FROM users where emailId='".$req['emailId']."' and password='".$password."' and ustatus=2";
		if(mysql_num_rows($query128) > 0)
		{
			$row = mysql_fetch_object($query128);
			$arry['msg'] = "Logged in Successfully.";
			$status = 'true';
			$arry['status'] = $status;
			foreach($row as $key => $value)
			{
				$arry[$key] = $value;
			}
		}
		return json_encode($arry);	
	}
	
	/* delete users  */
	//url = /users.php?type=delete&uId=
	function deleteUser($req,$memcache)
	{
		$arry =  array();
		if(empty($req['uId']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid User ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		$arry['status'] = "false";
		$arry['msg'] = "Incorrect/Invalid Details.";
		$query =  mysql_query("delete from users where uId = ".$req['uId']);
		if(mysql_affected_rows()>0)
		{
			$arry['status'] = "true";
			$arry['msg'] = "User deleted successfully.";
			$memcache->delete("userListall");
			$memcache->delete("userList1");
			$memcache->delete("userList2");
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* list users  */
	//url = /users.php?type=list&status=
	function listUser($req,$memcache)
	{
		$status = "all";
		if(!empty($req['status'])) $status = $req['status'];
		
		$key = "userList".$status;
		$arry = $memcache->get($key);
		if(!$arry)
		{
			$arry =  array();
			$lists = array(); 
			$where = ""; 
			if($status != "all")  $where="where ustatus=$status";
			$query =  mysql_query("select t.* from users t $where order by t.uId desc");
			if(mysql_num_rows($query) > 0)
			{
				while($row = mysql_fetch_object($query))
				{
					$list = array();
					foreach($row as $column_name=>$column_value){
						$list[$column_name] = $column_value;
					}
					$list['teamname'] = getTeamBYId($memcache,$row->team_id);
					$list['teamshortname'] = getTeamSmallBYId($memcache,$row->team_id);
					$lists[]= $list;
				}
			}
			$arry['msg'] = "User list.";
			$arry["list"] = $lists;
			$arry['status'] = "true";
			$memcache->set($key, $arry, 0,0);
		}
		return json_encode($arry);
	}
	
	
	//url = /user.php?type=updateudid&uId=&uDId=&deviceType=
	function updateUDID($req,$memcache)
	{
		$arry =  array();
		$arry['status'] = "false";
		$arry['msg'] = "Incorrect/Invalid User ID.";
		if(empty($req['uId'])) return json_encode($arry);
		$query1 = mysql_query("select uId from users where deviceType='".$req['deviceType']."' and udId='".$req['uDId']."'");
		if(mysql_num_rows($query1) > 0)
		{
			//$row = mysql_fetch_row($query1);
			//$ruId = $row[1];
			while($row1 = mysql_fetch_object($query1))
			{
				mysql_query("update users set udId='',deviceType='' where uId = ".$row1->uId);
				$memcache->delete("cuserDetails".$row1->uId);
				$memcache->delete("ccuserDetailsId".$row1->uId);
				$memcache->delete("cudIdUser".$row1->uId);
			}
		}
		$query =  mysql_query("update users set udId='".$req['uDId']."',deviceType='".$req['deviceType']."' where uId = ".$req['uId']);
		if(mysql_affected_rows()>0)
		{
			$arry['status'] = "true";
			$arry['msg'] = "User updated successfully.";
			$memcache->delete("cuserDetails".$req['uId']);
			$memcache->delete("ccuserDetailsId".$req['uId']);
			$memcache->delete("cudIdUser".$req['uId']);
			$details = $req['deviceType']."****".$req['uDId'];
			$memcache->set("cudIdUser".$req['uId'],$details,0,0);
			logToFile($req['uId'], "user UDID updated.");
		}
		return json_encode($arry);
	}
	
	
	//url = /user.php?type=updatepassword&uId=&password=
	function updatePassword($req,$memcache)
	{
		
		$arry =  array();
		$arry['status'] = "false";
		$arry['msg'] = "Incorrect/Invalid User ID.";
		if(empty($req['uId'])) return json_encode($arry);
		logToFile($req['uId'], "requset for update password.");
		$password = hash_hmac("md5",$req['password'],"donotouchtccc");
		$query128 =  mysql_query("select emailId,username,uId from users where uId=".$req['uId']);
		//echo "select emailId,username,uId from users where emailId='".$req['emailId']."'";
		if(mysql_num_rows($query128) > 0)
		{
			$row = mysql_fetch_row($query128);
			$query =  mysql_query("update users set password = '".$password."' where uId = ".$req['uId']);
			if(mysql_affected_rows()>0)
			{
				$arry['status'] = "true";
				$arry['msg'] = "Password updated successfully.";
				$memcache->delete("cuserDetails".$req['uId']);
				$memcache->delete("ccuserDetailsId".$req['uId']);
				$array_template = array('{{username}}','{{verify}}');
				$bdy = file_get_contents('templates/changepassword.html');
				$array_user = array();
				$array_user['username'] = $row[1];
				$array_user['password'] = $req['password'];
				$array_user['verify'] =  "Passsword changed successfully.";
				$body = str_replace($array_template, $array_user, $bdy);
				sendMail("admin@clubtcc.ca",$body,$row,"Password changed from Clubtcc");	
				logToFile($req['uId'], "password updated successfully.");
			}
		}
		logToFile($req['uId'], "Response given successfully.");
		return json_encode($arry);
	}
	
	//url = /user.php?type=forgotpassword&emailId=
	function resetPassword($req,$memcache)
	{
		$arry =  array();
		$arry['status'] = "false";
		$arry['msg'] = "Incorrect/Invalid Email ID.";
		if(empty($req['emailId'])) return json_encode($arry);
		$randomString = substr(str_shuffle("0123456789"), 0, 8);
		$password = hash_hmac("md5",$randomString,"donotouchtccc");
		$query128 =  mysql_query("select emailId,username,uId from users where emailId='".$req['emailId']."'");
		//echo "select emailId,username,uId from users where emailId='".$req['emailId']."'";
		if(mysql_num_rows($query128) > 0)
		{
			$row = mysql_fetch_row($query128);
			$query =  mysql_query("update users set password = '".$password."' where emailId = '".$req['emailId']."'");
			//echo "update users set password = '".$password."' where emailId = '".$req['emailId']."'";
			if(mysql_affected_rows()>0)
			{
				$arry['status'] = "true";
				$arry['password'] = $randomString;
				$arry['msg'] = "Password sent successfully to your mailId.";
				$array_template = array('{{username}}','{{verify}}');
				$bdy = file_get_contents('templates/lostpassword.html');
				$array_user = array();
				$array_user['username'] = $row[1];
				$array_user['verify'] = $randomString;
				$body = str_replace($array_template, $array_user, $bdy);
				sendMail($row[0],$body,$row, "Password Recovery Mail from Clubtcc");
				logToFile($row[2], "password reseted successfully.");
			}
		}
		
		return json_encode($arry);
	}
	
	//url = /user.php?type=changepassword&uId=&password=&newpassword=
	function changePassword($req,$memcache)
	{
		$arry =  array();
		$arry['status'] = "false";
		$arry['msg'] = "Incorrect/Invalid User ID.";
		if(empty($req['uId'])) return json_encode($arry);
		
		if(empty($req['password']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Invalid old password.";
			return json_encode($arry);
		}
		
		if(empty($req['newpassword']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Invalid new password.";
			return json_encode($arry);
		}
		$arry['msg'] = "Invalid old password or emailId.";
		$password = $req['password'];
		$password = hash_hmac("md5",$req['password'],"donotouchtccc");
		$newpassword = hash_hmac("md5",$req['newpassword'],"donotouchtccc");
		$query128 =  mysql_query("select emailId,username from users where uId=".$req['uId']);
		//echo "select emailId,username from users where uId=".$req['uId'];
		if(mysql_num_rows($query128) > 0)
		{
			$row = mysql_fetch_row($query128);
			$query =  mysql_query("update users set password = '".$newpassword."' where uId=".$req['uId']." and  password = '".$password."'");
			//echo "update users set password = '".$newpassword."' where uId=".$req['uId']." and  password = '".$password."'";
			if(mysql_affected_rows()>0)
			{
				$arry['status'] = "true";
				$arry['msg'] = "Password changed successfully.";
				$memcache->delete("cuserDetails".$req['uId']);
				$memcache->delete("ccuserDetailsId".$req['uId']);
				$array_template = array('{{username}}','{{verify}}');
				$bdy = file_get_contents('templates/changepassword.html');
				$array_user = array();
				$array_user['username'] = $row[1];
				$array_user['verify'] =  "Passsword changed successfully.";
				$body = str_replace($array_template, $array_user, $bdy);
				sendMail($row[0],$body,$row,"Password changed from Clubtcc");
				logToFile($req['uId'], "password changed successfully.");
			}
		}
		return json_encode($arry);
	}
	
	//url = /user.php?type=detailbyid&uId=
	function getDetailedById($req,$memcache)
	{
		if(empty($req['uId']))
		{
			$arry = array();
			$arry['status'] = "false";
			$arry['msg'] = "Invalid User";
			logToFile($req['uId'],$arry['msg']);
			return json_encode($arry);
		}
		logToFile($req['uId'], "requested for user details.");
		$key = "cuserDetails".$req['uId'];
		$arry = $memcache->get($key);
		if(!$arry)
		{
			$arry = array();
			$query128 =  mysql_query("select * from users where uId=".$req['uId']);
			$list= array();
			if(mysql_num_rows($query128) > 0)
			{
				while($row = mysql_fetch_object($query128))
				{
					foreach($row as $column_name=>$column_value){
						if($column_name!="password")$list[$column_name] = $column_value;
					}
					$memcache->set("ccuserDetailsId".$req['uId'], $list, 0,0);
					logToFile($req['uId'], "cache setted for user details.");
				}
			}	
			$arry['status'] = "true";
			$arry["list"] = $list;
			$memcache->set($key, $arry, 0,0);
		
		}
		logToFile($req['uId'], "response for user details.");
		return json_encode($arry);
	}
	
?>