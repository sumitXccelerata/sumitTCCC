<?php
//Compress Image 
function compressImage($ext,$uploadedfile,$path,$actual_image_name,$newwidth,$newheight)
{
	if($ext=="jpg" || $ext=="jpeg" )
	{
	$src = imagecreatefromjpeg($uploadedfile);
	}
	else if($ext=="png")
	{
	$src = imagecreatefrompng($uploadedfile);
	}
	else if($ext=="gif")
	{
	$src = imagecreatefromgif($uploadedfile);
	}
	else
	{
	$src = imagecreatefrombmp($uploadedfile);
	}
    
	list($width,$height)=getimagesize($uploadedfile);
    
    /*$wh_ratio = $width / $height;
	if ($wh_ratio > 3 / 2) {
		// Crop horizontal
		$crop_h = ($width - ($height * 3 / 2)) / 2;
		$crop_v = 0;
	}
	elseif ($wh_ratio < 3 / 2) {
		// Crop vetical
		$crop_h = 0;
		$crop_v = ($height - ($width * 2 / 3)) / 2;
	}
	else {
		// No crop
		$crop_h = 0;
		$crop_v = 0;
	}*/
    
    $ar = $width/$height; 
    $tar = $newwidth/$newheight; 
    if($ar >= $tar) 
    { 
        $x1 = round(($width - ($width * ($tar/$ar)))/2); 
        $x2 = round($width * ($tar/$ar)); 
        $y1 = 0; 
        $y2 = $height; 
    } 
    else 
    { 
        $x1 = 0; 
        $y1 = 100; 
        $x2 = $width; 
        $y2 = round($width/$tar); 
    }
    
	//$newheight=($height/$width)*$newwidth;
	$tmp=imagecreatetruecolor($newwidth,$newheight);
    //$tmp=imagecreatetruecolor($width,$height);
	//imagecopyresampled($tmp,$src,0,0,0,0,$newwidth,$newheight,$width,$height);
    imagecopyresampled($tmp,$src,0,0,$x1,$y1,$newwidth,$newheight,$x2, $y2);
	$filename = $path.$newwidth.'_'.$actual_image_name;
	imagejpeg($tmp,$filename,100);
	imagedestroy($tmp);
	return $filename;
}
?>