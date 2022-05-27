<?php 
	include("includes/db.php");
	include("includes/functions.php");
	$type = "default";
	if(!empty($_REQUEST['type']))$type = $_REQUEST['type'];
	
	switch($type)
	{	
		case "create":
			$result = createCategory($_REQUEST,$memcache);	
			break;
		
		case "update":
			$result = updateCategory($_REQUEST,$memcache);	
			break;
		
		case "delete":
			$result = deleteCategory($_REQUEST,$memcache);	
			break;
			
		case "list":
			$result = listCategory($_REQUEST,$memcache);	
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
	
	/* create Category  */
	//url = /category.php?type=create&category_title=
	function createCategory($req,$memcache)
	{
		$arry =  array();

		if(empty($req['category_title']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Category.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		$arry['status'] = "false";
		$arry['msg'] = "Category already exists, please choose another.";
		$favexits = mysql_query("select category_id from category where category_title='".$req['category_title']."'");
		if(mysql_num_rows($favexits) <= 0)
		{
			$query =  mysql_query("INSERT INTO category(category_title) VALUES ('".$req['category_title']."')");
			if(mysql_insert_id()>0)
			{
				$arry['status'] = "true";
				$arry['msg'] = "Category added successfully.";
				$arry['category_id'] = mysql_insert_id();
				$memcache->delete("categoryList");
			}
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* update match type  */
	//url = /category.php?type=update&category_id=&category_title
	function updateCategory($req,$memcache)
	{
		$arry =  array();
		
		if(empty($req['category_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Category ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		
		$arry['status'] = "false";
		$arry['msg'] = "Incorrect/Invalid Details.";
		
		$set = "";
		if(!empty($req['category_title'])) $set .= "category_title='".mysql_escape_string($req['category_title'])."',";
		
		if(!empty($set))
		{
			$setValue = rtrim($set,',');
			$query =  mysql_query("update category set ".$setValue." where category_id = ".$req['category_id']);
			if(mysql_affected_rows()>0)
			{
				$arry['status'] = "true";
				$arry['msg'] = "Category updated successfully.";
				$memcache->delete("categoryList");
				$memcache->delete("categoryById".$req['category_id']);
			}
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* delete match type  */
	//url = /category.php?type=delete&category_id=
	function deleteCategory($req,$memcache)
	{
		$arry =  array();
		if(empty($req['category_id']))
		{
			$arry['status'] = "false";
			$arry['msg'] = "Incorrect/Invalid Category ID.";
			logToFile('admin', $arry['msg']);
			return json_encode($arry);
		}
		$arry['status'] = "false";
		$arry['msg'] = "Incorrect/Invalid Details.";
		$query =  mysql_query("delete from category where category_id = ".$req['category_id']);
		if(mysql_affected_rows()>0)
		{
			$arry['status'] = "true";
			$arry['msg'] = "Category deleted successfully.";
			$memcache->delete("categoryList");
			$memcache->delete("categoryById".$req['category_id']);
		}
		logToFile('admin', $arry['msg']);
		return json_encode($arry);
	}
	
	/* list match type  */
	//url = /category.php?type=list
	function listCategory($req,$memcache)
	{
		$key = "categoryList";
		$arry = $memcache->get($key);
		if(!$arry)
		{
			$arry =  array();
			$lists = array(); 
			$query =  mysql_query("select t.* from category t order by t.category_id desc");
			if(mysql_num_rows($query) > 0)
			{
				while($row = mysql_fetch_object($query))
				{
					$list = array();
					foreach($row as $column_name=>$column_value){
						$list[$column_name] = $column_value;
					}
					$lists[]= $list;
					$memcache->set("categoryById".$row->category_id, $row->category_title, 0,0);
				}
			}
			$arry['msg'] = "Category list.";
			$arry["list"] = $lists;
			$arry['status'] = "true";
			$memcache->set($key, $arry, 0,0);
		}
		return json_encode($arry);
	}

?>