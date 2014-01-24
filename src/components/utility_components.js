	// Camel is just an Actor with a certain color
	Crafty.c('TargetMovement', {
		init: function() {
			this.requires('Fourway, Delay')
				this.oldLocation;
				this._movement = {x:null, y:null};
				this._movementOld = {}
				this.bind('EnterFrame',	function() {
					if (this.targetLocation.x == null) {
						this.targetLocation = this.createRandomTarget()
					}

					var target = this.targetLocation
					var distanceToTarget = Crafty.math.distance(this.x, this.y, target.x, target.y);
					if (distanceToTarget == 0 || distanceToTarget == 1 || this._maxSteps == 0) {
						this.changeDirection();
					} else {
						this.trigger('Moved');
					}

				})
				.bind('Moved', function(data) {
					this.move();
				})
/*				.bind('KeyDown', function(e) {
					switch (e.key)
					{
						case Crafty.keys['L']:
							this.move();
							break;
					}
				})*/
		},

		move: function() {
/*			if (this.targetLocation.x == null) {
				this.targetLocation = this.createRandomTarget()
			}

			var target = this.targetLocation
			var distanceToTarget = Crafty.math.distance(this.x, this.y, target.x, target.y);
			if (distanceToTarget == 0 || distanceToTarget == 1 || this.attr.maxSteps == 0) {
				this.changeDirection();*/
			// } else {
				var target = this.targetLocation
				this.oldLocation = {x:this.x, y:this.y};

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

				this.x += Math.round((Math.cos(this._angle) * this._speed) * dirmodx);
				this.y += Math.round((Math.sin(this._angle) * this._speed) * dirmody);

				this._movement.x = this.x - this.oldLocation.x;
				this._movement.y = this.y - this.oldLocation.y;
				this._maxSteps -= 1;

				this.trigger('NewDirection', this._movement);
			// }

		},

        _round8: function(d)
        {
                return Math.round(d * 100000000.0) / 100000000.0;
        }

	});