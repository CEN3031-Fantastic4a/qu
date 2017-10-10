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
 * Booking Schema
 */
var BookingSchema = new Schema({
  spot: { type: Schema.ObjectId, ref: 'Spot' },
  user: { type: Schema.ObjectId, ref: 'User' },
  entry_date_time: { type: Date, default: Date.now },
  exit_date_time: { type: Date, default: Date.now },
  total_time: { type: Number, default: 0 },
  booking_status: { type: String, default: 'Upcoming' },
  status: { type: Boolean, default: false }, // what is the status referring to?
  booking_amount: { type: Number, default: 0 },
  booking_date: { type: Date, default: Date.now },
  booking_time: { type: Date, default: Date.now },
  generated_booking_id: { type: String, default: '' }, // what is this?
  booking_hours: { type: Number, default: 0 },
  booking_days: { type: Number, default: 0 },
  booking_month: { type: Number, default: 0 },
  booking_type: { type: String, default: 'Hours' },
  cancelled_by: { type: String, default: '' },
  cancellation_fee: { type: Number, default: 0 },
  additional_credited_amount: { type: Number, default: 0 },
  paid_amount: { type: Number, default: 0 },
  created_date: { type: Date, default: Date.now },
  updated_date: { type: Date, default: Date.now }
});

BookingSchema.statics.seed = seed;

mongoose.model('Booking', BookingSchema);

/**
* Seeds the User collection with document (Booking)
* and provided options.
*/
function seed(doc, options) {
  var Booking = mongoose.model('Booking');

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
        Booking
          .findOne({
            booking_date: doc.booking_date,
            booking_time: doc.booking_time,
            user: doc.user,
            spot: doc.spot
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
            message: chalk.yellow('Database Seeding: Booking\t' + doc._id + ' skipped')
          });
        }

        var booking = new Booking(doc);

        booking.save(function (err) {
          if (err) {
            return reject(err);
          }

          return resolve({
            message: 'Database Seeding: Booking\t' + booking._id + ' added'
          });
        });
      });
    }
  });
}
