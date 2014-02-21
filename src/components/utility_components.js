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

// The Grid component allows an element to be located
//  on a grid of tiles
Crafty.c('Grid', {
	_paused: false,
init: function() {
	this.bind('KeyDown', function(e) {
		if (!Game.keyPressed) {
			Game.keyPressed = true;
			if (e.key == Crafty.keys['ESC']) {
				Crafty.pause();
				console.log(Crafty.isPaused())
			}
		}
	})
	this.bind('KeyUp', function(e) {
		if (Game.keyPressed) {
			Game.keyPressed = false;
		/*if (e.key == Crafty.keys['ESC']) {
			Crafty.pause(true);
			this._paused = true;
			console.log(Crafty.isPaused())
		} else if (e.key == Crafty.keys['ESC']) {
			Crafty.pause(false);
			this._paused = false;
			console.log(Crafty.isPaused())
		}*/
		}
	})

	// console.log(Crafty.isPaused());
	this.bind('Pause', function(e) {
		if (Crafty('PauseBackground').length === 0) {
			Crafty.e('PauseBackground');
		}
	})
	this.bind('Unpause', function() {
		if (Crafty('PauseBackground').length === 1) {
			Crafty('PauseBackground').destroy();
		}
	})
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

Crafty.c('PauseBackground', {
	init: function() {
		this.requires('2D, DOM, Grid, Color');
		this.attr({x: 0, y: 0, w:Game.width(), h:Game.height()})
		.color('rgba(0,0,0,0.3)');
	},
});

Crafty.c('PauseMenu', {
	init: function() {
		this.requires('2D, DOM, Color');
		this.attr;
		this.color('black');
	},
});

Crafty.c('TextBox', {
	init: function() {
		this.requires('2D, DOM, Color');
		this.attr({w:300, h:200});
		this.color('white');
		this.getLocation()
	},

	getLocation: function() {
		var dirmodx;
		var dirmody;
		var viewportX = Crafty.viewport.x;
		var viewportY = Crafty.viewport.y;
		if (Crafty.viewport.x < -1) {
			dirmodx = -1;
		} else if (Crafty.viewport.x === 0) {
			dirmodx = 0
		} else {
			dirmodx = 1;
		}

		if (Crafty.viewport.y < -1) {
			dirmody = -1;
		} else if (Crafty.viewport.y === 0) {
			dirmody = 0
		} else {
			dirmody = 1;
		}
		console.log(Crafty.viewport.y, Crafty.viewport.y + (Crafty.viewport.height*dirmody))
		this.attr({x:viewportX + (50*dirmodx), y:viewportY + (50*dirmody)})
		console.log(this.x, this.y)
	}
});

Crafty.c('Void', {
	init: function() {
		this.requires('Actor');
	}
})

Crafty.c('Actor', {
	init: function() {
	this.requires('2D, Canvas, Grid')
	},
		checkDead: function() {
			if (this._hitPoints === 0) {
				this.destroy();
			}
			return false;
		}
});

Crafty.c('EmptySpace', {
	init: function () {
		this.requires('Actor')
	}
});