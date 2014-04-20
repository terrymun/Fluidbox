// Fluidbox
// Description: Replicating the seamless lightbox transition effect seen on Medium.com, with some improvements
// Version: 1.2.7
// Author: Terry Mun
// Author URI: http://terrymun.com

// --------------------------------------------------------
//  Dependency: Paul Irish's jQuery debounced resize event
// --------------------------------------------------------
(function($,sr){

	// debouncing function from John Hann
	// http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
	var debounce = function (func, threshold, execAsap) {
		var timeout;

		return function debounced () {
			var obj = this, args = arguments;
			function delayed () {
				if (!execAsap)
				func.apply(obj, args);
				timeout = null;
			};

			if (timeout)
				clearTimeout(timeout);
			else if (execAsap)
				func.apply(obj, args);

			timeout = setTimeout(delayed, threshold || 100);
		};
	}
	// smartresize 
	jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

})(jQuery,'smartresize');

// -----------------------------
//  Fluidbox plugin starts here
// -----------------------------
(function ($) {
	
	$.fn.fluidbox = function (opts) {

		// Default settings
		var settings = $.extend(true, {
			viewportFill: 0.95,
			overlayColor: 'rgba(255,255,255,.85)',
			debounceResize: true,
			stackIndex: 1000,
			stackIndexDelta: 10,
			closeTrigger: [
				{
					selector: '.fluidbox-overlay',
					event: 'click'
				},
				{
					selector: 'document',
					event: 'keyup',
					keyCode: 27
				}
			]
		}, opts);

		// Ensure that the stackIndex does not become negative
		if(settings.stackIndex < settings.stackIndexDelta) settings.stackIndexDelta = settings.stackIndex;

		// Dynamically create overlay
		$fbOverlay = $('<div />', {
			class: 'fluidbox-overlay',
			css: {
				'background-color': settings.overlayColor,
				'z-index': settings.stackIndex
			}
		});

		// Declare variables
		var $fb = this,
			$w = $(window),		// Shorthand for $(window)
			vpRatio,

			// Function:
			// 1. funcCloseFb()		- used to close any instance of opened Fluidbox
			// 2. funcPositionFb()	- used for dynamic positioning of any instance of opened Fluidbox
			// 3. funcCalc()		- used to store dimensions of image, ghost element and wrapper element upon initialization or resize
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
				// For offsetX and Y, we round to one decimal place
				// For scale, we round to three decimal places
				$ghost.css({
					'transform': 'translate('+parseInt(offsetX*10)/10+'px,'+parseInt(offsetY*10)/10+'px) scale('+parseInt(scale*1000)/1000+')'
				});
			},
			funcCalc = function () {
				// Get viewport ratio
				vpRatio = $w.width() / $w.height();

				// Get image dimensions and aspect ratio
				$fb.each(function () {
					if($(this).hasClass('fluidbox')) {
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
					}
				});
			};

		// When should we close Fluidbox?
		if(settings.closeTrigger) {
			// Go through array
			$.each(settings.closeTrigger, function (i) {
				var trigger = settings.closeTrigger[i];

				// Attach events
				if(trigger.selector != 'window') {
					// If it is not 'window', we append click handler to $(document) object, allow it to bubble up
					// However, if thes selector is 'document', we use a different .on() syntax
					if(trigger.selector == 'document') {
						if(trigger.keyCode) {
							$(document).on(trigger.event, function (e) {
								if(e.keyCode == trigger.keyCode) funcCloseFb();
							});
						} else {
							$(document).on(trigger.event, funcCloseFb);
						}
					} else {
						$(document).on(trigger.event, settings.closeTrigger[i].selector, funcCloseFb);
					}
				} else {
					// If it is 'window', append click handler to $(window) object
					$w.on(trigger.event, funcCloseFb);
				}
			});
		}

		// Perform all things only when images are loaded
		$fb.imagesLoaded().done(function () {

			// Go through each individual object
			$fb.each(function (i) {

				// Check if Fluidbox:
				// 1. Is an anchor element ,<a>
				// 2. Contains one and ONLY one child
				// 3. The only child is an image element, <img>
				if($(this).is('a') && $(this).children().length === 1 && $(this).children().is('img')) {

					// Define wrap
					var $fbInnerWrap = $('<div />', {
						class: 'fluidbox-wrap',
						css: {
							'z-index': settings.stackIndex - settings.stackIndexDelta
						}
					});

					// Add class
					$(this)
					.addClass('fluidbox')
					.wrapInner($fbInnerWrap)
					.find('img')
						.css({ opacity: 1 })
						.after('<div class="fluidbox-ghost" />');
				}
			});

			// Initialize calculations
			funcCalc();

			// Listen to window resize event
			// Check if user wants to debounce the resize event (it is debounced by default)
			var funcResize = function () {
				// Recalculate dimensions
				funcCalc();

				// Reposition Fluidbox, but only if one is found to be open
				var $activeFb = $('a.fluidbox.fluidbox-opened');
				if($activeFb.length > 0) funcPositionFb($activeFb);
			}

			if(settings.debounceResize) {
				$(window).smartresize(funcResize);
			} else {
				$(window).resize(funcResize);
			}

			// Bind click event
			$fb.click(function (e) {
				
				if($(this).hasClass('fluidbox')) {

					// Variables
					var $activeFb	= $(this),
						$img		= $(this).find('img'),
						$ghost		= $(this).find('.fluidbox-ghost'),
						$wrap       = $(this).find('.fluidbox-wrap'),
						timer       = {};

					if($(this).data('fluidbox-state') === 0 || !$(this).data('fluidbox-state')) {
						// State: Closed
						// Action: Open fluidbox

						// Wait for ghost image to be loaded successfully first, then do the rest
						$('<img />', {
							src: $img.attr('src')
						}).load(function () {
							// What are we doing here:
							// 1. Append overlay in fluidbox
							// 2. Toggle fluidbox state with data attribute
							// 3. Store original z-index with data attribute (so users can change z-index when they see fit in CSS file)
							// 4. Class toggle
							$activeFb
							.append($fbOverlay)
							.data('fluidbox-state', 1)
							.removeClass('fluidbox-closed')
							.addClass('fluidbox-opened');

							// Force timer to completion
							if(timer['close']) window.clearTimeout(timer['close']);
							if(timer['hideGhost']) window.clearTimeout(timer['hideGhost']);

							// Set timer for opening
							timer['open'] = window.setTimeout(function() {
								// Show overlay
								$('.fluidbox-overlay').css({ opacity: 1 });
							}, 10);

							// Change wrapper z-index, so it is above everything else
							$wrap.css({ 'z-index': settings.stackIndex + settings.stackIndexDelta });

							// Set thumbnail image source as background image first, preload later
							// Sometimes the transitionend is not unbound properly, especially when very quick, successive clicking.
							// We turn it off again, just in case.
							$ghost
							.off('webkitTransitionEnd transitionend oTransitionEnd MSTransitionEnd transitionEnd')
							.css({
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
							ghostImg.src = $activeFb.attr('href');

							// Position Fluidbox
							funcPositionFb($activeFb);
						});

					} else {
						// State: Open
						// Action: Close fluidbox

						// Switch state
						$activeFb
						.data('fluidbox-state', 0)
						.removeClass('fluidbox-opened')
						.addClass('fluidbox-closed');

						// Set timer for closing
						if(timer['open']) window.clearTimeout(timer['open']);
						timer['close'] = window.setTimeout(function() {
							$('.fluidbox-overlay').remove();
							$wrap.css({ 'z-index': settings.stackIndex - settings.stackIndexDelta });
						}, 10);

						// Hide overlay
						$('.fluidbox-overlay').css({ opacity: 0 });
						
						// Reverse animation on wrapped elements, and restore stacking order
						// You might want to change this value if your transition timing is longer
						$ghost.css({ 'transform': 'translate(0,0) scale(1)' }).one('webkitTransitionEnd transitionend oTransitionEnd MSTransitionEnd transitionEnd', function (){
							$img.css({ opacity: 1 });
							timer['hideGhost'] = window.setTimeout(function() {
								$ghost.css({ opacity: 0 });
							}, 250);
						});
					}

					e.preventDefault();
				}
			});
		});

		// Return to allow chaining
		return $fb;
	};

})(jQuery);