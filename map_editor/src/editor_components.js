Crafty.c('Grid', {
	init: function() {
		this.requires('Mouse')
		.bind('MouseOver', function() {
			if (MapEditor.paintMode && MapEditor.selectedEntity !== 'Player') {
				this.addEntity(this, MapEditor.selectedEntity);
			} else if (MapEditor.eraseMode && MapEditor.selectedEntity) {
				if (this.has(MapEditor.selectedEntity)) {
					this.removeEntity(this, MapEditor.selectedEntity);
				}
			} else if (!Crafty.bind('MouseDown')) {
				Crafty.bind('MouseDown');
			}
		})
		.bind('MouseDown', function (data) {
			if (data.button === 0) {
				if (this.has('EmptySpace') && MapEditor.selectedEntity) {
					this.addEntity(this, MapEditor.selectedEntity);
				}
			} else if (data.button === 2) {
				if (this.has(MapEditor.selectedEntity)) {
					this.removeEntity(this, MapEditor.selectedEntity);
				}
			}
		});
		this.attr({
			w: MapEditor.map_grid.tile.width,
			h: MapEditor.map_grid.tile.height
		});
	},

	addEntity: function (entity, selectedEntity) {
		if (selectedEntity !== 'FillBucket') {
			if (selectedEntity === 'Player' && !MapEditor.playerPlaced) {
				MapEditor.playerPlaced = true;
				entity.addComponent(selectedEntity);
			} else if (selectedEntity === 'Player' && MapEditor.playerPlaced) {
				window.alert('Player is already placed. Only one is allowed per map');
			} else if (entity.has('EmptySpace') && selectedEntity) {
				entity.addComponent(selectedEntity);
			}
			entity.removeComponent('EmptySpace');
		} else {
			this.fillBucketSelect(entity, selectedEntity);
		}
	},

	fillBucketSelect: function(entity, selectedEntity) {
		entity.addComponent(selectedEntity);
	},

	removeEntity: function(entity, selectedEntity) {
		if (selectedEntity === 'Player' && MapEditor.playerPlaced) {
			MapEditor.playerPlaced = false;
			entity.removeComponent(selectedEntity);
		} else {
			entity.removeComponent(selectedEntity);
		}
		if(entity.has('Sprite')) {
			entity.removeComponent('Sprite');
		}
		entity.addComponent('EmptySpace');
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

Crafty.c('Mountain', {
	_mapChar: 'm',
	init: function () {
		this.requires('Actor, Mouse, Color')
		.color('brown')
	}
});

Crafty.c('Well', {
	_mapChar: 'w',
	init: function () {
		this.requires('Actor, Mouse, spr_uncovered_well_32')
		// .color('#BFEFFF')
	}
});

Crafty.c('Player', {
	_mapChar: '@',
	init: function () {
		this.requires('Actor, Mouse, spr_white_player')
	}
});

Crafty.c('FillBucket', {
	_mapChar: '@',
	init: function () {
		this.requires('Actor, Mouse, Tint')
		this.tint("#969696", 0.3);
	}
});