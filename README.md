# Fluidbox
Replicating and improving the lightbox module seen on Medium with fluid transitions. [View demo here](http://terrymun.github.io/Fluidbox/).

## Introduction
Fluidbox was initially a simple personal challenge I set myself, with two simple aims &mdash; to replicate the distraction-free, fluid lightbox seen on [Medium](http://medium.com), and to improve on it such that it will allow linking to a larger-resolution image. The plugin deals with higher resolution, linked images elegantly, such that it only preloads them when users click on the thumbnails, therefore conserving bandwidth usage for your visitors and your server(s).

You can [read my article on Medium](https://medium.com/coding-design/9c7fe9db92c7) about how I got inspiration for this little project of mine, and the basic mechanisms behind the plugin. Some serious math is involved (*nah, not really*).

Moreover, you can [visit the demo of this plugin](http://terrymun.github.io/Fluidbox/) on the project page hosted with GitHub.

## Changelog
| Version | Comments |
|---------|----------|
| 1.2.0   | Official release |
| 1.2.1   | Minor bug fixes |
| 1.2.2   | Changed positioning of overlay, to ensure that it works in pages with absolutely- or relatively-positioned parent/wrapper elements with z-indexs specified |

## Installation
To install Fluidbox, you will have to include the following resources in your page. The JS files should be loaded in the order stipulated below. For the CSS file, you can either incorporate it with your site's stylesheet, or load it externally through the `<link>` element in `<head>`.

| Type | File Name            | Description                                                                                                            |
|------|----------------------|------------------------------------------------------------------------------------------------------------------------|
| JS   | [jQuery 1.x](http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js) | **External Dependency**: The *latest verson* of jQuery 1.x library is needed for Fluidbox functionality.       |
| JS   | [imagesLoaded plugin](https://github.com/desandro/imagesloaded)           | **External Dependency**: imagesLoaded plugins is needed to check if images marked for Fluidbox display has been successfully loaded.                  |
| JS   | `jquery.fluidbox.js` | Confers the main functionality of Fluidbox. Alternatively, you can load the minified version, `jquery.fluidbox.min.js` |
| CSS  | `css/fluidbox.css`   | Offers styles that are crucial for the correct display of Fluidbox. The appearance will break if this is not included. |

## Usage
### Basic
It is rather straightforward to use Fluidbox &mdash; simply chain the `.fluidbox()` method to a selector of your choice. The plugin will automatically check if the selector is:

1. An anchor element
2. Contains one and *only* one child
3. The only children is an `<img>` element

In the event that the element that satisfies the selector criteria but failed any one of the above criteria, the element will be ignored and the plugin moves on to the next available element. Therefore, it is important that your Fluidbox element(s) follow the following format. The `title` and `alt` attributes of the `<img>` element is not used by the plugin, but the `alt` attribute has to be present for it to be semantically valid.

```html
<a href="...">
    <img src="..." alt="" />
</a>
```

In your JS file, you can simply chain the `.fluidbox()` method to your selector on DOM ready:

```js
$(function () {
    $('.gallery a, a[rel="lightbox"]').fluidbox();
})
```

### Some precautions
Fluidbox may not work properly in the event that you have set your parent container, or content wrapping elements, such as `<div id="#content">` and the likes, to hide their overflowing content, i.e. `overflow: hidden`. This is because the enlarged image is **positioned relatively to its hyperlink**, and not absolutely or fixed within the viewport.

### Configuration
Fluidbox can be configured according to your needs. The following options are available:

| Option           | Type      | Default value | Description                           |
|------------------|-----------|---------------|---------------------------------------|
| `viewportFill`   | Numerical | 0.95          | Dictates how much the longest axis of the image should fill the viewport. The default value will make the image fill 95% of the viewport dimension along its longest axis |
| `overlayColor`   | String    | `rgba(255,255,255,.85)` | Sets the `background-color` property of Fluidbox overlay. Defaults to white with an opacity of 0.85. |
| `debounceResize` | Boolean   | true          | Dictates if the `$(window).resize()` event should be debounced for performance reason. This feature leverages the [small snippet kindly provided by Paul Irish](http://www.paulirish.com/2009/throttled-smartresize-jquery-event-handler/). |
| `closeTrigger`   | Array     | *see below*  | Dictates what event triggers closing of an opened Fluidbox. The default setup binds the click handler to the overlay. |

#### Note on `closeTrigger` option
The default setup will have the effect of binding the click event to the overlay, so that when user click on the overlay, the Fluidbox instance that is opened will be closed:

```js
// Default option
closeTrigger: [
    {
        selector: '#fluidbox-overlay',
        event: 'click'
    },
    {
        selector: 'document',
        event: 'keyup',
        keyCode: 27
    }
]
```

----

It is also possible to bind other events to trigger the same effect. For example, if you would want to close the Fluidbox when the viewport is resized, you can do the following:

```js
$(function () {
    $('a').fluidbox({
        closeTrigger: [
            {selector: '#fluidbox-overlay', event: 'click'},
            {selector: 'window', event: 'resize'}
        ]
    });
});
```

This will have the effect of doing so (where `closeFb` is the internal function in the plugin needed to close any opened Fluidbox):

```js
$(document).on('click', '#fluidbox-overlay', closeFb);
$(window).on('resize', closeFb);
```

----

You can even bind event to multiple selectors, and vice versa. The syntax of dictating so is similar to constructing event handler binding using the `.on()` method, so if you are [familiar with its use](http://api.jquery.com/on/), dictating your own closeTrigger should not be too difficult:

```js
$(function () {
    $('a').fluidbox({
        closeTrigger: [
            {selector: '#fluidbox-overlay', event: 'click'},
            {selector: 'window',            event: 'resize scroll'},
            {selector: '#ele1, #ele2',     event: 'hover'}
        ]
    });
});
```

This will have the effect of doing so:

```js
$(document).on('click', '#fluidbox-overlay', closeFb);
$(window).on('resize', closeFb);
$(document).on('hover', '#ele1, #ele2', closeFb)
```

### Notes
As Fluidbox relies on CSS transforms, it only works with thumbnails that share the same aspect ratio with their higher resolution counterparts, otherwise the larger image will be cropped off, i.e. a square thumbnail linking to a landscape photo will cause the landscape photo to appear in a square frame. Fluidbox, serving as an alternative lightbox module, also assume that the image you have linked contains sufficient resolution to be displayed on the monitor &mdash; low resolution images will scale poorly on a large display.

## Dependencies
Fluidbox require the following dependencies in order to function properly &mdash; you will have to include them in your page, if you want Fluidbox to work:

- **The latest release of jQuery 1.x** (minimum requirement: jQuery &gt;1.7), available from [Google's jQuery API](http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js) at `http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js`
- **imagesloaded jQuery plugin**, available from [GitHub](https://github.com/desandro/imagesloaded) at `https://github.com/desandro/imagesloaded`

Fluidbox allows you to throttle the `$(window).resize()` event, and this is only possible with [Paul Irish's debounced resize function](http://www.paulirish.com/2009/throttled-smartresize-jquery-event-handler/). The small script has been included in the plugin by default, but I would like to extend my gratitude to Paul for making it available, and for allowing me to include it in this plugin.

## Frequently Asked Quesitons
1.  **Fluidbox is not working in my installation. Where should I start?**  
Start by checking your browser's console log. What error messages do you see? Also, make sure that you are using the *latest* version of jQuery 1.x (minimum requirement: v1.8 or above)
    
2.  **Do you plan to implement [insert feature]?**  
Fluidbox is conceived as a means to simplify lightboxes. Therefore, I plan to keep Fluidbox as simple as it is, without additional features, such as captioning (there are other limitations to this, too) and gallery features. However, you can always fork and modify Fluidbox to your perosnal liking.

## Licensing: GNU General Public License
This plugin is licensed unter the GNU General Public License.
