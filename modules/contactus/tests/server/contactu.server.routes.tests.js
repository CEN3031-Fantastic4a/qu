'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Contactu = mongoose.model('Contactu'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  contactu;

/**
 * Contactu routes tests
 */
describe('Contactu CRUD tests', function () {

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

    // Save a user to the test db and create new Contactu
    user.save(function () {
      contactu = {
        name: 'Contactu name'
      };

      done();
    });
  });

  it('should be able to save a Contactu if logged in', function (done) {
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

        // Save a new Contactu
        agent.post('/api/contactus')
          .send(contactu)
          .expect(200)
          .end(function (contactuSaveErr, contactuSaveRes) {
            // Handle Contactu save error
            if (contactuSaveErr) {
              return done(contactuSaveErr);
            }

            // Get a list of Contactus
            agent.get('/api/contactus')
              .end(function (contactusGetErr, contactusGetRes) {
                // Handle Contactus save error
                if (contactusGetErr) {
                  return done(contactusGetErr);
                }

                // Get Contactus list
                var contactus = contactusGetRes.body;

                // Set assertions
                (contactus[0].user._id).should.equal(userId);
                (contactus[0].name).should.match('Contactu name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Contactu if not logged in', function (done) {
    agent.post('/api/contactus')
      .send(contactu)
      .expect(403)
      .end(function (contactuSaveErr, contactuSaveRes) {
        // Call the assertion callback
        done(contactuSaveErr);
      });
  });

  it('should not be able to save an Contactu if no name is provided', function (done) {
    // Invalidate name field
    contactu.name = '';

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

        // Save a new Contactu
        agent.post('/api/contactus')
          .send(contactu)
          .expect(400)
          .end(function (contactuSaveErr, contactuSaveRes) {
            // Set message assertion
            (contactuSaveRes.body.message).should.match('Please fill Contactu name');

            // Handle Contactu save error
            done(contactuSaveErr);
          });
      });
  });

  it('should be able to update an Contactu if signed in', function (done) {
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

        // Save a new Contactu
        agent.post('/api/contactus')
          .send(contactu)
          .expect(200)
          .end(function (contactuSaveErr, contactuSaveRes) {
            // Handle Contactu save error
            if (contactuSaveErr) {
              return done(contactuSaveErr);
            }

            // Update Contactu name
            contactu.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Contactu
            agent.put('/api/contactus/' + contactuSaveRes.body._id)
              .send(contactu)
              .expect(200)
              .end(function (contactuUpdateErr, contactuUpdateRes) {
                // Handle Contactu update error
                if (contactuUpdateErr) {
                  return done(contactuUpdateErr);
                }

                // Set assertions
                (contactuUpdateRes.body._id).should.equal(contactuSaveRes.body._id);
                (contactuUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Contactus if not signed in', function (done) {
    // Create new Contactu model instance
    var contactuObj = new Contactu(contactu);

    // Save the contactu
    contactuObj.save(function () {
      // Request Contactus
      request(app).get('/api/contactus')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Contactu if not signed in', function (done) {
    // Create new Contactu model instance
    var contactuObj = new Contactu(contactu);

    // Save the Contactu
    contactuObj.save(function () {
      request(app).get('/api/contactus/' + contactuObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', contactu.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Contactu with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/contactus/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Contactu is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Contactu which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Contactu
    request(app).get('/api/contactus/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Contactu with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Contactu if signed in', function (done) {
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

        // Save a new Contactu
        agent.post('/api/contactus')
          .send(contactu)
          .expect(200)
          .end(function (contactuSaveErr, contactuSaveRes) {
            // Handle Contactu save error
            if (contactuSaveErr) {
              return done(contactuSaveErr);
            }

            // Delete an existing Contactu
            agent.delete('/api/contactus/' + contactuSaveRes.body._id)
              .send(contactu)
              .expect(200)
              .end(function (contactuDeleteErr, contactuDeleteRes) {
                // Handle contactu error error
                if (contactuDeleteErr) {
                  return done(contactuDeleteErr);
                }

                // Set assertions
                (contactuDeleteRes.body._id).should.equal(contactuSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Contactu if not signed in', function (done) {
    // Set Contactu user
    contactu.user = user;

    // Create new Contactu model instance
    var contactuObj = new Contactu(contactu);

    // Save the Contactu
    contactuObj.save(function () {
      // Try deleting Contactu
      request(app).delete('/api/contactus/' + contactuObj._id)
        .expect(403)
        .end(function (contactuDeleteErr, contactuDeleteRes) {
          // Set message assertion
          (contactuDeleteRes.body.message).should.match('User is not authorized');

          // Handle Contactu error error
          done(contactuDeleteErr);
        });

    });
  });

  it('should be able to get a single Contactu that has an orphaned user reference', function (done) {
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

          // Save a new Contactu
          agent.post('/api/contactus')
            .send(contactu)
            .expect(200)
            .end(function (contactuSaveErr, contactuSaveRes) {
              // Handle Contactu save error
              if (contactuSaveErr) {
                return done(contactuSaveErr);
              }

              // Set assertions on new Contactu
              (contactuSaveRes.body.name).should.equal(contactu.name);
              should.exist(contactuSaveRes.body.user);
              should.equal(contactuSaveRes.body.user._id, orphanId);

              // force the Contactu to have an orphaned user reference
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

                    // Get the Contactu
                    agent.get('/api/contactus/' + contactuSaveRes.body._id)
                      .expect(200)
                      .end(function (contactuInfoErr, contactuInfoRes) {
                        // Handle Contactu error
                        if (contactuInfoErr) {
                          return done(contactuInfoErr);
                        }

                        // Set assertions
                        (contactuInfoRes.body._id).should.equal(contactuSaveRes.body._id);
                        (contactuInfoRes.body.name).should.equal(contactu.name);
                        should.equal(contactuInfoRes.body.user, undefined);

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
      Contactu.remove().exec(done);
    });
  });
});
