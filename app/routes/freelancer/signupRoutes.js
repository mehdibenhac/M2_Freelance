// =========================
//     FREELANCER Signup
// =========================


var Router = require('express').Router();
var shortid = require('shortid');
var multer = require('multer');
var middleware = require('../../middleware.js');

// ===== Models
var Freelancer = require('../../models/Freelancer.js');
var User = require('../../models/User.js');
// var Justificatif = require('../../models/Justificatif.js');
var Demande = require('../../models/Demande.js');
var Competence = require('../../models/Competence.js');
// ===== Multer Settings
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, shortid.generate() + file.originalname);

    }
});
var upload = multer({
    storage: storage
});

// ===== Use our middleware
Router.use(middleware.isNotLoggedIn);

// ===== Routes
Router.get('/', function (req, res, next) {
    var step = req.query.step;
    switch (step) {
        case undefined:
            res.render('freelancer/signup/signup', {
                messages: req.flash('profileFound'),
            });
            break;
        case "2":
            Competence.find().select('_id titre').exec(function (err, competences) {
                if (err) {
                    return next(err);
                }
                res.render('freelancer/signup/signup_2', {
                    competences: competences
                })
            });
            break;
        case "3":
            res.render('freelancer/signup/signup_3', {
                messages: req.flash('usernameFound')
            })
            break;
        case "4":
            Competence.find({
                _id: {
                    $in: req.session.signup.profile.competences
                }
            }).select('titre').exec(function (err, competences) {
                if (err) {
                    return next(err);
                }
                res.render('freelancer/signup/signup_4', {
                    messages: '',
                    profile: req.session.signup.profile,
                    competences: competences,
                    account: req.session.signup.account
                });
            })

            break;
    }
});

Router.post('/', function (req, res, next) {
    var skip = req.query.skip;
    var step = req.query.step;
    switch (step) {
        case undefined:
            Freelancer.findOne({
                $or: [{
                        email: req.body.email
                    },
                    {
                        telephone: req.body.telephone
                    }
                ]
            }, function (err, foundProfile) {
                if (err) {
                    return next(err);
                }
                if (foundProfile !== null) {
                    req.flash('profileFound', 'Un profil freelancer existe dèja avec l\'adresse mail et/ou le numéro de téléphone fournis');
                    res.redirect('back');
                } else {
                    console.log('Everything ok.');
                    req.session.signup = {
                        profile: req.body
                    };
                    res.redirect('signup?step=2');
                }
            })
            break;
        case "2":
            req.session.signup.profile["competences"] = req.body.compets;
            res.redirect('signup?step=3');
            break;
        case "3":
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
                    req.session.signup.account = req.body;
                    res.redirect('signup?step=4');
                }
            })
            break;
    }
});

Router.post('/final', upload.any(), function (req, res, next) {
    var skip = req.query.skip;
    var freelancerData = req.session.signup.profile;
    var password = req.session.signup.account.password;
    var userData = req.session.signup.account;
    delete userData["password"];
    if (skip === "false") {
        var newUser = new User(userData);
        User.register(newUser, password, function (err, createdUser) {
            if (err) {
                return next(err);
            }
            console.log('Freelancer created! Nanerr');
            var newFreelancer = new Freelancer(freelancerData);
            newFreelancer.userID = createdUser._id;
            newFreelancer.save(function (err, createdFreelancer) {
                if (err) {
                    return next(err);
                }
                console.log('Freelancer created with userID: ' + createdUser._id);
                var newDemande = new Demande({
                    userID: createdUser._id,
                    state: 'pending'
                });
                for (var i = 0; i < req.files.length; i++) {
                    var newJustificatif = {
                        url: '/static/uploads/' + req.files[i].filename
                    };
                    newDemande.justificatifs.push(newJustificatif);
                }
                newDemande.save(function (err, createdDemande) {
                    if (err) {
                        return next(err);
                    }
                    console.log('Demande created!');
                    req.session.destroy();
                    res.send({
                        User: createdUser,
                        Freelancer: createdFreelancer,
                        Demande: createdDemande
                    });
                })
            });
        });
    } else if (skip === "true") {
        var newUser = new User(userData);
        User.register(newUser, password, function (err, createdUser) {
            if (err) {
                return next(err);
            }
            console.log('User created!');
            var newFreelancer = new Freelancer(freelancerData);
            newFreelancer.userID = createdUser._id;
            newFreelancer.save(function (err, createdFreelancer) {
                if (err) {
                    return next(err);
                }
                req.session.destroy();
                res.send({
                    User: createdUser,
                    Freelancer: createdFreelancer
                });
            });
        });
    }

});
module.exports = Router;