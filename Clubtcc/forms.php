<?php 
$sel = 'about';
include_once('header.php');
?>
<style>
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
    border-spacing: 0;
    width: 100%;
    border: 1px solid #ddd;
}

th, td {
    border: none;
    text-align: left;
    padding: 8px;
}

tr:nth-child(even){background-color: #f2f2f2}

.pdf_style {text-align: right !important;}
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
        <div class="title_style">
          <h3 style="color: white !important;font-size: 16px;font-weight: bold;">TCCC FORMS</h3>
        </div>
        <div style="margin-top: 10px">
          <p style="text-align: justify;">
            TCCC provides participants with different forms to download. These forms include TCCC Rules, Schedules, Team Membership Form and other infromative forms to download.
          </p>
        </div>
        <div style="margin-top: 10px;">
          <div style="overflow-x:auto;">
            <table>
              <tr>
                <td style="font-size: 14px; font-weight: bold;">Match Sheet Form</td>
                <td class="pdf_style">
                <a href="pdf/2016 Match Sheet.pdf" target="_blank"><img src="pdf/View-PDF.png" alt="View PDF" width="80px"></a>
                <a href="pdf/Match Sheet.docx"><img src="pdf/PDF_button.png" alt="Download" width="80px"></a></td>
              </tr>
              <tr>
                <td style="font-size: 14px; font-weight: bold;">Waiver Form</td>
                <td class="pdf_style">
                 <a href="pdf/2019 Waiver Form.pdf" target="_blank">
                <img src="pdf/View-PDF.png" alt="View PDF" width="80px"></a>
                <a href="pdf/2019 Waiver Form.pdf" download="2019 Waiver Form.pdf">
                <img src="pdf/PDF_button.png" alt="Download" width="80px"></td></a>
              </tr>
              <tr>
                <td style="font-size: 14px; font-weight: bold;">Team Membership Form</td>
                <td class="pdf_style">
                <a href="pdf/2019 TCCC Membership Form.pdf" target="_blank">
                <img src="pdf/View-PDF.png" alt="View PDF" width="80px"></a>
                <a href="pdf/2019 TCCC Membership Form.pdf" download="2019 TCCC Membership Form.pdf">
                <img src="pdf/PDF_button.png" alt="Download" width="80px"></td></a>
              </tr>
              <tr>
                <td style="font-size: 14px; font-weight: bold;">Schedule for 2017</td>
                <td class="pdf_style">
                <a href="pdf/TCCC 2017 Final Schedule.pdf" target="_blank"><img src="pdf/View-PDF.png" alt="View PDF" width="80px"></a>
                <a href="pdf/TCCC 2017 Final Schedule.pdf" download="TCCC 2017 Final Schedule.pdf"><img src="pdf/PDF_button.png" alt="Download" width="80px"></a></td>
              </tr>
              <tr>
                <td style="font-size: 14px; font-weight: bold;">Schedule for 2016</td>
                <td class="pdf_style">
                <a href="pdf/TCCC Master Schedule 2016.pdf" target="_blank"><img src="pdf/View-PDF.png" alt="View PDF" width="80px"></a>
                <a href="pdf/TCCC Master Schedule 2016.pdf" download="TCCC Master Schedule 2016.pdf"><img src="pdf/PDF_button.png" alt="Download" width="80px"></a></td>
              </tr>
              <tr>
                <td style="font-size: 14px; font-weight: bold;">Rules of Engagement Document</td>
                <td class="pdf_style">
                <a href="pdf/rules.pdf" target="_blank"><img src="pdf/View-PDF.png" alt="View PDF" width="80px"></a>
                <a href="pdf/rules.pdf" download="TCCC Rules of Engagement.pdf"><img src="pdf/PDF_button.png" alt="Download" width="80px"></a>
                </td>
              </tr>
              <tr>
                <td style="font-size: 14px; font-weight: bold;">Team Meeting Presentation</td>
                <td class="pdf_style">
                <img src="pdf/View-PDF.png" alt="View PDF" width="80px">
                <img src="pdf/PDF_button.png" alt="Download" width="80px"></td>
              </tr>
            </table>
          </div>
        </div>
        
      </div>
    </div>
    <br/>
  </div>
  <div class="clear-both"> </div>
</div>

<?php include_once('footer.php');?>