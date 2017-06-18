// =========================
//      EMPLOYEUR Offres
// =========================

var Router = require('express').Router();
var middleware = require('../../middleware.js');
var Utility = require('../../Utility.js');
var Employeur = require('../../models/Employeur.js');
var Freelancer = require('../../models/Freelancer.js');
var Offre = require('../../models/Offre.js');
var Competence = require('../../models/Competence.js');
var Domaine = require('../../models/Domaine.js');
var Notification = require('../../models/Notification.js');
var moment = require('moment');
var shortid = require('shortid');
var multer = require('multer');
var async = require('async');

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

// Routes
Router.use(middleware.isLoggedIn, middleware.isEmployeur);

Router.get('/', function (req, res, next) {
    Employeur.findOne({
        userID: req.user.id
    }).populate('userID').exec(function (err, employeur) {
        if (err) {
            console.log(err.stack)
            return next(err);
        }
        if (employeur !== null) {
            Offre.find({
                employeur: employeur._id,
                $or: [{
                        etat: 'Ouverte'
                    },
                    {
                        etat: 'Négociation'
                    }
                ]
            }).populate('competence').sort({
                dateAjout: -1,
                postulants: -1
            }).exec(function (err, offres) {
                var offresCount = offres.length;
                res.render('employeur/offres/list', {
                    currentRoute: 'offres',
                    user: employeur,
                    quotaOffres: req.flash('quotaOffres'),
                    offreRemoved: req.flash('offreRemoved'),
                    offres: offres,
                    offresCount: offresCount
                })
            })
        } else {
            res.send('Null!');
        }

    })
});
Router.get('/ajout', function (req, res, next) {
    Employeur.findOne({
        userID: req.user._id
    }).populate('userID').exec(function (err, employeur) {
        if (err) {
            console.log(err.stack)
            return next(err);
        }
        if (employeur !== null) {
            Offre.count({
                employeur: employeur._id,
                $or: [{
                        etat: 'Ouverte'
                    },
                    {
                        etat: 'Négociation'
                    }
                ]
            }, function (err, offresCount) {
                if (err) {
                    console.log(err.stack)
                    return next(err);
                }
                if (offresCount >= 10) {
                    req.flash('quotaOffres', 'Attention! vous ne pouvez plus ajouter d\'offres car vous avez atteint votre quota.');
                    return res.redirect('/employeur/offres');
                }
                // Competence.find(function (err, competences) {
                //     if (err) {
                //         console.log(err.stack)
                //         return next(err);
                //     }
                Domaine.find(function (err, domaines) {
                    if (err) {
                        console.log(err.stack)
                        return next(err);
                    }
                    res.render('employeur/offres/ajout', {
                        currentRoute: 'offres',
                        user: employeur,
                        domaines: domaines
                    })
                })
                // });
            });
        } else {
            res.send('Employeur null')
        }
    });

});
Router.post('/ajout', upload.any(), function (req, res, next) {
    var url_conditions = '/static/uploads/' + req.files[0].filename;
    var url_autre = "";
    var targets = [];
    if (typeof (req.files[1]) !== 'undefined') {
        url_autre = '/static/uploads/' + req.files[1].filename;
    }
    var newOffre = new Offre({
        titre: req.body.titreOffre,
        competence: req.body.competOffre,
        description: req.body.descriptionOffre,
        duree_min: req.body.dureeMin,
        duree_max: req.body.dureeMax,
        employeur: req.user.profil.ID,
        url_conditions: url_conditions,
        url_autre: url_autre,
        localisation: req.body.localOffre
    });
    newOffre.save(function (err, offre) {
        if (err) {
            console.log(err.stack)
            return next(err);
        }
        if (req.body.localOffre === "Nationale") {
            Freelancer.find({
                'parametres.notif_offres': true,
                competences: offre.competence
            }).exec(function (err, freelancers) {
                freelancers.forEach(function (freelancer) {
                    targets.push(freelancer.userID);
                });
                Utility.notifyOffre(targets, offre._id);
                req.flash('offreAjoutee', 'Offre #' + offre._id + ' ajoutée avec succés.');
                res.redirect('/employeur/offres');
            });
        } else {
            Freelancer.find({
                'parametres.notif_offres': true,
                wilayaAdr: offre.localisation,
                competences: offre.competence
            }).exec(function (err, freelancers) {
                freelancers.forEach(function (freelancer) {
                    targets.push(freelancer.userID);
                });
                Utility.notifyOffre(targets, offre._id);
                req.flash('offreAjoutee', 'Offre #' + offre._id + ' ajoutée avec succés.');
                res.redirect('/employeur/offres');
            });
        }
    });
});
Router.get('/details/:id', function (req, res, next) {
    var ID = req.params.id;
    async.waterfall([
        function (callback) {
            Employeur.findOne({
                userID: req.user._id
            }).populate('userID').exec(function (err, employeur) {
                if (err) {
                    console.log(err.stack)
                    return next(err);
                }
                callback(null, employeur);
            });
        },
        function (employeur, callback) {
            Offre.findOne({
                _id: ID
            }).populate('competence postulants').exec(function (err, offre) {
                if (err) {
                    console.log(err.stack)
                    return next(err);
                }
                callback(employeur, offre)
            });
        }
    ], function (employeur, offre) {
        res.render('employeur/offres/details', {
            currentRoute: 'offres',
            user: employeur,
            offre: offre
        });
    });
});
Router.delete('/details/:id', function (req, res, next) {
    var ID = req.params.id;
    Offre.findByIdAndRemove(ID, function (err, deletedDocument) {
        if (err) {
            console.log(err.stack)
            return next(err);
        }
        if (deletedDocument !== null) {

            // TODO:
            // NOTIFY POSTULANTS WHEN OFFRE IS DELETED!

            req.flash('offreRemoved', 'L\'offre #' + deletedDocument._id + 'a été supprimée avec succés.');
            res.redirect('/employeur/offres');
        } else {
            res.send('Offre deletion: NULL');
        }
    });
});
Router.get('/details/:id/mod', function (req, res, next) {
    var ID = req.params.id;
    async.waterfall([
        function (callback) {
            Employeur.findOne({
                userID: req.user._id
            }).populate('userID').exec(function (err, employeur) {
                if (err) {
                    console.log(err.stack)
                    return next(err);
                }
                callback(null, employeur);
            });
        },
        function (employeur, callback) {
            Offre.findOne({
                _id: ID
            }).populate('competence postulants').exec(function (err, offre) {
                if (err) {
                    console.log(err.stack)
                    return next(err);
                }
                callback(employeur, offre)
            });
        }
    ], function (employeur, offre) {
        Domaine.find(function (err, domaines) {
            if (err) {
                console.log(err.stack)
                return next(err);
            }
            res.render('employeur/offres/mod', {
                currentRoute: 'offres',
                user: employeur,
                domaines: domaines,
                offre: offre
            })
        });
    });
});
Router.put('/details/:id/mod', upload.any(), function (req, res, next) {
    var url_conditions = '/static/uploads/' + req.files[0].filename;
    var url_autre = "";
    if (typeof (req.files[1]) !== 'undefined') {
        url_autre = '/static/uploads/' + req.files[1].filename;
    }
    var ID = req.params.id;
    var targets = [];
    Offre.findByIdAndUpdate(ID, {
        $set: {
            titre: req.body.titreOffre,
            competence: req.body.competOffre,
            description: req.body.descriptionOffre,
            duree_min: req.body.dureeMin,
            duree_max: req.body.dureeMax,
            url_conditions: url_conditions,
            url_autre: url_autre,
            localisation: req.body.localOffre,
        }
    }, function (err, offre) {
        if (err) {
            console.log(err.stack)
            return next(err);
        }
        offre.populate('postulants', function (err, offre) {
            offre.postulants.forEach(function (postulant) {
                targets.push(postulant.userID);
            });
            Utility.notifyModOffre(targets, offre._id);
            offre.postulants = [];
            offre.save(function (err, offre) {
                if (err) {
                    console.log(err.stack)
                    return next(err);
                }
                res.redirect('/employeur/offres/details/' + offre._id);
            });
        })

    });
});
module.exports = Router;