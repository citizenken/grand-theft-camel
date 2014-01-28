function printMap(){
	console.log('blah')
	var width = MapEditor.map_grid.width;
	var height = MapEditor.map_grid.height;
	var entityNumber = 0;
	var map = [];
	var entities = Crafty('Actor');
	// console.log(entities);
	var i = 2;
	for (var y = 0; y <= height ; y++) {
		map[y] = [];
		var rowString = '\n';
		for (var x = 0; x <= width; x++) {
			var currentEntity = Crafty(i);
			if (currentEntity.at().x == x) {
				rowString += currentEntity._mapChar;
			}
			i++;
		}
		map[y] = rowString;
	}
	map = 'var newMap = [\n' + map + ']';
	$('#dialog').text(map);
	showMapModel();
}

function showMapModel() {
		//Get the A tag
		var dialogBox = $('#dialog');

		//Get the screen height and width
		var maskHeight = $(document).height();
		var maskWidth = $(document).width();

		console.log(maskHeight, maskWidth);

		//Set height and width to mask to fill up the whole screen
		$('#mask').css({'width':maskWidth,'height':maskHeight});

		//transition effect
		$('#mask').toggle();
		$('#mask').toggle();

		//Get the window height and width
		var winH = $(window).height();
		var winW = $(window).width();

		//Set the popup window to center
		dialogBox.css('top',  winH/2-dialogBox.height()/2);
		dialogBox.css('left', winW/2-dialogBox.width()/2);

		//transition effect
		$('#cr-stage').toggle();
		dialogBox.toggle();
}

//if close button is clicked
$('.window .close').click(function (e) {
	//Cancel the link behavior
	e.preventDefault();
	$('#mask, .window').hide();
	$('#cr-stage').show();
});

//if mask is clicked
$('*:not(#dialog').click(function () {
	$('.window').hide();
	$('#cr-stage').show();
});
