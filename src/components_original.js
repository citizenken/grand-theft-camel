	// The Grid component allows an element to be located
	//  on a grid of tiles
	Crafty.c('Grid', {
	init: function() {
		this.attr({
			w: Game.map_grid.tile.width,
			h: Game.map_grid.tile.height
		})
	},

	// Locate this entity at the given position on the grid
	at: function(x, y) {
	if (x === undefined && y === undefined) {
	  return { x: this.x/Game.map_grid.tile.width, y: this.y/Game.map_grid.tile.height }
	} else {
	  this.attr({ x: x * Game.map_grid.tile.width, y: y * Game.map_grid.tile.height });
	  return this;
	}
	}
	});

	// An "Actor" is an entity that is drawn in 2D on canvas
	//  via our logical coordinate grid
	Crafty.c('Actor', {
	init: function() {
	this.requires('2D, Canvas, Grid');
	},
	});

	Crafty.c('Scenery', {
	init: function() {
	this.requires('Actor, Color, Solid, Collision')
	  .color('rgb(20, 125, 40)');
	},
	});

	// A Tree is just an Actor with a certain color
	Crafty.c('Tree', {
	init: function() {
	this.requires('Scenery')
	  .color('rgb(20, 125, 40)');
	},
	});

	// A Bush is just an Actor with a certain color
	Crafty.c('Bush', {
	init: function() {
	this.requires('Scenery')
	  .color('rgb(20, 185, 40)');
	},
	});

	// Camel is just an Actor with a certain color
	Crafty.c('Camel', {
	init: function() {
	this.requires('Fourway, SpriteAnimation, spr_camel')

		//.color('rgb(20, 75, 40)')
		.reel('PlayerMovingUp', 400, 0, 9, 3)
		.reel('PlayerMovingRight', 400, 0, 2, 11)
		// .reel('PlayerMovingDown',  0, 2, 2)
		.reel('PlayerMovingLeft', 400, 0, 8, 11);
		var animationSpeed = 10;
	},
	});

	Crafty.c('Player', {
		init: function() {
			this.requires('Actor, Fourway, Collision, SpriteAnimation, spr_white_player')
				.fourway(2)
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
							this.attack();
							break;
					}
				})
				.bind('KeyUp', function(e) {
					switch (e.key)
					{
						case Crafty.keys['M']:
							Game.playerKeys['M'] = false;
							break;
					}
				})
				.onHit('Solid', function(data) {this.stopMovement(data)});
				var animationSpeed = 16;
				this.bind('NewDirection', function(data) {
					if (data.y == -2) {
						this.attr.direction = 'UP';
						this.animate('PlayerUp', -1)
					} else if (data.y == 2) {
						this.attr.direction = 'DOWN';
						this.animate('PlayerDown', -1)
					} else if (data.x == 2) {
						this.attr.direction = 'RIGHT';
						this.animate('PlayerRight', -1)
					} else if (data.x == -2) {
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
		// debugger
		if (Game.playerKeys['M']) {
			camel.destroy();
			var leadCamel = Crafty.e('LeadCamel');
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
				console.log('test')
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

	// This is the player-controlled character
	Crafty.c('LeadCamel', {
		currentDir: null,
		previousDir: null,
		followers: Array(),
		//keyMonitor: {'UP_ARROW': false,'DOWN_ARROW': false,'LEFT_ARROW': false,'RIGHT_ARROW': false},
		init: function() {
			this.requires('Actor, Fourway, Collision, SpriteAnimation, spr_lead_camel_white')
				.fourway(3)
				.attr({followers:this.followers, steps:0, direction:null})
				.bind('Moved', function(oldLocation) {
					this.steps++
					if ((this.steps % (Game.map_grid.tile.width/2) === 0) && this.followers.length > 0) {
						this.arrangeFollowers(oldLocation)
					}
				})
				.bind('KeyDown', function(e) {
					switch (e.key)
					{
						case Crafty.keys['M']:
							Game.playerKeys['M'] = true;
							this.dismount();
							break;
						case Crafty.keys['R']:
							this.attack();
							break;
					}
				})
				.bind('KeyUp', function(e) {
					switch (e.key)
					{
						case Crafty.keys['M']:
							Game.playerKeys['M'] = false;
							break;
					}
				})				
				.onHit('Follower', function(data) {if (!data[0].obj._parent) {this.addFollower(data)}})
				.onHit('Solid', function(data) {this.stopMovement(data)}, this.resumeMovement)
				.reel('LeadCamelMovingUp', 400, 0, 2, 3)
				.reel('LeadCamelMovingRight', 400, 0, 1, 11)
				// .animate('PlayerMovingDown',  0, 2, 2)
				.reel('LeadCamelMovingLeft', 400, 0, 0, 11);
				var animationSpeed = 20;
				this.bind('NewDirection', function(data) {
						var followerArray = this.followers;
						if (data.y == -3) {
							this.attr.direction = 'UP';
							this.animate('LeadCamelMovingUp', -1)
							if (followerArray.length > 0) {
								for (var i = 0; i < followerArray.length; i++) {
									followerArray[i].animate('PlayerMovingUp', -1)
								}
							}
						} else if (data.y == 3) {
							this.attr.direction = 'DOWN';
						} else if (data.x == 3) {
							this.attr.direction = 'RIGHT';
							this.animate('LeadCamelMovingRight', -1)
							if (followerArray.length > 0) {
								for (var i = 0; i < followerArray.length; i++) {
									followerArray[i].animate('PlayerMovingRight', -1)
								}
							}
						} else if (data.x == -3) {
							this.attr.direction = 'LEFT';
							this.animate('LeadCamelMovingLeft', -1)
							if (followerArray.length > 0) {
								for (var i = 0; i < followerArray.length; i++) {
									followerArray[i].animate('PlayerMovingLeft', -1)
								}
							}
						} else {
							this.pauseAnimation();
							if (followerArray.length > 0) {
								for (var i = 0; i < followerArray.length; i++) {
									followerArray[i].pauseAnimation();
								}
							}
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
		},

		dismount: function() {
			for (var i = 0; 0 < this.followers.length; i++) {
				debugger
				console.log(this.followers[i])
				this.followers[i].__c.Solid = true;
			}
			this.detach();
			this.followers = Array();
			var newPlayer = Crafty.e('Player');
			switch (this.attr.direction)
			{
				case 'UP':
					newPlayer.x = this.x + Game.map_grid.tile.width;
					newPlayer.y = this.y;
					break;
				case 'DOWN':/* || Crafty.keys['S']):*/
					newPlayer.x = this.x - Game.map_grid.tile.width;
					newPlayer.y = this.y;
					break;
				case 'LEFT':/* || Crafty.keys['A']):*/
					newPlayer.x = this.x;
					newPlayer.y = this.y + Game.map_grid.tile.width;
					break;
				case 'RIGHT':/* || Crafty.keys['D']):*/
					newPlayer.x = this.x;
					newPlayer.y = this.y + Game.map_grid.tile.width;
					break;
			}			
			var newCamel = Crafty.e('Follower');
			newCamel.x = this.x;
			newCamel.y = this.y;
			this.destroy();

		},

		addFollower: function(data) {
			var follower = data[0].obj;
			var followerArray = this.followers;

			follower.removeComponent('Solid');
			follower.addComponent('Camel, Multiway');
			if (followerArray.length > 0) {
				followerArray[followerArray.length - 1].attach(follower);
			} else {
				this.attach(follower);
			}
			this.followers.push(follower);
			this.trigger('NewDirection', this._movement);
		},

		arrangeFollowers: function(oldLocation) {
			var followerArray = this.followers;

			if (followerArray.length > 0) {
				for (var i = 0; i < followerArray.length; i++) {
					followerArray[i].setName('follower ' + i);
					followerArray[i].previousLocation.x = followerArray[i].x + this._movement.x;
					followerArray[i].previousLocation.y = followerArray[i].y + this._movement.y + 8;


					var x = (i == 0) ? oldLocation.x: followerArray[i - 1].previousLocation.x;
					var y = (i == 0) ? oldLocation.y: followerArray[i - 1].previousLocation.y;
					var followerExtraSpace = (i == 0) ? 0 : 4;

					switch (this.attr.direction)
					{
						case 'UP':
								followerArray[i].x = x;
								followerArray[i].y = y + Game.map_grid.tile.width + followerExtraSpace;
								//compensate for leader's extra height
								if (i == 0) {
									followerArray[i].y = followerArray[i].y + 8;
								} else {
									followerArray[i].y = followerArray[i].y - 8;
								}
							break;
						case 'DOWN':/* || Crafty.keys['S']):*/
								followerArray[i].x = x;
								followerArray[i].y = y - Game.map_grid.tile.width - followerExtraSpace;
							break;
						case 'LEFT':/* || Crafty.keys['A']):*/
								followerArray[i].x = x + Game.map_grid.tile.width + followerExtraSpace;
								followerArray[i].y = y
								//compensate for leader's extra height
								if (i == 0) {
									followerArray[i].y = followerArray[i].y + 8;
								} else {
									followerArray[i].y = followerArray[i].y - 8;
								}
							break;
						case 'RIGHT':/* || Crafty.keys['D']):*/
								followerArray[i].x = x - Game.map_grid.tile.width - followerExtraSpace;
								followerArray[i].y = y;
								//compensate for leader's extra height
								if (i == 0) {
									followerArray[i].y = followerArray[i].y + 8;
								} else {
									followerArray[i].y = followerArray[i].y - 8;
								}
							break;
					}
				}
			}
		}

	});

	//Follower
	Crafty.c('Follower', {
		colors: Array('blue','yellow','red','orange','rgb(0,0,0)','rgb(255,255,255)'),
		init: function() {
			this.requires('Solid, Actor, Collision, Camel')
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