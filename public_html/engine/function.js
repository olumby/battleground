$(document).ready(function() {

	var mode = 'boundaries';


	if(mode == 'boundaries') {

		$.getJSON("data.json", function(data) {

			var x = data[0]['x'];
			var y = data[0]['y'];


			$.each(x, function(index, val) {


				xCoor = (((( val / (data[0]['pixelresolution']) ) * 100)).toFixed(3));
				yCoor = (((( y[index] / (data[0]['pixelresolution']) ) * 100)).toFixed(3));

				$("#box").append('{ "x":'+xCoor+', "y":'+yCoor+' },');

			});

		});


	} else if(mode == 'objectives') {


		$.getJSON("data.json", function(data) {

			var x = data[1]['x'];
			var y = data[1]['y'];
			var n = data[1]['name'];


			$.each(x, function(index, val) {


				xCoor = ((( val / (data[0]['pixelresolution']) ) * 100).toFixed(3));
				yCoor = ((( y[index] / (data[0]['pixelresolution']) ) * 100).toFixed(3));


				$("#box").append('{\
	              "type": "objective",\
	              "name": "'+n[index]+'",\
	              "resource": "assets/icons/inactive-obj-a.png",\
	              "h": 38,\
	              "w": 38,\
	              "coors": [\
	                '+xCoor+',\
	                '+yCoor+'\
	              ]\
	            },');


			});

		});


	}






});