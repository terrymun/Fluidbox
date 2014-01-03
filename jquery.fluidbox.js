// Fluidbox
// Description: Replicating the seamless lightbox transition effect seen on Medium.com, with some improvements
// Version: 1.2
// Author: Terry Mun
// Author URI: http://terrymun.com

(function ($) {
	
	$.fn.fluidbox = function (opts) {

		// Default settings
		var settings = $.extend(true, {
			viewportFill: 0.95,
			closeTrigger: [
				{
					selector:	'#fluidbox-overlay',
					event:	'click'
				}
			]
		}, opts);

		// Dynamically create overlay
		$('body').append('<div id="fluidbox-overlay" />');

		// Declare variables
		var $fb = this,
			$w = $(window),		// Shorthand for $(window)
			vpRatio,

			// Function:
			// 1. funcCloseFb()		- used to close any instance of opened Fluidbox
			// 2. funcPositionFb()	- used for dynamic positioning of any instance of opened Fluidbox
			funcCloseFb = function () {
				$('.fluidbox-opened').trigger('click');
			},
			funcPositionFb = function ($activeFb) {
				// Get shorthand for more objects
				var $img    = $activeFb.find('img'),
					$ghost  = $activeFb.find('.fluidbox-ghost'),

					// Calculation goes here
					offsetY = $w.scrollTop()-$img.offset().top+0.5*($img.data('imgHeight')*($img.data('imgScale')-1))+0.5*($w.height()-$img.data('imgHeight')*$img.data('imgScale')),
					offsetX = 0.5*($img.data('imgWidth')*($img.data('imgScale')-1))+0.5*($w.width()-$img.data('imgWidth')*$img.data('imgScale'))-$img.offset().left,
					scale   = $img.data('imgScale');

				// Apply CSS transforms to ghost element
				$ghost.css({
					'transform': 'translate('+offsetX+'px,'+offsetY+'px) scale('+scale+')'
				});
			};

		// When should we close Fluidbox?
		if(settings.closeTrigger) {
			// Go through array
			$.each(settings.closeTrigger, function(i) {

				if(settings.closeTrigger[i].selector != 'window') {
					// If it is not 'window', we append click handler to $(document) object, allow it to bubble up
					$(document).on(settings.closeTrigger[i].event, settings.closeTrigger[i].selector, funcCloseFb);
				} else {
					// If it is 'window', append click handler to $(window) object
					$w.on(settings.closeTrigger[i].event, funcCloseFb);
				}
			});
		}

		// Perform all things only when images are loaded
		$fb.imagesLoaded().done(function () {

			// Go through each individual object
			$fb.each(function () {

				// Check if Fluidbox:
				// 1. Is an anchor element ,<a>
				// 2. Contains one and ONLY one child
				// 3. The only child is an image element, <img>
				if($(this).is('a') && $(this).children().length === 1 && $(this).children().is('img')) {

					// Add class
					$(this)
					.addClass('fluidbox')
					.wrapInner('<div class="fluidbox-wrap" />')
					.find('img')
						.css({ opacity: 1})
						.after('<div class="fluidbox-ghost" />');
				}
			});

			// Listen to window resize event
			$(window).resize(function () {

				// Get viewport ratio
				vpRatio = $w.width() / $w.height();

				// Get image dimensions and aspect ratio
				$fb.each(function () {
					var $img	= $(this).find('img'),
						$ghost	= $(this).find('.fluidbox-ghost'),
						$wrap	= $(this).find('.fluidbox-wrap'),
						data	= $img.data();

					// Store image dimensions in jQuery object
					data.imgWidth	= $img.width();
					data.imgHeight	= $img.height();
					data.imgRatio	= $img.width()/$img.height();

					// Resize and position ghost element
					$ghost.css({
						width: $img.width(),
						height: $img.height(),
						top: $img.offset().top - $wrap.offset().top,
						left: $img.offset().left - $wrap.offset().left,
					});

					// Calculate scale based on orientation
					if(vpRatio > data.imgRatio) {
						data.imgScale = $w.height()*settings.viewportFill/$img.height();
					} else {
						data.imgScale = $w.width()*settings.viewportFill/$img.width();
					}
				});

				// Reposition Fluidbox, but only if one is found to be open
				var $activeFb = $('a[data-fluidbox].fluidbox-opened');
				if($activeFb.length > 0) funcPositionFb($activeFb);
	            
			}).resize();

			// Bind click event
			$fb.click(function (e) {
				
				// Variables
				var $activeFb	= $(this),
					$img		= $(this).find('img'),
					$ghost		= $(this).find('.fluidbox-ghost');

				if($(this).data('fluidbox-state') === 0 || !$(this).data('fluidbox-state')) {
					// State: Closed
					// Action: Open fluidbox

					// Switch state
					$(this)
					.data('fluidbox-state', 1)
					.removeClass('fluidbox-closed')
					.addClass('fluidbox-opened');

					// Show overlay
					$('#fluidbox-overlay').fadeIn();

					// Set thumbnail image source as background image first, preload later
					$ghost.css({
						'background-image': 'url('+$img.attr('src')+')',
						opacity: 1
					});

					// Hide original image
					$img.css({ opacity: 0 });

					// Preload ghost image
					var ghostImg = new Image();
					ghostImg.onload = function (){
						$ghost.css({ 'background-image': 'url('+$activeFb.attr('href')+')' });
					};
					ghostImg.src = $(this).attr('href');

					// Position Fluidbox
					funcPositionFb($(this));

				} else {
					// State: Open
					// Action: Close fluidbox

					// Switch state
					$(this)
					.data('fluidbox-state', 0)
					.removeClass('fluidbox-opened')
					.addClass('fluidbox-closed');

					// Hide overlay
					$('#fluidbox-overlay').fadeOut();

					// Show original image
					$img.css({ opacity: 1 });

					// Reverse animation on wrapped elements
					$ghost
					.css({ 'transform': 'translate(0,0) scale(1)' })
					.one('webkitTransitionEnd MSTransitionEnd oTransitionEnd otransitionend transitionend', function (){
						// Wait for transntion to complete before hiding the ghost element
						$ghost.css({ opacity: 0 });
					});
				}

				e.preventDefault();
			});
		});

		// Return to allow chaining
		return $fb;
	};

})(jQuery);