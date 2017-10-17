(function (app) {
  'use strict';

  app.registerModule('parking', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('parking.admin', ['core.admin']);
  app.registerModule('parking.admin.routes', ['core.admin.routes']);
  app.registerModule('parking.services');
  app.registerModule('parking.routes', ['ui.router', 'core.routes', 'parking.services']);
}(ApplicationConfiguration));
