var globalData, zoomInfo, mapInfo, mXPos, mYPos, totalWidth, totalHeight, mCoorX, mCoorY,
	showGrid = true,
	showBoundaries = true,
	selectedFaction = "0";

var canvas = document.getElementById('battleground');
var ctx = canvas.getContext('2d');

var grid_canvas = document.getElementById('battleground-grid');
var grid_context = grid_canvas.getContext('2d');

var items_canvas = document.getElementById('battleground-items');
var items_context = items_canvas.getContext('2d');

var boundaries_canvas = document.getElementById('battleground-boundaries');
var boundaries_context = boundaries_canvas.getContext('2d');

var imageCache = new Array();

$(document).ready(function() {

	// Set up to resize canvas on window change.

	

	initialLoad();

	function initialLoad() {

		// Load in the JSON and start the work

		$.getJSON("assets/js/data.json", function(data) {
			globalData = data;
			zoomInfo = data['zoomInfo'];
			mapInfo = data['mapInfo'][mapName];

			if(mapInfo) {
				mXPos = data['mapInfo'][mapName]['xCenter'];
				mCoorX = data['mapInfo'][mapName]['xCenter'];
				mYPos =  data['mapInfo'][mapName]['yCenter'];
				mCoorY = data['mapInfo'][mapName]['yCenter'];
			

				var tempArr = mapInfo['gametypes']['ConquestLarge0']['points'];

				$.each(tempArr, function(index, val) {

					var theimg = new Image();
					theimg.src = val.resource;

					var imageDict = {
						"x" : val.coors[0],
						"y" : val.coors[1],
						"w" : val.w,
						"h" : val.h,
						"image" : theimg
					};

					imageCache.push(imageDict);
										
					//drawStuff(zoomInfo[zoomLevel]['x'],zoomInfo[zoomLevel]['y'],zoomLevel);

				});


			}

			resizeCanvas();
			updateUI();
		});

	}

	window.addEventListener('resize', resizeCanvas, false);


	function resizeCanvas() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		grid_canvas.width = window.innerWidth;
		grid_canvas.height = window.innerHeight;

		items_canvas.width = window.innerWidth;
		items_canvas.height = window.innerHeight;

		boundaries_canvas.width = window.innerWidth;
		boundaries_canvas.height = window.innerHeight;

		drawStuff(zoomInfo[zoomLevel]['x'],zoomInfo[zoomLevel]['y'],zoomLevel);
	}

	var urlVars = getUrlVars(window.location.href);
	var mapName = urlVars['map'];
	var baseUrl = "assets/maps/"+mapName+"/minimap_Win32_mip{z}_{x}_{y}.jpg";
	var zoomLevel = 1;

	var imageRes = 1024;

	// Main Drawing.

	function drawStuff(xloop, yloop, zoom) {

		totalWidth = xloop * imageRes;
		totalHeight = yloop * imageRes;

		var centerXPx = totalWidth*(mXPos/100)
		var centerYPx = totalHeight*(mYPos/100)

		var xStartPx = centerXPx - (canvas.width/2);
		var xFinishPx = centerXPx + (canvas.width/2);
		var yStartPx = centerYPx - (canvas.height/2);
		var yFinishPx = centerYPx + (canvas.height/2);

		var startCoor = [Math.floor(xStartPx / imageRes), Math.floor(yStartPx / imageRes)]
		var finishCoor = [Math.ceil(xFinishPx / imageRes), Math.ceil(yFinishPx / imageRes)]

		var coordinates = [];

		for (var x = startCoor[0]; x <= finishCoor[0]; x++) {
			for (var y = startCoor[1]; y <= finishCoor[1]; y++) {

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

		var globalXOffset = xStartPx - (coordinates[0].x * imageRes);
		var globalYOffset = yStartPx - (coordinates[0].y * imageRes);

		$.each(coordinates, function(index, val) {

			var img = new Image();

			if(val.x > (xloop-1) || val.x < 0 || val.y > (yloop-1) || val.y < 0) {
				img.src = "assets/images/black.png";
			} else {
				img.src = val.url;
			}
			
			img.width = imageRes;
			img.height = imageRes;

			var xOffset = (imageRes * (val.x - coordinates[0].x))-globalXOffset;
			var yOffset = (imageRes * (val.y - coordinates[0].y))-globalYOffset;
			img.onload = function() {
				ctx.drawImage(img, xOffset, yOffset, imageRes, imageRes);
			}

		});


		drawGrid(totalWidth, totalHeight, xStartPx, yStartPx);
		drawBoundaries(totalWidth, totalHeight, xStartPx, yStartPx);
		drawItems(totalWidth, totalHeight, xStartPx, yStartPx);
		
		updateUI();

	}


	function drawGrid(width, height, xOffset, yOffset) {

		grid_canvas.width = grid_canvas.width;
		grid_context.clearRect(0, 0, grid_canvas.width, grid_canvas.height);

		if(showGrid) {

			for (var x = 0; x < width; x += zoomInfo[zoomLevel]['grid']) {
				grid_context.beginPath();
				grid_context.moveTo(x-xOffset, 0);
				grid_context.lineTo(x-xOffset, height);
				grid_context.strokeStyle = "#fff";
				grid_context.stroke();
				grid_context.closePath();
			}

			for (var y = 0; y < height; y += zoomInfo[zoomLevel]['grid']) {
				grid_context.beginPath();
				grid_context.moveTo(0, y-yOffset);
				grid_context.lineTo(width, y-yOffset);
				grid_context.strokeStyle = "#fff";
				grid_context.stroke();
				grid_context.closePath();
			}


		}

	}

	function drawItems(width, height, xOffset, yOffset) {

		items_context.clearRect(0, 0, items_canvas.width, items_canvas.height);

		if(mapInfo) {

			$.each(imageCache, function(index, val) {

				console.log(val);


				var xo = (width*(val.x/100))-xOffset-(val.w/2);
				var yo = (height*(val.y/100))-yOffset-(val.h/2);
				
				items_context.drawImage(val.image, xo, yo, val.w, val.h);

			});


		}


	}

	function drawBoundaries(width, height, xOffset, yOffset) {

		boundaries_canvas.width = boundaries_canvas.width;
		boundaries_context.clearRect(0, 0, boundaries_canvas.width, boundaries_canvas.height);

		if(showBoundaries) {
			boundaries_context.fillStyle = "rgba(0,0,0,.5)";
			boundaries_context.fillRect(0, 9, boundaries_canvas.width, boundaries_canvas.height);

			boundaries_context.globalCompositeOperation = 'destination-out';

			boundaries_context.fillStyle = "#fff";
			boundaries_context.strokeStyle = "#fff";
			boundaries_context.beginPath();
			
			if(mapInfo) {
				var tempArr = mapInfo['gametypes']['ConquestLarge0']['combatarea']['one'];


				$.each(tempArr, function(index, val) {

					boundaries_context.lineTo( width*(val.x/100)-xOffset , height*(val.y/100)-yOffset );

				});

			}

			boundaries_context.closePath();

			boundaries_context.fill();
		}
	
	}

	// Setup touch dragging

	touching = false;

	$('#battleground').bind("touchstart", function(e){
		e.preventDefault();
		previousX = e.clientX;
		previousY = e.clientY;
		touching = true;
	});

	$('#battleground').bind("touchend", function(e){
		touching = false;
	});

	$('#battleground').bind("touchmove", function(e){

		console.log(e.touches);

		if (touching) {
			e.preventDefault();
			
			var directionX, directionY;

			var moveRate = (100/(zoomLevel+1));

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
			
		} else {
			updateUI();
		}

	});


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

		var centerXPx = totalWidth*(mXPos/100)
		var centerYPx = totalHeight*(mYPos/100)

		var xStartPx = centerXPx - (canvas.width/2);
		var yStartPx = centerYPx - (canvas.height/2);

		mCoorX = ((xStartPx + e.clientX)/totalWidth)*100;
		mCoorY = ((yStartPx + e.clientY)/totalHeight)*100;

		if (clicking) {
			e.preventDefault();

			var directionX, directionY;

			var moveRate = (100/(zoomLevel+1));

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
			
		} else {
			updateUI();
		}

	});

	/*
	 *  Setup Zoom
	 */

	// Browser
	// Firefox Scroll
	$('#battleground').bind('DOMMouseScroll', function(e){
		if(e.originalEvent.detail > 0) {
			doZoom(false);
		} else {
			doZoom(true);
		}
		return false;
	});

	// Webkit, etc..
	$('#battleground').bind('mousewheel', function(e){
		if(e.originalEvent.wheelDelta < 0) {
			doZoom(false);
		} else {
			doZoom(true);
		}
		return false;
	});

	// Buttons
	$('.ui-zoom-in').click(function(e) {
		doZoom(true);
		return false;
	});

	$('.ui-zoom-out').click(function(e) {
		doZoom(false);
		return false;
	});

	function doZoom(dir) {
		if(dir) {
			if(zoomInfo[zoomLevel-1]) {
				zoomLevel = zoomLevel-1;
			}
		} else {
			if(zoomInfo[zoomLevel+1]) {
				zoomLevel = zoomLevel+1;
			}
		}
		drawStuff(zoomInfo[zoomLevel]['x'],zoomInfo[zoomLevel]['y'],zoomLevel);
		//$('.ui-zoom-level').html(zoomInfo[zoomLevel]['label']+"");
	}

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
		$('.ui-coor-text').html(''+mCoorX.toFixed(2)+', '+mCoorY.toFixed(2));
		if(showGrid) {
			$('.ui-grid-on').addClass("active");
			$('.ui-grid-off').removeClass("active");
		} else {
			$('.ui-grid-off').addClass("active");
			$('.ui-grid-on').removeClass("active");
		}
		if(showBoundaries) {
			$('.ui-boundaries-on').addClass("active");
			$('.ui-boundaries-off').removeClass("active");
		} else {
			$('.ui-boundaries-off').addClass("active");
			$('.ui-boundaries-on').removeClass("active");
		}
	}

	$('.ui-grid-on').click(function(e) {
		if(!showGrid) {
			showGrid = true;
		}
		drawStuff(zoomInfo[zoomLevel]['x'],zoomInfo[zoomLevel]['y'],zoomLevel);
	});

	$('.ui-grid-off').click(function(e) {
		if(showGrid) {
			showGrid = false;
		}
		drawStuff(zoomInfo[zoomLevel]['x'],zoomInfo[zoomLevel]['y'],zoomLevel);
	});



	$('.ui-boundaries-on').click(function(e) {
		if(!showBoundaries) {
			showBoundaries = true;
		}
		drawStuff(zoomInfo[zoomLevel]['x'],zoomInfo[zoomLevel]['y'],zoomLevel);
	});

	$('.ui-boundaries-off').click(function(e) {
		if(showBoundaries) {
			showBoundaries = false;
		}
		drawStuff(zoomInfo[zoomLevel]['x'],zoomInfo[zoomLevel]['y'],zoomLevel);
	});

});