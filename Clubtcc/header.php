<?php 
include_once('db.php');
include_once('functions.php');
?>
<!DOCTYPE html>
<html class="no-js">
<head>
<script type='text/javascript'>/* if (window.location.protocol !== 'https:') {
    window.location = 'https://' + window.location.hostname + window.location.pathname + window.location.hash;
    }*/
    var HH = HH || {};        
    HH.Params = {
          
    };  </script>
<meta charset="utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<meta name="description" content="Follow the Cricket league 2017" />
<meta name="keywords" content="cricket league, league; cricket league 2017; league 2017; tcc cricket" />
<meta name="viewport" id="viewport" content="width=device-width, initial-scale=1" />
<title>Toronto City Cricket Club</title>
<link rel="icon" type="images/png" href="img/logo1.png">
<link rel="stylesheet" type="text/css" href="css/screen.css" />
<link rel="stylesheet" type="text/css" href="css/tcc.css?v=2" />
<link rel="stylesheet" type="text/css" href="css/tccc-widgets.css?v=10" />
<link rel="stylesheet" type="text/css" href="css/font-awesome.min.css">
<link rel="stylesheet" type="text/css" href="css/nivo-slider.css">
<link rel="stylesheet" href="themes/default/default.css" type="text/css" media="screen" />
<link rel="stylesheet" type="text/css" href="css/exp.css">
<style>
.announcement {
	margin-top: 50px;
}
.fl{float:left;}
.fr{float:right !important;}
.cb{clear:both;}
@media (max-width: 719px) {
.announcement {
	margin-top: 5px;
}
}
.can-img {
	list-style: square url("/img/ul-logo.png")!important;
	line-height: 2.0em;
	margin-left: 25px;
}
.title_style {
	margin-top: 15px;
	text-align: center;
	background: #0077c8;
	height: 35px;
	padding-top: 7px;
	border-radius: 5px;
}
table {
	border-collapse: collapse;
	width: 100%;
	border: 1px solid #ddd;
}
th, td {
	border: none;
	text-align: left;
	/*padding: 3px;*/
}
.poolTable .tableLayout tr td .teamNameSide {
	text-align: left;
}
tr:nth-child(even) {
	background-color: #f2f2f2
}
.pdf_style {
	text-align: right !important;
}

.finals{
    width:50% !important; 
    text-align:center; 
    margin-top:18px;
  }
  @media only screen and (max-width:568px){
  .finals{
    width:100% !important; 
    text-align:center; 
    margin-top:18px;
  }
  }
</style>
</head>

<body>
<script type="text/javascript" src="js/jquery.min.js"></script> 
<script type="text/javascript" src="js/jquery.nivo.slider.pack.js"></script> 
<script type="text/javascript" src="js/hh.frontend.js"></script> 
<script type="text/javascript" src="js/supersized.3.2.7.js"></script> 
<script type="text/javascript" src="js/supersized.shutter.js"></script> 
<script type="text/javascript" src="js/pulse.supersizedphotomodal.js"></script> 
<script type="text/javascript">
$(document).ready(function() {
    $('#slider').nivoSlider();
});

   $(function() {
  $(".expand").on( "click", function() {
    $(this).next().slideToggle(200);
    $expand = $(this).find(">:first-child");
    
    if($expand.text() == "+") {
      $expand.text("-");
    } else {
      $expand.text("+");
    }
  });
});
</script>
<header class="topNav">
  <div class="masthead">
    <div class="row">
      <div class="columns large-12">
        <h1><a href="../index.html"></a></h1>
        <div class="mobileMenuBtn cwc-mobileMenuBtn">
          <div class="icon"></div>
        </div>
      </div>
    </div>
    <!-- END row --> 
  </div>
  <!-- END masthead -->
  
  <nav class="tcc-main-nav">
    <div class="row">
      <div class="columns large-12">
        <ul >
          <li <?php if($sel=="home"){ ?> class="active seleted" <?php }?>><a  href="index.html"><i class="fa fa-home" style="font-size: 25px;margin-bottom:5px;"></i></a></li>
          <li id="about-dropdown" class="dropdown<?php if($sel=="about"){ ?> active seleted<?php }?>" ><a><i class="fa fa-newspaper-o"></i>&nbsp; About<i class="icon-angle-down"></i></a></li>
          <li id="teams-dropdown" class="dropdown<?php if($sel=="team"){ ?> active seleted<?php }?>"><a><i class="fa fa-users"></i>&nbsp; Teams<i class="icon-angle-down"></i></a></li>
          <li<?php if($sel=="fixtures"){ ?> class="active seleted" <?php }?>><a href="fixtures.html"><i class="fa fa-file-text-o"></i>&nbsp; Fixtures</a></li>
          <li<?php if($sel=="points"){ ?> class="active seleted" <?php }?>><a href="points.html"><i class="fa fa-shield"></i>&nbsp; Points</a></li>
          <li<?php if($sel=="photos"){ ?> class="active seleted" <?php }?>><a href="photos.html"><i class="fa fa-picture-o"></i>&nbsp; Photos</a></li>
          <li<?php if($sel=="videos"){ ?> class="active seleted" <?php }?>><a href="videos.html"><i class="fa fa-video-camera"></i>&nbsp; Videos</a></li>
          <li<?php if($sel=="history"){ ?> class="active seleted" <?php }?>><a href="history.html"><i class="fa fa-history"></i>&nbsp; History</a></li>
          <li<?php if($sel=="sponsers"){ ?> class="active seleted" <?php }?>><a href="sponsors.html"><i class="fa fa-money"></i>&nbsp; Sponsors</a></li>
          <li<?php if($sel=="scores"){ ?> class="active seleted" <?php }?>><a href="Scores.html"><i class="fa fa-file-text"></i>&nbsp; Scores</a></li>
        </ul>
      </div>
      <!-- END columns large-12 --> 
    </div>
    <!-- END row --> 
  </nav>
  <div class="searchBar" style="display: none;">
    <form id="search-form" class="header-search-form" action="search" method="GET">
      <input name="q" id="search-query" type="text" autofocus />
    </form>
    <button class="search"><i class="icon-search"></i></button>
  </div>
  <?php 
       $tour = listTournament($memcache);
       $tourTeams = listTour_Team($tour,$memcache);
       //$tourPoints = tourPoints($tour);
  ?>
  <nav class="dropdownList" style="display:none;" id="teams-dropdownList">
    <p style=" text-align: left; margin-bottom: 0px; margin-top: 0px; margin-left: 5px; color: white;"><?php echo $tour['year']; ?></p>
    <ul class="teamList">
	  <?php $i=1; foreach($tourTeams as $team){ ?>
			<li><a href="teams/<?php echo $team['team_small_name']; ?>.html"><div class="tLogo30x20" style="background: none;background-position: 0 0; top:-3px;"><img src='/services/<?php echo $team['team_logo']; ?>' alt='' style="width:30px;height: 20px;vertical-align: 0px;margin: 0px 4px 0px 0px;" /></div><?php echo $team['team_small_name']; ?></a></li>
         <?php if((sizeOf($tourTeams)/2) == $i){?>
			   </ul><ul class="teamList">
         <?php } $i++; } ?>
    </ul>
  </nav>
  <nav class="dropdownList" style="display:none;" id="about-dropdownList">
    <ul>
      <li><a href="about.html"><i class="fa fa-trophy"></i>&nbsp; ABOUT TCCC</a></li>
      <li><a href="programs.html"><i class="fa fa-list"></i>&nbsp; OUR PROGRAMS</a></li>
      <li><a href="board.html"><i class="fa fa-users"></i>&nbsp; BOARD OF DIRECTORS</a></li>
      <li><a href="rules.html"><i class="fa fa-file-text"></i>&nbsp; TCCC RULES</a></li>
     <!-- <li><a href="keydates.html"><i class="fa fa-calendar"></i>&nbsp; KEY DATES - 2017</a></li>-->
      <li><a href="committee.html"><i class="fa fa-users"></i>&nbsp; GOVERNING COMMITTEE</a></li>
      <li><a href="news.html"><i class="fa fa-newspaper-o"></i>&nbsp; TCCC IN THE NEWS</a></li>
      <li><a href="forms.html"><i class="fa fa-pencil-square-o"></i>&nbsp; TCCC FORMS</a></li>
    </ul>
  </nav>
</header>