[![Build Status](https://travis-ci.org/CEN3031-Fantastic4a/qu.svg?branch=master)](https://travis-ci.org/CEN3031-Fantastic4a/qu)
[![Coverage Status](https://coveralls.io/repos/github/CEN3031-Fantastic4a/qu/badge.svg?branch=master)](https://coveralls.io/github/CEN3031-Fantastic4a/qu?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/CEN3031-Fantastic4a/qu/badge.svg)](https://snyk.io/test/github/CEN3031-Fantastic4a/qu)

![alt Qü LOGO*](https://github.com/CEN3031-Fantastic4a/qu/blob/master/modules/core/client/img/brand/qu.png)

Qü is a full stack MEAN stack application that allows users to act as renters for private parking spaces. The user has the ability to rent out a space and also rent one from another user for a set amount of time agreed upon by the renter and rentee.


### Heroku deployment of Development Branch
_Link to the deployment branch: https://qu-park.herokuapp.com/

### Update database and server links
_There is no server links directly implemented.
If the web app need to be transfered to another don't forget to update API keys to the new domain.
The database is at the moment located on MLAB in a sandbox

### Running in Development mode
_This is the next step for the application_
To run your application with *production* environment configuration:

```bash
$ npm start
```

Explore `config/env/development.js` for development environment configuration options.

### Running in Production mode
_This is the next step for the application_
To run your application with *production* environment configuration:

```bash
$ npm run start:prod
```

Explore `config/env/production.js` for production environment configuration options.

## Testing Your Application
You can run the full test suite included with MEAN.JS with the test task:

```bash
$ npm test
```
This will run both the server-side tests (located in the `app/tests/` directory) and the client-side tests (located in the `public/modules/*/tests/`).

To execute only the server tests, run the test:server task:

```bash
$ npm run test:server
```

To execute only the server tests and run again only changed tests, run the test:server:watch task:

```bash
$ npm run test:server:watch
```

And to run only the client tests, run the test:client task:

```bash
$ npm run test:client
```
### Screenshots Example of the Webapp

![alt img1*](https://github.com/CEN3031-Fantastic4a/qu/blob/master/public/img/img1.png)

![alt img2*](https://github.com/CEN3031-Fantastic4a/qu/blob/master/public/img/img2.png)

![alt img3*](https://github.com/CEN3031-Fantastic4a/qu/blob/master/public/img/img3.png)

![alt img4*](https://github.com/CEN3031-Fantastic4a/qu/blob/master/public/img/img4.png)

![alt img5*](https://github.com/CEN3031-Fantastic4a/qu/blob/master/public/img/img5.png)

![alt img6*](https://github.com/CEN3031-Fantastic4a/qu/blob/master/public/img/img6.png)
