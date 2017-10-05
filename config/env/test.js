'use strict';

var defaultEnvConfig = require('./default');

module.exports = {
  db: {
    uri: process.env.MONGOHQ_URL || process.env.MONGODB_URI || 'mongodb://root:root@ds119064.mlab.com:19064/fantastic4' || 'mongodb://root:root@ds161503.mlab.com:61503/qwertyqwerty' || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/mean-test',
    options: {},
    // Enable mongoose debug mode
    debug: process.env.MONGODB_DEBUG || false
  },
  log: {
    // logging with Morgan - https://github.com/expressjs/morgan
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    // format: 'dev'
    // fileLogger: {
    //   directoryPath: process.cwd(),
    //   fileName: 'app.log',
    //   maxsize: 10485760,
    //   maxFiles: 2,
    //   json: false
    // }
  },
  port: process.env.PORT || 3001,
  app: {
    title: defaultEnvConfig.app.title + ' - Test Environment'
  },
  uploads: {
    profile: {
      image: {
        dest: './modules/users/client/img/profile/uploads/',
        limits: {
          fileSize: 100000 // Limit filesize (100kb) for testing purposes
        }
      }
    }
  },
  facebook: {
    clientID: process.env.FACEBOOK_ID || 'APP_ID',
    clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/facebook/callback'
  },
  twitter: {
    username: '@TWITTER_USERNAME',
    clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
    clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
    callbackURL: '/api/auth/twitter/callback'
  },
  google: {
    clientID: process.env.GOOGLE_ID || 'APP_ID',
    clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/google/callback'
  },
  linkedin: {
    clientID: process.env.LINKEDIN_ID || 'APP_ID',
    clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/linkedin/callback'
  },
  github: {
    clientID: process.env.GITHUB_ID || 'APP_ID',
    clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/github/callback'
  },
  paypal: {
    clientID: process.env.PAYPAL_ID || 'CLIENT_ID',
    clientSecret: process.env.PAYPAL_SECRET || 'CLIENT_SECRET',
    callbackURL: '/api/auth/paypal/callback',
    sandbox: true
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
  seedDB: {
    seed: process.env.MONGO_SEED === 'true',
    options: {
      // Default to not log results for tests
      logResults: process.env.MONGO_SEED_LOG_RESULTS === 'true'
    },
    collections: [{
      model: 'User',
      docs: [{
        overwrite: true,
        data: {
          customer: {
            customer_id: 'cu_FJFkfass443',
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
                email: 'dddd@fxff.com',
                name: 'Full Name',
                phone: '7863105879'
              },
              token: 'tk_vidsds',
              usage: 'reusable'
            }]
          },
          username: 'seedadmin',
          email: 'admin@localhost.com',
          firstName: 'Admin',
          lastName: 'Local',
          roles: ['admin', 'user']
        }
      }, {
        overwrite: true,
        data: {
          customer: {
            customer_id: 'cu_FJFzzkf443',
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
          username: 'seeduser',
          email: 'user@localhost.com',
          firstName: 'User',
          lastName: 'Local',
          roles: ['user']
        }
      }]
    }, {
      model: 'Spot',
      docs: [{
        overwrite: true,
        data: {
          address: 'Test Address',
          city_name: 'Gainesville',
          postal_code: '32601',
          status: true
        }
      }]
    }]
  }
};
