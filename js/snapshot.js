//YUI().use('node', 'json-stringify', function(Y) {
Y.use('node', 'event', 'json-stringify', 'json-parse', function(Y) {

	Y.one('#snapshot').on('click', function(e) {
		console.log('snapshot');
		e.halt();
		snapshot();
	});

	function snapshot() {
		html2canvas(document.body, {
			onrendered: function(canvas) {
				console.log('rendered');
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
		overlay.one('#snapshot-info-img img').setAttribute('src', canvasObj.dataUri);

		populateSnapshotInfo();
		overlay.setStyle('display', 'block');

		// bind overlay events
		bindOverlayEvents();
	}

	function populateSnapshotInfo() {
		var snapshotInfo = info;
		
		// backyard id
		var usr = getBackyardidFromLocalStorage();
		setInfo('backyardid', usr);

		// query
		setInfo('query', snapshotInfo.query);

		// location
		setInfo('location', snapshotInfo.loc);
	}

	function setInfo(field, data) {
		var id;

		switch(field) {
			case 'backyardid':
				id = '#snapshot-info-usr';
				break;
			case 'description':
				id = '#snapshot-info-desc';
				break;
			case 'query':
				id = '#snapshot-info-qry';
				break;
			case 'location':
				id = '#snapshot-info-loc';
				break;
		}

		if (id == '#snapshot-info-loc') {
			data = Y.JSON.stringify(data);
		}
		
		if (typeof id !== 'undefined') {
			Y.one(id).one('.value').set('text', data);
		}
	}

	function bindOverlayEvents() {
		// bind edit button click events
		Y.all('.snapshot-info-item').each(function(item) {
			if (!item.one('.edit'))
				return;
			
			item.one('.edit').on('click', function(e) {
				console.log('edit click');
				var editBtn = e.currentTarget,
					targetItem = editBtn.ancestor('.snapshot-info-item'),
					editboxClass = 'editbox',
					targetNextItem = targetItem.next();
					
				if (!targetNextItem.hasClass(editboxClass)) {
					editBtn.set('text', 'Done');

					// render edit box
					var editbox = Y.Node.create('<div class="snapshot-info-item ' + editboxClass + '"><textarea></textarea></div>');
					editbox.one('textarea').set('value', targetItem.one('.value').get('text'));
					targetItem.insert(editbox, 'after');
				}
				else {
					editBtn.set('text', 'Edit');
					handleEditboxData(targetItem, targetNextItem.one('textarea'));

					// remove and destory editbox
					targetNextItem.remove(true);
				}
			});
		});

		// bind geo button click
		Y.one('#snapshot-info-loc .geo').on('click', function(e) {
			// detect geo location and update into loc field
			detectGeolocation();
		});

		// bind send feedback event
		Y.one('#snapshot-submit').on('click', sendFeedback);
	}

	function sendFeedback() {
/*		alert('send feedback!');
		var jData = {a: 1, b: 2};

		Y.io('http://localhost/api.php', {
		  method: 'POST',
		  data: Y.JSON.stringify(jData),
		  headers: {
		    'Content-Type': 'application/json'
		  },
		  on: {
		    success: function (id, response) {
		      // do something with the response from the server, for example
		      alert('success');
		    }
		  }
		});
*/
		//location.replace(location.href);
		Y.one('#snapshot-overlay-wrapper').setStyle('display', 'none');
	}

	function setGeolocationIntoLocField(coords) {
		var loc = Y.one('#snapshot-info-loc .value').get('text');
		loc = Y.JSON.parse(loc);
		loc.geolat = coords.latitude;
		loc.geolon = coords.longitude;
		
		setInfo('location', loc);
	}

	function detectGeolocation() {
		if ("geolocation" in navigator) {
			/* https://developer.mozilla.org/en-US/docs/Web/API/Geolocation.getCurrentPosition */
		  	var options = {
			  enableHighAccuracy: true,
			  timeout: 5000,
			  maximumAge: 0
			};

			function success(pos) {
			  var crd = pos.coords;

			  console.log('Your current position is:');
			  console.log('Latitude : ' + crd.latitude);
			  console.log('Longitude: ' + crd.longitude);
			  console.log('More or less ' + crd.accuracy + ' meters.');
			  setGeolocationIntoLocField(crd);
			};

			function error(err) {
			  console.warn('ERROR(' + err.code + '): ' + err.message);
			  setGeolocationIntoLocField({
			  	latitude: 'na',
			  	longitude: 'na'
			  });
			};

			navigator.geolocation.getCurrentPosition(success, error, options);

		} else {
		  /* geolocation IS NOT available */
		}
	}

	function handleEditboxData(targetItem, targetItemEditbox) {
		var editboxVal = targetItemEditbox.get('value');

		// backyard id
		if (targetItem.get('id') == 'snapshot-info-usr') {
			setInfo('backyardid', editboxVal);
			setBackyardidToLocalStorage(editboxVal);
		}
		// description
		else if (targetItem.get('id') == 'snapshot-info-desc') {
			setInfo('description', editboxVal);
		}
	}

	function getBackyardidFromLocalStorage() {
		if(typeof(Storage)!=="undefined") {
			if (localStorage.getItem('usr')) {
				return localStorage.getItem('usr');
			}
			return '';
		}
		return '';
	}

	function setBackyardidToLocalStorage(backyardid) {
		if(typeof(Storage)!=="undefined") {
			localStorage.setItem('usr', backyardid);
		}
	}


});
