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
			if (!isValidHourRange(start, end)) {
				throw new Error('Invalid hour range');
			}

			this.events.push({
				name: name,
				location: location,
				hourStart: start,
				hourEnd: end,
				url: url
			});

			return this;
		}
	};

})();

