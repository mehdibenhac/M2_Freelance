var Router = require('express').Router(),
    moment = require('moment'),
    mongoose = require('mongoose'),
    middleware = require('../middleware.js'),
    passport = require('passport');


Router.get('/', function (req, res) {
    res.render('index');
});
Router.get('/login', middleware.isNotLoggedIn, function (req, res) {
    if (req.session.loginLocked && moment().unix() - req.session.lockedAt < 59) {
        var timeDiff = moment().unix() - req.session.lockedAt;
        res.send('Wait before trying to login again! it has been: ' + timeDiff + ' seconds since the last attempt!');
    } else if (req.session.loginLocked && moment().unix() - req.session.lockedAt >= 59) {
        req.session.loginLocked = false;
        req.session.lockedAt = 0;
        req.session.loginAttempts = 0;
        res.render('login');
    } else if (!req.session.loginLocked) {
        res.render('login');
    }
});
Router.get('/logout', middleware.isLoggedIn, function (req, res) {
    req.logout();
    res.send("Logged out!")
});
Router.post('/login', middleware.isNotLoggedIn, function (req, res, next) {
    if (!req.session.loginLocked) {
        passport.authenticate('local', function (err, user, info) {
            if (err) {
                console.log(err);
                return next();
            }
            if (!user) {
                if (req.session.loginAttempts < 4) {
                    req.session.loginAttempts = req.session.loginAttempts + 1;
                    console.log('Authenticate failed! Attempt: ' + req.session.loginAttempts)
                    return res.redirect('/login?failure');
                } else {
                    req.session.loginLocked = true;
                    req.session.lockedAt = moment().unix();
                    return res.send('Failed login 5 times! aborting and locking account fo 1 minute.')
                }
            }
            req.logIn(user, function (err) {
                if (err) {
                    return next(err)
                }
                req.session.loginAttempts = 0;
                return res.json({
                    message: "Login success",
                    User: req.user
                });
            });
        })(req, res, next);
    } else {
        res.redirect('/login');
    }

});
Router.delete('/resetDB', function (req, res, next) {
    var collections = ["users", "freelancers", "employeurs", "demandes", "justificatifs"];
    collections.forEach(function (collectionName) {
        mongoose.connection.db.listCollections({
            "name": collectionName
        }).next(function (err, collinfo) {
            if (err) {
                console.log(err.stack)
                return next(err);
            }
            if (collinfo) {
                mongoose.connection.db.dropCollection(collectionName,
                    function (err, result) {
                        if (err) {
                            console.log(err.stack);
                            return next(err);
                        }
                        res.send(collectionName + ' collection dropped!');
                    });
            } else {
                res.send("The " + collectionName + " collection does not exist!");
            }
        })
    })

});
Router.delete('/reset', function (req, res, next) {
    var collectionName = req.query.collection;
    mongoose.connection.db.listCollections({
        "name": collectionName
    }).next(function (err, collinfo) {
        if (err) {
            console.log(err.stack)
            return next(err);
        }
        if (collinfo) {
            mongoose.connection.db.dropCollection(collectionName,
                function (err, result) {
                    if (err) {
                        console.log(err.stack);
                        return next(err);
                    }
                    res.send(collectionName + ' collection dropped!');
                });
        } else {
            res.send("The " + collectionName + " collection does not exist!");
        }
    })

});
module.exports = Router;