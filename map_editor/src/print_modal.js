$(document).ready(function() {

	//select all the a tag with name equal to modal
	$('a[name=modal]').click(function(e) {
		//Cancel the link behavior
		e.preventDefault();
		//Get the A tag
		var dialogBox = $('#dialog');

		//Get the screen height and width
		var maskHeight = $(document).height();
		var maskWidth = $(document).width();

		console.log(maskHeight, maskWidth);

		//Set height and width to mask to fill up the whole screen
		$('#mask').css({'width':maskWidth,'height':maskHeight});

		//transition effect
		$('#mask').fadeIn(1000);
		$('#mask').fadeTo("slow",0.8);

		//Get the window height and width
		var winH = $(window).height();
		var winW = $(window).width();

		//Set the popup window to center
		dialogBox.css('top',  winH/2-$(id).height()/2);
		dialogBox.css('left', winW/2-$(id).width()/2);

		//transition effect
		$('#cr-stage').toggle();
		dialogBox.toggle();

	});

	//if close button is clicked
	$('.window .close').click(function (e) {
		//Cancel the link behavior
		e.preventDefault();
		$('#mask, .window').hide();
		$('#cr-stage').show();
	});

	//if mask is clicked
	$('#mask').click(function () {
		$(this).hide();
		$('.window').hide();
		$('#cr-stage').show();
	});

});
