function randomBetween(low, high) {
	return Math.floor(Crafty.math.randomNumber(low, high));
}

function createMap(map) {
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
	var zones = Game.currentMap.zones;
	var occupiedSquares = [];
	var allObjects = [];
	for (var y = 0; y < mapArray.length; y++) {
		occupiedSquares[y] = [];
		for(var x = 0; x < mapArray[y].length; x++) {
			var newEntity;
			switch (mapArray[y][x]) {
				case 'b':
					newEntity = Crafty.e('Bush').at(x,y);
					occupiedSquares[y][x] = {type: 'Bush', id: newEntity[0]};
					allObjects.push(occupiedSquares[y][x]);
					addVoid(newEntity, x, y);
				break;
				case 'm':
					newEntity = Crafty.e('Mountain').at(x,y);
					occupiedSquares[y][x] = {type: 'Mountain', id: newEntity[0]};
					allObjects.push(occupiedSquares[y][x]);
					addVoid(newEntity, x, y);
				break;
				case 'o':
					newEntity = Crafty.e('Oasis').at(x,y);
					occupiedSquares[y][x] = {type: 'Oasis', id: newEntity[0]};
					allObjects.push(occupiedSquares[y][x]);
					addVoid(newEntity, x, y);
				break;
				case 't':
					newEntity = Crafty.e('Tent').at(x,y);
					occupiedSquares[y][x] = {type: 'Tent', id: newEntity[0]};
					allObjects.push(occupiedSquares[y][x]);
					addVoid(newEntity, x, y);
				break;
				case 'w':
					newEntity = Crafty.e('Well').at(x,y);
					occupiedSquares[y][x] = {type: 'Well', id: newEntity[0]};
					allObjects.push(occupiedSquares[y][x]);
					addVoid(newEntity, x, y);
				break;
				case '@':
					Game.player = Crafty.e('WhiteCharacter, Player').at(x,y);
				break;
				default:
					if (seams.xSeams.indexOf(x) > -1 || seams.ySeams.indexOf(y) > -1 || x === (seams.xSeams[seams.xSeams.length -1] - 1) || y === (seams.ySeams[seams.ySeams.length -1] - 1)) {
						Crafty.e('Void').at(x,y);
						occupiedSquares[y][x] = 'void';
					} else if (!occupiedSquares[y][x] && randomBetween(0,100) === 1) {
						var newEntity = Crafty.e('SandDune').at(x,y);
						occupiedSquares[y][x] = {type: 'SandDune', id: newEntity[0]};
						allObjects.push(occupiedSquares[y][x]);
					}
				break;
			}
		}
	}
	Game.currentMap.map = mapArray;
	Game.currentMap.occupiedSquares = occupiedSquares;
	Game.allObjects = allObjects;
}

function addVoid (newEntity, x, y) {
	if ((y % (Game.map_grid.height/2) === 0) || (x % (Game.map_grid.width/2) === 0) || x === (Game.map_grid.width - 1) || y === (Game.map_grid.height - 1)) {
		newEntity.addComponent('Void');
	}
}

/*function createZone(selfSceneString, topScene, botScene, leftScene, rightScene, portals) {
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
}*/

function randomlyPopulateNextSection(direction, currentZone, playerx, playery) {
	clearLastZone(currentZone);
	var nextZoneX = null;
	var nextZoneY = null;
	var zone = Game.currentMap.zones;
	switch (direction)
	{
	case 'UP':
			nextZoneX = currentZone.x;
			nextZoneY = currentZone.y - 1;
		break;
	case 'DOWN':
			nextZoneX = currentZone.x ;
			nextZoneY = currentZone.y + 1;
		break;
	case 'LEFT':
			nextZoneX = currentZone.x - 1;
			nextZoneY = currentZone.y;
		break;
	case 'RIGHT':
			nextZoneX = currentZone.x + 1;
			nextZoneY = currentZone.y;
		break;
	}
	var mapArray = Game.currentMap;
	var occupied = Game.currentMap.occupiedSquares;
	var i;
		console.log(nextZoneX, nextZoneY)
	for (y = zone.y[nextZoneY].ymin; y < zone.y[nextZoneY].ymax; y++) {
		for (x = zone.x[nextZoneX].xmin; x < zone.x[nextZoneX].xmax; x++) {
			if (!occupied[y][x] && randomBetween(0,100) === 1 && x !== playerx && y !== playery) {
				i++;
				var newEntity = Crafty.e('SandDune').at(x,y);
				occupied[y][x] = {type: 'SandDune', id: newEntity[0]};
				Game.allObjects.push(occupied[y][x]);
			}
		}
	}
}

function clearLastZone (currentZone) {
	// console.log(Game.allObjects)
	Crafty('SandDune').each(function() {this.destroy()});
/*	for (var x = 0; x < Game.allObjects.length; X++) {
		var targetEntity;
		if (Game.allObjects[x].type === 'SandDune').
	}*/
}