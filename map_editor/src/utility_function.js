var width = MapEditor.map_grid.width;
var height = MapEditor.map_grid.height;

$(document).ready(function() {

	$('#loadmap').on('click', loadMap);
	$('#savemap').on('click', saveMap);
	$('#buildmap').on('click', buildMap);
	$('#clearmap').on('click', clearMap);
	$('.palette-entity').on('click', setSelectedTile);

	function setSelectedTile () {
		$('div').removeClass('selected');
		$(this).addClass('selected');
		var component = $(this).attr('id');
		MapEditor.selectedEntity = component;
	}

	function loadMap() {
		//Get the A tag
		var loadBox = $('#loadBox');
		var winH = $(window).height();
		var winW = $(window).width();

		loadBox.css('top',  winH/2-loadBox.height()/2);
		loadBox.css('left', winW/2-loadBox.width()/2);

		if (!$('#savemap').prop('disabled')) {
			$('#loadmap').val('Hide Load Window');
			$('#savemap').prop('disabled', true);
		} else {
			$('#loadmap').val('Load Map');
			$('#savemap').prop('disabled', false);
		}

		$('#cr-stage').toggle();
		$('#palette').toggle();
		$('#mapToLoad').toggle();
		loadBox.toggle();
	}
});

function initiateMap(map) {
	if (map) {
		map = map.replace(/[\s+\']/g, '');
		var mapArray = map.split(',');
		convertMap(mapArray);
		MapEditor.mapToLoad = null;
	} else {
		map = [];
		for (var y = 0; y < height ; y++) {
			map[y] = [];
			for (var x = 0; x < width; x++) {
				map[y][x] = Crafty.e('EmptySpace').at(x,y);
			}
		}
	}
	// initiatePalette();
}

function clearMap() {
	Crafty('*').destroy();
	var map = [];
	for (var y = 0; y < height ; y++) {
		map[y] = [];
		for (var x = 0; x < width; x++) {
			map[y][x] = Crafty.e('EmptySpace').at(x,y);
		}
	}
	MapEditor.playerPlaced = false;
}

function showMapModel() {
	//Get the A tag
	var saveBox = $('#saveBox');
	var winH = $(window).height();
	var winW = $(window).width();

	saveBox.css('top',  winH/2-saveBox.height()/2);
	saveBox.css('left', winW/2-saveBox.width()/2);

	if (!$('#loadmap').prop('disabled')) {
		$('#savemap').val('Hide Save Window');
		$('#loadmap').prop('disabled', true);
	} else {
		$('#savemap').val('Save Map');
		$('#loadmap').prop('disabled', false);
	}

	$('#cr-stage').toggle();
	$('#palette').toggle();
	saveBox.toggle();
}

function saveMap(){
	// var width = MapEditor.map_grid.width;
	// var height = MapEditor.map_grid.height;
	var entityNumber = 0;
	var map = [];
	var first = Crafty('Actor');
	var i = first[0];
	for (var y = 0; y < height ; y++) {
		map[y] = [];
		var rowString = '<br>\'';
		for (var x = 0; x < width; x++) {
			var currentEntity = Crafty(i);
			if (currentEntity.at().x === x) {
				rowString += currentEntity._mapChar;
			}
			i++;
		}
		map[y] = rowString + '\'';
	}
	map = 'var newMap = [' + map + ']';
	$('#saveBox').html('Copy this into src/scenes/maps/ for inclusion in the game.</br></br>' + map);
	showMapModel();
}


function buildMap() {
	var map = $('#mapToLoad').val();
	$('#cr-stage').toggle();
	$('#loadBox').toggle();
	$('#mapToLoad').toggle();
	$('#savemap').prop('disabled', false);
	MapEditor.mapToLoad = map;
	Crafty.scene('EditMap');

}

function convertMap(map) {
	var mapArray = [];

	for (var x = 0; x < map.length; x++) {
		mapArray[x] = map[x].split('');
	}
	parsemap(mapArray)
}

function parsemap (mapArray) {
	var map = [];
	var i = 2;
	for (var y = 0; y < height; y++) {
		map[y] = [];
		for(var x = 0; x < width; x++) {
			switch (mapArray[y][x]) {
				case 'b':
					map[y][x] = Crafty.e('Bush').at(x,y);
				break;
				case 'm':
					map[y][x] = Crafty.e('Mountain').at(x,y);
				break;
				case 'o':
					map[y][x] = Crafty.e('Oasis').at(x,y);
				break;
				case 't':
					map[y][x] = Crafty.e('Tent').at(x,y);
				break;
				case 'w':
					map[y][x] = Crafty.e('Well').at(x,y);
				break;
				case '@':
					map[y][x] = Crafty.e('Player').at(x,y);
				break;
				case '#':
					map[y][x] = Crafty.e('EmptySpace').at(x,y);
				break;
			}
			i++;
		}
	}
}

function initiatePalette () {
	$('td').each(function() {
		var component = $(this).children().attr('id');
		Crafty.e(component);
	});
}