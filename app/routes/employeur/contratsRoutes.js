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
Router.use(middleware.isLoggedIn, middleware.isEmployeur);

Router.get('/', function (req, res, next) {
    var titre = req.query.searchOffre || "";
    var nom = req.query.searchNom || "";
    var pnom = req.query.searchPnom || "";
    var etat = req.query.etat || "";
    Employeur.findOne({
        userID: req.user.id
    }).populate('userID').exec(function (err, employeur) {
        if (err) {
            console.log(err.stack)
            return next(err);
        }
        if (employeur !== null) {
            Freelancer.find({
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
            }, function (err, freelancers) {
                var idsFreelancer = freelancers.map(function (freelancer) {
                    return freelancer._id;
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
                        offre: {
                            $in: idsOffre
                        },
                        freelancer: {
                            $in: idsFreelancer
                        },
                        etat: {
                            $regex: etat
                        }
                    }).sort({
                        etat: 1,
                        dateFin: 1
                    }).populate('offre freelancer').exec(function (err, contrats) {
                        res.render('employeur/contrats/list', {
                            currentRoute: 'contrats',
                            user: employeur,
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
    Employeur.findById(req.user.profil.ID).exec(function (err, employeur) {
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
                return res.redirect('/employeur/contrats');
            }
            Freelancer.aggregate([{
                "$match": {
                    _id: contrat.freelancer
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
            }], function (err, aggregatedFreelancer) {
                if (err) {
                    console.log(err.stack)
                    return next(err);
                }
                res.render('employeur/contrats/details', {
                    currentRoute: 'contrats',
                    user: employeur,
                    contrat: contrat,
                    freelancer: aggregatedFreelancer
                })
            })
        })

    })
});
Router.delete('/details/:id', function (req, res, next) {
    var ID = req.params.id;
    Contrat.findByIdAndRemove(ID, function (err, contrat) {
        if (err) {
            console.log(err.stack)
            return next(err);
        }
        Offre.findByIdAndUpdate(contrat.offre, {
            etat: "Ouverte",
            $pull: {
                postulants: contrat.freelancer
            }
        }, function (err, offre) {
            if (err) {
                console.log(err.stack)
                return next(err);
            }
            res.send({
                contrat: contrat,
                offre: offre
            })
        });
    })
});
module.exports = Router;