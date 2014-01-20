	// Camel is just an Actor with a certain color
	Crafty.c('Camel', {
		init: function() {
			this.requires('Solid, Actor, Fourway, SpriteAnimation, Collision, spr_camel, TargetMovement')
				.attr({steps:0, direction:null, maxSteps:0, targetLocation:{x:0, y:0}});
				this.attr.maxSteps = Math.round(Crafty.math.randomNumber(50, 100));
				this._speed = 1;
				this._oldMovementx;
				this._oldMovementy;
				this.reel('CamelMovingUp', 400, 0, 9, 3)
				.reel('CamelMovingRight', 400, 0, 2, 11)
				// .reel('CamelMovingDown',  400, 0, 9, 3)
				.reel('CamelMovingLeft', 400, 0, 8, 11)
				.onHit('Scenery', function(data) {
					if (this.has('TargetMovement')) {
						this.changeDirection();
					} else if (this.has('Follower')) {
						this.moveOffScenery(data);
					}
				})
				.bind('NewDirection', function(movement) {
					// console.log('old x', this._oldMovementx, 'old y', this._oldMovementy, 'new', this._movement)
					// console.log(movement.x != this._oldMovementx || movement.y != this._oldMovementy)
					if (movement.x != this._oldMovementx || movement.y != this._oldMovementy) {
						if (movement.y == -1) {
							this.animate('CamelMovingUp', -1);
							this._oldMovementx = movement.x;
							this._oldMovementy = movement.y;
						} else if (movement.y == 1) {
							console.log('move south');
							this._oldMovementx = movement.x;
							this._oldMovementy = movement.y;
						} else if (movement.x == 1) {
							this.animate('CamelMovingRight', -1)
							this._oldMovementx = movement.x;
							this._oldMovementy = movement.y;
						} else if (movement.x == -1 && !this.isPlaying('CamelMovingUp')) {
							this.animate('CamelMovingLeft', -1)
							this._oldMovementx = movement.x;
							this._oldMovementy = movement.y;
						} else {
							this.pauseAnimation()
						}
					}	
				})
		},

		generateMaxSteps: function() {
			this.attr.maxSteps = Math.round(Crafty.math.randomNumber(250, 500));
		},

		animateEntity: function(directionData) {
			//console.log(directionData);
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
				console.log('5000 later')
				this.trigger('Moved')
			}, 5000);
		},

		createRandomTarget: function() {
            var x = Math.round(Crafty.math.randomNumber(32, Game.map_grid.width * 35));
            var y = Math.round(Crafty.math.randomNumber(32, Game.map_grid.height * 14));

            return {x: x, y: y};
        },

	});

	//Follower
	Crafty.c('Follower', {
		colors: Array('blue','yellow','red','orange','rgb(0,0,0)','rgb(255,255,255)'),
		init: function() {
			this.requires('Actor, Collision, Camel')
			 	.attr({previousLocation:{'x':0,'y':0}})
				.onHit('Scenery', function(data) {
					if (this._parent) {
						this.moveOffScenery(data)
					}})
			},

			moveOffScenery: function(data) {
				var LeadCamel = this._parent;
				this.z = LeadCamel.z - 5;
				var followersIndex = LeadCamel.followers.indexOf(this);
				switch (LeadCamel.attr.direction)
					{
						case 'UP':
								this.x = LeadCamel.x;
								this.y = data[0].obj.y - Game.map_grid.tile.width;
								if (LeadCamel.followers.length > 1) {
									this.moveSubsequentFollowers(followersIndex, this.x, this.y);
								}
							break;
						case 'DOWN':
								this.x = LeadCamel.x;
								this.y = data[0].obj.y + Game.map_grid.tile.width;
								if (LeadCamel.followers.length > 1) {
									this.moveSubsequentFollowers(followersIndex, this.x, this.y);
								}
							break;
						case 'LEFT':
								this.x = data[0].obj.x - Game.map_grid.tile.width;
								this.y = LeadCamel.y;
								if (LeadCamel.followers.length > 1) {
									this.moveSubsequentFollowers(followersIndex, this.x, this.y);
								}
							break;
						case 'RIGHT':
								this.x = data[0].obj.x + Game.map_grid.tile.width;// Math.abs(data[0].overlap);
								this.y = LeadCamel.y;
								if (LeadCamel.followers.length > 1) {
									this.moveSubsequentFollowers(followersIndex, this.x, this.y);
								}
							break;
					}
			},

			moveSubsequentFollowers: function(followersIndex, x, y) {
				var LeadCamel = this._parent;
				for (var i = followersIndex + 1; i < LeadCamel.followers.length; i++) {
					LeadCamel.followers[i].z = LeadCamel.followers[i - 1].z;
					LeadCamel.followers[i].x = x;
					LeadCamel.followers[i].y = y;
				}
			},

			// Stops the movement
			stopParent: function() {
			//var parent = LeadCamel
			this.z = LeadCamel.z-50;
			this.x = LeadCamel.x;
			this.y = LeadCamel.y;
			}

	});