var Router = require('express').Router(),
    moment = require('moment'),
    mongoose = require('mongoose'),
    middleware = require('../middleware.js'),
    passport = require('passport');

var Employeur = require('../models/Employeur.js');
var Freelancer = require('../models/Freelancer.js');
var User = require('../models/User.js');
var Notification = require('../models/Notification.js');

Router.get('/', function (req, res, next) {
    var user = req.user.profil.accountType;
    var userID = req.user.profil.ID;
    switch (user) {
        case "Employeur":
            Employeur.findById(userID).exec(function (err, employeur) {
                if (err) {
                    console.log(err.stack)
                    return next(err);
                }
                Notification
                    .find({
                        userID: req.user._id
                    })
                    .sort({
                        date_ajout: -1
                    })
                    .exec(function (err, notifications) {
                        if (err) {
                            console.log(err.stack)
                            return next(err);
                        }
                        res.render('employeur/notifications/list', {
                            user: employeur,
                            notifications: notifications,
                            notifRemoved: req.flash('notifRemoved')
                        });
                    });
            });
            break;
        case "Freelancer":
            Freelancer.findById(userID).exec(function (err, freelancer) {
                if (err) {
                    console.log(err.stack)
                    return next(err);
                }
                Notification
                    .find({
                        userID: req.user._id
                    })
                    .sort({
                        date_ajout: -1
                    })
                    .exec(function (err, notifications) {
                        if (err) {
                            console.log(err.stack)
                            return next(err);
                        }
                        res.render('freelancer/notifications/list', {
                            user: freelancer,
                            notifications: notifications,
                            notifRemoved: req.flash('notifRemoved')
                        });
                    });
            });
            break;
    }
});
Router.get('/n/:id', function (req, res, next) {
    var ID = req.params.id;
    var user = req.user.profil.accountType;
    var userID = req.user.profil.ID;
    switch (user) {
        case "Employeur":
            Employeur.findById(userID).exec(function (err, employeur) {
                if (err) {
                    console.log(err.stack)
                    return next(err);
                }
                Notification
                    .findByIdAndUpdate(ID, {
                        lu: true
                    }, function (err, notification) {
                        if (err) {
                            console.log(err.stack)
                            return next(err);
                        }
                        res.render('employeur/notifications/details', {
                            user: employeur,
                            notification: notification
                        });
                    });
            });
            break;
        case "Freelancer":
            Freelancer.findById(userID).exec(function (err, freelancer) {
                if (err) {
                    console.log(err.stack)
                    return next(err);
                }
                Notification
                    .findByIdAndUpdate(ID, {
                        lu: true
                    }, function (err, notification) {
                        if (err) {
                            console.log(err.stack)
                            return next(err);
                        }
                        res.render('freelancer/notifications/details', {
                            user: freelancer,
                            notification: notification
                        });
                    });
            });
            break;
    }
});

Router.delete('/n/:id', function (req, res, next) {
    var ID = req.params.id;
    Notification.findByIdAndRemove(ID).exec(function (err, notification) {
        if (err) {
            console.log(err.stack)
            return next(err);
        }
        req.flash('notifRemoved', 'Notification supprimée avec succés');
        res.redirect('/notifications');
    });
});
module.exports = Router;