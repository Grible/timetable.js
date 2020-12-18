# Timetable.js
Vanilla javascript plugin for building nice responsive timetables. Provides a simple javascript interface to add events and locations which can be rendered to nice HTML. Works on mobile devices as well.

**Note: This project is currently outdated.**
I'm planning to blow new life into it by building a new version. Could use your input to understand the use cases better. **Could you help this project with [2min for this survey](https://i9xod19i5wu.typeform.com/to/oGijDc9H)?** 🙏

## Just show me the demo
Okay: [**demo**](http://timetablejs.grible.co). Also, have a look at the website: [http://timetablejs.org](http://timetablejs.org).

## Installation
Install with bower, or alternatively download the [ZIP](https://github.com/Grible/timetable.js/archive/master.zip):

```
bower install timetable
```

Load the plugin and styles in your HTML from the `dist` folder:
```html
<link rel="stylesheet" href="timetablejs.css">

<script src="timetable.min.js"></script>
```
Add a timetable placeholder:
```html
<div class="timetable"></div>
```

## Usage
Make a timetable object, optionally set the scope in hours (the visible hours in the timetable):
```javascript
var timetable = new Timetable();
timetable.setScope(9, 17); // optional, only whole hours between 0 and 23
timetable.useTwelveHour(); //optional, displays hours in 12 hour format (1:00PM)
```
Add some locations:
```javascript
timetable.addLocations(['Silent Disco', 'Nile', 'Len Room', 'Maas Room']);
```
Add your events using `addEvent(name, location, startDate, endDate[, options])`:
```javascript
timetable.addEvent('Frankadelic', 'Nile', new Date(2015,7,17,10,45), new Date(2015,7,17,12,30));
```

In addition, you can pass options through an object (optional):
```javascript
var options = {
  url: '#', // makes the event clickable
  class: 'vip', // additional css class
  data: { // each property will be added to the data-* attributes of the DOM node for this event
    id: 4,
    ticketType: 'VIP'
  },
  onClick: function(event, timetable, clickEvent) {} // custom click handler, which is passed the event object and full timetable as context  
};
timetable.addEvent('Jam Session', 'Nile', new Date(2015,7,17,21,15), new Date(2015,7,17,23,30), options);
 ```

Last, render the thing in your previously created timetable placeholder:
```javascript
var renderer = new Timetable.Renderer(timetable);
renderer.draw('.timetable'); // any css selector
```
That's it!

## Changing the looks
Instead of adding the `timetablejs.css` directly to your HTML, you could import `app/styles/plugin.sass` to your own SASS file. All colors and spacing values are defined as default variables which you can easily override. These are the defaults:
```sass
// general
$timetable-use-sticky-header: false !default

// dimensions
$timetable-hour-column-width: 96px !default
$timetable-hour-row-height: 46px !default
$timetable-heading-height: 30px !default

// colors & decoration
$timetable-grid-color: #E5E5E5 !default
$timetable-grid: 1px solid $timetable-grid-color !default
$timetable-row-header-padding: 15px !default
$timetable-row-header-color: #EFEFEF !default
$timetable-legend-row-separator: 1px solid white !default
$timetable-entry-row-separator: none !default
$timetable-row-header-gap: 5px solid transparent !default
$timetable-row-uneven-color: #FDFDFD !default
$timetable-row-even-color: #F4F4F4 !default
$timetable-entry-color: #EC6A5E !default
$timetable-entry-color-hover: darken($timetable-entry-color, 10%) !default
$timetable-entry-border: 1px solid darken($timetable-entry-color, 15%) !default
$timetable-entry-padding: 10px !default
$timetable-background-color: white !default
```

The option `$timetable-use-sticky-header` makes the time indicator stick to the top of the screen while scrolling down, which can be very pleasant with large timetables or on mobile devices. Note that this is not yet widely supported in browsers, although all modern (non-IE) browsers support it. Browsers that don't support it will fall back to a non-sticky header automatically. [More info here](https://caniuse.com/#feat=css-sticky). 

Alternatively you could override the css styles manually.

## Browser support
Timetable.js has been designed to work with modern browsers (only). It has been tested with the latest version of the most common browsers.

## Contributing
Please use the Github issue tracker for issues/feature requests. We use Gulp for development and Mocha with Chai for unit testing. The styles are defined in SASS. Feel free to comment/contribute.
