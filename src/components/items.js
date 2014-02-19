//Gear
Crafty.c('Sword', {
	_itemType: 'Sword',
	init: function() {
	this.requires('Actor, Solid, Collision, Color')
	this.color('gray');
	},
});

//Trade Items
Crafty.c('TradeItem', {
	init: function() {
	this.requires('Actor, Collision, Color, Mouse')
	this.w = 15;
	this.h = 15;
    this.bind('Click', function() {
        console.log(this);
    });
	},
});

Crafty.c('TradeItemBasics', {
	init: function() {
	this.requires('Color, Mouse')
	}
});

Crafty.c('Fig', {
	_itemType: 'Fig',
	init: function() {
	this.requires('TradeItemBasics')
	this.color('rgb(205,133,63)')
	},
});

Crafty.c('Silk', {
	_itemType: 'Silk',
	init: function() {
	this.requires('TradeItemBasics')
	this.color('purple')
	},
});

Crafty.c('Incense', {
	_itemType: 'Incense',
	init: function() {
	this.requires('TradeItemBasics')
	this.color('orange')
	},
});
