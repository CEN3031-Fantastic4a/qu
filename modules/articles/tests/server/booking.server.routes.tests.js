'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Spot = mongoose.model('Spot'),
  Booking = mongoose.model('Booking'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  diffCredentials,
  user,
  diffUser,
  spot,
  booking;


/**
 * Booking routes tests
 */
describe('Booking CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose.connection.db);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      usernameOrEmail: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.usernameOrEmail,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new booking
    user.save()
        .then(function () {
          spot = {
            address: 'Test Address',
            postal_code: '32601',
            city_name: 'Gainesville'
          };
        })
        .then(function () {
          booking = {
            user: user._id,
            booking_date: Date.now,
            booking_time: Date.now
          };
          done();
        })
        .catch(done);

    // Create user credentials
    diffCredentials = {
      usernameOrEmail: 'diffuser',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    diffUser = new User({
      firstName: 'Different',
      lastName: 'Name',
      displayName: 'Different Name',
      email: 'diff@test.com',
      username: diffCredentials.usernameOrEmail,
      password: diffCredentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new booking
    diffUser.save();
  });

  it('should not be able to book a spot if not logged in', function (done) {
    agent.post('/api/bookings')
      .send(booking)
      .expect(403)
      .end(function (bookingSaveErr, bookingSaveRes) {
        // Call the assertion callback
        done(bookingSaveErr);
      });
  });

  it('should be able to update a booking if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/articles')
          .send(booking)
          .expect(200)
          .end(function (bookingSaveErr, bookingSaveRes) {
            // Call the assertion callback
            done();
          });
      });
  });

  it('should not be able to get a list of spots booked if not signed in', function (done) {
    // Create new booking model instance
    var bookingObj = new Booking(booking);

    // Save the booking
    bookingObj.save(function () {
      // Request bookings
      agent.get('/api/bookings')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('message', 'User is not authorized');

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single booking which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent booking
    agent.get('/api/bookings/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No booking with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should not be able to delete a booking if signed in with a different account', function (done) {
    agent.post('/api/auth/signin')
      .send(diffCredentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.put('/api/articles')
          .send(booking)
          .expect(403)
          .end(function (bookingSaveErr, bookingSaveRes) {
            // Call the assertion callback
            done(bookingSaveErr);
          });
      });
  });

  it('should not be able to delete a booking if not signed in', function (done) {
    // Set parking spot user
    spot.user = user;

    // Create new parking spot model instance
    var spotObj = new Spot(spot);

    // Save the parking spot
    spotObj.save(function () {
      // Try deleting spot
      agent.delete('/api/articles/' + spotObj._id)
        .expect(403)
        .end(function (spotDeleteErr, spotDeleteRes) {
          // Set message assertion
          (spotDeleteRes.body.message).should.match('User is not authorized');

          // Handle spot error error
          done(spotDeleteErr);
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
