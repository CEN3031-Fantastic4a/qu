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
  contactus;

/**
 * Parking routes tests
 */
describe('Contact Us CRUD tests', function () {

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

    contactus = new Contactu({
      username: user.username,
      anonymous: false,
      message: 'test message'
    });

    // Save a user to the test db
    user.save()
      .then(function () {
        done();
      })
      .catch(done);
  });

  it('should be able to submit if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/contactus')
          .send(contactus)
          .expect(200)
          .end(function (saveErr, saveRes) {
            // Call the assertion callback
            done();
          });
      });
  });

  it('should be able to submit if not logged in', function (done) {
    agent.post('/api/contactus')
      .send(contactus)
          .expect(200)
          .end(function (saveErr, saveRes) {
            // Call the assertion callback
            done();
          });
  });

  it('should be able to submit if no message', function (done) {
    // Contact us form
    contactus.message = '';

    agent.post('/api/contactus')
      .send(contactus)
          .expect(400)
          .end(function (saveErr, saveRes) {
            saveRes.body.message.should.match('message required');

            // Call the assertion callback
            done(saveErr);
          });
  });

  it('should be able to submit if logged in and anonymous', function (done) {
    agent.post('/api/auth/signin')
    .send(credentials)
    .expect(200)
    .end(function (signinErr, signinRes) {
      // Handle signin error
      if (signinErr) {
        return done(signinErr);
      }

      contactus.anonymous = true;
      contactus.username = '';

      agent.post('/api/contactus')
        .send(contactus)
        .expect(200)
        .end(function (saveErr, saveRes) {
          // Call the assertion callback
          saveRes.body.username.should.equal('');
          done();
        });
    });
  });

  it('should not be able to get a single form if not signed in', function (done) {
    // Create new contactus model instance
    var contactObj = new Contactu(contactus);

    // Save the contactus form
    contactObj.save(function () {
      agent.get('/api/contactus/' + contactObj._id)
        .expect(403)
        .end(function (req, res) {
          // Set assertion
          (res.body.message).should.match('User is not authorized');
          
          // Call the assertion callback
          done();
        });
    });
  });

  it('should not be able to get a single form if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        var contactObj = new Contactu(contactus);      

        // Save the contactus form
        contactObj.save(function () {
        agent.get('/api/contactus/' + contactObj._id)
          .expect(403)
          .end(function (req, res) {
            // Set assertion
            (res.body.message).should.match('User is not authorized');
            
            // Call the assertion callback
            done();
          });
      });
    });
  });

  it('should not be able to get a list of forms if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        var contactObj = new Contactu(contactus);      

        // Save the contactus form
        contactObj.save(function () {
        agent.get('/api/contactus/')
          .expect(403)
          .end(function (req, res) {
            // Set assertion
            (res.body.message).should.match('User is not authorized');
            
            // Call the assertion callback
            done();
          });
      });
    });
  });

  it('should not be able to get a list of forms if not signed in', function (done) {
    // Create new contactus model instance
    var contactObj = new Contactu(contactus);
    
        // Save the contactus form
        contactObj.save(function () {
          agent.get('/api/contactus/')
            .expect(403)
            .end(function (req, res) {
              // Set assertion
              (res.body.message).should.match('User is not authorized');
              
              // Call the assertion callback
              done();
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
