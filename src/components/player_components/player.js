	Crafty.c('WhiteCharacter', {
		init: function () {
			this.requires('SpriteAnimation, WiredHitBox, Persis, SpriteAnimation, spr_white_player')
			.reel('PlayerUp', 400, 0, 2, 3)
			.reel('PlayerDown', 400, 0, 0, 3)
			.reel('PlayerRight',400, 0, 3, 3)
			.reel('PlayerLeft', 400, 0, 1, 3)
			.reel('PlayerSwordRight',200, 0, 5, 5)
			.reel('PlayerSwordLeft', 200, 0, 4, 5)
			.reel('PlayerSwordDown', 200, 0, 6, 5)
			.bind('AnimationEnd', function(data) {
				if (data.id == 'PlayerSwordRight' || data.id == 'PlayerSwordLeft') {
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
					console.log('left');
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
	})

	Crafty.c('Player', {
		_direction: null,
		_weapons: ['sword'],
		_selected_weapon: null,
		_previousLocation: null,
		_currentLocation: null,
		_currentZone: {x:null, y:null},
		_nextLocation: null,
		_hitPoints: 5,
		_justTriggeredScene: false,
		_moveSpeed: 1,
		init: function() {
			this.requires('Actor, Fourway, Collision, FPS, Persist, Solid')
				.fourway(this._moveSpeed)
				.bind('EnterFrame', function(data) {
					this.checkDead();
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
						case Crafty.keys.U:
							Game.playerKeys.U = true;
							this.attack();
							break;
						case Crafty.keys['/']:
							Game.playerKeys['/'] = true;
							this.changeWeapon();
							break;
					}
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
						case Crafty.keys.U:
							Game.playerKeys.U = false;
							break;
					}
				})
				.onHit('Void', function(data) {
					var voidObject = data[0].obj;
					if (this.x === voidObject.x || this.y === voidObject.y) {
						if (this._justTriggeredScene === false) {
							this._justTriggeredScene = true;
							randomlyPopulateNextSection(this._direction, this._currentZone, Math.floor(this.at().x), Math.floor(this.at().y));
						}
					}

				}, function() {
					this._justTriggeredScene = false;
				})
				.onHit('SandDune', function(data) {
					this.fourway(this._moveSpeed/2);
				}, function () {
					this.fourway(this._moveSpeed);
				})
				.onHit('Scenery', function(data) {
					var hitObject = data[0].obj;
					if (hitObject.has('Scenery')) {
						if (this.steps > 0) {
							this.steps = 0;
						}
						this._speed = 0;
						if (this._movement) {
						  this.x -= this._movement.x;
						  this.y -= this._movement.y;
						}
					}
				})
				.onHit('Camel', function(data) {
					var hitObject = data[0].obj;
					if (Game.playerKeys.M && hitObject.has('Camel')) {
						this.mount(data);
					}
				})
				.bind('Moved', function(data) {
					console.log(this._z);
					this._previousLocation = data;
					this._currentLocation = {x:this.x, y:this.y};
					this._nextLocation = {x:this.x + this._movement.x, y:this.y + this._movement.y};
					this.checkZone();
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
		},

		checkZone: function () {
			var zone = Game.currentMap.zones;
			for (var x = 0; x < zone.x.length; x++) {
				if (Math.floor(this.at().x) > zone.x[x].xmin  && Math.floor(this.at().x) < zone.x[x].xmax) {
					this._currentZone.x = zone.x[x].xzone;
					break;
				}
			}
			for (var y = 0; y < zone.y.length; y++) {
				if (Math.floor(this.at().y) > zone.y[y].ymin  && Math.floor(this.at().y) < zone.y[y].ymax) {
					this._currentZone.y = zone.y[y].yzone;
					break;
				}
			}
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
			this.destroy();
		}
	})