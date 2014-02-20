//Gear
Crafty.c('Sword', {
	init: function() {
	this.requires('Color')
	this.color('gray');
	},
});

Crafty.c('WaterBag', {
	init: function() {
	this.requires('Color')
	this.color('blue');
	},
});

Crafty.c('EmptyWaterBag', {
	init: function() {
	this.requires('Color')
	this.color('white');
	},
});

Crafty.c('Lance', {
	init: function() {
	this.requires('Color')
	this.color('brown');
	},
});

Crafty.c('Sling', {
	init: function() {
	this.requires('Color')
	this.color('black');
	},
});

Crafty.c('Bullet', {
	_speed: 5,
	_direction: null,
	_maxDistance: 50,
	_traveledDistance: 0,
	init: function() {
		this.requires('Actor, Collision, Color')
		this.color('gray')
		this.h = 5
		this.w = 5
		this.bind('EnterFrame', function() {
			if (this._traveledDistance === this._maxDistance) {
				this.destroy();
			} else {
				switch (this._direction) {
					case 'UP':
						this.y -= this._speed;
						break;
					case 'DOWN':
						this.y += this._speed;
						break;
					case 'LEFT':
						this.x -= this._speed;
						break;
					case 'RIGHT':
						this.x += this._speed;
						break;
				}
				this._traveledDistance += 1;
			}
		})
		this.onHit('Scenery', function(data){
			this.destroy();
		})
	}
})

//Trade Items
Crafty.c('TradeItem', {
	init: function() {
	this.requires('Actor, Collision, Color, Mouse')
	this.w = 15;
	this.h = 15;
    this.bind('Click', function() {
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
