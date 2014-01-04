# Fluidbox
Replicating and improving the lightbox module seen on Medium with fluid transitions.

## Introduction
Fluidbox was initially a simple personal challenge I set myself, with two simple aims &mdash; to replicate the distraction-free, fluid lightbox seen on [Medium](http://medium.com), and to improve on it such that it will allow linking to a larger-resolution image. The plugin deals with higher resolution, linked images elegantly, such that it only preloads them when users click on the thumbnails, therefore conserving bandwidth usage for your visitors and your server(s).

You can [visit the demo of this plugin](http://terrymun.github.io/Fluidbox/) on the project page hosted with GitHub.

## Usage
### Basic
It is rather straightforward to use Fluidbox &mdash; simply chain the `.fluidbox()` method to a selector of your choice. The plugin will automatically check if the selector is:

1. An anchor element
2. Contains one and *only* one child
3. The only children is an `<img>` element

In the event that the element that satisfies the selector criteria but failed any one of the above criteria, the element will be ignored and the plugin moves on to the next available element. Therefore, it is important that your Fluidbox element(s) follow the following format. The `title` and `alt` attributes of the `<img>` element is not used by the plugin, but the `alt` attribute has to be present for it to be semantically valid.

    <a href="...">
        <img src="..." alt="" />
    </a>

In your JS file, you can simply chain the `.fluidbox()` method to your selector on DOM ready:

    $(function () {
        $('.gallery a, a[rel="lightbox"]').fluidbox();
    })

### Configuration
Fluidbox can be configured according to your needs. The following options are available:

- `viewportFill` (numerical) &mdash; dictates how much the longest axis of the image should fill the viewport. The default value is `0.95`.
- `debounceResize` (boolean) &mdash; dictates if the `$(window).resize()` event should be debounced for performance reason. The default value is `true` (debouncing turned on by default).
- `closeTrigger` (array with objects) &mdash; dictates what event triggers closing the single instance of an opened Fluidbox. The default setup is as follow:
  `closeTrigger: [{ selector: '#fluidbox-overlay', event: 'click' }]`

This will have the effect of binding the click event to the overlay, so that when user click on the overlay, the Fluidbox instance that is opened will be closed. It is also possible to bind other events to trigger the same effect. For example, if you would want to close the Fluidbox when the viewport is resized, you can do the following:

    $(function () {
        $('a').fluidbox({
            closeTrigger: [
                {selector: '#fluidbox-overlay', event: 'click'},
                {selector: 'window', event: 'resize'}
            ]
        })
    })

### Notes
As Fluidbox relies on CSS transforms, it only works with thumbnails that share the same aspect ratio with their higher resolution counterparts, otherwise the larger image will be cropped off, i.e. a square thumbnail linking to a landscape photo will cause the landscape photo to appear in a square frame. Fluidbox, serving as an alternative lightbox module, also assume that the image you have linked contains sufficient resolution to be displayed on the monitor &mdash; low resolution images will scale poorly on a large display.

## Dependencies
Fluidbox require the following dependencies in order to function properly &mdash; you will have to include them in your page, if you want Fluidbox to work:

- **The latest release of jQuery 1.x**, available from [Google's jQuery API](http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js) at `http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js`
- **imagesloaded jQuery plugin**, available from [GitHub](https://github.com/desandro/imagesloaded) at `https://github.com/desandro/imagesloaded`

Fluidbox allows you to throttle the `$(window).resize()` event, and this is only possible with [Paul Irish's debounced resize function](www.paulirish.com/2009/throttled-smartresize-jquery-event-handler/). The small script has been included in the plugin by default, but I would like to extend my gratitude to Paul for making it available, and for allowing me to include it in this plugin.
