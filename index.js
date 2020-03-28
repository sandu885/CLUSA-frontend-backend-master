// Example express application adding the parse-server module to expose Parse
// compatible API routes.
require('console-stamp')(console, { pattern: 'dd/mm/yyyy HH:MM:ss.l' });

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();
app.use(cors({ 
  exposedHeaders: ['Content-Disposition']
}));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());


if (app.get('env') === 'development') {
  //databaseUri = "mongodb://chivalry:chivalry94539@ds233258.mlab.com:33258/intern_grand_db"; //development
  databaseUri = "mongodb:27017/intern_grand_db_prod_2";
  console.log("In development env...");
}

databaseUri = "mongodb:27017/intern_grand_db_prod_2";

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'appId',
  masterKey: process.env.MASTER_KEY || 'masterKey', //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse',  // Don't forget to change to https if needed
  sessionLength: 60 * 60 * 3, //session token expire time
  liveQuery: {
    classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
  }
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

// Serve static assets from the /public folder
// app.use('/public', express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, './client/build')));

app.use('/uploads', express.static(path.join(__dirname, './uploads')));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes
app.get('*', function(req, res) {
  // res.status(200).send('I dream of being a website.  Please star the parse-server repo on GitHub!');
   return res.sendFile(path.join(__dirname, './client/build/', 'index.html'))
});

const serviceRoutes = require('./middlewares/service/service');
app.use('/api', serviceRoutes);

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/test', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
});

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);