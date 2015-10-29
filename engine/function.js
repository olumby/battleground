
function getBoundaries(dataFile) {

	$.getJSON(dataFile, function(data) {

		var x = data['x'];
		var y = data['y'];

		$("#box").text('');

		$.each(x, function(index, val) {


			xCoor = (((( val / (data['pixelresolution']) ) * 100)).toFixed(3));
			yCoor = (((( y[index] / (data['pixelresolution']) ) * 100)).toFixed(3));

			$("#box").append('{ "x":'+xCoor+', "y":'+yCoor+' },');

		});

	});

}


function getPoints(dataFile) {


	$.getJSON(dataFile, function(data) {

		var x = data[1]['x'];
		var y = data[1]['y'];
		var n = data[1]['name'];

		$("#box").text('');

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


