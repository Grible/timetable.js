/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(2);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*jshint -W079*/



window.Timetable = function () {
	this.scope = {
		hourStart: 9,
		hourEnd: 17
	};
	this.locations = [];
	this.events = [];
};

Timetable.Renderer = function (tt) {
	if (!(tt instanceof Timetable)) {
		throw new Error('Initialize renderer using a Timetable');
	}
	this.timetable = tt;
};

(function () {
	function isValidHourRange(start, end) {
		return isValidHour(start) && isValidHour(end);
	}
	function isValidHour(number) {
		return isInt(number) && isInHourRange(number);
	}
	function isInt(number) {
		return number === parseInt(number, 10);
	}
	function isInHourRange(number) {
		return number >= 0 && number < 24;
	}
	function locationExistsIn(loc, locs) {
		return locs.indexOf(loc) !== -1;
	}
	function isValidTimeRange(start, end) {
		var correctTypes = start instanceof Date && end instanceof Date;
		var correctOrder = start < end;
		return correctTypes && correctOrder;
	}
	function getDurationHours(startHour, endHour) {
		return endHour >= startHour ? endHour - startHour : 24 + endHour - startHour;
	}
	function isValidDate(dateString) {
		var isValid = false;
		var date;
		if (typeof dateString !== 'string') {
			return false;
		}
		date = new Date(dateString);

		if (Object.prototype.toString.call(date) === '[object Date]') {
			if (isNaN(date.getTime())) {
				return false;
			} else {
				//Need regExp check for month and day
				isValid = true;
			}
		} else {
			return false;
		}
		return isValid;
	}
	function prettyFormat(number) {
		var prefix = number < 10 ? '0' : '';
		return prefix + number;
	}
	//return the name of the month
	var monthes = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
	function localeMonths(month) {
		if (!month || month < 0 && month > 11) {
			throw new Error('Incorrect month.');
		}
		return monthes[month];
	}
	//Formate date to DD MMM YYYY
	function formatedDate(dateString) {
		if (!isValidDate(dateString)) {
			throw new Error('Incorrect date format.');
		}
		var date = new Date(dateString);
		return prettyFormat(date.getDate()) + ' ' + localeMonths(date.getMonth()) + ' ' + date.getFullYear();
	}

	Timetable.prototype = {
		options: {
			footer: false,
			header: '',
			date: '' //Use dateString in ISO8601 or IETF RFC 2822 format
		},
		setScope: function (start, end) {
			if (isValidHourRange(start, end)) {
				this.scope.hourStart = start;
				this.scope.hourEnd = end;
			} else {
				throw new RangeError('Timetable scope should consist of (start, end) in whole hours from 0 to 23');
			}

			return this;
		},
		//Set header with current date
		setCurrentDate: function () {
			this.options.date = new Date();
			return this.options.date;
		},
		//Set header with user's date
		setDate: function (date) {
			if (!isValidDate(date)) {
				throw new Error('Wrong date format. Use ISO-8601 or IETF RFC 2822 date format.');
			}
			this.options.date = date;
			return this.options.date;
		},
		//Set footer with time(clone header)
		setFooter: function () {
			this.options.footer = true;
		},
		getOptions: function () {
			return this.options;
		},
		addLocations: function (newLocations) {
			function hasProperFormat() {
				return newLocations instanceof Array;
			}

			var existingLocations = this.locations;

			if (hasProperFormat()) {
				newLocations.forEach(function (loc) {
					if (!locationExistsIn(loc, existingLocations)) {
						existingLocations.push(loc);
					} else {
						throw new Error('Location already exists');
					}
				});
			} else {
				throw new Error('Tried to add locations in wrong format');
			}

			return this;
		},
		addEvent: function (name, location, start, end, options) {
			if (!locationExistsIn(location, this.locations)) {
				throw new Error('Unknown location');
			}
			if (!isValidTimeRange(start, end)) {
				throw new Error('Invalid time range: ' + JSON.stringify([start, end]));
			}

			var optionsHasValidType = Object.prototype.toString.call(options) === '[object Object]';

			this.events.push({
				name: name,
				location: location,
				startDate: start,
				endDate: end,
				options: optionsHasValidType ? options : undefined
			});

			return this;
		}
	};

	function emptyNode(node) {
		while (node.firstChild) {
			node.removeChild(node.firstChild);
		}
	}

	function prettyFormatHour(hour) {
		var prefix = hour < 10 ? '0' : '';
		return prefix + hour + ':00';
	}

	Timetable.Renderer.prototype = {
		draw: function (selector) {
			function checkContainerPrecondition(container) {
				if (container === null) {
					throw new Error('Timetable container not found');
				}
			}
			function appendTimetableAside(container) {
				var asideNode = container.appendChild(document.createElement('aside'));
				var asideULNode = asideNode.appendChild(document.createElement('ul'));
				appendRowHeaders(asideULNode);
			}
			function appendRowHeaders(ulNode) {
				for (var k = 0; k < timetable.locations.length; k++) {
					var liNode = ulNode.appendChild(document.createElement('li'));
					var spanNode = liNode.appendChild(document.createElement('span'));
					spanNode.className = 'row-heading';
					spanNode.textContent = timetable.locations[k];
				}
			}
			function appendTimetableSection(container) {
				var sectionNode = container.appendChild(document.createElement('section'));
				var timeNode = sectionNode.appendChild(document.createElement('time'));
				appendColumnHeaders(timeNode);
				appendTimeRows(timeNode);
			}
			function appendColumnHeaders(node) {
				var headerNode = node.appendChild(document.createElement('header'));
				if (timetable.options.date !== '') {
					appendColumnDateHeaders(headerNode);
				}
				var headerULNode = headerNode.appendChild(document.createElement('ul'));

				var completed = false;
				var looped = false;

				headerULNode.className = 'headerTimeUl';
				for (var hour = timetable.scope.hourStart; !completed;) {
					var liNode = headerULNode.appendChild(document.createElement('li'));
					var spanNode = liNode.appendChild(document.createElement('span'));
					spanNode.className = 'time-label';
					spanNode.textContent = prettyFormatHour(hour);

					if (hour === timetable.scope.hourEnd && (timetable.scope.hourStart !== timetable.scope.hourEnd || looped)) {
						completed = true;
					}
					if (++hour === 24) {
						hour = 0;
						looped = true;
					}
				}
			}
			function appendColumnDateHeaders(node) {
				var headerULNode = node.appendChild(document.createElement('ul'));
				node.parentNode.getElementsByTagName('header')[0].style.height = '92px';
				container.getElementsByTagName('aside')[0].style.marginTop = '92px';

				var liNodeDay = headerULNode.appendChild(document.createElement('li'));
				var divNodeDay = liNodeDay.appendChild(document.createElement('div'));
				var liNodeNextDay = headerULNode.appendChild(document.createElement('li'));
				var divNodeNextDay = liNodeNextDay.appendChild(document.createElement('div'));
				divNodeDay.className = 'time-label';
				divNodeDay.textContent = formatedDate(timetable.options.date);
				divNodeNextDay.className = 'time-label';
				headerULNode.className = 'headerDateUl';

				if (timetable.scope.hourEnd < timetable.scope.hourStart) {
					var nextDay = new Date(timetable.options.date);
					nextDay.setDate(nextDay.getDate() + 1);
					divNodeNextDay.textContent = formatedDate(nextDay.toString());
					liNodeDay.style.width = (24 - timetable.scope.hourStart) * 96 + 'px';
					liNodeNextDay.style.width = timetable.scope.hourEnd * 96 + 'px';
				} else {
					liNodeDay.style.width = getDurationHours * 96 + 'px';
				}
			}
			function appendTimeRows(node) {
				var ulNode = node.appendChild(document.createElement('ul'));
				var footer = timetable.options.footer ? node.appendChild(document.createElement('footer')) : false;
				if (footer) {
					footer.appendChild(node.getElementsByClassName('headerTimeUl')[0].cloneNode(true));
				}

				ulNode.className = 'room-timeline';
				for (var k = 0; k < timetable.locations.length; k++) {
					var liNode = ulNode.appendChild(document.createElement('li'));
					appendLocationEvents(timetable.locations[k], liNode); /**/
				}
			}
			function appendLocationEvents(location, node) {
				for (var k = 0; k < timetable.events.length; k++) {
					var event = timetable.events[k];
					if (event.location === location) {
						appendEvent(event, node);
					}
				}
			}
			function appendEvent(event, node) {
				var hasOptions = event.options !== undefined;
				var hasURL,
				    hasAdditionalClass,
				    hasDataAttributes = false;

				if (hasOptions) {
					hasURL = event.options.url !== undefined ? true : false;
					hasAdditionalClass = event.options.class !== undefined ? true : false;
					hasDataAttributes = event.options.data !== undefined ? true : false;
				}

				var elementType = hasURL ? 'a' : 'span';
				var aNode = node.appendChild(document.createElement(elementType));
				var smallNode = aNode.appendChild(document.createElement('small'));
				aNode.title = event.name;

				if (hasURL) {
					aNode.href = event.options.url;
				}
				if (hasDataAttributes) {
					for (var key in event.options.data) {
						aNode.setAttribute('data-' + key, event.options.data[key]);
					}
				}

				aNode.className = hasAdditionalClass ? 'time-entry ' + event.options.class : 'time-entry';
				aNode.style.width = computeEventBlockWidth(event);
				aNode.style.left = computeEventBlockOffset(event);
				smallNode.textContent = event.name;
			}
			function computeEventBlockWidth(event) {
				var start = event.startDate;
				var end = event.endDate;
				var durationHours = computeDurationInHours(start, end);
				return durationHours / scopeDurationHours * 100 + '%';
			}
			function computeDurationInHours(start, end) {
				return (end.getTime() - start.getTime()) / 1000 / 60 / 60;
			}
			function computeEventBlockOffset(event) {
				var scopeStartHours = timetable.scope.hourStart;
				var eventStartHours = event.startDate.getHours() + event.startDate.getMinutes() / 60;
				var hoursBeforeEvent = getDurationHours(scopeStartHours, eventStartHours);
				return hoursBeforeEvent / scopeDurationHours * 100 + '%';
			}

			var timetable = this.timetable;
			var scopeDurationHours = getDurationHours(timetable.scope.hourStart, timetable.scope.hourEnd);
			var container = document.querySelector(selector);
			checkContainerPrecondition(container);
			emptyNode(container);
			appendTimetableAside(container);
			appendTimetableSection(container);
		}
	};
})();

module.exports.Timetable = Timetable;
module.exports.Timetable.Renderer = Timetable.Renderer;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);