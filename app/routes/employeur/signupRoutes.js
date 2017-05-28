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
            delete req.body["REpassword"]
            var userData = req.body;
            var password = req.body.password;
            delete userData["password"];
            var profileData = req.session.signup.profile;
            var newUser = new User(userData);
            var newDemande = new Demande({
                userID: newUser._id,
                state: 'pending'
            });
            newDemande.save(function (err, createdDemande) {
                if (err) {
                    console.log(err.stack)
                    return next(err);
                }
                newUser.demandes.push(createdDemande);
                User.register(newUser, password, function (err, createdUser) {
                    if (err) {
                        return next(err);
                    }
                    var newEmployeur = new Employeur(profileData);
                    newEmployeur.userID = createdUser._id;
                    newEmployeur.save(function (err, createdEmployeur) {
                        if (err) {
                            return next(err);
                        }
                        req.session.destroy();
                        res.send({
                            'Message': "Employeur créé avec succés",
                            'User': createdUser,
                            'Employeur': createdEmployeur,
                            'Demande': createdDemande
                        })
                    });
                });
            });

        }
    })
});

module.exports = Router;