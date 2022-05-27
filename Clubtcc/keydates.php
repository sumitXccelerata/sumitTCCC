<?php 
$sel = 'about';
include_once('header.php');
?>

<style>
.match_style {
  color: white !important;
  font-size: 22px !important;
}

@media (max-width:415px) {
.match_style {
  color: white !important;
  font-size: 20px !important;
}
}

@media (max-width:350px) {
.match_style {
  color: white !important;
  font-size: 18px !important;
}
}

.key_bg {
  margin-top: 15px !important;
  text-align: center !important;
  height: 50px !important;
  padding-top: 7px !important;
  border-radius: 5px !important;
}

@media (max-width: 350px) {
.key_bg {
  margin-top: 15px !important;
  text-align: center !important;
  height: 45px !important;
  padding-top: 10px !important;
  border-radius: 5px !important;
}
}

@media (max-width: 415px) {
  .key_bg {
    margin-top: 15px !important;
    text-align: center !important;
    height: 50px !important;
    padding-top: 10px !important;
    border-radius: 5px !important;
}
}
</style>
<div>
  <div>
    <div class=""></div>
  </div>
  <div class="clear-both"></div>
</div>

<div class="content" style="background: #FFFFFF;">
  <div class="">
    <div class="row">
      <div class="columns large-12">
        <div style="background: #00ccff;" class="key_bg">
          <h3 class="match_style">Practice Matches (May 13 to 21)</h3>
        </div>
        <div style="background: #d883ff;" class="key_bg">
          <h3 class="match_style">Leagues Games begin May 27</h3>
        </div>
        <!--<div style="background: #009193;" class="key_bg">
          <h3 class="match_style">Aug 28th – Corporate Match</h3>
        </div>-->
        <div style="background: #99cc00;" class="key_bg">
          <h3 class="match_style">Play Offs – Sep 16</h3>
        </div>
        <div style="background: #0000ff;" class="key_bg">
          <h3 class="match_style">Finals &amp; Special Event Sep 23</h3>
        </div>
        <!--<div style="background: #ff9300;" class="key_bg">
          <h3 class="match_style">Gala Night Celebrations Sep 25</h3>
        </div>
        <div style="background: #797979;" class="key_bg">
          <h3 class="match_style">Corporate Games – Sep 11, 17, 18, 24</h3>
        </div>-->
      </div>
    </div>
    <br/>
  </div>
  <div class="clear-both"> </div>
</div>

<?php include_once('footer.php');?>