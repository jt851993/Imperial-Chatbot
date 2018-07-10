require('dotenv').config({silent: true});

var express = require("express");
var bodyParser = require("body-parser");
var routes = require("./js/routes.js");
var stringBundle = require('./js/StringBundle');
var app = express();
var enviroment = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

routes(enviroment,app);

var server = app.listen(enviroment.PORT_NUMBER, function () {
    console.log(stringBundle.console_running_text, server.address().port);
});
