var express = require('express');
var mongoose = require('mongoose');

var app = express();

app.set('view engine', 'pug');
app.use('/static', express.static(__dirname + '/public'));
app.locals.basedir = __dirname;

app.get('/', function (req, res) {
    res.render('index.pug');
});
app.get('/signup/freelancer', function (req, res) {
    res.render('freelancer/signup/signup_1.pug');
});

app.listen(3000, function () {
    console.log("Server started on port 3000");
});