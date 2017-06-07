// =========================
//      EMPLOYEUR Contrats
// =========================

var Router = require('express').Router();
var middleware = require('../../middleware.js');
var Employeur = require('../../models/Employeur.js');
var Freelancer = require('../../models/Freelancer.js');
var Offre = require('../../models/Offre.js');
var Competence = require('../../models/Competence.js');
var Notification = require('../../models/Notification.js');
var Contrat = require('../../models/Contrat.js');
var moment = require('moment');
var shortid = require('shortid');
var multer = require('multer');
var async = require('async');

// Routes
Router.use(middleware.isLoggedIn, middleware.isFreelancer);

Router.get('/', function (req, res, next) {
    var titre = req.query.searchOffre || "";
    var nom = req.query.searchNom || "";
    var pnom = req.query.searchPnom || "";
    var etat = req.query.etat || "";
    Freelancer.findOne({
        userID: req.user.id
    }).populate('userID').exec(function (err, freelancer) {
        if (err) {
            console.log(err.stack)
            return next(err);
        }
        if (freelancer !== null) {
            Employeur.find({
                nom: {
                    "$regex": nom,
                    "$options": 'i'
                },
                pnom: {
                    "$regex": pnom,
                    "$options": 'i'
                }
            }, {
                _id: 1
            }, function (err, employeurs) {
                var idsEmployeur = employeurs.map(function (employeur) {
                    return employeur._id;
                });
                Offre.find({
                    titre: {
                        "$regex": titre,
                        "$options": 'i'
                    }
                }, {
                    _id: 1
                }, function (err, offres) {
                    var idsOffre = offres.map(function (offre) {
                        return offre._id
                    });
                    Contrat.find({
                        freelancer: req.user.profil.ID,
                        offre: {
                            $in: idsOffre
                        },
                        employeur: {
                            $in: idsEmployeur
                        },
                        etat: {
                            $regex: etat
                        }
                    }).sort({
                        etat: 1,
                        dateFin: 1
                    }).populate('offre employeur').exec(function (err, contrats) {
                        res.render('freelancer/contrats/list', {
                            currentRoute: 'contrats',
                            contratDeleted: req.flash("contratDeleted"),
                            user: freelancer,
                            contrats: contrats
                        });
                    });
                })
            })
        } else {
            res.send('Null!');
        }

    })
});
Router.get('/details/:id', function (req, res, next) {
    var ID = req.params.id;
    Freelancer.findById(req.user.profil.ID).exec(function (err, freelancer) {
        if (err) {
            console.log(err.stack)
            return next(err);
        }
        Contrat.findById(ID).populate('offre').populate({
            path: 'offre',
            populate: {
                path: 'competence'
            }
        }).exec(function (err, contrat) {
            if (err) {
                console.log(err.stack)
                return next(err);
            }
            if (contrat === null) {
                return res.redirect('/freelancer/contrats');
            }
            Employeur.aggregate([{
                "$match": {
                    _id: contrat.employeur
                },
            }, {
                "$addFields": {
                    "note_moy": {
                        "$avg": "$notations.note"
                    }
                }
            }, {
                "$sort": {
                    "note_moy": -1
                }
            }], function (err, aggregatedEmployeur) {
                if (err) {
                    console.log(err.stack)
                    return next(err);
                }
                res.render('freelancer/contrats/details', {
                    currentRoute: 'contrats',
                    user: freelancer,
                    contrat: contrat,
                    employeur: aggregatedEmployeur
                })
            })
        })

    })
});
Router.put('/details/:id', function (req, res, next) {
    var ID = req.params.id;
    Contrat.findByIdAndUpdate(ID, {
        etat: "Ouvert"
    }, function (err, contrat) {
        if (err) {
            console.log(err.stack)
            return next(err);
        }
        Offre.findByIdAndUpdate(contrat.offre, {
            etat: "Fermée",
        }, function (err, offre) {
            if (err) {
                console.log(err.stack)
                return next(err);
            }
            req.flash('contratAccepted', 'Votre contrat a été accepté avec succés');
            res.redirect('/freelancer/contrats/details/' + contrat._id);
        });
    })
});
Router.post('/details/:id/cloturer', function (req, res, next) {
    var ID = req.params.id;
    var note = {
        note: req.body.note,
        freelancer: req.user.profil.ID,
        contrat: ID
    };
    Contrat.findByIdAndUpdate(ID, {
        etat: "Cloturation"
    }, function (err, contrat) {
        if (err) {
            console.log(err.stack)
            return next(err);
        }
        Employeur.findByIdAndUpdate(contrat.employeur, {
            $push: {
                notations: note
            }
        }, function (err, employeur) {
            if (err) {
                console.log(err.stack)
                return next(err);
            }
            res.send({
                contrat: contrat,
                employeur: employeur
            })
        })
    });
});
module.exports = Router;