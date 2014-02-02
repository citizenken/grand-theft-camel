// Loading scene
// -------------
// Handles the loading of binary assets such as images and audio files
Crafty.scene('EditMap', function(){
	this.unbind('KeyDown');
	this.bind('KeyDown', function(e) {
			switch (e.key) {
				case Crafty.keys.P:
					if (!MapEditor.paintMode && MapEditor.selectedEntity !== 'Player') {
						if (MapEditor.eraseMode) {
							MapEditor.eraseMode = false;
							$('#erase-mode').hide();
						}
						MapEditor.paintMode = true;
						$('#brush').addClass('selectedTool');
						$('#paint-mode').toggle();
					} else if (Crafty.keys.P && !MapEditor.paintMode && MapEditor.selectedEntity === 'Player') {
						window.alert('Paint mode is disabled for the Player entity. Only one is allowed per map');
					} else {
						MapEditor.paintMode = false;
						$('#brush').removeClass('selectedTool');
						$('#paint-mode').toggle();
					}
					break;
				case Crafty.keys.E:
					if (!MapEditor.eraseMode) {
						if (MapEditor.paintMode) {
							MapEditor.paintMode = false;
							$('#paint-mode').hide();
						}
						MapEditor.eraseMode = true;
						$('#erase-mode').toggle();
					} else {
						MapEditor.eraseMode = false;
						$('#erase-mode').toggle();
					}
					break;
				case Crafty.keys.F:
					if (!MapEditor.fillMode) {
						if (MapEditor.paintMode) {
							MapEditor.paintMode = false;
							$('#paint-mode').hide();
						}
						if (MapEditor.eraseMode) {
							MapEditor.eraseMode = false;
							$('#erase-mode').hide();
						}
						MapEditor.fillMode = true;
						$('#fill-mode').toggle();
					} else {
						MapEditor.fillMode = false;
						$('#fill-mode').toggle();
					}
					break;
			}
		});
	this._map = MapEditor.mapToLoad;
	initiateMap(this._map);
	$('#palette').show();
});
