<?php
$sel = 'videos';
include_once('header.php');
?>

    <style type="text/css">

      .title {
        width: 100%;
        max-width: 854px;
        margin: 0 auto;
      }

      .caption {
        width: 100%;
        max-width: 854px;
        margin: 0 auto;
        padding: 20px 0;
      }

      .container {
        width: 100%;
        max-width: 854px;
        background: #fff;
        margin: 0 auto;
      }


      /*  VIDEO PLAYER CONTAINER
    ############################### */
      .vid-container {
        position: relative;
        padding-bottom: 52%;
        padding-top: 30px; 
        height: 0; 
    }
     
    .vid-container iframe,
    .vid-container object,
    .vid-container embed {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }


    /*  VIDEOS PLAYLIST 
    ############################### */
    .vid-list-container {
      /*width: 92%;*/
      overflow: hidden;
      /*margin-top: 20px;*/
      /*margin-left:4%;*/
      /*padding-bottom: 20px;*/
    }

    .vid-list {
      width: 5000px;
      position: relative;
      top:0;
      left: 0;
    }

    .vid-item {
      display: block;
      width: 148px;
      /*height: 148px;*/
      float: left;
      margin: 2px;
      padding: 3px;
    }

    .thumb {
      /*position: relative;*/
      overflow:hidden;
      height: 84px;
    }

    .thumb img {
      width: 100%;
      position: relative;
      top: -13px;
    }

    .vid-item .desc {
      /*color: #21A1D2;*/
      color: currentColor !important;
      font-size: 12px;
      margin-top:3px;
    }

    .vid-item:hover {
      background: #eee;
      cursor: pointer;
    }

    div.active {
        background-color: #003e64 !important; 
        color: #FFF !important;
        font-size: 12px;
        margin-top: 3px;
        padding: 3px;   
    }

    .arrows {
      position:relative;
      width: 100%;
    }

    .arrow-left {
      color: #fff;
      position: absolute;
      background: #003E64;
      padding: 15px;
      left: -25px;
      top: -90px;
      z-index: 99;
      cursor: pointer;
    }

    .arrow-right {
      color: #fff;
      position: absolute;
      background: #003E64;
      padding: 15px;
      right: -25px;
      top: -90px;
      z-index:100;
      cursor: pointer;
    }

    .arrow-left:hover {
      background: #003E64;
    }

    .arrow-right:hover {
      background: #003E64;
    }


    @media (max-width: 624px) {
      body {
        margin: 15px;
      }
      .caption {
        margin-top: 40px;
      }
      .vid-list-container {
        padding-bottom: 20px;
      }

      /* reposition left/right arrows */
      .arrows {
        position:relative;
        margin: 0 auto;
        width:96px;
      }
      .arrow-left {
        left: 0;
        top: -17px;
      }

      .arrow-right {
        right: 0;
        top: -17px;
      }
    }

    </style>


<!-- JS FOR SCROLLING THE ROW OF THUMBNAILS --> 
 <script type="text/javascript">
      $(document).ready(function () {
        $(".arrow-right").bind("click", function (event) {
            event.preventDefault();
            $(".vid-list-container").stop().animate({
                scrollLeft: "+=150"
            }, 750);
        });
        $(".arrow-left").bind("click", function (event) {
            event.preventDefault();
            $(".vid-list-container").stop().animate({
                scrollLeft: "-=150"
            }, 750);
        });
    });
    </script>
<!-- google analytics --> 

  <script type="text/javascript">
      $('.vid-item').click(function() {
      $(this).addClass('active').siblings().removeClass('active');
  });
  </script>
<div>
  <div>
    <div class="">
      <section class="video-hero">
        <div class="row">
          <div class="columns large-12 title">
          </div>
        </div>
        <div class="row black" style="background: none !important;">
        <div class="columns large-8 video" style="width: 100%;margin-top: 10px;margin-bottom: 10px;">
        <div id="bc-video-hero">
          <style>
            .videos .videoHeroArea .videoHero.Player figure.mainVideo .vjs-overlay.vjs-overlay-top-left img
            {
                width: 100%;
                height: inherit;
            }
        </style>
        </div>
        <div class="container">

      <!-- THE YOUTUBE PLAYER -->
      <div class="vid-container">
        <iframe id="vid_frame" src="https://www.youtube.com/embed/GUbWSE0VLok?autoplay=1&loop=1&playlist=GUbWSE0VLok&rel=0&showinfo=0&autohide=1" frameborder="0" width="100%" height="200"></iframe>
    </div>

    <!-- THE PLAYLIST -->
    <div class="vid-list-container">
          <div class="vid-list">
          <div class="vid-item active" onClick="document.getElementById('vid_frame').src='https://www.youtube.com/embed/GUbWSE0VLok?autoplay=1&loop=1&playlist=GUbWSE0VLok&rel=0&showinfo=0&autohide=1'">
            <div class="thumb"><img src="http://img.youtube.com/vi/GUbWSE0VLok/0.jpg"></div>
            <div class="desc">ETB vs ACC - Highlights</div>
          </div>
            
      <div class="vid-item" onClick="document.getElementById('vid_frame').src='https://www.youtube.com/embed/d0o2FGSBgFA?autoplay=1&rel=0&showinfo=0&autohide=1'">
                <div class="thumb"><img src="http://img.youtube.com/vi/d0o2FGSBgFA/0.jpg"></div>
                <div class="desc">ETB vs ACC - Highlights</div>
              </div>

      <div class="vid-item" onClick="document.getElementById('vid_frame').src='https://www.youtube.com/embed/qP5HSDLhCzk?autoplay=1&rel=0&showinfo=0&autohide=1'">
                <div class="thumb"><img src="http://img.youtube.com/vi/qP5HSDLhCzk/0.jpg"></div>
                <div class="desc">ETB vs ACC - Highlights</div>
              </div>

            <div class="vid-item" onClick="document.getElementById('vid_frame').src='https://www.youtube.com/embed/spTsaeONs8o?autoplay=1&rel=0&showinfo=0&autohide=1'">
                <div class="thumb"><img src="http://img.youtube.com/vi/spTsaeONs8o/0.jpg"></div>
                <div class="desc">ETB vs ACC - Highlights</div>
              </div>

            <div class="vid-item" onClick="document.getElementById('vid_frame').src='https://www.youtube.com/embed/UYiSLshhOiA?autoplay=1&rel=0&showinfo=0&autohide=1'">
                <div class="thumb"><img src="http://img.youtube.com/vi/UYiSLshhOiA/0.jpg"></div>
                <div class="desc">ETB vs ACC - Highlights</div>
              </div>

      <div class="vid-item" onClick="document.getElementById('vid_frame').src='https://www.youtube.com/embed/S5SRQGiBApM?autoplay=1&rel=0&showinfo=0&autohide=1'">
                <div class="thumb"><img src="http://img.youtube.com/vi/S5SRQGiBApM/0.jpg"></div>
                <div class="desc">ETB vs ACC - Highlights</div>
              </div>

      <div class="vid-item" onClick="document.getElementById('vid_frame').src='https://www.youtube.com/embed/AyvyrgJGr0g?autoplay=1&rel=0&showinfo=0&autohide=1'">
                <div class="thumb"><img src="http://img.youtube.com/vi/AyvyrgJGr0g/0.jpg"></div>
                <div class="desc">ETB vs ACC - Highlights</div>
              </div>

      <div class="vid-item" onClick="document.getElementById('vid_frame').src='https://www.youtube.com/embed/7BM29-HFtdU?autoplay=1&rel=0&showinfo=0&autohide=1'">
                <div class="thumb"><img src="http://img.youtube.com/vi/7BM29-HFtdU/0.jpg"></div>
                <div class="desc">ETB vs ACC - Highlights</div>
              </div>

            <div class="vid-item" onClick="document.getElementById('vid_frame').src='https://www.youtube.com/embed/YN0lR75AE30?autoplay=1&rel=0&showinfo=0&autohide=1'">
                <div class="thumb"><img src="http://img.youtube.com/vi/YN0lR75AE30/0.jpg"></div>
                <div class="desc">ETB vs ACC - Highlights</div>
              </div>

            <div class="vid-item" onClick="document.getElementById('vid_frame').src='https://www.youtube.com/embed/-jPLuxod_jA?autoplay=1&rel=0&showinfo=0&autohide=1'">
                <div class="thumb"><img src="http://img.youtube.com/vi/-jPLuxod_jA/0.jpg"></div>
                <div class="desc">ETB vs ACC - Highlights</div>
              </div>

            <div class="vid-item" onClick="document.getElementById('vid_frame').src='https://www.youtube.com/embed/ayEONgC6yjo?autoplay=1&rel=0&showinfo=0&autohide=1'">
                <div class="thumb"><img src="http://img.youtube.com/vi/ayEONgC6yjo/0.jpg"></div>
                <div class="desc">ETB vs ACC - Highlights</div>
              </div>

            <div class="vid-item" onClick="document.getElementById('vid_frame').src='https://www.youtube.com/embed/zPpOykf85w4?autoplay=1&rel=0&showinfo=0&autohide=1'">
                <div class="thumb"><img src="http://img.youtube.com/vi/zPpOykf85w4/0.jpg"></div>
                <div class="desc">ETB vs ACC - Highlights</div>
              </div>
              
            <div class="vid-item" onClick="document.getElementById('vid_frame').src='https://www.youtube.com/embed/z3msLE-kVAU?autoplay=1&rel=0&showinfo=0&autohide=1'">
                <div class="thumb"><img src="http://img.youtube.com/vi/z3msLE-kVAU/0.jpg"></div>
                <div class="desc">ETB vs ACC - Highlights</div>
              </div>
              
            <div class="vid-item" onClick="document.getElementById('vid_frame').src='https://www.youtube.com/embed/fYhIC4F9aXs?autoplay=1&rel=0&showinfo=0&autohide=1'">
                <div class="thumb"><img src="http://img.youtube.com/vi/fYhIC4F9aXs/0.jpg"></div>
                <div class="desc">ETB vs ACC - Highlights</div>
              </div>
              
            <div class="vid-item" onClick="document.getElementById('vid_frame').src='https://www.youtube.com/embed/XNUE1f4Q3y4?autoplay=1&rel=0&showinfo=0&autohide=1'">
                <div class="thumb"><img src="http://img.youtube.com/vi/XNUE1f4Q3y4/0.jpg"></div>
                <div class="desc">ETB vs ACC - Highlights</div>
              </div>
              
            <div class="vid-item" onClick="document.getElementById('vid_frame').src='https://www.youtube.com/embed/4_C9vgbqsxw?autoplay=1&rel=0&showinfo=0&autohide=1'">
                <div class="thumb"><img src="http://img.youtube.com/vi/4_C9vgbqsxw/0.jpg"></div>
                <div class="desc">ETB vs ACC - Highlights</div>
              </div>
              
            <div class="vid-item" onClick="document.getElementById('vid_frame').src='https://www.youtube.com/embed/Hosd4_biAxw?autoplay=1&rel=0&showinfo=0&autohide=1'">
                <div class="thumb"><img src="http://img.youtube.com/vi/Hosd4_biAxw/0.jpg"></div>
                <div class="desc">ETB vs ACC - Highlights</div>
              </div>
              
            <div class="vid-item" onClick="document.getElementById('vid_frame').src='https://www.youtube.com/embed/CweIye96Prc?autoplay=1&rel=0&showinfo=0&autohide=1'">
                <div class="thumb"><img src="http://img.youtube.com/vi/CweIye96Prc/0.jpg"></div>
                <div class="desc">ETB vs ACC - Highlights</div>
              </div>
              
            <div class="vid-item" onClick="document.getElementById('vid_frame').src='https://www.youtube.com/embed/cTq5hAJdrmg?autoplay=1&rel=0&showinfo=0&autohide=1'">
                <div class="thumb"><img src="http://img.youtube.com/vi/cTq5hAJdrmg/0.jpg"></div>
                <div class="desc">ETB vs ACC - Highlights</div>
              </div>
              
            <div class="vid-item" onClick="document.getElementById('vid_frame').src='https://www.youtube.com/embed/QrGhPluNK64?autoplay=1&rel=0&showinfo=0&autohide=1'">
                <div class="thumb"><img src="http://img.youtube.com/vi/QrGhPluNK64/0.jpg"></div>
                <div class="desc">ETB vs ACC - Highlights</div>
              </div>

            <div class="vid-item" onClick="document.getElementById('vid_frame').src='https://www.youtube.com/embed/rEmWM81WyFg?autoplay=1&rel=0&showinfo=0&autohide=1'">
                <div class="thumb"><img src="http://img.youtube.com/vi/rEmWM81WyFg/0.jpg"></div>
                <div class="desc">ETB vs ACC - Highlights</div>
              </div>

            <div class="vid-item" onClick="document.getElementById('vid_frame').src='https://www.youtube.com/embed/uv_rQ0GiLQ8?autoplay=1&rel=0&showinfo=0&autohide=1'">
                <div class="thumb"><img src="http://img.youtube.com/vi/uv_rQ0GiLQ8/0.jpg"></div>
                <div class="desc">ETB vs ACC - Highlights</div>
              </div>

            <div class="vid-item" onClick="document.getElementById('vid_frame').src='https://www.youtube.com/embed/qbe3dZSfwLo?autoplay=1&rel=0&showinfo=0&autohide=1'">
                <div class="thumb"><img src="http://img.youtube.com/vi/qbe3dZSfwLo/0.jpg"></div>
                <div class="desc">ETB vs ACC - Highlights</div>
              </div>

            <div class="vid-item" onClick="document.getElementById('vid_frame').src='https://www.youtube.com/embed/_9Ju7gS3EjY?autoplay=1&loop=1&playlist=_9Ju7gS3EjY&rel=0&showinfo=0&autohide=1'">
                <div class="thumb"><img src="http://img.youtube.com/vi/FT_HqVYryhg/0.jpg"></div>
                <div class="desc">TCCC - City Cricket Club</div>
              </div>
            
      <div class="vid-item" onClick="document.getElementById('vid_frame').src='https://www.youtube.com/embed/hwFQtjQS_-c?autoplay=1&rel=0&showinfo=0&autohide=1'">
                <div class="thumb"><img src="http://img.youtube.com/vi/hwFQtjQS_-c/0.jpg"></div>
                <div class="desc">TCCC - 2015</div>
              </div>

      <div class="vid-item" onClick="document.getElementById('vid_frame').src='https://www.youtube.com/embed/CLlC7h_3Qc0?autoplay=1&rel=0&showinfo=0&autohide=1'">
                <div class="thumb"><img src="http://img.youtube.com/vi/CLlC7h_3Qc0/0.jpg"></div>
                <div class="desc">TCCC Sponsors - 2012</div>
              </div>

            <div class="vid-item" onClick="document.getElementById('vid_frame').src='https://www.youtube.com/embed/CPJiLogikL8?autoplay=1&rel=0&showinfo=0&autohide=1'">
                <div class="thumb"><img src="http://img.youtube.com/vi/CPJiLogikL8/0.jpg"></div>
                <div class="desc">TCCC Events - 2013</div>
              </div>

            <div class="vid-item" onClick="document.getElementById('vid_frame').src='https://www.youtube.com/embed/FtTZ8EfzoVk?autoplay=1&rel=0&showinfo=0&autohide=1'">
                <div class="thumb"><img src="http://img.youtube.com/vi/FtTZ8EfzoVk/0.jpg"></div>
                <div class="desc">TCCC Net Practice - 1</div>
              </div>
      <div class="vid-item" onClick="document.getElementById('vid_frame').src='https://www.youtube.com/embed/WC2GgRrI8rU?autoplay=1&rel=0&showinfo=0&autohide=1'">
                <div class="thumb"><img src="http://img.youtube.com/vi/WC2GgRrI8rU/0.jpg"></div>
                <div class="desc">TCCC Net Practice - 2</div>
              </div>

      <div class="vid-item" onClick="document.getElementById('vid_frame').src='https://www.youtube.com/embed/hwFQtjQS_-c?autoplay=1&rel=0&showinfo=0&autohide=1'">
                <div class="thumb"><img src="http://img.youtube.com/vi/hwFQtjQS_-c/0.jpg"></div>
                <div class="desc">TCCC - 2015</div>
              </div>

      <div class="vid-item" onClick="document.getElementById('vid_frame').src='https://www.youtube.com/embed/CLlC7h_3Qc0?autoplay=1&rel=0&showinfo=0&autohide=1'">
                <div class="thumb"><img src="http://img.youtube.com/vi/CLlC7h_3Qc0/0.jpg"></div>
                <div class="desc">TCCC Sponsors - 2012</div>
              </div>

      <div class="vid-item" onClick="document.getElementById('vid_frame').src='https://www.youtube.com/embed/CPJiLogikL8?autoplay=1&rel=0&showinfo=0&autohide=1'">
                <div class="thumb"><img src="http://img.youtube.com/vi/CPJiLogikL8/0.jpg"></div>
                <div class="desc">TCCC Events - 2013</div>
              </div>

      <div class="vid-item" onClick="document.getElementById('vid_frame').src='https://www.youtube.com/embed/a-_PZQ3IMS4?autoplay=1&rel=0&showinfo=0&autohide=1'">
                <div class="thumb"><img src="http://img.youtube.com/vi/a-_PZQ3IMS4/0.jpg"></div>
                <div class="desc">TCCC ETB vs ACC - Jun 2016</div>
              </div>
       <div class="vid-item" onClick="document.getElementById('vid_frame').src='https://www.youtube.com/embed/DIxmx3bkLOM?autoplay=1&rel=0&showinfo=0&autohide=1'">
                <div class="thumb"><img src="http://img.youtube.com/vi/DIxmx3bkLOM/0.jpg"></div>
                <div class="desc">TCCC ETB vs ACC - Jun 2016</div>
              </div>

      <div class="vid-item" onClick="document.getElementById('vid_frame').src='https://www.youtube.com/embed/_sKnmpoBeYw?autoplay=1&rel=0&showinfo=0&autohide=1'">
                <div class="thumb"><img src="http://img.youtube.com/vi/_sKnmpoBeYw/0.jpg"></div>
                <div class="desc">TCCC ETB vs ACC - Jun 2016</div>
              </div>


        </div>
        </div>

        <!-- LEFT AND RIGHT ARROWS -->
        <div class="arrows">
          <div class="arrow-left"><i class="fa fa-chevron-left fa-lg"></i></div>
          <div class="arrow-right"><i class="fa fa-chevron-right fa-lg"></i></div>
        </div>

    </div>
      </section>
      <script>
    $(function () {
        HH.CWCVideoHero.init();
    });
</script> 
      
      <section class="video-list">
        <div class="row">
          <div class="columns large-12">
            <h3 class="sectionTitle white">Recent Videos</h3>
            
            <!-- <div class="searchBar">
              <input type="text" placeholder="Search" id="video-search-input">
              <div class="searchBtn" id="video-search"><i class="icon-search"></i></div>
            </div> -->
            
            <div class="filterDropdown right"> 
            <!-- <a href="#!" class="button primary filterBtn">Filter by team<i class="icon-filter"></i> 
            <span class="bowlingIcon"></span>
            </a> -->
              <div class="filterDropdownContent">
                <div class="filterSection">
                  <h4>By Teams</h4>
                  <ul>
                    <li> <a data-id="AFG">ACC</a> </li>
                    <li> <a data-id="AUS">ITB</a> </li>
                    <li> <a data-id="BAN">LCC</a> </li>
                    <li> <a data-id="ENG">MCC</a> </li>
                    <li> <a data-id="IND">PCC</a> </li>
                    <li> <a data-id="IRE">RCC</a> </li>
                    <li> <a data-id="NZ">TLJ</a> </li>
                    <li> <a data-id="PAK">TMCC</a></li>
                  </ul>
                </div>
                <div class="options"> <a href="#!" class="button primary cancel"><i class="icon-remove"></i>Cancel</a> <a href="#!" class="button primary accept"><i class="icon-ok"></i>Accept</a> </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="columns large-12" id="all-videos">
            <ul class="small-block-grid-1 medium-block-grid-3 large-block-grid-4" id="video-list" data-count="8">
              <li><a href="videos.html" class="videoThumb max long"> <span class="thumbnail"> <span class="imgContainer"> <img src="img/9.jpg" alt=""> <span class="curve black"></span> <span class="videoIcon"></span> </span> </span>
                <figcaption> <span class="title">MCC vs TMCC</span>
                  <ul class="meta">
                    <li>24 March 2016</li>
                    <li>10852 views</li>
                    <li>1m 37s</li>
                  </ul>
                </figcaption>
                </a> </li>
              <li><a href="videos.html" class="videoThumb max long"> <span class="thumbnail"> <span class="imgContainer"> <img src="img/6.jpg" alt=""> <span class="curve black"></span> <span class="videoIcon"></span> </span> </span>
                <figcaption> <span class="title">Kids Training </span>
                  <ul class="meta">
                    <li>03 March 2016</li>
                    <li>1108 views</li>
                    <li>6m 00s</li>
                  </ul>
                </figcaption>
                </a> </li>
              <li><a href="videos.html" class="videoThumb max long"> <span class="thumbnail"> <span class="imgContainer"> <img src="img/11.jpg" alt=""> <span class="curve black"></span> <span class="videoIcon"></span> </span> </span>
                <figcaption> <span class="title">match highlights SSCC Vs BMCC</span>
                  <ul class="meta">
                    <li>04 February 2016</li>
                    <li>30642 views</li>
                    <li>1m 00s</li>
                  </ul>
                </figcaption>
                </a> </li>
              <li> <a href="videos.html" class="videoThumb max long"> <span class="thumbnail"> <span class="imgContainer"> <img src="img/7.jpg" alt=""> <span class="curve black"></span> <span class="videoIcon"></span> </span> </span>
                <figcaption> <span class="title">Kids highlights</span>
                  <ul class="meta">
                    <li>28 January 2016</li>
                    <li>30311 views</li>
                    <li>1m 09s</li>
                  </ul>
                </figcaption>
                </a> </li>
              <li> <a href="videos.html" class="videoThumb max long"> <span class="thumbnail"> <span class="imgContainer"> <img src="img/12.jpg" alt=""> <span class="curve black"></span> <span class="videoIcon"></span> </span> </span>
                <figcaption> <span class="title">FutureStars Gopi Akkineni</span>
                  <ul class="meta">
                    <li>21 January 2016</li>
                    <li>13879 views</li>
                    <li>1m 27s</li>
                  </ul>
                </figcaption>
                </a> </li>
              <li> <a href="videos.html" class="videoThumb max long"> <span class="thumbnail"> <span class="imgContainer"> <img src="img/13.jpg" alt=""> <span class="curve black"></span> <span class="videoIcon"></span> </span> </span>
                <figcaption> <span class="title">Top Score </span>
                  <ul class="meta">
                    <li>20 January 2016</li>
                    <li>3197 views</li>
                    <li>1m 15s</li>
                  </ul>
                </figcaption>
                </a> </li>
              <li><a href="videos.html" class="videoThumb max long"> <span class="thumbnail"> <span class="imgContainer"> <img src="img/16.jpg" alt=""> <span class="curve black"></span> <span class="videoIcon"></span> </span> </span>
                <figcaption> <span class="title">wickets highlights</span>
                  <ul class="meta">
                    <li>13 January 2016</li>
                    <li>4385 views</li>
                    <li>1m 16s</li>
                  </ul>
                </figcaption>
                </a> </li>
              <li> <a href="videos.html" class="videoThumb max long"> <span class="thumbnail"> <span class="imgContainer"> <img src="img/19.jpg" alt=""> <span class="curve black"></span> <span class="videoIcon"></span> </span> </span>
                <figcaption> <span class="title">Adelaide Oval feature</span>
                  <ul class="meta">
                    <li>23 November 2015</li>
                    <li>92 views</li>
                    <li>5m 33s</li>
                  </ul>
                </figcaption>
                </a> </li>
            </ul>
          </div>
        </div>  
      </section> 
    </div>
  </div>
  <div class="clear-both"></div>
</div>
<div>
  <div>
    <div class=""> </div>
  </div>
  <div class="clear-both"></div>
</div>
<div>
  <div>
    <div class="">
      <section class="most-viewed-videos">
        <div class="row title">
          <div class="columns large-12 title">
            <header class="sectionHeader">
              <h3 class="sectionTitle white">Most Viewed Videos</h3>
              <a href="" class="button primary">View All Videos<i class="icon-angle-right"></i></a> </header>
          </div>
          <div class="columns large-6"> <a href="videos.html">
            <div class="videoWrapper"> <img src="img/14.jpg">
              <div class="video-icon"></div>
              <div class="video-play"></div>
            </div>
            <div class="thumb-info">
              <div class="thumb-title">Amazing Team</div>
              <span>1,244,019 views</span> <span> | </span> <span>0m 34s</span> </div>
            </a> </div>
          <div class="columns large-6">
            <div class="row thumbs">
              <div class="columns large-12">
                <ul class="small-block-grid-1 medium-block-grid-3">
                  <li> <a href="videos.html">
                    <div class="videoWrapper"> <img src="img/6.jpg">
                      <div class="video-icon"></div>
                      <div class="video-play"></div>
                    </div>
                    <div class="thumb-info">
                      <div class="thumb-title">Kids Matches highlights</div>
                      <span>1,152,237 views</span> <span> | </span> <span>2m 07s</span> </div>
                    </a> </li>
                  <li> <a href="videos.html">
                    <div class="videoWrapper"> <img src="img/7.jpg">
                      <div class="video-icon"></div>
                      <div class="video-play"></div>
                    </div>
                    <div class="thumb-info">
                      <div class="thumb-title">best wickets in cricket</div>
                      <span>981,310 views</span> <span> | </span> <span>0m 59s</span> </div>
                    </a> </li>
                  <li> <a href="videos.html">
                    <div class="videoWrapper"> <img src="img/8.jpg">
                      <div class="video-icon"></div>
                      <div class="video-play"></div>
                    </div>
                    <div class="thumb-info">
                      <div class="thumb-title">BMO v SSCC Match Highlights 15th March 2015</div>
                      <span>848,328 views</span> <span> | </span> <span>5m 13s</span> </div>
                    </a> </li>
                  <li> <a href="videos.html">
                    <div class="videoWrapper"> <img src="img/9.jpg">
                      <div class="video-icon"></div>
                      <div class="video-play"></div>
                    </div>
                    <div class="thumb-info">
                      <div class="thumb-title">amazing catch TLJ vs BMCC cricket League</div>
                      <span>829,773 views</span> <span> | </span> <span>0m 53s</span> </div>
                    </a> </li>
                  <li> <a href="videos.html">
                    <div class="videoWrapper"> <img src="img/11.jpg">
                      <div class="video-icon"></div>
                      <div class="video-play"></div>
                    </div>
                    <div class="thumb-info">
                      <div class="thumb-title">ETB v BMO Match Highlights 23rd August 2015</div>
                      <span>775,230 views</span> <span> | </span> <span>3m 01s</span> </div>
                    </a> </li>
                  <li> <a href="videos.html">
                    <div class="videoWrapper"> <img src="img/12.jpg">
                      <div class="video-icon"></div>
                      <div class="video-play"></div>
                    </div>
                    <div class="thumb-info">
                      <div class="thumb-title">sscc v bmo Semi Final -2 Highlights</div>
                      <span>752,947 views</span> <span> | </span> <span>4m 29s</span> </div>
                    </a> </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
  <div class="clear-both"></div>
</div>
</div>