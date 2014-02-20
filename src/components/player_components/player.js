Crafty.c('Player', {
	_direction: null,
	_items: ['sword', 'sling', 'waterJug'],
	_activeItem: 'sword',
	_previousLocation: null,
	_currentLocation: null,
	_currentZone: {x:null, y:null},
	_nextLocation: null,
	_hitPoints: 30,
	_justTriggeredScene: false,
	_moveSpeed: 1,
	_thirst: 0,
	_playerHUD: null,
	_followers: [1,1,1,1,1,1,1,1],
	_tradeItems: [],
	_money: 000000000000,
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
				switch (e.key)
				{
					case Crafty.keys.M:
						Game.playerKeys.M = true;
						break;
					case Crafty.keys.R:
						this.fourway(this._moveSpeed * 4);
						break;
					case Crafty.keys['SPACE']:
						Game.playerKeys['SPACE'] = true;
						this.attack();
						break;
					case Crafty.keys.E:
						Game.playerKeys.E = true;
						break;
					case Crafty.keys.Y:
						Game.playerKeys.Y = true;
						this.changeWeapon();
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
						var selectedItem = items.indexOf(Crafty('SelectedItem'));
						if (selectedItem > -1) {
							items[selectedItem].removeComponent('SelectedItem')
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
			})
			.onHit('Dropped', function() {}, function () {
				Crafty('Dropped').removeComponent('Dropped');
			})
			.bind('KeyUp', function(e) {
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
					case Crafty.keys['SPACE']:
						Game.playerKeys['SPACE'] = false;
						break;
				}
			})
			.onHit('SandDune', function(data) {
				console.log(this._z, data[0].obj._z);
				if (this._speed.x == this._moveSpeed || this._speed.y == this._moveSpeed) {
					this.fourway(this._moveSpeed/2);
				}
			}, function () {
				if (this._speed.x == this._moveSpeed/2 || this._speed.y == this._moveSpeed/2) {
					// this.fourway(this._moveSpeed);
				}
			})
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
                	console.log('test')
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
			this.delay(function() {this.addThirst();}, 1000, -1)
	},

    addThirst: function () {
                if (this._movement.x !== 0 || this._movement.y !== 0 && this._thirst < 30) {
                    this._thirst += 1;
                } else if (this._thirst < 30) {
                    this._thirst += 0.5;
                } else if (this._hitPoints > 0) {
                    this._hitPoints -= 0.5;
                }
    },

    changeWeapon: function() {
        var currentItem = this._items.indexOf(this._activeItem);
        var nextItem = currentItem + 1;
        if (nextItem < this._items.length) {
            this._activeItem = this._items[nextItem];
        } else {
            this._activeItem = this._items[0];
        }
        console.log(this._activeItem)
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
                if (Game.playerKeys.E) {
                    this._thirst = 0;
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
	    if (!items[itemNumber].has('SelectedItem')) {
	        for (var i = 0; i < items.length;i++) {
	            items[i].removeComponent('SelectedItem');
		        items[i].css({
	                border: 'solid black 2px',
	                'border-radius': '5px'
	            });
	        }
	        if (!items[itemNumber].has('EmptyItem')) {
                items[itemNumber].toggleComponent('SelectedItem');
	        }
	    } else {
            items[itemNumber].toggleComponent('SelectedItem');
            items[itemNumber].css({
                border: 'solid black 2px',
                'border-radius': '5px'
            });
	    }
	},

	updateHUD: function () {
		var hud = this._playerHUD;
		if (hud) {
			hud._hpBar.w = this._hitPoints * 2;
			hud._thirstBar.w = this._thirst * 2;
			hud._money.text(this._money);
			if (this._tradeItems.join() !== hud._tradeItems.join()) {
				this.updateItems(hud);
			}
		}
	},

	updateItems: function(hud) {
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
	}
});

Crafty.c('WhiteCharacter', {
	init: function () {
		this.requires('SpriteAnimation, WiredHitBox, Persist, SpriteAnimation, spr_white_player')
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
	},

	attack: function() {
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
	}
});
