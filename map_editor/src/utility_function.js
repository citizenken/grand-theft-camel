function initiateMap(map) {
	if (map) {
		map = map.replace(/^[\n]+|\.|[\n]+$/g, "");
		console.log(map)
		mapArray = map.split(',');
		convertMap(mapArray);
		MapEditor.mapToLoad = null;
	} else {
		var width = MapEditor.map_grid.width;
		var height = MapEditor.map_grid.height;
		var entityNumber = 0;
		var map = [];
		for (var y = 0; y < height ; y++) {
			map[y] = [];
			for (var x = 0; x < width; x++) {
				map[y][x] = Crafty.e('EmptySpace').at(x,y);
				// emptySpace._entityName = 'EmptySpace_' + entityNumber;
			}
		}
	}
}

function printMap(){
	console.log('blah')
	var width = MapEditor.map_grid.width;
	var height = MapEditor.map_grid.height;
	var entityNumber = 0;
	var map = [];
	var entities = Crafty('Actor');
	// console.log(entities);
	var i = 2;
	for (var y = 0; y < height ; y++) {
		map[y] = [];
		var rowString = '\r\n';
		for (var x = 0; x < width; x++) {
			var currentEntity = Crafty(i);
			if (currentEntity.at().x == x) {
				rowString += currentEntity._mapChar;
			}
			i++;
		}
		map[y] = rowString;
	}
	map = 'var newMap = [' + map + ']';
	$('#saveBox').text(map);
	showMapModel();
}

function showMapModel() {
	//Get the A tag
	var saveBox = $('#saveBox');
	var winH = $(window).height();
	var winW = $(window).width();

	saveBox.css('top',  winH/2-saveBox.height()/2);
	saveBox.css('left', winW/2-saveBox.width()/2);

	$('#cr-stage').toggle();
	saveBox.toggle();
}

function loadMap() {
	//Get the A tag
	var loadBox = $('#loadBox');
	var winH = $(window).height();
	var winW = $(window).width();

	loadBox.css('top',  winH/2-loadBox.height()/2);
	loadBox.css('left', winW/2-loadBox.width()/2);

	$('#cr-stage').toggle();
	$('#mapToLoad').toggle();
	loadBox.toggle();
}

function buildMap() {
	var map = $('#mapToLoad').val();
	$('#cr-stage').toggle();
	$('#loadBox').toggle();
	MapEditor.mapToLoad = map;
	Crafty.scene('EditMap');

}

function convertMap(map) {
	console.log(map)
	var mapArray = [];
	for (var x = 0; x < map.length; x++) {
		mapArray[x] = map[x].split("");
	}
	parsemap(mapArray)
}

function parsemap (mapArray) {
	console.log(mapArray);
	var width = MapEditor.map_grid.width;
	var height = MapEditor.map_grid.height;
	var map = [];
	for (var y = 0; y < height; y++) {
		map[y] = [];
		for(var x = 0; x < width; x++) {
			switch (mapArray[y][x]) {
				case 'b':
					map[y][x] = Crafty.e('Bush').at(x,y);
				break;
				case 'o':
					map[y][x] = Crafty.e('EmptySpace, Oasis').at(x,y);
					map[y][x].removeComponent('EmptySpace');
				break;
				case '@':
					map[y][x] = Game.player = Crafty.e('WhiteCharacter, Player').at(x,y);
				break;				
				case '#':
					map[y][x] = Crafty.e('EmptySpace').at(x,y);
				break;
			}
		}
	};
}