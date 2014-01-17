	// Camel is just an Actor with a certain color
	Crafty.c('RandomMovement', {
		init: function() {
			this.requires('Fourway, Delay')
				._speed = 1;
				this.bind('EnterFrame',	function() {
					this.trigger('Moved')
				})
				/*this.bind('KeyDown', function(e) {
					switch (e.key)
					{
						case Crafty.keys['L']:
							this.move();
							break;
					}
				})*/
				.bind('Moved', function() {
					this.move();
				})
		},

		move: function() {
			var target = this.targetLocation
			var distanceToTarget = Crafty.math.distance(this.x, this.y, target.x, target.y);
			if (distanceToTarget == 0 || distanceToTarget == 1) {
				this.targetLocation = this.createRandomTarget();
			} else {
				this.diffx = this.x - target.x;
				this.diffy = this.y - target.y;

				this._angle = Math.atan(this.diffy / this.diffx);
				var dirmodx;
				var dirmody;
				//positive means this is to the right of target
				if (this.diffx > 0) {
					dirmodx = -1;
				} else {
					dirmodx = 1;
				}
				if (this.diffy > 0) {
					dirmody = -1;
				} else {
					dirmody = 1;
				}
				this.x += Math.round((Math.cos(this._angle) * this._speed)) * dirmodx;
				this.y += Math.round((Math.sin(this._angle) * this._speed)) * dirmody;

				this.animateCamel(this.diffx, this.diffy);
			}

		},

		createRandomTarget: function() {
            var x = Math.round(Crafty.math.randomNumber(32, Game.map_grid.width * 37));
            var y = Math.round(Crafty.math.randomNumber(32, Game.map_grid.height * 16));

            return {x: x, y: y};
        }

	});