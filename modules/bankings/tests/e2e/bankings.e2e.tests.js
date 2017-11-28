'use strict';

describe('Bankings E2E Tests:', function () {
  describe('Test Bankings page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/bankings');
      expect(element.all(by.repeater('banking in bankings')).count()).toEqual(0);
    });
  });
});
