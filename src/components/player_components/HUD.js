Crafty.c('HUDElement', {
	init: function () {
		this.requires('2D, DOM, Persist')
	}
})

Crafty.c('HUD', {
	_hpBar: null,
	_thirstBar: null,
	_camels: null,
	_money: null,
	_selectedWeapon: null,
	_tradeItemsContainer: null,
	_tradeItems: [], //['gold','gold','gold'],
	_tradeItemsEntities: [],
	init: function () {
		this.requires('HUDElement');
		// this.attr({x:10, y:10, h:30, w:0});
		this.createHpBar();
		this.createThirstBar();
		this.money();
		this.createSelectedWeapon();
		this.createTradeItemsContainer();
		this.createTradeItems();
	},

	createHpBar: function () {
		// var heart = Crafty.e('HUDElement, Color').color('red').attr({x:10, y:10, w:12, h:15});
		this._hpBar = Crafty.e('HUDElement, Color, Text');
		this._hpBar.attr({x:45, y:10, h:10, w:0});
		this._hpBar.color('red');
	},

	createThirstBar: function () {
		// var waterdrop = Crafty.e('HUDElement, Color').color('blue').attr({x:53, y:10, w:12, h:15});
		this._thirstBar = Crafty.e('HUDElement, Color, Text');
		this._thirstBar.attr({x:45, y:25, h:10, w:0});
		this._thirstBar.color('blue');
	},


	createSelectedWeapon: function () {
		this._selectedWeapon = Crafty.e('HUDElement, Color');
		this._selectedWeapon.attr({x:10, y:10, h:25, w:25});
		this._selectedWeapon.css({'border':'solid black 2px', 'border-radius': '5px'});
	},

	createTradeItemsContainer: function () {
		this._tradeItemsContainer = Crafty.e('HUDElement, Color');
		this._tradeItemsContainer.attr({x:10, y:42, h:24, w:92});
		this._tradeItemsContainer.css({'border':'solid black 2px', 'border-radius': '5px'});
	},

	createTradeItems: function () {
		var itemArray = [];
		for (var x = 0; x <= 2; x++) {
			var item = Crafty.e('HUDElement, Mouse');
			// item.color('gray')
			// item.css({'border':'solid black 2px', 'border-radius': '5px'});
			item.attr({x:this._tradeItemsContainer.x + 5 + (20 * x), y:this._tradeItemsContainer.y + 5, h:15, w:15});
			// item._type = this._tradeItems[x];
			// item.addComponent(this._tradeItems[x]);
			item.bind('Click', function() {
				console.log(this);
			})
			this._tradeItemsEntities.push(item);
		}
	},

	money: function () {
		var gold = Crafty.e('HUDElement, Color, Text');
		gold.attr({x:10, y:72});
		gold.text('Gold');
		gold.textFont({size: '12px', weight: 'bold'});
		this._money = Crafty.e('HUDElement, Color, Text');
		this._money.attr({x:50, y:72});
		this._money.textColor('#007F00');
		this._money.textFont({size: '12px', weight: 'bold'});
	}
})

Crafty.c('Gold', {
	init: function() {
		this.requires('Color');
		this.color('yellow');
	},
	remove: function() {
		this.removeComponent('Color');
		this._color = null;
	}
})