'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Spot = mongoose.model('Spot'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  spot;

/**
 * Spot routes tests
 */
describe('Parking Spot Admin CRUD tests', function () {
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
      roles: ['user', 'admin'],
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

        done();
      })
      .catch(done);
  });

  it('should be able to save a parking spot if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new parking spot
        agent.post('/api/articles')
          .send(spot)
          .expect(200)
          .end(function (spotSaveErr, spotSaveRes) {
            // Handle spot save error
            if (spotSaveErr) {
              return done(spotSaveErr);
            }

            // Get a list of spots
            agent.get('/api/articles')
              .end(function (spotsGetErr, spotsGetRes) {
                // Handle spot save error
                if (spotsGetErr) {
                  return done(spotsGetErr);
                }

                // Get spots list
                var spots = spotsGetRes.body;

                // Set assertions
                (spots[0].user._id).should.equal(userId);
                (spots[0].address).should.match('444 Newell Drive');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to update a spot if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new spot
        agent.post('/api/articles')
          .send(spot)
          .expect(200)
          .end(function (spotSaveErr, spotSaveRes) {
            // Handle spot save error
            if (spotSaveErr) {
              return done(spotSaveErr);
            }

            // Update spot street address
            spot.address = '1545 W University Ave';

            // Update an existing spot
            agent.put('/api/articles/' + spotSaveRes.body._id)
              .send(spot)
              .expect(200)
              .end(function (spotUpdateErr, spotUpdateRes) {
                // Handle spot update error
                if (spotUpdateErr) {
                  return done(spotUpdateErr);
                }

                // Set assertions
                (spotUpdateRes.body._id).should.equal(spotSaveRes.body._id);
                (spotUpdateRes.body.address).should.match('1545 W University Ave');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save a spot if no street address is provided', function (done) {
    // Invalidate streetAddress field
    spot.address = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new spot
        agent.post('/api/articles')
          .send(spot)
          .expect(422)
          .end(function (spotSaveErr, spotSaveRes) {
            // Set message assertion
            (spotSaveRes.body.message).should.match('Address cannot be blank');

            // Handle spot save error
            done(spotSaveErr);
          });
      });
  });

  it('should be able to delete a spot if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new spot
        agent.post('/api/articles')
          .send(spot)
          .expect(200)
          .end(function (spotSaveErr, spotSaveRes) {
            // Handle spot save error
            if (spotSaveErr) {
              return done(spotSaveErr);
            }

            // Delete an existing spot
            agent.delete('/api/articles/' + spotSaveRes.body._id)
              .send(spot)
              .expect(200)
              .end(function (spotDeleteErr, spotDeleteRes) {
                // Handle spot error error
                if (spotDeleteErr) {
                  return done(spotDeleteErr);
                }

                // Set assertions
                (spotDeleteRes.body._id).should.equal(spotSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a single spot if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new spot model instance
    spot.user = user;
    var spotObj = new Spot(spot);

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new spot
        agent.post('/api/articles')
          .send(spot)
          .expect(200)
          .end(function (spotSaveErr, spotSaveRes) {
            // Handle spot save error
            if (spotSaveErr) {
              return done(spotSaveErr);
            }

            // Get the spot
            agent.get('/api/articles/' + spotSaveRes.body._id)
              .expect(200)
              .end(function (spotInfoErr, spotInfoRes) {
                // Handle spot error
                if (spotInfoErr) {
                  return done(spotInfoErr);
                }

                // Set assertions
                (spotInfoRes.body._id).should.equal(spotSaveRes.body._id);
                (spotInfoRes.body.address).should.equal(spot.address);
                (spotInfoRes.body.city_name).should.equal(spot.city_name);
                (spotInfoRes.body.postal_code).should.equal(spot.postal_code);

                // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                (spotInfoRes.body.isCurrentUserOwner).should.equal(true);

                // Call the assertion callback
                done();
              });
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
