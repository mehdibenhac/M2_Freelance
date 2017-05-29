// =========================
//      EMPLOYEUR Offres
// =========================

var Router = require('express').Router();
var middleware = require('../../middleware.js');
var Employeur = require('../../models/Employeur.js');
var Freelancer = require('../../models/Freelancer.js');
var Offre = require('../../models/Offre.js');
var Competence = require('../../models/Competence.js');
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
                employeur: employeur._id
            }).populate('competence').exec(function (err, offres) {
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
                employeur: employeur._id
            }, function (err, offresCount) {
                if (err) {
                    console.log(err.stack)
                    return next(err);
                }
                if (offresCount >= 10) {
                    req.flash('quotaOffres', 'Attention! vous ne pouvez plus ajouter d\'offres car vous avez atteint votre quota.');
                    return res.redirect('/employeur/offres');
                }
                Competence.find(function (err, competences) {
                    if (err) {
                        console.log(err.stack)
                        return next(err);
                    }
                    if (competences.length > 0) {
                        res.render('employeur/offres/ajout', {
                            currentRoute: 'offres',
                            user: employeur,
                            competences: competences
                        })
                    } else {
                        res.send('Competences null');
                    }
                });
            });
        } else {
            res.send('Employeur null')
        }
    });

});
Router.post('/ajout', upload.any(), function (req, res, next) {
    var url_conditions = '/static/uploads/' + req.files[0].filename;
    var url_autre = "";
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
        var newNotif = new Notification({
            titre: "Nouvelle offre publiée",
            contenu: "Une nouvelle offre a été publiée pour l'une de vos compétences",
            idOffre: offre._id
        });
        console.log(req.body.localOffre);
        if (req.body.localOffre === "Nationale") {
            Freelancer.find({
                'parametres.notif_offres': true,
                competences: offre.competence
            }).exec(function (err, freelancers) {
                freelancers.forEach(function (freelancer) {
                    newNotif.userID = freelancer.userID;
                    console.log('New notif: ' + newNotif);
                    newNotif.save();
                });
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
                    newNotif.userID = freelancer.userID;
                    console.log('New notif: ' + newNotif);
                    newNotif.save();
                });
                req.flash('offreAjoutee', 'Offre #' + offre._id + ' ajoutée avec succés.');
                res.redirect('/employeur/offres');
            });
        }
    });
});
Router.get('/details/:id', function (req, res, next) {
    var ID = req.params.id;
    console.log('got here');
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
                console.log(offre);
                callback(employeur, offre)
            });
        }
    ], function (employeur, offre) {
        console.log('Offre: ', offre);
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

module.exports = Router;