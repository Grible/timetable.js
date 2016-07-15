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

      var optionsWithURL = {
        url: '#'
      };

      var optionsWithClass = {
        class: 'vip-only'
      };

      var optionsWithURLAndClass = {
        url: '#',
        class: 'vip-only'
      };

      var optionsWithDataAttributes = {
        url: '#',
        data: {
          maxPlayers: '12',
          gameType: 'Muskets'
        }
      };

      expect(tt.addEvent('Zumba', 'loc2', new Date(2015,7,17,9), new Date(2015,7,17,17), optionsWithURL).events[0]).to.deep.equal({name: 'Zumba', location: 'loc2', startDate: new Date(2015,7,17,9), endDate: new Date(2015,7,17,17), options: { url: '#' }});
      expect(tt.addEvent('Private concert', 'loc1', new Date(2015,7,17,9), new Date(2015,7,17,17), optionsWithClass).events[1]).to.deep.equal({name: 'Private concert', location: 'loc1', startDate: new Date(2015,7,17,9), endDate: new Date(2015,7,17,17), options: { class: 'vip-only' }});
      expect(tt.addEvent('DIY Fireworks', 'loc1', new Date(2015,7,17,10,30), new Date(2015,7,17,11,15), optionsWithURL).events[2]).to.deep.equal({name: 'DIY Fireworks', location: 'loc1', startDate: new Date(2015,7,17,10,30), endDate: new Date(2015,7,17,11,15), options: { url: '#' }});
      expect(tt.addEvent('Afterparty', 'loc2', new Date(2015,7,17,22,30), new Date(2015,7,17,23,15), optionsWithURLAndClass).events[3]).to.deep.equal({name: 'Afterparty', location: 'loc2', startDate: new Date(2015,7,17,22,30), endDate: new Date(2015,7,17,23,15), options: { url: '#', class: 'vip-only' }});
      expect(tt.addEvent('DIY Fireworks', 'loc5', new Date(2015,7,17,20,30), new Date(2015,7,18,0,15)).events[4]).to.deep.equal({name: 'DIY Fireworks', location: 'loc5', startDate: new Date(2015,7,17,20,30), endDate: new Date(2015,7,18,0,15), options: undefined});
      expect(tt.addEvent('City Tour', 'loc1', new Date(2015,7,17,20,30), new Date(2015,7,18,0,15), 'some string').events[5]).to.deep.equal({name: 'City Tour', location: 'loc1', startDate: new Date(2015,7,17,20,30), endDate: new Date(2015,7,18,0,15), options: undefined});
      expect(tt.addEvent('Pub Crawl', 'loc1', new Date(2015,7,17,21,30), new Date(2015,7,18,2,0), []).events[6]).to.deep.equal({name: 'Pub Crawl', location: 'loc1', startDate: new Date(2015,7,17,21,30), endDate: new Date(2015,7,18,2,0), options: undefined });
      expect(tt.addEvent('Pub Crawl', 'loc1', new Date(2015,7,17,21,30), new Date(2015,7,18,2,0), optionsWithDataAttributes).events[7]).to.deep.equal({name: 'Pub Crawl', location: 'loc1', startDate: new Date(2015,7,17,21,30), endDate: new Date(2015,7,18,2,0), options: { url: '#', data: { maxPlayers: '12', gameType: 'Muskets' } } });
      expect(function(){tt.addEvent('DIY Fireworks', 'Area 51', new Date(2015,7,17,10), new Date(2015,7,17,11), optionsWithURL);}).to.throw('Unknown location');
      expect(function(){tt.addEvent('DIY Fireworks', 'loc2', new Date(2015,7,17,10,1), new Date(2015,7,17,10), optionsWithURL);}).to.throw('Invalid time range');
      expect(function(){tt.addEvent('DIY Fireworks', 'loc2', new Date(2015,7,17,10), new Date(2015,7,17,9), optionsWithURL);}).to.throw('Invalid time range');

    });

  });

})();
