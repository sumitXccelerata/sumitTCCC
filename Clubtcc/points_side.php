<?php       
	$tourPoints = tourPoints($tour,$memcache);
  ?>

<div class="poolTable homePoolTable">
                  <div class="homeTableContainer">
                    <ul class="nav homePoolNav">
                      <li class="groupToggle active" data-navid="0"> <a href="points.html">Points</a> </li>
                    </ul>
                    <table class="tableLayout dark">
                      <tbody data-tabid="0" style="display:;">
                        <tr>
                          <th>Teams</th>
                          <th>Played</th>
                          <th style="padding-right: 10px;">points</th>
                        </tr>
						<?php foreach($tourPoints as $team){ ?>
                        <tr>
                          <td><ul>
                              <a href="/teams/<?php echo $team['team_small_name']; ?>.html">
                              <li class="tLogo30x20"><img src='/services/<?php echo $team['team_logo']; ?>' alt='' style="width:30px;height: 20px;vertical-align: -5px;" /></li>
                              <li class="teamNameSide"><?php echo $team['team_small_name']; ?></li>
                              </a>
                            </ul></td>
                          <td>0</td>
                          <td>0</td>
                        </tr>
                        <?php } ?>
                      </tbody>
                    </table>
                  </div>
                  <a href="/points.html" class="button primary button-table">Full Standings<i class="icon-angle-right"></i></a></div>