var width = Game.map_grid.width;
var height = Game.map_grid.height;

function createMap(map, width, height) {
	var mapArray = [];
	for (var x = 0; x < map.length; x++) {
		mapArray[x] = map[x].split("");
	}
	var edges = findEdges();
	parsemap(mapArray, edges);
}

function findEdges () {
	return {xEdges: [0, width - 1], yEdges: [0, height - 1]};
}

function parsemap (mapArray, edges) {
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
					addVoid(newEntity, edges, x, y);
				break;
				case 'm':
					newEntity = Crafty.e('Mountain').at(x,y);
					occupiedSquares[y][x] = {type: 'Mountain', id: newEntity[0]};
					allObjects.push(occupiedSquares[y][x]);
					addVoid(newEntity, edges, x, y);
				break;
				case 'o':
					newEntity = Crafty.e('Oasis').at(x,y);
					occupiedSquares[y][x] = {type: 'Oasis', id: newEntity[0]};
					allObjects.push(occupiedSquares[y][x]);
					addVoid(newEntity, edges, x, y);
				break;
				case 't':
					newEntity = Crafty.e('Tent').at(x,y);
					occupiedSquares[y][x] = {type: 'Tent', id: newEntity[0]};
					allObjects.push(occupiedSquares[y][x]);
					addVoid(newEntity, edges, x, y);
				break;
				case 'w':
					newEntity = Crafty.e('Well').at(x,y);
					occupiedSquares[y][x] = {type: 'Well', id: newEntity[0]};
					allObjects.push(occupiedSquares[y][x]);
					addVoid(newEntity, edges, x, y);
				break;
				case '@':
					if (Crafty('Player').length === 0) {
						Game.player = Crafty.e('Player, WhiteCharacter').at(x,y);
					}
				break;
				default:
					if (edges.xEdges.indexOf(x) > -1 || edges.yEdges.indexOf(y) > -1) {
						Crafty.e('Void').at(x,y);
						occupiedSquares[y][x] = 'void';
					} else if (!occupiedSquares[y][x] && randomBetween(0,50) === 1) {
						var newEntity = Crafty.e('SandDune').at(x,y);
						occupiedSquares[y][x] = {type: 'SandDune', id: newEntity[0]};
						allObjects.push(occupiedSquares[y][x]);
					} else if (!occupiedSquares[y][x] && randomBetween(0,25) === 1) {
						var tradeItems = ['Fig', 'Silk', 'Incense'];
						var randomTI = tradeItems[randomBetween(0,tradeItems.length)]
						console.log(randomTI)
						var newEntity = Crafty.e('Silk, TradeItem').at(x,y);
						occupiedSquares[y][x] = {type: randomTI, id: newEntity[0]};
						allObjects.push(occupiedSquares[y][x]);
					}
				break;
			}
		}
	}
	// console.log(occupiedSquares);
	Game.currentMap.map = mapArray;
	Game.currentMap.occupiedSquares = occupiedSquares;
	Game.allObjects = allObjects;
}

function addVoid (newEntity, edges, x, y) {
	if (edges.xEdges.indexOf(x) > -1 || edges.yEdges.indexOf(y) > -1) {
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
			currentMap.x -= 1;
			Crafty.scene('DesertZone');
			Game.player.y = Game.player.y = Game.height() - Game.map_grid.tile.height;;
			break;
		case 'DOWN':
			currentMap.x += 1;
			Crafty.scene('DesertZone');
			Game.player.y = 0;
			break;
		case 'RIGHT':
			currentMap.y += 1;
			Crafty.scene('DesertZone');
			Game.player.x = 0;
			break;
		case 'LEFT':
			currentMap.y -= 1;
			Crafty.scene('DesertZone');
			Game.player.x = Game.width() - Game.map_grid.tile.width;
			console.log(Game.player.x)
			break;
	}
	return;
}