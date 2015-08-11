# Timetable.js
Vanilla javascript plugin for building nice responsive timetables. Provides a simple javascript interface to add events and locations which can be rendered to nice HTML. Works on mobile devices as well. Check the **demo** at [http://timetablejs.org](http://timetablejs.org).

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
```
Add some locations:
```javascript
timetable.addLocations(['Silent Disco', 'Nile', 'Len Room', 'Maas Room']);
```
Add your events using `addEvent(name, location, startDate, endDate[, url])`:
```javascript
timetable.addEvent('Frankadelic', 'Nile', new Date(2015,7,17,10,45), new Date(2015,7,17,12,30));
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
// dimensions
$timetable-hour-column-width: 96px !default
$timetable-hour-row-height: 46px !default
$timetable-heading-height: 30px !default
$timetable-breakpoint: "only screen and (max-width: 960px)" !default
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
```

Alternatively you could override the css styles manually.

## Browser support
Timetable.js has been designed to work with modern browsers (only). It has been tested with the latest version of the most common browsers.

## Contributing
Please use the Github issue tracker for issues/feature requests. We use Gulp for development and Mocha with Chai for unit testing. The styles are defined in SASS. Feel free to comment/contribute.
