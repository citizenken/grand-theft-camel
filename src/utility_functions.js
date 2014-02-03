function randomBetween(low, high) {
	return Math.floor(Crafty.math.randomNumber(low, high));
}

function convertMap(map, width, height) {
	console.log(map);
	var mapArray = [];
	for (var x = 0; x < map.length; x++) {
		mapArray[x] = map[x].split("");
	}
	console.log(mapArray);
	parsemap(mapArray)
}

function parsemap (mapArray) {
	for (var y = 0; y < mapArray.length; y++) {
		for(var x = 0; x < mapArray[y].length; x++) {
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
				case '@':
					Game.player = Crafty.e('WhiteCharacter, Player').at(x,y);
				break;
				default:
				break;
			}
		}
	};
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