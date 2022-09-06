// Declaration of the API
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();

// App Configurations
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Import the multiple routes
var authrouter = require('./route/auth.js');
var genrouter = require('./route/gen.js');
app.use('/auth', authrouter); // Auth Router
app.use('/gen', genrouter); // Generic Router

// API Server Start
var port = process.env.PORT || 3001;
app.listen(port);
console.log('Server is running on port ' + port);