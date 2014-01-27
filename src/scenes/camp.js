Crafty.scene('RandomCamp', function() {

	// redefine map_grid size for smaller scene
	var areaWidth = randomBetween(20, 30);
	var areaHeight = randomBetween(20, 30);
	var campWidth = areaWidth - 3;
	var campHeight = areaHeight - 3;
	Game.map_grid.width = areaWidth;
	Game.map_grid.height = areaHeight;
	Crafty.init(Game.width(), Game.height());

	// A 2D array to keep track of all occupied tiles
	this.occupied = new Array(campWidth);
	for (var i = 3; i < campWidth; i++) {
		this.occupied[i] = new Array(campHeight);
		for (var y = 3; y < campHeight; y++) {
			this.occupied[i][y] = false;
		}
	}

	var playerStartX1 = randomBetween(0, 3);
	var playerStartY1 = randomBetween(0, areaHeight);
	var playerStartX2 = randomBetween(0, areaWidth);
	var playerStartY2 = randomBetween(0, 3);
	var playerStartX3 = randomBetween(campWidth, areaWidth);
	var playerStartY3 = randomBetween(0, areaHeight);
	var playerStartX4 = randomBetween(campWidth, areaWidth);
	var playerStartY5 = randomBetween(campHeight, areaHeight);
	// Player character, placed at 5, 5 on our grid
	this.player = Crafty.e('WhiteCharacter, Player').at(playerStartX, playerStartY);
	// this.follower = Crafty.e('Camel');
	Game.player = this.player;
	// Crafty.viewport.centerOn(Game.player)
	// Crafty.viewport.follow(Game.player)

	// Crafty.viewport.follow(this.player, -100, -100);
	// Crafty.viewport.bounds = {min:{x:0, y:0}, max:{x:10, y:10}};

	// Place a tree at every edge square on our grid of 16x16 tiles

	var i = 0;
	var gatePlaced = false;
	for (var x = 3; x < campWidth; x++) {
	  for (var y = 3; y < campHeight; y++) {
		var at_edge = x == 3 || x == campWidth - 1 || y == 3 || y == campHeight - 1;
			if (at_edge) {
				i++;
				// Place a tree entity at the current tile
				var placeGateOdds = randomBetween(1, 25);
				if (placeGateOdds === 1 && !gatePlaced) {
					Crafty.e('Gate').at(x,y);
					gatePlaced = true
				} else {
					Crafty.e('Tree').at(x,y);
				}
				this.occupied[x][y] = true;
		} else if (Math.random() < 0.01 && x != 5 && y !=5) {
				// Place a bush entity at the current tile
				i++;
				Crafty.e('Bush').at(x,y);
				this.occupied[x][y] = true;
			}
		}
	}

	if (!gatePlaced) {
		Crafty.e('Gate').at(6,3);
		gatePlaced = true
	}

	// Generate up to 6 camels on the map in random locations
	var max_camels = randomBetween(0, 5);
	this.camels = Array();
	var camelCount = 0;
	for (var x = 3; x < campWidth; x++) {
		for (var y = 3; y < campHeight; y++) {
			if (Math.random() < 0.02) {
				if (Crafty('Camel').length <= max_camels && !this.occupied[x][y]) {
					this.camels[camelCount] = Crafty.e('Camel').at(x, y);
					this.camels[camelCount].targetLocation = this.camels[camelCount].createRandomTarget();
				}
			}
		}
	}

//create enemies
	for (var i = 0; i < 10;) {
		var enemy_x = randomBetween(3, campWidth);
		var enemy_y = randomBetween(3, campHeight);
		if (!this.occupied[enemy_x][enemy_y]) {
			this.enemy = Crafty.e('Enemy').at(enemy_x, enemy_y);
			Game.enemies.push(this.enemy);
			break;
		} else {
			i++
		}
	}

	Game.enemy = this.enemy;

	Game.camels = this.camels;
});
