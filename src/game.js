Game = {
	//This defines our grid's size and the size of each tile
	map_grid: {
		width: 39,
		height: 18,
		tile: {
			width: 32,
			height: 32,
		}
	},
	// The total width of the game screen. Since our grid takes up the entire screen
	//  this is just the width of a tile times the width of the grid
	width: function() {
		return Game.map_grid.width * this.map_grid.tile.width;
	},

	// The total width of the game screen. Since our grid takes up the entire screen
	//  this is just the width of a tile times the width of the grid
	height: function() {
		return Game.map_grid.height * this.map_grid.tile.height;
	},

	playerKeys: Array(),
	//initialize and start game
	start: function() {
		//Start crafty and set background color
		Crafty.init(Game.width(), Game.height());
		Crafty.background('tan');
		playerKeys = [];
		playerKeys['M'] = false;
		Crafty.scene('Loading');
	}
}

$text_css = { 'font-size': '24px', 'font-family': 'Arial', 'color': 'white', 'text-align': 'center' }

window.addEventListener('load', Game.start);