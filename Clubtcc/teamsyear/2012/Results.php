<?php
$sel="history";
include_once('../../header.php');
?>
<link rel="stylesheet" type="text/css" href="../../css/accordion.css">
<style>
.heroImg .past p, .heroImg .past h3 {
	display: none
}
.heroImg .overlay {
	height: 32px
}
.mainContent.home .homeHero.hh {
	border-bottom: none;
}
.momentsHeader h2 {
	background: #222;
}
.hh-hide-20-02 {
	background: none;
	display: none;
}
#fantasy-promo, .fantasyBanner {
	display: none !important;
	height: 0px !important;
}
.header_countdown.hh-gmv {
	display: none !important;
}
.tcc-skin-wt20 #header_countdown {
	display: none;
}
#menu-wt20-spw {
	display: none;
}
.tcc-skin-wt20 .potd .video-player .voted .button.primary {
	background-color: #ddd;
	color: #fff;
	cursor: default;
}
.tcc-skin-wt20 .wt20-16-fmw1, .tcc-skin-wt20 .wt20-16-fww {
	display: none;
}
</style>

<div>
  <div>
    <div class=""></div>
  </div>
  <div class="clear-both"></div>
</div>

<div class="content">
  <div>
    <div class="" style="margin: 0px; ">
      <div>
        <div>
          <div class="">
            <div data-widget-type="tournamentstats_cwc_widget" data-season="cwc-2015" data-widget-size="medium">
              <div class="row">
                <div class="columns medium-4 large-3">
                  <div class="listNavContainer"> 
                    <!-- <a class="current" id ="statCurrent" >Top Runs Scoress<i class="icon-caret-down"></i></a> -->
                    <div class="left-menu"> 
                      <!-- <div class="logo"><i class="fa fa-align-justify"></i>
                        <div>Pure CSS Accordion Nav</div>
                      </div> -->
                      <div class="accordion">
                        <div class="section">
                          <input type="radio" name="accordion-1" id="section-1" value="toggle"/>
                          <label for="section-1"><span style="color:white"><a href="../2015/teams.html"></a> TCCC League 2015</label>
                          <div class="content">
                            <ul>
                              <li><i class="fa fa-user" style="margin-right: 10px;"></i><a href="../2015/teams.html">Teams</a></li>
                              <li><i class="fa fa-inbox" style="margin-right: 10px;"></i><a href="../2015/Fixtures.html">Fixtures</a></li>
                              <li><i class="fa fa-share" style="margin-right: 10px;"></i><a href="../2015/Pointstable.html">Pointstable</a></li>
                              <li><i class="fa fa-home" style="margin-right: 10px;"></i><a href="../2015/Results.html">Results</a></li>
                              <li><i class="fa fa-archive" style="margin-right: 10px;"></i><a href="../2015/Batting.html">Batting Statistics</a></li>
                              <li><i class="fa fa-home" style="margin-right: 10px;"></i><a href="../2015/Bowling.html">Bowling Statistics</a></li>
                            </ul>
                          </div>
                        </div>
                        <div class="section">
                          <input type="radio" name="accordion-1" id="section-2" value="toggle"/>
                          <label for="section-2"><span style="color:white"><a href="../2014/teams.html"></a> TCCC League 2014</label>
                          <div class="content">
                            <ul>
                              <li><i class="fa fa-user" style="margin-right: 10px;"></i><a href="../2014/teams.html">Teams</a></li>
                              <li><i class="fa fa-cog" style="margin-right: 10px;"></i><a href="../2014/Fixtures.html">Fixtures</a></li>
                              <li><i class="fa fa-group" style="margin-right: 10px;"></i><a href="../2014/Pointstable.html">Pointstable</a></li>
                              <li><i class="fa fa-sitemap" style="margin-right: 10px;"></i><a href="../2014/Results.html">Results</a></li>
                              <li><i class="fa fa-users" style="margin-right: 10px;"></i><a href="../2014/Batting.html">Batting Statistics</a></li>
                              <li><i class="fa fa-share" style="margin-right: 10px;"></i><a href="../2014/Bowling.html">Bowling Statistics</a></li>
                            </ul>
                          </div>
                        </div>
                        <div class="section">
                          <input type="radio" name="accordion-1" id="section-3"  value="toggle"/>
                          <label for="section-3"><span style="color:white"><a href="teams.html"></a> TCCC League 2013</label>
                          <div class="content">
                            <ul>
                              <li><i class="fa fa-user" style="margin-right: 10px;"></i><a href="../2013/teams.html">Teams</a></li>
                              <li><i class="fa fa-cog" style="margin-right: 10px;"></i><a href="../2013/Fixtures.html">Fixtures</a></li>
                              <li><i class="fa fa-group" style="margin-right: 10px;"></i><a href="../2013/Pointstable.html">Pointstable</a></li>
                              <li><i class="fa fa-sitemap" style="margin-right: 10px;"></i><a href="../2013/Results.html">Results</a></li>
                            </ul>
                          </div>
                        </div>
                        <div class="section">
                          <input type="radio" name="accordion-1" id="section-4"  checked="checked"/>
                          <label for="section-4"><span style="color:white"><a href="teams.html"></a> TCCC League 2012</label>
                          <div class="content">
                            <ul>
                              <li><i class="fa fa-group" style="margin-right: 10px;"></i><a href="Pointstable.html" >Points table</a></li>
                              <li><i class="fa fa-sitemap" style="margin-right: 10px;"></i><a href="Results.html" class="active">Results</a></li>
                            </ul>
                          </div>
                        </div>

                        <div class="section">
                          <input type="radio" name="accordion-1" id="section-5"  value="toggle"/>
                          <label for="section-5"><span style="color:white"><a href="teams.html"></a> TCCC League 2011</label>
                          <div class="content">
                            <ul>
                              <li><i class="fa fa-group" style="margin-right: 10px;"></i><a href="../2011/Pointstable.html">Points table</a></li>
                              <li><i class="fa fa-sitemap" style="margin-right: 10px;"></i><a href="../2011/Results.html">Results</a></li>
                              <li><i class="fa fa-user" style="margin-right: 10px;"></i><a href="../2011/Event.html">Event Winner</a>
                            </ul>
                          </div>
                        </div>

                        <div class="section">
                          <input type="radio" name="accordion-1" id="section-6"  value="toggle"/>
                          <label for="section-6"><span style="color:white">TCCC League 2010</label>
                          <div class="content">
                            <ul>
                              <li><i class="fa fa-user" style="margin-right: 10px;"></i><a href="../2010/teams.html">Teams</a></li>
                              <li><i class="fa fa-group" style="margin-right: 10px;"></i><a href="../2010/Pointstable.html">Points table</a></li>
                              <li><i class="fa fa-sitemap" style="margin-right: 10px;"></i><a href="../2010/Results.html">Results</a></li>
                              <li><i class="fa fa-user" style="margin-right: 10px;"></i><a href="../2010/Magazine.html">Magazine</a>
                              <li><i class="fa fa-user" style="margin-right: 10px;"></i><a href="../2010/FinalStanding.html">Final Standing</a>
                              <li><i class="fa fa-user" style="margin-right: 10px;"></i><a href="../2010/CricketFestival.html">Cricket Festival</a>
                            </ul>
                          </div>
                        </div>

                        <div class="section">
                          <input type="radio" name="accordion-1" id="section-7"  value="toggle"/>
                          <label for="section-7"><span style="color:white">TCCC League 2009</label>
                          <div class="content">
                            <ul>
                              <li><i class="fa fa-cog" style="margin-right: 10px;"></i><a href="../2009/InviteFestival.html">Invite Festival</a></li>
                              <li><i class="fa fa-sitemap" style="margin-right: 10px;"></i><a href="../2009/CricketFestival.html" >Cricket Festival</a></li>
                            </ul>
                          </div>
                        </div>

                        <div class="section">
                          <input type="radio" name="accordion-1" id="section-8"  value="toggle"/>
                          <label for="section-8"><span style="color:white">Member Ship</label>
                          <div class="content">
                            <ul>
                              <li><i class="fa fa-cog" style="margin-right: 10px;"></i><a href="../membership/membership.html">Member ship</a></li>
                              <li><i class="fa fa-sitemap" style="margin-right: 10px;"></i><a href="../membership/ListofMembership.html">List Membership</a></li>
                            </ul>
                          </div>
                        </div>
                        
                      </div><!-- accordion --> 
                    </div><!-- left-menu --> 
                  </div><!-- listNavContainer --> 
                </div><!-- End Col- 4 -->
                
                <div class="columns medium-8 large-9">
                  <div class="listNavContainer">
                    <div class="content">
                      <div class="">
                        <div class="row">
                          <ul class="tournamentPoolsContainer">
                            <div class="cwcSection" style="padding: 0;">
                              <div class="statsTable">
                                <div class="row">
                                  <div class="columns large-12">
                                    <div class="tableHeader colour0">
                                      <h5 class="subHeading" style="text-align: center;">TCCC LEAGUE-2012 Results</h5>
                                    </div>
                                    <div class="tableContainer">
                                        <table>
                                          <tbody>
                                            <tr>
                                              <th>S.No</th>
                                              <th>Date</th>
                                              <th>Team</th>
                                              <th>Results</th>
                                              <th>Scores</th>
                                            </tr>
                                            <tr>
                                              <td>1</td>
                                              <td>5/19/12 - Sat</td> 
                                              <td>BMCC vs TLJ</td>
                                              <td>BMCC Won by 4Wkts</td>
                                              <td>TLJ - 109/9 in 25 overs BMCC - 110/6 in 22.3 overs</td>
                                            </tr>
                                            <tr>
                                              <td>2</td>
                                              <td>5/19/12 - Sat</td>
                                              <td>ACC vs TB</td>
                                              <td>TB Won by 89 Runs</td>
                                              <td>TB - 148/6 in 25 Overs  ACC – 59/10 in 17.4 overs</td>
                                            </tr>
                                            <tr>
                                              <td>3</td>
                                              <td>5/20/12 - Sun</td>
                                              <td>TB vs KPMG</td>
                                              <td>TB Won by 19 Runs</td>
                                              <td>TB - 142/9 in 25 oversKPMG - 123/10 in 23.5 overs</td>
                                            </tr>
                                            <tr>
                                              <td>4</td>
                                              <td>5/20/12 - Sun</td>
                                              <td>ICICI vs JAI HO</td>
                                              <td>JAI HO Won by 84 Runs</td>
                                              <td>Jai Ho - 141/10 in 22.4 overs  ICICI-57/10 in 17.2 overs</td>
                                            </tr>
                                            <tr>
                                              <td>5</td>
                                              <td>5/26/12 - Sat</td>
                                              <td>ACC vs ATN</td>
                                              <td>ACC Won by 34Runs</td>
                                              <td>ACC -174/6 in 25 Overs  ATN - 140/10 in 22.4 Overs</td>
                                            </tr>
                                            <tr>
                                              <td>6</td>
                                              <td>5/26/12 - Sat</td>
                                              <td>BMCC vs KPMG</td>
                                              <td>BMCC Won by 6wkts</td>
                                              <td>KPMG - 77/10 in 20.2  BMCC - 81/4 in 17.1 Overs</td>
                                            </tr>
                                            <tr>
                                              <td>7</td>
                                              <td>5/27/12 - Sun</td>
                                              <td>TB vs JAI HO</td>
                                              <td>TB Won by 42 Runs</td>
                                              <td>TB - 154/10 in 25 Overs  JAI HO - 112/10 in 22 Overs</td>
                                            </tr>
                                            <tr>
                                              <td>8</td>
                                              <td>5/27/12 - Sun</td>
                                              <td>ICICI vs TLJ</td>
                                              <td>ICICI Won by 4 Wkts</td>
                                              <td>TLJ -76/10 in 21.4 Overs  ICICI - 77/6 in 20.3 Overs</td>
                                            </tr>
                                            <tr>
                                              <td>9</td>
                                              <td>6/2/12 - Sat</td>
                                              <td>JAI HO vs ACC</td>
                                              <td></td>
                                              <td>RAIN OUT</td>
                                            </tr>
                                            <tr>
                                              <td>10</td>
                                              <td>6/2/12 - Sat</td>
                                              <td>KPMG vs TLJ </td>
                                              <td></td>
                                              <td>RAIN OUT</td>
                                            </tr>
                                            <tr>
                                              <td>11</td>
                                              <td>6/3/12 - Sun</td>
                                              <td>BMCC vs ATN</td>
                                              <td>BMCC Won by 9Wkts</td>
                                              <td>ATN - 92/10 in 22.1 Overs  BMCC - 94/1 in 17 Overs</td>
                                            </tr>
                                            <tr>
                                              <td>12</td>
                                              <td>6/3/12 - Sun</td>
                                              <td>ICICI vs TB</td>
                                              <td>TB Won by115 Runs</td>
                                              <td>TB - 174/8 in 25 Overs  ICICI - 59/10 in 19.2 Overs</td>
                                            </tr>
                                            <tr>
                                              <td>13</td>
                                              <td>6/16/12 - Sat</td>
                                              <td>BMCC vs ICICI</td>
                                              <td>BMCC Won by 28 Runs</td>
                                              <td>BMCC - 146/9 in 25 Overs  ICICI - 118/9 in 25 Overs</td>
                                            </tr>
                                            <tr>
                                              <td>14</td>
                                              <td>6/16/12 - Sat</td>
                                              <td>ATN vs TLJ</td>
                                              <td>ATN Won by 4Wkts</td>
                                              <td>TLJ - 179/3 in 25 Overs  ATN - 180/6 in 23.2Overs</td>
                                            </tr>
                                            <tr>
                                              <td>15</td>
                                              <td>6/17/12 - Sun</td>
                                              <td>JAI HO vs TB</td>
                                              <td>TB Won by 107 Runs</td>
                                              <td>TB - 206/8 in 25 Overs  JAI HO - 99/10 in 20 Overs</td>
                                            </tr>
                                            <tr>
                                              <td>16</td>
                                              <td>6/17/12 - Sun</td>
                                              <td>ACC vs ATN</td>
                                              <td>ACC Won by 4Runs</td>
                                              <td>ACC - 150/7 in 25 Overs  ATN - 146/9 in 25 Overs</td>
                                            </tr>
                                            <tr>
                                              <td>17</td>
                                              <td>6/23/12 - Sat</td>
                                              <td>BMCC vs TB</td>
                                              <td>TB Won by 26 Runs</td>
                                              <td>TB - 207/9 in 25 Overs  BMCC - 181/8 in 25 Overs</td>
                                            </tr>
                                            <tr>
                                              <td>18</td>
                                              <td>6/23/12 - Sat</td>
                                              <td>ACC vs TLJ</td>
                                              <td>ACC Won by 9 Wkts</td>
                                              <td>TLJ - 93/9 in 25 Overs  ACC - 94/1 in 9.3 Overs</td>
                                            </tr>
                                            <tr>
                                              <td>19</td>
                                              <td>6/24/12 - Sun</td>
                                              <td>JAI HO vs KPMG</td>
                                              <td>JAI HO Won by 50 Runs</td>
                                              <td>JAI HO-182/4 in 25 OversKPMG-132/10 in 21.4 Overs</td>
                                            </tr>
                                            <tr>
                                              <td>20</td>
                                              <td>6/24/12 - Sun</td>
                                              <td>ATN vs ICICI</td>
                                              <td>ATN Won by 42 Runs</td>
                                              <td>ATN-214/8 in 25 Overs  ICICI-172/8 in 25 Overs</td>
                                            </tr>
                                            <tr>
                                              <td>21</td>
                                              <td>6/30/12 - Sat</td>
                                              <td>KPMG vs ICICI</td>
                                              <td>KPMG Won by 9 Wkts</td>
                                              <td>ICICI - 66/10 in Overs  KPMG - 67/1 in 9.4 Overs</td>
                                            </tr>
                                            <tr>
                                              <td>22</td>
                                              <td>6/30/12 - Sat</td>
                                              <td>ATN vs TLJ</td>
                                              <td>ATN Won by 17 Runs</td>
                                              <td>ATN - 217/4 in 25 Overs  TLJ - 200/5 in Overs</td>
                                            </tr>
                                            <tr>
                                              <td>23</td>
                                              <td>7/1/12 - Sun</td>
                                              <td>BMCC vs KPMG</td>
                                              <td>BMCC WON</td>
                                              <td>Forfeit </td>
                                            </tr>
                                            <tr>
                                              <td>24</td>
                                              <td>7/1/22 - Sun</td>
                                              <td>ACC vs JAI HO</td>
                                              <td>JAI HO Won by 7Wkts</td>
                                              <td>ACC - 96/10 in 20.1 Overs  JAI HO - 97/3 in 12.3 Overs</td>
                                            </tr>
                                            <tr>
                                              <td>25</td>
                                              <td>7/7/12 - Sat</td>
                                              <td>KPMG vs ACC</td>
                                              <td>KPMG Won by 7 Wkts</td>
                                              <td>ACC - 111/5 in16 Overs  KPMG - 115/3 IN 14 Overs</td>
                                            </tr>
                                            <tr>
                                              <td>26</td>
                                              <td>7/7/12 - Sat</td>
                                              <td>BMCC vs JAI HO</td>
                                              <td>BMCC Won by 5 Wkts</td>
                                              <td>JAI HO - 122/5 in 16 Overs  BMCC - 123/5 in 16 Overs</td>
                                            </tr>
                                            <tr>
                                              <td>27</td>
                                              <td>7/8/12 - Sun</td>
                                              <td>TB vs ATN</td>
                                              <td>TB Won by 44 Runs</td>
                                              <td>TB - 154/10 in 25 Overs  ATN - 110/10 in 21.3 Overs</td>
                                            </tr>
                                            <tr>
                                              <td>28</td>
                                              <td>7/8/12 - Sun</td>
                                              <td>ICICI vs TLJ</td>
                                              <td>TLJ Won by 40 Runs</td>
                                              <td>TLJ - 168/8 in 25 Overs  ICICI - 128/7 in 25 Overs</td>
                                            </tr>
                                            <tr>
                                              <td>29</td>
                                              <td>7/14/12 -Sat</td>
                                              <td>BMCC vs ACC</td>
                                              <td>BMCC Won by 7Wkts</td>
                                              <td>ACC-194/7 in 25 Overs  BMCC - 198/3 in 23.1 Overs</td>
                                            </tr>
                                            <tr>
                                              <td>30</td>
                                              <td>7/14/12 -Sat</td>
                                              <td>ICICI vs JAI HO</td>
                                              <td>JAI HO Won by 142 Runs</td>
                                              <td>JAI HO - 252/3 in 25 Overs  ICICI - 110/10 in 22 Overs</td>
                                            </tr>
                                            <tr>
                                              <td>31</td>
                                              <td>7/15/12 -Sun</td>
                                              <td>ACC vs TLJ</td>
                                              <td>ACC Won by 7Wkts</td>
                                              <td>TLJ - 139/8 in 25 Overs  ACC - 140/3 in 14.3 Overs</td>
                                            </tr>
                                            <tr>
                                              <td>32</td>
                                              <td>7/15/12 -Sun</td>
                                              <td>ATN vs KPMG</td>
                                              <td>KPMG Won by 6 Runs</td>
                                              <td>KPMG - 185/6 in 25 Overs  ATN - 179/10 in 24.2 Overs
                                                </td>
                                            </tr>
                                            <tr>
                                              <td>33</td>
                                              <td>7/21/12 - Sat</td>
                                              <td>TB vs KPMG</td>
                                              <td>TB Won by 8Wkts</td>
                                              <td>KPMG - 165/6 in 25 Overs  TB - 166/2 in 13.3 Overs</td>
                                            </tr>
                                            <tr>
                                              <td>34</td>
                                              <td>7/21/12 - Sat</td>
                                              <td>JAI HO vs TLJ</td>
                                              <td>JAI HO Won by 166 Runs</td>
                                              <td>JAI HO - 237/7 in 25 Overs  TLJ - 71/10 in 16.3 Over</td>
                                            </tr>
                                            <tr>
                                              <td>35</td>
                                              <td>7/22/12 - Sun</td>
                                              <td>ATN vs BMCC</td>
                                              <td>ATN Won by 50 Runs</td>
                                              <td>ATN - 207/3 in 25 Overs  BMCC - 157/9 in 24 Overs</td>
                                            </tr>
                                            <tr>
                                              <td>36</td>
                                              <td>7/22/12 - Sun</td>
                                              <td>ACC vs ICICI</td>
                                              <td>ICICI Won by 34 Runs</td>
                                              <td>ICICI - 225/6 in 25 Overs  ACC - 191/7 in 25 Overs</td>
                                            </tr>
                                            <tr>
                                              <td>37</td>
                                              <td>7/28/12 - Sat</td>
                                              <td>ATN vs JAI HO</td>
                                              <td>ATN Won by 6Wkts</td>
                                              <td>JAI HO - 126/10 in 24.3 Overs  ATN - 127/4 in 24 Overs</td>
                                            </tr>
                                            <tr>
                                              <td>38</td>
                                              <td>7/28/12 - Sat</td>
                                              <td>ACC vs BMCC</td>
                                              <td>BMCC Won by 91 Runs</td>
                                              <td>BMCC - 150/9 in 25 Overs  ACC - 59/10 in 16 Overs</td>
                                            </tr>
                                            <tr>
                                              <td>39</td>
                                              <td>7/29/12 - Sun</td>
                                              <td>TB vs ICICI</td>
                                              <td>TB Won by 99 Runs</td>
                                              <td>TB - 221/7 in 25 Overs  ICICI - 122/9 in 25 Overs</td>
                                            </tr>
                                            <tr>
                                              <td>40</td>
                                              <td>7/29/12 - Sun</td>
                                              <td>KPMG vs TLJ</td>
                                              <td>KPMG Won by 51 Runs</td>
                                              <td>KPMG - 164/6 in 25 Overs  TLJ - 103/10 in 23 Overs</td>
                                            </tr>
                                            <tr>
                                              <td>41</td>
                                              <td>8/4/12 - Sat</td>
                                              <td>ATN vs TB</td>
                                              <td>TB Won</td>
                                              <td>Forfeit</td>
                                            </tr>
                                            <tr>
                                              <td>42</td>
                                              <td>8/4/12 - Sat</td>
                                              <td>ICICI vs KPMG</td>
                                              <td>KPMG Won by 6Wkts</td>
                                              <td>ICICI - 164/7 in 25 Overs  KPMG - 165/4 in 22 Overs</td>
                                            </tr>
                                            <tr>
                                              <td>43</td>
                                              <td>8/5/12 - Sun</td>
                                              <td>JAI HO vs TLJ</td>
                                              <td>JAI HO Won by 6Wkts</td>
                                              <td>TLJ - 107/7 in 25 Overs  JAI HO - 108/4 in 17 Overs</td>
                                            </tr>
                                            <tr>
                                              <td>44</td>
                                              <td>8/5/12 - Sun</td>
                                              <td>BMCC vs TB</td>
                                              <td >TB Won by 5 Wkts</td>
                                              <td>BMCC - 147/8 in 25 Overs  TB - 150/5 in 15.3 Overs</td>
                                            </tr>
                                            <tr>
                                              <td>45</td>
                                              <td>8/11/12 - Sat</td>
                                              <td>BMCC vs ICICI</td>
                                              <td>BMCC Won by 10Wkts</td>
                                              <td>ICICI - 58/10 in 12.2 Overs  BMCC - 59/0 in 7.1Overs</td>
                                            </tr>
                                            <tr>
                                              <td>46</td>
                                              <td>8/11/12 - Sat</td>
                                              <td>ACC vs KPMG</td>
                                              <td>KPMG Won by 8Wkts</td>
                                              <td>ACC - 95/5 in 15 Overs  KPMG - 96/2 in 14 Overs</td>
                                            </tr>
                                            <tr>
                                              <td>47</td>
                                              <td>8/12/12 - Sun</td>
                                              <td>TB vs TLJ</td>
                                              <td>TB Won by 94 Runs</td>
                                              <td>TB - 197/6 in 25 Overs  TLJ - 103/7 in 25 Overs</td>
                                            </tr>
                                            <tr>
                                              <td>48</td>
                                              <td>8/12/12 - Sun </td>
                                              <td>ATN vs JAI HO</td>
                                              <td>JAI HO Won by 56 Runs</td>
                                              <td>JAI HO - 135/9 in 25 Overs  ATN - 79/10 in 19.2 Overs</td>
                                            </tr>
                                            <tr>
                                              <td>49</td>
                                              <td>8/25/12 - Sat</td>
                                              <td>KPMG vs JAIHO</td>
                                              <td>JAI HO Won by 4Wkts</td>
                                              <td>KPMG - 162/8 in 25 Overs  JAI HO - 163/6 in 22 Overs</td>
                                            </tr>
                                            <tr>
                                              <td>50</td>
                                              <td>8/25/12 - Sat</td>
                                              <td>ACC vs TB</td>
                                              <td>ACC Won by 8 Runs</td>
                                              <td>ACC - 148/7 in 25 Overs  TB - 140/8 in 25 Overs</td>
                                            </tr>
                                            <tr>
                                              <td>51</td>
                                              <td>8/26/12 - Sun</td>
                                              <td>BMCC vs TLJ</td>
                                              <td>BMCC Won by 80 Runs</td>
                                              <td>BMCC - 200/5 in 25 Overs  TLJ - 120/9 in 25 Overs</td>
                                            </tr>
                                            <tr>
                                              <td>52</td>
                                              <td>8/26/12 - Sun</td>
                                              <td>ATN vs ICICI</td>
                                              <td>ATN Won by 127 Runs </td>
                                              <td>ATN - 187/10 in 25 Overs  ICICI - 60/10 in 22 Overs</td>
                                            </tr>
                                            <tr>
                                              <td>53</td>
                                              <td>9/1/2012 - Sat</td>
                                              <td>BMCC vs JAI HO</td>
                                              <td>JAI HO Won by 1Wkt</td>
                                              <td>BMCC - 141/6 in 25 Overs  JAHI HO - 142/9 in 24 Overs</td>
                                            </tr>
                                            <tr>
                                              <td>54</td>
                                              <td>9/1/2012 - Sat</td>
                                              <td>ATN vs KPMG</td>
                                              <td >ATN Won by 34 Runs</td>
                                              <td>ATN - 172/8 in 25 Overs  KPMG - 138/10 in 22.1 Overs</td>
                                            </tr>
                                            <tr>
                                              <td>55</td>
                                              <td>9/2/2012 - Sun</td>
                                              <td>ICICI vs ACC</td>
                                              <td>ACC Won by 9Wkts</td>
                                              <td>ICICI - 19/6 in 7.3 Overs  ACC - 20/1 in 3.1 Overs</td>
                                            </tr>
                                            <tr>
                                              <td>56</td>
                                              <td>9/2/2012 - Sun</td>
                                              <td>TLJ vs TB</td>
                                              <td>TB Won by 8Wkts</td>
                                              <td>TLJ - 98/8 IN 25 Overs  TB - 99/2 in 10.5 Overs</td>
                                            </tr>
                                            <tr>
                                              <td>57</td>
                                              <td>9/15/12 - FINAL</td>
                                              <td>BMCC vs TB</td>
                                              <td>BMCC Won by 2Wkts</td>
                                              <td>TB - 101/10 in 19.1 Overs  BMCC - 102/8 in 18.4 Overs</td>
                                            </tr>
                                            <tr>
                                              <td>58</td>
                                              <td>9/15/12 - 3rd Place</td>
                                              <td>ATN vs JAI HO</td>
                                              <td>JAI HO Won by 59 Runs</td>
                                              <td>JAI HO - 139/5 in 20 Overs  ATN - 80/10 in 18.3 Overs</td>
                                            </tr>
                                          </tbody>
                                        </table>
                                    </div><!-- End Table --> 
                                    
                                  </div><!-- End col-12 --> 
                                </div>  <!-- End Row -->
                              </div><!-- End statsTable --> 
                            </div><!-- End cwcSection -->
                          </ul>
                        </div><!-- End Row --> 
                      </div>
                    </div><!-- content --> 
                  </div><!-- End listNavContainer --> 
                </div><!-- Eng Col-8 --> 
                
              </div>
            </div>
          </div>
        </div>
        <div class="clear-both"></div>
      </div>
    </div>
  </div>
  <div class="clear-both"></div>
</div>

<?php include_once('../../footer.php');?>