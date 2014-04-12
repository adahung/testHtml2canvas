YUI().use('node', 'json-stringify', function(Y) {
	Y.one('#snapshot').on('click', function(e) {
		snapshot();
	});

	function snapshot() {
		html2canvas(document.body, {
			onrendered: function(canvas) {
		    	afterSnapshot(canvas);
			}
		});
	}

	function afterSnapshot(canvas) {
		var canvasObj = {},
			overlay;
		canvasObj.dataUri = canvas.toDataURL();
		canvasObj.height = canvas.getAttribute('height');
		canvasObj.width = canvas.getAttribute('width');

		// show overlay with the snapshot
		overlay = Y.one('#snapshot-overlay-wrapper');
		overlay.one('img').setAttribute('src', canvasObj.dataUri);
		overlay.setStyle('display', 'block');
	}

});
