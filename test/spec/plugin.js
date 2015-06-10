(function () {
  'use strict';

  describe('timetable.js', function () {

    it('should have a hello message', function () {
      expect(new Timetable().message).to.be.equal('hello world!');
    });
  });
})();
