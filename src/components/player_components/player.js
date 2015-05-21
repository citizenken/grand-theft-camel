Crafty.c('Player', {
	_activeItem: 'Sword',
	_currentLocation: null,
	_currentZone: {x:null, y:null},
    _direction: 'DOWN',
	_followers: [1,1,1,1,1,1,1,1],
    _hitPoints: 30,
    _items: ['Sword', 'Sling', 'Lance', 'EmptyWaterBag'],
    _justTriggeredScene: false,
	_money: 000000000000,
    _moveSpeed: 1,
    _nextLocation: null,
    _playerHUD: null,
    _previousLocation: null,
    _water: 30,
    _tradeItems: [],
	init: function() {
		this.requires('Actor, Fourway, Collision, Delay, FPS, Persist, Solid')
			._playerHUD = Crafty.e('HUD');
			// this.attach(this._playerHUD);
			this.fourway(this._moveSpeed)
			.bind('EnterFrame', function(data) {
				this.checkDead();
				this.updateHUD();
			})
			.bind('KeyDown', function(e) {
				if (Game.keyPressed) {
					Game.keyPressed = true;
					switch (e.key) {
						case Crafty.keys.M:
							Game.playerKeys.M = true;
							break;
						case Crafty.keys.R:
							this.fourway(this._moveSpeed * 4);
							break;
						case Crafty.keys.SPACE:
							Game.playerKeys.SPACE = true;
							this.itemRouter();
							break;
						case Crafty.keys.E:
							Game.playerKeys.E = true;
							break;
						case Crafty.keys.Y:
							Game.playerKeys.Y = true;
							this.changeItem();
							break;
						case Crafty.keys['1']:
							Game.playerKeys['1'] = true;
							this.selectTradeItem(0);
							break;
						case Crafty.keys['2']:
							Game.playerKeys['2'] = true;
							this.selectTradeItem(1);
							break;
						case Crafty.keys['3']:
							Game.playerKeys['3'] = true;
							this.selectTradeItem(2);
							break;
						case Crafty.keys['3']:
							Game.playerKeys['3'] = true;
							this.selectTradeItem(2);
							break;
						case Crafty.keys.T:
							Game.playerKeys.T = true;
							var items = Game.player._playerHUD._tradeItemsEntities;
							var selectedItem = items.indexOf(Crafty('SelectedTradeItem'));
							if (selectedItem > -1) {
								items[selectedItem].removeComponent('SelectedTradeItem');
								items[selectedItem].css({
					                border: 'solid black 2px',
					                'border-radius': '5px'
					            });
					            var droppedItem = Crafty.e(this._tradeItems[selectedItem] + ',TradeItem, Dropped');
					            droppedItem.x = this.x;
					            droppedItem.y = this.y;
								this._tradeItems[selectedItem] = null;
							}
							break;
						}
				}
			})
			.onHit('Dropped', function() {}, function () {
				Crafty('Dropped').removeComponent('Dropped');
			})
			.bind('KeyUp', function(e) {
				if (Game.keyPressed) {
					Game.keyPressed = false;
					switch (e.key)
					{
						case Crafty.keys.M:
							Game.playerKeys.M = false;
							break;
						case Crafty.keys.R:
							this.fourway(1);
							break;
						case Crafty.keys.E:
							Game.playerKeys.E = false;
							break;
						case Crafty.keys.SPACE:
							Game.playerKeys.SPACE = false;
							break;
					}
				}
			})
/*			.onHit('SandDune', function(data) {
				if (this._speed.x == this._moveSpeed || this._speed.y == this._moveSpeed) {
					this.fourway(this._moveSpeed/2);
				}
			}, function () {
				if (this._speed.x == this._moveSpeed/2 || this._speed.y == this._moveSpeed/2) {
					this.fourway(this._moveSpeed);
				}
			})*/
			.onHit('Actor', function(data) {
				var hitObject = data[0].obj;
				var hitObjectType;
                if (hitObject.has('Void')) {
                    hitObjectType = 'Void';
                } else if (hitObject.has('Well')) {
                    hitObjectType = 'Well';
                } else if (hitObject.has('Scenery')) {
                    hitObjectType = 'Scenery';
                } else if (hitObject.has('Camel')) {
                    hitObjectType = 'Camel';
                } else if (hitObject.has('TradeItem') && !hitObject.has('Dropped') ) {
                    hitObjectType = 'TradeItem';
                }
                this.collisionHandler(hitObjectType, hitObject);
			})
			.bind('Moved', function(data) {
				this._previousLocation = data;
				this._currentLocation = {x:this.x, y:this.y};
				this._nextLocation = {x:this.x + this._movement.x, y:this.y + this._movement.y};
			})
			.bind('NewDirection', function(data) {
				if (data.y === -1 || data === 'UP') {
					this._direction = 'UP';
				} else if (data.y === 1 || data === 'DOWN') {
					this._direction = 'DOWN';
				} else if (data.x === 1 || data === 'RIGHT') {
					this._direction = 'RIGHT';
				} else if (data.x === -1 || data === 'LEFT') {
					this._direction = 'LEFT';
				}
			});
			this.delay(function() {
				this.removeWater();
			}, 1000, -1);
	},

    removeWater: function () {
                if (this._movement.x !== 0 || this._movement.y !== 0 && this._water > 0) {
                    this._water -= 1;
                } else if (this._water > 0) {
                    this._water -= 0.5;
                } else if (this._hitPoints > 0) {
                    this._hitPoints -= 0.5;
                }
    },

    changeItem: function() {
        var currentItem = this._items.indexOf(this._activeItem);
        var nextItem = currentItem + 1;
        if (nextItem < this._items.length) {
            this._activeItem = this._items[nextItem];
        } else {
            this._activeItem = this._items[0];
        }
    },

    collisionHandler: function(hitObjectType, hitObject) {
        switch (hitObjectType) {
            case 'Void':
                if (this.x === hitObject.x || this.y === hitObject.y) {
                    if (this._justTriggeredScene === false) {
                        this._justTriggeredScene = true;
                        changeMap(this._direction);
                        this._justTriggeredScene = false;
                    }
                }
            break;
            case 'Well':
                if (this.steps > 0) {
                    this.steps = 0;
                }
                this._speed = 0;
                if (this._movement) {
                  this.x -= this._movement.x;
                  this.y -= this._movement.y;
                }
                if (this._activeItem === 'EmptyWaterBag' && this._items.indexOf('EmptyWaterBag') > -1) {
                    this._water = 30;
                    this._items[this._items.indexOf('EmptyWaterBag')] = 'WaterBag';
                    this._activeItem = 'WaterBag';
                    console.log(this._items)
                } else {
                	this._water = 30;
                }
            break;
            case 'Scenery':
                if (this.steps > 0) {
                    this.steps = 0;
                }
                this._speed = 0;
                if (this._movement) {
                  this.x -= this._movement.x;
                  this.y -= this._movement.y;
                }
            break;
            case 'Camel':
                if (Game.playerKeys.M) {
                    this.mount(data);
                }
            break;
            case 'TradeItem':
            // console.log(this._tradeItems.length);
                if (this._tradeItems.length < 3) {
            		this._tradeItems.push(hitObject._itemType);
            		hitObject.destroy();
            	} else if (this._tradeItems.indexOf(null) > -1) {
            		var nullSpace = this._tradeItems.indexOf(null);
            		this._tradeItems[nullSpace] = hitObject._itemType;
            		hitObject.destroy();
            	}
            break;
        }
    },

	checkAdjacent: function() {
		var currentSquare = {x:Math.floor(this.at().x), y:Math.floor(this.at().y)};
		if (Game.currentMap.occupiedSquares[currentSquare.y - 1][currentSquare.x]) {
			var squareUp = Game.currentMap.occupiedSquares[currentSquare.y - 1][currentSquare.x].type;
		}
		if (Game.currentMap.occupiedSquares[currentSquare.y + 1][currentSquare.x]) {
			var squareDown = Game.currentMap.occupiedSquares[currentSquare.y + 1][currentSquare.x];
		}
		if (Game.currentMap.occupiedSquares[currentSquare.y][currentSquare.x + 1]) {
			var squareRight = Game.currentMap.occupiedSquares[currentSquare.y + 1][currentSquare.x];
		}
		if (Game.currentMap.occupiedSquares[currentSquare.y][currentSquare.x - 1]) {
			var squareLeft = Game.currentMap.occupiedSquares[currentSquare.y + 1][currentSquare.x];
		}
		return [squareUp, squareDown, squareRight, squareLeft]
	},

	mount: function(data) {
		var camel = data[0].obj;
		camel.destroy();
		var leadCamel = Crafty.e('LeadCamel, Player');
		leadCamel.followers = Array();
		leadCamel.x = this.x;
		leadCamel.y = this.y;
		Game.player = leadCamel;
		Crafty.viewport.centerOn(Game.player);
		Crafty.viewport.follow(Game.player);
		switch (this._direction)
		{
			case 'UP':
					leadCamel.animate('LeadCamelMovingUp', -1);
				break;
			case 'DOWN':
				break;
			case 'LEFT':
					leadCamel.animate('LeadCamelMovingLeft', -1);
				break;
			case 'RIGHT':
					leadCamel.animate('LeadCamelMovingRight', -1);
				break;
		}
		Crafty('WhiteCharacter').destroy();
	},

	selectTradeItem: function(itemNumber) {
		var items = this._playerHUD._tradeItemsEntities;
	    if (!items[itemNumber].has('SelectedTradeItem')) {
	        for (var i = 0; i < items.length;i++) {
	            items[i].removeComponent('SelectedTradeItem');
		        items[i].css({
	                border: 'solid black 2px',
	                'border-radius': '5px'
	            });
	        }
	        if (!items[itemNumber].has('EmptyItem')) {
                items[itemNumber].toggleComponent('SelectedTradeItem');
	        }
	    } else {
            items[itemNumber].toggleComponent('SelectedTradeItem');
            items[itemNumber].css({
                border: 'solid black 2px',
                'border-radius': '5px'
            });
	    }
	},

	updateActiveItem: function(hud) {
		var hudActiveItem = hud._activeItem
		hudActiveItem.removeComponent(hud._playerActiveItem);
		hudActiveItem._color = 'none';
		hudActiveItem._element.style.backgroundColor = null;
		hudActiveItem.addComponent(this._activeItem);
		hud._playerActiveItem = this._activeItem
	},

	updateHUD: function () {
		var hud = this._playerHUD;
		if (hud) {
			hud._hpBar.w = this._hitPoints * 2;
			hud._thirstBar.w = this._water * 2;
			hud._money.text(this._money);
			if (this._tradeItems.join() !== hud._tradeItems.join()) {
				this.updateTradeItems(hud);
			}
			if (this._activeItem !== hud._playerActiveItem) {
				this.updateActiveItem(hud);
			}
		}
	},

	updateTradeItems: function(hud) {
		for (var x = 0; x < this._tradeItems.length; x++) {
			var currentEntity = Crafty(hud._tradeItemsEntities[x][0]);
			if (this._tradeItems[x] && !currentEntity.has(this._tradeItems[x])) {
				for (var i = 0; i < hud._possibleItems.length;i++) {
					if (currentEntity.has(hud._possibleItems[i])) {
						currentEntity.removeComponent(hud._possibleItems[i]);
					}
				}
				currentEntity.toggleComponent('EmptyItem');
				currentEntity.addComponent(this._tradeItems[x]);
			} else if ((this._tradeItems[x] === null) && currentEntity.has(hud._tradeItems[x])) {
				currentEntity.removeComponent(hud._tradeItems[x]);
				currentEntity.toggleComponent('EmptyItem');
				currentEntity._color = 'none';
				currentEntity._element.style.backgroundColor = null;
			}
		}
		hud._tradeItems = this._tradeItems.slice();
	},

	useWaterBag: function() {
		if (this._water < 30) {
			this._water = 30;
			this._items[this._items.indexOf('WaterBag')] = 'EmptyWaterBag';
			this._activeItem = 'EmptyWaterBag';
			console.log(this._items)
		}
	}
});

Crafty.c('WhiteCharacter', {
    _reloading: false,
	init: function () {
		this.requires('SpriteAnimation, WiredHitBox, Persist, Delay, SpriteAnimation, spr_white_player')
		.reel('PlayerUp', 400, 0, 2, 3)
		.reel('PlayerDown', 400, 0, 0, 3)
		.reel('PlayerRight',400, 0, 3, 3)
		.reel('PlayerLeft', 400, 0, 1, 3)
		.reel('PlayerSwordRight',200, 0, 5, 5)
		.reel('PlayerSwordLeft', 200, 0, 4, 5)
		.reel('PlayerSwordDown', 200, 0, 6, 5)
		.bind('AnimationEnd', function(data) {
			if (data.id === 'PlayerSwordRight' || data.id === 'PlayerSwordLeft') {
				switch (this._direction)
				{
					case 'UP':
						break;
					case 'DOWN':
						break;
					case 'LEFT':
							// this.animate('PlayerLeft', -1)
						break;
					case 'RIGHT':
							// this.resumeAnimation();
						break;
				}
			}
		})
		.bind('NewDirection', function(data) {
			if (data.y < 0) {
				this.animate('PlayerUp', -1);
			} else if (data.y > 0) {
				this.animate('PlayerDown', -1);
			} else if (data.x > 0) {
				this.animate('PlayerRight', -1);
			} else if (data.x < 0) {
				this.animate('PlayerLeft', -1);
			} else {
				this.pauseAnimation();
				this.reelPosition(1);
			}
		});
        this.delay(function() {
            if (this._reloading) {
                this._reloading = false;
                var hudActiveItem = this._playerHUD._activeItem;
                hudActiveItem._color = 'rgba(0,0,0,1)';
                hudActiveItem._element.style.backgroundColor = 'rgba(0,0,0,1)';
            }
        }, 1500, -1);
	},

	itemRouter: function() {
		switch (this._activeItem) {
			case 'Sword':
				this.attackSword();
				break;
			case 'WaterBag':
				this.useWaterBag();
				break;
			case 'Lance':
				this.attackLance();
				break;
			case 'Sling':
				this.attackSling();
				break;
		}
	},

	attackSword: function() {
		var direction = this._direction;
		switch (direction)
			{
				case 'UP':
					break;
				case 'DOWN':
						this.animate('PlayerSwordDown', 1);
					break;
				case 'LEFT':
						this.animate('PlayerSwordLeft', 1);
					break;
				case 'RIGHT':
						this.animate('PlayerSwordRight', 1);
					break;
			}
		if (this.hit('Actor')) {
			var actor = this.hit('Actor')[0].obj;
			actor._hitPoints -= 1;
		}
	},

	attackSling: function() {
		if (!this._reloading) {
            var hudActiveItem = this._playerHUD._activeItem;
            hudActiveItem._color = 'rgba(0,0,0,0.3)';
            hudActiveItem._element.style.backgroundColor = 'rgba(0,0,0,0.3)';
            var bullet = Crafty.e('Bullet');
            switch (this._direction) {
                case 'UP':
                    bullet.x = (this.x + (Game.map_grid.tile.width/2));
                    bullet.y = this.y;
                    break;
                case 'DOWN':
                    bullet.x = (this.x + (Game.map_grid.tile.width/2 + 3));
                    bullet.y = (this.y + (Game.map_grid.tile.height/2));
                    break;
                case 'LEFT':
                    bullet.x = (this.x + (Game.map_grid.tile.width/2 + 3));
                    bullet.y = (this.y + (Game.map_grid.tile.height/2));
                    break;
                case 'RIGHT':
                    bullet.x = this.x + 5;
                    bullet.y = (this.y + (Game.map_grid.tile.height/2));
                    break;
            }
            this._reloading = true;
            bullet._direction = this._direction;
		}
	}
});
