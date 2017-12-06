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
  spot;


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

    // Save a user to the test db and create new parking spot
    user.save()
    .then(function () {
      spot = {
        address: '444 Newell Drive',
        postal_code: '32611',
        city_name: 'Gainesville'
      };
    })
    .then(function () {
      // Create Parking Spot
      agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/parking')
          .send(spot)
          .expect(200)
          .end(function (spotSaveErr, spotSaveRes) {
            spot = spotSaveRes.body;

              // Logout
            agent.get('/api/auth/signout')
              .expect(302)
              .end(function (signoutErr, signoutRes) {
                if (signoutErr) {
                  return done(signoutErr);
                }
                signoutRes.redirect.should.equal(true);
                return done();
              });
          });
      });
    }).catch(done);
  });

  it('should be able to book a spot if logged in', function (done) {
    var booking = new Booking({
      spot: spot._id
    });

    agent.post('/api/auth/signin')
    .send(diffCredentials)
    .expect(200)
    .end(function (signinErr, signinRes) {
      // Handle signin error
      if (signinErr) {
        return done(signinErr);
      }

      agent.post('/api/bookings')
        .send(booking)
        .expect(200)
        .end(function (bookingSaveErr, bookingSaveRes) {
            // Call the assertion callback
          done();
        });
    });
  });

  /* it('should not be able to book a spot if booking times conflict', function (done) {
    var booking = new Booking({
      spot: spot._id,
      entry_date_time: new Date('2017-05-18T16:00:00Z'),
      exit_date_time: new Date('2017-05-18T18:00:00Z')
    });

    agent.post('/api/auth/signin')
    .send(diffCredentials)
    .expect(200)
    .end(function (signinErr, signinRes) {
      // Handle signin error
      if (signinErr) {
        return done(signinErr);
      }

      agent.post('/api/bookings')
        .send(booking)
        .expect(200)
        .end(function (bookingSaveErr, bookingSaveRes) {
          var diffBooking = new Booking({
            spot: spot._id,
            entry_date_time: new Date('2017-05-18T17:00:00Z'),
            exit_date_time: new Date('2017-05-18T19:00:00Z')
          });

          agent.post('/api/bookings')
            .send(diffBooking)
            .expect(403)
            .end(function (bookingOverwriteErr, bookingOverwriteRes) {
              // Call the assertion callback
              done(bookingOverwriteErr);
            });
        });
    });
  }); */

  it('should not be able to book a spot if not logged in', function (done) {
    var booking = new Booking({ spot: spot._id });
    agent.post('/api/bookings-user/')
      .send(booking)
      .expect(403)
      .end(function (bookCreateErr, bookCreateRes) {
        done(bookCreateErr);
      });
  });

  it('should be able to update a booking if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(diffCredentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        var booking = new Booking({ user: diffUser._id, spot: spot._id });
        agent.post('/api/bookings-user')
          .send(booking)
          .expect(200)
          .end(function (bookingSaveErr, bookingSaveRes) {
            // Handle booking save error
            if (bookingSaveErr) {
              return done(bookingSaveErr);
            }
            // Change property of booking
            booking.total_time = 2;

            agent.put('/api/bookings-user/' + bookingSaveRes.body._id)
              .send(booking)
              .expect(200)
              .end(function (bookingUpdateErr, bookingUpdateRes) {
                // Handle booking update error
                if (bookingUpdateErr) {
                  return done(bookingUpdateErr);
                }

                // Set assertions
                (bookingUpdateRes.body._id).should.equal(bookingSaveRes.body._id);
                (bookingUpdateRes.body.total_time).should.match(booking.total_time);
                done();
              });
          });
      });
  });

  it('should not be able to update a booking if not signed in', function (done) {
    var bookingObj = new Booking({ user: diffUser._id, spot: spot._id });

    bookingObj.save(function () {
      // Try updating spot
      agent.put('/api/bookings-user/' + bookingObj._id)
      .expect(403)
      .end(function (bookingUpdateErr, bookingUpdateRes) {
        // Set message assertion
        (bookingUpdateRes.body.message).should.match('User is not authorized');

        // Handle spot error error
        done(bookingUpdateErr);
      });
    });
  });

  it('should be able to get a list of bookings by the user if signed in', function (done) {
    var booking = new Booking();
    agent.post('/api/auth/signin')
    .send(diffCredentials)
    .expect(200)
    .end(function (signinErr, signinRes) {
      // Handle signin error
      if (signinErr) {
        return done(signinErr);
      }

      booking = new Booking({
        user: diffUser._id,
        spot: spot._id
      });

      agent.post('/api/bookings-user/')
      .send(booking)
      .expect(200)
      .end(function (bookingSaveErr, bookingSaveRes) {
        agent.get('/api/bookings-user/')
          .end(function (req, res) {
            // Set assertion
            res.body.should.be.instanceof(Array).and.have.lengthOf(1);

            // Call the assertion callback
            done();
          });
      });
    });
  });

  it('should not be able to get a list of user bookings if not signed in', function (done) {
    // Create new booking model instance
    var bookingObj = new Booking(new Booking());

    // Save the booking
    bookingObj.save(function () {
      // Request bookings
      agent.get('/api/bookings-user/')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('message', 'User is not authorized');

          // Call the assertion callback
          done();
        });
    });
  });

  it('should not return proper error for single booking which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent booking
    agent.get('/api/bookings-user/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No booking with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single booking which doesnt exist, if signed in', function (done) {
    // This is a valid mongoose Id but a non-existent booking
    agent.get('/api/bookings-user/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No booking with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should not be able to delete a booking if signed in with a different account', function (done) {
    var booking = new Booking({ user: user._id, spot: spot._id });

    agent.post('/api/auth/signin')
      .send(diffCredentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }
        booking.save(function () {
          agent.delete('/api/bookings-user/' + booking._id)
            .send(booking)
            .expect(403)
            .end(function (bookingDeleteErr, bookingDeleteRes) {
              // Call the assertion callback
              done(bookingDeleteErr);
            });
        });
      });
  });

  it('should not be able to delete a booking if not signed in', function (done) {
    // Create new booking model instance
    var bookingObj = new Booking({ user: diffUser._id });

    // Save the booking
    bookingObj.save(function () {
      // Try deleting spot
      agent.delete('/api/bookings-user/' + bookingObj._id)
        .expect(403)
        .end(function (bookingDeleteErr, bookingDeleteRes) {
          // Set message assertion
          (bookingDeleteRes.body.message).should.match('User is not authorized');

          // Handle spot error error
          done(bookingDeleteErr);
        });

    });
  });

  it('should be able to delete a booking if signed in', function (done) {
    agent.post('/api/auth/signin')
    .send(diffCredentials)
    .expect(200)
    .end(function (signinErr, signinRes) {
      // Handle signin error
      if (signinErr) {
        return done(signinErr);
      }

      agent.post('/api/auth/signin')
      .send(diffCredentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        var booking = new Booking({ user: diffUser._id, spot: spot._id });
        agent.post('/api/bookings-user/')
          .send(booking)
          .expect(200)
          .end(function (bookingSaveErr, bookingSaveRes) {
            // Handle booking save error
            if (bookingSaveErr) {
              return done(bookingSaveErr);
            }

            agent.delete('/api/bookings-user/' + bookingSaveRes.body._id)
              .send(booking)
              .expect(200)
              .end(function (bookingDeleteErr, bookingDeleteRes) {
                // Handle booking delete error
                if (bookingDeleteErr) {
                  return done(bookingDeleteErr);
                }
                // Set assertions
                // (bookingDeleteRes.body._id).should.equal(bookingObj._id);
                (bookingDeleteRes.body._id).should.equal(bookingSaveRes.body._id);
                done();
              });
          });
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
