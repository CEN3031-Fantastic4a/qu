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
 * Custom Availability Schema
 */
var AvailabilitySchema = new Schema({
  users_id: { type: Schema.ObjectId, ref: 'User' },
  no_of_hour: { type: Number, default: 0 },
  amount_of_hour: { type: Number, default: 0 },
  no_of_days: { type: Number, default: 0 },
  amount_of_days: { type: Number, default: 0 },
  month: { type: Number, default: 1 },
  amount_of_month: { type: Number, default: 0 },
  status: { type: Boolean, default: false },
  created_date: { type: Date, default: Date.now },
  updated_date: { type: Date, default: Date.now },
  created_by: { type: Schema.ObjectId, ref: 'User' },
  udpated_by: { type: Schema.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Custom Availability', AvailabilitySchema);
