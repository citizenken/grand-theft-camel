Crafty.c('Grid', {
	init: function() {
		this.requires('Mouse')
		.bind('MouseOver', function() {
			if (MapEditor.paintMode && MapEditor.selectedEntity) {
				this.addComponent(MapEditor.selectedEntity);
				this.removeComponent('EmptySpace');
			} else if (!Crafty.bind('MouseDown')) {
				Crafty.bind('MouseDown');
			}
		})
		.bind('MouseDown', function (data) {
			if (data.button === 0) {
				if (this.has('EmptySpace') && MapEditor.selectedEntity) {
					this.toggleComponent(MapEditor.selectedEntity);
					this.toggleComponent('EmptySpace');
				}
			} else if (data.button === 2) {
				var selectedEntity = MapEditor.selectedEntity;
				this.toggleComponent('*');
				this.toggleComponent('EmptySpace');
				this.color('tan');
			}
		});
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
		this.requires('2D, Canvas, Grid, Collision, WiredHitBox');
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
		this.requires('Actor, Mouse, Color')
		.color('tan');
	}
});

Crafty.c('Oasis', {
	_mapChar: 'o',
	init: function () {
		this.requires('Actor, Mouse, Color')
		.color('blue')
	}
});

Crafty.c('Tent', {
	_mapChar: 't',
	init: function () {
		this.requires('Actor, Mouse, Color')
		.color('black')
	}
});