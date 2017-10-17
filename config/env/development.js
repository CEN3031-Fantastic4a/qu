'use strict';


var defaultEnvConfig = require('./default');

module.exports = {
  db: {
    uri: process.env.MONGOHQ_URL || process.env.MONGODB_URI || 'mongodb://root:root@ds119064.mlab.com:19064/fantastic4' || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/mean-dev',
    options: {},
    // Enable mongoose debug mode
    debug: process.env.MONGODB_DEBUG || false
  },
  log: {
    // logging with Morgan - https://github.com/expressjs/morgan
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: 'dev',
    fileLogger: {
      directoryPath: process.cwd(),
      fileName: 'app.log',
      maxsize: 10485760,
      maxFiles: 2,
      json: false
    }
  },
  app: {
    title: defaultEnvConfig.app.title + ' - Development Environment'
  },
  facebook: {
    clientID: process.env.FACEBOOK_ID || '494532197599180',
    clientSecret: process.env.FACEBOOK_SECRET || '04acdc759a9c02baff4e73a9f660d334',
    callbackURL: '/api/auth/facebook/callback'
  },
  google: {
    clientID: process.env.GOOGLE_ID || '592604191308-t0685a0n8jg8777g04hqib0ftvsnt999.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_SECRET || 'Uvsn-7urJ-mdz4aboOTPIzED',
    callbackURL: '/api/auth/google/callback'
  },
  stripe: {
    api_key: process.env.STRIPE_API_KEY || 'sk_test_H1upOVCYDyuzp8hNlAMyqMxy'
  },
  mailer: {
    from: process.env.MAILER_FROM || 'MAILER_FROM',
    options: {
      service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
      auth: {
        user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
        pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
      }
    }
  },
  livereload: true,
  seedDB: {
    seed: process.env.MONGO_SEED === 'true',
    options: {
      logResults: process.env.MONGO_SEED_LOG_RESULTS !== 'false'
    },
    // Order of collections in configuration will determine order of seeding.
    // i.e. given these settings, the User seeds will be complete before
    // Parking spot seed is performed.
    collections: [{
      model: 'User',
      docs: [{
        data: {
          customer: {
            customer_id: 'cu_FJF3kf4a43',
            sources: [{
              payment_type: 'cards',
              currency: 'usd',
              owner: {
                address: {
                  city: 'Gainesvile',
                  country: 'USA',
                  line1: '1001 mill street',
                  line2: '',
                  postal_code: 33250,
                  state: 'FL'
                },
                email: 'dddd@hfff.com',
                name: 'Full Name',
                phone: '7863105879'
              },
              token: 'tk_vidsds',
              usage: 'reusable'
            }]
          },
          username: 'local-admin',
          email: 'admin@localhost.com',
          firstName: 'Admin',
          lastName: 'Local',
          roles: ['admin', 'user']
        }
      }, {
        // Set to true to overwrite this document
        // when it already exists in the collection.
        // If set to false, or missing, the seed operation
        // will skip this document to avoid overwriting it.
        overwrite: true,
        data: {
          customer: {
            customer_id: 'cu_FJFkfb4143',
            sources: [{
              payment_type: 'cards',
              currency: 'usd',
              owner: {
                address: {
                  city: 'Gainesvile',
                  country: 'USA',
                  line1: '1001 mill street',
                  line2: '',
                  postal_code: 33250,
                  state: 'FL'
                },
                email: 'dddd@fff.com',
                name: 'Full Name',
                phone: '7863105879'
              },
              token: 'tk_vidsds',
              usage: 'reusable'
            }]
          },
          username: 'local-user',
          email: 'user@localhost.com',
          firstName: 'User',
          lastName: 'Local',
          roles: ['user']
        }
      }]
    }, {
      model: 'Spot',
      options: {
        // Override log results setting at the
        // collection level.
        logResults: true
      },
      skip: {
        // Skip collection when this query returns results.
        // e.g. {}: Only seeds collection when it is empty.
        when: {} // Mongoose qualified query
      },
      docs: [{
        data: {
          address: '444 Newell Drive',
          postal_code: '32611',
          city_name: 'Gainesville',
          status: true
        }
      }]
    }]
  }
};
