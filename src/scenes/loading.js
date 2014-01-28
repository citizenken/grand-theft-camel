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
	'assets/actors/human_sword.png',
	], function(){
	// Once the images are loaded...

	// Define the PC's sprite to be the first sprite in the third row of the
	//  animation sprite map
	Crafty.sprite(32, 32, 'assets/actors/camel_32.png', {
		spr_camel:  [0, 2, 0, 0]
	  });

	Crafty.sprite(32, 32, 'assets/actors/player_character.png', {
		spr_white_player:  [1, 0, 0, 0]
	});

	Crafty.sprite(32, 32, 'assets/actors/blue_character.png', {
		spr_blue_player:  [1, 2, 0, 0]
	});

	Crafty.sprite(32, 40, 'assets/actors/lead_camel_white.png', {
		spr_lead_camel_white:  [0, 1, 0, 0],
	});

	// Now that our sprites are ready to draw, start the game
	Crafty.scene('Desert');
  })
});