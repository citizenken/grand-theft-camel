	Crafty.c('Player', {
		_direction: null,
		_weapons: ['sword'],
		_selected_weapon: null,
		_previousLocation: null,
		_currentLocation: null,
		_nextLocation: null,
		_hitPoints: 5,
		_justTriggeredScene: false,
	})

	Crafty.c('WhiteCharacter', {
		init: function() {
			this.requires('Actor, Fourway, Collision, FPS, SpriteAnimation, WiredHitBox, Persist, Solid, spr_white_player')
				.fourway(1)
				.reel('PlayerUp', 400, 0, 2, 3)
				.reel('PlayerDown', 400, 0, 0, 3)
				.reel('PlayerRight',400, 0, 3, 3)
				.reel('PlayerLeft', 400, 0, 1, 3)
				.reel('PlayerSwordRight',200, 0, 5, 5)
				.reel('PlayerSwordLeft', 200, 0, 4, 5)
				.reel('PlayerSwordDown', 200, 0, 6, 5)
				.bind('EnterFrame', function(data) {
					// console.log(data);
					this.checkDead();
				})
				.bind('KeyDown', function(e) {
					switch (e.key)
					{
						case Crafty.keys['M']:
							Game.playerKeys['M'] = true;
							break;
						case Crafty.keys['R']:
							this.fourway(4);
							break;
						case Crafty.keys['U']:
							Game.playerKeys['U'] = true;
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
						case Crafty.keys['M']:
							Game.playerKeys['M'] = false;
							break;
						case Crafty.keys['R']:
							this.fourway(1);
							break;
						case Crafty.keys['U']:
							Game.playerKeys['U'] = false;
							break;
					}
				})
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
				.onHit('Void', function(data) {
					var voidObject = data[0].obj;
					// console.log(Game.currentMap);
					if (this.x === voidObject.x || this.y === voidObject.y) {
						if (this._justTriggeredScene === false) {
							this._justTriggeredScene = true;
							console.log(voidObject._onEdge);

						}
					}

				}, function() {
					this._justTriggeredScene = false;
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
					if (Game.playerKeys.M && hitObject.has('Camel')) {
						this.mount(data);
					}
				})
				.bind('Moved', function(data) {
					this._previousLocation = data;
					this._currentLocation = {x:this.x, y:this.y};
					this._nextLocation = {x:this.x + this._movement.x, y:this.y + this._movement.y};

				})
				.bind('NewDirection', function(data) {
					if (data.y === -1 || data === 'UP') {
						this._direction = 'UP';
						this.animate('PlayerUp', -1);
					} else if (data.y === 1 || data === 'DOWN') {
						this._direction = 'DOWN';
						this.animate('PlayerDown', -1);
					} else if (data.x === 1 || data === 'RIGHT') {
						this._direction = 'RIGHT';
						this.animate('PlayerRight', -1);
					} else if (data.x === -1 || data === 'LEFT') {
						this._direction = 'LEFT';
						this.animate('PlayerLeft', -1);
					} else {
						this.pauseAnimation();
						this.reelPosition(1);
					}
				});
		},

		mount: function(data) {
			var camel = data[0].obj;
			camel.destroy();
			var leadCamel = Crafty.e('LeadCamel, Player');
			leadCamel.followers = Array();
			leadCamel.x = this.x;
			leadCamel.y = this.y;
			Game.player = leadCamel;
			Crafty.viewport.centerOn(Game.player)
			Crafty.viewport.follow(Game.player)
			switch (this._direction)
			{
				case 'UP':
						leadCamel.animate('LeadCamelMovingUp', -1)
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
		},

		attack: function() {
			var direction = this._direction;
			switch (this._direction)
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