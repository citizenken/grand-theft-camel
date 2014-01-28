	// The Grid component allows an element to be located
	//  on a grid of tiles
	Crafty.c('Grid', {
	init: function() {
		this.bind('KeyDown', function(e) {
			if (e.key == Crafty.keys['ESC']) {
				Crafty.pause();
			}
		})
		this.bind('Pause', function() {
			// Crafty.e('PauseBox').draw();
		})
		this.attr({
			w: Game.map_grid.tile.width,
			h: Game.map_grid.tile.height
		})
	},

	// Locate this entity at the given position on the grid
	at: function(x, y) {
	if (x === undefined && y === undefined) {
	  return { x: this.x/Game.map_grid.tile.width, y: this.y/Game.map_grid.tile.height }
	} else {
	  this.attr({ x: x * Game.map_grid.tile.width, y: y * Game.map_grid.tile.height });
	  return this;
	}
	}
	});

	Crafty.c('PauseBox', {
		init: function() {
			this.requires('2D, DOM, text, Color');
			this.attr({x:(Game.map_grid.width/2), y:(Game.map_grid.height/2), w:200, h:200, z:50});
			this.color('black');
		},
	});

	// An "Actor" is an entity that is drawn in 2D on canvas
	//  via our logical coordinate grid
	Crafty.c('Actor', {
	init: function() {
	this.requires('2D, Canvas, Grid')
	},
		checkDead: function() {
			if (this._hitPoints === 0) {
				this.destroy();
			}
			return false;
		}
	});

	Crafty.c('Scenery', {
	init: function() {
	this.requires('Actor, Color, Solid, Collision')
	  .color('rgb(20, 125, 40)');
	},
	});

	// A Tree is just an Actor with a certain color
	Crafty.c('Tree', {
	init: function() {
	this.requires('Scenery')
	  .color('rgb(20, 125, 40)');
	},
	});

	Crafty.c('Gate', {
	init: function() {
	this.requires('Scenery')
	  .color('black');
	},
	});

	Crafty.c('Oasis', {
	init: function() {
	this.requires('Scenery')
	  .color('blue');
	},
	});

	// A Bush is just an Actor with a certain color
	Crafty.c('Bush', {
	init: function() {
	this.requires('Scenery')
	  .color('rgb(20, 185, 40)');
	},
	});