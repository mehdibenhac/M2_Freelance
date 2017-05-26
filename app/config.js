//---------------- App Config
var express = require('express'),
    bodyParser = require('body-parser'),
    _ = require('underscore'),
    logger = require('morgan'),
    flash = require('connect-flash'),
    session = require('express-session'),
    passport = require('passport'),
    localStrategy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    User = require('./models/User.js'),
    RedisStore = require('connect-redis')(session),
    moment = require('moment'),
    methodOverride = require('method-override'),
    redis = require('redis').createClient();



module.exports = function (app) {
    // Configure moment language:
    moment.locale('fr');
    // Setup methodOverride
    app.use(methodOverride('_method'));
    // To save session in a redis store:
    app.use(session({
        secret: "Mehdiana Jones",
        store: new RedisStore({
            host: 'localhost',
            port: 6379,
            client: redis
        }),
        resave: false,
        saveUninitialized: true
    }));
    // Use the morgan logger & initialize the session:
    // app.use(logger('dev'));
    app.use(session({
        secret: "Mehdiana Jones",
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 60000
        }
    }));
    // Use flash and body-parser:
    app.use(flash());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    // Setup passport:
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new localStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
    // Setup view engine a static directory/basedir:
    app.set('view engine', 'pug');
    app.use('/static', express.static(__dirname + /../ + '/public'));
    app.locals.basedir = __dirname + /../;
}