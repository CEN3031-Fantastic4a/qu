'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Banking = mongoose.model('Banking'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  banking;

/**
 * Banking routes tests
 */
describe('Banking CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Banking
    user.save(function () {
      banking = {
        name: 'Banking name'
      };

      done();
    });
  });

  it('should be able to save a Banking if logged in', function (done) {
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

        // Save a new Banking
        agent.post('/api/bankings')
          .send(banking)
          .expect(200)
          .end(function (bankingSaveErr, bankingSaveRes) {
            // Handle Banking save error
            if (bankingSaveErr) {
              return done(bankingSaveErr);
            }

            // Get a list of Bankings
            agent.get('/api/bankings')
              .end(function (bankingsGetErr, bankingsGetRes) {
                // Handle Bankings save error
                if (bankingsGetErr) {
                  return done(bankingsGetErr);
                }

                // Get Bankings list
                var bankings = bankingsGetRes.body;

                // Set assertions
                (bankings[0].user._id).should.equal(userId);
                (bankings[0].name).should.match('Banking name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Banking if not logged in', function (done) {
    agent.post('/api/bankings')
      .send(banking)
      .expect(403)
      .end(function (bankingSaveErr, bankingSaveRes) {
        // Call the assertion callback
        done(bankingSaveErr);
      });
  });

  it('should not be able to save an Banking if no name is provided', function (done) {
    // Invalidate name field
    banking.name = '';

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

        // Save a new Banking
        agent.post('/api/bankings')
          .send(banking)
          .expect(400)
          .end(function (bankingSaveErr, bankingSaveRes) {
            // Set message assertion
            (bankingSaveRes.body.message).should.match('Please fill Banking name');

            // Handle Banking save error
            done(bankingSaveErr);
          });
      });
  });

  it('should be able to update an Banking if signed in', function (done) {
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

        // Save a new Banking
        agent.post('/api/bankings')
          .send(banking)
          .expect(200)
          .end(function (bankingSaveErr, bankingSaveRes) {
            // Handle Banking save error
            if (bankingSaveErr) {
              return done(bankingSaveErr);
            }

            // Update Banking name
            banking.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Banking
            agent.put('/api/bankings/' + bankingSaveRes.body._id)
              .send(banking)
              .expect(200)
              .end(function (bankingUpdateErr, bankingUpdateRes) {
                // Handle Banking update error
                if (bankingUpdateErr) {
                  return done(bankingUpdateErr);
                }

                // Set assertions
                (bankingUpdateRes.body._id).should.equal(bankingSaveRes.body._id);
                (bankingUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Bankings if not signed in', function (done) {
    // Create new Banking model instance
    var bankingObj = new Banking(banking);

    // Save the banking
    bankingObj.save(function () {
      // Request Bankings
      request(app).get('/api/bankings')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Banking if not signed in', function (done) {
    // Create new Banking model instance
    var bankingObj = new Banking(banking);

    // Save the Banking
    bankingObj.save(function () {
      request(app).get('/api/bankings/' + bankingObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', banking.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Banking with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/bankings/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Banking is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Banking which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Banking
    request(app).get('/api/bankings/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Banking with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Banking if signed in', function (done) {
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

        // Save a new Banking
        agent.post('/api/bankings')
          .send(banking)
          .expect(200)
          .end(function (bankingSaveErr, bankingSaveRes) {
            // Handle Banking save error
            if (bankingSaveErr) {
              return done(bankingSaveErr);
            }

            // Delete an existing Banking
            agent.delete('/api/bankings/' + bankingSaveRes.body._id)
              .send(banking)
              .expect(200)
              .end(function (bankingDeleteErr, bankingDeleteRes) {
                // Handle banking error error
                if (bankingDeleteErr) {
                  return done(bankingDeleteErr);
                }

                // Set assertions
                (bankingDeleteRes.body._id).should.equal(bankingSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Banking if not signed in', function (done) {
    // Set Banking user
    banking.user = user;

    // Create new Banking model instance
    var bankingObj = new Banking(banking);

    // Save the Banking
    bankingObj.save(function () {
      // Try deleting Banking
      request(app).delete('/api/bankings/' + bankingObj._id)
        .expect(403)
        .end(function (bankingDeleteErr, bankingDeleteRes) {
          // Set message assertion
          (bankingDeleteRes.body.message).should.match('User is not authorized');

          // Handle Banking error error
          done(bankingDeleteErr);
        });

    });
  });

  it('should be able to get a single Banking that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
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

          // Save a new Banking
          agent.post('/api/bankings')
            .send(banking)
            .expect(200)
            .end(function (bankingSaveErr, bankingSaveRes) {
              // Handle Banking save error
              if (bankingSaveErr) {
                return done(bankingSaveErr);
              }

              // Set assertions on new Banking
              (bankingSaveRes.body.name).should.equal(banking.name);
              should.exist(bankingSaveRes.body.user);
              should.equal(bankingSaveRes.body.user._id, orphanId);

              // force the Banking to have an orphaned user reference
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

                    // Get the Banking
                    agent.get('/api/bankings/' + bankingSaveRes.body._id)
                      .expect(200)
                      .end(function (bankingInfoErr, bankingInfoRes) {
                        // Handle Banking error
                        if (bankingInfoErr) {
                          return done(bankingInfoErr);
                        }

                        // Set assertions
                        (bankingInfoRes.body._id).should.equal(bankingSaveRes.body._id);
                        (bankingInfoRes.body.name).should.equal(banking.name);
                        should.equal(bankingInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Banking.remove().exec(done);
    });
  });
});
