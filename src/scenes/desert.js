Crafty.scene('DesertZone', function() {
	var currentMap = Game.currentMap;
	var sceneMap = window[Game.worldMap[currentMap.x][currentMap.y]];
	convertMap(sceneMap, Game.map_grid.width, Game.map_grid.height);
/*	Crafty.viewport.init(400,400);
	Crafty.viewport.centerOn(Crafty('Player'));
	Crafty.viewport.follow(Crafty('Player'));*/
});