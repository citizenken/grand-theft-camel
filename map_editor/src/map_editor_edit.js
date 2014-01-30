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
	this._map = MapEditor.mapToLoad;
	initiateMap(this._map);
	$('#palette').show();
});
