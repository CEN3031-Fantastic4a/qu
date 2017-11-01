'use strict';

describe('Contactus E2E Tests:', function () {
  describe('Test Contactus page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/contactus');
      expect(element.all(by.repeater('contactu in contactus')).count()).toEqual(0);
    });
  });
});
