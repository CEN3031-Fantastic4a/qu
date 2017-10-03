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
 * Article routes tests
 */
describe('Parking Spot CRUD tests', function () {

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

    // Save a user to the test db and create new article
    user.save()
      .then(function () {
        spot = {
          address: 'Test Address',
          postal_code: '32601',
          city_name: 'Gainesville'
        };

        done();
      })
      .catch(done);
  });

  it('should not be able to save a parking spot if logged in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/articles')
          .send(spot)
          .expect(403)
          .end(function (spotSaveErr, spotSaveRes) {
            // Call the assertion callback
            done(spotSaveErr);
          });

      });
  });

  it('should not be able to save a spot if not logged in', function (done) {
    agent.post('/api/articles')
      .send(spot)
      .expect(403)
      .end(function (spotSaveErr, spotSaveRes) {
        // Call the assertion callback
        done(spotSaveErr);
      });
  });

  it('should not be able to update a parking spot if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/articles')
          .send(spot)
          .expect(403)
          .end(function (spotSaveErr, spotSaveRes) {
            // Call the assertion callback
            done(spotSaveErr);
          });
      });
  });

  it('should be able to get a list of spots if not signed in', function (done) {
    // Create new spot model instance
    var spotObj = new Spot(spot);

    // Save the article
    spotObj.save(function () {
      // Request spots
      agent.get('/api/articles')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single spot if not signed in', function (done) {
    // Create new spot model instance
    var spotObj = new Spot(spot);

    // Save the spot
    spotObj.save(function () {
      agent.get('/api/articles/' + spotObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('address', spot.address);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single spot with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    agent.get('/api/articles/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Parking Spot is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single spot which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent spot
    agent.get('/api/articles/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No spot with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should not be able to delete an spot if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/articles')
          .send(spot)
          .expect(403)
          .end(function (spotSaveErr, spotSaveRes) {
            // Call the assertion callback
            done(spotSaveErr);
          });
      });
  });

  it('should not be able to delete a spot if not signed in', function (done) {
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

  it('should be able to get a single spot that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      usernameOrEmail: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin']
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new spot
          agent.post('/api/articles')
            .send(spot)
            .expect(200)
            .end(function (spotSaveErr, spotSaveRes) {
              // Handle spot save error
              if (spotSaveErr) {
                return done(spotSaveErr);
              }

              // Set assertions on new spot
              (spotSaveRes.body.address).should.equal(spot.address);
              (spotSaveRes.body.city_name).should.equal(spot.city_name);
              (spotSaveRes.body.postal_code).should.equal(spot.postal_code);
              should.exist(spotSaveRes.body.user);
              should.equal(spotSaveRes.body.user._id, orphanId);

              // force the spot to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
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
                        should.equal(spotInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single spot if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new spot model instance
    var spotObj = new Spot(spot);

    // Save the spot
    spotObj.save(function (err) {
      if (err) {
        return done(err);
      }
      agent.get('/api/articles/' + spotObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('address', spot.address);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single spot, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      usernameOrEmail: 'spotowner',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create user that will create the Spot
    var _spotOwner = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin', 'user']
    });

    _spotOwner.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Spot
      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var userId = _user._id;

          // Save a new spot
          agent.post('/api/articles')
            .send(spot)
            .expect(200)
            .end(function (spotSaveErr, spotSaveRes) {
              // Handle spot save error
              if (spotSaveErr) {
                return done(spotSaveErr);
              }

              // Set assertions on new spot
              (spotSaveRes.body.address).should.equal(spot.address);
              (spotSaveRes.body.city_name).should.equal(spot.city_name);
              (spotSaveRes.body.postal_code).should.equal(spot.postal_code);
              should.exist(spotSaveRes.body.user);
              should.equal(spotSaveRes.body.user._id, userId);

              // now signin with the test suite user
              agent.post('/api/auth/signin')
                .send(credentials)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
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
                      (spotInfoRes.body.postal_code).should.equal(spot.postal_code);                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (spotInfoRes.body.isCurrentUserOwner).should.equal(false);

                      // Call the assertion callback
                      done();
                    });
                });
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
