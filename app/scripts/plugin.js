/*jshint -W079*/

'use strict';

var Timetable = function() {
	this.scope = {
		hourStart: 9,
		hourEnd: 17
	};
	this.locations = [];
	this.events = [];
};

Timetable.Renderer = function(tt) {
	if (!(tt instanceof Timetable)) {
		throw new Error('Initialize renderer using a Timetable');
	}
	this.timetable = tt;
};

(function() {
	function isValidHourRange(start, end) {
		return isValidHour(start) && isValidHour(end) && start < end;
	}
	function isValidHour(number) {
		return isInt(number) && isInHourRange(number);
	}
	function isInt(number) {
		return number === parseInt(number, 10);
	}
	function isInHourRange(number) {
		return number >= 0 && number <= 24;
	}
	function locationExistsIn(loc, locs) {
		return locs.indexOf(loc) !== -1;
	}
	function isValidTimeRange(start, end) {
		var correctTypes = start instanceof Date && end instanceof Date;
		var correctOrder = start.getHours() < end.getHours() || (start.getHours() === end.getHours() && start.getMinutes() < end.getMinutes());
		return correctTypes && correctOrder;
	}

	Timetable.prototype = {
		setScope: function(start, end) {
			if (isValidHourRange(start, end)) {
				this.scope.hourStart = start;
				this.scope.hourEnd = end;
			} else {
				throw new RangeError('Timetable scope should consist of (start, end) in whole hours between 0 and 24');
			}

			return this;
		},
		addLocations: function(newLocations) {
			function hasProperFormat() {
				return newLocations instanceof Array;
			}

			var existingLocations = this.locations;

			if (hasProperFormat()) {
				newLocations.forEach(function(loc) {
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
		addEvent: function(name, location, start, end, url) {
			if (!locationExistsIn(location, this.locations)) {
				throw new Error('Unknown location');
			}
			if (!isValidTimeRange(start, end)) {
				throw new Error('Invalid time range: ' + JSON.stringify([start, end]));
			}

			this.events.push({
				name: name,
				location: location,
				startDate: start,
				endDate: end,
				url: url
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
		draw: function(selector) {
			var timetable = this.timetable;

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
				for (var k=0; k<timetable.locations.length; k++) {
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
				var headerULNode = headerNode.appendChild(document.createElement('ul'));
				for (var hour=timetable.scope.hourStart; hour <= timetable.scope.hourEnd; hour++) {
					var liNode = headerULNode.appendChild(document.createElement('li'));
					var spanNode = liNode.appendChild(document.createElement('span'));
					spanNode.className = 'time-label';
					spanNode.textContent = prettyFormatHour(hour);
				}
			}
			function appendTimeRows(node) {
				var ulNode = node.appendChild(document.createElement('ul'));
				ulNode.className = 'room-timeline';
				for (var k=0; k<timetable.locations.length; k++) {
					var liNode = ulNode.appendChild(document.createElement('li'));
					appendLocationEvents(timetable.locations[k], liNode);
				}
			}
			function appendLocationEvents(location, node) {
				for (var k=0; k<timetable.events.length; k++) {
					var event = timetable.events[k];
					if (event.location === location) {
						appendEvent(event, node);
					}
				}
			}
			function appendEvent(event, node) {
				var aNode = node.appendChild(document.createElement('a'));
				var smallNode = aNode.appendChild(document.createElement('small'));
				aNode.title = event.name;
				aNode.href = event.url;
				aNode.className = 'time-entry';
				aNode.style.width = computeEventBlockWidth(event);
				aNode.style.left = computeEventBlockOffset(event);
				smallNode.textContent = event.name;

				// <a class="time-entry" title="Zumba" href="#" style="width: 7.1428%; left: 7.1428%"><small>Zumba</small></a>
			}
			function computeEventBlockWidth(event) {
				var start = event.startDate;
				var end = event.endDate;
				var durationHours = end.getHours() - start.getHours();
				var minuteDiff = end.getMinutes() - start.getMinutes();
				durationHours += minuteDiff / 60;
				var scopeDurationHours = timetable.scope.hourEnd - timetable.scope.hourStart;
				return durationHours / scopeDurationHours * 100 + '%';
			}
			function computeEventBlockOffset(event) {
				var start = event.startDate;
				var startHours = start.getHours() + (start.getMinutes() / 60);
				var scopeDurationHours = timetable.scope.hourEnd - timetable.scope.hourStart;
				return (startHours - timetable.scope.hourStart) / scopeDurationHours * 100 + '%';
			}

			var container = document.querySelector(selector);
			checkContainerPrecondition(container);
			emptyNode(container);
			appendTimetableAside(container);
			appendTimetableSection(container);
		}
	};

})();

