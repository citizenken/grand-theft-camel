	// Camel is just an Actor with a certain color
	Crafty.c('Camel', {
		init: function() {
			this.requires('Solid, Actor, Fourway, SpriteAnimation, Collision, spr_camel')
				.attr({steps:0, direction:null, maxSteps:0, targetLocation:{x:400, y:400}})
				.reel('PlayerMovingUp', 400, 0, 9, 3)
				.reel('PlayerMovingRight', 400, 0, 2, 11)
				// .reel('PlayerMovingDown',  0, 2, 2)
				.reel('PlayerMovingLeft', 400, 0, 8, 11)
				// var camelDir = this.attr.direction
				// .move('e', 1)
				.bind('EnterFrame', function() {
					this.moveCamel();
				})
				.onHit('Scenery', function() {
					this.stopMovement();
				})
		},

		moveCamel: function() {
			var target = this.targetLocation
			target.x = 25;
			target.y = 25;
			var distanceToTarget = Crafty.math.distance(this.x, this.y, target.x, target.y);
			if (Crafty.math.distance() == 0) {
				console.log(this._entityName)
			}

			this.diffx = this.x - target.x;
			console.log(this.diffx)
			this.diffy = this.y - target.y;

			this._angle = (180 / Math.PI) * Math.atan(this.diffy / this.diffx);
			this._angle = (this.diffX < 0 ? 180 : 0) + this._angle;

			this.x += Math.round((Math.cos(this._angle * (Math.PI / 180)) * 2));
			this.y += Math.round((Math.sin(this._angle * (Math.PI / 180)) * 2));

		},

		createRandomTarget: function() {
            var x = Math.round(Crafty.math.randomNumber(1, 39));
            var y = Math.round(Crafty.math.randomNumber(1, 39));
            // console.log(x, y)
            
            return {x: x, y: y};
        },

		stopMovement: function() {
			this._speed = 0;
			if (this._movement) {
			  this.x -= this._movement.x;
			  this.y -= this._movement.y;
			}
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