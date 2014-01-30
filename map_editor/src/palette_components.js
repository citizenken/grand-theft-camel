Crafty.c('TentPalette', {
	_mapChar: '#',
	init: function () {
		this.requires('2D, DOM, Color, Collision, WiredHitBox, Mouse')
		.attr({w:32, h:32})
		.color('black');
		this.DOM(TentPalette);
	}
});

Crafty.c('OasisPalette', {
	_mapChar: 'o',
	init: function () {
		this.requires('2D, DOM, Color, Collision, WiredHitBox, Mouse')
		.attr({x:32, w:32, h:32})
		.color('blue');
		this.DOM(OasisPalette);
	}
});