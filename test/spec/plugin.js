(function () {
  'use strict';

  beforeEach(function() {
    this.timetable = new Timetable();
  });

  describe('Timetable', function () {

    it('should by default set its scope from 9 to 17 hours', function () {
      expect(this.timetable.scope).to.deep.equal({hourStart: 9, hourEnd: 17});
    });

    it('should allow to set its scope between 0 and 24 hours', function () {
      var errorMsg = 'Timetable scope should consist of (start, end) in whole hours between 0 and 24';
      var tt = this.timetable;
      expect(tt.setScope(0, 24).scope).to.deep.equal({hourStart: 0, hourEnd: 24});
      expect(tt.setScope(1, 20).scope).to.deep.equal({hourStart: 1, hourEnd: 20});
      expect(function(){tt.setScope(1, 25);}).to.throw(RangeError, errorMsg);
      expect(function(){tt.setScope(-1, 1);}).to.throw(RangeError, errorMsg);
      expect(function(){tt.setScope(1, 0);}).to.throw(RangeError, errorMsg);
      expect(function(){tt.setScope(20);}).to.throw(RangeError, errorMsg);
      expect(function(){tt.setScope(undefined);}).to.throw(RangeError, errorMsg);
    });

    it('should allow to add a list of locations', function () {
      var tt = this.timetable;

      expect(tt.addLocations(['loc1', 'loc2']).locations).to.deep.equal(['loc1', 'loc2']);
      expect(tt.addLocations(['loc3']).locations).to.deep.equal(['loc1', 'loc2', 'loc3']);
      expect(function(){tt.addLocations(['loc3']);}).to.throw('Location already exists');
      expect(function(){tt.addLocations(undefined);}).to.throw('Tried to add locations in wrong format');
      expect(function(){tt.addLocations({});}).to.throw('Tried to add locations in wrong format');
    });

    it('should be possible to add events for an existing location', function () {
      var tt = this.timetable;
      tt.addLocations(['loc1', 'loc2']);

      expect(tt.addEvent('Zumba', 'loc2', 9, 17, '#').events[0]).to.deep.equal({name: 'Zumba', location: 'loc2', hourStart: 9, hourEnd: 17, url: '#'});
      expect(tt.addEvent('DIY Fireworks', 'loc1', 10, 11, '#').events[1]).to.deep.equal({name: 'DIY Fireworks', location: 'loc1', hourStart: 10, hourEnd: 11, url: '#'});
      expect(function(){tt.addEvent('DIY Fireworks', 'Area 51', 10, 11, '#');}).to.throw('Unknown location');
      expect(function(){tt.addEvent('DIY Fireworks', 'loc2', 10, 25, '#');}).to.throw('Invalid hour range');
      expect(function(){tt.addEvent('DIY Fireworks', 'loc2', 10, 9, '#');}).to.throw('Invalid hour range');
    });

  });

})();
