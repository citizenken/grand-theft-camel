Crafty.c('Grid', {
	init: function() {
		this.attr({
			w: MapEditor.map_grid.tile.width,
			h: MapEditor.map_grid.tile.height
		});
	},

	// Locate this entity at the given position on the grid
	at: function(x, y) {
		if (x === undefined && y === undefined) {
		  return { x: this.x/MapEditor.map_grid.tile.width, y: this.y/MapEditor.map_grid.tile.height };
		} else {
		  this.attr({ x: x * MapEditor.map_grid.tile.width, y: y * MapEditor.map_grid.tile.height });
		  return this;
		}
	}
});

Crafty.c('Actor', {
	init: function() {
		this.requires('2D, Canvas, Grid');
	}
});

Crafty.c('MapText', {
	init: function() {
		this.requires('2D, DOM, Text')
		.css($text_css);
	}
});

Crafty.c('EmptySpace', {
	_mapChar: '#',
	init: function () {
		this.requires('Actor, Mouse, Collision, WiredHitBox')
		.bind('MouseOver', function() {
			if (MapEditor.paintMode) {
				this.addComponent(MapEditor.selectedEntity);
				this.removeComponent('EmptySpace');
			} else if (!Crafty.bind('MouseDown')) {
				Crafty.bind('MouseDown');
			}
		})
		.bind('MouseDown', function() {
			this.addComponent(MapEditor.selectedEntity);
			this.removeComponent('EmptySpace');
		});
	}
});

Crafty.c('Oasis', {
	_mapChar: 'o',
	init: function () {
		this.requires('Actor, Mouse, Color')
		.color('blue')
		.bind('MouseDown', function(data) {
			console.log(data);
			if (data.buttons === 2) {
				var deleteEntity = window.confirm('Are you sure you want to delete this entity?');
				if (deleteEntity) {
					this.addComponent('Oasis');
					this.removeComponent('EmptySpace');
				}
			}
		});
	}
});