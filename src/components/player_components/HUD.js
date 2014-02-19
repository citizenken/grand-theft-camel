Crafty.c('HUDElement', {
    init: function() {
        this.requires('2D, DOM, Persist');
    }
});

Crafty.c('HUD', {
    _maxTradeItems: 3,
    _hpBar: null,
    _thirstBar: null,
    _camels: null,
    _money: null,
    _selectedWeapon: null,
    _tradeItemsContainer: null,
    _tradeItems: [],
    _tradeItemsEntities: [],
    _possibleItems: ['Gold', 'Fig'],
    init: function() {
        this.requires('HUDElement');
        this.createHpBar();
        this.createThirstBar();
        this.money();
        this.createSelectedWeapon();
        this.createTradeItemsContainer();
        this.createTradeItems();
    },
    createHpBar: function() {
        this._hpBar = Crafty.e('HUDElement, Color, Text');
        this._hpBar.attr({
            x: 45,
            y: 10,
            h: 10,
            w: 0
        });
        this._hpBar.color('red');
    },
    createThirstBar: function() {
        this._thirstBar = Crafty.e('HUDElement, Color, Text');
        this._thirstBar.attr({
            x: 45,
            y: 25,
            h: 10,
            w: 0
        });
        this._thirstBar.color('blue');
    },
    createSelectedWeapon: function() {
        this._selectedWeapon = Crafty.e('HUDElement, Color');
        this._selectedWeapon.attr({
            x: 10,
            y: 10,
            h: 25,
            w: 25
        });
        this._selectedWeapon.css({
            border: 'solid black 2px',
            'border-radius': '5px'
        });
    },
    createTradeItemsContainer: function() {
        this._tradeItemsContainer = Crafty.e('HUDElement, Color');
        this._tradeItemsContainer.attr({
            x: 10,
            y: 42,
            h: 24,
            w: 92
        });
        this._tradeItemsContainer.css({
            border: 'solid black 2px',
            'border-radius': '5px'
        });
    },
    createTradeItems: function() {
        var itemArray = [];
        for (var x = 0; x < this._maxTradeItems; x++) {
            var item = Crafty.e('HUDElement, Mouse, EmptyItem');
            item._thisNum = x;
            item.css({
                border: 'solid black 2px',
                'border-radius': '5px'
            });
            item.attr({
                x: this._tradeItemsContainer.x + 5 + 20 * x,
                y: this._tradeItemsContainer.y + 5,
                h: 15,
                w: 15
            });
            item._type = this._tradeItems[x];
            this._tradeItemsEntities.push(item);
        }
    },
    money: function() {
        var gold = Crafty.e('HUDElement, Color, Text');
        gold.attr({
            x: 10,
            y: 72
        });
        gold.text('Gold');
        gold.textFont({
            size: '12px',
            weight: 'bold'
        });
        this._money = Crafty.e('HUDElement, Color, Text');
        this._money.attr({
            x: 50,
            y: 72
        });
        this._money.textColor('#007F00');
        this._money.textFont({
            size: '12px',
            weight: 'bold'
        });
    }
});

Crafty.c('SelectedItem', {
    init: function() {
        this.requires('HUDElement');
        this.css({
            border: 'solid red 2px',
            'border-radius': '5px'
        });
    }
})

Crafty.c('Gold', {
    init: function() {
        this.requires('Color, Mouse');
        this.color('yellow');
        this.bind('Click', function() {
            console.log(this);
        });
    }
})