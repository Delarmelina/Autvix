// Declaration of the API
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();

// App Configurations
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Import the router
var router = require('./route/router.js');
app.use('/', router);

// API Server Start
var port = process.env.PORT || 3001;
app.listen(port);
console.log('Server is running on port ' + port);