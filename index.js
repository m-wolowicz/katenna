const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const config = require('./config');

const path = require('path');

// connect to the database and load models
require('./server/models').connect(config.dbUri);

const app = express();
// tell the app to look for static files in these directories
app.use(express.static('./server/static/'));
// app.use(express.static('./client/dist/'));
app.use(express.static('./client/dist/'));
// tell the app to parse HTTP body messages
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// pass the passport middleware
app.use(passport.initialize());



// load passport strategies
const localSignupStrategy = require('./server/passport/local-signup');
const localLoginStrategy = require('./server/passport/local-login');
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);

// pass the authenticaion checker middleware
const authCheckMiddleware = require('./server/middleware/auth-check');
app.use('/api', authCheckMiddleware);

// routes
const authRoutes = require('./server/routes/auth.js');
const apiRoutes = require('./server/routes/api.js');
const taskRoutes = require('./server/routes/TaskRoutes');
const employeeRoutes = require('./server/routes/TaskRoutes');
const companyRoutes = require('./server/routes/TaskRoutes');

app.use('/auth', authRoutes);
app.use('/api', apiRoutes);
app.use(taskRoutes);
app.use(employeeRoutes);
app.use(companyRoutes);


// Handles all routes so we don't get any error on undefined urls.
app.get('*', function (request, response) {
  response.sendFile(path.resolve('./server/static/', 'index.html'))
})


// Set Port, hosting services will look for process.env.PORT
app.set('port', (process.env.PORT || 3000));

// start the server
app.listen(app.get('port'), () => {
  console.log(`Server is running on port ${app.get('port')}`);
});