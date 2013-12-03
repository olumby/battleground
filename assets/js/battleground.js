var globalData, zoomInfo, mapInfo;

$(document).ready(function() {

	// Set up to resize canvas on window change.

	window.addEventListener('resize', resizeCanvas, false);

	function resizeCanvas() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		drawStuff(zoomInfo[zoomLevel]['x'],zoomInfo[zoomLevel]['y'],zoomLevel);
	}

	var vX = 0, 
		vY = 0,
		vWidth = window.innerWidth,
		vHeight = window.innerHeight;

	var urlVars = getUrlVars(window.location.href);
	var mapName = urlVars['map'];
	var baseUrl = "assets/maps/"+mapName+"/minimap_Win32_mip{z}_{x}_{y}.jpg";
	var zoomLevel = 1;

	var canvas = document.getElementById('battleground');
	var ctx = canvas.getContext('2d');

	var mXPos = 50;
	var mYPos = 50;

	var imageRes = 1024;

	// Load in the JSON and start the work

	$.getJSON("assets/js/data.json", function(data) {
		globalData = data;
		zoomInfo = data['zoomInfo'];
		mapInfo = data['mapInfo'];

		if(data['mapInfo'][mapName]) {
			mXPos = data['mapInfo'][mapName]['xCenter'];
			mYPos = data['mapInfo'][mapName]['yCenter'];
		}

		resizeCanvas();
		updateUI();
	});

	// Main Drawing.

	function drawStuff(xloop, yloop, zoom) {

		var urlArray = new Array();
		
		for(var i = 0; i < xloop; i++) {
			for(var j = 0; j < yloop; j++) {
				var theUrl = baseUrl;

				theUrl = theUrl.replace("{x}", i);
				theUrl = theUrl.replace("{y}", j);
				theUrl = theUrl.replace("{z}", zoom);

				var urlDict = {
					"x" : i,
					"y" : j,
					"url" : theUrl
				};

				urlArray.push(urlDict);
			}
		}

		var totalWidth = xloop * imageRes;
		var totalHeight = yloop * imageRes;

		var centerX = totalWidth*(mXPos/100)
		var centerY = totalHeight*(mYPos/100)

		var xStart = centerX - (window.innerWidth/2);
		var xFinish = centerX + (window.innerWidth/2);
		var yStart = centerY - (window.innerHeight/2);
		var yFinish = centerY + (window.innerHeight/2);

		var aPoint,
			bPoint;

		$.each(urlArray, function(index, val) {

			if( (val.x * imageRes) < xStart && (val.x * imageRes) + imageRes > xStart ) {
				if( (val.y * imageRes) < yStart && (val.y * imageRes) + imageRes > yStart ) {
					aPoint = [val.x, val.y];
				}
			}

			if( (val.x * imageRes) < xFinish && (val.x * imageRes) + imageRes > xFinish ) {
				if( (val.y * imageRes) < yFinish && (val.y * imageRes) + imageRes > yFinish ) {
					bPoint = [val.x, val.y];
				}
			}

		});

		var coordinates = [];

		for (var x = aPoint[0]; x <= bPoint[0]; x++) {
			for (var y = aPoint[1]; y <= bPoint[1]; y++) {

				var theUrl = baseUrl;

				theUrl = theUrl.replace("{x}", x);
				theUrl = theUrl.replace("{y}", y);
				theUrl = theUrl.replace("{z}", zoom);

				var urlDict = {
					"x" : x,
					"y" : y,
					"url" : theUrl
				};
				coordinates.push(urlDict);
			}
		}


		var globalXOffset = xStart - (coordinates[0].x * imageRes);
		var globalYOffset = yStart - (coordinates[0].y * imageRes);

		$.each(coordinates, function(index, val) {

			console.log(mXPos, mXPos);
			
			var img = new Image();

			img.src = val.url;
			img.width = imageRes;
			img.height = imageRes;

			var xOffset = (imageRes * (val.x - coordinates[0].x))-globalXOffset;
			var yOffset = (imageRes * (val.y - coordinates[0].y))-globalYOffset;
			img.onload = function() {
				ctx.drawImage(img, xOffset, yOffset, imageRes, imageRes);
			}

		});

	}

	// Setup mouse dragging
	
	clicking = false;

	$('#battleground').mousedown(function(e) {
		e.preventDefault();
		previousX = e.clientX;
		previousY = e.clientY;
		clicking = true;
	});

	$('*').mouseup(function() {
		clicking = false;
	});

	$('#battleground').mousemove(function(e) {
		if (clicking) {
			e.preventDefault();
			
			var directionX, directionY;

			var moveRate = (90/(zoomLevel+1));

			if(((previousX - e.clientX)/moveRate)) {
				directionX = ((previousX - e.clientX)/moveRate)
				if(mXPos + directionX < 100 && mXPos + directionX > 1) {
					mXPos += directionX;	
					previousX = e.clientX;
				}
			}


			if(((previousY - e.clientY)/moveRate)) {
				directionY = ((previousY - e.clientY)/moveRate)	
				if(mYPos + directionY < 100 && mYPos + directionY > 0) {
					mYPos += directionY;	
					previousY = e.clientY;
				}
			}

			drawStuff(zoomInfo[zoomLevel]['x'],zoomInfo[zoomLevel]['y'],zoomLevel);

			updateUI();
			
		}
	});

	// Other Functions

	function getUrlVars(url) {
		var vars = {};
		var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
			vars[key] = value;
		});
		return vars;
	}

	
	// Handle UI.

	function updateUI() {
		$('.ui-zoom-level').html(zoomInfo[zoomLevel]['label']+"");
		$('.ui-coor-text').html(''+mXPos.toFixed(2)+', '+mYPos.toFixed(2));
	}

	$('.ui-zoom-in').click(function(e) {
		if(zoomInfo[zoomLevel-1]) {
			zoomLevel = zoomLevel-1;
			drawStuff(zoomInfo[zoomLevel]['x'],zoomInfo[zoomLevel]['y'],zoomLevel);
			$('.ui-zoom-level').html(zoomInfo[zoomLevel]['label']+"");
		}
	});

	$('.ui-zoom-out').click(function(e) {
		if(zoomInfo[zoomLevel+1]) {
			zoomLevel = zoomLevel+1;
			drawStuff(zoomInfo[zoomLevel]['x'],zoomInfo[zoomLevel]['y'],zoomLevel);
			$('.ui-zoom-level').html(zoomInfo[zoomLevel]['label']+"");
		}
	});

});