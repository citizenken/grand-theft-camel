function randomBetween(low, high) {
	return Math.floor(Crafty.math.randomNumber(low, high));
}

function convertMap(map) {
	var mapArray = [];
	for (var x = 0; x < map.length; x++) {
		mapArray[x] = map[x].split('');
	}
	var seams = findSeams();
	parsemap(mapArray, seams);

}

function findSeams () {
	var divisions = 2;
	var xSeamCount = Game.map_grid.width/(Game.map_grid.width/divisions);
	var ySeamCount = Game.map_grid.height/(Game.map_grid.height/divisions);
	var xSeams = [];
	var ySeams = [];
	var zones = {x:[], y:[]};
	for (var x = 0; x <= xSeamCount; x++) {
		if (x === 0) {
			xSeams.push(x);
		} else {
			xSeams.push((Game.map_grid.width/divisions) * x);
		}
		if (x === xSeamCount) {
			for (var i = 0; i < xSeams.length - 1; i++) {
				zones.x.push({xzone: i, xmin: xSeams[i], xmax: xSeams[i + 1]});
			}
		}
	}

	for (var y = 0; y <= ySeamCount; y++) {
		if (y === 0) {
			ySeams.push(y);
		} else {
			ySeams.push((Game.map_grid.height/divisions) * y);
		}
		if (y === ySeamCount) {
			for (var z = 0; z < ySeams.length - 1; z++) {
				zones.y.push({yzone: z, ymin: ySeams[z], ymax: ySeams[z + 1]});
			}
		}
	}
	Game.currentMap.zones = zones;
	Game.currentMap.seams = {x: xSeams, y: ySeams};
	return {xSeams: xSeams, ySeams: ySeams};
}

function parsemap (mapArray, seams) {
	var occupiedSquares = [];
	for (var y = 0; y < mapArray.length; y++) {
		occupiedSquares[y] = [];
		for(var x = 0; x < mapArray[y].length; x++) {
			var newEntity;
			switch (mapArray[y][x]) {
				case 'b':
					newEntity = Crafty.e('Bush').at(x,y);
					occupiedSquares[y][x] = true;
					addVoid(newEntity, x, y);
				break;
				case 'm':
					newEntity = Crafty.e('Mountain').at(x,y);
					occupiedSquares[y][x] = true;
					addVoid(newEntity, x, y);
				break;
				case 'o':
					newEntity = Crafty.e('Oasis').at(x,y);
					occupiedSquares[y][x] = true;
					addVoid(newEntity, x, y);
				break;
				case 't':
					newEntity = Crafty.e('Tent').at(x,y);
					occupiedSquares[y][x] = true;
					addVoid(newEntity, x, y);
				break;
				case 'w':
					newEntity = Crafty.e('Well').at(x,y);
					occupiedSquares[y][x] = true;
					addVoid(newEntity, x, y);
				break;
				case '@':
					Game.player = Crafty.e('WhiteCharacter, Player').at(x,y);
				break;
				default:
					if (seams.xSeams.indexOf(x) > -1 || seams.ySeams.indexOf(y) > -1) {
						Crafty.e('Void').at(x,y);
						occupiedSquares[y][x] = 'void';
					}
				break;
			}
		}
	}
	Game.currentMap.map = mapArray;
	Game.currentMap.occupiedSquares = occupiedSquares;
}

function addVoid (newEntity, x, y) {
	if ((y % (Game.map_grid.height/2) === 0) || (x % (Game.map_grid.width/2) === 0) || x === (Game.map_grid.width - 1) || y === (Game.map_grid.height - 1)) {
		newEntity.addComponent('Void');
	}
}

function createZone(selfSceneString, topScene, botScene, leftScene, rightScene, portals) {
	return {
		selfSceneString: selfSceneString,
		topScene: topScene,
		botScene: botScene,
		leftScene: leftScene,
		rightScene: rightScene,
		portals: portals
	};
}

function createWorldMap() {
	return [
	['openDesertSection00', 'openDesertSection01', 'openDesertSection02', 'openDesertSection03'],
	['openDesertSection10', 'openDesertSection11', 'openDesertSection12', 'openDesertSection13']
	];
}

function changeMap (direction) {
	var currentMap = Game.currentMap;
	switch (direction) {
		case 'UP':
			break;
		case 'DOWN':
			break;
		case 'RIGHT':
			currentMap.y += 1;
			Crafty.scene('DesertZone');
			this.x = 0;
			break;
		case 'LEFT':
			break;

	}
	return;
}

function randomlyPopulateNextSection(direction, currentZoneX, currentZoneY) {
	var nextZoneX = null;
	var nextZoneY = null;
	console.log(direction);
	console.log(currentZoneY);
	switch (direction)
	{
	case 'UP':
		break;
	case 'DOWN':
		break;
	case 'LEFT':
			// this.animate('PlayerLeft', -1)
		break;
	case 'RIGHT':
			nextZoneX = currentZoneX + 1;
			nextZoneY = currentZoneY;
		break;
	}
	var mapArray = Game.currentMap;
	var occupied = Game.currentMap.occupiedSquares;
	var i;
	if (y) {
		for (y = y; y < Game.currentMap.zones.y[nextZoneY].ymax; y++) {
			for (x = 0; x < mapArray[y].length; x++) {
				if (!occupied[y][x] && Math.random() < 0.01 && x !== playerx && y !== playery) {
				// Place a bush entity at the current tile
					i++;
					Crafty.e('SandDune').at(x,y);
					occupied[y][x] = true;
				}
			}
		}
	} else if (x) {
		for (y = 0; y < mapArray.length; y++) {
			for (x = start; x < end; x++) {
				if (!occupied[y][x] && Math.random() < 0.01 && x !== playerx && y !== playery) {
				// Place a bush entity at the current tile
					i++;
					Crafty.e('SandDune').at(x,y);
					occupied[y][x] = true;
				}
			}
		}
	}
}