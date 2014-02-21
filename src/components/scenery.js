// An "Actor" is an entity that is drawn in 2D on canvas
//  via our logical coordinate grid
Crafty.c('Scenery', {
	init: function() {
	this.requires('Actor, Solid, Collision')
	},
	});

// A Tree is just an Actor with a certain color
Crafty.c('Tree', {
	init: function() {
	this.requires('Scenery, Color')
	  .color('rgb(20, 125, 40)');
	},
});

Crafty.c('Gate', {
	init: function() {
	this.requires('Scenery, Color')
	  .color('black');
	},
});

Crafty.c('Oasis', {
	init: function() {
	this.requires('Scenery, Color')
	  .color('blue');
	},
});

Crafty.c('Tent', {
	init: function() {
	this.requires('Scenery, Color')
	  .color('black');
	},
});

Crafty.c('Well', {
	init: function() {
	this.requires('Scenery, spr_uncovered_well_32');
	},
});

Crafty.c('Mountain', {
	init: function() {
	this.requires('Scenery, Color')
		.color('brown');
	},
});

// A Bush is just an Actor with a certain color
Crafty.c('Bush', {
	init: function() {
	this.requires('Scenery, Color')
	  .color('rgb(20, 185, 40)');
	},
});

Crafty.c('SandDune', {
	init: function() {
	this.requires('Actor, Color')
	  .color('white');
	  this._z = -1;
	},
});