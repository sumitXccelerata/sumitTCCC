<?php
$sel="team";
include_once('../header.php');
?>
<style>
.teamlogo{
  width: 200px;
  background: #fff;
  
  border-radius: 10px;
}
@media (max-width:750px) {
.teamlogo {
  width: 150px;
  background: #fff;
  
  border-radius: 10px;
}
}
@media (max-width:450px) {
.teamlogo {
  width: 130px;
  background: #fff;
  
  border-radius: 10px;
}
}
</style>

<div>
  <div>
    <div class=""> </div>
  </div>
  <div class="clear-both"> </div>
</div>
<div class="content">
  <div class="teamPageHeader">
    <div class="" style="margin: 0px;">
      <div>
        <div>
          <div class="">
            <div class="teamBackground"> 
              <img src="../img/team/TM/profile.jpg" class="teamBackground" alt="TLJ - TTCC Teams" /> 
              <span class="curve large"></span> </div>
          </div>
        </div>
        <div class="clear-both"> </div>
      </div>
      <div class="row">
        <div class="columns large-8">
          <div class="teamContent">
            <div class="row">
              <div class="columns large-12">
                <div class="teamLogos">
                  <img src="../img/teamslogos/tmcc.png" class="teamlogo">
                </div>
              </div>
            </div>
            <h2>Toronto Maverick (TM)</h2>
            <div>
             <p style="text-align: justify;">
               Toronto Mavericks Cricket Club came into being in 2013 with a desire for a group of friends and cricket enthusiasts from business school to come together to play a game they enjoy playing and following. Over the last few years the club quickly grew with new members who share the same feeling. 
             </p>
            </div>
            
          </div>
        </div>
        
        <div class="columns large-4">
          <div class="">
              <?php include_once('../points_side.php'); ?>
            </div>
          </div>
        </div>
        
        <div class="clear-both"></div>
      </div>
    </div>
  </div>
  <div class="clear-both"></div>
</div>
<!-- ................................................................................................................... -->

<div>
  <div>
    <div class="">
      <div class="content">
      <section class="most-viewed-videos">
        <div class="row title">
          <div class="columns large-12 title">
            <header class="sectionHeader">
              <h3 class="sectionTitle white">Pictures & Videos</h3>
            </header>
          </div>
          
          <div class="columns large-7">
            <div class="row thumbs">
              <div class="columns large-12">
                <div class="teamLogos">
                <ul class="small-block-grid-1 medium-block-grid-3">
                  <li> <a href="../videos.html">
                    <div class="videoWrapper"> <img src="../img/12.jpg">
                      <div class="video-icon"></div>
                      <div class="video-play"></div>
                    </div>
                    <div class="thumb-info">
                      <div class="thumb-title">sscc v bmo Semi Final -2 Highlights</div>
                      <span>752,947 views</span> <span> | </span> <span>4m 29s</span> </div>
                    </a> </li>
                  <li> <a href="../videos.html">
                    <div class="videoWrapper"> <img src="../img/6.jpg">
                      <div class="video-icon"></div>
                      <div class="video-play"></div>
                    </div>
                    <div class="thumb-info">
                      <div class="thumb-title">Kids Matches highlights</div>
                      <span>1,152,237 views</span> <span> | </span> <span>2m 07s</span> </div>
                    </a> </li>
                  <li> <a href="../videos.html">
                    <div class="videoWrapper"> <img src="../img/7.jpg">
                      <div class="video-icon"></div>
                      <div class="video-play"></div>
                    </div>
                    <div class="thumb-info">
                      <div class="thumb-title">best wickets in cricket</div>
                      <span>981,310 views</span> <span> | </span> <span>0m 59s</span> </div>
                    </a> </li>
                  <li><a href="../videos.html">
                    <div class="videoWrapper"> <img src="../img/9.jpg">
                      <div class="video-icon"></div>
                      <div class="video-play"></div>
                    </div>
                    <div class="thumb-info">
                      <div class="thumb-title">TLJ vs BMCC cricket League</div>
                      <span>829,773 views</span> <span> | </span> <span>0m 53s</span> </div>
                    </a> </li>
                  <li> <a href="../videos.html">
                    <div class="videoWrapper"> <img src="../img/11.jpg">
                      <div class="video-icon"></div>
                      <div class="video-play"></div>
                    </div>
                    <div class="thumb-info">
                      <div class="thumb-title">ETB v BMO Match</div>
                      <span>775,230 views</span> <span> | </span> <span>3m 01s</span> </div>
                    </a> </li>
                  <li> <a href="../videos.html">
                    <div class="videoWrapper"> <img src="../img/8.jpg">
                      <div class="video-icon"></div>
                      <div class="video-play"></div>
                    </div>
                    <div class="thumb-info">
                      <div class="thumb-title">BMO v SSCC Match</div>
                      <span>848,328 views</span> <span> | </span> <span>5m 13s</span> </div>
                    </a> </li>
                </ul>
              </div>
              </div>
            </div>
          </div>

          <div class="columns large-5">
            <div class="videoWrapper">
              <img src="../img/team/TM/profile.jpg" alt="TCCC 15 in review: 14 magic moments - Cricket News" />
              <div class="photoIcon"></div>
              <div class="curve black"></div>
            </div>
            <div class="thumb-info">
              <div class="thumb-title">Team Members</div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </div>
  </div>
  <div class="clear-both"></div>
</div>

<!-- ................................................................................................................... -->

<div>
  <div>
    <div class=""> 
      <div data-widget-type="squadslider_widget"> 
      <div class="content">
      <div class="cwcSection dark">
        <div class="row">
          <div class="columns large-12">
            <header class="sectionHeader">
              <h3 class="sectionTitle">Team Squad</h3>
            </header>
          </div>
        </div>
        <div class="row" id="galleryContainer">
          <div class="columns large-12">
            <ul class="small-block-grid-2 medium-block-grid-3 large-block-grid-4">
             <?php 
			     $teamId = array();
				 $teamId['team_id'] = 8;
			     $teamId['tournament_id'] = $tour['tournament_id'];
				 //echo $teamId['tournament_id'];
				 $players = listTour_Team_has_player($teamId,$memcache);
				 //$players = listTeam_has_player($teamId,$memcache); 
			    // print_r($players);
				 foreach($players as $player)
				 {
			 ?>	 
             
              <li><a class="photoThumbg"> 
                  <span class="thumbnailg">
                    <span class="imgContainerg">
                      <img src="/services/<?php echo $player['player_logo']; ?>" alt="">
                      <span class="curve blue"></span>
                      <span class="curve-vertical"></span>
                    </span>
                  </span>
                  <figcaption class="galleryGrid">
                    <div class="title">Name : <?php echo $player['player_name']; ?></div>
                    <div class="title">Role : <?php echo $player['player_role_title']; ?></div>
                    <div class="title">Bat Style : <?php echo $player['bat_style_title']; ?></div>
                    <div class="title">Bowl Style : <?php echo $player['bowl_style_title']; ?></div>
                    <!--<div class="title">Youth Player : N</div>-->
                  </figcaption>
                </a>
              </li>
               <?php 
				 }
		     ?>
              </ul>
          </div>
        </div> 
      </div>
      </div>
    </div>
  </div>
</div>
<div class="clear-both"></div>
</div>


<div class="content">
<div class="shard-bg">
  <div>
    <div class="">
      <!-- <div data-widget-type="socialblock_cwc_widget" data-season="cwc-2015" data-widget-size="large"> -->
        <div class="row">
          <div class="columns large-12">
            <header class="sectionHeader cta">
              <h3 class="sectionTitle">PHOTOSTREAM</h3>
                <a href="../photos.html" class="button primary">View All
                <i class="icon-angle-right"></i>
              </a>
            </header>

            <ul class="photoGrid small-block-grid-2 medium-block-grid-3 large-block-grid-3">
              <li><a  data-action-url="#" data-url = "../img/team/TM/t1.jpg" 
                      data-photo-caption = "Toronto Maverick" data-thumb ="../img/team/68193.jpg" class="photoThumb supersizedModal">
                    <span class="thumbnail">
                      <span class="imgContainer">
                        <img src="../img/team/TM/t1.jpg" alt="Toronto Maverick">
                        <span class="curve black"></span>
                        <span class="photoIcon"></span>
                      </span>
                    </span>
                  </a>
              </li>
              <li><a  data-action-url="#" data-url = "../img/team/TM/t2.jpg" 
                      data-photo-caption = "Toronto Maverick" data-thumb ="../img/team/68194.jpg" class="photoThumb supersizedModal">
                    <span class="thumbnail">
                      <span class="imgContainer">
                          <img src="../img/team/TM/t2.jpg" alt="Toronto Maverick">
                          <span class="curve black"></span>
                          <span class="photoIcon"></span>
                      </span>
                    </span>
                  </a>
              </li>
              <li><a  data-action-url="#" data-url = "../img/team/TM/t3.jpg" 
                      data-photo-caption = "Toronto Maverick" data-thumb ="../img/team/68195.jpg" class="photoThumb supersizedModal">
                    <span class="thumbnail">
                      <span class="imgContainer">
                        <img src="../img/team/TM/t3.jpg" alt="Toronto Maverick">
                        <span class="curve black"></span>
                        <span class="photoIcon"></span>
                      </span>
                    </span>
                  </a>
              </li>
              <li><a  data-action-url="#" data-url = "../img/team/TM/t4.jpg"
                     data-photo-caption = "Toronto Maverick" data-thumb ="../img/team/68196.jpg" class="photoThumb supersizedModal"> 
                     <span class="thumbnail">
                      <span class="imgContainer">
                        <img src="../img/team/TM/t4.jpg" alt="Toronto Maverick">
                        <span class="curve black"></span>
                        <span class="photoIcon"></span>
                      </span>
                      </span>
                  </a>
              </li>
              <li><a  data-action-url="#" data-url = "../img/team/TM/t5.jpg"
                      data-photo-caption = "Toronto Maverick" data-thumb ="../img/team/68197.jpg" class="photoThumb supersizedModal"> <span class="thumbnail">
                        <span class="imgContainer">
                          <img src="../img/team/TM/t5.jpg" alt="Pakistan players celebrate a Zimbabwe wicket.">
                          <span class="curve black"></span>
                          <span class="photoIcon"></span>
                        </span>
                      </span>
                  </a>
              </li>
            </ul>
          </div><!-- END columns --> 
        </div>
      </div>
    </div>
  </div><!-- End PHOTOSTREAM -->
  </div>
  <style>
    #supersized img {
      max-width: none !important;
    }
  </style>
      <div class="photo-overlay" id='photomodal'>
        <div class="photo-overlay-relative"> 
          <!--Thumbnail Navigation-->
          <div id="prevthumb"></div>
          <div id="nextthumb"></div>
          
          <!--Arrow Navigation--> 
          <a id="prevslide" class="load-item"></a> <a id="nextslide" class="load-item"></a>
          <div id="thumb-tray" class="load-item">
            <div id="thumb-back"></div>
            <div id="thumb-forward"></div>
          </div>
          
          <!--Thumb Tray button--> 
          <!-- <a id="tray-button"></a>  -->
          
          <!--FullScreen button--> 
          <a id="fullscreen-button"></a> 
          
          <!--FullScreen button--> 
          <a id="close-button"></a>
          <div id="slidecaption"></div>
          <ul class="socialBox inTheTitle grey">
            <li> <span class="icon shareBtn white"></span>
              <div class="dropdown shareOptions grey">
                <ul>
                  <li><a id="fb_link_superscroll" href="#"><div class="icon facebook-white-share" ></div>Share to Facebook</a></li>
                  <li><a id="tw_link_superscroll" href="#"><div class="icon twitter-white-share"></div>Share to Twitter</a></li>
                  <li><a id="gp_link_superscroll" href="#"><div class="icon google-white-share"></div>Share to Google +</a></li>
                  <li><a id="mail_link_superscroll" href="mailto:"><div class="icon email-white-share"></div>Email</a></li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <script>
    
    $(document).ready(function(){
      $("body").on("click",".supersizedModal",function(){ 
          var supersized_photomodal = new PULSE.CLIENT.SUPERSIZED( '#photomodal' );
          var position = $(".photoGrid li a").index($(this))+1;
          var actionUrl = $(this).data("action-url");
          supersized_photomodal.openModal( $(this).data("gallery-id"),position,actionUrl);
        });
    });
     
    </script> 
    </div>
  </div>
  <div class="clear-both"></div>
</div>
<?php include_once('../footer.php');?>