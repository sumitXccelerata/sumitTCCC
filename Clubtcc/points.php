<?php 
$sel = 'points';
include_once('header.php');
       $tourPoints = tourPoints($tour,$memcache);
  ?>


<style>
.tableContainer table td, .tableContainer table th {
  text-align: center;
  font-weight: normal;
  text-transform: uppercase;
}
</style>
<div class="content">
  <div>
    <div class="">
        <div class="row">
          <header class="cwcPageHeader alt">
            <h2 class="pageTitle">Points Table</h2>
          </header>

          <ul class="touRRamentPoolsContainer">
          <div class="cwcSection">
            <div class="statsTable">
              <div class="row">
                <div class="columns large-12">
                  <div class="tableContainer">
                    <table>
                      <tbody>
                        <tr>
                          <th style="text-align:center">Pos</th>
                          <th class="team">Team</th>
                          <th>Matches</th>  <!-- Matches -->
                          <th>Won</th>  <!-- Won -->
                          <th>Lost</th> <!-- Lost -->
                          <th class="toHide">Tied</th>  <!-- Tied -->
                          <th class="toHide">N/R</th> <!-- N/R -->
                          <th class="toHide">Net RR</th>  <!-- Net RR -->
                          <th>Points</th> <!-- Points -->
                        </tr>
						<?php $i=1; foreach($tourPoints as $team){ ?>
                        <tr>
                          <td style="text-align:center"><?php echo $i; ?></td>
                          <td class="team">
                            <a href="teams/<?php echo $team['team_small_name']; ?>.html">
                            <div style="float:left;"><img src='services/<?php echo $team['team_logo']; ?>' alt='' style="width:30px;height: 30px;vertical-align: -5px;" /></div>
                            <span class="long" style="vertical-align: -5px; margin-left:10px;"><?php echo $team['team_name']; ?></span>
                            <span class="short" style="vertical-align: -5px; margin-left:10px;"><?php echo $team['team_small_name']; ?></span>
                            </a>
                          </td>
                          <td><?php echo $team['played']; ?></td>  <!-- Matches -->
                          <td><?php echo $team['won']; ?></td>  <!-- Won -->
                          <td><?php echo $team['Lost']; ?></td>  <!-- Lost --> 
                          <td class="toHide"><?php echo $team['tied']; ?></td> <!-- Tied -->
                          <td class="toHide"><?php echo $team['nr']; ?></td> <!-- N/R -->
                          <td class="toHide"><?php if($team['runrate']==""){echo "0.000";}else{echo $team['runrate'];}?></td> <!-- Net RR -->
                          <td><?php echo $team['points']; ?></td> <!-- Points -->
                        </tr>
						<?php $i++; } ?>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div><!-- End Table -->
          </ul>
        </div>
      </div>
    </div>
  <div class="clear-both"> </div>
</div>

<?php include_once('footer.php');?>