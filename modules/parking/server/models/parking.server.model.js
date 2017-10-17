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
 * Parking Schema
 */
var SpotSchema = new Schema({
  user: { type: Schema.ObjectId, ref: 'User' },
  // auto_rent_id: { type: Schema.ObjectId, ref: 'Auto Rent' },
  // custom_availability_id: { type: Schema.ObjectId, ref: 'Custom Availability' },
  address: { type: String, default: '', trim: true, required: 'Address cannot be blank' },
  postal_code: { type: String, default: '', trim: true, required: 'Zip Code cannot be blank' },
  country_id: Number,
  state_id: Number,
  city_name: { type: String, default: '', trim: true, required: 'City cannot be blank' },
  verification_status: { type: Boolean, default: false }, // what is verified
  users_verification_status: { type: Boolean, default: false }, // what is verified
  status: { type: Boolean, default: false },
  number_of_space_spot: { type: Number, default: 1 },
  description: String,
  location: String, // is location different from address
  latitude: { type: Number }, // change to required once coordinate feature is added
  longitude: { type: Number }, // change to required once coordinate feature is added
  instant_rent: { type: Boolean, default: false },
  renting_type: { type: String, default: '' },
  sche_start_date: { type: Date, default: Date.now },
  sche_start_time: { type: Date, default: Date.now },
  no_of_hours: { type: Number, default: 0 },
  no_of_days: { type: Number, default: 0 },
  no_of_months: { type: Number, default: 0 },
  mon: { Type: Array, default: [] },
  tue: { Type: Array, default: [] },
  wed: { Type: Array, default: [] },
  thur: { Type: Array, default: [] },
  fri: { Type: Array, default: [] },
  sat: { Type: Array, default: [] },
  sun: { Type: Array, default: [] },
  verification_code: { type: String, default: '' },
  created_date: { type: Date, default: Date.now },
  updated_date: { type: Date, default: Date.now },
  created_by: { type: Schema.ObjectId, ref: 'User' },
  updated_by: { type: Schema.ObjectId, ref: 'User' }
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
            address: doc.address,
            city_name: doc.city_name,
            postal_code: doc.postal_code
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

            // Remove Parking Spot (overwrite)

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
