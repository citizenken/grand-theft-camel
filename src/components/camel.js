	// Camel is just an Actor with a certain color
	Crafty.c('Camel', {
		init: function() {
			this.requires('Solid, Actor, Fourway, SpriteAnimation, Collision, spr_camel, RandomMovement')
				.attr({steps:0, direction:null, maxSteps:0, targetLocation:{x:400, y:400}})
				.reel('CamelMovingUp', 400, 0, 9, 3)
				.reel('CamelMovingRight', 400, 0, 2, 11)
				.reel('CamelMovingDown',  400, 0, 9, 3)
				.reel('CamelMovingLeft', 400, 0, 8, 11)
				.onHit('Scenery', function() {
					this.stopMovement();
				this._speed = 2;
				})
		},

		animateCamel: function(diffx, diffy) {
			// if (diffx > diffy) {
				if (diffx > 0) {
					console.log('this')
					this.animate('CamelMovingLeft', -1);
				} else {
					console.log('that')
					this.animate('CamelMovingRight', -1);
				}
			// } else {
				/*if (diffy > 0) {
					this.animate('CamelMovingUp', -1);
				} else {
					this.animate('CamelMovingDown', -1);
				}*/
			// }
		},

		stopMovement: function() {
			this._speed = 0;
			// this.removeComponent('RandomMovement');
			//this.unbind('EnterFrame');
			// this.changeDirection();
		},

		changeDirection: function() {
			this.targetLocation = this.createRandomTarget();
			// console.log(th?is._speed)
			var delayValue = 1000;
			this.timeout(function() {
				this._speed = 2;
				this.toggleComponent('RandomMovement');
				this.trigger('Moved');
			}, 1000);
		}

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