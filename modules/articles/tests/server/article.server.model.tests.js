'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Spot = mongoose.model('Spot');

/**
 * Globals
 */
var user,
  spot;

/**
 * Unit tests
 */
describe('Parking Spots Model Unit Tests:', function () {
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
        spot = new Spot({
          address: 'Test Street Address',
          city_name: 'Gainesville',
          postal_code: '32601',
          status: true,
          user: user
        });

        done();
      })
      .catch(done);
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(10000);
      spot.save(function (err) {
        should.not.exist(err);
        return done();
      });
    });

    it('should be able to show an error when try to save without address', function (done) {
      spot.address = '';

      spot.save(function (err) {
        should.exist(err);
        return done();
      });
    });
  });

  afterEach(function (done) {
    Spot.remove().exec()
      .then(User.remove().exec())
      .then(done())
      .catch(done);
  });
});
