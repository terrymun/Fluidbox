// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

	"use strict";

		// undefined is used here as the undefined global variable in ECMAScript 3 is
		// mutable (ie. it can be changed by someone else). undefined isn't really being
		// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
		// can no longer be modified.

		// window and document are passed through as local variable rather than global
		// as this (slightly) quickens the resolution process and can be more efficiently
		// minified (especially when both are regularly referenced in your plugin).

		// Create the defaults once
		var $w			= $(window),
			$d			= $(document),
			pluginName	= "fluidbox",
			defaults	= {
				immediateOpen: false,
				loader: false,
				maxWidth: 0,
				maxHeight: 0,
				resizeThrottle: 500,
				stackIndex: 1000,
				stackIndexDelta: 10,
				viewportFill: 0.95,
			},
			globalData = {},
			keyboardEvents = ['keyup', 'keydown', 'keypress'];

		// Global plugin instance tracker
		var fbInstance = 0;

                // Check the availability of the console object. This ensures compatibility with IE8.
                if(typeof console === "undefined" || console.warn === "undefined" ) {
                    console = {};
                    console.warn = function(){};
                }

		// Check if dependencies are loaded
		// 1. Ben Almen's debounce/throttle plugin
		if (!$.isFunction($.throttle)) {
			console.warn('Fluidbox: The jQuery debounce/throttle plugin is not found/loaded. Even though Fluidbox works without it, the window resize event will fire extremely rapidly in browsers, resulting in significant degradation in performance upon viewport resize.');
		}

		// ---------------------------------------------------------------------------------------------------------------------- //
		//  Dependency: David Walsh (http://davidwalsh.name/css-animation-callback)                                               //
		//              and                                                                                                       //
		//              Jonathan Suh (https://jonsuh.com/blog/detect-the-end-of-css-animations-and-transitions-with-javascript/)  //
		// ---------------------------------------------------------------------------------------------------------------------- //
		var whichTransitionEvent = function() {
			var t,
				el = document.createElement("fakeelement");

			var transitions = {
				"transition"      : "transitionend",
				"OTransition"     : "oTransitionEnd",
				"MozTransition"   : "transitionend",
				"WebkitTransition": "webkitTransitionEnd"
			};

			for (t in transitions){
				if (el.style[t] !== undefined){
					return transitions[t];
				}
			}
		};
		var customTransitionEnd = whichTransitionEvent();

		// The actual plugin constructor
		function Plugin (element, options) {
			// Assign element
			this.element = element;

			// Manipulate HTML5 dataset object
			// -  Format: data-fluidbox-(setting-name). When converted into camel case: fluidboxSettingName
			// - So, we will have to remove 'fluidbox' in the front, and change the first letter to lowercase
			var elementData = {};
			$.each($(this.element).data(), function(k,v) {
				var capitalize = function(s) {
						return s && s[0].toLowerCase() + s.slice(1);
					},
					key = capitalize(k.replace('fluidbox',''));

				// Only push non-empty keys (that are part of the Fluidbox HTML5 data- attributes) into new object
				if(key !== '' || key !== null) {
					// Coerce boolean values
					if (v == 'false') {
						v = false;
					} else {
						v = true;
					}
					elementData[key] = v;
				}
			});
			
			// Merge defaults into options, into dataset
			this.settings = $.extend( {}, defaults, options, elementData);

			// Coerce settings
			this.settings.viewportFill = Math.max(Math.min(parseFloat(this.settings.viewportFill), 1), 0);
			if(this.settings.stackIndex < this.settings.stackIndexDelta) {
				settings.stackIndexDelta = settings.stackIndex;
			}

			// Store plugin name
			this._name = pluginName;

			// Initialize
			this.init();
		}

		// Private functions
		var _fun = {
			dom: function() {
				// Wrap and add ghost element
				var $fb_innerWrap = $('<div />', {
					'class': 'fluidbox__wrap',
					css: {
						zIndex: this.settings.stackIndex - this.settings.stackIndexDelta
					}
				});
				$(this.element)
				.addClass('fluidbox--closed')
				.wrapInner($fb_innerWrap)
				.find('img')
					.first()
					.css({ opacity: 1})
					.addClass('fluidbox__thumb')
					.after('<div class="fluidbox__ghost" />');

				// Append loader
				if(this.settings.loader) {
					var $fbLoader = $('<div />', {
						'class': 'fluidbox__loader',
						css: {
							zIndex: 2
						}
					});
					$(this.element).find('.fluidbox__wrap').append($fbLoader);
				}
			},
			prepareFb: function() {
				var fb	= this,
					$fb	= $(this.element);

				// Thumbnail is successfully loaded, fire event
				$fb.trigger('thumbloaddone.fluidbox');

				// Get basic measurements and to resize the ghost element
				_fun.measure.fbElements.call(this);

				// Bind events
				fb.bindEvents();

				// Status: Fluidbox is ready to use
				$fb.addClass('fluidbox--ready');

				// Bind listeners
				fb.bindListeners();

				// Emit custom event
				$fb.trigger('ready.fluidbox');
			},
			measure: {
				viewport: function() {
					globalData.viewport = {
						w: $w.width(),
						h: $w.height()
					};
				},
				fbElements: function() {
					var fb			= this,
						$fb			= $(this.element),
						$fbThumb	= $fb.find('img').first(),
						$fbGhost	= $fb.find('.fluidbox__ghost'),
						$fbWrap		= $fb.find('.fluidbox__wrap');

					// Store image dimensions in instance data
					fb.instanceData.thumb = {
						natW:	$fbThumb[0].naturalWidth,
						natH:	$fbThumb[0].naturalHeight,
						w:		$fbThumb.width(),
						h:		$fbThumb.height()
					};

					// Set ghost dimensions
					$fbGhost
					.css({
						width: $fbThumb.width(),
						height: $fbThumb.height(),
						top: $fbThumb.offset().top - $fbWrap.offset().top + parseInt($fbThumb.css('borderTopWidth')) + parseInt($fbThumb.css('paddingTop')),
						left: $fbThumb.offset().left - $fbWrap.offset().left + parseInt($fbThumb.css('borderLeftWidth')) + parseInt($fbThumb.css('paddingLeft'))
					});
				}
			},
			checkURL: function(url) {
				var exitCode = 0;

				if(/[\s+]/g.test(url)) {
					console.warn('Fluidbox: Fluidbox opening is halted because it has detected characters in your URL string that need to be properly encoded/escaped. Whitespace(s) have to be escaped manually. See RFC3986 documentation.');
					exitCode = 1;
				} else if(/[\"\'\(\)]/g.test(url)) {
					console.warn('Fluidbox: Fluidbox opening will proceed, but it has detected characters in your URL string that need to be properly encoded/escaped. These will be escaped for you. See RFC3986 documentation.');
					exitCode = 0;
				}
				return exitCode;
			},
			formatURL: function(url) {
				return url
					.replace(/"/g, '%22')
					.replace(/'/g, '%27')
					.replace(/\(/g, '%28')
					.replace(/\)/g, '%29');
			}
		};

		// Public functions
		$.extend(Plugin.prototype, {
			init: function () {
			
				// Define elements
				var fb				= this,
					$fb				= $(this.element),
					$fbThumb		= $fb.find('img').first();

				// Get basic measurements
				_fun.measure.viewport();

				// Only perform initialization when
				// - It is not yet initialized
				// + DOM checks are satisfied:
				// +-- An anchor element is selected
				// +-- Contains one and only one child
				// +-- The only child is an image element OR a picture element
				// +-- The element must not be hidden (itself or its parents)
				if(
					(!fb.instanceData || !fb.instanceData.initialized) &&
					(
						$fb.is('a') &&
						$fb.children().length === 1 &&
						(
							$fb.children().is('img') || (
								$fb.children().is('picture') &&
								$fb.find('img').length === 1
							)
						) &&
						$fb.css('display') !== 'none' &&
						$fb.children().css('display') !== 'none' &&
						$fb.parents().css('display') !== 'none'
					)
				) {

					// Initialize and store original node
					$fb.removeClass('fluidbox--destroyed');
					fb.instanceData = {};
					fb.instanceData.initialized = true;
					fb.instanceData.originalNode = $fb.html();

					// Append instance ID
					fbInstance += 1;
					fb.instanceData.id = fbInstance;
					$fb.addClass('fluidbox__instance-'+fbInstance);

					// Status: Fluidbox has been initialized
					$fb.addClass('fluidbox--initialized');

					// DOM replacement
					_fun.dom.call(fb);

					// Emit custom event
					$fb.trigger('init.fluidbox');

					// Wait for image to load, but only if image is not found in cache
					var img = new Image();
					if($fbThumb.width() > 0 && $fbThumb.height() > 0) {
						// Thumbnail loaded from cache, let's prepare fluidbox
						_fun.prepareFb.call(fb);
					} else {
						img.onload = function() {
							// Thumbnail loaded, let's prepare fluidbox
							_fun.prepareFb.call(fb);
						};
						img.onerror = function() {
							// Trigger custom error event
							$fb.trigger('thumbloadfail.fluidbox');
						};
						img.src = $fbThumb.attr('src');
					}
				}

			},
			open: function() {
				
				// Open Fluidbox
				var fb			= this,
					$fb			= $(this.element),
					$fbThumb	= $fb.find('img').first(),
					$fbGhost	= $fb.find('.fluidbox__ghost'),
					$fbWrap		= $fb.find('.fluidbox__wrap');

				// Update state
				fb.instanceData.state = 1;

				// Forcibly turn off transition end detection,
				// otherwise users will get choppy transition if toggling between states rapidly
				$fbGhost.off(customTransitionEnd);

				// Close all other Fluidbox instances
				$('.fluidbox--opened').fluidbox('close');

				// Append overlay
				var $fbOverlay = $('<div />', {
					'class': 'fluidbox__overlay',
					css: {
						zIndex: -1
					}
				});
				$fbWrap.append($fbOverlay);

				// Add class to indicate larger image being loaded
				$fb
				.removeClass('fluidbox--closed')
				.addClass('fluidbox--loading');

				// Check of URL is properly formatted
				if(_fun.checkURL($fbThumb.attr('src'))) {
					fb.close();
					return false;
				}

				// Set thumbnail image source as background image first, worry later
				$fbGhost.css({
					'background-image': 'url(' + _fun.formatURL($fbThumb.attr('src')) + ')',
					opacity: 1
				});

				// Set dimensions for ghost
				_fun.measure.fbElements.call(fb);

				// Wait for ghost image to preload
				var img;
				if (fb.settings.immediateOpen) {
					// Update classes
					$fb
					.addClass('fluidbox--opened fluidbox--loaded')
					.find('.fluidbox__wrap')
						.css({ zIndex: fb.settings.stackIndex + fb.settings.stackIndexDelta });

					// Emit custom event
					$fb.trigger('openstart.fluidbox');

					// Compute
					fb.compute();

					// Hide thumbnail
					$fbThumb.css({ opacity: 0 });

					// Show overlay
					$('.fluidbox__overlay').css({ opacity: 1 });

					// Emit custom event when ghost image finishes transition
					$fbGhost.one(customTransitionEnd, function() {
						$fb.trigger('openend.fluidbox');
					});

					img = new Image();
					img.onload = function() {
						// Perform only if the Fluidbox instance is still open
						if (fb.instanceData.state === 1) {
							// Set new natural dimensions
							fb.instanceData.thumb.natW = img.naturalWidth;
							fb.instanceData.thumb.natH = img.naturalHeight;

							// Remove loading status
							$fb.removeClass('fluidbox--loading');

							// Check of URL is properly formatted
							if(_fun.checkURL(img.src)) {
								fb.close();
								return false;
							}

							// Set new image background
							$fbGhost.css({ 'background-image': 'url(' + _fun.formatURL(img.src) + ')' });

							// Compute
							fb.compute();
						}
					};
					img.onerror = function() {
						// Trigger closing
						fb.close();

						// Emit custom event
						$fb.trigger('imageloadfail.fluidbox');
						$fb.trigger('delayedloadfail.fluidbox');
					};
					img.src = $fb.attr('href');
					
				} else {
					img = new Image();
					img.onload = function() {

						// Update classes
						$fb
						.removeClass('fluidbox--loading')
						.addClass('fluidbox--opened fluidbox--loaded')
						.find('.fluidbox__wrap')
							.css({ zIndex: fb.settings.stackIndex + fb.settings.stackIndexDelta });

						// Emit custom event
						$fb.trigger('openstart.fluidbox');

						// Check of URL is properly formatted
						if(_fun.checkURL(img.src)) {
							fb.close();
							return false;
						}

						// Set new image background
						$fbGhost.css({ 'background-image': 'url(' + _fun.formatURL(img.src) + ')' });

						// Set new natural dimensions
						fb.instanceData.thumb.natW = img.naturalWidth;
						fb.instanceData.thumb.natH = img.naturalHeight;

						// Compute
						fb.compute();

						// Hide thumbnail
						$fbThumb.css({ opacity: 0 });

						// Show overlay
						$('.fluidbox__overlay').css({ opacity: 1 });

						// Emit custom event when ghost image finishes transition
						$fbGhost.one(customTransitionEnd, function() {
							$fb.trigger('openend.fluidbox');
						});
					};
					img.onerror = function() {
						// Trigger closing
						fb.close();

						// Emit custom event
						$fb.trigger('imageloadfail.fluidbox');
					};
					img.src = $fb.attr('href');
				}
					
			},
			compute: function() {
				var fb			= this,
					$fb			= $(this.element),
					$fbThumb	= $fb.find('img').first(),
					$fbGhost	= $fb.find('.fluidbox__ghost'),
					$fbWrap		= $fb.find('.fluidbox__wrap');

				// Shorthand for dimensions
				var imgNatW = fb.instanceData.thumb.natW,
					imgNatH = fb.instanceData.thumb.natH,
					imgW	= fb.instanceData.thumb.w,
					imgH	= fb.instanceData.thumb.h;

				// Calculate aspect ratios
				var thumbRatio = imgNatW / imgNatH,
					viewportRatio = globalData.viewport.w / globalData.viewport.h;

				// Replace dimensions if maxWidth or maxHeight is declared
				if (fb.settings.maxWidth > 0) {
					imgNatW = fb.settings.maxWidth;
					imgNatH = imgNatW / thumbRatio;
				} else if (fb.settings.maxHeight > 0) {
					imgNatH = fb.settings.maxHeight;
					imgNatW = imgNatH * thumbRatio;
				}

				// Compare image ratio with viewport ratio
				var computedHeight, computedWidth, imgScaleY, imgScaleX, imgMinScale;
				if (viewportRatio > thumbRatio) {
					computedHeight	= (imgNatH < globalData.viewport.h) ? imgNatH : globalData.viewport.h*fb.settings.viewportFill;
					imgScaleY		= computedHeight / imgH;
					imgScaleX		= imgNatW * (imgH * imgScaleY / imgNatH) / imgW;
					imgMinScale		= imgScaleY;
				} else {
					computedWidth	= (imgNatW < globalData.viewport.w) ? imgNatW : globalData.viewport.w*fb.settings.viewportFill;
					imgScaleX		= computedWidth / imgW;
					imgScaleY		= imgNatH * (imgW * imgScaleX / imgNatW) / imgH;
					imgMinScale		= imgScaleX;
				}

				// Display console error if both maxHeight and maxWidth are specific
				if (fb.settings.maxWidth && fb.settings.maxHeight)
					console.warn('Fluidbox: Both maxHeight and maxWidth are specified. You can only specify one. If both are specified, only the maxWidth property will be respected. This will not generate any error, but may cause unexpected sizing behavior.');

				// Scale
				var offsetY = $w.scrollTop() - $fbThumb.offset().top + 0.5*(imgH*(imgMinScale-1)) + 0.5*($w.height() - imgH*imgMinScale),
					offsetX = 0.5*(imgW*(imgMinScale-1)) + 0.5*($w.width() - imgW*imgMinScale) - $fbThumb.offset().left,
					scale = parseInt(imgScaleX*100)/100 + ',' + parseInt(imgScaleY*100)/100;

				// Apply styles to ghost and loader (if present)
				$fbGhost
				.css({
					'transform': 'translate(' + parseInt(offsetX*100)/100 + 'px,' + parseInt(offsetY*100)/100 + 'px) scale(' + scale + ')',
					top: $fbThumb.offset().top - $fbWrap.offset().top,
					left: $fbThumb.offset().left - $fbWrap.offset().left
				});
				$fb.find('.fluidbox__loader').css({
					'transform': 'translate(' + parseInt(offsetX*100)/100 + 'px,' + parseInt(offsetY*100)/100 + 'px) scale(' + scale + ')'
				});

				// Emit custom event
				$fb.trigger('computeend.fluidbox');
			},
			recompute: function() {
				// Recompute is simply an alias for the compute method
				this.compute();
			},
			close: function() {

				// Close Fluidbox
				var fb			= this,
					$fb			= $(this.element),
					$fbThumb	= $fb.find('img').first(),
					$fbGhost	= $fb.find('.fluidbox__ghost'),
					$fbWrap		= $fb.find('.fluidbox__wrap'),
					$fbOverlay	= $fb.find('.fluidbox__overlay');

				// Do not do anything if Fluidbox is not opened/closed, for performance reasons
				if (fb.instanceData.state === null || typeof fb.instanceData.state === typeof undefined || fb.instanceData.state === 0) return false;

				// Update state
				fb.instanceData.state = 0;

				// Emit custom event
				$fb.trigger('closestart.fluidbox');

				// Change classes
				$fb
				.removeClass(function(i,c) {
					return (c.match (/(^|\s)fluidbox--(opened|loaded|loading)+/g) || []).join(' ');
				})
				.addClass('fluidbox--closed');

				$fbGhost
				.css({
					'transform': 'translate(0,0) scale(1,1)',
					top: $fbThumb.offset().top - $fbWrap.offset().top + parseInt($fbThumb.css('borderTopWidth')) + parseInt($fbThumb.css('paddingTop')),
					left: $fbThumb.offset().left - $fbWrap.offset().left + parseInt($fbThumb.css('borderLeftWidth')) + parseInt($fbThumb.css('paddingLeft'))
				});

				$fb.find('.fluidbox__loader')
				.css({
					'transform': 'none'
				});

				$fbGhost.one(customTransitionEnd, function() {
					$fbGhost.css({ opacity: 0 });
					$fbThumb.css({ opacity: 1 });
					$fbOverlay.remove();
					$fbWrap.css({ zIndex: fb.settings.stackIndex - fb.settings.stackIndexDelta });
					$fb.trigger('closeend.fluidbox');
				});

				// Fadeout overlay
				$fbOverlay.css({ opacity: 0 });		
			},
			bindEvents: function() {
				var fb = this,
					$fb = $(this.element);

				// Click handler
				$fb.on('click.fluidbox', function(e) {
					e.preventDefault();

					// Check state
					// If state does not exist, or if Fluidbox is closed, we open it
					if(!fb.instanceData.state || fb.instanceData.state === 0) {

						// Open Fluidbox
						fb.open();

					// If state exists, we close it
					} else {
						
						// Close Fluidbox
						fb.close();
					}
				});
			},
			bindListeners: function() {
				var fb	= this,
					$fb = $(this.element);

				// Window resize
				// Namespaced using unique instance IDs so that we can unbind resize event specific to a Fluidbox instance
				var resizeFunction = function() {
					// Re-measure viewport dimensions
					_fun.measure.viewport();
					_fun.measure.fbElements.call(fb);

					// Re-compute, but only for the active element
					if($fb.hasClass('fluidbox--opened')) fb.compute();
				};
				if ($.isFunction($.throttle)) {
					$w.on('resize.fluidbox'+fb.instanceData.id, $.throttle(fb.settings.resizeThrottle, resizeFunction));
				} else {
					$w.on('resize.fluidbox'+fb.instanceData.id, resizeFunction);
				}

				// Reposition
				$fb.on('reposition.fluidbox', function() {
					fb.reposition();
				});

				// Recompute
				$fb.on('recompute.fluidbox, compute.fluidbox', function() {
					fb.compute();
				});

				// Destroy
				$fb.on('destroy.fluidbox', function() {
					fb.destroy();
				});

				// Close
				$fb.on('close.fluidbox', function() {
					fb.close();
				});
			},
			unbind: function() {
				$(this.element).off('click.fluidbox reposition.fluidbox recompute.fluidbox compute.fluidbox destroy.fluidbox close.fluidbox');
				$w.off('resize.fluidbox'+this.instanceData.id);
			},
			reposition: function() {
				_fun.measure.fbElements.call(this);
			},
			destroy: function() {
				// Cache original node
				var originalNode = this.instanceData.originalNode;

				// Unbind event hanlders
				this.unbind();

				// Destroy plugin data entirely
				$.data(this.element, 'plugin_' + pluginName, null);

				// DOM reversal
				$(this.element)
				.removeClass(function(i,c) {
					return (c.match (/(^|\s)fluidbox[--|__]\S+/g) || []).join(' ');
				})
				.empty()
				.html(originalNode)
				.addClass('fluidbox--destroyed')
				.trigger('destroyed.fluidbox');
			},
			getMetadata: function() {
				// Return instance data
				return this.instanceData;
			}
		});

		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		$.fn[pluginName] = function (options) {

			var args = arguments;

			// Check the options parameter
			// If it is undefined or is an object (plugin configuration),
			// we create a new instance (conditionally, see inside) of the plugin
			if (options === undefined || typeof options === 'object') {

				return this.each(function() {
					// Only if the plugin_fluidbox data is not present,
					// to prevent multiple instances being created
					if (!$.data(this, "plugin_" + pluginName)) {

						$.data(this, "plugin_" + pluginName, new Plugin(this, options));
					}
				});

			// If it is defined, but it is a string, does not start with an underscore and does not call init(),
			// we allow users to make calls to public methods
			} else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
				var returnVal;

				this.each(function() {
					var instance = $.data(this, 'plugin_' + pluginName);
					if (instance instanceof Plugin && typeof instance[options] === 'function') {
						returnVal = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
					} else {
						console.warn('Fluidbox: The method "' + options + '" used is not defined in Fluidbox. Please make sure you are calling the correct public method.');
					}
				});
				return returnVal !== undefined ? returnVal : this;
			}

			// Return to allow chaining
			return this;
		};



})(jQuery, window, document);
