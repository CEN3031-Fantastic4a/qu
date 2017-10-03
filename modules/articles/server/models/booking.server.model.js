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
  booking_date: { type: Date, required: true },
  booking_time: { type: Date, required: true },
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

module.exports = mongoose.model('Booking', BookingSchema);
