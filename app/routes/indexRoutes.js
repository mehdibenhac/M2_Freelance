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
        res.redirect('/loginBlocked');
    } else if (req.session.loginLocked && moment().unix() - req.session.lockedAt >= 59) {
        req.session.loginLocked = false;
        req.session.lockedAt = 0;
        req.session.loginAttempts = 0;
        var fail = (req.flash('fail')).toString();
        res.render('login', {
            authFail: fail,
            loggedOut: req.flash('loggedOut')
        });
    } else if (!req.session.loginLocked) {
        var fail = (req.flash('fail')).toString();
        console.log(fail.length);
        console.log(fail === "");
        console.log(fail);
        res.render('login', {
            authFail: fail,
            loggedOut: req.flash('loggedOut')
        });
    }
});
Router.get('/loginBlocked', function (req, res, next) {
    if (req.session.loginLocked && moment().unix() - req.session.lockedAt < 59) {
        var timeDiff = moment().unix() - req.session.lockedAt;
        if (timeDiff > 0) {
            req.flash('waitLogin', 'Patientez 1 minute avant de reessayer de vous connecter. ' + timeDiff + ' secondes se sont écoulées depuis votre derniere tentative!');
        }
        res.render('loginBlocked', {
            waitLogin: req.flash('waitLogin'),
            loginBlocked: req.flash('lock'),
        })
    } else if (req.session.loginLocked && moment().unix() - req.session.lockedAt >= 59) {
        req.session.loginLocked = false;
        req.session.lockedAt = 0;
        req.session.loginAttempts = 0;
        res.redirect('/login');
    }
});
Router.get('/logout', middleware.isLoggedIn, function (req, res) {
    req.logout();
    req.flash('loggedOut', 'Vous vous êtes deconnecté avec succés.');
    res.redirect('/login')
});
Router.post('/login', middleware.isNotLoggedIn, function (req, res, next) {
    if (!req.session.loginLocked) {
        passport.authenticate('local', function (err, user, info) {
            if (err) {
                if (err) {
                    console.log(err.stack)
                    return next(err);
                }
            }
            if (!user) {
                if (req.session.loginAttempts < 4) {
                    req.session.loginAttempts = req.session.loginAttempts + 1;
                    req.flash('fail', 'Authentification échouée. Essai n°: ' + req.session.loginAttempts);
                    return res.redirect('/login');
                } else {
                    req.session.loginLocked = true;
                    req.session.lockedAt = moment().unix();
                    req.flash('lock', 'Authentication échouée pour la cinquiéme fois. Patientez 1 minute avant de reessayer.');
                    return res.redirect('/loginBlocked');
                }
            }
            req.logIn(user, function (err) {
                if (err) {
                    return next(err)
                }
                req.session.loginAttempts = 0;
                switch (req.user.profil.accountType) {
                    case "Freelancer":
                        res.redirect('/freelancer');
                        break;
                    case "Employeur":
                        res.redirect('/employeur')
                }
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