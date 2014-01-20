	// This is the player-controlled character
	Crafty.c('LeadCamel', {
		currentDir: null,
		previousDir: null,
		followers: Array(),
		//keyMonitor: {'UP_ARROW': false,'DOWN_ARROW': false,'LEFT_ARROW': false,'RIGHT_ARROW': false},
		init: function() {
			this.requires('Actor, Fourway, Collision, SpriteAnimation, spr_lead_camel_white')
				.fourway(2)
				.attr({steps:0, direction:null})
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
				.onHit('Camel', function(data) {if (!data[0].obj._parent) {this.addFollower(data)}})
				.onHit('Solid', function(data) {this.stopMovement(data)}, this.resumeMovement)
				.reel('LeadCamelMovingUp', 400, 0, 2, 3)
				.reel('LeadCamelMovingRight', 400, 0, 1, 11)
				// .animate('PlayerMovingDown',  0, 2, 2)
				.reel('LeadCamelMovingLeft', 400, 0, 0, 11);
				var animationSpeed = 20;
				this.bind('NewDirection', function(data) {
						var followerArray = this.followers;
						if (data.y == -2) {
							this.attr.direction = 'UP';
							this.animate('LeadCamelMovingUp', -1)
							if (followerArray.length > 0) {
								for (var i = 0; i < followerArray.length; i++) {
									followerArray[i].animate('CamelMovingUp', -1)
								}
							}
						} else if (data.y == 2) {
							this.attr.direction = 'DOWN';
						} else if (data.x == 2) {
							this.attr.direction = 'RIGHT';
							this.animate('LeadCamelMovingRight', -1)
							if (followerArray.length > 0) {
								for (var i = 0; i < followerArray.length; i++) {
									followerArray[i].animate('CamelMovingRight', -1)
								}
							}
						} else if (data.x == -2) {
							this.attr.direction = 'LEFT';
							this.animate('LeadCamelMovingLeft', -1)
							if (followerArray.length > 0) {
								for (var i = 0; i < followerArray.length; i++) {
									followerArray[i].animate('CamelMovingLeft', -1)
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
			for (var i = 0; i < this.followers.length ; i++) {
				this.followers[i].addComponent('Solid');
				this.followers[i].addComponent('TargetMovement')
				// this.followerArray[i].pauseAnimation();
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

			follower.removeComponent('TargetMovement', false);
			follower.unbind('Moved');
			follower.removeComponent('Solid');
			follower.addComponent('Follower');
			this.attach(follower);
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