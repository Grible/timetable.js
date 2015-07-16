(function () {
  'use strict';

  beforeEach(function() {
    this.timetable = new Timetable();
  });

  describe('Timetable', function () {

    it('should by default set its scope from 9 to 17 hours', function () {
      expect(this.timetable.scope).to.deep.equal({hourStart: 9, hourEnd: 17});
    });

    it('should allow to set its scope in hours with maximum 24 hours span', function () {
      var errorMsg = 'Timetable scope should consist of (start, end) in whole hours from 0 to 23';
      var tt = this.timetable;
      expect(tt.setScope(1, 20).scope).to.deep.equal({hourStart: 1, hourEnd: 20});
      expect(tt.setScope(0, 0).scope).to.deep.equal({hourStart: 0, hourEnd: 0});
      expect(function(){tt.setScope(1, 24);}).to.throw(RangeError, errorMsg);
      expect(function(){tt.setScope(-1, 1);}).to.throw(RangeError, errorMsg);
      expect(function(){tt.setScope(1, 0);}).not.to.throw(RangeError, errorMsg);
      expect(function(){tt.setScope(3, 1);}).not.to.throw(RangeError, errorMsg);
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

    it('should be possible to add events for an existing location using js dates', function () {
      var tt = this.timetable;
      tt.addLocations(['loc1', 'loc2', 'loc5']);

      expect(tt.addEvent('Zumba', 'loc2', new Date(2015,7,17,9), new Date(2015,7,17,17), '#').events[0]).to.deep.equal({name: 'Zumba', location: 'loc2', startDate: new Date(2015,7,17,9), endDate: new Date(2015,7,17,17), url: '#'});
      expect(tt.addEvent('DIY Fireworks', 'loc1', new Date(2015,7,17,10,30), new Date(2015,7,17,11,15), '#').events[1]).to.deep.equal({name: 'DIY Fireworks', location: 'loc1', startDate: new Date(2015,7,17,10,30), endDate: new Date(2015,7,17,11,15), url: '#'});
      expect(tt.addEvent('DIY Fireworks', 'loc5', new Date(2015,7,17,20,30), new Date(2015,7,18,0,15)).events[2]).to.deep.equal({name: 'DIY Fireworks', location: 'loc5', startDate: new Date(2015,7,17,20,30), endDate: new Date(2015,7,18,0,15), url: undefined});
      expect(function(){tt.addEvent('DIY Fireworks', 'Area 51', new Date(2015,7,17,10), new Date(2015,7,17,11), '#');}).to.throw('Unknown location');
      expect(function(){tt.addEvent('DIY Fireworks', 'loc2', new Date(2015,7,17,10,1), new Date(2015,7,17,10), '#');}).to.throw('Invalid time range');
      expect(function(){tt.addEvent('DIY Fireworks', 'loc2', new Date(2015,7,17,10), new Date(2015,7,17,9), '#');}).to.throw('Invalid time range');
    });

  });

})();
