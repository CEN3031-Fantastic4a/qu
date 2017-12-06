(function (app) {
  'use strict';

  app.registerModule('booking', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('booking.services');
  app.registerModule('booking.routes', ['ui.router', 'core.routes', 'booking.services']);
}(ApplicationConfiguration));
