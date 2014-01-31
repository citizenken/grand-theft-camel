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
						$('#paint-mode').toggle();
					} else if (Crafty.keys.P && !MapEditor.paintMode && MapEditor.selectedEntity === 'Player') {
						window.alert('Paint mode is disabled for the Player entity. Only one is allowed per map');
					} else {
						MapEditor.paintMode = false;
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
				case Crafty.keys.B:
					if (!MapEditor.bucketMode) {
						if (MapEditor.paintMode) {
							MapEditor.paintMode = false;
							$('#paint-mode').hide();
						}
						if (MapEditor.eraseMode) {
							MapEditor.eraseMode = false;
							$('#erase-mode').hide();
						}
						MapEditor.bucketMode = true;
						MapEditor.selectedEntity = 'FillBucket';
						$('#bucket-mode').toggle();
					} else {
						MapEditor.bucketMode = false;
						MapEditor.selectedEntity = null;
						$('#bucket-mode').toggle();
					}
					break;
				case Crafty.keys.F:
				console.log('blah');
					if (MapEditor.selectedEntity !== 'FillBucket' || MapEditor.selectedEntity !== 'Player') {
						var i = 0;
						Crafty('FillBucket').each(function() {
							this.toggleComponent(MapEditor.selectedEntity);
							this.removeComponent('FillBucket');
							i++;
						})
						window.alert(i + ' ' + MapEditor.selectedEntity + 's added');
					} else {
						window.alert('Please select an entity before filling');
					}
					break;
			}
		});
	this._map = MapEditor.mapToLoad;
	initiateMap(this._map);
	$('#palette').show();
});
