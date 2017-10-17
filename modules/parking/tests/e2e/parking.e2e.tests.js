'use strict';

describe('Parking E2E Tests:', function () {
  describe('Test parking page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/parking');
      expect(element.all(by.repeater('spot in spots')).count()).toEqual(0);
    });
  });
});
