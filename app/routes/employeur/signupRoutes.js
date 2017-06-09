// ==========================
//      EMPLOYEUR Signup
// ==========================

var Router = require('express').Router();

// ===== Our requires
var Employeur = require('../../models/Employeur.js');
var User = require('../../models/User.js');
var Demande = require('../../models/Demande.js');
var Domaine = require('../../models/Domaine.js');
var middleware = require('../../middleware.js');

// ===== Use our middleware
Router.use(middleware.isNotLoggedIn);

Router.get('/', function (req, res, next) {
    var step = req.query.step;
    switch (step) {
        case undefined:
            res.render('employeur/signup/signup', {
                messages: req.flash('profileFound')
            });
            break;
        case "2":
            Domaine.find().select('_id titre').exec(function (err, domaines) {
                if (err) {
                    return next(err);
                }
                res.render('employeur/signup/signup_2', {
                    domaines: domaines
                });
            });
            break;
        case "3":
            res.render('employeur/signup/signup_3', {
                messages: req.flash('usernameFound'),
                profile: req.session.signup.profile
            })
            break;
    }
});

Router.post('/', function (req, res, next) {
    var step = req.query.step;
    switch (step) {
        case undefined:
            Employeur.findOne({
                $or: [{
                    'email': req.body.email
                }, {
                    'telephone': req.body.telephone
                }]
            }, function (err, foundEmployeur) {
                if (err) {
                    return next(err);
                }
                if (foundEmployeur !== null) {
                    req.flash('profileFound', 'Un profil employeur existe dèja avec l\'adresse mail et/ou le numéro de téléphone fournis');
                    req.redirect('back');
                } else {
                    req.session.signup = {
                        profile: req.body
                    };
                    res.redirect('signup?step=2');
                }
            });
            break;
        case "2":
            req.session.signup.profile["domaines"] = req.body.domaines;
            res.redirect('signup?step=3');
            break;
    }
});
Router.post('/final', function (req, res, next) {
    User.findOne({
        username: req.body.username
    }, function (err, foundUser) {
        if (err) {
            return next(err);
        }
        if (foundUser !== null) {
            req.flash('usernameFound', 'Le nom d\'utilisateur fourni est dèja utilisé');
            res.redirect('back');
        } else {
            var password = req.body.password;
            var profileData = req.session.signup.profile;
            var newEmployeur = new Employeur(profileData);
            var newUser = new User({
                username: req.body.username,
                profil: {
                    accountType: "Employeur",
                    ID: newEmployeur._id
                }
            });
            newEmployeur.userID = newUser._id;
            var newDemande = new Demande({
                profil: {
                    accountType: "Employeur",
                    ID: newEmployeur._id
                },
                status: 'pending'
            });
            newDemande.save(function (err, createdDemande) {
                if (err) {
                    console.log(err.stack)
                    return next(err);
                }
                User.register(newUser, password, function (err, createdUser) {
                    if (err) {
                        console.log(err.stack)
                        return next(err);
                    }
                    newEmployeur.save(function (err, createdEmployeur) {
                        if (err) {
                            console.log(err.stack)
                            return next(err);
                        }
                        req.logIn(createdUser, function (err) {
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
                    });
                });
            });

        }
    })
});

module.exports = Router;