<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Untitled Document</title>
</head>

<body>
<script src="//code.jquery.com/jquery-1.12.0.min.js"></script>
<script type="text/javascript">
alert("yes");
var request =$.ajax({
  url: "http://api.axonme.com/rest/smsapi/GetBalanceCredits",
  method: "GET",
   headers: {
        'apikey':'zdfd813b2-0ef9-437c-azad-aed2cc942bd7',
    },
  data: { Msg:"Rest With header send text sms",MsgType:0,Sid:"VJA-01",Mobiles:"971528996429",Dlr:1},
  dataType: "json",
  crossDomain:true
});

request.done(function( msg ) {
	alert(msg.Value);
	alert(msg.Key);
	alert(msg.Desc);
 /* $( "body" ).html("value-" +msg.Value);
    $( "body" ).append("<br/> user-" +msg.Key);
	
    $( "body" ).append("<br/> DESC-" +msg.Desc);*/
});
</script>


</body>
</html>
