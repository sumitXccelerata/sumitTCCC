// JavaScript Document

$( document ).ready(function() {
	
	/* home page showing hideing ended */
	
	$(".main-icons").click(function(){
	
		var icon_id= $(this).attr("id");
		var id_one=String("one");
		var id_two=String("two");
		var id_three=String("three");
		var id_four=String("four");
		var id_five=String("five");
		
		var id_one_sub=String("one-sub");
		var id_two_sub=String("two-sub");
		var id_three_sub=String("three-sub");
		var id_four_sub=String("four-sub");
		var id_five_sub=String("five-sub");
		
			if (icon_id==id_one){
				$(".right-close").addClass("visibility-visible");
				$(".right-content").addClass("platform-right-content");
				$(".right-content").removeClass("industries-right-content");
				$(".right-content").removeClass("communication-center-right-content");	
				$(".right-content").removeClass("blog-right-content"); 
				$(".right-content").removeClass("contact-us-right-content");
				$(".click-bg").css("background","transparent");
				$(this).parent().next(".click-bg").css("background","#f36b22");
				$("div").removeClass("bg-click");
				$(this).parent().next().addClass("bg-click");
				$(".main-icon-div").hide();
				$(".platforms").show();
				$(".black-logo").hide();
				$(".white-logo").show();
			}
			
			if (icon_id==id_one_sub){
				$(".right-close").addClass("visibility-visible");
				$(".right-content").addClass("platform-right-content");
				$(".right-content").removeClass("industries-right-content");
				$(".right-content").removeClass("communication-center-right-content");	
				$(".right-content").removeClass("blog-right-content"); 
				$(".right-content").removeClass("contact-us-right-content");
				$(".click-bg").css("background","transparent");
				$(this).css("background","#f36b22");
				$("div").removeClass("bg-click");
				$(this).addClass("bg-click");
				$(".main-icon-div").hide();
				$(".platforms").show();
				$(".black-logo").hide();
				$(".white-logo").show();
			}
			
			else if(icon_id==id_two){
				$(".right-close").addClass("visibility-visible");
				$(".right-content").removeClass("platform-right-content");
				$(".right-content").addClass("industries-right-content");
				$(".right-content").removeClass("communication-center-right-content");
				$(".right-content").removeClass("blog-right-content");
				$(".right-content").removeClass("contact-us-right-content");
				$(".click-bg").css("background","transparent");
				$(this).parent().next(".click-bg").css("background","#a5208c");
				$("div").removeClass("bg-click");
				$(this).parent().next().addClass("bg-click");
				$(".main-icon-div").hide();
				$(".industries").show();
				$(".black-logo").hide();
				$(".white-logo").show();
			}
			
				else if(icon_id==id_two_sub){
				$(".right-close").addClass("visibility-visible");
				$(".right-content").removeClass("platform-right-content");
				$(".right-content").addClass("industries-right-content");
				$(".right-content").removeClass("communication-center-right-content");
				$(".right-content").removeClass("blog-right-content");
				$(".right-content").removeClass("contact-us-right-content");
				$(".click-bg").css("background","transparent");
				$(this).css("background","#a5208c");
				$("div").removeClass("bg-click");
				$(this).addClass("bg-click");
				$(".main-icon-div").hide();
				$(".industries").show();
				$(".black-logo").hide();
				$(".white-logo").show();
			}
			
			else if(icon_id==id_three){
				$(".right-close").addClass("visibility-visible");
				$(".right-content").removeClass("platform-right-content");
				$(".right-content").removeClass("industries-right-content");
				$(".right-content").removeClass("blog-right-content");
				$(".right-content").removeClass("contact-us-right-content");
				$(".right-content").addClass("communication-center-right-content");
				$(".click-bg").css("background","transparent");
				$(this).parent().next(".click-bg").css("background","#0064b0");
				$("div").removeClass("bg-click");
				$(this).parent().next().addClass("bg-click");
				$(".main-icon-div").hide();
				$(".communication-center").show();
				$(".black-logo").hide();
				$(".white-logo").show();
			}
			else if(icon_id==id_three_sub){
				$(".right-close").addClass("visibility-visible");
				$(".right-content").removeClass("platform-right-content");
				$(".right-content").removeClass("industries-right-content");
				$(".right-content").removeClass("blog-right-content");
				$(".right-content").removeClass("contact-us-right-content");
				$(".right-content").addClass("communication-center-right-content");
				$(".click-bg").css("background","transparent");
				$(this).css("background","#0064b0");
				$("div").removeClass("bg-click");
				$(this).addClass("bg-click");
				$(".main-icon-div").hide();
				$(".communication-center").show();
				$(".black-logo").hide();
				$(".white-logo").show();
			}

			else if(icon_id==id_four){
				$(".right-close").addClass("visibility-visible");
				$(".right-content").removeClass("platform-right-content");
				$(".right-content").removeClass("industries-right-content");
				$(".right-content").removeClass("communication-center-right-content");
				$(".right-content").removeClass("contact-us-right-content");
				$(".right-content").addClass("blog-right-content");
				$(".click-bg").css("background","transparent");
				$(this).parent().next(".click-bg").css("background","#1fbac0");
				$("div").removeClass("bg-click");
				$(this).parent().next().addClass("bg-click");
				$(".main-icon-div").hide();
				$(".blog").show();
				$(".black-logo").hide();
				$(".white-logo").show();
				
			}
			
			else if(icon_id==id_four_sub){
				$(".right-close").addClass("visibility-visible");
				$(".right-content").removeClass("platform-right-content");
				$(".right-content").removeClass("industries-right-content");
				$(".right-content").removeClass("communication-center-right-content");
				$(".right-content").removeClass("contact-us-right-content");
				$(".right-content").addClass("blog-right-content");
				$(".click-bg").css("background","transparent");
				$(this).css("background","#1fbac0");
				$("div").removeClass("bg-click");
				$(this).addClass("bg-click");
				$(".main-icon-div").hide();
				$(".blog").show();
				$(".black-logo").hide();
				$(".white-logo").show();
				
			}
			else if(icon_id==id_five){
				$(".right-close").addClass("visibility-visible");
				$(".right-content").removeClass("platform-right-content");
				$(".right-content").removeClass("industries-right-content");
				$(".right-content").removeClass("communication-center-right-content");
				$(".right-content").removeClass("blog-right-content");
				$(".right-content").addClass("contact-us-right-content");
				$(".click-bg").css("background","transparent");
				$(this).parent().next().css("background","#85c440");
				$("div").removeClass("bg-click");
				$(this).parent().next().addClass("bg-click");
				$(".main-icon-div").hide();
				$(".contact-us").show();
				$(".black-logo").hide();
				$(".white-logo").show();
				
				

				
			}
			
			else if(icon_id==id_five_sub){
				$(".right-close").addClass("visibility-visible");
				$(".right-content").removeClass("platform-right-content");
				$(".right-content").removeClass("industries-right-content");
				$(".right-content").removeClass("communication-center-right-content");
				$(".right-content").removeClass("blog-right-content");
				$(".right-content").addClass("contact-us-right-content");
				$(".click-bg").css("background","transparent");
				$(this).css("background","#85c440");
				$("div").removeClass("bg-click");
				$(this).addClass("bg-click");
				$(".main-icon-div").hide();
				$(".contact-us").show();
				$(".black-logo").hide();
				$(".white-logo").show();
				
				

				
			}
			
			
		
	});
	
	$(".right-close").click(function(){
		$(".right-close").removeClass("visibility-visible");
		$(".right-content").removeClass("platform-right-content");
		$(".right-content").removeClass("industries-right-content");
		$(".right-content").removeClass("communication-center-right-content");
		$(".right-content").removeClass("communication-center-right-content");
		$(".right-content").removeClass("blog-right-content");
		$(".right-content").removeClass("contact-us-right-content");
		$("div").removeClass("bg-click");
		$(".click-bg").css("background","transparent");
		$(".right-close").addClass("visibility-hidden");
			$(".black-logo").show();
			$(".white-logo").hide();
			$(".login").show();
			$(".platforms").hide();
			$(".industries").hide();
			$(".communication-center").hide();
			$(".blog").hide();
			$(".contact-us").hide();
			
	});
	
	/* homepage showing hideing ended */
	
	
	/* inner pages showing hideing started */
	
	
		$(".iton-platforms").click(function(){
			
			var plotform_id= $(this).attr("id");
			var plotform_one=String("mobile-payment");
			var plotform_two=String("a-to-p");
			var plotform_three=String("interactive-messaging");
			var plotform_four=String("ussd");
			var plotform_five=String("nfs");
			var plotform_six=String("mobile-innovation");
			var plotform_seven=String("push-messaging");
			var plotform_eight=String("sms-messaging");
			var plotform_nine=String("mobile-strategy");
			var plotform_ten=String("mobile-marketing");
			
			
			if (plotform_id==plotform_one){
				
				$(".main-sec").hide();
				$(".inner-page").show();
				$(".mobile-payments-inner").show();
				$(".atop-inner").hide();
				$(".interactive-inner").hide();
				$(".ussd-inner").hide();
				$(".nfc-inner").hide();
				$(".mobile-innovation-inner").hide();
			}
			
			if (plotform_id==plotform_two){
				
				$(".main-sec").hide();
				$(".inner-page").show();
				$(".mobile-payments-inner").hide();
				$(".atop-inner").show();
				$(".interactive-inner").hide();
				$(".ussd-inner").hide();
				$(".nfc-inner").hide();
				$(".mobile-innovation-inner").hide();
				
			}
			
			if (plotform_id==plotform_three){
				
				$(".main-sec").hide();
				$(".inner-page").show();
				$(".mobile-payments-inner").hide();
				$(".atop-inner").hide();
				$(".interactive-inner").show();
				$(".ussd-inner").hide();
				$(".nfc-inner").hide();
				$(".mobile-innovation-inner").hide();
				
			}
			
			if (plotform_id==plotform_four){
				
				$(".main-sec").hide();
				$(".inner-page").show();
				$(".mobile-payments-inner").hide();
				$(".atop-inner").hide();
				$(".interactive-inner").hide();
				$(".ussd-inner").show();
				$(".nfc-inner").hide();
				$(".mobile-innovation-inner").hide();
				
			}
			
			if (plotform_id==plotform_five){
				
				$(".main-sec").hide();
				$(".inner-page").show();
				$(".mobile-payments-inner").hide();
				$(".atop-inner").hide();
				$(".interactive-inner").hide();
				$(".ussd-inner").hide();
				$(".nfc-inner").show();
				$(".mobile-innovation-inner").hide();
				
			}
			
			if (plotform_id==plotform_six){
				
				$(".main-sec").hide();
				$(".inner-page").show();
				$(".mobile-payments-inner").hide();
				$(".atop-inner").hide();
				$(".interactive-inner").hide();
				$(".ussd-inner").hide();
				$(".nfc-inner").hide();
				$(".mobile-innovation-inner").show();
			}
			
			
			
			
	});
	
	
				
		$(".inner-close").click(function(){
			$(".main-sec").show();
				$(".inner-page").hide();
				$(".mobile-payments-inner").hide();
				$(".atop-inner").hide();
				$(".interactive-inner").hide();
				$(".ussd-inner").hide();
				$(".nfc-inner").hide();
				$(".mobile-innovation-inner").hide();
				
				
		});
		
		
		/* inner pages showing hideing ended */
		
		
		/* scrolling showing hideing ended */
		
		$(window).scroll(function () {
		
			if ($(window).scrollTop() + $(window).height() > $('.mplot-two').offset().top + 50) {
			
				$( ".mobile-payment-nav" ).addClass( "mplot-one-nav" );
			}
			 else {
			
			$( ".mobile-payment-nav" ).removeClass( "mplot-one-nav" );  
			}
			
			
			if ($(window).scrollTop() + $(window).height() > $('.mplot-two').offset().top + 950) {
			
				$( ".mobile-payment-nav" ).addClass( "mplot-nav" );
				$( ".black-logo" ).addClass( "display-block" );
				$( ".white-logo" ).addClass( "display-none" );
				$( ".plot-white-icons" ).addClass( "display-none" );
				$( ".plot-black-icons" ).removeClass( "display-none" );
				
			} 
			
			else {
			
				$( ".mobile-payment-nav" ).removeClass( "mplot-nav" );
				$( ".black-logo" ).removeClass( "display-block" );
				$( ".white-logo" ).removeClass( "display-none" );
				$( ".plot-white-icons" ).removeClass( "display-none" );
				$( ".plot-black-icons" ).addClass( "display-none" );
			
			}
		
		
		});
		
		
		
		
		
		/* scrolling showing hideing ended */



		
		
		
				
   

	
	
});
