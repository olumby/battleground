$( document ).ready(function() {

	function getUrlVars(url) {
		var vars = {};
		var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
			vars[key] = value;
		});
		return vars;
	}

	var urlVars = getUrlVars(window.location.href);
	var mapName = urlVars['map'];

	// Setup //

	// Set the subnav width.
	$('.ui-subnav').width(window.innerWidth - $('.ui-sidebar').width());
	// Set the subnav highlightes.
	$('.ui-subnav').find("[data-map='" + mapName + "']").addClass('active');
	// Set the small subnav.
	var currentMapLink = $('.ui-subnav').find("[data-map='" + mapName + "']").clone();
	$('.ui-subnav #small-subnav').html(currentMapLink);


	$('.ui-subnav .draw').click(function () {

		var parent = $(this).parent();

		if(parent.height() == 40) {
			$(this).children('img').removeClass('rotated');
			$('.ui-subnav #small-subnav').slideUp(500, function() {
				$('.ui-subnav #large-subnav').slideDown();
			});
		} else {
			$(this).children('img').addClass('rotated');
			$('.ui-subnav #large-subnav').slideUp(500, function() {
				$('.ui-subnav #small-subnav').slideDown();
			});
		}

	});

	$('.ui-sidebar .draw').click(function () {

		var parent = $(this).parent();

		if(parent.width() == 0) {

			$(this).prev().animate({width: 'toggle'}, 500);

			parent.css('border-left-width', '1px');
			$(this).children('img').removeClass('rotated');
			$('.ui-subnav').animate({width: "-=361px" }, 500);

		} else {

			$(this).prev().animate({width: 'toggle'}, 500);

			$(this).children('img').addClass('rotated');

			$('.ui-subnav').animate({width: "100%" }, 500, function() {
				parent.css('border-left-width', '0px');
			});
		}

	});



});