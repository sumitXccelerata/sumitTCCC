<footer class="mainFooter"> <a id="backToTop"></a>
  <div class="footerContent"> 
    <!-- LOGO -->
    <div class="row">
      <div class="columns large-12"> 
        <!-- <div class="eventLogo"></div> --> 
      </div>
    </div>
    <!-- end LOGO --> 
    
    <!-- LINKS -->
    <div class="row">
      <div class="columns large-2 small-6">
        <h4>About</h4>
        <ul id="yw6">
          <li><a href="/about.html">About Tccc</a></li>
          <li><a href="/programs.html">Our Programs</a></li>
          <li><a href="/board.html">Board of Directors</a></li>
          <li><a href="/rules.html">Tccc Rules</a></li>
        </ul>
      </div>
      <div class="columns large-2 small-6">
        <h4>Videos</h4>
        <ul>
          <li><a href="/videos.html">Latest Videos</a></li>
        </ul>
        <h4 class="with_top">Photos</h4>
        <ul>
          <li><a href="/photos.html">Latest Photos</a></li>
        </ul>
      </div>
      <div class="columns large-2 small-6">
        <h4>Fixtures</h4>
        <ul>
          <li><a href="/fixtures.html">Fixtures</a></li>
          <li><a href="/points.html">Points</a></li>
        </ul>
      </div>
      <div class="columns large-2 small-6">
        <h4>Teams</h4>
        <ul>
		 <?php $i=1; foreach($tourTeams as $team){ ?>
			<li><a href="/teams/<?php echo $team['team_small_name']; ?>.html"><?php echo $team['team_small_name']; ?></a></li>
			<?php if((sizeOf($tourTeams)/2) == $i){?>
			   </ul></div><div class="columns large-2 small-6"><h4>&nbsp</h4><ul>
         <?php } $i++; } ?>
        </ul>
      </div>
      <div class="columns large-2 small-6">
        <h4>sponsors</h4>
        <ul>
          <li><a href="/sponsors.html">Sponsors</a></li>
        </ul>
      </div>
      <div class="columns large-2 small-6">
        <h4>History</h4>
        <ul>
          <li><a href="/history.html">History</a></li>
        </ul>
      </div>
      <div class="columns large-2 small-6">
        <h4>Contact</h4>
        <ul>
          <li><a href="/contact.html">Contact Us</a></li>
        </ul>
      </div>
    </div>
    <!-- end LINKS -->
    
    <div class="row ">
      <div class="columns large-12 large-centered">
        <div> <a href="#" style="color: #adacad;text-decoration: none">© 2016 TCCC</a> 
        <span style="margin-left: 25%;color: #adacad; font-size: 12px;"> Powered by </span> <span> | </span> 
        <a href="http://www.iton.com/"  target="_blank">
          <img src="/img/ITON logo.png" style="width: 80px;"></a>
          <ul class="socialMedia" style="float: right;">
            <li><a href="#"  target="_blank"><i class="icon twitter"></i></a></li>
            <li><a href="#"  target="_blank"><i class="icon facebook"></i></a></li>
            <li><a href="#"  target="_blank"><i class="icon google"></i></a></li>
            <li><a href="#"  target="_blank"><i class="icon youtube"></i></a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <!-- END footerContent --> 
</footer>
<script type="text/javascript" src="/js/hh.frontend.js"></script> 
<script type="text/javascript" src="/js/supersized.3.2.7.js"></script> 
<script type="text/javascript" src="/js/supersized.shutter.js"></script> 
<script type="text/javascript" src="/js/pulse.supersizedphotomodal.js"></script>
</body>
</html>