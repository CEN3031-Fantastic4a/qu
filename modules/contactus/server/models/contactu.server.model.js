'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Contactu Schema
 */
var ContactuSchema = new Schema({
  username: { type: String, default: '' },
  created_date: { type: Date, default: Date.now },
  anonymous: { type: Boolean, default: true },
  state: { type: String, default: '' },
  message: { type: String, required: 'message null' }
});

mongoose.model('Contactu', ContactuSchema);
