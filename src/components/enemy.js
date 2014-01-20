	Crafty.c('Enemy', {
		init: function() {
			this.requires('Actor, Fourway, Collision, SpriteAnimation, Solid, spr_white_player, TargetMovement')
				.attr({steps:0, direction:null, maxSteps:0, targetLocation: {x:null, y:null}});
				this._speed = 1;
				this.bind('EnterFrame', function() {
					// this.targetLocation = {x:Crafty.e('Player'), y:Crafty.e('Player')};
					this.trigger('Moved');
				})
				.reel('EnemyUp', 400, 0, 2, 3)
				.reel('EnemyDown', 400, 0, 0, 3)
				.reel('EnemyRight',400, 0, 3, 3)
				.reel('EnemyLeft', 400, 0, 1, 3)
				.bind('NewDirection', function(movement) {
					// console.log('old x', this._oldMovementx, 'old y', this._oldMovementy, 'new', this._movement)
					// console.log(movement.x != this._oldMovementx || movement.y != this._oldMovementy)
					if (movement.x != this._oldMovementx || movement.y != this._oldMovementy) {
						if (movement.y == -1) {
							this.animate('EnemyUp', -1);
							this._oldMovementx = movement.x;
							this._oldMovementy = movement.y;
						} else if (movement.y == 1) {
							this.animate('EnemyDown', -1);
							this._oldMovementx = movement.x;
							this._oldMovementy = movement.y;
						} else if (movement.x == 1) {
							this.animate('EnemyRight', -1);
							this._oldMovementx = movement.x;
							this._oldMovementy = movement.y;
						} else if (movement.x == -1 && !this.isPlaying('EnemyUp')) {
							this.animate('EnemyLeft', -1)
							this._oldMovementx = movement.x;
							this._oldMovementy = movement.y;
						} else {
							this.pauseAnimation()
						}
					}	
				})
				.onHit('Scenery', function(data) {
					if (this.has('TargetMovement')) {
						this.changeDirection();
					}
				})
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

		generateMaxSteps: function() {
			this.attr.maxSteps = Math.round(Crafty.math.randomNumber(50, 150));
		},

		changeDirection: function() {
			this.targetLocation = this.createRandomTarget();
			this.generateMaxSteps();
			if (this._movement) {
			  this.x -= this._movement.x;
			  this.y -= this._movement.y;
			}
			var delayValue = Math.round(Crafty.math.randomNumber(1000, 2000));
			this.timeout;(function() {
				this.trigger('Moved')
			}, 5000);
		},

		createRandomTarget: function() {
			var negPos = [-1, 1];
			// var xmin = this.x + 25 * negPos[Math.round(Crafty.math.randomNumber(1,2))]
			// var xmin = this.x + 25 * negPos[Math.round(Crafty.math.randomNumber(1,2))]
			// var ymin = this.y + 25 * negPos[Math.round(Crafty.math.randomNumber(1,2))]
            var x = Math.round(Crafty.math.randomNumber(this.x - 200, this.x + 200));
            var y = Math.round(Crafty.math.randomNumber(this.y - 200, this.y + 200));

            return {x: x, y: y};
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