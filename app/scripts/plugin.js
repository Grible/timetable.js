/*jshint -W079*/

'use strict';

var Timetable = function() {
	this.scope = {
		hourStart: 9,
		hourEnd: 17
	};
	this.locations = [];
};

Timetable.prototype = {
	setScope: function(start, end) {
		function isValidHour(number) {
			return isInt(number) && isInHourRange(number);
		}
		function isInt(number) {
			return number === parseInt(number, 10);
		}
		function isInHourRange(number) {
			return number >= 0 && number <= 24;
		}

		if (isValidHour(start) && isValidHour(end) && start < end) {
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
				if (existingLocations.indexOf(loc) === -1) {
					existingLocations.push(loc);
				} else {
					throw new Error('Location already exists');
				}
			});
		} else {
			throw new Error('Tried to add locations in wrong format');
		}

		return this;
	}
};
