Crafty.scene('Desert', function() {
	console.log('blah');
	convertMap(openDesertSection00, Game.map_grid.width, Game.map_grid.height);
	Crafty.viewport.init(400,400);
	Crafty.viewport.centerOn(Crafty('Player'));
	Crafty.viewport.follow(Crafty('Player'));
});