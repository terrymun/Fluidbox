# Fluidbox
[![Build Status](https://travis-ci.org/terrymun/Fluidbox.svg?branch=master)](https://travis-ci.org/terrymun/Fluidbox) ![Latest Github release](https://img.shields.io/github/release/terrymun/fluidbox.svg?style=flat) ![npm downloads](https://img.shields.io/npm/dm/fluidbox.svg)
![Starred](https://img.shields.io/github/stars/terrymun/fluidbox.svg?style=social&label=Star) ![Watchers](https://img.shields.io/github/watchers/terrymun/fluidbox.svg?style=social&label=Watch)

**If you're using Fluidbox for production, use the [latest stable release](https://github.com/terrymun/Fluidbox/releases) and not the edge release (latest commit).**

Replicating and improving the lightbox module seen on Medium with fluid transitions. [View demo here](http://terrymun.github.io/Fluidbox/). For users who are looking for a quick setup and/or troubleshooting process, refer to [basic usage](#basic), but do not forget to read the [usage precautions](#precautions) and [frequently asked questions](#frequently-asked-questions).

Although not thoroughly tested, Fluidbox should be working in IE ≥10 and all versions of Chrome, Firefox, Safari, iOS Safari and Android Chrome, **with the exception of Opera Mini**. However, I suggest disabling Fluidbox on mobile devices or at small screen resolutions.

Special thanks to the following stellar folks who has helped majorly in making Fluidbox better:

- [@hybernaut](https://github.com/hybernaut) for refactoring the code and reorganizing functions
- [@maxee](https://github.com/maxee) for implementation of a new feature that enables differential image ratios between thumbnails and linked image
- [@benwhilhelm](https://github.com/benwilhelm) for suggesting the immedate open option in Fluidbox. Ben has author a PR, but I have found some issues that I cannot resolve. However, I have adopted his idea and simplified the implementation in **v1.4.3**.
- [@jaechick](https://github.com/jaechick) for creating the LESS file for Fluidbox stylesheet, even though the LESS file is removed from the project as the stylesheet is now being preprocessed by SASS.
- [@_mattbailey](https://twitter.com/_mattbailey) for his [awesome guide towards integrating Grunt into a project](http://mattbailey.io/a-beginners-guide-to-grunt-redux/). This has made building Fluidbox a lot easier.
- [@DJDavid98](https://github.com/DJDavid98) for enabling proper parsing of backgorund image URLs. Note that the URL provided still has to be [RFC3986](http://www.ietf.org/rfc/rfc3986.txt)-compliant.
- [@Gaya](https://github.com/Gaya) for fixing the blurry image issue on OS X / macOS.
- [@Mesoptier](https://github.com/Mesoptier) for cleaning up messy CSS transition declarations.

In addition, a shoutout to:

- [jQuery Boilerplate](https://github.com/jquery-boilerplate/jquery-boilerplate) for their good-to-boot, easy-to-use and standardized jQuery plugin template. Fluidbox is built on the [extended version](https://github.com/jquery-boilerplate/jquery-boilerplate/wiki/Extending-jQuery-Boilerplate).
- [David Walsh](http://davidwalsh.name/css-animation-callback) and [Jonathan Suh](https://jonsuh.com/blog/detect-the-end-of-css-animations-and-transitions-with-javascript/) for their insight on listening to `transitionend` events

## Introduction
Fluidbox was initially a simple personal challenge I set myself, with two simple aims&mdash;to replicate the distraction-free, fluid lightbox seen on [Medium](http://medium.com), and to improve on it such that it will allow linking to a larger-resolution image. The plugin deals with higher resolution, linked images elegantly, such that it only preloads them when users click on the thumbnails, therefore conserving bandwidth usage for your visitors and your server(s).

The plugin is relatively lightweight: 8.74kb (**2.71kb** after gzipped) for the minified JS file, and 2kb (**667b** after gzipped) for the minimal stylesheet.

You can [read my article on Medium](https://medium.com/coding-design/9c7fe9db92c7) about how I got inspiration for this little project of mine, and the basic mechanisms behind the plugin. Some serious math is involved (*nah, not really*).

Moreover, you can [visit the demo of this plugin](http://terrymun.github.io/Fluidbox/) on the project page hosted with GitHub. The plugin v1.22 and onwards (uncompressed, minified and its associated CSS file) is hosted with [CDNJS](http://cdnjs.com/libraries/fluidbox/).

## In the wild
Fluidbox is part of the vast collection of libraries proudly [hosted by CDNJS](http://cdnjs.com/libraries/fluidbox). You can reference all versions of Fluidbox published hitherto from there.

Fluidbox has been implemented on other sites in the wild, too&mdash;check it out:

- [**Gemma Busquets**](http://www.gemmabusquets.com/) by [@imgemmabusquets](https://twitter.com/imgemmabusquets)
- [***Highlight* portfolio theme**](https://portfolios.500px.com/themes/172) by [500px](https://500px.com/)
- [**Terry Mun**](http://terrymun.com/) by *myself*

To add your site that has implemented Fluidbox, or an article/tutorial you have written on Fluidbox use and/or application, feel free to write to me at [@teddyrised](https://twitter.com/teddyrised).

## Installation
To install Fluidbox, you will have to include the following resources in your page. The JS files should be loaded in the order stipulated below. For the CSS file, you can either incorporate it with your site's stylesheet, or load it externally through the `<link>` element in `<head>`.

| Type | File Name            | Description                                                                                                            |
|------|----------------------|------------------------------------------------------------------------------------------------------------------------|
| JS   | [jQuery 1.x](http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js) | **External Dependency**: The *latest verson* of jQuery 1.x library is needed for Fluidbox functionality. Minimum version requirement: v1.7       |
| JS   | [jQuery debounce/throttle plugin](http://cdnjs.cloudflare.com/ajax/libs/jquery-throttle-debounce/1.1/jquery.ba-throttle-debounce.min.js) | **External Dependency**: Ben Alman's plugin is optional, but highly recommended. |
| JS   | `dist/js/jquery.fluidbox.min.js` | Confers the main functionality of Fluidbox. Alternatively, you can load the minified version, `jquery.fluidbox.min.js` |
| CSS  | `dist/css/fluidbox.min.css`   | Offers styles that are crucial for the correct display of Fluidbox. The appearance will break if this is not included. Properties in this file include the necessary vendor prefixes. |

If you are modifying the source in the `src/` directory and wish to rebuild (or make your own build), please refer to the developer notes further down the readme.

### Dependencies
Fluidbox require the following dependencies in order to function properly&mdash;you will have to include them in your page, if you want Fluidbox to work:

- **The latest release of jQuery 1.x** (minimum requirement: jQuery &ge;1.7), available from [Google's jQuery API](http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js) at `http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js`
- **Ben Alman's debounce/throttle plugin**, available from [CDNJS](http://cdnjs.cloudflare.com/ajax/libs/jquery-throttle-debounce/1.1/jquery.ba-throttle-debounce.min.js). This plugin is not compulsory but highly recommended, as it throttles how frequent the window resize event is fired, which triggers recomputing and repositioning of Fluidbox-related elements. Fluidbox will issue a warning, but will still work, if this plugin is not loaded.

## Usage
### Basic
It is rather straightforward to use Fluidbox&mdash;simply chain the `.fluidbox()` method to a selector of your choice. The plugin will automatically check if the selector is:

1. An anchor element (`<a>`)
2. Contains one and only one <code>&lt;img /&gt;</code> element (can be nested as an indirect descendant, to support the HTML5 `<picture>` standard.
4. Is visible upon DOM ready

In the event that the element that satisfies the selector criteria but failed any one of the above criteria, the element will be ignored and the plugin moves on to the next available element. Therefore, it is important that your Fluidbox element(s) follow the following format. The `title` and `alt` attributes of the `<img>` element is not used by the plugin, but the `alt` attribute has to be present for it to be semantically valid.

```html
<a href="/path/to/image">
    <img src="/path/to/image" alt="lorem ipsum" />
</a>
```

...or...

```html
<a href="/path/to/image">
    <picture>
        <source media="(max-width: 650px)" srcset="/path/to/alt/image">
        <!-- img tag for browsers that do not support picture element -->
        <img src="/path/to/image" alt="lorem ipsum">
    </picture>
</a>
```

In your JS file, you can simply chain the `.fluidbox()` method to your selector on DOM ready:

```js
$(function () {
    $('a').fluidbox();
})
```

The selector can be anything of your choice. Let's say you want to target the `<a>` elements specifically in a certain section on your page:
```html
<section id="gallery">
    <h1>Title</h1>
    <p>Introductory text with an <a href="#">unrelated link</a></p>
    <a href="..." rel="lightbox">
        <img src="..." alt="" />
    </a>
</section>
```

Then, you can use, for example:
```js
$(function () {
    $('#gallery a[rel="lightbox"]').fluidbox();
})
```

### Public functions and custom triggers
There are several public functions exposed in the Fluidbox plugin that allows you to manipulate individual Fluidbox instances. There are three ways of calling public functions. Let's say we want to call the `close` method of Fluidbox:

```js
// Method 1: Call as an argument in `.fluidbox()`
$(selector).fluidbox('close.fluidbox');

// Method 2: Call using a custom trigger via `.trigger()`
$(selector).trigger('close.fluidbox');

// Method 3: Call by chaining the `.data('plugin_fluidbox')`
$(selector).data('plugin_fluidbox').close();

```

Here is an example:

```js
$('button').click(function() {
    $(selector)
    .css('width', '200px')
    .fluidbox('recompute'); 
});
```

The list of public methods supported by Fluidbox v2.x is as follow:

| Method              | Version | Description |
|---------------------|---------|-------------|
| `open`              | &ge;2.0     | Triggers the programmatic opening of Fluidbox. |
| `close`             | &ge;2.0     | Triggers the programatic closing of Fluidbox. |
| `compute`           | &ge;2.0     | Triggers (re)computing and positioning of Fluidbox instance. Useful when you are altering the size of the thumbnail (such as DOM manipulation). Remember that the window resize event, which might change the thumbnail dimensions, is listened automatically for you. |
| `destroy`           | &ge;2.0     | Destroys the Fluidbox instance and reinserts the original DOM node. |
| `bindEvents`        | &ge;2.0     | Binds the one and only click event. |
| `bindListeners`     | &ge;2.0     | Binds listeners so that Fluidbox listens to public methods called by the `.trigger()` method. |
| `unbind`            | &ge;2.0     | Unbinds the click events and all other listeners associated with Fluidbox function. |
| `reposition`        | &ge;2.0     | Repositions the ghost element, useful when Fluidbox is not opened, but the thumbnail dimensions are changed. |
| `getMetadata`       | &ge;2.0     | **Getter function**. It returns all the metadata associated with the Fluidbox instance, and does not return the original jQuery object, and is therefore not suitable for chaining. | 

### Custom events
Fluidbox will trigger several distinct namescpaced events depending on the state of the current (and only) instance of Fluidbox. You should use `.on()` to listen to the event being triggered, and can add your own custom callbacks if necessary, for example:

```js
var doSomething = function() {
    // Do something
}

$(selector)
.on('openstart.fluidbox', doSomething)
.on('closeend.fluidbox', function() {
    // Do something else
})
.fluidbox();
```

The list of custom events supported by Fluidbox is as follow. Remember that the events are namespaced:

| Event              | Version | Description |
|--------------------|---------|-------------|
| `openstart.fluidbox`        | &ge;1.4.1   | Fired when a click event is registered from a Fluidbox instance that triggers its opening. This is called **after** the linked image has been successfully loaded. |
| `openend.fluidbox`          | &ge;1.4.1   | Fired when the `transitionend` event is fired (with appropriate vendors supported). This happens when Fluidbox has been scaled to its final size (determined by `viewportScale`, see [configuration](#configuration)). The timing between `openstart` and `openend` are dictated by the `transition-duration` settings in `fluidbox.css`, or any overrides that you have implemented that targets the class `.fluidbox-ghost`. |
| `closestart.fluidbox`       | &ge;1.4.1   | Fired when a click event is registered from a Fluidbox instance that triggers its closing. |
| `closeend.fluidbox`         | &ge;1.4.1   | Fired when the `transitionend` event is fired (with appropriate vendors supported). This happens when Fluidbox has been scaled back to its original thumbnail size on the page. The timing between `closestart` and `closeend` are dictated by the `transition-duration` settings in `fluidbox.css`, or any overrides that you have implemented that targets the class `.fluidbox-ghost`. |
| `computeend.fluidbox` or `recomputeend.fluidbox`     | &ge;1.4.2   | Fired when the Fluidbox ghost element, or the active Fluidbox on display, is recomputed due to layout changes not dependent on the `$(window).resize()` event. This is triggered manually by the custom trigger `recompute` ([see usage instructions](#custom-triggers)). |
| `imageloaddone.fluidbox`    | &ge;1.4.3   | Fired when the target/linked image is successfully loaded. Synonymous with `delayloaddone` if `immediateOpen` option is set to `true`. |
| `imageloadfail.fluidbox`    | &ge;1.4.3   | Fired when the target/linked image fails to load. |
| `thumbloaddone.fluidbox`    | &ge;1.4.3   | Fired when the thumbnail has been loaded. Will only happen once, when `.fluidbox()` is first applied to the element. |
| `thumbloadfail.fluidbox`    | &ge;1.4.3   | Fired when the thumbnail fails to load. Will only happen once, when `.fluidbox()` is first applied to the element. |

There are custom events that were introduced in v1.4.x but are now deprecated because they serve redundant functions:

| Event              | Version | Description |
|--------------------|---------|-------------|
| `resizeend`        | 1.4.1   | **Removed in v2.x**. Fired when the positioning and scale of an opened Fluidbox instance is recalculated and has been transitioned to completion. |
| `delayedloaddone`  | 1.4.3   | **Removed in v2.x**. Fired only when the `immediateOpen` option is set to `true` (see [configuration](#configuration)). Indicates that the target/linked image has been successfully loaded. |
| `delayedreposdone` | 1.4.3   | **Removed in v2.x**. Fired only when the `immediateOpen` option is set to `true` (see [configuration](#configuration)). Indicates that the ghost image has been transformed successfully after retrieving the natural dimensions of the newly loaded image. |

### Previously hidden elements
As of **v1.3.4**, Fluidbox will only work with elements that are visible, i.e. not `display: none`, on the page upon DOM ready. This is because dimensions of hidden images (or images in parents who are hidden) are inaccesible to Fluidbox, resulting in an error. You will have to rebind Fluidbox to the newly revealted elements. Given the example below:

```js
// Apply Fluidbox to elements of interest
$('.gallery a').fluidbox();

// User-triggered event to display gallery
$('#show-gallery').click(function () {
    $(this).next().show();
});
```

```html
<button type="button" id="show-gallery">Show Gallery</button>
<div class="gallery" style="display: none">
    <a href="...">
        <img src="..." alt="" />
    </a>
</div>
```

You will realize that, even after revealing the element, the Fluidbox method is not working for it. That is because non-visible elements, despite satisfying the selector, will not be bound. So, use the following code instead:

```js
// Apply Fluidbox to elements of interest
$('.gallery a').fluidbox();

// User-triggered event to display gallery
$('#show-gallery').click(function () {
    $(this)
        .next()
        .show()             // Show gallery
        .find('a')          // Fluidbox to all elements in gallery
            .fluidbox();
});
```

### Dynamically-added elements
In order to enable Fluidbox functionality to dynamically-added content, you will have to apply `.fluidbox()` to the element of interest after appending it to the DOM. For example, let's say clicking a `<button>` triggers the addition of a new image:

```js
$(function() {
    $('button').click(function(e) {
        e.preventDefault();
        
        // Construct new image
        var $newContent = $('<div><p>This is a new image that is dynamically-added to the page.</p><a href="http://placehold.it/500x500" title="" data-fluidbox><img src="http://placehold.it/200x200" alt="Alternate Text" title="Image Title" /></a></div>');
        
        // Insert new content object into DOM, and then apply .fluidbox to it
        $(this).after($newContent).next().find('a[data-fluidbox]').fluidbox();
    });
));
```

You are of course welcome to use other ways to manipulate and/or transverse the DOM, but you will have to adjust the search/filter function (using `.find()` or other similar jQuery methods) to retrieve the newly inserted content and search for the element of interest where you want Fluidbox to work with.

### Configuration
Fluidbox can be configured according to your needs when calling the `.fluidbox()` method. Fluidbox follows the following model of setting overrides&mdash;**in increasing order of priority**:

1. Default settings in plugin file
2. Custom settings in `.fluidbox()` method
3. Custom settings in the element's HTML5 `data-` attribute:
  - **Note:** In order to ensure that Fluidbox does not clash with commonly-used HTML5 `data-` attributes, it is tuned to listen in to namespaced attributes. For example, for the `immediateOpen` property, the corresponding attribute would be `data-fluidbox-immediate-open`. As per HTML5 specification, you should avoid using camelCase in your HTML5 data attributes because that is parsed into dash-delimited keys by the dataset method (jQuery uses `.data()` as an alias).
  - For boolean attributes, simply specifying the attribute itself constitutes a `="true"` declaration, as per HTML standards

User-defined settings have to be passed as the aforementioned variables/options to the `.fluidbox()` method, i.e.:

```js
$('a').fluidbox({
    viewportFill: 0.8,
    maxWidth: 800,
    loader: true
});
```

You may also pass settings as HTML5 `data- attributes, i.e.:

```html
<a href="/path/to/image" data-fluidbox-viewport-fill="0.8" data-fluidbox-max-width="800" data-fluidbox-loader />
    <img src="/path/to/thumbnail" alt="lorem ipsum" />
</a>
```

The full list of Fluidbox configurations:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `immediateOpen` | Boolean | `false` | Determines if Fluidbox should be opened immediately on click. If set to yes, Fluidbox will open the ghost image and wait for the target image to load. If set to no, Fluidbox will wait for the target image to load, *then* open the ghost image. |
| `loader` | Boolean | `false` | Determines if a loader will be added to the manipulated DOM. It will have the class of `.fluidbox__loader`. |
| `maxWidth` | Integer | `0` | <p>Sets the maximum width, **in screen pixels**, that the ghost image will enlarge to. When set to zero this property is ignored. This property will *not* override the `viewportFill`.</p><p>This option should not be specified (&ge;0) *in lieu* with `maxHeight`. In the event that both `maxWidth` and `maxHeight` are specified (&ge;0), `maxWidth` takes precedence. Fluidbox will throw a warning in the console discouraging this use.</p> |
| `maxHeight` | Integer | `0` | <p>Sets the maximum height, **in screen pixels**, that the ghost image will enlarge to. When set to zero this property is ignored. This property will *not* override the `viewportFill`.</p><p class="user-message warning">This option should not be specified (&ge;0) *in lieu* with `maxWidth`. In the event that both `maxWidth` and `maxHeight` are specified (&ge;0), `maxWidth` takes precedence. Fluidbox will throw a warning in the console discouraging this use.</p> |
| `resizeThrottle` | Integer (milliseconds) | `500` | Determines how much to throttle the viewport resize event that fires recomputing of Fluidbox dimensions and repositioning of the ghost image. |
| `stackIndex` | Integer | `1000` | Determines how high up the z-index will all Fluildbox elements be. Leave this option as default, unless you have other relatively or absolutely positioned elements on the page that is messing with Fluidbox appearance. |
| `stackIndexDelta` | Integer | `10` | Determines how much the z-index will fluctuate from `stackIndex` in order to allow visually-correct stacking of Fluidbox instances. With the default settings, this means that the effective range of z-indexes Fluidbox operates in will be between 990&ndash;1010. For elements that should go under the overlay, they should have a z-index of less than 1000. |
| `viewportFill` | Float (fraction) | `0.95` | Dictates how much the longest axis of the image should fill the viewport. The value will be coerced to fall between 0 and 1. |


## Developer notes
### Building with Grunt
Fluidbox is built using [Grunt](http://gruntjs.com) and [NodeJS](https://nodejs.org/). If you are new to this, kindly refer to [Matt Bailey's excellent guide on setting up Grunt](http://mattbailey.io/a-beginners-guide-to-grunt-redux/). To build Fluidbox, you will need to run `npm install` and install the following dependencies:

| Grunt dependency | Comment |
|------------------|---------|
| [grunt](https://www.npmjs.com/package/grunt) | Grunt is needed to build from source. |
| [time-grunt](https://www.npmjs.com/package/time-grunt) | Keeps track of the time consumed for each time Grunt is run. |
| [load-grunt-config](https://www.npmjs.com/package/load-grunt-config) | Splits up Grunt tasks. |
| [grunt-concurrent](https://www.npmjs.com/package/grunt-concurrent) | Allows multiple Grunt tasks to be run at the same time. |
| [grunt-contrib-clean](https://www.npmjs.com/package/grunt-contrib-clean) | Cleans up the `dist/` directory. |
| [grunt-sass](https://www.npmjs.com/package/grunt-sass) | Parses `.scss` files into `.css`. PostCSS will take over from here. |
| [grunt-contrib-uglify](https://www.npmjs.com/package/grunt-contrib-uglify) | Minifies `.js` files. |
| [grunt-contrib-jshint](https://www.npmjs.com/package/grunt-contrib-jshint) | Needed to perform linting on JS file. |
| [jshint-stylish](https://www.npmjs.com/package/jshint-stylish) | Needed to perform linting on JS file. |
| [grunt-contrib-watch](https://www.npmjs.com/package/grunt-contrib-watch) | Allows you to build on the fly using `$ grunt watch` by watching for file changes, so that you don't have to run `$ grunt` at the project root all the time manually. |
| [grunt-postcss](https://www.npmjs.com/package/grunt-postcss) | Uses PostCSS to dynamically add prefixes and handle minification thereafter. | 

The main tasks are `grunt` or `grunt prod`, which minifies everything and makes it ready for produciton, and `grunt dev` which instead creates a build for testing and development.

#### Configuration
The configuration for each Grunt task can be found in their respecitve `.js` files in the `/grunt` folder.

## Known Issues
### Blurry images in Safari
Fluidbox might render the expanded image in a way that appears to be blurry in OS X / macOS Safari. A fix has been implemented as of v2.0.4 ([#178](https://github.com/terrymun/Fluidbox/pull/178), [issue #168](https://github.com/terrymun/Fluidbox/issues/168)).

### Transition of CSS3 transform in Safari
For inexplicable reason(s), Safari no longer transition CSS transformations (the `scale` component especially) after the first time the Fluidbox has been opened. A simple workaround would be enabling the `immediateOpen` option (i.e. `immediateOpen: true`) when initializing Fluidbox.

## Precautions
### Overflowing content
Fluidbox may not work properly in the event that you have set your parent container, or content wrapping elements, such as `<div id="#content">` and the likes, to hide their overflowing content, i.e. `overflow: hidden`. This is because the enlarged image is **positioned relatively to its hyperlink**, and not absolutely or fixed within the viewport.

### Interaction with other positioned elements on the same page
When you want an absolutely/fixed-positioned element on the page to not be obscured by the dynamically-generated wrapping element, you should use a z-index of between 1000 to 1010. 1000 is set as the default `stackIndex` of Fluidbox, while 10 is set as the default `stackIndexDelta`, which is toggled on/off depending on the state of the Fluidbox. These settings can be individually tuned, see **Configuration** below.

### Binding Fluidbox to previously hidden images
As Fluidbox requires access to the final calculation dimensions of the image in question in order to (1) position the ghost element correctly and (2) calculate the correct scale factor and transform values, it will only bind to images that are visible upon DOM ready. If you are relying on dynamic events (e.g. [user-triggered](#previously-hidden-elements), [AJAX-loaded](#dynamically-added-elements) and etc.) to trigger a later appearance of an image, rebind Fluidbox to freshly revealed elements. This also applies to dynamically-loaded content, see demo for a working example.

### Derped ghost element calculations in flexbox layouts
In some cases&mdash;which I have also experienced myself&mdash;the ghost element that overlays the thumbnail might have incorrect dimensions being calculated. This is because its dimensions are calculation on DOM ready by retrieving the computed dimensions of the underlying image. When the flexbox layout is active, the browser might change the dimensions of the image when `flex-grow` and/or `flex-shrink` are enabled (i.e. set to a non-zero integer). The cause is likely to be that the browser receives information on the image dimensions after DOM ready and then resizes the flex containers, which happens *after* the computed widths are fed to Fluidbox calculations.

In this case, I strongly recommend triggering the `recomputer` custom trigger (see above) after *all* images in the flexbox container has loaded. You can do this upon `$(window).load()`, but you can also use jQuery deferred objects and promises to do so. Let's say we have a flexbox container with the class of `.flex`:

```js
// Do this AFTER Fluidbox has been initialized
$('.flex').each(function() {
    var images = [],
        $fb = $(this).find('a.fluidbox');

    $f.find('img').each(function() {
        var image = $.Deferred();
        $(this).load(image.resolve).error(image.resolve);
        images.push(image);
    });

    $.when.apply(null, images).done(function() {
        $fb.trigger('recompute');
    });
});
```

### Accidental creation of new stacking contexts
There are a few CSS properties, when applied to the wrapping parent of elements meant for the `.fluidbox()` method, causes a new stacking context to be created&mdash;this leads to an issue where an opened Fluidbox instance will fail to cover its neighbouring elements.

They are, in alphabetical order but not exhaustively so:
- CSS3 regions<sup>1</sup>
- filter<sup>1, 2</sup>
- flex<sup>3</sup>
- isolation<sup>3</sup>
- mix-blend-mode<sup>3</sup>
- opacity<sup>1</sup>
- position<sup>1, 3</sup>
- paged media<sup>1</sup>
- transform<sup>1</sup>
- will-change<sup>3</sup>

Sources:

  1. [*What No One Told You About Z-Index*](http://philipwalton.com/articles/what-no-one-told-you-about-z-index/) by Philip Walton
  2. [*Why does stacking order change on webkit filter hover?*](http://stackoverflow.com/a/25764603/395910) on StackOverflow
  3. [*The stacking context*](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Understanding_z_index/The_stacking_context) on MDN

## Frequently Asked Questions
1.  **Fluidbox is not working in my installation. Where should I start?**  
Start by checking your browser's console log. What error messages do you see? Also, make sure that you are using the *latest* version of jQuery 1.x (minimum requirement: v1.8 or above) and that the dependencies have been loaded successfully. Also, did you remember reading the [usage precautions](#precautions)? You might have encountered a scenario where Fluidbox is not designed to handle.

2.  **Do you plan to implement [insert feature]?**  
Fluidbox is conceived as a means to simplify lightboxes. Therefore, I plan to keep Fluidbox as simple as it is, without additional features, such as captioning (there are other limitations to this, too) and gallery features. However, you can always fork and modify Fluidbox to your personal liking. Manual captioning is possible, refer to the [advanced demo].

3. **The image url isn't being interpretted correctly.**  
Fluidbox fetches the larger image based on the URL specified in the `href` attribute if the wrapping anchor (`<a>`) tag.

4. **I have a application-specific problem that I need help troubleshooting. Can you help me?**  
*Of course!* I am more than happy to help, but it really depends if you have a clear problem statement and a [minimal, complete and verifiable example (MCVE)](http://stackoverflow.com/help/mcve) that I can play around with&mdash;I strongly encourage you to host your reduced test case(s) with either [JSFiddle](http://jsfiddle.net/), [CodePen](http://codepen.io/) or the likes. Then, [create a new issue](https://github.com/terrymun/Fluidbox/issues). I promise I will get back to you when I have time.

5. **Do you provide private support by email / phone call / Skype call / (insert any other forms of communication)?**  
Since Fluidbox is provided as-is and free-of-charge, I am sorry to inform you that it is so far not possible for me to dedicate so much effort. However, you can follow what is described in step #4.


## Licensing: MIT License
This plugin is licensed under the MIT License.
