'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Spot = mongoose.model('Spot'),
  Booking = mongoose.model('Booking');

/**
 * Globals
 */
var user,
  spot,
  booking;

/**
 * Unit tests
 */
describe('Booking Model Unit Tests:', function () {
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
        address: '111 Newell Drive',
        postal_code: '32601',
        city_name: 'Gainesville'
      });
    })
    .then(function () {
      booking = new Booking({
        user: user._id,
        spot: spot._id
      });
      done();
    })
    .catch(done);
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(10000);
      booking.save(function (err) {
        should.not.exist(err);
        return done();
      });
    });
  });

  afterEach(function (done) {
    Booking.remove().exec()
      .then(Spot.remove().exec())
      .then(User.remove().exec())
      .then(done())
      .catch(done);
  });
});
