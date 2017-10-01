'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  path = require('path'),
  fs = require('fs'),
  request = require('supertest'),
  config = require(path.resolve('./config/config')),
  logger = require(path.resolve('./config/lib/logger')),
  seed = require(path.resolve('./config/lib/mongo-seed')),
  express = require(path.resolve('./config/lib/express')),
  Spot = mongoose.model('Spot');

/**
 * Globals
 */
var app,
  agent,
  user1,
  admin1,
  userFromSeedConfig,
  adminFromSeedConfig,
  originalLogConfig;

describe('Configuration Tests:', function () {

  describe('Testing Mongo Seed', function () {
    var _seedConfig = _.clone(config.seedDB, true);
    var spotSeedConfig;
    var userSeedConfig;
    var _admin;
    var _user;
    var _spot;

    before(function (done) {
      _admin = {
        username: 'test-seed-admin',
        email: 'test-admin@localhost.com',
        firstName: 'Admin',
        lastName: 'Test',
        roles: ['admin', 'user']
      };

      _user = {
        username: 'test-seed-user',
        email: 'test-user@localhost.com',
        firstName: 'User',
        lastName: 'Test',
        roles: ['user']
      };

      _spot = {
        address: {
          streetAddress: 'Test Address',
          city: 'Gainesville',
          state: 'Florida',
          zip: '32601',
          country: 'USA'
        },
        description: 'Parking spot details'
      };

      var spotCollections = _.filter(_seedConfig.collections, function (collection) {
        return collection.model === 'Spot';
      });

      // spotCollections.should.be.instanceof(Array).and.have.lengthOf(1);
      spotSeedConfig = spotCollections[0];

      var userCollections = _.filter(_seedConfig.collections, function (collection) {
        return collection.model === 'User';
      });

      // userCollections.should.be.instanceof(Array).and.have.lengthOf(1);
      userSeedConfig = userCollections[0];

      return done();
    });

    afterEach(function (done) {
      Spot.remove().exec()
        .then(function () {
          return User.remove().exec();
        })
        .then(function () {
          return done();
        })
        .catch(function (err) {
          return done(err);
        });
    });

    it('should have default seed configuration set for spots', function (done) {
      spotSeedConfig.should.be.instanceof(Object);
      spotSeedConfig.docs.should.be.instanceof(Array).and.have.lengthOf(1);
      should.exist(spotSeedConfig.docs[0].data.address.streetAddress);
      should.exist(spotSeedConfig.docs[0].data.address.city);
      should.exist(spotSeedConfig.docs[0].data.address.state);
      should.exist(spotSeedConfig.docs[0].data.address.zip);
      should.exist(spotSeedConfig.docs[0].data.address.country);

      should.exist(spotSeedConfig.docs[0].data.description);

      return done();
    });

    it('should have default seed configuration set for users', function (done) {
      userSeedConfig.should.be.instanceof(Object);
      userSeedConfig.docs.should.be.instanceof(Array).and.have.lengthOf(2);

      should.exist(userSeedConfig.docs[0].data.username);
      should.exist(userSeedConfig.docs[0].data.email);
      should.exist(userSeedConfig.docs[0].data.firstName);
      should.exist(userSeedConfig.docs[0].data.lastName);
      should.exist(userSeedConfig.docs[0].data.roles);

      should.exist(userSeedConfig.docs[1].data.username);
      should.exist(userSeedConfig.docs[1].data.email);
      should.exist(userSeedConfig.docs[1].data.firstName);
      should.exist(userSeedConfig.docs[1].data.lastName);
      should.exist(userSeedConfig.docs[1].data.roles);

      return done();
    });

    it('should seed data from default config', function (done) {

      seed.start()
        .then(function () {
          // Check Spots Seed
          return Spot.find().exec();
        })
        .then(function (spots) {
          spots.should.be.instanceof(Array).and.have.lengthOf(spotSeedConfig.docs.length);
          // Check Users Seed
          return User.find().exec();
        })
        .then(function (users) {
          users.should.be.instanceof(Array).and.have.lengthOf(userSeedConfig.docs.length);
          return done();
        })
        .catch(done);
    });

    it('should overwrite existing spot by default', function (done) {
      spotSeedConfig.docs.should.be.instanceof(Array).and.have.lengthOf(1);

      var spot = new Spot(spotSeedConfig.docs[0].data);
      spot.description = '_temp_test_spot_';

      // save temp spot
      spot.save()
        .then(function () {
          return seed.start();
        })
        .then(function () {
          return Spot.find().exec();
        })
        .then(function (spots) {
          spots.should.be.instanceof(Array).and.have.lengthOf(2);

          var newSpot = spots.pop();
          spotSeedConfig.docs[0].data.address.streetAddress.should.equal(newSpot.address.streetAddress);
          spotSeedConfig.docs[0].data.address.city.should.equal(newSpot.address.city);
          spotSeedConfig.docs[0].data.address.state.should.equal(newSpot.address.state);
          spotSeedConfig.docs[0].data.address.zip.should.equal(newSpot.address.zip);
          spotSeedConfig.docs[0].data.address.country.should.equal(newSpot.address.country);

          spotSeedConfig.docs[0].data.description.should.equal(newSpot.description);

          return done();
        })
        .catch(done);
    });

    it('should overwrite existing users by default', function (done) {
      userSeedConfig.docs.should.be.instanceof(Array).and.have.lengthOf(2);

      var admin = new User(userSeedConfig.docs[0].data);
      admin.email = 'temp-admin@localhost.com';
      admin.provider = 'local';

      var user = new User(userSeedConfig.docs[1].data);
      user.email = 'temp-user@localhost.com';
      user.provider = 'local';

      admin.save()
        .then(function () {
          return user.save();
        })
        .then(function () {
          return User.find().exec();
        })
        .then(function (users) {
          users.should.be.instanceof(Array).and.have.lengthOf(2);
          // Start Seed
          return seed.start();
        })
        .then(function () {
          return User.find().exec();
        })
        .then(function (users) {
          // Should still only be two users, since we removed
          // the existing users before seeding again.
          users.should.be.instanceof(Array).and.have.lengthOf(2);

          return User.find({ username: admin.username }).exec();
        })
        .then(function (users) {
          users.should.be.instanceof(Array).and.have.lengthOf(1);

          var newAdmin = users.pop();
          userSeedConfig.docs[0].data.username.should.equal(newAdmin.username);
          userSeedConfig.docs[0].data.email.should.equal(newAdmin.email);

          return User.find({ username: user.username }).exec();
        })
        .then(function (users) {
          users.should.be.instanceof(Array).and.have.lengthOf(1);

          var newUser = users.pop();
          userSeedConfig.docs[1].data.username.should.equal(newUser.username);
          userSeedConfig.docs[1].data.email.should.equal(newUser.email);

          return done();
        })
        .catch(done);
    });

    it('should seed single spot with custom options', function (done) {
      seed
        .start({
          collections: [{
            model: 'Spot',
            docs: [{
              overwrite: true,
              data: _spot
            }]
          }]
        })
        .then(function () {
          return Spot.find().exec();
        })
        .then(function (spots) {
          spots.should.be.instanceof(Array).and.have.lengthOf(1);

          var newSpot = spots.pop();
          _spot.address.streetAddress.should.equal(newSpot.address.streetAddress);
          _spot.address.city.should.equal(newSpot.address.city);
          _spot.address.state.should.equal(newSpot.address.state);
          _spot.address.zip.should.equal(newSpot.address.zip);
          _spot.address.country.should.equal(newSpot.address.country);

          _spot.description.should.equal(newSpot.description);

          return done();
        })
        .catch(done);
    });

    it('should seed single spot with user set to custom seeded admin user', function (done) {
      seed
        .start({
          collections: [{
            model: 'User',
            docs: [{
              data: _admin
            }]
          }, {
            model: 'Spot',
            docs: [{
              overwrite: true,
              data: _spot
            }]
          }]
        })
        .then(function () {
          return User.find().exec();
        })
        .then(function (users) {
          users.should.be.instanceof(Array).and.have.lengthOf(1);

          return Spot
            .find()
            .populate('user', 'firstName lastName username email roles')
            .exec();
        })
        .then(function (spots) {
          spots.should.be.instanceof(Array).and.have.lengthOf(1);

          var newSpot = spots.pop();
          _spot.address.streetAddress.should.equal(newSpot.address.streetAddress);
          _spot.address.city.should.equal(newSpot.address.city);
          _spot.address.state.should.equal(newSpot.address.state);
          _spot.address.zip.should.equal(newSpot.address.zip);
          _spot.address.country.should.equal(newSpot.address.country);

          _spot.description.should.equal(newSpot.description);

          should.exist(newSpot.user);
          should.exist(newSpot.user._id);

          _admin.username.should.equal(newSpot.user.username);
          _admin.email.should.equal(newSpot.user.email);
          _admin.firstName.should.equal(newSpot.user.firstName);
          _admin.lastName.should.equal(newSpot.user.lastName);

          should.exist(newSpot.user.roles);
          newSpot.user.roles.indexOf('admin').should.equal(_admin.roles.indexOf('admin'));

          return done();
        })
        .catch(done);
    });

    it('should seed single spot with NO user set due to seed order', function (done) {
      seed
        .start({
          collections: [{
            model: 'Spot',
            docs: [{
              overwrite: true,
              data: _spot
            }]
          }, {
            model: 'User',
            docs: [{
              data: _admin
            }]
          }]
        })
        .then(function () {
          return User.find().exec();
        })
        .then(function (users) {
          users.should.be.instanceof(Array).and.have.lengthOf(1);

          return Spot
            .find()
            .populate('user', 'firstName lastName username email roles')
            .exec();
        })
        .then(function (spots) {
          spots.should.be.instanceof(Array).and.have.lengthOf(1);

          var newSpot = spots.pop();
          _spot.address.streetAddress.should.equal(newSpot.address.streetAddress);
          _spot.address.city.should.equal(newSpot.address.city);
          _spot.address.state.should.equal(newSpot.address.state);
          _spot.address.zip.should.equal(newSpot.address.zip);
          _spot.address.country.should.equal(newSpot.address.country);

          _spot.description.should.equal(newSpot.description);

          should.not.exist(newSpot.user);

          return done();
        })
        .catch(done);
    });

    it('should seed admin and user accounts with custom options', function (done) {
      seed
        .start({
          collections: [{
            model: 'User',
            docs: [{
              data: _admin
            }, {
              data: _user
            }]
          }]
        })
        .then(function () {
          return User.find().exec();
        })
        .then(function (users) {
          users.should.be.instanceof(Array).and.have.lengthOf(2);
          return User.find({ username: _admin.username }).exec();
        })
        .then(function (users) {
          users.should.be.instanceof(Array).and.have.lengthOf(1);

          var newAdmin = users.pop();
          _admin.username.should.equal(newAdmin.username);
          _admin.email.should.equal(newAdmin.email);

          return User.find({ username: _user.username }).exec();
        })
        .then(function (users) {
          users.should.be.instanceof(Array).and.have.lengthOf(1);

          var newUser = users.pop();
          _user.username.should.equal(newUser.username);
          _user.email.should.equal(newUser.email);

          return done();
        })
        .catch(done);
    });

    it('should NOT overwrite existing spot with custom options', function (done) {

      var spot = new Spot(_spot);
      spot.description = '_temp_spot_content_';

      spot.save()
        .then(function () {
          return seed.start({
            collections: [{
              model: 'Spot',
              docs: [{
                overwrite: false,
                data: _spot
              }]
            }]
          });
        })
        .then(function () {
          return Spot.find().exec();
        })
        .then(function (spots) {
          spots.should.be.instanceof(Array).and.have.lengthOf(2);

          var existingSpot = spots.pop();
          spot.address.streetAddress.should.equal(existingSpot.address.streetAddress);
          spot.address.city.should.equal(existingSpot.address.city);
          spot.address.state.should.equal(existingSpot.address.state);
          spot.address.zip.should.equal(existingSpot.address.zip);
          spot.address.country.should.equal(existingSpot.address.country);

          // spot.description.should.equal(existingSpot.description);

          return done();
        })
        .catch(done);
    });

    it('should NOT overwrite existing user with custom options', function (done) {
      var user = new User(_user);
      user.provider = 'local';
      user.email = 'temp-test-user@localhost.com';

      user.save()
        .then(function () {
          return seed.start({
            collections: [{
              model: 'User',
              docs: [{
                overwrite: false,
                data: _user
              }]
            }]
          });
        })
        .then(function () {
          return User.find().exec();
        })
        .then(function (users) {
          users.should.be.instanceof(Array).and.have.lengthOf(1);

          var existingUser = users.pop();
          user.username.should.equal(existingUser.username);
          user.email.should.equal(existingUser.email);

          return done();
        })
        .catch(done);
    });

    it('should NOT seed spot when missing address with custom options', function (done) {
      var invalid = {
        description: '_temp_spot_content_'
      };

      seed
        .start({
          collections: [{
            model: 'Spot',
            docs: [{
              data: invalid
            }]
          }]
        })
        .then(function () {
          // We should not make it here so we
          // force an assert failure to prevent hangs.
          should.exist(undefined);
          return done();
        })
        .catch(function (err) {
          should.exist(err);
          err.message.should.equal('Spot validation failed: address.streetAddress: Street Address cannot be blank, address.city: City cannot be blank, address.state: State cannot be blank, address.zip: State cannot be blank, address.country: Country cannot be blank');

          return done();
        });
    });

    it('should NOT seed user when missing username with custom options', function (done) {
      var invalid = _.clone(_user, true);
      invalid.username = undefined;

      seed
        .start({
          collections: [{
            model: 'User',
            docs: [{
              data: invalid
            }]
          }]
        })
        .then(function () {
          // We should not make it here so we
          // force an assert failure to prevent hangs.
          should.exist(undefined);
          return done();
        })
        .catch(function (err) {
          should.exist(err);
          err.message.should.equal('User validation failed: username: Please fill in a username');

          return done();
        });
    });

    it('should NOT seed user when missing email with custom options', function (done) {
      var invalid = _.clone(_user, true);
      invalid.email = undefined;

      seed
        .start({
          collections: [{
            model: 'User',
            docs: [{
              data: invalid
            }]
          }]
        })
        .then(function () {
          // We should not make it here so we
          // force an assert failure to prevent hangs.
          should.exist(undefined);
          return done();
        })
        .catch(function (err) {
          should.exist(err);
          err.message.should.equal('User validation failed: email: Please fill a valid email address');

          return done();
        });
    });

    it('should NOT seed user with invalid email with custom options', function (done) {
      var invalid = _.clone(_user, true);
      invalid.email = '...invalid-email...';

      seed
        .start({
          collections: [{
            model: 'User',
            docs: [{
              data: invalid
            }]
          }]
        })
        .then(function () {
          // We should not make it here so we
          // force an assert failure to prevent hangs.
          should.exist(undefined);
          return done();
        })
        .catch(function (err) {
          should.exist(err);
          err.message.should.equal('User validation failed: email: Please fill a valid email address');

          return done();
        });
    });

    it('should NOT continue seed when empty collections config', function (done) {
      seed
        .start({
          collections: []
        })
        .then(function () {
          return Spot.find().exec();
        })
        .then(function (spots) {
          spots.should.be.instanceof(Array).and.have.lengthOf(0);

          return User.find().exec();
        })
        .then(function (users) {
          users.should.be.instanceof(Array).and.have.lengthOf(0);

          return done();
        })
        .catch(done);
    });

    it('should NOT seed any data when empty docs config', function (done) {
      seed
        .start({
          collections: [{
            model: 'Spot',
            docs: []
          }]
        })
        .then(function () {
          return Spot.find().exec();
        })
        .then(function (spots) {
          spots.should.be.instanceof(Array).and.have.lengthOf(0);

          return User.find().exec();
        })
        .then(function (users) {
          users.should.be.instanceof(Array).and.have.lengthOf(0);

          return done();
        })
        .catch(done);
    });

    it('should seed spot with custom options & skip.when results are empty', function (done) {
      seed
        .start({
          collections: [{
            model: 'Spot',
            skip: {
              when: { address: 'should-not-find-this-address' }
            },
            docs: [{
              data: _spot
            }]
          }]
        })
        .then(function () {
          return Spot.find().exec();
        })
        .then(function (spots) {
          spots.should.be.instanceof(Array).and.have.lengthOf(1);

          var newSpot = spots.pop();
          _spot.address.streetAddress.should.be.equal(newSpot.address.streetAddress);
          _spot.address.city.should.be.equal(newSpot.address.city);
          _spot.address.state.should.be.equal(newSpot.address.state);
          _spot.address.zip.should.be.equal(newSpot.address.zip);
          _spot.address.country.should.be.equal(newSpot.address.country);
          _spot.description.should.be.equal(newSpot.description);

          return done();
        })
        .catch(done);
    });

    it('should skip seed on collection with custom options & skip.when has results', function (done) {
      var spot = new Spot({
        address: {
          streetAddress: 'Test Address',
          city: 'Gainesville',
          state: 'Florida',
          zip: '32601',
          country: 'USA'
        },
        description: 'temp-spot-content'
      });

      spot
        .save()
        .then(function () {
          return Spot.find().exec();
        })
        .then(function (spots) {
          spots.should.be.instanceof(Array).and.have.lengthOf(1);

          var newSpot = spots.pop();
          spot.address.streetAddress.should.be.equal(newSpot.address.streetAddress);
          spot.address.city.should.be.equal(newSpot.address.city);
          spot.address.state.should.be.equal(newSpot.address.state);
          spot.address.zip.should.be.equal(newSpot.address.zip);
          spot.address.country.should.be.equal(newSpot.address.country);
          spot.description.should.equal(newSpot.description);

          return seed.start({
            collections: [{
              model: 'Spot',
              skip: {
                when: {
                  address: {
                    streetAddress: newSpot.streetAddress,
                    city: newSpot.city,
                    state: newSpot.state,
                    zip: newSpot.zip,
                    country: newSpot.country
                  }
                }
              },
              docs: [{
                data: _spot
              }]
            }]
          });
        })
        .then(function () {
          return Spot.find().exec();
        })
        .then(function (spots) {
          // We should have the same spot added at start of this unit test.
          spots.should.be.instanceof(Array).and.have.lengthOf(2);

          var existingSpot = spots.pop();
          spot.address.streetAddress.should.equal(existingSpot.address.streetAddress);
          spot.address.city.should.equal(existingSpot.address.city);
          spot.address.state.should.equal(existingSpot.address.state);
          spot.address.zip.should.equal(existingSpot.address.zip);
          spot.address.country.should.equal(existingSpot.address.country);

          // spot.description.should.equal(existingSpot.description);

          return done();
        })
        .catch(done);
    });

    it('should fail seed with custom options & invalid skip.when query', function (done) {
      seed
        .start({
          collections: [{
            model: 'Spot',
            skip: {
              when: { created: 'not-a-valid-date' }
            },
            docs: [{
              data: _spot
            }]
          }]
        })
        .then(function () {
          // We should not get here
          should.exist(undefined);
          return done();
        })
        .catch(function (err) {
          should.exist(err);
          // We expect the error message to include
          err.message.indexOf('Cast to date failed').should.equal(0);

          return done();
        });
    });
  });

  describe('Testing Session Secret Configuration', function () {
    it('should warn if using default session secret when running in production', function (done) {
      var conf = { sessionSecret: 'MEAN' };
      // set env to production for this test
      process.env.NODE_ENV = 'production';
      config.utils.validateSessionSecret(conf, true).should.equal(false);
      // set env back to test
      process.env.NODE_ENV = 'test';
      return done();
    });

    it('should accept non-default session secret when running in production', function () {
      var conf = { sessionSecret: 'super amazing secret' };
      // set env to production for this test
      process.env.NODE_ENV = 'production';
      config.utils.validateSessionSecret(conf, true).should.equal(true);
      // set env back to test
      process.env.NODE_ENV = 'test';
    });

    it('should accept default session secret when running in development', function () {
      var conf = { sessionSecret: 'MEAN' };
      // set env to development for this test
      process.env.NODE_ENV = 'development';
      config.utils.validateSessionSecret(conf, true).should.equal(true);
      // set env back to test
      process.env.NODE_ENV = 'test';
    });

    it('should accept default session secret when running in test', function () {
      var conf = { sessionSecret: 'MEAN' };
      config.utils.validateSessionSecret(conf, true).should.equal(true);
    });
  });

  describe('Testing Logger Configuration', function () {

    beforeEach(function () {
      originalLogConfig = _.clone(config.log, true);
    });

    afterEach(function () {
      config.log = originalLogConfig;
    });

    it('should retrieve the log format from the logger configuration', function () {

      config.log = {
        format: 'tiny'
      };

      var format = logger.getLogFormat();
      format.should.be.equal('tiny');
    });

    it('should retrieve the log options from the logger configuration for a valid stream object', function () {

      var options = logger.getMorganOptions();

      options.should.be.instanceof(Object);
      options.should.have.property('stream');

    });

    it('should verify that a file logger object was created using the logger configuration', function () {
      var _dir = process.cwd();
      var _filename = 'unit-test-access.log';

      config.log = {
        fileLogger: {
          directoryPath: _dir,
          fileName: _filename
        }
      };

      var fileTransport = logger.getLogOptions(config);
      fileTransport.should.be.instanceof(Object);
      fileTransport.filename.should.equal(_dir + '/' + _filename);
    });

    it('should use the default log format of "combined" when an invalid format was provided', function () {

      var _logger = require(path.resolve('./config/lib/logger'));

      // manually set the config log format to be invalid
      config.log = {
        format: '_some_invalid_format_'
      };

      var format = _logger.getLogFormat();
      format.should.be.equal('combined');
    });

    it('should not create a file transport object if critical options are missing: filename', function () {

      // manually set the config stream fileName option to an empty string
      config.log = {
        format: 'combined',
        options: {
          stream: {
            directoryPath: process.cwd(),
            fileName: ''
          }
        }
      };

      var fileTransport = logger.getLogOptions(config);
      fileTransport.should.be.false();
    });

    it('should not create a file transport object if critical options are missing: directory', function () {

      // manually set the config stream fileName option to an empty string
      config.log = {
        format: 'combined',
        options: {
          stream: {
            directoryPath: '',
            fileName: 'app.log'
          }
        }
      };

      var fileTransport = logger.getLogOptions(config);
      fileTransport.should.be.false();
    });
  });

  describe('Testing exposing environment as a variable to layout', function () {

    ['development', 'production', 'test'].forEach(function (env) {
      it('should expose environment set to ' + env, function (done) {
        // Set env to development for this test
        process.env.NODE_ENV = env;

        // Gget application
        app = express.init(mongoose.connection.db);
        agent = request.agent(app);

        // Get rendered layout
        agent.get('/')
          .expect('Content-Type', 'text/html; charset=utf-8')
          .expect(200)
          .end(function (err, res) {
            // Set env back to test
            process.env.NODE_ENV = 'test';
            // Handle errors
            if (err) {
              return done(err);
            }
            res.text.should.containEql('env = "' + env + '"');
            return done();
          });
      });
    });

  });

});
