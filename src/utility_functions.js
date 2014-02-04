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
	for (var y = 0; y < mapArray.length; y++) {
		for(var x = 0; x < mapArray[y].length; x++) {
			var newEntity;
			switch (mapArray[y][x]) {
				case 'b':
					Crafty.e('Bush').at(x,y);
				break;
				case 'm':
					Crafty.e('Mountain').at(x,y);
				break;
				case 'o':
					Crafty.e('Oasis').at(x,y);
				break;
				case 't':
					Crafty.e('Tent').at(x,y);
				break;
				case 'w':
					Crafty.e('Well').at(x,y);
				break;
				case '@':
					Game.player = Crafty.e('WhiteCharacter, Player').at(x,y);
				break;
				default:
					if (y === 0 || x === 0 || y === mapArray.length - 1 || x === mapArray[y].length - 1) {
						Crafty.e('Void').at(x,y);
					}
				break;
			}
/*			if (newEntity && y === 0 || x === 0 || y === mapArray.length - 1 || x === mapArray[y].length - 1) {
				if (newEntity.has('Well')) {
				console.log(newEntity, 'this is entity x ' + newEntity.at().x, 'this is entity y ' + newEntity.at().y, 'this is x ' + x, 'this is y ' + y, mapArray.length - 1, mapArray[y].length - 1);

				}
				newEntity.addComponent('Void');
			}*/
		}
	};
}

function addVoid (mapArray, newEntity, x, y) {
	if (newEntity && y === 0 || x === 0 || y === mapArray.length - 1 || x === mapArray[y].length - 1) {
		newEntity.addComponent('Void');
	} /*else if (y === 0 || x === 0 || y === mapArray.length - 1 || x === mapArray[y].length - 1) {
		Crafty.e('Void').at(x, y);
	}*/
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