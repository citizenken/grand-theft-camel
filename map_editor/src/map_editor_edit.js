// Loading scene
// -------------
// Handles the loading of binary assets such as images and audio files
Crafty.scene('EditMap', function(){
	this.bind('KeyDown', function(e) {
			switch (e.key) {
				case Crafty.keys.P:
					if (e.key === Crafty.keys.P && !MapEditor.paintMode) {
						MapEditor.paintMode = true;
						$('#paint-mode').toggle();
					} else {
						MapEditor.paintMode = false;
						$('#paint-mode').toggle();
					}
					break;
				case Crafty.keys.M:
					printMap();
					break;
			}
		});
	var width = MapEditor.map_grid.width;
	var height = MapEditor.map_grid.height;
	var entityNumber = 0;
	var map = [];
	for (var y = 0; y <= height ; y++) {
		map[y] = [];
		for (var x = 0; x <= width; x++) {
			map[y][x] = Crafty.e('EmptySpace').at(x,y);
			// emptySpace._entityName = 'EmptySpace_' + entityNumber;
		}
	}
});
