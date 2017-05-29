// ===========================
//     FREELANCER MODIFIER
// ===========================

var Router = require('express').Router();
var middleware = require('../../middleware.js');
var Freelancer = require('../../models/Freelancer.js');
var User = require('../../models/User.js');
var Competence = require('../../models/Competence.js');
var Demande = require('../../models/Demande.js');
var shortid = require('shortid');
var multer = require('multer');
var _ = require('underscore');
var moment = require('moment');

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

// ===== routes pour les modifications du profil

Router.get('/profil', middleware.isLoggedIn, middleware.isFreelancer, function (req, res) {
    var user = req.user;
    var allowModif = true;
    var lastModified = 'Aucune modification enregistrée';
    Freelancer.findOne({
        userID: req.user._id
    }).populate('userID competences').exec(function (err, freelancer) {
        if (err) {
            console.log(err.stack)
            return next(err);
        }
        if (typeof (freelancer.lastModified) !== "undefined") {
            lastModified = moment(freelancer.lastModified);
            var now = moment();
            if (now.diff(lastModified, 'days') <= 7) {
                allowModif = false;
            }
            lastModified = moment(freelancer.lastModified).format('D MMMM YYYY');
        }
        res.render('./freelancer/modifierProfil', {
            messages: {
                modifierStatus: req.flash('modifierStatus'),
            },
            lastModified: lastModified,
            user: freelancer,
            allowModif: allowModif
        });
    });
});
Router.put('/profil', middleware.isLoggedIn, middleware.isFreelancer, function (req, res) {
    var user = req.user;
    Freelancer.findOneAndUpdate({
        userID: req.user._id
    }, {
        email: req.body.email,
        telephone: req.body.telephone,
        wilayaAdr: req.body.wilayaAdr,
        communeAdr: req.body.communeAdr,
        quartierAdr: req.body.quartierAdr,
        lotissementAdr: req.body.lotissementAdr,
        lastModified: Date.now()
    }).exec(function (err, updated) {
        if (err) {
            console.log(err.stack)
            return next(err);
        }
        if (updated !== null) {
            req.flash('modifierStatus', 'Profil modifié avec succés.')
            res.redirect('/freelancer/modifier/profil');
        } else {
            req.flash('modifierStatus', 'Impossible de modifier le profil.')
            res.redirect('/freelancer/modifier/profil');
        }

    });
});

// ===== routes pour les modifications des compétences

Router.get('/competences', middleware.isLoggedIn, middleware.isFreelancer, function (req, res) {
    Demande.findOne({
        "profil.ID": req.user.profil.ID,
        "status": "pending"
    }, function (err, demande) {
        if (err) {
            console.log(err.stack)
            return next(err);
        }
        if (demande !== null) {
            req.flash('demandeTrouvee', 'Vous avez une demande en attente de traitement.')
            res.redirect('/freelancer/demande/' + demande._id);
        } else {
            Freelancer.findOne({
                userID: req.user._id
            }).populate('competences').populate({
                path: "competences",
                populate: {
                    path: "domaine"
                }
            }).exec(function (err, freelancer) {
                if (err) {
                    console.log(err.stack)
                    return next(err);
                }
                if (freelancer !== null) {
                    Competence.find(function (err, competences) {
                        if (err) {
                            console.log(err.stack)
                            return next(err);
                        }
                        if (competences.length > 0) {
                            var user = freelancer;
                            user.userID = req.user;
                            res.render('./freelancer/modifierCompetences', {
                                user: user,
                                competences: competences,
                                sameCompets: req.flash('sameCompets')
                            })
                        } else {
                            res.send('Error ? No competence found!');
                        }
                    })
                } else {
                    res.send('Error ? No freelancer found!');
                }
            })
        }
    });
});
Router.put('/competences', function (req, res, next) {
    Freelancer.findOne({
        userID: req.user._id
    }).select('competences').exec(function (err, freelancer) {
        if (err) {
            console.log(err.stack)
            return next(err);
        }
        if (_.isEqual(req.body.compets, freelancer.competences)) {
            req.flash('sameCompets', 'Les compétences selectionnées sont les mêmes.');
            res.redirect('/freelancer/modifier/competences');
        } else if (freelancer.competences.length === 1 && req.body.compets === freelancer.competences[0]) {
            req.flash('sameCompets', 'Les compétences selectionnées sont les mêmes.');
            res.redirect('/freelancer/modifier/competences');
        } else {
            freelancer.competences = req.body.compets;
            freelancer.isValid = false;
            freelancer.save(function (err, savedFreelancer) {
                if (err) {
                    console.log(err.stack)
                    return next(err);
                }
                req.flash('competModifSuccess', 'Compétences modifiée avec succés.');
                res.redirect('/freelancer');
            });
        }
    });
});

// ===== routes pour la validation du profil:

Router.get('/validate', function (req, res, next) {
    Demande.findOne({
        "profil.ID": req.user.profil.ID,
        "status": 'pending'
    }, function (err, demande) {
        if (err) {
            console.log(err.stack)
            return next(err);
        }
        if (demande !== null) {
            req.flash('validateTrouvee', 'Une demande de validation a déja été trouvée pour votre compte.')
            return res.redirect('/freelancer/demande/' + demande._id);
        }
        Freelancer.findOne({
            'userID': req.user._id
        }).populate('userID competences').populate({
            path: 'competences',
            populate: {
                path: 'domaine'
            }
        }).exec(function (err, freelancer) {
            if (err) {
                console.log(err.stack)
                return next(err);
            }
            res.render('freelancer/demande/ajout', {
                user: freelancer
            });
        });
    });
});
Router.post('/validate', upload.any(), function (req, res, next) {
    var newDemande = new Demande({
        profil: req.user.profil,
        status: 'pending'
    });
    for (var i = 0; i < req.files.length; i++) {
        var newJustificatif = {
            url: '/static/uploads/' + req.files[i].filename,
            competence: req.body["idCompetenceJustif" + i]
        };
        newDemande.justificatifs.push(newJustificatif);
    };
    newDemande.save(function (err, createdDemande) {
        if (err) {
            console.log(err.stack)
            return next(err);
        }
        req.flash('demandeCreated', 'Demande créée avec succés.');
        res.redirect('/freelancer/demande/' + createdDemande._id);
    });
});
module.exports = Router;