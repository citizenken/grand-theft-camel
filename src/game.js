Game = {
	//This defines our grid's size and the size of each tile
	map_grid: {
		width: Math.floor(window.innerWidth/32),
		height: Math.floor(window.innerHeight/32),
		tile: {
			width: 32,
			height: 32,
		}
	},
	// The total width of the game screen. Since our grid takes up the entire screen
	//  this is just the width of a tile times the width of the grid
	width: function() {
		// return Math.floor(window.innerWidth/32) * this.map_grid.tile.width;
		return Game.map_grid.width * this.map_grid.tile.width;
	},

	// The total width of the game screen. Since our grid takes up the entire screen
	//  this is just the width of a tile times the width of the grid
	height: function() {
		// return Math.floor(window.innerHeight/32) * this.map_grid.tile.height;
		return Game.map_grid.height * this.map_grid.tile.height;
	},

	playerKeys: Array(),
	playerLocation: Object,
	enemies: Array(),
	//initialize and start game
	start: function() {
		//Start crafty and set background color
		Crafty.init(Game.width(), Game.height());
		// Crafty.viewport.init(400,400);
		Crafty.background('tan');
		playerKeys = [];
		playerKeys['M'] = false;
		Crafty.scene('Loading');
	}
}

$text_css = { 'font-size': '24px', 'font-family': 'Arial', 'color': 'white', 'text-align': 'center' }

window.addEventListener('load', Game.start);