Crafty.scene('Game', function() {
	// A 2D array to keep track of all occupied tiles
	this.occupied = new Array(Game.map_grid.width);
	for (var i = 0; i < Game.map_grid.width; i++) {
		this.occupied[i] = new Array(Game.map_grid.height);
		for (var y = 0; y < Game.map_grid.height; y++) {
			this.occupied[i][y] = false;
		}
	}
	//console.log(this.occupied);

	// Player character, placed at 5, 5 on our grid
	this.player = Crafty.e('Player').at(5, 5);
	// this.follower = Crafty.e('Camel');
	Game.player = this.player;
	this.occupied[this.player.at().x][this.player.at().y] = true;

	// Crafty.viewport.follow(this.player, -100, -100);
	// Crafty.viewport.bounds = {min:{x:0, y:0}, max:{x:10, y:10}};

	// Place a tree at every edge square on our grid of 16x16 tiles
	var i = 0;
	for (var x = 0; x < Game.map_grid.width; x++) {
	  for (var y = 0; y < Game.map_grid.height; y++) {
		var at_edge = x == 0 || x == Game.map_grid.width - 1 || y == 0 || y == Game.map_grid.height - 1;
			if (at_edge) {
				// Place a tree entity at the current tile
				Crafty.e('Tree').at(x,y);
				this.occupied[x][y] = true;				
				/*Math.random returns a number from 0-1. <.06 is used to reduce
				the number of bushes placed, as the random number has to be under that int.
				The higher the int, the more squares, as is it easier to be under that int.
				Placing it in the else if statement further reduces the number of bushes
				because it can't be in any
				edge squares. Adding an incriment puts a hard lock on the # of 
				bushes < 24, as 24 is the absolute most due to the grid width. One problem with this is if the int
				is big and the incriment is too, the squares will be stacked on the left side because it will hit the 
				incriment cap earlier*/
		} else if (Math.random() < 0.03 && x != 5 && y !=5) {
				// Place a bush entity at the current tile
				i++;
				Crafty.e('Bush').at(x,y);
				this.occupied[x][y] = true;
			}
		}
	}

	// Generate up to five villages on the map in random locations
	var max_followers = 5;
	this.camels = Array();
	var camelCount = 0;
	for (var x = 0; x < Game.map_grid.width; x++) {
		for (var y = 0; y < Game.map_grid.height; y++) {
			if (Math.random() < 0.02) {
				if (Crafty('Camel').length <= max_followers && !this.occupied[x][y]) {
					this.camels[camelCount] = Crafty.e('Camel').at(x, y);
					this.camels[camelCount].targetLocation = this.camels[camelCount].createRandomTarget();
				}
			}
		}
	}
	Game.camels = this.camels;
});

// Loading scene
// -------------
// Handles the loading of binary assets such as images and audio files
Crafty.scene('Loading', function(){
  // Draw some text for the player to see in case the file
  //  takes a noticeable amount of time to load
  Crafty.e('2D, DOM, Text')
	.text('Loading; please wait...')
	.attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() })
	.css($text_css);
 
  // Load our sprite map image
  Crafty.load([
	'assets/actors/camel.png',
	'assets/actors/player_character.png',
	'assets/actors/lead_camel_white.png',
	], function(){
	// Once the images are loaded...
 
	// Define the PC's sprite to be the first sprite in the third row of the
	//  animation sprite map
	Crafty.sprite(32, 32, 'assets/actors/camel_32.png', {
		spr_camel:  [0, 2, 0, 0]
	  });

	Crafty.sprite(32, 32, 'assets/actors/player_character.png', {
		spr_white_player:  [1, 0, 0, 0],
	});

	Crafty.sprite(32, 40, 'assets/actors/lead_camel_white.png', {
		spr_lead_camel_white:  [0, 1, 0, 0],
	});
 
	// Now that our sprites are ready to draw, start the game
	Crafty.scene('Game');
  })
});