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
    var newFreelancer = new Freelancer(freelancerData);
    var newUser = new User({
        username: req.session.signup.account.username,
        profil: {
            accountType: "Freelancer",
            ID: newFreelancer._id
        }
    });
    newFreelancer.userID = newUser._id;
    console.log(newUser);
    if (skip === "false") {
        var newDemande = new Demande({
            profil: {
                accountType: "Freelancer",
                ID: newFreelancer._id
            },
            status: 'pending'
        });
        for (var i = 0; i < req.files.length; i++) {
            var newJustificatif = {
                url: '/static/uploads/' + req.files[i].filename,
                competence: req.body["idCompetenceJustif" + i]
            };
            newDemande.justificatifs.push(newJustificatif);
        }
        newDemande.save(function (err, createdDemande) {
            if (err) {
                console.log(err.stack)
                return next(err);
            }
            newFreelancer.save(function (err, createdFreelancer) {
                if (err) {
                    console.log(err.stack)
                    return next(err);
                }
                User.register(newUser, password, function (err, createdUser) {
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
                    // res.send({
                    //     message: 'Freelancer créé avec succés!',
                    //     User: createdUser,
                    //     Freelancer: createdFreelancer,
                    //     Demande: createdDemande
                    // });
                });
            });
        });

    } else if (skip === "true") {
        User.register(newUser, password, function (err, createdUser) {
            if (err) {
                return next(err);
            }
            console.log('User created!');
            newFreelancer.save(function (err, createdFreelancer) {
                if (err) {
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
    }

});
module.exports = Router;