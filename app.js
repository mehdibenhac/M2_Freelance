//---------------- Requires
var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var mongoose = require('mongoose');

var app = express();

//---------------- DB Config
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/fennec");

//---------------- App Config
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.set('view engine', 'pug');
app.use('/static', express.static(__dirname + '/public'));
app.locals.basedir = __dirname;

//---------------- Routes
var indexRoutes = require('./app/routes/indexRoutes.js');
var freelancerRoutes = require('./app/routes/freelancerRoutes.js');

app.use('/freelancer', freelancerRoutes);
app.use('/', indexRoutes);

//---------------- Server
var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log("Serveur démarré sur le port: " + PORT);
});