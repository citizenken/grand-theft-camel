	Crafty.c('Player', {
		init: function() {
			this.requires('Actor, Fourway, Collision, SpriteAnimation, Solid, spr_white_player')
				.fourway(1)
				.reel('PlayerUp', 400, 0, 2, 3)
				.reel('PlayerDown', 400, 0, 0, 3)
				.reel('PlayerRight',400, 0, 3, 3)
				.reel('PlayerLeft', 400, 0, 1, 3)
				.bind('KeyDown', function(e) {
					switch (e.key)
					{
						case Crafty.keys['M']:
							Game.playerKeys['M'] = true;
							break;
						case Crafty.keys['R']:
							this.fourway(2);
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
					}
				})
				.onHit('Solid', function(data) {
					this.stopMovement(data)
				})
				.bind('Moved', function() {
					Game.playerLocation = {x:this.x, y:this.y};
				})
				var animationSpeed = 16;
				this.bind('NewDirection', function(data) {
					if (data.y == -1) {
						this.attr.direction = 'UP';
						this.animate('PlayerUp', -1)
					} else if (data.y == 1) {
						this.attr.direction = 'DOWN';
						this.animate('PlayerDown', -1)
					} else if (data.x == 1) {
						this.attr.direction = 'RIGHT';
						this.animate('PlayerRight', -1)
					} else if (data.x == -1) {
						this.attr.direction = 'LEFT';
						this.animate('PlayerLeft', -1)
					} else {
						this.pauseAnimation()
					}
				});
		},

		// Stops the movement
		stopMovement: function(data) {
			if (this.steps > 0) {
				this.steps = 0;
			}
			this._speed = 0;
			if (this._movement) {
			  this.x -= this._movement.x;
			  this.y -= this._movement.y;
			}

			if (data[0].obj.has('Camel')) {
				this.mount(data);
			}
		},

		mount: function(data) {
		var camel = data[0].obj;
		if (Game.playerKeys['M']) {
			camel.destroy();
			var leadCamel = Crafty.e('LeadCamel');
			leadCamel.followers = Array();
			leadCamel.x = this.x;
			leadCamel.y = this.y;
			switch (this.attr.direction)
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
		}
		}
	})