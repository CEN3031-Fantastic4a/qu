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
 * Auto Rent Schema
 */
var AutoRentSchema = new Schema({
  name: { type: String, default: '' },
  from_time: { type: Date, default: Date.now },
  to_time: { type: Date, default: Date.now },
  status: { type: Boolean, default: false },
  created_date: { type: Date, default: Date.now },
  updated_date: { type: Date, default: Date.now },
  created_by: { type: Schema.ObjectId, ref: 'User' },
  updated_by: { type: Schema.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Auto Rent', AutoRentSchema);
