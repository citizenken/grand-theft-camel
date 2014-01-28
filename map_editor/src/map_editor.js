var MapEditor = {
	//This defines our grid's size and the size of each tile
	map_grid: {
		width: 50,
		height: 50,
		tile: {
			width: 32,
			height: 32,
		}
	},
	// The total width of the MapEditor screen. Since our grid takes up the entire screen
	//  this is just the width of a tile times the width of the grid
	width: function() {
		// return Math.floor(window.innerWidth/32) * this.map_grid.tile.width;
		return MapEditor.map_grid.width * this.map_grid.tile.width;
	},

	// The total width of the MapEditor screen. Since our grid takes up the entire screen
	//  this is just the width of a tile times the width of the grid
	height: function() {
		// return Math.floor(window.innerHeight/32) * this.map_grid.tile.height;
		return MapEditor.map_grid.height * this.map_grid.tile.height;
	},

	paintMode: false,
	selectedEntity: 'Oasis',
	//initialize and start MapEditor
	start: function() {
		//Start crafty and set background color
		Crafty.init(MapEditor.width(), MapEditor.height());
		Crafty.background('tan');
		Crafty.scene('Loading');
	}
};

var $text_css = { 'font-size': '24px', 'font-family': 'Arial', 'color': 'black', 'text-align': 'center' };

window.addEventListener('load', MapEditor.start);