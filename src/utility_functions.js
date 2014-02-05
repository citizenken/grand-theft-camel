function randomBetween(low, high) {
	return Math.floor(Crafty.math.randomNumber(low, high));
}

function convertMap(map, width, height) {
	var mapArray = [];
	for (var x = 0; x < map.length; x++) {
		mapArray[x] = map[x].split("");
	}
	parsemap(mapArray)
}

function parsemap (mapArray) {
	var occupiedSquares = [];
	var xLinesAt = [];
	var yLinesAt = [0];
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
					if ((y % (Game.map_grid.height/2) === 0) || (x % (Game.map_grid.width/2) === 0) || x === (Game.map_grid.width - 1) || y === (Game.map_grid.height - 1)) {
						var newVoid = Crafty.e('Void').at(x,y);
						occupiedSquares[y][x] = 'void';
						if (((x % (Game.map_grid.width/2) === 0) || x === (Game.map_grid.width - 1))) {
							if (xLinesAt.indexOf(x) === -1) {
								xLinesAt.push(x);
							}
							newVoid._onEdge = xLinesAt[xLinesAt.indexOf(x)];
						}
						if (((y % (Game.map_grid.height/2) === 0) || y === (Game.map_grid.height - 1))) {
							if (yLinesAt.indexOf(y) === -1) {
								yLinesAt.push(y);
							}
							newVoid._onEdge = yLinesAt[yLinesAt.indexOf(x)];
						}

					} else {
						occupiedSquares[y][x] = false;
					}
				break;
			}
		}
	}
	console.log(xLinesAt, yLinesAt);
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