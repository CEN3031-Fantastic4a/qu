'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Contactu = mongoose.model('Contactu');

/**
 * Globals
 */
var user,
  contactus;

/**
 * Unit tests
 */
describe('Contact Us Model Unit Tests:', function () {
  this.timeout(15000);
  beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3',
      provider: 'local'
    });

    user.save()
    .then(function () {
      done();
    })
    .catch(done);
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(10000);
      contactus = new Contactu({
        message: 'test message'
      });

      contactus.save(function (err) {
        should.not.exist(err);
        return done();
      });
    });

    it('should be able to show an error when try to save without message', function (done) {
      contactus = new Contactu();
      contactus.save(function (err) {
        should.exist(err);
        return done();
      });
    });
  });

  afterEach(function (done) {
    Contactu.remove().exec()
      .then(User.remove().exec())
      .then(done())
      .catch(done);
  });
});
