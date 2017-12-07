[![Build Status](https://travis-ci.org/CEN3031-Fantastic4a/qu.svg?branch=master)](https://travis-ci.org/CEN3031-Fantastic4a/qu)
[![Coverage Status](https://coveralls.io/repos/github/CEN3031-Fantastic4a/qu/badge.svg?branch=master)](https://coveralls.io/github/CEN3031-Fantastic4a/qu?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/CEN3031-Fantastic4a/qu/badge.svg)](https://snyk.io/test/github/CEN3031-Fantastic4a/qu)

![alt Qü LOGO*](https://github.com/CEN3031-Fantastic4a/qu/blob/master/modules/core/client/img/brand/qu.png)

Qü is a full stack MEAN stack application that allows users to act as renters for private parking spaces. The user has the ability to rent out a space and also rent one from another user for a set amount of time agreed upon by the renter and rentee.


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
### Deployment link: https://qu-park.herokuapp.com/
### Borrowed API's: 
		-Bootstrap
		-Google Maps
		-Braintree
		-MeanJS
		-Facebook
## Project Features Implemented
    ●	Users have the ability to log in through facebook or google
		●	The ability for the user to view all parking spots
		●	The ability for a user to add /delete /edit a parking spot
		●	The ability for a user to add a parking spot and see where its located
		●	The ability for a renter to rent a parking spot and see where it is located
		●	The ability for a user to contact the company about any recommendations         they have
		●	The ability for a renter to book a parking spot within a certain available time period
		●	The ability for a renter to view the spots they have rented
		●	The ability for a host to view the spots they have available 
		●	Users do not have the ability to modify other users parking spots with the exception being the admin user
		●	Users do not have the ability to add other parking on behalf of another user with the exception being the admin user
		●	Users do not have the ability to modify or change other users accounts with the exception being the  admin user. 
		●	Users have the ability to filter parking spots by location
		●	Users have the ability to create their own user profile with social media accounts
		●	Users have the ability to use payment servces to rent a parking spot
### Screenshots
		
### How to run project locally

$npm install -g yo
$ yo meanjs
$ grunt
$ npm install
$ npm start

### Update database and server connections
