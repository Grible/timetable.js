(function () {
  'use strict';

  beforeEach(function() {
    this.timetable = new Timetable();
  });

  describe('Timetable', function () {
    it('should by default set its scope from 9 to 17 hours', function () {
      expect(this.timetable.scope).to.be.equal({hourStart: 9, hourEnd: 17});
    });
    it('should allow to set its scope between 0 and 24 hours', function () {
      var outOfRange = new RangeError('Timetable scope must be between 0 and 24 hours (start, end)');
      var badType = new TypeError('Timetable scope should consist of (start, end) in whole hours from 0 to 24');
      expect(this.timetable.setScope(0, 24).scope).to.be.equal({hourStart: 0, hourEnd: 24});
      expect(this.timetable.setScope(1, 20).scope).to.be.equal({hourStart: 1, hourEnd: 20});
      expect(this.timetable.setScope(1, 25)).to.throw(outOfRange);
      expect(this.timetable.setScope(-1, 1)).to.throw(outOfRange);
      expect(this.timetable.setScope(1, 0)).to.throw(outOfRange);
      expect(this.timetable.setScope(20)).to.throw(badType);
      expect(this.timetable.setScope(undefined)).to.throw(badType);
    });
  });
})();
