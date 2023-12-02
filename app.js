var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const admin = require('firebase-admin');
var logger = require('morgan');
var app = express();
app.use(express.json());
const serviceAccount = require('./serviceAccount.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://myprojectnt131-9e949-default-rtdb.firebaseio.com/' 
});


const pathFolders = require("./pathFolders");
global.__base = __dirname + '/';
global.__path_configs = __base + pathFolders.folder_configs + '/';
global.__path_routes = __base + pathFolders.folder_routes + '/';

app.use('/api/v1', require(__path_routes));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
module.exports = app;