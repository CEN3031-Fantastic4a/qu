'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  path = require('path'),
  config = require(path.resolve('./config/config')),
  chalk = require('chalk');

/**
 * Spot Schema
 */
var SpotSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  address: {
    streetAddress: {
      type: String,
      default: '',
      trim: true,
      required: 'Street Address cannot be blank'
    },
    city: {
      type: String,
      default: '',
      trim: true,
      required: 'City cannot be blank'
    },
    state: {
      type: String,
      default: '',
      trim: true,
      required: 'State cannot be blank'
    },
    zip: {
      type: String,
      default: '',
      trim: true,
      required: 'State cannot be blank'
    },
    country: {
      type: String,
      default: '',
      trim: true,
      required: 'Country cannot be blank'
    }
  },
  availability: {
    type: Boolean,
    default: false,
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  price: {
    type: Number,
    default: 0,
    trim: true
  },
  active: {
    type: Boolean,
    default: false,
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

SpotSchema.statics.seed = seed;

mongoose.model('Spot', SpotSchema);

/**
* Seeds the User collection with document (Spot)
* and provided options.
*/
function seed(doc, options) {
  var Spot = mongoose.model('Spot');

  return new Promise(function (resolve, reject) {

    skipDocument()
      .then(findAdminUser)
      .then(add)
      .then(function (response) {
        return resolve(response);
      })
      .catch(function (err) {
        return reject(err);
      });

    function findAdminUser(skip) {
      var User = mongoose.model('User');

      return new Promise(function (resolve, reject) {
        if (skip) {
          return resolve(true);
        }

        User
          .findOne({
            roles: { $in: ['admin'] }
          })
          .exec(function (err, admin) {
            if (err) {
              return reject(err);
            }

            doc.user = admin;

            return resolve();
          });
      });
    }

    function skipDocument() {
      return new Promise(function (resolve, reject) {
        Spot
          .findOne({
            address: {
              streetAddress: doc.streetAddress,
              city: doc.city,
              state: doc.state,
              zip: doc.zip,
              country: doc.county
            }
          })
          .exec(function (err, existing) {
            if (err) {
              return reject(err);
            }

            if (!existing) {
              return resolve(false);
            }

            if (existing && !options.overwrite) {
              return resolve(true);
            }

            // Remove Spot (overwrite)

            existing.remove(function (err) {
              if (err) {
                return reject(err);
              }

              return resolve(false);
            });
          });
      });
    }

    function add(skip) {
      return new Promise(function (resolve, reject) {
        if (skip) {
          return resolve({
            message: chalk.yellow('Database Seeding: Parking Spot\t' + doc._id + ' skipped')
          });
        }

        var spot = new Spot(doc);

        spot.save(function (err) {
          if (err) {
            return reject(err);
          }

          return resolve({
            message: 'Database Seeding: Parking spot\t' + spot._id + ' added'
          });
        });
      });
    }
  });
}
